import { create } from 'zustand';

interface SettingsState {
  cloudSync: boolean;
  darkMode: boolean;
  language: string;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  lastSyncAt: string | null;
  defaultCompressionProfile: 'minimal' | 'standard' | 'full';
  defaultTokenBudget: number;
  defaultInjectionMode: 'auto' | 'manual' | 'clipboard';

  // Actions
  toggleCloudSync: () => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setSyncStatus: (status: 'idle' | 'syncing' | 'success' | 'error') => void;
  setLastSyncAt: (time: string | null) => void;
  setDefaultCompressionProfile: (profile: 'minimal' | 'standard' | 'full') => void;
  setDefaultTokenBudget: (budget: number) => void;
  setDefaultInjectionMode: (mode: 'auto' | 'manual' | 'clipboard') => void;
  loadFromStorage: () => Promise<void>;
  triggerManualSync: () => Promise<void>;
}

/**
 * Persist settings to chrome.storage.local so the background worker can read them.
 */
async function persistSettings(partial: Record<string, unknown>) {
  try {
    const result = await chrome.storage.local.get('toffee_settings');
    const current = result.toffee_settings || {};
    await chrome.storage.local.set({
      toffee_settings: { ...current, ...partial },
    });
  } catch (err) {
    console.warn('[Toffee] Failed to persist settings:', err);
  }
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  cloudSync: false,
  darkMode: false,
  language: 'en',
  syncStatus: 'idle',
  lastSyncAt: null,
  defaultCompressionProfile: 'standard',
  defaultTokenBudget: 4096,
  defaultInjectionMode: 'auto',

  toggleCloudSync: () => {
    const newValue = !get().cloudSync;
    set({ cloudSync: newValue });
    persistSettings({ cloudSync: newValue });

    if (newValue) {
      // Trigger an immediate sync when toggled on
      get().triggerManualSync();
    }
  },

  toggleDarkMode: () => {
    const newValue = !get().darkMode;
    set({ darkMode: newValue });
    persistSettings({ darkMode: newValue });
  },

  setLanguage: (language) => {
    set({ language });
    persistSettings({ language });
  },

  setSyncStatus: (syncStatus) => set({ syncStatus }),
  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),

  setDefaultCompressionProfile: (defaultCompressionProfile) => {
    set({ defaultCompressionProfile });
    persistSettings({ defaultCompressionProfile });
  },

  setDefaultTokenBudget: (defaultTokenBudget) => {
    set({ defaultTokenBudget });
    persistSettings({ defaultTokenBudget });
  },

  setDefaultInjectionMode: (defaultInjectionMode) => {
    set({ defaultInjectionMode });
    persistSettings({ defaultInjectionMode });
  },

  loadFromStorage: async () => {
    try {
      const result = await chrome.storage.local.get(['toffee_settings', 'toffee_last_sync']);
      if (result.toffee_settings) {
        set({
          cloudSync: result.toffee_settings.cloudSync ?? false,
          darkMode: result.toffee_settings.darkMode ?? false,
          language: result.toffee_settings.language ?? 'en',
          defaultCompressionProfile: result.toffee_settings.defaultCompressionProfile ?? 'standard',
          defaultTokenBudget: result.toffee_settings.defaultTokenBudget ?? 4096,
          defaultInjectionMode: result.toffee_settings.defaultInjectionMode ?? 'auto',
        });
      }
      if (result.toffee_last_sync) {
        set({ lastSyncAt: result.toffee_last_sync });
      }
    } catch (err) {
      console.warn('[Toffee] Failed to load settings from storage:', err);
    }
  },

  triggerManualSync: async () => {
    set({ syncStatus: 'syncing' });
    try {
      const response = await chrome.runtime.sendMessage({ type: 'TRIGGER_SYNC' });
      if (response?.success) {
        set({
          syncStatus: 'success',
          lastSyncAt: new Date().toISOString(),
        });
        // Reset status after a moment
        setTimeout(() => set({ syncStatus: 'idle' }), 3000);
      } else {
        set({ syncStatus: 'error' });
        setTimeout(() => set({ syncStatus: 'idle' }), 5000);
      }
    } catch (err) {
      console.error('[Toffee] Manual sync error:', err);
      set({ syncStatus: 'error' });
      setTimeout(() => set({ syncStatus: 'idle' }), 5000);
    }
  },
}));

