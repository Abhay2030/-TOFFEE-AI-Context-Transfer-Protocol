// ============================================================
// @toffee/shared — Root Entry Point
// ============================================================

// Schemas
export {
  ToffeeBundleSchema,
  ToffeeSummarySchema,
  EntitySchema,
  PreferencesSchema,
  PlatformEnum,
  CaptureMethodEnum,
  CompressionProfileEnum,
} from './schemas/index.js';

export type {
  ToffeeBundle,
  ToffeeSummary,
  ToffeeEntity,
  ToffeePreferences,
  Platform,
  CaptureMethod,
  CompressionProfile,
} from './schemas/index.js';

// Constants
export {
  PLATFORMS,
  getAllHostPatterns,
  getPlatformByHost,
  COMPRESSION_PROFILES,
  TOKEN_LIMITS,
  DEFAULT_TOKEN_BUDGET,
  MIN_TOKEN_BUDGET,
  MAX_TOKEN_BUDGET,
  MAX_TOFFEE_FILE_SIZE_BYTES,
  MAX_COMPRESSED_BUNDLE_SIZE_BYTES,
  TOFFEE_MAGIC_BYTES,
} from './constants/index.js';

export type {
  PlatformConfig,
  CompressionProfileConfig,
  ModelTokenLimit,
} from './constants/index.js';

// Types
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  UserProfile,
  CompressRequest,
  CompressResponse,
  RawConversation,
  ConversationTurn,
  BundleListResponse,
  BundleMetadata,
  ShareLinkRequest,
  ShareLinkResponse,
  TokenUsageStats,
  ExtensionMessage,
} from './types/index.js';
