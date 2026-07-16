import type { RawConversation, ConversationTurn } from '@toffee/shared';
import { BasePlatformAdapter, type InjectionOptions, type InjectionResult, type ModelInfo } from './types';

class PerplexityAdapter extends BasePlatformAdapter {
  readonly platformId = 'perplexity';
  readonly hostPatterns = ['www.perplexity.ai'];

  // ── DOM Selectors (maintained for Perplexity UI) ────────────
  private readonly SELECTORS = {
    conversationContainer: 'main, div.overflow-y-auto, div[role="main"]',
    messageGroup: '.group\\/turn, div.col-span-12, div:has(> .prose)',
    userMessage: 'div:has(> svg[data-icon="user"]), div.font-display',
    assistantMessage: 'div.prose, div.markdown',
    textarea: 'textarea',
    sendButton: 'button[aria-label="Submit"]',
    modelSelector: 'button:has(svg[data-icon="sparkles"])',
  };

  async extractConversation(): Promise<RawConversation> {
    console.log('[Toffee:Perplexity] Starting conversation extraction...');

    // Scroll to load all messages
    await this.scrollToLoadAll(this.SELECTORS.conversationContainer);

    // Perplexity DOM is tricky, fallback to grabbing user query headers and prose content
    const messageElements = this.safeQuerySelectorAll(this.SELECTORS.messageGroup);
    const turns: ConversationTurn[] = [];

    // If turns are distinct containers
    for (const el of messageElements) {
      // Find user query in this turn
      const userQueryEl = el.querySelector('.text-textMain.font-display');
      if (userQueryEl && userQueryEl.textContent) {
        turns.push({
          role: 'user',
          content: userQueryEl.textContent.trim(),
          metadata: { hasCode: false, hasTable: false }
        });
      }

      // Find assistant response in this turn
      const assistantEl = el.querySelector(this.SELECTORS.assistantMessage);
      if (assistantEl && assistantEl.textContent) {
        const content = assistantEl.textContent.trim();
        turns.push({
          role: 'assistant',
          content,
          metadata: {
            hasCode: assistantEl.querySelector('pre code') !== null,
            hasTable: content.includes('|') && content.includes('---'),
          }
        });
      }
    }

    if (turns.length === 0) {
      turns.push(...this.performFallbackExtraction(this.SELECTORS.conversationContainer));
    }

    if (turns.length === 0) {
      throw new Error("No conversation found on this page. If the UI updated, please wait for a Toffee update or capture manually.");
    }

    console.log(`[Toffee:Perplexity] Extracted ${turns.length} turns`);

    return {
      platform: 'perplexity',
      model: this.detectModel() || 'perplexity-default',
      capturedAt: new Date().toISOString(),
      turns,
    };
  }

  async injectContext(formattedPrompt: string, opts: InjectionOptions): Promise<InjectionResult> {
    if (opts.mode === 'clipboard') {
      await navigator.clipboard.writeText(formattedPrompt);
      return { success: true, tokensInjected: 0, method: 'clipboard' };
    }

    const success = await this.typeIntoTextarea(this.SELECTORS.textarea, formattedPrompt);

    if (!success) {
      console.warn('[Toffee:Perplexity] textarea injection failed, falling back to clipboard');
      await navigator.clipboard.writeText(formattedPrompt);
      return { success: true, tokensInjected: 0, method: 'clipboard' };
    }

    return {
      success,
      tokensInjected: success ? Math.ceil(formattedPrompt.length / 4) : 0,
      method: 'textarea',
    };
  }

  detectModel(): string | null {
    // Pro users might be using Opus, GPT-4o, etc. Detect pro toggle.
    const proToggle = this.safeQuerySelector(this.SELECTORS.modelSelector);
    if (proToggle?.getAttribute('data-state') === 'checked') {
      return 'perplexity-pro';
    }
    return 'perplexity-default';
  }

  getSupportedModels(): ModelInfo[] {
    return [
      { id: 'perplexity-pro', name: 'Perplexity Pro', maxContextWindow: 32_000 },
      { id: 'perplexity-default', name: 'Perplexity Default', maxContextWindow: 32_000 }
    ];
  }

  getMessageCount(): number {
    return this.safeQuerySelectorAll(this.SELECTORS.messageGroup).length;
  }
}

// ── Content Script Initialization ────────────────────────────

const adapter = new PerplexityAdapter();

if (adapter.detect()) {
  console.log('[Toffee] Perplexity platform detected');

  // Notify service worker
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: { platform: 'perplexity', model: adapter.detectModel() },
  });

  // Listen for messages from service worker
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'CAPTURE_REQUEST') {
      adapter
        .extractConversation()
        .then((conversation) => {
          chrome.runtime.sendMessage({
            type: 'CAPTURE_RESULT',
            payload: conversation,
          });
          sendResponse({ success: true, messageCount: conversation.turns.length });
        })
        .catch((error) => {
          chrome.runtime.sendMessage({
            type: 'CAPTURE_ERROR',
            payload: { error: error.message },
          });
          sendResponse({ success: false, error: error.message });
        });
      return true;
    }

    if (message.type === 'INJECT_CONTEXT') {
      adapter
        .injectContext(message.payload.formattedPrompt, message.payload.options)
        .then(sendResponse)
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true;
    }
  });
}
