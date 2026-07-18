// ============================================================
// Platform Constants
// ============================================================

import type { Platform } from '../schemas/toffeeBundle.js';

export interface PlatformConfig {
  id: Platform;
  name: string;
  hostPatterns: string[];
  priority: 'P0' | 'P1' | 'P2';
  captureSupported: boolean;
  injectionSupported: boolean;
  systemPromptSupport: boolean;
  defaultModel: string;
  iconUrl: string;
}

export const PLATFORMS: Record<Platform, PlatformConfig> = {
  chatgpt: {
    id: 'chatgpt',
    name: 'ChatGPT',
    hostPatterns: ['chat.openai.com', 'chatgpt.com'],
    priority: 'P0',
    captureSupported: true,
    injectionSupported: true,
    systemPromptSupport: true,
    defaultModel: 'gpt-4o',
    iconUrl: '/icons/chatgpt.svg',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    hostPatterns: ['claude.ai'],
    priority: 'P0',
    captureSupported: true,
    injectionSupported: true,
    systemPromptSupport: true,
    defaultModel: 'claude-sonnet-4-20250514',
    iconUrl: '/icons/claude.svg',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    hostPatterns: ['gemini.google.com'],
    priority: 'P0',
    captureSupported: true,
    injectionSupported: true,
    systemPromptSupport: false,
    defaultModel: 'gemini-2.5-pro',
    iconUrl: '/icons/gemini.svg',
  },
  copilot: {
    id: 'copilot',
    name: 'Microsoft Copilot',
    hostPatterns: ['copilot.microsoft.com', 'www.bing.com/chat'],
    priority: 'P0',
    captureSupported: true,
    injectionSupported: true,
    systemPromptSupport: false,
    defaultModel: 'gpt-4o',
    iconUrl: '/icons/copilot.svg',
  },
  grok: {
    id: 'grok',
    name: 'Grok',
    hostPatterns: ['grok.com', 'x.com/i/grok'],
    priority: 'P1',
    captureSupported: true,
    injectionSupported: true,
    systemPromptSupport: false,
    defaultModel: 'grok-3',
    iconUrl: '/icons/grok.svg',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI',
    hostPatterns: ['www.perplexity.ai'],
    priority: 'P1',
    captureSupported: true,
    injectionSupported: true,
    systemPromptSupport: false,
    defaultModel: 'perplexity-default',
    iconUrl: '/icons/perplexity.svg',
  },
  meta_ai: {
    id: 'meta_ai',
    name: 'Meta AI',
    hostPatterns: ['www.meta.ai'],
    priority: 'P2',
    captureSupported: false,
    injectionSupported: false,
    systemPromptSupport: false,
    defaultModel: 'llama-4',
    iconUrl: '/icons/meta.svg',
  },
  mistral: {
    id: 'mistral',
    name: 'Mistral Le Chat',
    hostPatterns: ['chat.mistral.ai'],
    priority: 'P2',
    captureSupported: false,
    injectionSupported: false,
    systemPromptSupport: false,
    defaultModel: 'mistral-large',
    iconUrl: '/icons/mistral.svg',
  },
  'toffee-stitched': {
    id: 'toffee-stitched',
    name: 'Toffee Stitched',
    hostPatterns: [],
    priority: 'P2',
    captureSupported: false,
    injectionSupported: true,
    systemPromptSupport: false,
    defaultModel: 'multi-model-stitch',
    iconUrl: '/icons/generic.svg',
  },
  other: {
    id: 'other',
    name: 'Other',
    hostPatterns: [],
    priority: 'P2',
    captureSupported: false,
    injectionSupported: false,
    systemPromptSupport: false,
    defaultModel: 'unknown',
    iconUrl: '/icons/generic.svg',
  },
};

/**
 * Get all host patterns for content script registration.
 */
export function getAllHostPatterns(): string[] {
  return Object.values(PLATFORMS).flatMap((p) => p.hostPatterns);
}

/**
 * Find platform config by hostname.
 */
export function getPlatformByHost(hostname: string): PlatformConfig | undefined {
  return Object.values(PLATFORMS).find((p) =>
    p.hostPatterns.some((h) => hostname.includes(h))
  );
}
