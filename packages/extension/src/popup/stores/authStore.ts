import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    plan: 'free' | 'pro' | 'team' | 'enterprise';
  } | null;
  accessToken: string | null;

  // Actions
  setAuth: (user: AuthState['user'], accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  accessToken: null,

  setAuth: (user, accessToken) => set({ isAuthenticated: true, user, accessToken }),
  logout: () => set({ isAuthenticated: false, user: null, accessToken: null }),
}));
