import { Metadata } from 'next';
import { Terminal, Code, Cpu, Layers, Shield, FileJson, Server, Key, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: 'API Documentation | Toffee AI Context Transfer Protocol',
  description: 'Enterprise API documentation for the Toffee AI context transfer protocol. Integrate semantic compression and sync into your own applications.',
};

export default function ApiDocsPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-navy-950 pt-24 pb-16 flex justify-center">
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="sticky top-28 space-y-8">
            <div>
              <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Getting Started</h4>
              <ul className="space-y-2">
                <li><a href="#quickstart" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">Quick Start</a></li>
                <li><a href="#authentication" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">Authentication</a></li>
                <li><a href="#sdks" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">Client SDKs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Core API</h4>
              <ul className="space-y-2">
                <li><a href="#compress" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">POST /v1/compress</a></li>
                <li><a href="#bundles" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">GET /v1/bundles</a></li>
                <li><a href="#sync" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">POST /v1/sync</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold text-navy-400 uppercase tracking-wider mb-3">Developer Guides</h4>
              <ul className="space-y-2">
                <li><a href="#rate-limits" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">Rate Limits</a></li>
                <li><a href="#errors" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">Error Codes</a></li>
                <li><a href="#pagination" className="text-sm text-navy-300 hover:text-toffee-400 transition-colors">Pagination</a></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 max-w-4xl space-y-16 pb-20">
          
          <header>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-medium mb-6">
              <Terminal className="w-4 h-4" />
              <span>v1.0.0</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6">Toffee API Reference</h1>
            <p className="text-lg text-navy-400 leading-relaxed">
              Integrate Toffee's semantic compression engine directly into your own applications.
              The API allows you to programmatically compress AI conversations, manage context bundles, and synchronize state across devices.
            </p>
          </header>

          {/* Quick Start */}
          <section id="quickstart" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-accent-teal" /> Quick Start
            </h2>
            <p className="text-navy-300 mb-6">
              The Toffee API is organized around REST. Our API has predictable resource-oriented URLs, accepts JSON-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes.
            </p>
            <GlassCard className="p-6 border-navy-800 bg-navy-900/30">
              <h3 className="text-white font-bold mb-4">Base URL</h3>
              <code className="block p-4 rounded-lg bg-[#0D1117] text-toffee-300 border border-navy-800 font-mono text-sm">
                https://api.toffee.ai/v1
              </code>
            </GlassCard>
          </section>

          {/* Authentication */}
          <section id="authentication" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-accent-violet" /> Authentication
            </h2>
            <p className="text-navy-300 mb-6">
              The Toffee API uses Firebase Auth ID tokens to authenticate requests. You can view and manage your API keys in the Toffee Dashboard.
            </p>
            <div className="p-4 rounded-xl bg-accent-violet/10 border border-accent-violet/20 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
              <div className="text-sm text-navy-300">
                <strong className="text-white block mb-1">Keep your tokens secure</strong>
                Do not share your ID tokens in publicly accessible areas such as GitHub, client-side code, and so forth.
              </div>
            </div>
            <p className="text-navy-300 mb-4">All API requests must include your token in an <code className="bg-navy-800 px-1.5 py-0.5 rounded text-toffee-300">Authorization</code> HTTP header:</p>
            <pre className="p-4 rounded-xl bg-[#0D1117] text-sm font-mono border border-navy-800 overflow-x-auto">
