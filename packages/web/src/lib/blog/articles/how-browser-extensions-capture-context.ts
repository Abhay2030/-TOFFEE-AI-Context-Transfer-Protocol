import { Article } from '../types';
import { ABHAY_DONDE } from '../authors';

export const howBrowserExtensionsCaptureContext: Article = {
  slug: 'how-browser-extensions-capture-context',
  title: 'How Browser Extensions Capture AI Context: DOM Extraction, Shadow DOM Traversal, and Content Script Architecture',
  description: 'A technical deep dive into how browser extensions extract conversation data from AI platforms like ChatGPT, Claude, and Gemini using DOM parsing, Shadow DOM traversal, content scripts, and Manifest V3 architecture.',
  publishedAt: '2026-07-08T10:00:00Z',
  updatedAt: '2026-07-30T16:00:00Z',
  author: ABHAY_DONDE,
  category: 'Engineering',
  tags: ['Browser Extensions', 'DOM', 'Shadow DOM', 'Content Scripts', 'Web Scraping', 'Manifest V3'],
  readingTime: '13 min read',
  featured: false,
  coverGradient: 'from-accent-emerald/20 to-blue-500/20',
  relatedSlugs: ['manifest-v3-architecture-deep-dive', 'complete-guide-ai-context-transfer', 'semantic-compression-explained'],
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction: Why Browser Extensions Are the Key to Context Capture',
      level: 2,
      content: `<p>To transfer AI context between platforms, you first need to extract it. The conversation data displayed in the browser — the user prompts, model responses, code blocks, and metadata — must be captured in a structured format before any compression or transfer can occur.</p>
<p>There are theoretically multiple approaches to capturing this data: official APIs, browser automation, or direct DOM extraction via browser extensions. In practice, <strong>browser extensions are the only viable approach</strong> for several reasons:</p>
<ul>
<li><strong>No API dependency:</strong> Most AI platforms either do not provide conversation export APIs or lock them behind paid enterprise plans. ChatGPT has no public API for retrieving past conversations. Claude's API does not expose the web interface's conversation history.</li>
<li><strong>Real-time access:</strong> Extensions can capture conversations as they happen, including streaming responses, rather than requiring an after-the-fact export.</li>
<li><strong>Cross-platform consistency:</strong> A single extension can support multiple AI platforms through platform-specific content scripts, providing a unified capture interface.</li>
<li><strong>No credential sharing:</strong> Unlike API-based approaches, extensions read what is already visible in the browser — the user's authenticated session. No API keys or tokens need to be shared with a third party.</li>
</ul>
<p>This article explores the technical architecture of how browser extensions — specifically Chromium-based Manifest V3 extensions — capture AI conversation data from the DOM.</p>`
    },
    {
      id: 'content-script-architecture',
      heading: 'Content Script Architecture',
      level: 2,
      content: `<p>A browser extension's content script is JavaScript that runs in the context of a web page. It has full access to the page's DOM but operates in an isolated execution environment (the "isolated world"), meaning it cannot access the page's JavaScript variables or functions directly.</p>
<p>For AI context capture, content scripts are injected into specific domains. In the extension's manifest, you define which sites the content scripts should run on:</p>
<pre><code class="language-json">{
  "content_scripts": [
    {
      "matches": ["https://chatgpt.com/*"],
      "js": ["content-scripts/chatgpt.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://claude.ai/*"],
      "js": ["content-scripts/claude.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://gemini.google.com/*"],
      "js": ["content-scripts/gemini.js"],
      "run_at": "document_idle"
    }
  ]
}</code></pre>
<p>Each AI platform has its own content script because the DOM structure, CSS selectors, and data attributes are completely different. This per-platform adapter pattern is essential for maintainability — when ChatGPT updates its UI (which happens frequently), only the ChatGPT adapter needs to be updated.</p>
<h3 id="adapter-pattern">The Platform Adapter Pattern</h3>
<p>Each content script implements a common interface:</p>
<pre><code class="language-typescript">interface PlatformAdapter {
  platform: string;
  detectPlatform(): boolean;
  extractConversation(): ConversationData;
  getMessageElements(): HTMLElement[];
  parseMessage(element: HTMLElement): ParsedMessage;
  injectContext(bundle: ToffeeBundle): void;
}</code></pre>
<p>This interface ensures that the core extension logic — the popup UI, the background service worker, and the compression engine — can work with any platform without knowing the implementation details of DOM parsing.</p>`
    },
    {
      id: 'dom-extraction-strategies',
      heading: 'DOM Extraction Strategies for Major AI Platforms',
      level: 2,
      content: `<p>Each AI platform structures its conversation UI differently. Here is how extraction works for the three major platforms:</p>
<h3 id="chatgpt-extraction">ChatGPT (chatgpt.com)</h3>
<p>ChatGPT uses React-rendered HTML with specific data attributes that identify message roles. The key selector is the <code>data-message-author-role</code> attribute, which distinguishes between user and assistant messages:</p>
<pre><code class="language-typescript">function extractChatGPT(): ConversationData {
  const messages: ParsedMessage[] = [];
  
  // ChatGPT renders each message in a div with a role attribute
  const messageElements = document.querySelectorAll(
    '[data-message-author-role]'
  );
  
  messageElements.forEach((el) => {
    const role = el.getAttribute('data-message-author-role');
    const contentEl = el.querySelector('.markdown.prose');
    
    if (contentEl && role) {
      messages.push({
        role: role === 'user' ? 'user' : 'assistant',
        content: contentEl.innerHTML,
        textContent: contentEl.textContent || '',
      });
    }
  });
  
  return { platform: 'chatgpt', messages };
}</code></pre>
<p>ChatGPT's DOM is relatively straightforward because messages are rendered in the main document with accessible data attributes. However, ChatGPT frequently updates its UI, so selectors must be validated with each extension update.</p>
<h3 id="claude-extraction">Claude (claude.ai)</h3>
<p>Claude uses a more nested component structure. Messages are wrapped in conversation-turn containers, and the role distinction is made through CSS classes rather than data attributes:</p>
<pre><code class="language-typescript">function extractClaude(): ConversationData {
  const messages: ParsedMessage[] = [];
  
  // Claude uses font-specific classes for role identification
  const turns = document.querySelectorAll(
    '[class*="font-claude"], [class*="font-user"]'
  );
  
  turns.forEach((el) => {
    const isAssistant = el.className.includes('font-claude');
    const contentContainer = el.querySelector('.grid-cols-1');
    
    if (contentContainer) {
      messages.push({
        role: isAssistant ? 'assistant' : 'user',
        content: contentContainer.innerHTML,
        textContent: contentContainer.textContent || '',
      });
    }
  });
  
  return { platform: 'claude', messages };
}</code></pre>
<h3 id="copilot-extraction">Microsoft Copilot: The Shadow DOM Challenge</h3>
<p>Microsoft Copilot is the most technically challenging platform to extract from because it uses Web Components with Shadow DOM encapsulation. Standard <code>querySelector</code> calls cannot reach into Shadow DOM boundaries.</p>
<p>Extracting from Copilot requires a recursive Shadow DOM traversal function:</p>
<pre><code class="language-typescript">function deepQuerySelectorAll(
  root: Document | ShadowRoot | Element,
  selector: string
): Element[] {
  const results: Element[] = [];
  
  // Search the current level
  results.push(...Array.from(root.querySelectorAll(selector)));
  
  // Recursively search shadow roots
  const allElements = root.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el.shadowRoot) {
      results.push(
        ...deepQuerySelectorAll(el.shadowRoot, selector)
      );
    }
  });
  
  return results;
}</code></pre>
<p>This function traverses the entire DOM tree, including all shadow boundaries, to find message elements regardless of their nesting depth. This is computationally more expensive than standard DOM queries, so it should be called judiciously — ideally only when the user triggers a capture action.</p>`
    },
    {
      id: 'message-communication',
      heading: 'Message Passing: Content Script to Background Service Worker',
      level: 2,
      content: `<p>Content scripts cannot directly access browser extension APIs like storage or network requests in Manifest V3. Instead, they communicate with the background service worker through Chrome's message passing system:</p>
<pre><code class="language-typescript">// Content script: Send captured data to background
chrome.runtime.sendMessage({
  type: 'CAPTURE_RESULT',
  payload: {
    platform: 'chatgpt',
    messages: extractedMessages,
    capturedAt: new Date().toISOString(),
    url: window.location.href,
  }
});

// Background service worker: Receive and process
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === 'CAPTURE_RESULT') {
      processCapture(message.payload)
        .then((bundle) => {
          // Store in IndexedDB via Dexie
          db.bundles.put(bundle);
          sendResponse({ success: true, bundleId: bundle.id });
        })
        .catch((error) => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // Keep channel open for async response
    }
  }
);</code></pre>
<p>The <code>return true</code> statement is critical — without it, the message channel closes before the async processing completes, and the content script never receives the response. This is a common source of bugs in extension development.</p>
<p>The background service worker then orchestrates the compression pipeline, stores the resulting bundle in IndexedDB (using Dexie for typed access), and optionally syncs it to the cloud if the user has enabled synchronization.</p>`
    },
    {
      id: 'handling-streaming',
      heading: 'Handling Streaming Responses',
      level: 2,
      content: `<p>AI platforms stream their responses token by token. If you capture the DOM while a response is still streaming, you will get an incomplete message. Content scripts must detect when a response is complete before triggering extraction.</p>
<p>The most reliable approach is to observe DOM mutations and detect when new tokens stop being added:</p>
<pre><code class="language-typescript">function waitForStreamComplete(
  messageElement: HTMLElement
): Promise<void> {
  return new Promise((resolve) => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const observer = new MutationObserver(() => {
      // Reset timer on each DOM change
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // No changes for 1.5s — streaming is complete
        observer.disconnect();
        resolve();
      }, 1500);
    });
    
    observer.observe(messageElement, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    
    // Fallback: resolve after 30s regardless
    setTimeout(() => {
      observer.disconnect();
      resolve();
    }, 30000);
  });
}</code></pre>
<p>This MutationObserver watches for DOM changes within the message element. When changes stop for 1.5 seconds, the response is considered complete. A 30-second fallback prevents indefinite waiting if the observer misses the end of streaming.</p>
<p>This pattern — debounced mutation observation — is widely used in browser extension development for detecting page state changes. It is more reliable than checking for specific "stop generating" button states, which vary across platforms and UI updates.</p>`
    },
    {
      id: 'security-considerations',
      heading: 'Security and Privacy Considerations',
      level: 2,
      content: `<p>Browser extensions that access page content operate in a position of significant trust. The content script has read access to everything visible on the page. This creates several security responsibilities:</p>
<h3 id="permission-minimization">Permission Minimization</h3>
<p>Extensions should request only the minimum permissions needed. For AI context capture, this means:</p>
<ul>
<li><code>activeTab</code> — Access only the current tab's content when the user explicitly clicks the extension</li>
<li>Host permissions limited to specific AI platform domains (not <code>&lt;all_urls&gt;</code>)</li>
<li>No access to browsing history, bookmarks, or downloads</li>
</ul>
<h3 id="data-isolation">Data Isolation</h3>
<p>Captured conversation data must be stored securely. Using the browser's IndexedDB with Dexie provides structured storage that is isolated per extension origin. Data never leaves the browser unless the user explicitly triggers cloud sync.</p>
<h3 id="csp-compliance">Content Security Policy Compliance</h3>
<p>Manifest V3 enforces strict Content Security Policies that prevent inline script execution and restrict network requests. Content scripts must be bundled as static files — they cannot be dynamically loaded. This prevents a class of injection attacks that were possible in Manifest V2.</p>
<p>For AI context capture specifically, the extension never executes code from the AI platform's page, never modifies the page's functionality, and never intercepts network requests. It only reads the DOM structure that is already rendered and visible to the user.</p>`
    }
  ],
  faqs: [
    {
      question: 'Does the browser extension access my AI account credentials?',
      answer: 'No. The content script reads only the visible DOM content — the same text you see on screen. It does not access cookies, API tokens, or authentication credentials for the AI platform.'
    },
    {
      question: 'What happens when an AI platform updates its UI?',
      answer: 'Each AI platform has a dedicated adapter (content script) with platform-specific selectors. When a platform updates its DOM structure, only that adapter needs to be updated. The extension is tested against all supported platforms before each release.'
    },
    {
      question: 'Can the extension capture conversations from any website?',
      answer: 'No. The extension only runs on specific, pre-declared AI platform domains (chatgpt.com, claude.ai, gemini.google.com, etc.). It does not and cannot access any other websites.'
    }
  ]
};
