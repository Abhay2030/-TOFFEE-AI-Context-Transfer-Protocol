"use client";

import { Scan, Cpu, Zap, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: Scan,
    number: "01",
    title: "Capture",
    description:
      "Visit any AI platform and click Capture. Toffee automatically detects ChatGPT, Claude, Gemini, and 3 more platforms — then extracts your full conversation with one click.",
    color: "toffee",
    gradient: "from-toffee-500 to-toffee-600",
  },
  {
    icon: Cpu,
    number: "02",
    title: "Compress",
    description:
      "Our 8-stage AI compression pipeline distills your conversation into a compact .toffee bundle — extracting goals, decisions, preferences, and critical context while achieving up to 85% token savings.",
    color: "violet",
    gradient: "from-accent-violet to-purple-600",
  },
  {
    icon: Zap,
    number: "03",
    title: "Transfer",
    description:
      "Open a new AI conversation on any platform, select your bundle, and inject. The target AI instantly understands your full context — no re-explaining, no copy-paste walls.",
    color: "teal",
    gradient: "from-accent-teal to-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-toffee-400 uppercase tracking-wider mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Three steps to seamless context transfer
          </h2>
          <p className="text-lg text-navy-400 max-w-2xl mx-auto">
            Switch between AI platforms without losing a single thought.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative group">
              {/* Connector Arrow (desktop only) */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-12 -right-4 lg:-right-5 z-10">
                  <ArrowRight className="w-6 h-6 text-navy-700" />
                </div>
              )}

              <div className="glass-card p-6 lg:p-8 h-full hover:border-toffee-500/20 transition-all group-hover:-translate-y-1 duration-300">
                {/* Number + Icon */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-navy-800">{step.number}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-navy-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
