import Link from "next/link";
import { ArrowRight, Shield, Scale, FileText, CheckCircle2, Lock, FileSignature, BookOpen, AlertTriangle, Building2, Globe } from "lucide-react";

const SECTIONS = [
  { id: "copyright", icon: FileText, title: "Copyright Policy", desc: "Information on ownership of the Toffee platform, website content, and source code." },
  { id: "trademark", icon: Shield, title: "Trademark Policy", desc: "Guidelines for permitted and restricted usage of Toffee brand assets." },
  { id: "ip", icon: Sparkles, title: "Intellectual Property", desc: "Details on proprietary technology, protocols, and user ownership of data." },
  { id: "acceptable-use", icon: AlertTriangle, title: "Acceptable Use Policy", desc: "Rules for responsible platform usage and prohibited activities." },
  { id: "dmca", icon: Scale, title: "DMCA Policy", desc: "Procedures for reporting copyright infringement and counter-notifications." },
  { id: "api-terms", icon: Code, title: "API Terms", desc: "Requirements, rate limits, and security obligations for developers." },
  { id: "open-source", icon: Github, title: "Open Source Licenses", desc: "Attributions, guidelines, and third-party library acknowledgments." },
  { id: "enterprise", icon: Building2, title: "Enterprise Agreements", desc: "MSAs, SLAs, DPAs, and NDAs for our enterprise clients." },
  { id: "export", icon: Globe, title: "Export Compliance", desc: "Information regarding international trade requirements and sanctions." }
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24 text-center border-b border-navy-800/50">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-violet/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-medium mb-6">
          <Scale className="w-4 h-4" />
          <span>Toffee Legal & Compliance Hub</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-white max-w-4xl mx-auto">
          Building AI Infrastructure with <span className="toffee-gradient-text">Trust & Transparency</span>
        </h1>
        
        <p className="text-xl text-navy-400 max-w-3xl mx-auto mb-12 leading-relaxed">
          Our legal framework is designed to protect our users, partners, developers, and enterprise customers while ensuring responsible innovation, privacy, security, and compliance across every aspect of the Toffee platform.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#documents" className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-2">
            View Legal Documents <ArrowRight className="w-5 h-5" />
          </a>
          <a href="/contact" className="btn-secondary py-4 px-8 text-lg inline-flex items-center gap-2">
            Contact Legal Team
          </a>
        </div>

        {/* Legal Dashboard Mockup */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          <div className="aspect-[21/9] rounded-2xl glass-card border-accent-violet/30 overflow-hidden flex items-center justify-center bg-navy-900/50 relative shadow-2xl shadow-accent-violet/10">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent z-10 opacity-80" />
            <div className="absolute w-full h-full opacity-30" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 60%)' }} />
            <div className="text-center z-20">
              <Shield className="w-16 h-16 text-accent-violet mx-auto mb-4 animate-pulse-soft" />
              <p className="text-navy-300 font-mono text-sm tracking-widest uppercase">[ Legal & Compliance Dashboard Visual ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Legal Overview & Company Info ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-white mb-6">Legal Overview</h2>
            <div className="prose prose-invert prose-lg text-navy-300 max-w-none">
              <p>
                This Legal Hub provides visitors with a clear overview of Toffee&apos;s legal framework. We are committed to transparency, a privacy-first philosophy, and the protection of user rights. Our infrastructure prioritizes intellectual property protection, rigorous enterprise governance, and proactive AI compliance.
              </p>
              <p>
                From responsible innovation to high security standards and regulatory compliance, we ensure that every user—whether an individual researcher or a large enterprise—can operate within a trusted environment.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-8 border-navy-800">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-toffee-400" /> Company Information
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex flex-col"><span className="text-navy-500 font-semibold uppercase tracking-wider text-[10px]">Registered Name</span><span className="text-white">Toffee AI Inc.</span></li>
              <li className="flex flex-col"><span className="text-navy-500 font-semibold uppercase tracking-wider text-[10px]">Headquarters</span><span className="text-white">San Francisco, CA (Remote-First)</span></li>
              <li className="flex flex-col"><span className="text-navy-500 font-semibold uppercase tracking-wider text-[10px]">Corporate Email</span><a href="mailto:abhaydonde2007@gmail.com" className="text-toffee-400 hover:text-toffee-300">abhaydonde2007@gmail.com</a></li>
              <li className="flex flex-col"><span className="text-navy-500 font-semibold uppercase tracking-wider text-[10px]">Founder</span><span className="text-white">Abhay</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Document Directory ── */}
      <section id="documents" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Legal Directory</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section, i) => (
            <a href={`#${section.id}`} key={i} className="glass-card p-6 border-navy-800 hover:border-accent-violet/30 hover:-translate-y-1 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center mb-4 group-hover:bg-accent-violet/20 transition-colors">
                <section.icon className="w-5 h-5 text-navy-400 group-hover:text-accent-violet transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{section.title}</h3>
              <p className="text-sm text-navy-400">{section.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ── Key Policies ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20 space-y-24">
        
        {/* Intellectual Property */}
        <div id="ip" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-toffee-500" /> Intellectual Property & Copyright
          </h2>
          <div className="prose prose-invert prose-navy max-w-none">
            <p>
              Toffee retains full ownership of the AI Context Transfer Protocol, the `.toffee` file format, our semantic compression algorithms, browser extension source code, APIs, platform architecture, and all proprietary designs and trademarks.
            </p>
            <div className="bg-accent-emerald/10 border border-accent-emerald/20 rounded-xl p-6 my-6">
              <h4 className="text-accent-emerald font-bold mb-2 flex items-center gap-2"><Lock className="w-4 h-4" /> User Data Ownership</h4>
              <p className="text-sm text-navy-200 mb-0">
                You retain complete ownership of your own AI conversations, injected prompts, and any uploaded content. Toffee does not claim ownership of the context you process through our platform.
              </p>
            </div>
            <p>
              Our <strong>Trademark Policy</strong> strictly governs the use of the Toffee name, logo, brand colors, and assets. Third-party references must follow our brand guidelines. Please contact us for permission requests or to report trademark misuse.
            </p>
          </div>
        </div>

        {/* Acceptable Use */}
        <div id="acceptable-use" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-accent-violet" /> Acceptable Use Policy
          </h2>
          <div className="prose prose-invert prose-navy max-w-none">
            <p>We require all users to engage responsibly. Prohibited activities on the Toffee platform include, but are not limited to:</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mb-6">
              {["Illegal activities", "Malware distribution", "Credential theft", "Unauthorized access", "Reverse engineering", "Abuse of APIs", "Automated attacks", "Spam & Harassment", "Intellectual property infringement", "Bypassing security limits"].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-navy-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {item}
                </div>
              ))}
            </div>
            <p>Violations of this policy may result in warnings, suspensions, or immediate account termination.</p>
          </div>
        </div>

        {/* Compliance & Security */}
        <div id="compliance" className="scroll-mt-32">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-accent-emerald" /> Regulatory & Security Compliance
          </h2>
          <div className="prose prose-invert prose-navy max-w-none">
            <p>Toffee is built on a foundation of strict security commitments and regulatory compliance.</p>
            <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0">
              <li className="bg-navy-900/50 p-4 rounded-xl border border-navy-800">
                <strong className="block text-white mb-1">Data Privacy</strong>
                <span className="text-sm text-navy-400">GDPR & CCPA compliance frameworks are actively maintained.</span>
              </li>
              <li className="bg-navy-900/50 p-4 rounded-xl border border-navy-800">
                <strong className="block text-white mb-1">Architecture</strong>
                <span className="text-sm text-navy-400">Zero-Trust architecture with Local-First Processing.</span>
              </li>
              <li className="bg-navy-900/50 p-4 rounded-xl border border-navy-800">
                <strong className="block text-white mb-1">Certifications</strong>
                <span className="text-sm text-navy-400">SOC 2 Type II & ISO 27001 (Planned milestones).</span>
              </li>
              <li className="bg-navy-900/50 p-4 rounded-xl border border-navy-800">
                <strong className="block text-white mb-1">Accessibility</strong>
                <span className="text-sm text-navy-400">Adherence to WCAG 2.2 AA standards.</span>
              </li>
            </ul>
          </div>
        </div>

      </section>

      {/* ── Contact & Legal Resources ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="glass-card p-10 border-toffee-500/20">
            <h3 className="text-2xl font-bold text-white mb-6">Contact the Legal Team</h3>
            <p className="text-navy-300 mb-8">
              For dedicated legal inquiries, privacy requests, DMCA notices, or compliance documentation, please reach out to our legal department. Expected response time is 2-3 business days.
            </p>
            <a href="mailto:abhaydonde2007@gmail.com" className="btn-primary py-3 px-6 inline-flex items-center gap-2 w-full justify-center">
              Email Legal Department <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="glass-card p-10 border-navy-800">
            <h3 className="text-2xl font-bold text-white mb-6">Legal Resource Center</h3>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Data Processing Agreement", "Security Whitepaper", "Brand Guidelines", "API Terms"].map(doc => (
                <li key={doc}>
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg bg-navy-900/50 hover:bg-navy-800 transition-colors group text-sm text-navy-300 hover:text-white">
                    <span className="flex items-center gap-2"><FileSignature className="w-4 h-4 text-toffee-500" /> {doc}</span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Trust Indicators ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 border-t border-navy-800/50">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-bold text-navy-500 uppercase tracking-widest text-center">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> Privacy First</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> Local-First Architecture</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> User Data Ownership</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> Transparent Policies</span>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 text-center border-t border-navy-800/50">
        <h2 className="text-4xl font-extrabold text-white mb-6">Trust Is the Foundation of AI Infrastructure</h2>
        <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto">
          Toffee is committed to building secure, transparent, and legally compliant technology that empowers users and organizations to own, protect, and transfer their AI knowledge with confidence.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-primary py-4 px-8 text-sm">Explore Privacy Center</button>
          <button className="btn-secondary py-4 px-8 text-sm">Review Security Docs</button>
        </div>
        
        {/* Creator Note */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay</p>
        </div>
      </section>

    </div>
  );
}

// Helper Icons
function Sparkles(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg> }
function Code(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> }
function Github(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> }
