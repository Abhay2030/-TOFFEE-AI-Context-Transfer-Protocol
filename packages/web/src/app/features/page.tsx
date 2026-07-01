import { Zap, Shield, Sparkles, Workflow, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Powerful Features for <br className="hidden sm:block" />
            <span className="toffee-gradient-text">AI Power Users</span>
          </h1>
          <p className="text-lg text-navy-400">
            Toffee is built to seamlessly sync your context across platforms while preserving token budgets and maintaining absolute privacy.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          
          <div className="glass-card p-8 group hover:border-toffee-500/30 transition-all">
            <div className="w-14 h-14 rounded-2xl toffee-gradient flex items-center justify-center mb-6">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Adaptive Token Optimization</h3>
            <p className="text-navy-400 leading-relaxed">
              When injecting context into a new model, Toffee automatically truncates and summarizes the history based on the target model&apos;s context window (e.g., shrinking a 200K Claude conversation to fit into an 8K GPT-4 prompt).
            </p>
          </div>

          <div className="glass-card p-8 group hover:border-accent-violet/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-violet to-purple-600 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Zero-Knowledge Architecture</h3>
            <p className="text-navy-400 leading-relaxed">
              Your conversations are compressed locally in your browser. Our backend servers never read your chat history. Cryptographic HMAC signatures ensure your `.toffee` bundles cannot be tampered with.
            </p>
          </div>

          <div className="glass-card p-8 group hover:border-accent-emerald/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-emerald to-emerald-600 flex items-center justify-center mb-6">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Universal Shadow DOM Support</h3>
            <p className="text-navy-400 leading-relaxed">
              Toffee&apos;s custom recursive traversal engine pierces through complex web architectures like Microsoft Copilot&apos;s deeply nested Shadow DOMs, ensuring reliable extraction where standard extensions fail.
            </p>
          </div>

          <div className="glass-card p-8 group hover:border-toffee-400/30 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-toffee-400 to-toffee-600 flex items-center justify-center mb-6">
              <Workflow className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Offline-First Design</h3>
            <p className="text-navy-400 leading-relaxed">
              Using IndexedDB (Dexie) in the browser, Toffee works completely offline. Extract, compress, and inject your conversation context without ever needing an internet connection to our servers.
            </p>
          </div>

        </div>

        {/* Creator Note */}
        <div className="mt-20 glass-card p-10 text-center max-w-4xl mx-auto border-toffee-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-toffee-500/10 rounded-full blur-3xl" />
          <h2 className="text-2xl font-bold text-white mb-4">Crafted for Excellence</h2>
          <p className="text-navy-300 mb-6 max-w-2xl mx-auto">
            Toffee was designed from the ground up to solve the friction of using multiple AI models. Every interaction, animation, and algorithm was meticulously crafted to provide a premium, uninterrupted workflow.
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-navy-700" />
            <p className="text-sm font-medium text-toffee-400 tracking-widest uppercase">Designed & Developed by Abhay</p>
            <div className="h-px w-12 bg-navy-700" />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link href="/install" className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-2">
            Try it for free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
