// ============================================================
// Toffee Core — Injection Engine
// ============================================================

import type { ToffeeBundle } from '@toffee/shared';
import { optimizeBundleForInjection, type TokenBudgetConstraints } from './tokenOptimizer';

export interface InjectionContext {
  bundle: ToffeeBundle;
  targetPlatform: string;
  targetModel: string;
  mode: 'auto' | 'manual' | 'clipboard';
  constraints?: TokenBudgetConstraints;
}

export async function processInjection(context: InjectionContext): Promise<{
  formattedPrompt: string;
  tokens: number;
}> {
  // 1. Optimize bundle size
  const constraints = context.constraints || { targetModel: context.targetModel };
  const { optimizedBundle, tokensProjected } = optimizeBundleForInjection(context.bundle, constraints);

  // Token Safety Check
  const MAX_SAFE_TOKENS = (constraints as any).maxTokens || 128000; // Default fallback
  if (tokensProjected > MAX_SAFE_TOKENS) {
    throw new Error(`Token limit exceeded: The optimized bundle requires ${tokensProjected} tokens, but the target model only supports ${MAX_SAFE_TOKENS}. Please truncate the conversation manually before injecting.`);
  }

  // 2. Format as a prompt template
  const prompt = formatBundleAsPrompt(optimizedBundle, context.targetPlatform);

  return {
    formattedPrompt: prompt,
    tokens: tokensProjected,
  };
}

function formatBundleAsPrompt(bundle: ToffeeBundle, targetPlatform: string): string {
  // Simple markdown template. In production, this would use templates/ per platform.
  return `[Toffee Context Injection - Target: ${targetPlatform}]
The following is preserved memory from a previous conversation on ${bundle.source_platform}. 
Please ingest this context before answering my next question.

# Goal
${bundle.summary.conversation_goal}

# Key Decisions
${bundle.summary.key_decisions.map(d => `- ${d}`).join('\n')}

# Ongoing Tasks
${bundle.summary.ongoing_tasks.map(t => `- ${t}`).join('\n')}

# User Preferences
${bundle.summary.user_preferences_inferred}

# Critical Context
${bundle.summary.critical_context}

Please acknowledge receipt of this context with a brief "Context loaded. Ready to proceed."`;
}
