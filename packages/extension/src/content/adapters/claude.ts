// ============================================================
// Claude Platform Adapter (P0)
// Handles: claude.ai
// ============================================================

import type { RawConversation, ConversationTurn } from '@toffee/shared';
import { BasePlatformAdapter, type InjectionOptions, type InjectionResult, type ModelInfo } from './types';

class ClaudeAdapter extends BasePlatformAdapter {
  readonly platformId = 'claude';
  readonly hostPatterns = ['claude.ai'];

  private readonly SELECTORS = {
    conversationContainer: '.flex-1.flex.flex-col',
    humanMessage: '[data-testid="human-turn"], .font-user-message',
    assistantMessage: '[data-testid="assistant-turn"], .font-claude-message',
    messageContent: '.font-claude-message, .grid-cols-1 p',
    codeBlock: 'pre code',
    textarea: '[contenteditable="true"], .ProseMirror',
    sendButton: 'button[aria-label="Send Message"]',
  };

  async extractConversation(): Promise<RawConversation> {
    console.log('[Toffee:Claude] Starting conversation extraction...');

    const turns: ConversationTurn[] = [];

    // Interleave human and assistant messages in order
    const allMessages = this.safeQuerySelectorAll(
      `${this.SELECTORS.humanMessage}, ${this.SELECTORS.assistantMessage}`
    );

    for (const el of allMessages) {
      const isHuman = el.matches(this.SELECTORS.humanMessage);
      const content = el.textContent?.trim() || '';
      const hasCode = el.querySelector(this.SELECTORS.codeBlock) !== null;

      if (content) {
        turns.push({
          role: isHuman ? 'user' : 'assistant',
          content,
          metadata: {
            hasCode,
            hasTable: content.includes('|') && content.includes('---'),
          },
        });
      }
    }

    console.log(`[Toffee:Claude] Extracted ${turns.length} turns`);

    return {
      platform: 'claude',
      model: this.detectModel() || 'claude-sonnet-4-20250514',
      capturedAt: new Date().toISOString(),
      turns,
    };
  }

  async injectContext(formattedPrompt: string, opts: InjectionOptions): Promise<InjectionResult> {
    if (opts.mode === 'clipboard') {
      await navigator.clipboard.writeText(formattedPrompt);
      return { success: true, tokensInjected: 0, method: 'clipboard' };
    }

    // Claude uses contenteditable div
    const editor = this.safeQuerySelector<HTMLElement>(this.SELECTORS.textarea);
    if (!editor) {
      return { success: false, tokensInjected: 0, method: 'textarea', error: 'Editor not found' };
    }

    editor.focus();
    
    // Most robust way to inject into React/ProseMirror contenteditable editors
    // is using execCommand to simulate real user pasting/typing
    const successful = document.execCommand('insertText', false, formattedPrompt);
    
    // Fallback if execCommand is deprecated/disabled
    if (!successful) {
      editor.textContent = formattedPrompt;
      editor.dispatchEvent(new Event('input', { bubbles: true }));
    }

    return {
      success: true,
      tokensInjected: Math.ceil(formattedPrompt.length / 4),
      method: 'textarea',
    };
  }

  detectModel(): string | null {
    // Claude model detection from UI elements
    const modelText = document.querySelector('[data-testid="model-selector"]')?.textContent;
    if (modelText) {
      if (modelText.includes('Opus')) return 'claude-opus-4-20250514';
      if (modelText.includes('Sonnet')) return 'claude-sonnet-4-20250514';
      if (modelText.includes('Haiku')) return 'claude-3-5-haiku-20241022';
    }
    return null;
  }

  getSupportedModels(): ModelInfo[] {
    return [
      { id: 'claude-opus-4-20250514', name: 'Claude Opus 4', maxContextWindow: 200_000 },
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', maxContextWindow: 200_000 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', maxContextWindow: 200_000 },
    ];
  }

  getMessageCount(): number {
    return this.safeQuerySelectorAll(
      `${this.SELECTORS.humanMessage}, ${this.SELECTORS.assistantMessage}`
    ).length;
  }
}

// ── Content Script Initialization ────────────────────────────

const adapter = new ClaudeAdapter();

if (adapter.detect()) {
  console.log('[Toffee] Claude platform detected');

  chrome.runtime.sendMessage({
    type: 'PLATFORM_DETECTED',
    payload: { platform: 'claude', model: adapter.detectModel() },
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'CAPTURE_REQUEST') {
      adapter
        .extractConversation()
        .then((conversation) => {
          chrome.runtime.sendMessage({ type: 'CAPTURE_RESULT', payload: conversation });
          sendResponse({ success: true, messageCount: conversation.turns.length });
        })
        .catch((error) => {
          chrome.runtime.sendMessage({ type: 'CAPTURE_ERROR', payload: { error: error.message } });
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
