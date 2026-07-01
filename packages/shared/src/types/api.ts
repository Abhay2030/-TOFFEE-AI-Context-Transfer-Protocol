// ============================================================
// API Request/Response Types
// ============================================================

import type { ToffeeBundle, CompressionProfile, Platform } from '../schemas/toffeeBundle.js';

// ── Auth ─────────────────────────────────────────────────────

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  plan_tier: 'free' | 'pro' | 'team' | 'enterprise';
  mfa_enabled: boolean;
  created_at: string;
}

// ── Compression ──────────────────────────────────────────────

export interface CompressRequest {
  conversation: RawConversation;
  profile: CompressionProfile;
  maxTokens?: number;
}

export interface CompressResponse {
  bundle: ToffeeBundle;
  processingTimeMs: number;
  apiCostUsd: number;
}

// ── Raw Conversation (from capture) ──────────────────────────

export interface RawConversation {
  platform: Platform;
  model: string;
  sessionId?: string;
  capturedAt: string;
  turns: ConversationTurn[];
}

export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  metadata?: {
    hasCode?: boolean;
    hasTable?: boolean;
    hasMath?: boolean;
    hasImage?: boolean;
    language?: string;
  };
}

// ── Bundles ──────────────────────────────────────────────────

export interface BundleListResponse {
  bundles: BundleMetadata[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BundleMetadata {
  id: string;
  display_name: string;
  source_platform: Platform;
  compression_profile: CompressionProfile;
  token_count_original: number;
  token_count_bundle: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// ── Sharing ──────────────────────────────────────────────────

export interface ShareLinkRequest {
  bundleId: string;
  expiresInHours: number;
  password?: string;
  maxAccess?: number;
}

export interface ShareLinkResponse {
  shareUrl: string;
  token: string;
  expiresAt: string;
}

// ── Analytics ────────────────────────────────────────────────

export interface TokenUsageStats {
  totalTokensConsumed: number;
  totalTokensSaved: number;
  estimatedCostSavingsUsd: number;
  bundlesCreated: number;
  injectionsPerformed: number;
  byPlatform: Record<string, { consumed: number; saved: number }>;
  byMonth: Array<{ month: string; consumed: number; saved: number }>;
}

// ── Extension Messages ───────────────────────────────────────

export type ExtensionMessage =
  | { type: 'CAPTURE_REQUEST'; payload: { selective?: boolean } }
  | { type: 'CAPTURE_RESULT'; payload: RawConversation }
  | { type: 'CAPTURE_ERROR'; payload: { error: string; partial?: boolean } }
  | { type: 'INJECT_REQUEST'; payload: { bundleId: string; mode: 'auto' | 'manual' | 'clipboard' } }
  | { type: 'INJECT_RESULT'; payload: { tokensInjected: number; success: boolean } }
  | { type: 'PLATFORM_DETECTED'; payload: { platform: Platform; model?: string } }
  | { type: 'GET_LIBRARY'; payload: undefined }
  | { type: 'SYNC_STATUS'; payload: { syncing: boolean; lastSyncAt?: string } };
