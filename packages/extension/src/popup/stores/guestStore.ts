// ============================================================
// Guest Mode Store — Allows reviewers/visitors to explore
// the extension without Firebase authentication
// ============================================================

import { create } from 'zustand';

interface GuestState {
  isGuest: boolean;
  isLoading: boolean;

  // Actions
  enterGuestMode: () => Promise<void>;
  exitGuestMode: () => Promise<void>;
  loadGuestState: () => Promise<void>;
}

/**
 * Manages guest mode state, persisted to chrome.storage.local
 * so it survives popup close/reopen cycles.
 */
export const useGuestStore = create<GuestState>((set) => ({
  isGuest: false,
  isLoading: true,

  enterGuestMode: async () => {
    try {
      await chrome.storage.local.set({ toffee_guest_mode: true });
      set({ isGuest: true });
      console.log('[Toffee] Guest mode activated');
    } catch (err) {
      console.warn('[Toffee] Failed to persist guest mode:', err);
      // Still set in-memory even if storage fails
      set({ isGuest: true });
    }
  },

  exitGuestMode: async () => {
    try {
      await chrome.storage.local.remove('toffee_guest_mode');
      set({ isGuest: false });
      console.log('[Toffee] Guest mode deactivated');
    } catch (err) {
      console.warn('[Toffee] Failed to clear guest mode:', err);
      set({ isGuest: false });
    }
  },

  loadGuestState: async () => {
    try {
      const result = await chrome.storage.local.get('toffee_guest_mode');
      set({
        isGuest: result.toffee_guest_mode === true,
        isLoading: false,
      });
    } catch (err) {
      console.warn('[Toffee] Failed to load guest state:', err);
      set({ isLoading: false });
    }
  },
}));
