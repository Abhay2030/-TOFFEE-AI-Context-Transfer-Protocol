import type { RawConversation, ConversationTurn } from '@toffee/shared';
import { BasePlatformAdapter, type InjectionOptions, type InjectionResult, type ModelInfo } from './types';

class CopilotAdapter extends BasePlatformAdapter {
  readonly platformId = 'copilot';
  readonly hostPatterns = ['copilot.microsoft.com', 'www.bing.com'];

  // ── DOM Selectors (maintained for Copilot UI) ────────────
  private readonly SELECTORS = {
    conversationContainer: 'cib-chat-main', // Usually inside shadow roots
    messageGroup: 'cib-chat-turn', // Copilot turn element
    userMessage: 'cib-message-group[source="user"]',
    assistantMessage: 'cib-message-group[source="bot"]',
    textarea: '#searchbox', // The main searchbox
    sendButton: '.submit', // Send button
    modelSelector: '.cib-serp-main',
  };

  async extractConversation(): Promise<RawConversation> {
    console.log('[Toffee:Copilot] Starting conversation extraction...');

    // Helper to recursively find elements inside Shadow DOM
    const deepQuerySelectorAll = (selector: string, root: Document | ShadowRoot | Element = document): Element[] => {
      const results: Element[] = Array.from(root.querySelectorAll(selector));
      const allElements = root.querySelectorAll('*');
      for (const el of allElements) {
        if (el.shadowRoot) {
          results.push(...deepQuerySelectorAll(selector, el.shadowRoot));
        }
      }
      return results;
    };

    const turns: ConversationTurn[] = [];
    const messageElements = deepQuerySelectorAll(this.SELECTORS.messageGroup);

    for (const el of messageElements) {
      // Find user and assistant sources within the turn
      const userGroup = el.querySelector(this.SELECTORS.userMessage) || el.shadowRoot?.querySelector(this.SELECTORS.userMessage);
      const botGroup = el.querySelector(this.SELECTORS.assistantMessage) || el.shadowRoot?.querySelector(this.SELECTORS.assistantMessage);

      if (userQueryText(userGroup)) {
        turns.push({
          role: 'user',
          content: userQueryText(userGroup) || '',
          metadata: { hasCode: false, hasTable: false }
        });
      }

      if (botQueryText(botGroup)) {
        const content = botQueryText(botGroup) || '';
        turns.push({
          role: 'assistant',
          content,
          metadata: {
            hasCode: content.includes('```'),
            hasTable: content.includes('|') && content.includes('---')
          }
        });
      }
    }

    function userQueryText(el?: Element | null): string | null {
      if (!el) return null;
      return el.shadowRoot?.querySelector('.content')?.textContent?.trim() || el.textContent?.trim() || null;
    }

    function botQueryText(el?: Element | null): string | null {
      if (!el) return null;
      const messageBlocks = el.shadowRoot?.querySelectorAll('cib-message') || [];
      return Array.from(messageBlocks).map(b => b.shadowRoot?.querySelector('.content')?.textContent?.trim() || '').join('\\n').trim() || null;
    }
    
    console.log(`[Toffee:Copilot] Extracted ${turns.length} turns via Shadow DOM traversal`);

    return {
      platform: 'copilot',
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

    // Shadow DOM textarea injection
    const deepQuerySelector = (selector: string, root: Document | ShadowRoot | Element = document): Element | null => {
      const el = root.querySelector(selector);
      if (el) return el;
      const allElements = root.querySelectorAll('*');
      for (const child of allElements) {
        if (child.shadowRoot) {
          const found = deepQuerySelector(selector, child.shadowRoot);
          if (found) return found;
        }
      }
      return null;
    };

    const textarea = deepQuerySelector(this.SELECTORS.textarea) as HTMLTextAreaElement | null;
    let success = false;
    
    if (textarea) {
      textarea.focus();
      textarea.value = formattedPrompt;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      success = true;
    }

    return {
      success,
      tokensInjected: success ? Math.ceil(formattedPrompt.length / 4) : 0,
      method: 'textarea',
      error: success ? undefined : 'Could not find Copilot textarea in Shadow DOM',
    };
  }

  detectModel(): string | null {
    return 'gpt-4o'; // Copilot is usually heavily abstracted GPT-4o
  }

  getSupportedModels(): ModelInfo[] {
    return [
      { id: 'gpt-4o', name: 'Copilot (GPT-4o)', maxContextWindow: 128_000 },
      { id: 'gpt-4', name: 'Copilot (GPT-4)', maxContextWindow: 32_000 }
    ];
  }

  getMessageCount(): number {
    return 0; // Requires shadow DOM traversal
  }
}

// ── Content Script Initialization ────────────────────────────

const adapter = new CopilotAdapter();

if (adapter.detect()) {
  console.log('[Toffee] Copilot platform detected');

  // Notify service worker
  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: { platform: 'copilot', model: adapter.detectModel() },
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
