import { Shield, Eye, Settings, CheckCircle2, Globe, FileText, Settings2, Smartphone, Key, Lock } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-20 border-b border-navy-800/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-emerald/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-medium mb-6">
            <Eye className="w-4 h-4" />
            <span>Effective Date: July 24, 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Transparent Cookie Practices. <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-emerald to-emerald-400">Built Around Privacy.</span>
          </h1>
          
          <p className="text-xl text-navy-400 mb-10 leading-relaxed max-w-3xl">
            Toffee uses only the cookies and similar technologies necessary to provide a secure, reliable, and personalized experience. You remain in control of your preferences at all times.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10 text-xs font-bold text-navy-400 uppercase tracking-wider">
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><CheckCircle2 className="w-4 h-4 text-accent-emerald" /> Privacy by Design</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Settings2 className="w-4 h-4 text-accent-emerald" /> User-Controlled</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Globe className="w-4 h-4 text-accent-emerald" /> GDPR & CCPA Ready</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Shield className="w-4 h-4 text-accent-emerald" /> Minimal Tracking</span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="btn-primary py-3 px-6 text-sm">Manage Cookie Preferences</button>
            <a href="/privacy" className="btn-secondary py-3 px-6 text-sm">Privacy Center</a>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20">
        <div className="prose prose-invert prose-navy max-w-none space-y-16">
          
          {/* 1 & 2. Intro & What Are Cookies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">1. Introduction & 2. What Are Cookies?</h2>
            <p>
              This Cookie Policy explains how Toffee uses cookies and similar technologies across our website, SaaS dashboard, and authentication systems. Please note that the <strong>Toffee Browser Extension</strong> primarily stores operational data locally via IndexedDB and uses cookies strictly for web-based services and authentication.
            </p>
            <p>
              Cookies are small data files stored on your device. We use HTTP Cookies, Session Cookies, Persistent Cookies, Local Storage, IndexedDB, and secure Authentication Tokens to improve functionality, security, and your overall user experience.
            </p>
          </div>

          {/* 3. Why We Use Cookies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">3. Why We Use Cookies</h2>
            <p>We use cookies strictly for the following purposes:</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm text-navy-300">
              {[
                "Secure user authentication", 
                "Account & theme preferences", 
                "Language selection", 
                "Security & fraud protection", 
                "Performance optimization", 
                "Anonymous analytics", 
                "Subscription management", 
                "User experience improvements"
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-emerald" /> {item}
                </div>
              ))}
            </div>
            <div className="bg-accent-emerald/10 border border-accent-emerald/20 p-4 rounded-xl mt-4">
              <p className="text-sm text-navy-200 mb-0 font-medium flex items-start gap-2">
                <Lock className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
                <strong>Privacy Guarantee:</strong> Cookies are NEVER used to read, track, or access your raw AI conversations.
              </p>
            </div>
          </div>

          {/* 4. Types of Cookies */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-navy-800 pb-2">4. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Key className="w-4 h-4 text-toffee-400" /> Essential Cookies</h3>
                <p className="text-sm text-navy-300">Required for core functionality such as user authentication, session management, CSRF protection, and payment processing. These cannot be disabled without breaking the platform.</p>
              </div>

              <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Settings className="w-4 h-4 text-accent-violet" /> Functional Cookies</h3>
                <p className="text-sm text-navy-300">Improve usability by remembering your language, theme, dashboard preferences, and time zone settings.</p>
              </div>

              <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Globe className="w-4 h-4 text-blue-400" /> Analytics Cookies</h3>
                <p className="text-sm text-navy-300">Help us improve the product via anonymous traffic statistics, performance monitoring, and error tracking. You can opt out of these at any time.</p>
              </div>

              <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Smartphone className="w-4 h-4 text-pink-400" /> Marketing Cookies</h3>
                <p className="text-sm text-navy-300">Toffee currently <strong>does not</strong> use marketing cookies. If introduced for campaign attribution or referral tracking in the future, explicit opt-in consent will be required.</p>
              </div>
            </div>
          </div>

          {/* 5. Third-Party Cookies & 6. Browser Extension */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">5. Third-Party Cookies & 6. Browser Extension Storage</h2>
            <p>
              Certain third-party providers may set cookies to provide their services securely. This includes Google OAuth, GitHub OAuth, Stripe (for payments), Cloudflare (for security), and AWS.
            </p>
            <p>
              <strong>Regarding the Browser Extension:</strong> The Toffee extension relies primarily on IndexedDB and local browser cache rather than traditional cookies. Extension storage is isolated and strictly separate from general website tracking.
            </p>
          </div>

          {/* 7. Lifetimes & 8. Browser Controls */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">7. Cookie Lifetimes & 8. Browser Controls</h2>
            <p>
              <strong>Session Cookies</strong> are deleted when you close your browser. <strong>Persistent Cookies</strong> remain until they expire or you manually delete them.
            </p>
            <p>
              You can manage, view, block, or delete cookies at any time through your browser settings (Chrome, Firefox, Safari, Edge). Please note that disabling essential cookies will prevent you from logging into your Toffee account.
            </p>
          </div>

          {/* 9, 10, 11 Consent, Security, International Compliance */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">Consent, Security & International Compliance</h2>
            <p>
              We utilize a comprehensive consent management system allowing you to "Accept All", "Reject Optional", or customize your preferences anytime. 
            </p>
            <p>
              We adhere strictly to the GDPR, CCPA, and the ePrivacy Directive. Sensitive authentication cookies are encrypted, and our security measures prevent unauthorized access.
            </p>
          </div>

          {/* 12. Updates & 13. Contact */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">12. Updates & 13. Contact</h2>
            <p>
              We may update this policy as our platform evolves. Material changes will be communicated via the dashboard or email.
            </p>
            <p>
              For questions regarding your cookie preferences, privacy requests, or technical support, contact our Data Protection Officer at: <a href="mailto:privacy@toffee.ai" className="text-accent-emerald font-bold hover:underline">privacy@toffee.ai</a>.
            </p>
          </div>

        </div>

        {/* ── Final Statement ── */}
        <div className="mt-24 p-10 glass-card border-accent-emerald/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-accent-emerald/5" />
          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Privacy Starts with Transparency</h3>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto relative z-10">
            Toffee is committed to using cookies responsibly, limiting data collection to what is necessary for security and functionality, and giving every user meaningful control over their privacy preferences.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8 relative z-10">
            <button className="btn-primary py-3 px-6 text-sm">Manage Cookie Preferences</button>
            <a href="/privacy" className="btn-secondary py-3 px-6 text-sm">View Privacy Policy</a>
          </div>
          <div className="mt-8 text-center relative z-10">
            <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay Sachin Donde</p>
          </div>
        </div>

      </section>
    </div>
  );
}
