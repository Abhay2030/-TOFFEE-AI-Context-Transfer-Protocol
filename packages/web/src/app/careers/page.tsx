import { Metadata } from 'next';
import Link from "next/link";
import { ArrowRight, Users, Briefcase, ChevronRight, CheckCircle2, Shield, Sparkles, Terminal, Layers, Heart, Coffee, Globe, Cpu, Mail } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: 'Careers | Toffee AI',
  description: 'Join Toffee AI and help build the future of AI memory and context transfer infrastructure. We are currently accepting expressions of interest for early engineers and designers.',
};

const BENEFITS = [
  {
    icon: Coffee,
    title: "Professional Growth",
    items: ["Learning & Development Budget", "Technical Certifications", "Conference Sponsorship", "Online Course Access", "Book Allowance", "Internal Tech Talks", "Mentorship Programs"]
  },
  {
    icon: Heart,
    title: "Health & Wellness",
    items: ["Comprehensive Health Insurance", "Mental Health Support", "Wellness Programs", "Flexible Time Off", "Paid Holidays", "Sick Leave"]
  },
  {
    icon: Globe,
    title: "Work Environment",
    items: ["Remote-First Culture", "Flexible Working Hours", "Home Office Allowance", "Premium Equipment", "Modern Development Tools", "High-Performance Hardware"]
  },
  {
    icon: Users,
    title: "Financial Benefits",
    items: ["Competitive Salary", "Performance Bonuses", "Employee Stock Options (ESOP)", "Annual Salary Reviews", "Referral Bonuses"]
  }
];

