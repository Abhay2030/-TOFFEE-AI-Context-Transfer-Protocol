import type { RawConversation, ConversationTurn } from '@toffee/shared';
import { BasePlatformAdapter, type InjectionOptions, type InjectionResult, type ModelInfo } from './types';

class GeminiAdapter extends BasePlatformAdapter {
  readonly platformId = 'gemini';
  readonly hostPatterns = ['gemini.google.com'];

  // ── DOM Selectors (maintained for Gemini UI) ────────────
  private readonly SELECTORS = {
    conversationContainer: 'chat-app', // Approximate container
    messageGroup: 'message-content', // Individual message container
    userMessage: '.user-query', // User query class or similar
    assistantMessage: '.model-response', // Model response class
    codeBlock: 'pre code',
    textarea: 'rich-textarea p, .ql-editor p', // Rich text editor in Gemini
    sendButton: '.send-button, button[aria-label="Send message"]',
    modelSelector: '.model-selector-button', // E.g., Advanced, Standard
  };

  async extractConversation(): Promise<RawConversation> {
    console.log('[Toffee:Gemini] Starting conversation extraction...');

    // Scroll to load all messages
    await this.scrollToLoadAll(this.SELECTORS.conversationContainer);

    const messageElements = this.safeQuerySelectorAll(this.SELECTORS.messageGroup);
    const turns: ConversationTurn[] = [];

    for (const el of messageElements) {
      // Very basic heuristic for Gemini: usually user messages have a different styling/class
      const isUser = el.classList.contains('user-query') || el.closest('.user-message-container');
      const role = isUser ? 'user' : 'assistant';
      
      const content = el.textContent?.trim() || '';
      const hasCode = el.querySelector(this.SELECTORS.codeBlock) !== null;

      if (content) {
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

    console.log(`[Toffee:Gemini] Extracted ${turns.length} turns`);

    return {
      platform: 'gemini',
      model: this.detectModel() || 'gemini-1.5-pro',
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

    return {
      success,
      tokensInjected: success ? Math.ceil(formattedPrompt.length / 4) : 0,
      method: 'textarea',
      error: success ? undefined : 'Could not find Gemini textarea',
    };
  }

  detectModel(): string | null {
    // Try to detect model from the UI
    const modelEl = this.safeQuerySelector(this.SELECTORS.modelSelector);
    if (modelEl?.textContent) {
      const text = modelEl.textContent.toLowerCase();
      if (text.includes('advanced')) return 'gemini-advanced';
      if (text.includes('1.5 pro')) return 'gemini-1.5-pro';
    }
    return null;
  }

  getSupportedModels(): ModelInfo[] {
    return [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxContextWindow: 2_000_000 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxContextWindow: 1_000_000 },
      { id: 'gemini-advanced', name: 'Gemini Advanced', maxContextWindow: 32_000 },
    ];
  }

  getMessageCount(): number {
    return this.safeQuerySelectorAll(this.SELECTORS.messageGroup).length;
  }
}

// ── Content Script Initialization ────────────────────────────

const adapter = new GeminiAdapter();

if (adapter.detect()) {
  console.log('[Toffee] Gemini platform detected');

  // Notify service worker
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: { platform: 'gemini', model: adapter.detectModel() },
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
