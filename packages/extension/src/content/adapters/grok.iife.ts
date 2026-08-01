import type { RawConversation, ConversationTurn } from '@toffee/shared';
import { BasePlatformAdapter, type InjectionOptions, type InjectionResult, type ModelInfo } from './types';

class GrokAdapter extends BasePlatformAdapter {
  readonly platformId = 'grok';
  readonly hostPatterns = ['grok.com', 'x.com'];

  // ── DOM Selectors (maintained for Grok UI) ────────────
  private readonly SELECTORS = {
    conversationContainer: 'div[data-testid="conversation"], main, div[role="main"]',
    messageGroup: 'div[data-testid="message"], div[dir="auto"].message, div.group',
    userMessage: 'div[data-testid="user-message"], div[data-message-author="user"]',
    assistantMessage: 'div[data-testid="bot-message"], div.prose',
    textarea: 'textarea[data-testid="prompt-textarea"], textarea',
    sendButton: 'button[data-testid="send-button"], button[aria-label="Grok"]',
    modelSelector: 'button[data-testid="model-selector"]',
  };

  async extractConversation(): Promise<RawConversation> {
    console.log('[Toffee:Grok] Starting conversation extraction...');

    // Scroll to load all messages
    await this.scrollToLoadAll(this.SELECTORS.conversationContainer);

    const messageElements = this.safeQuerySelectorAll(this.SELECTORS.messageGroup);
    const turns: ConversationTurn[] = [];

    for (const el of messageElements) {
      // Basic heuristic for Grok
      const isUser = el.querySelector(this.SELECTORS.userMessage) !== null || el.getAttribute('data-message-author') === 'user';
      const role = isUser ? 'user' : 'assistant';
      
      const content = el.textContent?.trim() || '';

      if (content) {
        turns.push({
          role,
          content,
          metadata: {
            hasCode: el.querySelector('pre code') !== null,
            hasTable: content.includes('|') && content.includes('---'),
          },
        });
      }
    }

    if (turns.length === 0) {
      turns.push(...this.performFallbackExtraction(this.SELECTORS.conversationContainer));
    }

    if (turns.length === 0) {
      throw new Error("No conversation found on this page. If the UI updated, please wait for a Toffee update or capture manually.");
    }

    console.log(`[Toffee:Grok] Extracted ${turns.length} turns`);

    return {
      platform: 'grok',
      model: this.detectModel() || 'grok-3',
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
      console.warn('[Toffee:Grok] textarea injection failed, falling back to clipboard');
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
    // Basic model detection for Grok
    const modelEl = this.safeQuerySelector(this.SELECTORS.modelSelector);
    if (modelEl?.textContent) {
      const text = modelEl.textContent.toLowerCase();
      if (text.includes('grok 3')) return 'grok-3';
      if (text.includes('grok 2')) return 'grok-2';
    }
    return null;
  }

  getSupportedModels(): ModelInfo[] {
    return [
      { id: 'grok-3', name: 'Grok 3', maxContextWindow: 131_072 },
      { id: 'grok-2', name: 'Grok 2', maxContextWindow: 32_768 }
    ];
  }

  getMessageCount(): number {
    return this.safeQuerySelectorAll(this.SELECTORS.messageGroup).length;
  }
}

// ── Content Script Initialization ────────────────────────────

const adapter = new GrokAdapter();

if (!(window as any).__toffee_grok_initialized && adapter.detect()) {
  (window as any).__toffee_grok_initialized = true;
  console.log('[Toffee] Grok platform detected');

  adapter.registerPingHandler();

  // Notify service worker
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: { platform: 'grok', model: adapter.detectModel() },
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

