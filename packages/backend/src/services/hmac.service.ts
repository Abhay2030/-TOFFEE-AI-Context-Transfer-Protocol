// ============================================================
// HMAC Service — Server-side Bundle Signing & Verification
// ============================================================

import crypto from 'crypto';
import { env } from '../config/env.js';

/**
 * Derive a per-user signing key from the master HMAC secret.
 * This ensures each user's bundles are signed with a unique key,
 * so compromising one user's key doesn't affect others.
 */
export function deriveUserKey(userId: string): Buffer {
  return crypto
    .createHmac('sha256', env.HMAC_SECRET)
    .update(userId)
    .digest();
}

/**
 * Generate an HMAC-SHA256 signature for bundle data.
 * Uses a per-user derived key from the master HMAC_SECRET.
 */
export function signBundle(bundleJson: string, userId: string): string {
  const key = deriveUserKey(userId);
  return crypto
    .createHmac('sha256', key)
    .update(bundleJson)
    .digest('hex');
}

/**
 * Verify an HMAC-SHA256 signature for bundle data.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyBundle(bundleJson: string, signatureHex: string, userId: string): boolean {
  const expectedSignature = signBundle(bundleJson, userId);

  // Constant-time comparison
  if (expectedSignature.length !== signatureHex.length) return false;

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signatureHex, 'hex')
  );
}
