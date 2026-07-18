// ============================================================
// PlatformAdapter Interface
// Contract that every AI platform content script must implement
// ============================================================

import type { RawConversation, ConversationTurn } from '@toffee/shared';

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
   * Safely query a DOM element with error handling, recursively piercing open shadow roots.
   */
  protected safeQuerySelector<T extends Element>(selector: string, root: Document | Element | ShadowRoot = document): T | null {
    try {
      const el = root.querySelector<T>(selector);
      if (el) return el;

      const allElements = root.querySelectorAll('*');
      for (const child of Array.from(allElements)) {
        if (child.shadowRoot) {
          const shadowEl = this.safeQuerySelector<T>(selector, child.shadowRoot);
          if (shadowEl) return shadowEl;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Safely query all matching DOM elements, recursively piercing open shadow roots.
   */
  protected safeQuerySelectorAll<T extends Element>(selector: string, root: Document | Element | ShadowRoot = document): T[] {
    try {
      const results: T[] = [];
      results.push(...Array.from(root.querySelectorAll<T>(selector)));

      const allElements = root.querySelectorAll('*');
      for (const child of Array.from(allElements)) {
        if (child.shadowRoot) {
          results.push(...this.safeQuerySelectorAll<T>(selector, child.shadowRoot));
        }
      }
      return results;
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
   * Graceful Degradation: Fallback extraction if primary DOM selectors fail.
   * Scrapes all paragraphs and pre-formatted text in the container.
   */
  protected performFallbackExtraction(containerSelector: string): ConversationTurn[] {
    console.warn(`[Toffee:${this.platformId}] Primary selectors failed. Attempting universal fallback extraction...`);
    const turns: ConversationTurn[] = [];
    const container = this.safeQuerySelector(containerSelector) || document.body;
    
    // Aggressively scan for standard conversational text elements, piercing shadow DOMs natively
    const contentNodes = this.safeQuerySelectorAll(
      'p, div.whitespace-pre-wrap, div.prose, div.markdown, div[dir="auto"], pre, code, .text-base, .message, user-message, model-response',
      container
    );
    
    let combinedContent = '';
    const seenText = new Set<string>();

    contentNodes.forEach(node => {
      // Exclude hidden elements or tiny UI labels
      const style = window.getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') return;

      const text = node.textContent?.trim();
      // Only capture substantial text nodes to avoid grabbing UI buttons like "Copy", "Regenerate", etc.
      if (text && text.length > 8 && !seenText.has(text)) {
        seenText.add(text);
        
        // If it's a code block, preserve formatting
        if (node.tagName.toLowerCase() === 'pre' || node.tagName.toLowerCase() === 'code') {
          combinedContent += `\n\`\`\`\n${text}\n\`\`\`\n\n`;
        } else {
          combinedContent += text + '\n\n';
        }
      }
    });

    const finalContent = combinedContent.trim();
    if (finalContent.length > 0) {
      turns.push({
        role: 'assistant', // Default to assistant for safety
        content: finalContent,
        metadata: { 
          hasCode: finalContent.includes('```') || finalContent.includes('function ') || finalContent.includes('const '), 
          hasTable: finalContent.includes('|') && finalContent.includes('---') 
        }
      });
    }

    return turns;
  }

  /**
   * Type text into a textarea element or contenteditable (for injection).
   * Robust against React synthetic events, Vue, and ProseMirror/Slate editors.
   */
  protected async typeIntoTextarea(selector: string, text: string): Promise<boolean> {
    const el = this.safeQuerySelector<HTMLElement>(selector);
    if (!el) return false;

    el.focus();

    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      // 1. Try bypassing React's overriding of the value setter
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(el, text);
      } else {
        el.value = text;
      }
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    } 
    
    // 2. It's a contenteditable (ChatGPT ProseMirror, Claude, Grok, Copilot)
    if (el.getAttribute('contenteditable') === 'true' || el.isContentEditable) {
      // Strategy A: document.execCommand (Simulates user typing/pasting perfectly in most browsers)
      const execSuccess = document.execCommand('insertText', false, text);
      if (execSuccess) return true;

      // Strategy B: Simulate a native Paste Event (Perfect for ProseMirror/Slate)
      const dataTransfer = new DataTransfer();
      dataTransfer.setData('text/plain', text);
      const pasteEvent = new ClipboardEvent('paste', {
        clipboardData: dataTransfer,
        bubbles: true,
        cancelable: true
      });
      el.dispatchEvent(pasteEvent);
      
      // We assume paste event worked because it's standard for rich text editors
      return true;
    }

    return false;
  }

  protected sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
