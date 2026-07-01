"use client";

import {
  Shield,
  BarChart3,
  Share2,
  Layers,
  Lock,
  Globe,
  Gauge,
  FileJson,
} from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    title: "8-Stage Compression",
    description:
      "Topic extraction, entity detection, intent analysis, decision mapping, preference inference, task identification — all in one pipeline.",
    span: "md:col-span-2",
    gradient: "from-toffee-500/10 to-accent-violet/10",
  },
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description:
      "AES-256-GCM encryption with HMAC-SHA256 integrity verification. Your conversations never leave your device unencrypted.",
    span: "",
    gradient: "from-accent-emerald/10 to-accent-teal/10",
  },
  {
    icon: FileJson,
    title: ".toffee File Format",
    description:
      "Open, portable, and versioned. Export, import, and share your AI context as tiny compressed files.",
    span: "",
    gradient: "from-accent-amber/10 to-orange-500/10",
  },
  {
    icon: Gauge,
    title: "Token Budget Control",
    description:
      "Fine-tune how much context to inject with adjustable token budgets from 100 to 128K tokens.",
    span: "",
    gradient: "from-accent-violet/10 to-purple-500/10",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description:
      "Track tokens saved, compression ratios, cost savings, and usage patterns across all your AI platforms.",
    span: "",
    gradient: "from-toffee-500/10 to-blue-500/10",
  },
  {
    icon: Share2,
    title: "Secure Sharing",
    description:
      "Generate password-protected share links with expiry dates and access limits.",
    span: "",
    gradient: "from-accent-rose/10 to-pink-500/10",
  },
  {
    icon: Globe,
    title: "6+ AI Platforms",
    description:
      "ChatGPT, Claude, Gemini, Copilot, Grok, and Perplexity — with more coming soon.",
    span: "",
    gradient: "from-accent-teal/10 to-cyan-500/10",
  },
  {
    icon: Lock,
    title: "Privacy-First",
    description:
      "Local-first architecture. Bundles are stored in your browser's IndexedDB. Cloud sync is optional.",
    span: "md:col-span-2",
    gradient: "from-navy-700/30 to-navy-800/30",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-toffee-400 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need for seamless AI workflows
          </h2>
          <p className="text-lg text-navy-400 max-w-2xl mx-auto">
            Built for power users who demand speed, security, and control.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid md:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className={`glass-card p-6 hover:border-toffee-500/20 transition-all hover:-translate-y-0.5 duration-300 ${feature.span}`}
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-5 h-5 text-toffee-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-navy-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
