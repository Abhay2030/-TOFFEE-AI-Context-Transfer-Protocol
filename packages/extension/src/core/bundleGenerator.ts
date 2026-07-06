// ============================================================
// Toffee Core — Bundle Generation
// ============================================================

import type { RawConversation, ToffeeBundle, Platform } from '@toffee/shared';
import type { CapturedConversation, StoredBundle } from '../db/database';
import { auth } from '../lib/firebase';
import { gzipString, uint8ArrayToBase64 } from './compression';
import { generateHMAC } from './crypto';

// Replace with actual API URL
const API_URL = 'https://toffee-backend.onrender.com/v1';

export interface GenerateOptions {
  profile: 'minimal' | 'standard' | 'full';
}

export async function generateToffeeBundle(
  conversation: CapturedConversation,
  options: GenerateOptions
): Promise<StoredBundle> {
  const user = auth.currentUser;
  let accessToken = null;
  if (user) {
    accessToken = await user.getIdToken();
  }

  const rawConversation: RawConversation = {
    platform: conversation.platform as Platform,
    model: conversation.model,
    capturedAt: conversation.capturedAt,
    turns: JSON.parse(conversation.turns),
  };

  let bundle: ToffeeBundle;
  let hmacSignature: string;

  if (navigator.onLine && accessToken) {
    // 1. Call Backend Compression Pipeline
    //    The server generates a proper HMAC using a secret key.
    //    We trust the server-returned bundle.hmac_sha256.
    const response = await fetch(`${API_URL}/compress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        conversation: rawConversation,
        profile: options.profile,
      }),
    });

    if (!response.ok) {
      throw new Error(`Compression API failed: ${response.statusText}`);
    }

    const data = await response.json();
    bundle = data.bundle;
    // Use the server-generated HMAC — signed with the per-user derived key
    hmacSignature = bundle.hmac_sha256;
  } else {
    // 2. Offline / No Auth Fallback (Minimal local compression)
    //    Generate a local HMAC using a key derived from a unique install ID + user UID.
    console.warn('[Toffee] Running offline minimal compression fallback');
    bundle = generateOfflineMinimalBundle(rawConversation);

    // Derive an offline signing key from the extension install ID and user UID.
    // This is not as secure as the server-side key, but prevents trivial forgery.
    const installId = await getOrCreateInstallId();
    const offlineKeyMaterial = `toffee-offline:${installId}:${user?.uid || 'anon'}`;
    const bundleJsonForSigning = JSON.stringify(bundle);
    hmacSignature = await generateHMAC(bundleJsonForSigning, offlineKeyMaterial);
    bundle.hmac_sha256 = hmacSignature;
  }

  // 3. Serialize and Compress
  const finalJsonString = JSON.stringify(bundle);
  const finalCompressedBytes = await gzipString(finalJsonString);
  let finalBundleDataB64 = uint8ArrayToBase64(finalCompressedBytes);

  // 3.5 Encrypt if user has configured an encryption password
  const { toffee_encryption_password } = await chrome.storage.local.get('toffee_encryption_password');
  if (toffee_encryption_password) {
    console.log('[Toffee] Encrypting bundle data with AES-256-GCM');
    const { deriveEncryptionKey, encryptData } = await import('@toffee/shared');
    const key = await deriveEncryptionKey(toffee_encryption_password);
    // Overwrite the base64 data with the encrypted string format (iv:ciphertext)
    finalBundleDataB64 = await encryptData(finalBundleDataB64, key);
  }

  // 4. Return StoredBundle format for Dexie
  return {
    id: bundle.bundle_id,
    displayName: bundle.display_name || `${bundle.source_platform} Conversation`,
    sourcePlatform: bundle.source_platform,
    sourceModel: bundle.source_model,
    compressionProfile: bundle.compression_profile,
    tokenCountOriginal: bundle.token_count_original,
    tokenCountBundle: bundle.token_count_bundle,
    compressionRatio: bundle.compression_ratio,
    tags: bundle.tags || [],
    bundleData: finalBundleDataB64,
    hmacSignature: hmacSignature,
    version: 1,
    createdAt: bundle.created_at,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Get or create a persistent install ID for this extension instance.
 * Used as part of the offline HMAC key derivation.
 */
async function getOrCreateInstallId(): Promise<string> {
  const stored = await chrome.storage.local.get('toffee_install_id');
  if (stored.toffee_install_id) {
    return stored.toffee_install_id;
  }
  const id = crypto.randomUUID();
  await chrome.storage.local.set({ toffee_install_id: id });
  return id;
}

function generateOfflineMinimalBundle(conversation: RawConversation): ToffeeBundle {
  const originalTokens = Math.ceil(conversation.turns.reduce((acc, t) => acc + t.content.length, 0) / 4);
  const summaryText = 'Offline generated summary. ' + conversation.turns[0]?.content.substring(0, 100);
  const bundleTokens = Math.ceil(summaryText.length / 4);

  return {
    schema_version: '1.0.0',
    bundle_id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    source_platform: conversation.platform as Platform,
    source_model: conversation.model,
    capture_method: 'dom_scrape',
    summary: {
      conversation_goal: summaryText,
      key_decisions: [],
      ongoing_tasks: [],
      user_preferences_inferred: 'None (Offline)',
      critical_context: 'Captured offline',
      suggested_continuation: '',
      knowledge_gaps: [],
    },
    topics: ['offline-capture'],
    snippet_count: conversation.turns.length,
    token_count_original: originalTokens,
    token_count_bundle: bundleTokens,
    compression_ratio: bundleTokens / originalTokens,
    compression_profile: 'minimal',
    version: 1,
    hmac_sha256: '0'.repeat(64), // temporary — replaced after signing
  };
}
