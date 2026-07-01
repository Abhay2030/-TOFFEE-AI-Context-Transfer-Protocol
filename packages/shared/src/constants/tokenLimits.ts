// ============================================================
// Token Limits per AI Model
// ============================================================

export interface ModelTokenLimit {
  modelName: string;
  platform: string;
  maxContextWindow: number;
  maxOutputTokens: number;
  encoding: string;
}

export const TOKEN_LIMITS: Record<string, ModelTokenLimit> = {
  'gpt-4o': {
    modelName: 'GPT-4o',
    platform: 'chatgpt',
    maxContextWindow: 128_000,
    maxOutputTokens: 16_384,
    encoding: 'o200k_base',
  },
  'gpt-4o-mini': {
    modelName: 'GPT-4o mini',
    platform: 'chatgpt',
    maxContextWindow: 128_000,
    maxOutputTokens: 16_384,
    encoding: 'o200k_base',
  },
  'claude-sonnet-4-20250514': {
    modelName: 'Claude Sonnet 4',
    platform: 'claude',
    maxContextWindow: 200_000,
    maxOutputTokens: 16_000,
    encoding: 'claude',
  },
  'claude-3-5-haiku-20241022': {
    modelName: 'Claude 3.5 Haiku',
    platform: 'claude',
    maxContextWindow: 200_000,
    maxOutputTokens: 8_192,
    encoding: 'claude',
  },
  'gemini-2.5-pro': {
    modelName: 'Gemini 2.5 Pro',
    platform: 'gemini',
    maxContextWindow: 1_000_000,
    maxOutputTokens: 65_536,
    encoding: 'gemini',
  },
  'grok-3': {
    modelName: 'Grok 3',
    platform: 'grok',
    maxContextWindow: 131_072,
    maxOutputTokens: 16_384,
    encoding: 'grok',
  },
};

/**
 * Default token budget for injection (per SRS: 4,096 default, up to 16,384).
 */
export const DEFAULT_TOKEN_BUDGET = 4_096;
export const MIN_TOKEN_BUDGET = 100;
export const MAX_TOKEN_BUDGET = 128_000;

/**
 * Max .toffee file size limits.
 */
export const MAX_TOFFEE_FILE_SIZE_BYTES = 500 * 1024; // 500KB
export const MAX_COMPRESSED_BUNDLE_SIZE_BYTES = 50 * 1024; // 50KB

/**
 * Toffee file magic bytes.
 */
export const TOFFEE_MAGIC_BYTES = new Uint8Array([0x54, 0x4f, 0x46, 0x46]); // "TOFF"
export const TOFFEE_SCHEMA_VERSION_MAJOR = 1;
export const TOFFEE_SCHEMA_VERSION_MINOR = 0;
