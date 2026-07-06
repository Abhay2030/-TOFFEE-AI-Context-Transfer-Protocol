import { describe, it, expect } from 'vitest';
import { CreateBundleBodySchema, CompressBodySchema } from '../schemas/validation.js';

describe('Validation Schemas', () => {
  describe('CreateBundleBodySchema', () => {
    it('validates a correct payload', () => {
      const payload = {
        source_platform: 'chatgpt',
        source_model: 'gpt-4o',
        compression_profile: 'standard',
        token_count_original: 1000,
        token_count_bundle: 200,
        compression_ratio: 0.2,
        tags: ['test'],
        bundle_data: 'dGVzdA==', // 'test' in base64
      };
      const result = CreateBundleBodySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('fails if token counts are missing', () => {
      const payload = {
        source_platform: 'chatgpt',
        source_model: 'gpt-4o',
        compression_profile: 'standard',
        compression_ratio: 0.2,
        tags: ['test'],
        bundle_data: 'dGVzdA==',
      };
      const result = CreateBundleBodySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('CompressBodySchema', () => {
    it('validates a correct payload', () => {
      const payload = {
        conversation: {
          platform: 'chatgpt',
          model: 'gpt-4o',
          capturedAt: new Date().toISOString(),
          turns: [
            { role: 'user', content: 'hello' },
            { role: 'assistant', content: 'hi' },
          ],
        },
        profile: 'standard',
      };
      const result = CompressBodySchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('fails if turns are empty', () => {
      const payload = {
        conversation: {
          platform: 'chatgpt',
          model: 'gpt-4o',
          capturedAt: new Date().toISOString(),
          turns: [],
        },
      };
      const result = CompressBodySchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
