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
    conversationContainer: 'main, [role="presentation"]',
    messageGroup: 'article, [data-message-author-role]',
    userMessage: '[data-message-author-role="user"]',
    assistantMessage: '[data-message-author-role="assistant"]',
    messageContent: '.markdown, .whitespace-pre-wrap, [data-message-author-role="user"] > div',
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
      console.warn('[Toffee:ChatGPT] Primary selectors failed. Attempting fallback extraction...');
      // Fallback: try to just grab all paragraphs in the main container
      const container = this.safeQuerySelector(this.SELECTORS.conversationContainer);
      if (container) {
        const paragraphs = container.querySelectorAll('p, div.whitespace-pre-wrap');
        let combinedContent = '';
        paragraphs.forEach(p => {
          if (p.textContent) combinedContent += p.textContent + '\n';
        });
        
        if (combinedContent.trim().length > 0) {
          turns.push({
            role: 'assistant',
            content: combinedContent.trim(),
            metadata: { hasCode: false, hasTable: false }
          });
        }
      }
    }

    if (turns.length === 0) {
      throw new Error("No conversation found on this page. If ChatGPT updated their UI, please wait for a Toffee update.");
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

    // ChatGPT uses a React textarea or contenteditable.
    // The base typeIntoTextarea uses standard .value = text, which React ignores.
    // We need to trigger the native setter to bypass React's event pooling.
    const textarea = this.safeQuerySelector<HTMLTextAreaElement | HTMLElement>(this.SELECTORS.textarea);
    
    if (!textarea) {
      return { success: false, tokensInjected: 0, method: 'textarea', error: 'Could not find ChatGPT textarea' };
    }

    let success = false;
    textarea.focus();

    if (textarea instanceof HTMLTextAreaElement) {
      // Bypass React's overriding of the value setter
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, formattedPrompt);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        success = true;
      } else {
        textarea.value = formattedPrompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        success = true;
      }
    } else {
      // It's a contenteditable (ChatGPT recently switched some UI to contenteditable)
      success = document.execCommand('insertText', false, formattedPrompt);
      if (!success) {
        textarea.textContent = formattedPrompt;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        success = true;
      }
    }
    
    // Clipboard fallback if everything failed
    if (!success) {
      console.warn('[Toffee:ChatGPT] textarea injection failed, falling back to clipboard');
      await navigator.clipboard.writeText(formattedPrompt);
      return { success: true, tokensInjected: 0, method: 'clipboard' };
    }

    return {
      success,
      tokensInjected: success ? Math.ceil(formattedPrompt.length / 4) : 0,
      method: 'textarea',
      error: success ? undefined : 'Could not find ChatGPT textarea',
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

if (adapter.detect()) {
  console.log('[Toffee] ChatGPT platform detected');

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
