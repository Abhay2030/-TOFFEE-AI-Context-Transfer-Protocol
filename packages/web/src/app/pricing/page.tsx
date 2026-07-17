import { Check, X } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";

const TIERS = [
  {
    name: "Hobby",
    price: "Free",
    description: "Perfect for testing the protocol.",
    features: [
      "Up to 10 .toffee bundles",
      "Standard Token Compression",
      "ChatGPT & Claude Adapters",
      "Offline Storage (IndexedDB)"
    ],
    missing: ["Cloud Sync", "Priority Support", "API Access"],
    cta: "Get Started",
    href: "/install",
    highlight: false,
  },
  {
    name: "Power User",
    price: "$9",
    period: "/mo",
    description: "For professionals working across models.",
    features: [
      "Unlimited .toffee bundles",
      "Advanced AI Summarization API",
      "All Platforms (Gemini, Copilot, Grok)",
      "Cross-device Cloud Sync",
      "Priority Support"
    ],
    missing: ["API Access"],
    cta: "Upgrade Now",
    href: "/register",
    highlight: true,
  },
  {
    name: "Developer",
    price: "$29",
    period: "/mo",
    description: "Build custom AI integrations.",
    features: [
      "Everything in Power User",
      "Full API Access",
      "Custom Compression Profiles",
      "Webhooks",
      "Dedicated Slack Channel"
    ],
    missing: [],
    cta: "View API Docs",
    href: "/api-docs",
    highlight: false,
  }
];

export default function PricingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-navy-950 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-navy-400">
            Start for free, upgrade when you need cloud sync and advanced AI compression models.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {TIERS.map((tier) => (
            <GlassCard 
              key={tier.name}
              className={`relative rounded-3xl p-8 ${
                tier.highlight 
                  ? 'bg-gradient-to-b from-navy-900 to-navy-950 border-toffee-500/50 shadow-toffee-500/10' 
                  : 'border-navy-800'
              }`}
            >
              {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-toffee-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <p className="text-sm text-navy-400 mb-6 h-10">{tier.description}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                {tier.period && <span className="text-navy-400">{tier.period}</span>}
              </div>

              <Link 
                href={tier.href}
                className={`w-full block text-center py-3 rounded-xl font-semibold transition-all mb-8 ${
                  tier.highlight
                    ? 'toffee-gradient text-white shadow-lg shadow-toffee-500/20'
                    : 'bg-navy-800 text-white hover:bg-navy-700'
                }`}
              >
                {tier.cta}
              </Link>

              <ul className="space-y-4">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-toffee-400 shrink-0" />
                    <span className="text-sm text-navy-200">{f}</span>
                  </li>
                ))}
                {tier.missing.map((m) => (
                  <li key={m} className="flex items-start gap-3 opacity-50">
                    <X className="w-5 h-5 text-navy-600 shrink-0" />
                    <span className="text-sm text-navy-500">{m}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>

        {/* Creator Note */}
        <div className="mt-24 text-center">
          <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay Sachin Donde</p>
        </div>

      </div>
    </div>
    </PageTransition>
  );
}
