// ============================================================
// Toffee Cloud Sync Engine — Bidirectional Push/Pull/Delete
/* global RequestInit */
// ============================================================

import { db, type StoredBundle, type SyncQueueItem } from '../db/database';
import { v4 as uuid } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'https://toffee-backend.onrender.com/v1';

// ── Helpers ──────────────────────────────────────────────────

async function isCloudSyncEnabled(): Promise<boolean> {
  const result = await chrome.storage.local.get('toffee_settings');
  return result.toffee_settings?.cloudSync === true;
}

async function getFirebaseToken(): Promise<string | null> {
  try {
    const { auth } = await import('../lib/firebase');
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch {
    return null;
  }
}

async function apiRequest(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
}

// ── Sync Status Tracking ─────────────────────────────────────

let _isSyncing = false;
let _lastSyncAt: string | null = null;

export function getSyncStatus() {
  return { syncing: _isSyncing, lastSyncAt: _lastSyncAt };
}

// ── Main Sync Orchestrator ───────────────────────────────────

export async function runFullSync(): Promise<{ pushed: number; pulled: number; deleted: number; errors: string[] }> {
  // Gate: respect the user's Cloud Sync toggle
  const enabled = await isCloudSyncEnabled();
  if (!enabled) {
    console.log('[Toffee Sync] Cloud Sync is disabled. Skipping.');
    return { pushed: 0, pulled: 0, deleted: 0, errors: [] };
  }

  if (!navigator.onLine) {
    console.log('[Toffee Sync] Offline. Skipping.');
    return { pushed: 0, pulled: 0, deleted: 0, errors: ['Device is offline'] };
  }

  const token = await getFirebaseToken();
  if (!token) {
    console.log('[Toffee Sync] No authenticated user. Skipping.');
    return { pushed: 0, pulled: 0, deleted: 0, errors: ['Not authenticated'] };
  }

  if (_isSyncing) {
    console.log('[Toffee Sync] Already syncing. Skipping.');
    return { pushed: 0, pulled: 0, deleted: 0, errors: ['Sync already in progress'] };
  }

  _isSyncing = true;
  const errors: string[] = [];

  try {
    console.log('[Toffee Sync] Starting full bidirectional sync...');

    // 1. Process delete queue first
    const deleted = await processDeleteQueue(token, errors);

    // 2. Push local bundles that don't exist on remote
    const pushed = await pushLocalBundles(token, errors);

    // 3. Pull remote bundles that don't exist locally
    const pulled = await pullRemoteBundles(token, errors);

    _lastSyncAt = new Date().toISOString();
    await chrome.storage.local.set({ toffee_last_sync: _lastSyncAt });

    console.log(`[Toffee Sync] Complete — pushed: ${pushed}, pulled: ${pulled}, deleted: ${deleted}, errors: ${errors.length}`);
    return { pushed, pulled, deleted, errors };
  } catch (err: any) {
    console.error('[Toffee Sync] Fatal error:', err);
    errors.push(err.message);
    return { pushed: 0, pulled: 0, deleted: 0, errors };
  } finally {
    _isSyncing = false;
  }
}

// ── Push: Upload local-only bundles to the cloud ─────────────

async function pushLocalBundles(token: string, errors: string[]): Promise<number> {
  let pushed = 0;

  try {
    // Get all remote bundle IDs
    const remoteBundleIds = await fetchRemoteBundleIds(token);
    if (!remoteBundleIds) return 0;

    // Find local bundles not on the server
    const localBundles = await db.bundles.toArray();
    const localOnly = localBundles.filter((b) => !remoteBundleIds.has(b.id));

    if (localOnly.length === 0) {
      console.log('[Toffee Sync] No local-only bundles to push.');
      return 0;
    }

    console.log(`[Toffee Sync] Pushing ${localOnly.length} local bundles to cloud...`);

    const chunkSize = 5;
    for (let i = 0; i < localOnly.length; i += chunkSize) {
      const chunk = localOnly.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(async (bundle) => {
          const res = await apiRequest('/bundles', token, {
            method: 'POST',
            body: JSON.stringify({
              display_name: bundle.displayName,
              source_platform: bundle.sourcePlatform,
              source_model: bundle.sourceModel,
              compression_profile: bundle.compressionProfile,
              token_count_original: bundle.tokenCountOriginal,
              token_count_bundle: bundle.tokenCountBundle,
              compression_ratio: bundle.compressionRatio,
              tags: bundle.tags,
              bundle_data: bundle.bundleData,
            }),
          });

          if (res.ok) {
            console.log(`[Toffee Sync] Pushed bundle ${bundle.id}`);
            return true;
          } else {
            const errText = await res.text();
            throw new Error(`Push ${bundle.id}: ${res.status} ${errText}`);
          }
        })
      );

      for (const res of results) {
        if (res.status === 'fulfilled' && res.value) {
          pushed++;
        } else if (res.status === 'rejected') {
          errors.push(res.reason.message);
        }
      }
    }
  } catch (err: any) {
    errors.push(`Push phase: ${err.message}`);
  }

  return pushed;
}

// ── Pull: Download remote-only bundles to local ──────────────

