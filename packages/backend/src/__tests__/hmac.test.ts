import { describe, it, expect, vi } from 'vitest';
import { deriveUserKey, signBundle, verifyBundle } from '../services/hmac.service.js';

// Mock env
vi.mock('../config/env.js', () => ({
  env: {
    HMAC_SECRET: 'test-secret-key-that-is-at-least-32-chars-long',
  },
}));

describe('HMAC Service', () => {
  const userId = 'user_123';
  const bundleJson = JSON.stringify({ some: 'data', value: 42 });

  it('derives a consistent user key', () => {
    const key1 = deriveUserKey(userId);
    const key2 = deriveUserKey(userId);
    expect(key1.toString('hex')).toBe(key2.toString('hex'));
  });

  it('derives different keys for different users', () => {
    const key1 = deriveUserKey(userId);
    const key2 = deriveUserKey('user_456');
    expect(key1.toString('hex')).not.toBe(key2.toString('hex'));
  });

  it('generates and verifies a signature successfully', () => {
    const signature = signBundle(bundleJson, userId);
    expect(typeof signature).toBe('string');
    expect(signature.length).toBe(64); // SHA-256 hex is 64 chars

    const isValid = verifyBundle(bundleJson, signature, userId);
    expect(isValid).toBe(true);
  });

  it('fails verification with wrong signature', () => {
    const signature = signBundle(bundleJson, userId);
    const badSignature = signature.substring(0, 63) + (signature.endsWith('a') ? 'b' : 'a');
    
    const isValid = verifyBundle(bundleJson, badSignature, userId);
    expect(isValid).toBe(false);
  });

  it('fails verification with wrong user id', () => {
    const signature = signBundle(bundleJson, userId);
    const isValid = verifyBundle(bundleJson, signature, 'user_wrong');
    expect(isValid).toBe(false);
  });

  it('fails verification with tampered bundle data', () => {
    const signature = signBundle(bundleJson, userId);
    const tamperedBundle = JSON.stringify({ some: 'data', value: 43 });
    const isValid = verifyBundle(tamperedBundle, signature, userId);
    expect(isValid).toBe(false);
  });
});
