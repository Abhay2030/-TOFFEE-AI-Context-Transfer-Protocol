"use client";
import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Cpu, Lock, Network, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";

const WebGLScene = dynamic(() => import("@/components/3d/Scene").then(mod => mod.WebGLScene), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-navy-950/20 backdrop-blur-sm" />
});
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/TextReveal";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-navy-950">
      <div className="noise-bg" />
      <div className="aurora absolute inset-0 opacity-40 pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex flex-col items-center">
        {/* HERO SECTION - WEBGL */}
        <section className="relative w-full h-screen flex flex-col items-center justify-center pt-20 px-4">
          <WebGLScene />
          
          <div className="relative z-10 max-w-4xl mx-auto text-center pointer-events-none">
            <ScrollReveal delay={0.2} direction="down">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-800/50 border border-navy-700/50 backdrop-blur-md mb-8 shadow-xl shadow-toffee-500/5">
                <Sparkles className="w-4 h-4 text-accent-teal" />
                <span className="text-sm font-medium text-navy-200">The Context Transfer Protocol</span>
              </div>
            </ScrollReveal>

            <div className="text-5xl sm:text-6xl md:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl flex flex-col items-center justify-center">
              <TextReveal text="Transfer Your" delay={0.3} className="justify-center" />
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-toffee-400 to-accent-teal mt-2">
                <TextReveal text="AI Memory Anywhere." delay={0.5} className="justify-center" />
              </div>
            </div>

            <ScrollReveal delay={0.8}>
              <p className="text-lg md:text-2xl text-navy-300 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                Capture, compress, and sync conversations across ChatGPT, Claude, and Gemini with absolute privacy.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.8}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto">
                <MagneticButton strength={25}>
                  <Link href="/register" className="btn-primary py-4 px-8 text-lg rounded-2xl w-full sm:w-auto">
                    Start Building Free <ArrowRight className="w-5 h-5" />
                  </Link>
                </MagneticButton>
                <MagneticButton strength={15}>
                  <Link href="#how-it-works" className="btn-secondary py-4 px-8 text-lg rounded-2xl w-full sm:w-auto">
                    Watch the Protocol
                  </Link>
                </MagneticButton>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* HOW IT WORKS - SCROLL STORY */}
        <section id="how-it-works" className="w-full py-32 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-24">
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">How Toffee Works</h2>
                <p className="text-xl text-navy-400 max-w-2xl mx-auto">A seamless pipeline for capturing and transferring intelligence without losing context.</p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              <ScrollReveal delay={0.1} direction="up" className="h-full">
                <GlassCard className="h-full">
                  <div className="w-14 h-14 rounded-2xl bg-accent-violet/20 flex items-center justify-center mb-6">
                    <Zap className="w-7 h-7 text-accent-violet" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">1. Capture</h3>
                  <p className="text-navy-300 leading-relaxed">Extracts the entire conversation tree instantly from the DOM without API keys.</p>
                </GlassCard>
              </ScrollReveal>
              
              <ScrollReveal delay={0.3} direction="up" className="h-full">
                <GlassCard className="h-full border-toffee-500/30">
                  <div className="w-14 h-14 rounded-2xl bg-toffee-500/20 flex items-center justify-center mb-6">
                    <Cpu className="w-7 h-7 text-toffee-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">2. Compress</h3>
                  <p className="text-navy-300 leading-relaxed">Transforms text into the ultra-efficient .toffee structure, saving 40% on token limits.</p>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={0.5} direction="up" className="h-full">
                <GlassCard className="h-full">
                  <div className="w-14 h-14 rounded-2xl bg-accent-teal/20 flex items-center justify-center mb-6">
                    <Network className="w-7 h-7 text-accent-teal" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">3. Inject</h3>
                  <p className="text-navy-300 leading-relaxed">Hydrates the target AI session, instantly restoring full operational memory.</p>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FEATURES - BENTO */}
        <section id="features" className="w-full py-32 px-4 relative bg-navy-950/50 backdrop-blur-3xl border-y border-navy-800/50">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-16 text-center">Engineered for Scale</h2>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ScrollReveal className="md:col-span-2">
                <GlassCard className="h-full min-h-[300px] flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-3">8-Stage Compression Algorithm</h3>
                  <p className="text-navy-300 text-lg">Our proprietary summarization engine reduces token bloat while maintaining strict semantic integrity.</p>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <GlassCard className="h-full min-h-[300px] flex flex-col justify-end">
                  <Lock className="w-10 h-10 text-accent-teal mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Zero Knowledge</h3>
                  <p className="text-navy-300">Client-side AES-256 encryption. We never see your data.</p>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <GlassCard className="h-full min-h-[300px] flex flex-col justify-end">
                  <Shield className="w-10 h-10 text-accent-violet mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-3">Enterprise Ready</h3>
                  <p className="text-navy-300">SSO, audit logs, and granular access controls built in.</p>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal delay={0.4} className="md:col-span-2">
                <GlassCard className="h-full min-h-[300px] flex flex-col justify-end">
                  <h3 className="text-3xl font-bold text-white mb-3">Cloud Synchronization</h3>
                  <p className="text-navy-300 text-lg">Access your AI context library across all your devices, browsers, and mobile environments instantly.</p>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-40 px-4 relative overflow-hidden">
          <div className="absolute inset-0 toffee-gradient opacity-10 pointer-events-none" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">Ready to sync?</h2>
              <p className="text-xl text-navy-300 mb-10">Join thousands of developers and professionals moving faster with Toffee.</p>
              <MagneticButton strength={25} className="mx-auto">
                <Link href="/register" className="btn-primary py-4 px-10 text-xl rounded-2xl">
                  Install for Microsoft Edge
                </Link>
              </MagneticButton>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
