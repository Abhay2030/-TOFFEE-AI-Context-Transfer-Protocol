// ============================================================
// Toffee API Client — Typed fetch wrapper with Firebase Auth
// ============================================================

import { auth } from '@/utils/firebase/firebase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://toffee-backend.onrender.com';

/**
 * Get the current user's Firebase ID token for API authentication.
 */
async function getAuthToken(): Promise<string | null> {
  if (!auth?.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}

/**
 * Authenticated fetch wrapper that auto-injects the Firebase Bearer token.
 */
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errorBody.error || `API Error: ${res.status}`);
  }

  // Handle 204 No Content
  if (res.status === 204) {
    return undefined as unknown as T;
  }

  return res.json();
}

// ── Types ────────────────────────────────────────────────────

export interface UsageStats {
  totalTokensConsumed: number;
  totalTokensSaved: number;
  estimatedCostSavingsUsd: number;
  bundlesCreated: number;
  injectionsPerformed: number;
}

export interface BundleItem {
  id: string;
  display_name: string;
  source_platform: string;
  source_model: string;
  compression_profile: string;
  token_count_original: number;
  token_count_bundle: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface BundleListResponse {
  bundles: BundleItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserProfile {
  id: string;
  email: string;
  plan_tier: string;
  mfa_enabled: boolean;
  preferences: Record<string, unknown>;
  created_at: string;
}

// ── API Methods ──────────────────────────────────────────────

export async function getUsageStats(): Promise<UsageStats> {
  return apiFetch<UsageStats>('/v1/analytics/usage');
}

export async function getBundles(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  tag?: string;
}): Promise<BundleListResponse> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set('page', String(params.page));
  if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params?.search) searchParams.set('search', params.search);
  if (params?.tag) searchParams.set('tag', params.tag);
  const qs = searchParams.toString();
  return apiFetch<BundleListResponse>(`/v1/bundles${qs ? `?${qs}` : ''}`);
}

export async function deleteBundle(id: string): Promise<void> {
  return apiFetch<void>(`/v1/bundles/${id}`, { method: 'DELETE' });
}

export async function getMe(): Promise<{ user: UserProfile }> {
  return apiFetch<{ user: UserProfile }>('/v1/auth/me');
}
