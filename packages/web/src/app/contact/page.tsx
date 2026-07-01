import Link from "next/link";
import { ArrowRight, Mail, Phone, MessageSquare, Building2, Globe, Shield, Sparkles, AlertTriangle, Bug, LifeBuoy, FileText, ChevronRight, Lock } from "lucide-react";

const CONTACT_DEPARTMENTS = [
  {
    icon: Building2,
    title: "Sales Inquiry",
    purpose: "Help prospective customers understand pricing, features, and implementation.",
    idealFor: ["Product demonstrations", "Pricing questions", "Enterprise licensing", "Volume discounts"],
    cta: "Talk to Sales",
    email: "sales@toffee.ai",
    time: "< 2 hours",
    color: "toffee-500"
  },
  {
    icon: LifeBuoy,
    title: "Technical Support",
    purpose: "Dedicated support for technical issues.",
    idealFor: ["Installation", "Browser Extension", "Cloud Sync", "Performance"],
    cta: "Open Support Ticket",
    email: "support@toffee.ai",
    time: "< 4 hours",
    color: "accent-emerald"
  },
  {
    icon: Globe,
    title: "Enterprise Contact",
    purpose: "Large organizations requiring enterprise solutions.",
    idealFor: ["Enterprise Deployment", "SSO Integration", "Security Review", "Custom Contracts"],
    cta: "Contact Enterprise Team",
    email: "enterprise@toffee.ai",
    time: "< 1 hour",
    color: "accent-violet"
  },
  {
    icon: MessageSquare,
    title: "Partnerships",
    purpose: "Collaboration opportunities and integrations.",
    idealFor: ["AI Platform Integrations", "Browser Vendors", "Universities", "Technology Partners"],
    cta: "Propose Partnership",
    email: "partners@toffee.ai",
    time: "24-48 hours",
    color: "blue-500"
  },
  {
    icon: Sparkles,
    title: "Press & Media",
    purpose: "Support journalists, media organizations, and podcast hosts.",
    idealFor: ["Media inquiries", "Press kit download", "Speaking requests", "Interview requests"],
    cta: "Contact PR",
    email: "press@toffee.ai",
    time: "24 hours",
    color: "pink-500"
  },
  {
    icon: Shield,
    title: "Security Reporting",
    purpose: "Responsible disclosure of security vulnerabilities.",
    idealFor: ["Security vulnerabilities", "Authentication flaws", "Privacy concerns"],
    cta: "Report Vulnerability",
    email: "security@toffee.ai",
    time: "Immediate",
    color: "red-500"
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24 text-center border-b border-navy-800/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-toffee-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-white max-w-4xl mx-auto">
          Let&apos;s Build the Future of <span className="toffee-gradient-text">AI Together</span>
        </h1>
        
        <p className="text-xl text-navy-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Whether you&apos;re a developer, enterprise customer, researcher, investor, journalist, or AI enthusiast, we&apos;re here to help. Reach out to the right team and we&apos;ll connect you with the people who can assist you best.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#form" className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-2">
            Contact Our Team <ArrowRight className="w-5 h-5" />
          </a>
          <a href="#departments" className="btn-secondary py-4 px-8 text-lg inline-flex items-center gap-2">
            Schedule a Demo
          </a>
        </div>

        {/* World Map Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="aspect-[21/9] rounded-2xl glass-card border-navy-800/50 overflow-hidden flex items-center justify-center bg-navy-900/30 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent z-10 opacity-80" />
            <div className="absolute w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(168, 123, 68, 0.2) 0%, transparent 60%)' }} />
            <div className="text-center z-20">
              <Globe className="w-16 h-16 text-navy-600 mx-auto mb-4 animate-spin-slow" />
              <p className="text-navy-500 font-mono text-sm tracking-widest uppercase">[ Interactive Global AI Network Visual ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Center Departments ── */}
      <section id="departments" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">Intelligent Contact Hub</h2>
          <p className="text-navy-400">Select the right department to ensure your request reaches the correct team instantly.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CONTACT_DEPARTMENTS.map((dept, i) => (
            <div key={i} className={`glass-card p-8 border-t-4 border-t-${dept.color} hover:-translate-y-1 transition-transform`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl bg-${dept.color}/10 flex items-center justify-center`}>
                  <dept.icon className={`w-6 h-6 text-${dept.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-navy-500 font-semibold uppercase tracking-wider">Avg Response</p>
                  <p className="text-sm font-bold text-white">{dept.time}</p>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{dept.title}</h3>
              <p className="text-sm text-navy-400 mb-6 h-10">{dept.purpose}</p>
              
              <div className="mb-8">
                <p className="text-xs text-navy-500 font-semibold uppercase tracking-wider mb-3">Ideal For:</p>
                <ul className="space-y-2">
                  {dept.idealFor.slice(0, 3).map((item, j) => (
                    <li key={j} className="text-sm text-navy-300 flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full bg-${dept.color}`} /> {item}
                    </li>
                  ))}
                  {dept.idealFor.length > 3 && (
                    <li className="text-sm text-navy-500 italic pl-3.5">+ more</li>
                  )}
                </ul>
              </div>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-navy-800/50">
                <a href={`mailto:${dept.email}`} className="text-sm font-mono text-navy-400 hover:text-white transition-colors">
                  {dept.email}
                </a>
                <button className={`text-xs font-bold text-${dept.color} flex items-center gap-1 hover:gap-2 transition-all`}>
                  {dept.cta} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── General Contact Form ── */}
      <section id="form" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 border-t border-navy-800/50">
        <div className="glass-card p-8 md:p-12 border-toffee-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-toffee-500/5 rounded-full blur-3xl -z-10" />
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">Send a Message</h2>
            <p className="text-navy-400">Our AI-powered routing system will automatically assign your ticket to the correct department.</p>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Full Name *</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Email Address *</label>
                <input type="email" className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Company / Organization</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Inquiry Category *</label>
                <select className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50 appearance-none">
                  <option>General Inquiry</option>
                  <option>Sales & Enterprise</option>
                  <option>Technical Support</option>
                  <option>Partnerships</option>
                  <option>Press & Media</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-300 mb-2">Subject *</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
            </div>

            <div>
              <label className="block text-xs font-medium text-navy-300 mb-2">Message *</label>
              <textarea rows={5} className="w-full px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-navy-800/50">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="w-5 h-5 rounded border border-navy-600 bg-navy-900 flex items-center justify-center group-hover:border-toffee-500 transition-colors mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-transparent group-hover:text-toffee-500 transition-colors" />
                </div>
                <span className="text-xs text-navy-400 max-w-sm">
                  I agree to the Privacy Policy and consent to Toffee processing my data to handle this inquiry.
                </span>
              </label>
              
              <button type="button" className="btn-primary py-3 px-8 w-full sm:w-auto flex items-center justify-center gap-2">
                Send Message <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Bug & Feature Requests ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-8 border-navy-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <Bug className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Report a Bug</h3>
                <p className="text-sm text-navy-400">Help us fix technical issues.</p>
              </div>
            </div>
            <p className="text-sm text-navy-300 mb-6">
              Found an issue with the extension, browser compatibility, or context injection? Please provide your OS, browser version, and console logs.
            </p>
            <button className="text-red-500 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Submit Bug Report <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="glass-card p-8 border-navy-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-toffee-500/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-toffee-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Feature Requests</h3>
                <p className="text-sm text-navy-400">Help shape Toffee's roadmap.</p>
              </div>
            </div>
            <p className="text-sm text-navy-300 mb-6">
              Missing a crucial AI platform adapter? Need advanced Cloud Sync settings? Let us know what we should build next.
            </p>
            <button className="text-toffee-500 font-semibold text-sm flex items-center gap-2 hover:gap-3 transition-all">
              Request a Feature <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Community Hub ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Join Our Community</h2>
          <p className="text-navy-400">Connect with other AI professionals, developers, and the Toffee engineering team.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {["Discord Community", "GitHub Repository", "LinkedIn Page", "X (Twitter)", "Product Hunt", "YouTube"].map(platform => (
            <span key={platform} className="px-6 py-3 rounded-xl bg-navy-900 border border-navy-700 text-sm font-medium text-white hover:border-toffee-500/50 hover:bg-navy-800 transition-colors cursor-pointer">
              {platform}
            </span>
          ))}
        </div>
      </section>

      {/* ── Trust Indicators ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 border-t border-navy-800/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <LifeBuoy className="w-6 h-6 text-navy-500 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Global Support</h4>
            <p className="text-xs text-navy-400">24/7 technical assistance</p>
          </div>
          <div>
            <Lock className="w-6 h-6 text-navy-500 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Privacy by Design</h4>
            <p className="text-xs text-navy-400">Your data belongs to you</p>
          </div>
          <div>
            <Shield className="w-6 h-6 text-navy-500 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Security-First</h4>
            <p className="text-xs text-navy-400">Responsible disclosure program</p>
          </div>
          <div>
            <Building2 className="w-6 h-6 text-navy-500 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-1">Enterprise-Ready</h4>
            <p className="text-xs text-navy-400">Custom SLAs and deployments</p>
          </div>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 text-center border-t border-navy-800/50">
        <h2 className="text-4xl font-extrabold text-white mb-6">We&apos;re Here to Help You Build Better AI Workflows</h2>
        <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto">
          Whether you&apos;re exploring Toffee for personal productivity, enterprise AI adoption, technical integration, research collaboration, or strategic partnership, our team is ready to support your journey.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#form" className="btn-primary py-4 px-8 text-lg">
            Contact Us
          </a>
          <a href="#" className="btn-secondary py-4 px-8 text-lg">
            Join Our Discord
          </a>
        </div>
        
        {/* Creator Note */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-toffee-500/50 tracking-widest uppercase">Designed & Developed by Abhay</p>
        </div>
      </section>

    </div>
  );
}
