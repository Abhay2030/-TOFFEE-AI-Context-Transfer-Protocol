import { Article } from '../types';
import { ABHAY_DONDE } from '../authors';

export const manifestV3ArchitectureDeepDive: Article = {
  slug: 'manifest-v3-architecture-deep-dive',
  title: 'Manifest V3 Architecture Deep Dive: Building Production Browser Extensions in 2026',
  description: 'A comprehensive technical guide to Chrome Manifest V3 architecture — service workers, content scripts, message passing, storage, and the real-world challenges of building production extensions for AI platforms.',
  publishedAt: '2026-07-01T10:00:00Z',
  updatedAt: '2026-07-28T12:00:00Z',
  author: ABHAY_DONDE,
  category: 'Engineering',
  tags: ['Manifest V3', 'Browser Extensions', 'Service Workers', 'Chrome Extensions', 'Web Platform'],
  readingTime: '15 min read',
  featured: false,
  coverGradient: 'from-blue-500/20 to-accent-violet/20',
  relatedSlugs: ['how-browser-extensions-capture-context', 'complete-guide-ai-context-transfer', 'token-optimization-techniques'],
  sections: [
    {
      id: 'introduction',
      heading: 'Introduction: Why Manifest V3 Changed Everything',
      level: 2,
      content: `<p>In January 2023, Google began enforcing Manifest V3 (MV3) as the required format for all new Chrome extensions, deprecating the decade-old Manifest V2. This was not a minor version bump — it fundamentally restructured how browser extensions operate, affecting security, performance, and developer experience.</p>
<p>For developers building AI-related extensions, MV3 introduced both challenges and opportunities. The migration from persistent background pages to ephemeral service workers required rethinking state management. Stricter Content Security Policies improved security but complicated dynamic code loading. New declarative APIs replaced powerful but abuse-prone imperative ones.</p>
<p>This article provides a production-focused guide to MV3 architecture, drawn from practical experience building Toffee — a browser extension that captures, compresses, and transfers AI conversation context across platforms.</p>`
    },
    {
      id: 'mv3-architecture-overview',
      heading: 'MV3 Architecture Overview',
      level: 2,
      content: `<p>A Manifest V3 extension consists of several isolated execution contexts that communicate through message passing:</p>
<ul>
<li><strong>Service Worker (background.js):</strong> Replaces MV2's background page. Handles events, manages state, and orchestrates extension logic. Crucially, it is <strong>ephemeral</strong> — Chrome terminates it after 30 seconds of inactivity and restarts it when needed.</li>
<li><strong>Content Scripts:</strong> JavaScript injected into web pages. Has DOM access but runs in an isolated world with no access to the page's JS context. In MV3, content scripts must be statically declared in the manifest or injected via the <code>chrome.scripting</code> API.</li>
<li><strong>Popup / Side Panel:</strong> The extension's UI, rendered in a separate window. It has access to Chrome extension APIs but no direct DOM access to web pages.</li>
<li><strong>Options Page:</strong> A dedicated page for extension settings.</li>
</ul>
<p>The communication flow for a typical AI context capture looks like this:</p>
<pre><code class="language-text">User clicks "Capture" in Popup
  → Popup sends message to Service Worker
    → Service Worker injects content script via chrome.scripting
      → Content script reads AI platform DOM
        → Content script sends extracted data to Service Worker
          → Service Worker compresses and stores in IndexedDB
            → Service Worker sends confirmation to Popup
              → Popup updates UI</code></pre>
<p>Each arrow represents a message passing boundary. Understanding these boundaries is essential for debugging MV3 extensions.</p>`
    },
    {
      id: 'service-worker-lifecycle',
      heading: 'The Service Worker Lifecycle: Managing Ephemeral State',
      level: 2,
      content: `<p>The most impactful change in MV3 is the replacement of persistent background pages with ephemeral service workers. In MV2, the background page ran continuously, maintaining state in memory. In MV3, the service worker is terminated after 30 seconds of inactivity.</p>
<p>This has profound implications for state management:</p>
<pre><code class="language-typescript">// ❌ This will NOT work in MV3 — variable is lost on restart
let capturedData: ConversationData[] = [];

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'CAPTURE') {
    capturedData.push(msg.data); // Lost when SW terminates
  }
});

// ✅ Use persistent storage instead
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'CAPTURE') {
    // IndexedDB persists across service worker restarts
    db.captures.put(msg.data);
  }
});</code></pre>
<p>Any state that must survive a service worker restart must be persisted to IndexedDB, Chrome storage (<code>chrome.storage.local</code>), or session storage (<code>chrome.storage.session</code>).</p>
<h3 id="keep-alive-patterns">Keep-Alive Patterns</h3>
<p>For long-running operations like AI compression (which can take 5-15 seconds), the service worker might terminate mid-operation. There are several patterns to prevent this:</p>
<pre><code class="language-typescript">// Pattern 1: Use chrome.runtime.onMessage's sendResponse
// The service worker stays alive while awaiting sendResponse
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.type === 'COMPRESS') {
      compressConversation(message.data)
        .then((bundle) => sendResponse({ bundle }))
        .catch((err) => sendResponse({ error: err.message }));
      return true; // Keep alive until sendResponse is called
    }
  }
);

// Pattern 2: Self-messaging ping to reset the 30s timer
async function longRunningTask() {
  const keepAlive = setInterval(() => {
    chrome.runtime.sendMessage({ type: 'KEEPALIVE' });
  }, 20000);
  
  try {
    const result = await expensiveOperation();
    return result;
  } finally {
    clearInterval(keepAlive);
  }
}</code></pre>
<p>Pattern 1 is preferred because it uses the platform's own lifecycle management. Pattern 2 is a workaround for operations that do not originate from a message handler.</p>`
    },
    {
      id: 'content-script-injection',
      heading: 'Content Script Injection: Static vs. Programmatic',
      level: 2,
      content: `<p>MV3 supports two methods of injecting content scripts, each with distinct trade-offs:</p>
<h3 id="static-injection">Static Declaration (manifest.json)</h3>
<pre><code class="language-json">{
  "content_scripts": [{
    "matches": ["https://chatgpt.com/*"],
    "js": ["content/chatgpt.js"],
    "run_at": "document_idle"
  }]
}</code></pre>
<p>Static scripts are automatically injected when the user navigates to a matching URL. They are simple to configure but run on every page load, consuming resources even when the user does not intend to capture context.</p>
<h3 id="programmatic-injection">Programmatic Injection (chrome.scripting)</h3>
<pre><code class="language-typescript">// Inject only when user requests a capture
async function injectContentScript(tabId: number, platform: string) {
  const scriptFile = \`content/\${platform}.js\`;
  
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptFile],
      world: 'ISOLATED', // Default — safe sandbox
    });
  } catch (error) {
    // Fallback: some sites reject ISOLATED world injection
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [scriptFile],
      world: 'MAIN', // Runs in page's JS context
    });
  }
}</code></pre>
<p>Programmatic injection is more efficient because scripts are loaded only when needed. However, it requires the <code>scripting</code> permission and <code>host_permissions</code> for the target domains.</p>
<p>The fallback from <code>ISOLATED</code> to <code>MAIN</code> world is important for platforms that restrict extension execution. Some enterprise-deployed AI tools block content scripts in the isolated world via their Content Security Policy. Injecting into the MAIN world bypasses this restriction, though it requires extra care to avoid variable name conflicts with the page's own scripts.</p>`
    },
    {
      id: 'storage-strategies',
      heading: 'Storage Strategies: IndexedDB, Chrome Storage, and Dexie',
      level: 2,
      content: `<p>MV3 extensions have several storage options, each suited to different data types:</p>
<table>
<thead><tr><th>Storage</th><th>Capacity</th><th>Access From</th><th>Best For</th></tr></thead>
<tbody>
<tr><td><code>chrome.storage.local</code></td><td>10 MB (unlimited with permission)</td><td>Service Worker, Popup, Content Scripts</td><td>Settings, preferences, small state</td></tr>
<tr><td><code>chrome.storage.session</code></td><td>10 MB</td><td>Service Worker, Popup</td><td>Ephemeral session state (cleared on browser close)</td></tr>
<tr><td>IndexedDB</td><td>Unlimited (browser-dependent)</td><td>Service Worker, Popup</td><td>Large data: conversation bundles, compressed context</td></tr>
<tr><td><code>chrome.storage.sync</code></td><td>100 KB total</td><td>All contexts</td><td>Cross-device settings sync</td></tr>
</tbody>
</table>
<p>For AI context bundles that can be 10–100 KB each, IndexedDB is the only practical choice. Using Dexie — a typed wrapper around IndexedDB — provides a developer experience comparable to an ORM:</p>
<pre><code class="language-typescript">import Dexie, { Table } from 'dexie';

interface StoredBundle {
  id: string;
  platform: string;
  title: string;
  compressedContext: string;
  metrics: BundleMetrics;
  createdAt: Date;
  synced: boolean;
}

class ToffeeDB extends Dexie {
  bundles!: Table<StoredBundle>;
  
  constructor() {
    super('ToffeeDB');
    this.version(1).stores({
      bundles: 'id, platform, createdAt, synced',
    });
  }
}

export const db = new ToffeeDB();</code></pre>
<p>Dexie handles schema versioning, indexing, and querying with a clean Promise-based API. This is dramatically more productive than the raw IndexedDB API, which uses an event-driven pattern that is difficult to compose with async/await code.</p>`
    },
    {
      id: 'csp-and-security',
      heading: 'Content Security Policy and Security Model',
      level: 2,
      content: `<p>MV3 enforces a strict Content Security Policy for all extension contexts:</p>
<ul>
<li>No inline scripts (<code>script-src 'self'</code>)</li>
<li>No <code>eval()</code> or <code>new Function()</code></li>
<li>No remote code execution</li>
<li>All scripts must be bundled as static files within the extension package</li>
</ul>
<p>This is a significant security improvement over MV2, which allowed extensions to fetch and execute arbitrary code from remote servers. For users, this means an MV3 extension's behavior is fully auditable from its packaged source code — it cannot download and run new code after installation.</p>
<p>For developers, this means build tooling must produce self-contained bundles. Dynamic imports are allowed within the extension's own files but cannot reference external URLs. Vite and Webpack are commonly used to produce these bundles, with special plugins like <code>@crxjs/vite-plugin</code> that handle the unique requirements of extension bundling.</p>
<p>The security model also affects how content scripts interact with AI platform pages. Content scripts in the ISOLATED world cannot access the page's JavaScript runtime, which means they cannot call functions defined by the page or access React component state. They can only read and modify the DOM.</p>`
    },
    {
      id: 'testing-and-debugging',
      heading: 'Testing and Debugging MV3 Extensions',
      level: 2,
      content: `<p>Debugging MV3 extensions requires understanding where each component runs:</p>
<ul>
<li><strong>Service Worker:</strong> Inspectable at <code>chrome://extensions</code> → "Inspect views: service worker." The DevTools opens in a separate window.</li>
<li><strong>Content Scripts:</strong> Visible in the page's DevTools under Sources → Content Scripts. Console output appears in the page's console.</li>
<li><strong>Popup:</strong> Right-click the extension icon → "Inspect Popup." DevTools opens attached to the popup window.</li>
</ul>
<p>A common pitfall: service worker logs disappear when the worker is terminated. To preserve logs across restarts, either persist them to storage or keep the service worker's DevTools window open (which prevents termination — useful during development but not in production).</p>
<p>For automated testing, tools like Puppeteer and Playwright support loading unpacked extensions. This enables end-to-end testing of the full capture-compress-store pipeline without manual interaction. Combining this with CI/CD ensures that platform adapter updates do not break existing functionality.</p>`
    }
  ],
  faqs: [
    {
      question: 'What is the difference between Manifest V2 and Manifest V3?',
      answer: 'Manifest V3 replaces persistent background pages with ephemeral service workers, enforces stricter Content Security Policies that prevent remote code execution, introduces the declarativeNetRequest API to replace webRequest blocking, and requires static content script declaration. These changes improve security and performance at the cost of development complexity.'
    },
    {
      question: 'Why does the service worker terminate after 30 seconds?',
      answer: 'Chrome terminates idle service workers to conserve system resources. Extensions that run persistent background processes can drain battery and memory. The 30-second timeout ensures extensions only consume resources when actively processing events.'
    },
    {
      question: 'Can Manifest V3 extensions work in Firefox?',
      answer: 'Firefox supports MV3 with some differences. Firefox allows both MV2 and MV3, and its MV3 implementation retains some MV2 features like Event Pages. Extensions targeting both Chrome and Firefox need to account for these differences in their build configuration.'
    }
  ]
};
