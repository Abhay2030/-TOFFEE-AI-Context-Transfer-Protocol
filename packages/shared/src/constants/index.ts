export { PLATFORMS, getAllHostPatterns, getPlatformByHost } from './platforms.js';
export type { PlatformConfig } from './platforms.js';

export { COMPRESSION_PROFILES } from './compressionProfiles.js';
export type { CompressionProfileConfig } from './compressionProfiles.js';

export {
  TOKEN_LIMITS,
  DEFAULT_TOKEN_BUDGET,
  MIN_TOKEN_BUDGET,
  MAX_TOKEN_BUDGET,
  MAX_TOFFEE_FILE_SIZE_BYTES,
  MAX_COMPRESSED_BUNDLE_SIZE_BYTES,
  TOFFEE_MAGIC_BYTES,
  TOFFEE_SCHEMA_VERSION_MAJOR,
  TOFFEE_SCHEMA_VERSION_MINOR,
} from './tokenLimits.js';
export type { ModelTokenLimit } from './tokenLimits.js';
