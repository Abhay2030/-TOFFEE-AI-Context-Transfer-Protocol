// ============================================================
// Toffee Core — Token Budget Manager
// ============================================================

import type { ToffeeBundle } from '@toffee/shared';
import { TOKEN_LIMITS, type ModelTokenLimit } from '@toffee/shared';

export interface TokenBudgetConstraints {
  targetModel: string;
  userBudgetPercentage?: number; // e.g., 50% of context window
  maxAbsoluteTokens?: number;
}

/**
 * Optimizes a ToffeeBundle for injection by truncating non-essential parts
 * if it exceeds the available token budget for the target platform/model.
 */
export function optimizeBundleForInjection(
  bundle: ToffeeBundle,
  constraints: TokenBudgetConstraints
): {
  optimizedBundle: ToffeeBundle;
  tokensProjected: number;
  tokensTrimmed: number;
} {
  const modelLimit = Object.values(TOKEN_LIMITS).find((l: ModelTokenLimit) => l.modelName === constraints.targetModel);
  const maxContext = modelLimit?.maxContextWindow || 8192; // Default fallback

  const budgetRatio = constraints.userBudgetPercentage ? constraints.userBudgetPercentage / 100 : 0.5;
  let targetLimit = Math.floor(maxContext * budgetRatio);

  if (constraints.maxAbsoluteTokens && constraints.maxAbsoluteTokens < targetLimit) {
    targetLimit = constraints.maxAbsoluteTokens;
  }

  const currentTokens = bundle.token_count_bundle;

  if (currentTokens <= targetLimit) {
    return { optimizedBundle: bundle, tokensProjected: currentTokens, tokensTrimmed: 0 };
  }

  // Greedy trimming strategy:
  // 1. Remove raw excerpts
  // 2. Trim entities
  // 3. Trim topics
  // 4. Truncate conversation goal (last resort)

  const optimized = JSON.parse(JSON.stringify(bundle)) as ToffeeBundle;
  let trimmed = 0;

  if (optimized.summary.raw_excerpt) {
    trimmed += estimateTokens(JSON.stringify(optimized.summary.raw_excerpt));
    delete optimized.summary.raw_excerpt;
  }

  if (optimized.entities && (currentTokens - trimmed) > targetLimit) {
    const originalLen = optimized.entities.length;
    optimized.entities = optimized.entities.slice(0, Math.ceil(originalLen / 2));
    trimmed += estimateTokens('entities_trimmed'); // rough estimate
  }

  if (optimized.topics && (currentTokens - trimmed) > targetLimit) {
    optimized.topics = optimized.topics.slice(0, 3);
    trimmed += estimateTokens('topics_trimmed');
  }

  return {
    optimizedBundle: optimized,
    tokensProjected: currentTokens - trimmed,
    tokensTrimmed: trimmed,
  };
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
