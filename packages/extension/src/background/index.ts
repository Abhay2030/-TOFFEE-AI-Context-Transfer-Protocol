// ============================================================
// MV3 Service Worker — Background Script
// ============================================================

import { requestPersistentStorage, db } from '../db/database';
import { v4 as uuid } from 'uuid';

// ── Installation & Setup ─────────────────────────────────────

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[Toffee] Extension installed — requesting persistent storage');
    const persisted = await requestPersistentStorage();
    console.log(`[Toffee] Persistent storage: ${persisted ? 'granted' : 'best-effort'}`);

    // Set default settings in chrome.storage
    await chrome.storage.local.set({
      toffee_settings: {
        cloudSync: false,
        darkMode: false,
        language: 'en',
        defaultCompressionProfile: 'standard',
        defaultTokenBudget: 4096,
        defaultInjectionMode: 'auto',
        onboardingComplete: false,
      },
    });
  }

  if (details.reason === 'update') {
    console.log(`[Toffee] Extension updated to v${chrome.runtime.getManifest().version}`);
  }
});

// ── Message Router ───────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch((error) => {
      console.error('[Toffee] Message handling error:', error);
      sendResponse({ error: error.message });
    });

  return true; // Keep message channel open for async response
});

async function handleMessage(
  message: { type: string; payload?: unknown },
  _sender: chrome.runtime.MessageSender
): Promise<unknown> {
  switch (message.type) {
    case 'CAPTURE_REQUEST':
      return handleCaptureRequest();

    case 'CAPTURE_RESULT':
      return handleCaptureResult(message.payload);

    case 'CAPTURE_ERROR':
      return handleCaptureError(message.payload);

    case 'PLATFORM_DETECTED':
      return handlePlatformDetected(message.payload);

    case 'INJECT_REQUEST':
      return handleInjectRequest(message.payload);

    case 'GET_LIBRARY':
      return handleGetLibrary();

    case 'SYNC_STATUS':
      return handleSyncStatus();

    default:
      console.warn(`[Toffee] Unknown message type: ${message.type}`);
      return { error: `Unknown message type: ${message.type}` };
  }
}

// ── Message Handlers ─────────────────────────────────────────

async function handleCaptureRequest() {
  // Forward capture request to the active tab's content script
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { error: 'No active tab found' };

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'CAPTURE_REQUEST',
      payload: { selective: false },
    });
    return response;
  } catch {
    return { error: 'Content script not available on this page' };
  }
}

async function handleCaptureResult(payload: any) {
  console.log('[Toffee] Capture result received', payload);
  
  if (!payload || !payload.turns) return { success: false, error: 'Invalid payload' };

  try {
    await db.conversations.put({
      id: uuid(),
      platform: payload.platform,
      model: payload.model,
      turns: JSON.stringify(payload.turns),
      messageCount: payload.turns.length,
      capturedAt: payload.capturedAt,
      processed: false,
    });
    return { success: true };
  } catch (error: any) {
    console.error('[Toffee] Failed to save conversation:', error);
    return { success: false, error: error.message };
  }
}

async function handleCaptureError(payload: unknown) {
  console.error('[Toffee] Capture error:', payload);
  return { acknowledged: true };
}

async function handlePlatformDetected(payload: any) {
  console.log('[Toffee] Platform detected:', payload);
  
  if (payload && payload.platform) {
    // Optionally set a badge or extension state
    try {
      // Find the tab this came from, though in MV3 background script 
      // we might just set the badge text generally or for the specific tab
      // For simplicity, we just log it and acknowledge. The popup will query active tabs.
      chrome.action.setBadgeText({ text: 'AI' });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    } catch (e) {
      console.warn('Could not set badge', e);
    }
  }

  return { acknowledged: true };
}

async function handleInjectRequest(payload: unknown) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { error: 'No active tab found' };

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: 'INJECT_CONTEXT',
      payload,
    });
    return response;
  } catch {
    return { error: 'Content script not available on this page' };
  }
}

async function handleGetLibrary() {
  try {
    const bundles = await db.bundles.orderBy('createdAt').reverse().toArray();
    return { bundles, total: bundles.length };
  } catch (error: any) {
    console.error('[Toffee] Failed to get library from Dexie:', error);
    return { bundles: [], total: 0, error: error.message };
  }
}

async function handleSyncStatus() {
  return { syncing: false, lastSyncAt: null };
}

// ── Alarm-based Background Sync ──────────────────────────────

chrome.alarms.create('toffee-sync', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'toffee-sync') {
    // Process sync queue when online
    processSyncQueue();
  }
});

async function processSyncQueue() {
  console.log('[Toffee] Processing sync queue...');
  if (!navigator.onLine) {
    console.log('[Toffee] Offline, skipping sync.');
    return;
  }

  try {
    // Basic sync logic: find un-processed conversations and process them
    const unprocessed = await db.conversations.where('processed').equals('false').toArray();
    if (unprocessed.length === 0) {
      console.log('[Toffee] No pending conversations to sync.');
      return;
    }

    const { auth } = await import('../lib/firebase');
    const user = auth.currentUser;
    if (!user) {
      console.log('[Toffee] User not logged in, cannot sync to cloud.');
      return;
    }

    const { generateToffeeBundle } = await import('../core/bundleGenerator');
    for (const conv of unprocessed) {
      try {
        console.log(`[Toffee] Syncing conversation: ${conv.id}`);
        const bundle = await generateToffeeBundle(conv, { profile: 'standard' });
        await db.bundles.put(bundle);
        
        // Mark as processed
        await db.conversations.update(conv.id, { processed: true });
        
        // POST to backend API (the compression API actually doesn't save to the DB, it just compresses)
        // Wait, generateToffeeBundle calls `/compress` which does the LLM work and returns the payload.
        // We need to then POST to `/bundles` to save it to S3.
        const token = await user.getIdToken();
        const res = await fetch('https://toffee-backend.onrender.com/v1/bundles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
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
          })
        });

        if (!res.ok) {
          console.error(`[Toffee] Failed to upload bundle ${conv.id}: ${res.statusText}`);
        } else {
          console.log(`[Toffee] Successfully uploaded bundle ${conv.id} to cloud.`);
        }

      } catch (err) {
        console.error(`[Toffee] Error processing conversation ${conv.id}:`, err);
      }
    }
  } catch (error) {
    console.error('[Toffee] Sync queue error:', error);
  }
}

console.log('[Toffee] Service worker initialized');