export default function CareersPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-toffee-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-medium mb-6">
          <Briefcase className="w-4 h-4" />
          <span>We are growing our core team</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-white max-w-4xl mx-auto">
          Build the Infrastructure Behind the <span className="toffee-gradient-text">Next Generation of AI</span>
        </h1>
        
        <p className="text-xl text-navy-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Join a team redefining how artificial intelligence remembers, understands, and shares knowledge across every platform. Help build the future of AI memory, context engineering, and intelligent workflows.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#roles" className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-2">
            View Open Roles <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#culture" className="btn-secondary py-4 px-8 text-lg inline-flex items-center gap-2">
            Explore Our Engineering Culture
          </a>
        </div>

        {/* 3D Visual Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <GlassCard className="aspect-[21/9] rounded-2xl border-toffee-500/30 overflow-hidden flex items-center justify-center bg-navy-900/50 shadow-2xl shadow-toffee-500/10 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent z-10 opacity-80" />
            <div className="absolute w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(168, 123, 68, 0.1) 0%, transparent 70%)' }} />
            <div className="text-center z-20">
              <Cpu className="w-16 h-16 text-toffee-400 mx-auto mb-4 animate-pulse-soft" />
              <p className="text-navy-300 font-mono text-sm tracking-widest uppercase">[ Interactive 3D AI Memory Network Visual ]</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Why Work at Toffee ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Why Work at Toffee</h2>
            <div className="text-navy-300 space-y-4 text-lg">
              <p className="font-semibold text-white">We&apos;re not building another AI application.</p>
              <p>We&apos;re building the infrastructure that enables AI systems to communicate, preserve knowledge, and work together.</p>
              <p>At Toffee, you&apos;ll solve problems that influence the future of AI interoperability, browser technologies, semantic understanding, distributed systems, and enterprise productivity.</p>
            </div>
          </div>
          <GlassCard className="p-8 border-l-4 border-l-toffee-500">
            <h3 className="text-xl font-bold text-white mb-6">Why Engineers Join</h3>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                "Solve technically complex problems", "Build products used by millions",
                "Work on cutting-edge infrastructure", "Influence product direction",
                "Ship meaningful features", "Collaborate with top talent",
                "Learn continuously", "Own features end-to-end",
                "Work with modern technologies", "Contribute to open-source"
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-navy-300">
                  <CheckCircle2 className="w-4 h-4 text-toffee-400 shrink-0 mt-0.5" /> {reason}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* ── Company Culture & Principles ── */}
      <section id="culture" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">Our Culture & Engineering Principles</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <GlassCard className="p-6 border-navy-800 hover:border-toffee-500/30 transition-colors">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-toffee-400"/> Build for the Long Term</h4>
            <p className="text-sm text-navy-400">We prioritize durable engineering over short-term shortcuts. Everyone owns outcomes, not just tasks.</p>
          </GlassCard>
          <GlassCard className="p-6 border-navy-800 hover:border-accent-violet/30 transition-colors">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Terminal className="w-4 h-4 text-accent-violet"/> Innovation & Learning</h4>
            <p className="text-sm text-navy-400">Question assumptions, experiment boldly. We invest in personal growth through research and mentorship.</p>
          </GlassCard>
          <GlassCard className="p-6 border-navy-800 hover:border-accent-emerald/30 transition-colors">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-accent-emerald"/> Transparency</h4>
            <p className="text-sm text-navy-400">Open communication, honest feedback, and clear decision-making are part of our daily culture.</p>
          </GlassCard>
        </div>

        <GlassCard className="p-10 bg-navy-900/50">
          <h3 className="text-2xl font-bold text-white mb-8">Engineering Standards</h3>
          <div className="flex flex-wrap gap-3">
            {[
              "Modern TypeScript", "React & Next.js", "Browser Extension Engineering", 
              "AI Integration", "Semantic Architecture", "Cloud-native Infrastructure", 
              "Microservices", "CI/CD Automation", "Infrastructure as Code", "Secure Development Lifecycle",
              "Simplicity over complexity", "Performance by default", "Privacy-first architecture"
            ].map((tech, i) => (
              <span key={i} className="px-4 py-2 bg-navy-800 rounded-lg text-sm text-navy-200 border border-navy-700/50">
                {tech}
              </span>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* ── Benefits & Perks ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Benefits & Perks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, i) => (
            <GlassCard key={i} className="p-6">
              <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center mb-6">
                <benefit.icon className="w-6 h-6 text-toffee-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-4">{benefit.title}</h3>
              <ul className="space-y-2">
                {benefit.items.map((item, j) => (
                  <li key={j} className="text-xs text-navy-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-navy-600 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section id="roles" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20 border-t border-navy-800/50 text-center">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Core Team</h2>
          <p className="text-navy-300 text-lg">We are an early-stage startup building the future of AI infrastructure. While we don't have predefined roles open right now, we are always looking for exceptional builders to join us on this journey.</p>
        </div>

        <GlassCard className="p-10 border-toffee-500/20 text-left">
          <h3 className="text-2xl font-bold text-white mb-6">Expression of Interest</h3>
          <p className="text-navy-300 mb-8 leading-relaxed">
            If you are a world-class engineer, designer, or researcher passionate about AI interoperability, we want to hear from you. We are particularly interested in individuals with experience in:
          </p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-3 text-navy-200">
              <CheckCircle2 className="w-5 h-5 text-toffee-400" /> Deep TypeScript & React Ecosystem Knowledge
            </li>
            <li className="flex items-center gap-3 text-navy-200">
              <CheckCircle2 className="w-5 h-5 text-toffee-400" /> Browser Extension Architecture (Manifest V3)
            </li>
            <li className="flex items-center gap-3 text-navy-200">
              <CheckCircle2 className="w-5 h-5 text-toffee-400" /> LLM Orchestration & Prompt Engineering
            </li>
          </ul>
          
          <a href="mailto:abhaydonde2007@gmail.com?subject=Expression%20of%20Interest:%20Toffee%20AI%20Core%20Team" className="btn-primary py-4 px-8 flex items-center justify-center gap-3 w-full sm:w-auto">
            <Mail className="w-5 h-5" /> Get In Touch
          </a>
        </GlassCard>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 text-center border-t border-navy-800/50">
        <h2 className="text-4xl font-extrabold text-white mb-6">Build the Future of AI Infrastructure</h2>
        <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto">
          Every conversation. Every line of code. Every design decision helps shape how the next generation of artificial intelligence remembers, collaborates, and evolves.
        </p>
        
        {/* Footer Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center gap-x-6 gap-y-4 text-xs font-medium text-navy-500 uppercase tracking-widest">
          <span>Remote-First</span> • 
          <span>Engineering-Driven</span> • 
          <span>AI Infrastructure</span> • 
          <span>Inclusive Workplace</span>
        </div>
        
        {/* Creator Note */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-toffee-500/50 tracking-widest uppercase">Designed & Developed by Abhay Sachin Donde</p>
        </div>
      </section>

    </div>
    </PageTransition>
  );
}