<span className="text-accent-emerald">Authorization:</span> Bearer &lt;YOUR_FIREBASE_ID_TOKEN&gt;
            </pre>
          </section>

          {/* Core Endpoints: /compress */}
          <section id="compress" className="scroll-mt-28">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Cpu className="w-6 h-6 text-toffee-400" /> Compress Context
            </h2>
            <div className="flex items-center gap-3 mb-6">
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold font-mono">POST</span>
              <code className="text-navy-200 font-mono">/v1/compress</code>
            </div>
            <p className="text-navy-300 mb-8">
              Compresses a raw conversation array into an optimized <code className="bg-navy-800 px-1.5 py-0.5 rounded text-toffee-300">.toffee</code> bundle. This endpoint runs the full 8-stage semantic compression pipeline.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">Request Body</h3>
                <div className="space-y-4">
                  <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-toffee-400 font-mono text-sm font-bold">conversation</span>
                      <span className="text-xs text-navy-500 font-mono">object (required)</span>
                    </div>
                    <p className="text-sm text-navy-300">The raw conversation payload extracted from the AI platform.</p>
                  </div>
                  <div className="bg-navy-900/50 border border-navy-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-toffee-400 font-mono text-sm font-bold">profile</span>
                      <span className="text-xs text-navy-500 font-mono">enum (optional)</span>
                    </div>
                    <p className="text-sm text-navy-300">Compression aggressiveness. Defaults to <code className="text-xs bg-navy-800 px-1 rounded">standard</code>. Allowed values: <code className="text-xs bg-navy-800 px-1 rounded">minimal</code>, <code className="text-xs bg-navy-800 px-1 rounded">standard</code>, <code className="text-xs bg-navy-800 px-1 rounded">aggressive</code>.</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">Example Request</h3>
                <pre className="p-4 rounded-xl bg-[#0D1117] text-xs font-mono border border-navy-800 overflow-x-auto leading-relaxed">
<span className="text-accent-violet">curl</span> -X POST https://api.toffee.ai/v1/compress \
  -H <span className="text-accent-emerald">"Authorization: Bearer $TOKEN"</span> \
  -H <span className="text-accent-emerald">"Content-Type: application/json"</span> \
  -d <span className="text-toffee-300">'{`{
  "profile": "standard",
  "conversation": {
    "platform": "chatgpt",
    "model": "gpt-4o",
    "turns": [
      {
        "role": "user",
        "content": "Let's build a Next.js app."
      }
    ]
  }
}`}'</span>
                </pre>
              </div>
            </div>
          </section>

          {/* Rate Limits */}
          <section id="rate-limits" className="scroll-mt-28 pt-8 border-t border-navy-800/50">
            <h2 className="text-2xl font-bold text-white mb-6">Rate Limits</h2>
            <p className="text-navy-300 mb-6">
              The Toffee API implements rate limiting to ensure stability. Limits are applied per authenticated user account.
            </p>
            <div className="bg-navy-900/50 border border-navy-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm text-navy-300">
                <thead className="bg-navy-900 border-b border-navy-800">
                  <tr>
                    <th className="px-6 py-4 font-bold text-white">Endpoint</th>
                    <th className="px-6 py-4 font-bold text-white">Rate Limit</th>
                    <th className="px-6 py-4 font-bold text-white">Window</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/50">
                  <tr>
                    <td className="px-6 py-4 font-mono">POST /compress</td>
                    <td className="px-6 py-4">60 requests</td>
                    <td className="px-6 py-4">Per minute</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-mono">GET /bundles</td>
                    <td className="px-6 py-4">300 requests</td>
                    <td className="px-6 py-4">Per minute</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Error Codes */}
          <section id="errors" className="scroll-mt-28 pt-8 border-t border-navy-800/50">
            <h2 className="text-2xl font-bold text-white mb-6">Error Codes</h2>
            <p className="text-navy-300 mb-6">
              Toffee uses conventional HTTP response codes to indicate the success or failure of an API request.
            </p>
            <div className="space-y-4">
              {[
                { code: 200, status: "OK", desc: "Everything worked as expected." },
                { code: 400, status: "Bad Request", desc: "The request was unacceptable, often due to missing a required parameter." },
                { code: 401, status: "Unauthorized", desc: "No valid API key or Firebase token provided." },
                { code: 429, status: "Too Many Requests", desc: "Too many requests hit the API too quickly. We recommend an exponential backoff." },
                { code: 500, status: "Server Error", desc: "Something went wrong on Toffee's end." },
              ].map(err => (
                <div key={err.code} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-navy-900/30 border border-navy-800">
                  <div className="flex items-center gap-3 min-w-[150px]">
                    <span className={`px-2 py-1 rounded text-xs font-bold font-mono ${err.code === 200 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {err.code}
                    </span>
                    <span className="font-bold text-white">{err.status}</span>
                  </div>
                  <p className="text-sm text-navy-400 m-0">{err.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
    </PageTransition>
  );
}
