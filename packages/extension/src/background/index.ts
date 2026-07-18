// ============================================================
// MV3 Service Worker — Background Script
// Production-grade content script injection & message routing
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

// ── Platform URL Mapping ─────────────────────────────────────

/**
 * Static map of supported AI platform URL patterns to their content script
 * chunk files in the build output. This is resolved at build time by reading
 * the manifest's web_accessible_resources entries.
 *
 * This approach is 100% reliable compared to regex matching on dynamic hashes.
 */
function getContentScriptChunks(tabUrl: string): string[] {
  try {
    const manifest = chrome.runtime.getManifest();
    const resources = manifest.web_accessible_resources || [];
    const url = new URL(tabUrl);

    for (const entry of resources as any[]) {
      if (typeof entry !== 'object' || !entry.matches) continue;

      const matches: string[] = entry.matches || [];

      // Skip the generic catch-all used for icons only
      if (matches.length === 1 && matches[0] === '<all_urls>') continue;

      for (const pattern of matches) {
        if (pattern === '<all_urls>') continue;

        // Convert Chrome match pattern to check against current URL
        // Pattern format: "https://chat.openai.com/*"
        if (urlMatchesPattern(url, pattern)) {
          // Return ALL resource chunks (types + platform script)
          const jsChunks = (entry.resources || []).filter(
            (r: string) => r.endsWith('.js')
          );
          if (jsChunks.length > 0) {
            return jsChunks;
          }
        }
      }
    }
  } catch (err) {
    console.error('[Toffee] Failed to resolve content script chunks:', err);
  }
  return [];
}

/**
 * Check if a URL matches a Chrome extension match pattern.
 * Handles patterns like "https://chat.openai.com/*"
 */
function urlMatchesPattern(url: URL, pattern: string): boolean {
  try {
    // Parse the match pattern: scheme://host/path
    const match = pattern.match(/^(\*|https?|ftp):\/\/(\*|(?:\*\.)?[^/*]+)\/(.*)$/);
    if (!match) return false;

    const [, scheme, host, path] = match;

    // Check scheme
    if (scheme !== '*' && scheme !== url.protocol.replace(':', '')) return false;

    // Check host
    if (host !== '*') {
      if (host.startsWith('*.')) {
        const baseDomain = host.slice(2);
        if (url.hostname !== baseDomain && !url.hostname.endsWith('.' + baseDomain)) return false;
      } else {
        if (url.hostname !== host) return false;
      }
    }

    // Check path (simple wildcard at end)
    if (path !== '*') {
      const pathRegex = new RegExp('^/' + path.replace(/\*/g, '.*') + '$');
      if (!pathRegex.test(url.pathname + url.search)) return false;
    }

    return true;
  } catch {
    return false;
  }
}

// ── Content Script Injection Engine ──────────────────────────

/**
 * Probe whether a content script is alive in the given tab.
 * Uses a lightweight ping/pong to avoid false negatives.
 */
async function isContentScriptAlive(tabId: number): Promise<boolean> {
  try {
    const response = await chrome.tabs.sendMessage(tabId, { type: 'TOFFEE_PING' });
    return response?.pong === true;
  } catch {
    return false;
  }
}

/**
 * Programmatically inject all required content script chunks into a tab.
 * This bypasses CSP restrictions because chrome.scripting.executeScript
 * runs in the "isolated" world and is not subject to page-level CSP.
 *
 * We inject the shared types chunk FIRST, then the platform-specific chunk.
 */
async function injectContentScript(tabId: number, tabUrl: string): Promise<boolean> {
  const chunks = getContentScriptChunks(tabUrl);
  if (chunks.length === 0) {
    console.warn(`[Toffee] No content script chunks found for URL: ${tabUrl}`);
    return false;
  }

  try {
    // Sort: inject shared dependencies first (types), then platform scripts
    const sorted = [...chunks].sort((a, b) => {
      if (a.includes('types')) return -1;
      if (b.includes('types')) return 1;
      return 0;
    });

    for (const chunk of sorted) {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: [chunk],
        world: 'MAIN' as any, // Try MAIN world first to access page DOM directly
      }).catch(() => {
        // Fall back to ISOLATED world if MAIN world injection fails
        return chrome.scripting.executeScript({
          target: { tabId },
          files: [chunk],
        });
      });
    }

    // Give the content script time to initialize and register listeners
    await new Promise((r) => setTimeout(r, 800));
    console.log(`[Toffee] Programmatically injected ${sorted.length} chunks into tab ${tabId}`);
    return true;
  } catch (err) {
    console.error('[Toffee] Programmatic injection failed:', err);
    return false;
  }
}

/**
 * Ensure a content script is running in the active tab.
 * First checks if one is already alive (ping), then injects if not.
 */
async function ensureContentScript(tabId: number, tabUrl: string): Promise<boolean> {
  // Step 1: Check if content script is already running
  const alive = await isContentScriptAlive(tabId);
  if (alive) {
    console.log('[Toffee] Content script already alive in tab');
    return true;
  }

  // Step 2: Programmatic injection
  console.log('[Toffee] Content script not alive, injecting programmatically...');
  const injected = await injectContentScript(tabId, tabUrl);
  if (!injected) return false;

  // Step 3: Verify injection worked
  const nowAlive = await isContentScriptAlive(tabId);
  if (nowAlive) return true;

  // Step 4: Last resort — try one more time with a longer delay
  await new Promise((r) => setTimeout(r, 1000));
  return isContentScriptAlive(tabId);
}

// ── Message Handlers ─────────────────────────────────────────

async function handleCaptureRequest() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) return { error: 'No active tab found' };

  // Check if we're on a supported platform
  const chunks = getContentScriptChunks(tab.url);
  if (chunks.length === 0) {
    return { error: 'This page is not a supported AI platform. Navigate to ChatGPT, Claude, Gemini, Copilot, Grok, or Perplexity.' };
  }

  // Ensure content script is injected and alive
  const ready = await ensureContentScript(tab.id, tab.url);
  if (!ready) {
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
  return { acknowledged: true };
}

async function handleInjectRequest(payload: unknown) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url) return { error: 'No active tab found' };

  // Ensure content script is injected and alive
  const ready = await ensureContentScript(tab.id, tab.url);
  if (!ready) {
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
