"use client";

import Link from "next/link";
import { ArrowRight, Download, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-toffee-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-violet/5 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-toffee-500/3 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-medium mb-8 animate-slide-up">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Context Transfer Protocol v1.0</span>
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-white">Never Re-explain</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-toffee-400 via-toffee-500 to-accent-violet">
            Yourself to an AI
          </span>
          <br />
          <span className="text-white">Again.</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg sm:text-xl text-navy-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          Capture your AI conversation context from ChatGPT, Claude, or Gemini —
          compress it into a tiny{" "}
          <span className="text-toffee-400 font-mono font-semibold">.toffee</span>{" "}
          bundle — and transfer it to any other AI platform instantly.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/install"
            className="btn-primary text-base py-3 px-8 shadow-lg shadow-toffee-500/20"
          >
            <Download className="w-5 h-5" />
            Install Extension
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base py-3 px-8">
            See How It Works
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Stats */}
        <div
          className="grid grid-cols-3 max-w-lg mx-auto gap-8 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          {[
            { value: "6+", label: "AI Platforms" },
            { value: "85%", label: "Token Savings" },
            { value: "<3s", label: "Transfer Time" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-navy-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Floating Platform Icons */}
        <div
          className="mt-16 flex items-center justify-center gap-4 flex-wrap animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          {["ChatGPT", "Claude", "Gemini", "Copilot", "Grok", "Perplexity"].map(
            (name, i) => (
              <div
                key={name}
                className="glass-card px-4 py-2 flex items-center gap-2 hover:border-toffee-500/30 transition-all hover:-translate-y-0.5"
                style={{ animationDelay: `${0.6 + i * 0.1}s` }}
              >
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-toffee-500/20 to-accent-violet/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-toffee-400">
                    {name[0]}
                  </span>
                </div>
                <span className="text-sm font-medium text-navy-300">{name}</span>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
