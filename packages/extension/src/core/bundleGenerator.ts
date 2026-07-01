// ============================================================
// Toffee Core — Bundle Generation
// ============================================================

import type { RawConversation, ToffeeBundle, Platform } from '@toffee/shared';
import type { CapturedConversation, StoredBundle } from '../db/dexie';
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

  if (navigator.onLine && accessToken) {
    // 1. Call Backend Compression Pipeline
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
  } else {
    // 2. Offline / No Auth Fallback (Minimal local compression)
    console.warn('[Toffee] Running offline minimal compression fallback');
    bundle = generateOfflineMinimalBundle(rawConversation);
  }

  // 3. Serialize and Compress
  const bundleJsonString = JSON.stringify(bundle);
  const compressedBytes = await gzipString(bundleJsonString);
  const bundleDataB64 = uint8ArrayToBase64(compressedBytes);

  // 4. Sign HMAC
  // For MVP, derive a key from a hardcoded extension secret + user ID (if available)
  const userSecret = user?.uid || 'anonymous_secret_key';
  const hmacSignature = await generateHMAC(bundleDataB64, userSecret);

  // Set the HMAC inside the uncompressed bundle for schema compliance
  // (In a real implementation, the backend or client would set this after generation)
  bundle.hmac_sha256 = hmacSignature;
  
  // Re-compress if we modified the JSON (for strict integrity checks)
  const finalJsonString = JSON.stringify(bundle);
  const finalCompressedBytes = await gzipString(finalJsonString);
  const finalBundleDataB64 = uint8ArrayToBase64(finalCompressedBytes);

  // 5. Return StoredBundle format for Dexie
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
    topics: [],
    snippet_count: conversation.turns.length,
    token_count_original: originalTokens,
    token_count_bundle: bundleTokens,
    compression_ratio: bundleTokens / originalTokens,
    compression_profile: 'minimal',
    version: 1,
    hmac_sha256: '', // Will be filled later
  };
}
