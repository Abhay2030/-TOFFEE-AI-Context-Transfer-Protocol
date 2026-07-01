import Link from "next/link";
import { Download, Terminal, Settings, CheckCircle2, ArrowRight } from "lucide-react";

export default function InstallPage() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center py-20 px-4">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto rounded-2xl toffee-gradient flex items-center justify-center mb-6">
            <Download className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Install Toffee Extension
          </h1>
          <p className="text-lg text-navy-400 max-w-xl mx-auto">
            Toffee is currently in Developer Preview. Follow these steps to install the unpacked extension directly into Chrome or Edge.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <div className="glass-card p-6 flex gap-6">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-navy-800/50 flex items-center justify-center text-navy-300 font-bold text-xl border border-navy-700/50">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                <Terminal className="w-5 h-5 text-toffee-400" /> Build the Extension
              </h3>
              <p className="text-navy-400 text-sm leading-relaxed mb-4">
                Since you are running Toffee locally, you need to build the extension first. Open your terminal in the Toffee project directory and run:
              </p>
              <div className="bg-black/50 border border-navy-800 rounded-lg p-4 font-mono text-sm text-toffee-300">
                npm run build --workspace=packages/extension
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex gap-6">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-navy-800/50 flex items-center justify-center text-navy-300 font-bold text-xl border border-navy-700/50">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                <Settings className="w-5 h-5 text-accent-violet" /> Enable Developer Mode
              </h3>
              <p className="text-navy-400 text-sm leading-relaxed mb-4">
                Open your browser&apos;s extension management page. For Chrome, go to <span className="font-mono text-white bg-navy-800 px-1 rounded">chrome://extensions/</span>.
                Toggle <strong>Developer mode</strong> on in the top right corner.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 flex gap-6">
            <div className="shrink-0 w-12 h-12 rounded-xl bg-navy-800/50 flex items-center justify-center text-navy-300 font-bold text-xl border border-navy-700/50">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-accent-emerald" /> Load Unpacked
              </h3>
              <p className="text-navy-400 text-sm leading-relaxed mb-4">
                Click the <strong>Load unpacked</strong> button that appears. Select the <span className="font-mono text-white bg-navy-800 px-1 rounded">packages/extension/dist</span> folder from your Toffee project directory. The Toffee icon will appear in your toolbar!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex justify-center gap-4">
          <Link href="/dashboard" className="btn-secondary py-3 px-8">
            Back to Dashboard
          </Link>
          <a href="https://chatgpt.com" target="_blank" rel="noreferrer" className="btn-primary py-3 px-8 flex items-center gap-2">
            Test on ChatGPT <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
