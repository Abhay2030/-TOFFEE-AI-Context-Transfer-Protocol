import { describe, it, expect } from 'vitest';
import { ToffeeBundleSchema } from '../schemas/toffeeBundle.js';

describe('ToffeeBundleSchema', () => {
  it('validates a correct bundle', () => {
    const validBundle = {
      schema_version: '1.0.0',
      bundle_id: '123e4567-e89b-12d3-a456-426614174000',
      created_at: new Date().toISOString(),
      source_platform: 'chatgpt',
      source_model: 'gpt-4o',
      capture_method: 'dom_scrape',
      summary: {
        conversation_goal: 'Write a test',
        key_decisions: ['Use vitest'],
        ongoing_tasks: [],
        user_preferences_inferred: 'Likes tests',
        critical_context: 'Testing is good',
        suggested_continuation: 'Write more tests',
        knowledge_gaps: [],
      },
      topics: ['testing'],
      entities: [],
      snippet_count: 5,
      token_count_original: 1000,
      token_count_bundle: 200,
      compression_ratio: 0.2,
      compression_profile: 'standard',
      version: 1,
      hmac_sha256: 'a'.repeat(64), // 64 char hex string
    };

    const result = ToffeeBundleSchema.safeParse(validBundle);
    expect(result.success).toBe(true);
  });

  it('fails validation on missing required fields', () => {
    const invalidBundle = {
      schema_version: '1.0.0',
      // missing bundle_id
    };

    const result = ToffeeBundleSchema.safeParse(invalidBundle);
    expect(result.success).toBe(false);
  });

  it('fails validation on invalid HMAC', () => {
    const invalidBundle = {
      schema_version: '1.0.0',
      bundle_id: '123e4567-e89b-12d3-a456-426614174000',
      created_at: new Date().toISOString(),
      source_platform: 'chatgpt',
      source_model: 'gpt-4o',
      capture_method: 'dom_scrape',
      summary: {
        conversation_goal: 'Write a test',
        key_decisions: ['Use vitest'],
        ongoing_tasks: [],
        user_preferences_inferred: 'Likes tests',
        critical_context: 'Testing is good',
        suggested_continuation: 'Write more tests',
        knowledge_gaps: [],
      },
      topics: ['testing'],
      entities: [],
      snippet_count: 5,
      token_count_original: 1000,
      token_count_bundle: 200,
      compression_ratio: 0.2,
      compression_profile: 'standard',
      version: 1,
      hmac_sha256: 'invalid-hmac', // invalid format
    };

    const result = ToffeeBundleSchema.safeParse(invalidBundle);
    expect(result.success).toBe(false);
  });
});
