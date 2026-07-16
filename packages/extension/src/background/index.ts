// ============================================================
// MV3 Service Worker — Background Script
// ============================================================

import { requestPersistentStorage, db } from '../db/database';
import { v4 as uuid } from 'uuid';
import { runFullSync, getSyncStatus, queueDeleteForSync } from './syncEngine';

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

    case 'TRIGGER_SYNC':
      return handleTriggerSync();

    case 'DELETE_BUNDLE':
      return handleDeleteBundle(message.payload);

    default:
      console.warn(`[Toffee] Unknown message type: ${message.type}`);
      return { error: `Unknown message type: ${message.type}` };
  }
}

// ── Content Script Injection Helper ──────────────────────────

/**
 * Dynamically resolves the correct content script file for a given tab URL
 * by reading the runtime manifest's content_scripts entries.
 * This avoids hardcoding loader filenames that change every build.
 */
function getContentScriptForUrl(tabUrl: string): string | null {
  try {
    const manifest = chrome.runtime.getManifest();
    const contentScripts = manifest.content_scripts || [];

    for (const entry of contentScripts) {
      const matches = entry.matches || [];
      for (const pattern of matches) {
        // Convert manifest match pattern to a regex
        // e.g. "https://chatgpt.com/*" → /^https:\/\/chatgpt\.com\/.*$/
        const regexStr = pattern
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')  // Escape special chars
          .replace(/\\\*/g, '.*');                    // Convert * to .*
        const regex = new RegExp(`^${regexStr}$`);

        if (regex.test(tabUrl)) {
          return entry.js?.[0] || null;
        }
      }
    }
  } catch (err) {
    console.error('[Toffee] Failed to read manifest content_scripts:', err);
  }
  return null;
}

/**
 * Try to programmatically inject the correct content script into a tab.
 * This bypasses page-level CSP since chrome.scripting is a privileged API.
 */
async function ensureContentScript(tabId: number, tabUrl: string): Promise<boolean> {
  try {
    const scriptFile = getContentScriptForUrl(tabUrl);
    if (!scriptFile) {
      console.warn(`[Toffee] No content script mapping for URL: ${tabUrl}`);
      return false;
    }

    await chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptFile],
    });

    // Give the content script a moment to initialize and register listeners
    await new Promise((r) => setTimeout(r, 500));
    console.log(`[Toffee] Programmatically injected content script: ${scriptFile}`);
    return true;
  } catch (err) {
    console.error('[Toffee] Programmatic injection failed:', err);
    return false;
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
    // Declarative content script may not have loaded (CSP blocked dynamic import).
    // Retry with programmatic injection.
    console.log('[Toffee] First attempt failed, trying programmatic injection...');
    const injected = await ensureContentScript(tab.id, tab.url || '');
    if (!injected) {
      return { error: 'Content script not available on this page. Try refreshing the page (F5).' };
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'CAPTURE_REQUEST',
        payload: { selective: false },
      });
      return response;
    } catch {
      return { error: 'Content script not available on this page. Try refreshing the page (F5).' };
    }
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
      // Removed the ugly 'AI' text badge so it doesn't obscure the beautiful new logo
      // Optionally we could set a more subtle indicator later.
    } catch (e) {
      console.warn('Could not update action state', e);
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
    // Retry with programmatic injection
    console.log('[Toffee] Inject first attempt failed, trying programmatic injection...');
    const injected = await ensureContentScript(tab.id, tab.url || '');
    if (!injected) {
      return { error: 'Content script not available on this page. Try refreshing the page (F5).' };
    }

    try {
      const response = await chrome.tabs.sendMessage(tab.id, {
        type: 'INJECT_CONTEXT',
        payload,
      });
      return response;
    } catch {
      return { error: 'Content script not available on this page. Try refreshing the page (F5).' };
    }
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
  return getSyncStatus();
}

async function handleTriggerSync() {
  console.log('[Toffee] Manual sync triggered from popup');
  const result = await runFullSync();
  return { success: true, ...result };
}

async function handleDeleteBundle(payload: any) {
  if (!payload?.bundleId) return { error: 'Missing bundleId' };

  try {
    // Queue the remote delete for next sync
    await queueDeleteForSync(payload.bundleId);
    // Delete locally
    await db.bundles.delete(payload.bundleId);
    console.log(`[Toffee] Bundle ${payload.bundleId} deleted locally and queued for remote delete.`);
    return { success: true };
  } catch (error: any) {
    console.error('[Toffee] Delete bundle error:', error);
    return { success: false, error: error.message };
  }
}

// ── Alarm-based Background Sync ──────────────────────────────

chrome.alarms.create('toffee-sync', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'toffee-sync') {
    // Run the full bidirectional sync engine
    runFullSync().catch((err) => {
      console.error('[Toffee] Background sync alarm error:', err);
    });
  }
});

console.log('[Toffee] Service worker initialized');
