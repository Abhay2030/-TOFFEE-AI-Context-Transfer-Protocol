// ============================================================
// API Route Validation Schemas
// Centralized Zod schemas for all Fastify route inputs
// ============================================================

import { z } from 'zod';
import { PlatformEnum, CompressionProfileEnum } from '@toffee/shared';

// ── Common ───────────────────────────────────────────────────

export const UuidParamsSchema = z.object({
  id: z.string().uuid('Invalid bundle ID format'),
});

// ── Auth ─────────────────────────────────────────────────────
// (Auth routes use Firebase token — no body validation needed for /me and /sync)

// ── Bundles ──────────────────────────────────────────────────

export const BundleListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  tag: z.string().max(100).optional(),
  search: z.string().max(200).optional(),
});

export const CreateBundleBodySchema = z.object({
  display_name: z.string().max(255).optional(),
  source_platform: z.string().min(1).max(50),
  source_model: z.string().min(1).max(100),
  compression_profile: CompressionProfileEnum.default('standard'),
  token_count_original: z.number().int().min(1),
  token_count_bundle: z.number().int().min(1),
  compression_ratio: z.number().min(0).max(1),
  tags: z.array(z.string().max(50)).max(20).default([]),
  bundle_data: z.string().min(1).max(10_000_000), // Max ~10MB base64
});

// ── Compression ──────────────────────────────────────────────

const ConversationTurnSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1).max(500_000),
  timestamp: z.string().optional(),
  metadata: z.object({
    hasCode: z.boolean().optional(),
    hasTable: z.boolean().optional(),
    hasMath: z.boolean().optional(),
    hasImage: z.boolean().optional(),
    language: z.string().optional(),
  }).optional(),
});

const RawConversationSchema = z.object({
  platform: PlatformEnum,
  model: z.string().min(1).max(100),
  sessionId: z.string().optional(),
  capturedAt: z.string(),
  turns: z.array(ConversationTurnSchema).min(1).max(5000),
});

export const CompressBodySchema = z.object({
  conversation: RawConversationSchema,
  profile: CompressionProfileEnum.default('standard'),
  maxTokens: z.number().int().min(100).max(100_000).optional(),
});

// ── Sharing ──────────────────────────────────────────────────

export const CreateShareBodySchema = z.object({
  expiresInHours: z.number().int().min(1).max(720).default(24), // max 30 days
  password: z.string().min(4).max(128).optional(),
  maxAccess: z.number().int().min(1).max(10_000).default(100),
});

export const ShareAccessQuerySchema = z.object({
  password: z.string().max(128).optional(),
});

export const ShareTokenParamsSchema = z.object({
  token: z.string().length(64, 'Invalid share token format'),
});

// ── Contact ──────────────────────────────────────────────────

export const ContactFormBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address').max(255),
  topic: z.string().min(1, 'Topic is required').max(255),
  message: z.string().min(1, 'Message is required').max(10000),
});
