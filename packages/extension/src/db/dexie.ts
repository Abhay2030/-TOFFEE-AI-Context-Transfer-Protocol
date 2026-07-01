// ============================================================
// Toffee IndexedDB Schema via Dexie.js
// ============================================================

import Dexie, { type EntityTable } from 'dexie';

// ── Table Interfaces ─────────────────────────────────────────

export interface StoredBundle {
  id: string;
  displayName: string;
  sourcePlatform: string;
  sourceModel: string;
  compressionProfile: string;
  tokenCountOriginal: number;
  tokenCountBundle: number;
  compressionRatio: number;
  tags: string[];
  bundleData: string; // GZIP-compressed JSON string
  hmacSignature: string;
  version: number;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CapturedConversation {
  id: string;
  platform: string;
  model: string;
  sessionId?: string;
  turns: string; // JSON-stringified ConversationTurn[]
  messageCount: number;
  capturedAt: string;
  processed: boolean; // true once a bundle is generated
}

export interface SyncQueueItem {
  id: string;
  operation: 'push' | 'pull' | 'delete';
  resourceType: 'bundle' | 'settings';
  resourceId: string;
  payload?: string;
  createdAt: string;
  retries: number;
}

export interface TokenUsageEntry {
  id: string;
  eventType: 'capture' | 'compress' | 'inject';
  platform: string;
  tokensConsumed: number;
  tokensSaved: number;
  bundleId?: string;
  createdAt: string;
}

// ── Database Definition ──────────────────────────────────────

export class ToffeeDB extends Dexie {
  bundles!: EntityTable<StoredBundle, 'id'>;
  conversations!: EntityTable<CapturedConversation, 'id'>;
  syncQueue!: EntityTable<SyncQueueItem, 'id'>;
  tokenUsage!: EntityTable<TokenUsageEntry, 'id'>;

  constructor() {
    super('ToffeeDB');

    this.version(1).stores({
      bundles: 'id, sourcePlatform, compressionProfile, *tags, createdAt, updatedAt',
      conversations: 'id, platform, capturedAt, processed',
      syncQueue: 'id, operation, resourceType, createdAt',
      tokenUsage: 'id, eventType, platform, createdAt',
    });
  }
}

// Singleton instance
export const db = new ToffeeDB();

/**
 * Request persistent storage on extension install.
 * This prevents the browser from evicting IndexedDB data under storage pressure.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && navigator.storage.persist) {
    return navigator.storage.persist();
  }
  return false;
}
