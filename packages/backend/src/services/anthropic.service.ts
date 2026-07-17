import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

// We initialize the client inside a getter or lazily so it doesn't crash if the key is missing at boot
let anthropicClient: Anthropic | null = null;

export function getAnthropic() {
  if (!anthropicClient && env.ANTHROPIC_API_KEY) {
    anthropicClient = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export interface CompressionResult {
  topics: string[];
  entities: {
    name: string;
    type: 'person' | 'organization' | 'concept' | 'product' | 'project' | 'tool' | 'url' | 'location' | 'other';
    mentions: number;
  }[];
  intent: {
    primaryGoal: string;
    criticalContext: string;
    suggestedContinuation: string;
    knowledgeGaps: string[];
  };
  decisions: string[];
  tasks: string[];
  preferences: {
    summary: string;
  };
}

export async function compressConversationLLM(transcript: string): Promise<CompressionResult> {
  const client = getAnthropic();

  // ──────────────────────────────────────────────────────────
  // 🚀 FALLBACK MOCK MODE
  // If the user doesn't have an API key configured, we automatically
  // return a highly structured mock response so the platform 
  // can still be fully tested end-to-end.
  // ──────────────────────────────────────────────────────────
  if (!client) {
    console.warn("⚠️ No ANTHROPIC_API_KEY found. Using dynamic pass-through mock compression for testing.");
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a dynamic mock based on the actual transcript
    const cleanTranscript = transcript.trim();
    const preview = cleanTranscript.substring(0, 80).replace(/\n/g, ' ') + '...';

    return {
      topics: [],
      entities: [],
      intent: {
        primaryGoal: "Resume conversation context.",
        criticalContext: cleanTranscript,
        suggestedContinuation: "",
        knowledgeGaps: []
      },
      decisions: [],
      tasks: [],
      preferences: {
        summary: ""
      }
    };
  }

  const toolName = "extract_conversation_summary";

  const response = await client.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 2000,
    temperature: 0.2,
    system: "You are an expert AI extraction system. Your job is to analyze transcripts of conversations between a human and an AI, and extract structured metadata that perfectly captures the context, state, and facts of the conversation so that it can be seamlessly resumed on a different AI platform later.",
    messages: [
      {
        role: "user",
        content: `Please analyze the following conversation transcript and extract the requested structured metadata using the tool provided.\n\n<transcript>\n${transcript}\n</transcript>`
      }
    ],
    tools: [
      {
        name: toolName,
        description: "Extract structured summary data from the conversation.",
        input_schema: {
          type: "object",
          properties: {
            topics: {
              type: "array",
              items: { type: "string" },
              description: "Up to 10 main topics discussed in the conversation."
            },
            entities: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  type: { type: "string", enum: ["person", "organization", "concept", "product", "project", "tool", "url", "location", "other"] },
                  mentions: { type: "number" }
                },
                required: ["name", "type", "mentions"]
              },
              description: "Key entities (people, orgs, concepts) mentioned."
            },
            intent: {
              type: "object",
              properties: {
                primaryGoal: { type: "string", description: "The user's primary goal in the conversation." },
                criticalContext: { type: "string", description: "Any critical context the AI needs to know to resume." },
                suggestedContinuation: { type: "string", description: "How the conversation should logically continue." },
                knowledgeGaps: {
                  type: "array",
                  items: { type: "string" },
                  description: "Questions the AI was asked but didn't fully answer, or missing information."
                }
              },
              required: ["primaryGoal", "criticalContext", "suggestedContinuation", "knowledgeGaps"]
            },
            decisions: {
              type: "array",
              items: { type: "string" },
              description: "Any definitive decisions or conclusions made."
            },
            tasks: {
              type: "array",
              items: { type: "string" },
              description: "Any pending or ongoing tasks mentioned."
            },
            preferences: {
              type: "object",
              properties: {
                summary: { type: "string", description: "Summary of any user preferences (e.g., tone, formatting, constraints) inferred." }
              },
              required: ["summary"]
            }
          },
          required: ["topics", "entities", "intent", "decisions", "tasks", "preferences"]
        }
      }
    ],
    tool_choice: { type: "tool", name: toolName }
  });

  const toolBlock = response.content.find(c => c.type === 'tool_use' && c.name === toolName);

  if (!toolBlock || toolBlock.type !== 'tool_use') {
    throw new Error("Model did not return the expected tool call");
  }

  // The Anthropic SDK automatically parses the input into a record
  return toolBlock.input as unknown as CompressionResult;
}