async function pullRemoteBundles(token: string, errors: string[]): Promise<number> {
  let pulled = 0;

  try {
    // Get all remote bundles (metadata)
    const res = await apiRequest('/bundles?pageSize=500', token);
    if (!res.ok) {
      errors.push(`Pull list: ${res.status}`);
      return 0;
    }

    const data = await res.json();
    const remoteBundles: any[] = data.bundles || [];

    // Get all local bundle IDs
    const localIds = new Set((await db.bundles.toArray()).map((b) => b.id));

    // Filter to remote-only
    const remoteOnly = remoteBundles.filter((rb: any) => !localIds.has(rb.id));

    if (remoteOnly.length === 0) {
      console.log('[Toffee Sync] No remote-only bundles to pull.');
      return 0;
    }

    console.log(`[Toffee Sync] Pulling ${remoteOnly.length} remote bundles to local...`);

    const chunkSize = 5;
    for (let i = 0; i < remoteOnly.length; i += chunkSize) {
      const chunk = remoteOnly.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(async (remoteMeta) => {
          // Fetch full bundle details (includes downloadUrl for S3 data)
          const detailRes = await apiRequest(`/bundles/${remoteMeta.id}`, token);
          if (!detailRes.ok) {
            throw new Error(`Pull detail ${remoteMeta.id}: ${detailRes.status}`);
          }

          const detail = await detailRes.json();

          // Download the actual bundle data from S3 pre-signed URL
          let bundleData = '';
          if (detail.downloadUrl) {
            try {
              const s3Res = await fetch(detail.downloadUrl);
              if (s3Res.ok) {
                // The S3 object is stored as base64 — read it as text
                bundleData = await s3Res.text();
              }
            } catch (s3Err: any) {
              console.warn(`[Toffee Sync] S3 download failed for ${remoteMeta.id}:`, s3Err);
            }
          }

          // Store in local Dexie
          const storedBundle: StoredBundle = {
            id: detail.id,
            displayName: detail.display_name || `${detail.source_platform} Conversation`,
            sourcePlatform: detail.source_platform,
            sourceModel: detail.source_model || 'unknown',
            compressionProfile: detail.compression_profile || 'standard',
            tokenCountOriginal: detail.token_count_original || 0,
            tokenCountBundle: detail.token_count_bundle || 0,
            compressionRatio: detail.token_count_original > 0
              ? detail.token_count_bundle / detail.token_count_original
              : 0,
            tags: detail.tags || [],
            bundleData: bundleData,
            hmacSignature: '',
            version: 1,
            createdAt: detail.created_at || new Date().toISOString(),
            updatedAt: detail.updated_at || new Date().toISOString(),
          };

          await db.bundles.put(storedBundle);
          console.log(`[Toffee Sync] Pulled bundle ${detail.id}`);
          return true;
        })
      );

      for (const res of results) {
        if (res.status === 'fulfilled' && res.value) {
          pulled++;
        } else if (res.status === 'rejected') {
          errors.push(res.reason.message);
        }
      }
    }
  } catch (err: any) {
    errors.push(`Pull phase: ${err.message}`);
  }

  return pulled;
}

// ── Delete: Process queued delete operations ─────────────────

async function processDeleteQueue(token: string, errors: string[]): Promise<number> {
  let deleted = 0;

  try {
    const deleteItems = await db.syncQueue
      .where('operation')
      .equals('delete')
      .toArray();

    if (deleteItems.length === 0) return 0;

    console.log(`[Toffee Sync] Processing ${deleteItems.length} delete operations...`);

    const chunkSize = 5;
    for (let i = 0; i < deleteItems.length; i += chunkSize) {
      const chunk = deleteItems.slice(i, i + chunkSize);
      const results = await Promise.allSettled(
        chunk.map(async (item) => {
          const res = await apiRequest(`/bundles/${item.resourceId}`, token, {
            method: 'DELETE',
          });

          if (res.ok || res.status === 404) {
            // Success or already deleted — remove from queue
            await db.syncQueue.delete(item.id);
            console.log(`[Toffee Sync] Deleted remote bundle ${item.resourceId}`);
            return true;
          } else {
            // Increment retry count
            const newRetries = item.retries + 1;
            if (newRetries >= 5) {
              // Give up after 5 retries
              await db.syncQueue.delete(item.id);
              throw new Error(`Delete ${item.resourceId}: max retries exceeded`);
            } else {
              await db.syncQueue.update(item.id, { retries: newRetries });
              throw new Error(`Delete ${item.resourceId}: ${res.status} (retry ${newRetries})`);
            }
          }
        })
      );

      for (const res of results) {
        if (res.status === 'fulfilled' && res.value) {
          deleted++;
        } else if (res.status === 'rejected') {
          errors.push(res.reason.message);
        }
      }
    }
  } catch (err: any) {
    errors.push(`Delete phase: ${err.message}`);
  }

  return deleted;
}

// ── Utility: Get remote bundle IDs ───────────────────────────

async function fetchRemoteBundleIds(token: string): Promise<Set<string> | null> {
  try {
    const res = await apiRequest('/bundles?pageSize=500', token);
    if (!res.ok) return null;

    const data = await res.json();
    const ids = new Set<string>((data.bundles || []).map((b: any) => b.id));
    return ids;
  } catch {
    return null;
  }
}

// ── Queue a delete operation for sync ────────────────────────

export async function queueDeleteForSync(bundleId: string): Promise<void> {
  const item: SyncQueueItem = {
    id: uuid(),
    operation: 'delete',
    resourceType: 'bundle',
    resourceId: bundleId,
    createdAt: new Date().toISOString(),
    retries: 0,
  };
  await db.syncQueue.put(item);
  console.log(`[Toffee Sync] Queued delete for bundle ${bundleId}`);
}
