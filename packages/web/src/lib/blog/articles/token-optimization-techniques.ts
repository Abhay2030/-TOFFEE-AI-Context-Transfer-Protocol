import { Article } from '../types';
import { ABHAY_DONDE } from '../authors';

export const tokenOptimizationTechniques: Article = {
  slug: 'token-optimization-techniques',
  title: 'Token Optimization Techniques: Reducing LLM Costs and Maximizing Context Window Efficiency',
  description: 'Practical techniques for reducing token usage in AI applications — from prompt engineering and context pruning to semantic deduplication and budget-aware injection strategies.',
  publishedAt: '2026-06-25T10:00:00Z',
  updatedAt: '2026-07-25T10:00:00Z',
  author: ABHAY_DONDE,
  category: 'AI Research',
  tags: ['Token Optimization', 'LLM', 'Cost Reduction', 'Context Window', 'Prompt Engineering'],
  readingTime: '12 min read',
  featured: false,
  coverGradient: 'from-toffee-500/20 to-blue-500/20',
  relatedSlugs: ['semantic-compression-explained', 'complete-guide-ai-context-transfer', 'building-cross-ai-memory-systems'],
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction: Why Token Optimization Matters',
      level: 2,
      content: `<p>Every token sent to a large language model costs money, consumes context window space, and increases latency. GPT-4o charges $2.50 per million input tokens. A context transfer of 30,000 tokens costs $0.075. Across 10,000 daily active users averaging 3 transfers, the annual input cost exceeds $82,000.</p>
<p>Token optimization is also about <strong>quality</strong>. Research demonstrates that models lose track of information in the middle of long contexts — the "lost in the middle" effect. By reducing context size, you improve the model's ability to use the context you provide.</p>`
    },
    {
      id: 'understanding-tokenization',
      heading: 'Understanding Tokenization',
      level: 2,
      content: `<p>Modern LLMs use subword tokenization (Byte Pair Encoding or SentencePiece). Key facts:</p>
<ul>
<li>Average English word ≈ 1.3 tokens</li>
<li>Technical terms get split: "PostgreSQL" → ["Post", "gre", "SQL"] (3 tokens)</li>
<li>Code is token-dense: variable names, operators, syntax each consume tokens</li>
<li>JSON is highly token-inefficient due to structural characters</li>
</ul>
<table>
<thead><tr><th>Format</th><th>Tokens (3 records)</th><th>Reduction</th></tr></thead>
<tbody>
<tr><td>JSON</td><td>42</td><td>Baseline</td></tr>
<tr><td>YAML</td><td>31</td><td>26%</td></tr>
<tr><td>TSV</td><td>18</td><td>57%</td></tr>
<tr><td>Compressed prose</td><td>14</td><td>67%</td></tr>
</tbody>
</table>`
    },
    {
      id: 'prompt-level-optimization',
      heading: 'Prompt-Level Optimization Techniques',
      level: 2,
      content: `<h3 id="technique-instruction-compression">Technique 1: Instruction Compression</h3>
<pre><code class="language-text">// Before: 47 tokens
You are a helpful AI assistant. When the user asks you a question,
you should provide a detailed, accurate, and helpful response.

// After: 18 tokens  
Role: Technical assistant. Provide precise, example-rich answers.</code></pre>
<p>The compressed version conveys the same instructions in 62% fewer tokens.</p>
<h3 id="technique-few-shot-reduction">Technique 2: Few-Shot Example Pruning</h3>
<p>Often 1-2 examples suffice. Going from 5 to 2 examples can save thousands of tokens. Use minimal examples that demonstrate the pattern, not comprehensive ones.</p>
<h3 id="technique-structured-output">Technique 3: Request Structured Output</h3>
<p>Requesting tables or bullet points instead of prose produces responses with the same information density in 60% fewer tokens.</p>`
    },
    {
      id: 'context-pruning',
      heading: 'Context Pruning Strategies',
      level: 2,
      content: `<h3 id="strategy-sliding-window">Strategy 1: Sliding Window</h3>
<p>Include only the N most recent messages. Simple but loses foundational context.</p>
<h3 id="strategy-pinned-messages">Strategy 2: Pinned + Recent</h3>
<p>Pin the first 2-3 messages (project setup) and include the last N messages:</p>
<pre><code class="language-typescript">function selectMessages(messages: Message[], maxTokens: number): Message[] {
  const pinned = messages.slice(0, 3);
  const recent = messages.slice(-10);
  let selected = [...pinned, ...recent];
  let totalTokens = countTokens(selected);
  while (totalTokens > maxTokens && selected.length > 3) {
    selected.splice(3, 1);
    totalTokens = countTokens(selected);
  }
  return selected;
}</code></pre>
<h3 id="strategy-semantic-pruning">Strategy 3: Semantic Pruning</h3>
<p>Score each message by information value. Decisions and entity definitions score high. Conversational filler ("thanks!", "got it") scores zero. This achieves the best compression ratios by eliminating low-value content regardless of position.</p>`
    },
    {
      id: 'adaptive-injection',
      heading: 'Adaptive Token Budget Injection',
      level: 2,
      content: `<p>When transferring context to a different model, adapt the injected context to fit the target's capacity:</p>
<pre><code class="language-typescript">const MODEL_CONSTRAINTS: Record&lt;string, { maxInput: number; reserveOutput: number }&gt; = {
  'gpt-4o':            { maxInput: 120000, reserveOutput: 8000 },
  'claude-3.5-sonnet': { maxInput: 190000, reserveOutput: 10000 },
  'gemini-1.5-pro':    { maxInput: 990000, reserveOutput: 10000 },
};

function budgetAwareInjection(bundle: ToffeeBundle, targetModel: string): string {
  const constraints = MODEL_CONSTRAINTS[targetModel];
  const available = constraints.maxInput - constraints.reserveOutput - 500;
  if (bundle.metrics.compressed_tokens <= available) return bundle.compressed_context;
  return truncateByPriority(bundle, available);
}</code></pre>
<p>The <code>truncateByPriority</code> function removes lowest-priority information first until the bundle fits. Core decisions, entities, and preferences are the last to be removed.</p>`
    },
    {
      id: 'code-optimization',
      heading: 'Code-Specific Token Optimization',
      level: 2,
      content: `<h3 id="code-minification">Selective Minification</h3>
<p>Reduce indentation, remove blank lines, collapse single-statement blocks:</p>
<pre><code class="language-typescript">// Before: 45 tokens
async function fetchUser(id: string): Promise&lt;User&gt; {
    const response = await fetch('/api/users/' + id);
    if (!response.ok) {
        throw new Error('User not found');
    }
    const data = await response.json();
    return data as User;
}

// After: 31 tokens (31% reduction)
async function fetchUser(id: string): Promise&lt;User&gt; {
  const res = await fetch('/api/users/' + id);
  if (!res.ok) throw new Error('User not found');
  return await res.json() as User;
}</code></pre>
<h3 id="comment-stripping">Comment Stripping</h3>
<p>Preserve comments that explain <em>why</em>. Strip comments that describe <em>what</em> (when the code is self-explanatory).</p>`
    },
    {
      id: 'measuring-optimization',
      heading: 'Measuring Optimization Effectiveness',
      level: 2,
      content: `<p>Track these metrics:</p>
<ul>
<li><strong>Compression ratio:</strong> (original - compressed) / original</li>
<li><strong>Reconstruction accuracy:</strong> Can a fresh session answer questions using only the compressed context?</li>
<li><strong>Task completion rate:</strong> Can the model continue work without asking for clarification?</li>
<li><strong>Cost per transfer:</strong> Actual API cost of compression + injection</li>
</ul>
<p>The sweet spot is 60-70% compression. Below 60%, savings are insufficient. Above 75%, you risk losing important context. The optimal point varies by conversation type and target model.</p>`
    }
  ],
  faqs: [
    { question: 'How many tokens does an average AI conversation use?', answer: 'A typical 30-minute conversation produces 15,000 to 35,000 tokens, depending on complexity. Software development sessions are on the higher end due to code blocks.' },
    { question: 'What is the "lost in the middle" effect?', answer: 'Research shows models are better at recalling information at the beginning and end of their context window, but less accurate with middle content. Shorter, well-organized context often produces better results.' },
    { question: 'Does reducing tokens always improve response quality?', answer: 'Not always. Removing too much context leaves the model without enough information. The goal is removing redundant and low-value tokens while preserving high-value information.' }
  ]
};
