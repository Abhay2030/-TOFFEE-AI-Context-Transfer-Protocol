// ============================================================
// Compression Profile Constants
// ============================================================

import type { CompressionProfile } from '../schemas/toffeeBundle.js';

export interface CompressionProfileConfig {
  id: CompressionProfile;
  label: string;
  description: string;
  maxOutputTokens: number;
  minCompressionRatio: number;
  minRougeL: number;
  minEntityRecall: number;
  minGoalCapture: number;
  maxProcessingTimeMs: number;
  estimatedApiCostUsd: number;
  llmModel: 'haiku' | 'sonnet';
  temperature: number;
}

export const COMPRESSION_PROFILES: Record<CompressionProfile, CompressionProfileConfig> = {
  minimal: {
    id: 'minimal',
    label: 'Minimal',
    description: '≤1K tokens — Quick transfer with core intent only',
    maxOutputTokens: 1_024,
    minCompressionRatio: 0.85,
    minRougeL: 0.55,
    minEntityRecall: 0.75,
    minGoalCapture: 0.80,
    maxProcessingTimeMs: 3_000,
    estimatedApiCostUsd: 0.001,
    llmModel: 'haiku',
    temperature: 0.1,
  },
  standard: {
    id: 'standard',
    label: 'Standard',
    description: '≤4K tokens — Balanced context with decisions & preferences',
    maxOutputTokens: 4_096,
    minCompressionRatio: 0.70,
    minRougeL: 0.72,
    minEntityRecall: 0.88,
    minGoalCapture: 0.90,
    maxProcessingTimeMs: 5_000,
    estimatedApiCostUsd: 0.005,
    llmModel: 'haiku',
    temperature: 0.2,
  },
  full: {
    id: 'full',
    label: 'Full',
    description: '≤16K tokens — Complete context with excerpts & entity graph',
    maxOutputTokens: 16_384,
    minCompressionRatio: 0.40,
    minRougeL: 0.88,
    minEntityRecall: 0.95,
    minGoalCapture: 0.97,
    maxProcessingTimeMs: 15_000,
    estimatedApiCostUsd: 0.02,
    llmModel: 'sonnet',
    temperature: 0.2,
  },
};
