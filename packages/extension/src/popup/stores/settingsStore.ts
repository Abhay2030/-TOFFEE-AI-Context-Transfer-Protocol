import { create } from 'zustand';

interface SettingsState {
  cloudSync: boolean;
  darkMode: boolean;
  language: string;
  defaultCompressionProfile: 'minimal' | 'standard' | 'full';
  defaultTokenBudget: number;
  defaultInjectionMode: 'auto' | 'manual' | 'clipboard';

  // Actions
  toggleCloudSync: () => void;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setDefaultCompressionProfile: (profile: 'minimal' | 'standard' | 'full') => void;
  setDefaultTokenBudget: (budget: number) => void;
  setDefaultInjectionMode: (mode: 'auto' | 'manual' | 'clipboard') => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  cloudSync: false,
  darkMode: false,
  language: 'en',
  defaultCompressionProfile: 'standard',
  defaultTokenBudget: 4096,
  defaultInjectionMode: 'auto',

  toggleCloudSync: () => set((s) => ({ cloudSync: !s.cloudSync })),
  toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
  setLanguage: (language) => set({ language }),
  setDefaultCompressionProfile: (defaultCompressionProfile) => set({ defaultCompressionProfile }),
  setDefaultTokenBudget: (defaultTokenBudget) => set({ defaultTokenBudget }),
  setDefaultInjectionMode: (defaultInjectionMode) => set({ defaultInjectionMode }),
}));
