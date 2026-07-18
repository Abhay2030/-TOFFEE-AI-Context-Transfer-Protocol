import { Shield, Lock, Eye, Database, Globe, AlertTriangle, FileSignature, CheckCircle2, Cloud, HardDrive, Smartphone, Users } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PrivacyPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-20 border-b border-navy-800/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-emerald/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Last Updated: July 24, 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Privacy Built Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-emerald to-emerald-400">Every Layer</span>
          </h1>
          
          <p className="text-xl text-navy-400 mb-10 leading-relaxed max-w-3xl">
            Your AI conversations are valuable intellectual assets. Toffee is designed to protect them through local-first processing, enterprise-grade encryption, transparent data practices, and user-controlled privacy.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-navy-400 uppercase tracking-wider">
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> Privacy by Design</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><HardDrive className="w-4 h-4 text-accent-emerald" /> Local-First</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Lock className="w-4 h-4 text-accent-emerald" /> E2E Encryption</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Shield className="w-4 h-4 text-accent-emerald" /> Zero-Knowledge</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Globe className="w-4 h-4 text-accent-emerald" /> GDPR & CCPA Ready</span>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20">
        <div className="prose prose-invert prose-navy max-w-none space-y-16">
          
          {/* 1. Introduction */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-navy-800 pb-2"><FileSignature className="w-6 h-6 text-toffee-500" /> 1. Introduction</h2>
            <p>
              This Privacy Policy explains how Toffee collects, processes, stores, protects, and manages user information. We are deeply committed to transparency, user ownership, and compliance with global privacy regulations. This policy covers all Toffee products including the Browser Extension, Web Dashboard, Cloud Services, APIs, and future mobile applications.
            </p>
          </div>

          {/* 2. Privacy Principles */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-navy-800 pb-2"><Shield className="w-6 h-6 text-toffee-500" /> 2. Privacy Principles</h2>
            <p>Our core philosophy dictates that <strong>you own your AI data.</strong></p>
            <ul className="grid sm:grid-cols-2 gap-4 list-none pl-0 mt-4">
              <li className="bg-navy-900 p-4 rounded-xl border border-navy-800">
                <strong className="text-white block mb-1">Local-First Processing</strong>
                <span className="text-sm text-navy-400">Data stays on your device by default.</span>
              </li>
              <li className="bg-navy-900 p-4 rounded-xl border border-navy-800">
                <strong className="text-white block mb-1">Minimal Data Collection</strong>
                <span className="text-sm text-navy-400">We only collect what is necessary to operate.</span>
              </li>
              <li className="bg-navy-900 p-4 rounded-xl border border-navy-800">
                <strong className="text-white block mb-1">Explicit Consent</strong>
                <span className="text-sm text-navy-400">Features requiring cloud access are strictly opt-in.</span>
              </li>
              <li className="bg-navy-900 p-4 rounded-xl border border-navy-800">
                <strong className="text-white block mb-1">No Selling Data</strong>
                <span className="text-sm text-navy-400">We never sell your personal or conversational data.</span>
              </li>
            </ul>
          </div>

          {/* 3. Information We Collect */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2 border-b border-navy-800 pb-2"><Database className="w-6 h-6 text-toffee-500" /> 3. Information We Collect</h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-white font-semibold mb-2">Account Information</h4>
                <p className="text-sm">Name, email address, profile photo (if authenticated via OAuth), organization, and subscription tier.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Technical Information</h4>
                <p className="text-sm">Browser type, device OS, extension version, anonymized IP for security, and crash logs.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Usage Information</h4>
                <p className="text-sm">Feature usage, settings, storage usage, token analytics, and general performance metrics.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Billing Information</h4>
                <p className="text-sm">Subscription status, invoices, payment references, and billing history (processed securely via Stripe).</p>
              </div>
            </div>
          </div>

          {/* 4 & 5. Local vs Cloud Data */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><HardDrive className="w-5 h-5 text-accent-emerald" /> 4. Local Data</h2>
              <p className="text-sm mb-4">The following remains strictly on your device unless you explicitly opt into Cloud Sync:</p>
              <ul className="text-sm text-navy-300 space-y-1">
                <li>• Raw AI conversations</li>
                <li>• `.toffee` bundles</li>
                <li>• IndexedDB storage</li>
                <li>• Local cache & offline library</li>
              </ul>
              <p className="text-xs text-accent-emerald mt-4 font-semibold">Local processing is always our default.</p>
            </div>
            
            <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Cloud className="w-5 h-5 text-accent-violet" /> 5. Cloud Data</h2>
              <p className="text-sm mb-4">The following data interacts with our secure cloud servers:</p>
              <ul className="text-sm text-navy-300 space-y-1">
                <li>• Account metadata</li>
                <li>• Synced bundles (End-to-End Encrypted)</li>
                <li>• Shared links</li>
                <li>• Subscription information</li>
              </ul>
            </div>
          </div>

          {/* 6. AI Conversation Processing */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">6. AI Conversation Processing</h2>
            <p>
              Our processing pipeline includes capture, semantic compression, entity extraction, token optimization, and bundle generation. 
            </p>
            <div className="bg-accent-violet/10 border border-accent-violet/20 p-4 rounded-xl mt-4">
              <p className="text-sm text-navy-200 mb-0 font-medium">
                <strong>Important:</strong> Raw conversations never leave your device unless you specifically utilize a server-side compression API endpoint. Even then, processing is temporary, and raw transcripts are immediately discarded from memory after the `.toffee` bundle is generated.
              </p>
            </div>
          </div>

          {/* 7 & 8 Storage & Encryption */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">7. Data Storage & 8. Encryption</h2>
            <p>
              Local data is stored in your browser&apos;s IndexedDB. Cloud data is stored securely in PostgreSQL and AWS S3 with strict data residency controls.
            </p>
            <p>
              All data in transit is protected using <strong>TLS 1.3</strong>. Data at rest is encrypted using <strong>AES-256-GCM</strong>. For users with Cloud Sync enabled, we employ <strong>End-to-End Encryption</strong> with secure key management, meaning even Toffee engineers cannot read your synced conversations.
            </p>
          </div>

          {/* 9 & 10 Local-Only Mode & Cloud Sync */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">9. Local-Only Mode & 10. Cloud Sync</h2>
            <p>
              <strong>Local-Only Mode</strong> is one of Toffee&apos;s strongest differentiators. It requires no account, executes no cloud uploads, and provides complete privacy.
            </p>
            <p>
              <strong>Cloud Sync</strong> is strictly an optional feature. It requires explicit user consent to synchronize `.toffee` bundles across multiple devices securely.
            </p>
          </div>

          {/* 11 & 12 Analytics & Cookies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">11. Analytics & 12. Cookies</h2>
            <p>
              We distinguish between product analytics (performance, crash reports) and security analytics (abuse detection). We allow users to opt-out of product analytics directly from their dashboard.
            </p>
            <p>
              We use essential cookies for authentication and session management. We do not use third-party tracking cookies for targeted advertising.
            </p>
          </div>

          {/* 13 & 14 Third-Party & Auth Providers */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">13. Third-Party Services & 14. Authentication Providers</h2>
            <p>Toffee utilizes trusted third-party providers:</p>
            <ul className="list-disc pl-5">
              <li><strong>Google & GitHub OAuth:</strong> For secure authentication (accessing only basic profile info like email and name).</li>
              <li><strong>AWS:</strong> For cloud infrastructure.</li>
              <li><strong>Stripe:</strong> For secure payment processing.</li>
            </ul>
          </div>

          {/* 16, 17, 18 User Rights, GDPR, CCPA */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">16. User Rights, GDPR & CCPA Compliance</h2>
            <p>
              Under GDPR and CCPA, you have the right to access, correct, export, restrict, or permanently delete your data. You may withdraw consent at any time. Non-discrimination rules apply, meaning you will not be penalized for exercising your privacy rights.
            </p>
          </div>

          {/* 19 & 20 Deletion & Portability */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">19. Data Deletion & 20. Portability</h2>
            <p>
              You can instantly delete local data via the extension settings. Account deletion will permanently purge your data from our cloud servers within 30 days (including backups).
            </p>
            <p>
              Toffee embraces data portability. You can export your entire library as a ZIP archive of `.toffee` files or raw JSON at any time.
            </p>
          </div>

          {/* Security & Contact */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">Security Measures & Contact</h2>
            <p>
              Our architecture employs Zero Trust principles, rate limiting, continuous monitoring, and secure development lifecycles. 
            </p>
            <p>
              For privacy-related requests, data protection inquiries, or to contact our DPO, please email: <a href="mailto:abhaydonde2007@gmail.com" className="text-toffee-400 font-bold hover:underline">abhaydonde2007@gmail.com</a>.
            </p>
          </div>

        </div>

        {/* ── Final Privacy Commitment ── */}
        <GlassCard className="mt-24 p-10 border-accent-emerald/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-accent-emerald/5" />
          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Our Final Privacy Commitment</h3>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto relative z-10">
            Your AI knowledge belongs to you. Toffee is committed to protecting it through transparency, privacy-first engineering, and industry-leading security practices.
          </p>
          <div className="mt-8 text-center relative z-10">
            <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay Sachin Donde</p>
          </div>
        </GlassCard>

      </section>
    </div>
    </PageTransition>
  );
}
