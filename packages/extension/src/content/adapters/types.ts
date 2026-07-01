// ============================================================
// PlatformAdapter Interface
// Contract that every AI platform content script must implement
// ============================================================

import type { RawConversation } from '@toffee/shared';

export interface InjectionOptions {
  mode: 'auto' | 'manual' | 'clipboard';
  tokenBudget: number;
  template?: string;
}

export interface InjectionResult {
  success: boolean;
  tokensInjected: number;
  method: 'system_prompt' | 'textarea' | 'clipboard';
  error?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  maxContextWindow: number;
}

/**
 * PlatformAdapter: The core abstraction for AI platform integration.
 *
 * Each supported AI platform implements this interface as a content script.
 * Adapters are loaded per-platform based on the manifest.json content_scripts
 * configuration and registered with the adapter registry.
 *
 * Per SRS §6.2.1: "The adapter registry is maintained in the Service Worker
 * and loaded dynamically based on the active tab hostname."
 */
export interface PlatformAdapter {
  /** Unique platform identifier matching Platform enum */
  readonly platformId: string;

  /** Hostname patterns this adapter handles */
  readonly hostPatterns: string[];

  /** Check if this adapter can operate on the current page */
  detect(): boolean;

  /** Extract the complete visible conversation history */
  extractConversation(): Promise<RawConversation>;

  /** Inject a formatted context bundle into the current conversation */
  injectContext(formattedPrompt: string, opts: InjectionOptions): Promise<InjectionResult>;

  /** Get the current model being used (if detectable) */
  detectModel(): string | null;

  /** Get supported models for this platform */
  getSupportedModels(): ModelInfo[];

  /** Get the estimated message count without full extraction */
  getMessageCount(): number;
}

/**
 * Base class with shared utilities for all platform adapters.
 */
export abstract class BasePlatformAdapter implements PlatformAdapter {
  abstract readonly platformId: string;
  abstract readonly hostPatterns: string[];

  detect(): boolean {
    return this.hostPatterns.some((pattern) =>
      window.location.hostname.includes(pattern)
    );
  }

  abstract extractConversation(): Promise<RawConversation>;
  abstract injectContext(formattedPrompt: string, opts: InjectionOptions): Promise<InjectionResult>;
  abstract detectModel(): string | null;
  abstract getSupportedModels(): ModelInfo[];
  abstract getMessageCount(): number;

  /**
   * Safely query a DOM element with error handling.
   */
  protected safeQuerySelector<T extends Element>(selector: string): T | null {
    try {
      return document.querySelector<T>(selector);
    } catch {
      return null;
    }
  }

  /**
   * Safely query all matching DOM elements.
   */
  protected safeQuerySelectorAll<T extends Element>(selector: string): T[] {
    try {
      return Array.from(document.querySelectorAll<T>(selector));
    } catch {
      return [];
    }
  }

  /**
   * Wait for a DOM element to appear (for lazy-loaded content).
   */
  protected waitForElement(selector: string, timeoutMs = 5000): Promise<Element | null> {
    return new Promise((resolve) => {
      const existing = document.querySelector(selector);
      if (existing) {
        resolve(existing);
        return;
      }

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          observer.disconnect();
          resolve(el);
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, timeoutMs);
    });
  }

  /**
   * Scroll to load all lazy-loaded conversation messages.
   * Per FR-01-05: Handle paginated/lazy-loaded conversation history.
   */
  protected async scrollToLoadAll(containerSelector: string, delayMs = 300): Promise<void> {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    let previousHeight = 0;
    let attempts = 0;
    const maxAttempts = 50;

    while (attempts < maxAttempts) {
      container.scrollTop = 0; // Scroll to top to load older messages
      await this.sleep(delayMs);

      if (container.scrollHeight === previousHeight) break;
      previousHeight = container.scrollHeight;
      attempts++;
    }

    // Scroll back to bottom
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Type text into a textarea element (for injection).
   */
  protected async typeIntoTextarea(selector: string, text: string): Promise<boolean> {
    const textarea = this.safeQuerySelector<HTMLTextAreaElement>(selector);
    if (!textarea) return false;

    textarea.focus();
    textarea.value = text;

    // Dispatch input events to trigger framework reactivity
    textarea.dispatchEvent(new Event('input', { bubbles: true }));
    textarea.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
