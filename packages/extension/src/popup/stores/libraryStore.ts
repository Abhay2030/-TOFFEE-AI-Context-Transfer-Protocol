import { create } from 'zustand';

export interface LibraryBundle {
  id: string;
  displayName: string;
  sourcePlatform: string;
  sourceModel: string;
  compressionProfile: string;
  tokenCountOriginal: number;
  tokenCountBundle: number;
  tags: string[];
  createdAt: string;
}

interface LibraryState {
  bundles: LibraryBundle[];
  searchQuery: string;
  selectedTags: string[];
  isLoading: boolean;

  // Actions
  setBundles: (bundles: LibraryBundle[]) => void;
  addBundle: (bundle: LibraryBundle) => void;
  removeBundle: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  bundles: [],
  searchQuery: '',
  selectedTags: [],
  isLoading: false,

  setBundles: (bundles) => set({ bundles }),
  addBundle: (bundle) => set((s) => ({ bundles: [bundle, ...s.bundles] })),
  removeBundle: (id) => set((s) => ({ bundles: s.bundles.filter((b) => b.id !== id) })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTags: (selectedTags) => set({ selectedTags }),
  setLoading: (isLoading) => set({ isLoading }),
}));
