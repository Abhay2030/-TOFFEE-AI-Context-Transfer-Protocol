// ============================================================
// Toffee Bundle Schema v1.0.0
// Core IP — Defines the .toffee file format
// ============================================================

import { z } from 'zod';

// ── Sub-schemas ──────────────────────────────────────────────

/**
 * ToffeeSummary: AI-generated semantic summary of a conversation.
 * This is the heart of the compression output.
 */
export const ToffeeSummarySchema = z.object({
  /** Primary goal or purpose the user was trying to achieve */
  conversation_goal: z.string().min(1),

  /** Significant decisions, conclusions, or answers reached */
  key_decisions: z.array(z.string()).default([]),

  /** Tasks or projects that are in-progress and need continuation */
  ongoing_tasks: z.array(z.string()).default([]),

  /** Communication style, technical depth, preferred format */
  user_preferences_inferred: z.string().default(''),

  /** Essential background information the target AI must know */
  critical_context: z.string().min(1),

  /** AI-generated suggestion for how to continue productively */
  suggested_continuation: z.string().default(''),

  /** Things the user was trying to figure out but didn't fully resolve */
  knowledge_gaps: z.array(z.string()).default([]),

  /** Optional verbatim quotes from the most important moments */
  raw_excerpt: z.array(z.string()).max(5).optional(),
});

/**
 * Entity: A named entity extracted from conversation context.
 */
export const EntitySchema = z.object({
  name: z.string().min(1),
  type: z.enum(['person', 'organization', 'concept', 'product', 'project', 'tool', 'url', 'location', 'other']),
  mentions: z.number().int().min(1),
  context: z.string().optional(),
  relationships: z
    .array(
      z.object({
        target: z.string(),
        relation: z.string(),
      })
    )
    .optional(),
});

/**
 * User preferences inferred from conversation patterns.
 */
export const PreferencesSchema = z.object({
  communication_style: z.string().optional(),
  expertise_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  preferred_language: z.string().optional(),
  preferred_format: z.enum(['concise', 'detailed', 'code-heavy', 'conversational']).optional(),
  tone: z.enum(['formal', 'casual', 'technical', 'friendly']).optional(),
  custom: z.record(z.string()).optional(),
});

// ── Supported Platform Enum ──────────────────────────────────

export const PlatformEnum = z.enum([
  'chatgpt',
  'claude',
  'gemini',
  'copilot',
  'grok',
  'perplexity',
  'meta_ai',
  'mistral',
  'toffee-stitched',
  'other',
]);

export const CaptureMethodEnum = z.enum(['dom_scrape', 'api_intercept', 'manual_paste']);

export const CompressionProfileEnum = z.enum(['minimal', 'standard', 'full']);

// ── Root Toffee Bundle Schema ────────────────────────────────

/**
 * ToffeeBundleSchema v1.0.0
 *
 * The complete schema for a .toffee file payload.
 * After GZIP compression and optional AES-256-GCM encryption,
 * this JSON is prefixed with the Toffee magic bytes header.
 */
export const ToffeeBundleSchema = z.object({
  /** SemVer string controlling parsing behavior */
  schema_version: z.string().regex(/^\d+\.\d+\.\d+$/).default('1.0.0'),

  /** Globally unique identifier for this bundle */
  bundle_id: z.string().uuid(),

  /** Bundle creation timestamp (UTC, ISO 8601) */
  created_at: z.string().datetime(),

  /** Platform from which conversation was captured */
  source_platform: PlatformEnum,

  /** Model used in source conversation (e.g., "gpt-4o-2024-11-20") */
  source_model: z.string().min(1),

  /** Method used to capture conversation data */
  capture_method: CaptureMethodEnum,

  /** AI-generated semantic summary */
  summary: ToffeeSummarySchema,

  /** Key topic strings extracted from the conversation */
  topics: z.array(z.string()).min(1),

  /** Named entities with optional relationship graph */
  entities: z.array(EntitySchema).optional(),

  /** Inferred user preferences */
  user_preferences: PreferencesSchema.optional(),

  /** Total conversation turns in original capture */
  snippet_count: z.number().int().min(1),

  /** Estimated token count of full raw conversation */
  token_count_original: z.number().int().min(1),

  /** Token count of this bundle (post-compression) */
  token_count_bundle: z.number().int().min(1),

  /** Compression ratio: token_count_bundle / token_count_original */
  compression_ratio: z.number().min(0).max(1),

  /** Compression profile used */
  compression_profile: CompressionProfileEnum,

  /** Hex-encoded HMAC-SHA256 signature of the payload */
  hmac_sha256: z.string().regex(/^[a-f0-9]{64}$/),

  /** Owner user ID (null for anonymous bundles) */
  user_id: z.string().uuid().optional(),

  /** User-assigned tags for library organization */
  tags: z.array(z.string()).optional(),

  /** User-defined human-readable bundle name */
  display_name: z.string().max(255).optional(),

  /** Parent bundle ID for versioning */
  parent_bundle_id: z.string().uuid().optional(),

  /** Bundle version number (incremented on edits) */
  version: z.number().int().min(1).default(1),
});

// ── Inferred TypeScript Types ────────────────────────────────

export type ToffeeBundle = z.infer<typeof ToffeeBundleSchema>;
export type ToffeeSummary = z.infer<typeof ToffeeSummarySchema>;
export type ToffeeEntity = z.infer<typeof EntitySchema>;
export type ToffeePreferences = z.infer<typeof PreferencesSchema>;
export type Platform = z.infer<typeof PlatformEnum>;
export type CaptureMethod = z.infer<typeof CaptureMethodEnum>;
export type CompressionProfile = z.infer<typeof CompressionProfileEnum>;
