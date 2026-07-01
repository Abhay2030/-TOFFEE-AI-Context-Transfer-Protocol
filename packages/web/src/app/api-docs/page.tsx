import { Terminal, Code, Cpu, Layers } from "lucide-react";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16 flex justify-center">
      <div className="max-w-5xl w-full px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16">
          <h1 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-toffee-500" />
            Toffee API Reference
          </h1>
          <p className="text-navy-400">
            Integrate Toffee&apos;s context compression engine directly into your own applications.
            Authenticate via Firebase JWT and compress context programmatically.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl font-semibold text-white border-b border-navy-800 pb-2 mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-accent-violet" /> Authentication
            </h2>
            <p className="text-sm text-navy-300 mb-4">
              All API endpoints require a Firebase ID token passed in the <code className="text-toffee-300 bg-navy-800 px-1 rounded">Authorization</code> header as a Bearer token.
            </p>
            <div className="bg-[#0D1117] border border-navy-800 rounded-xl p-5 overflow-x-auto">
              <pre className="text-sm text-navy-300 font-mono">
<span className="text-accent-emerald">Authorization</span>: Bearer &lt;YOUR_FIREBASE_ID_TOKEN&gt;
              </pre>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl font-semibold text-white border-b border-navy-800 pb-2 mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-toffee-400" /> /v1/compress
            </h2>
            <p className="text-sm text-navy-300 mb-4">
              Compress a raw conversation array into an optimized <code className="text-toffee-300 bg-navy-800 px-1 rounded">.toffee</code> bundle.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">Request Body</h3>
                <div className="bg-navy-900 border border-navy-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-toffee-300 font-mono">conversation</span>
                    <span className="text-navy-500">Object</span>
                  </div>
                  <p className="text-xs text-navy-400 pb-2 border-b border-navy-800">The raw extracted conversation containing platform, model, and turns.</p>
                  
                  <div className="flex justify-between text-sm pt-2">
                    <span className="text-toffee-300 font-mono">profile</span>
                    <span className="text-navy-500">Enum (minimal|standard)</span>
                  </div>
                  <p className="text-xs text-navy-400">The compression aggressiveness.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">Example cURL</h3>
                <div className="bg-[#0D1117] border border-navy-800 rounded-xl p-4 overflow-x-auto">
                  <pre className="text-xs text-navy-300 font-mono leading-relaxed">
<span className="text-accent-violet">curl</span> -X POST https://api.toffee.ai/v1/compress \
  -H <span className="text-accent-emerald">"Authorization: Bearer $TOKEN"</span> \
  -H <span className="text-accent-emerald">"Content-Type: application/json"</span> \
  -d <span className="text-toffee-300">'{`{
  "profile": "standard",
  "conversation": {
    "platform": "chatgpt",
    "turns": [
      { "role": "user", "content": "Hello!" }
    ]
  }
}`}'</span>
                  </pre>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Creator Note */}
        <div className="mt-20 pt-8 border-t border-navy-800/50 flex flex-col items-center justify-center">
          <p className="text-xs text-navy-500 uppercase tracking-widest font-semibold mb-2">Designed & Developed by</p>
          <p className="text-lg text-white font-bold tracking-wide">Abhay</p>
        </div>

      </div>
    </div>
  );
}
