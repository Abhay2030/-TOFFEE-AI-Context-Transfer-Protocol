// ============================================================
// ChatGPT Platform Adapter (P0)
// Handles: chat.openai.com, chatgpt.com
// ============================================================

import type { RawConversation, ConversationTurn } from '@toffee/shared';
import { BasePlatformAdapter, type InjectionOptions, type InjectionResult, type ModelInfo } from './types';

class ChatGPTAdapter extends BasePlatformAdapter {
  readonly platformId = 'chatgpt';
  readonly hostPatterns = ['chat.openai.com', 'chatgpt.com'];

  // ── DOM Selectors (maintained for ChatGPT UI) ────────────
  private readonly SELECTORS = {
    conversationContainer: 'main, [role="presentation"], div.flex-1.overflow-hidden',
    messageGroup: 'article, [data-message-author-role], div[data-testid^="conversation-turn"]',
    userMessage: '[data-message-author-role="user"]',
    assistantMessage: '[data-message-author-role="assistant"]',
    messageContent: '.markdown, .whitespace-pre-wrap, .prose, [data-message-author-role="user"] > div, div.text-base',
    codeBlock: 'pre code',
    textarea: '#prompt-textarea',
    sendButton: '[data-testid="send-button"]',
    modelSelector: '[class*="model"]',
    conversationTitle: 'title',
  };

  async extractConversation(): Promise<RawConversation> {
    console.log('[Toffee:ChatGPT] Starting conversation extraction...');

    // Scroll to load all messages
    await this.scrollToLoadAll(this.SELECTORS.conversationContainer);

    const messageElements = this.safeQuerySelectorAll(this.SELECTORS.messageGroup);
    const turns: ConversationTurn[] = [];

    for (const el of messageElements) {
      const role = el.getAttribute('data-message-author-role') as 'user' | 'assistant';
      const contentEl = el.querySelector(this.SELECTORS.messageContent);

      if (contentEl && role) {
        const content = contentEl.textContent?.trim() || '';
        const hasCode = el.querySelector(this.SELECTORS.codeBlock) !== null;

        turns.push({
          role,
          content,
          metadata: {
            hasCode,
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

    console.log(`[Toffee:ChatGPT] Extracted ${turns.length} turns`);

    return {
      platform: 'chatgpt',
      model: this.detectModel() || 'gpt-4o',
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

    // Fallback if the robust injection failed for some reason
    if (!success) {
      console.warn('[Toffee:ChatGPT] textarea injection failed, falling back to clipboard');
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
    // Try to detect model from the UI
    const modelEl = this.safeQuerySelector(this.SELECTORS.modelSelector);
    if (modelEl?.textContent) {
      const text = modelEl.textContent.toLowerCase();
      if (text.includes('4o')) return 'gpt-4o';
      if (text.includes('4')) return 'gpt-4';
      if (text.includes('3.5')) return 'gpt-3.5-turbo';
    }
    return null;
  }

  getSupportedModels(): ModelInfo[] {
    return [
      { id: 'gpt-4o', name: 'GPT-4o', maxContextWindow: 128_000 },
      { id: 'gpt-4o-mini', name: 'GPT-4o mini', maxContextWindow: 128_000 },
      { id: 'gpt-4', name: 'GPT-4', maxContextWindow: 8_192 },
    ];
  }

  getMessageCount(): number {
    return this.safeQuerySelectorAll(this.SELECTORS.messageGroup).length;
  }
}

// ── Content Script Initialization ────────────────────────────

const adapter = new ChatGPTAdapter();

// Guard against duplicate initialization (declarative + programmatic injection)
if (!(window as any).__toffee_chatgpt_initialized && adapter.detect()) {
  (window as any).__toffee_chatgpt_initialized = true;
  console.log('[Toffee] ChatGPT platform detected');

  // Register ping handler for health checks
  adapter.registerPingHandler();

  // Notify service worker
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: { platform: 'chatgpt', model: adapter.detectModel() },
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

