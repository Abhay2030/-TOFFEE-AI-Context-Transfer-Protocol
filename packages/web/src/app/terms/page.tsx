import { Shield, FileText, CheckCircle2, Lock, Scale, AlertTriangle, Cloud, HardDrive, Smartphone, Building2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-20 border-b border-navy-800/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-toffee-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-500 text-xs font-medium mb-6">
            <Scale className="w-4 h-4" />
            <span>Effective Date: July 24, 2026</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Clear Terms. Transparent Platform. <span className="toffee-gradient-text">Trusted Infrastructure.</span>
          </h1>
          
          <p className="text-xl text-navy-400 mb-10 leading-relaxed max-w-3xl">
            These Terms define your rights and responsibilities when using Toffee, ensuring a secure, reliable, and fair experience for individuals, developers, and enterprises.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-navy-400 uppercase tracking-wider">
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><FileText className="w-4 h-4 text-toffee-500" /> Transparent Framework</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Shield className="w-4 h-4 text-toffee-500" /> Secure Experience</span>
            <span className="flex items-center gap-2 bg-navy-900/50 px-3 py-1.5 rounded-full border border-navy-800"><Lock className="w-4 h-4 text-toffee-500" /> Intellectual Property Protection</span>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20">
        <div className="prose prose-invert prose-navy max-w-none space-y-16">
          
          {/* 1. Acceptance of Terms & 2. Definitions */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">1. Acceptance of Terms & 2. Definitions</h2>
            <p>
              By accessing or using the Toffee Browser Extension, Cloud Services, or APIs, you agree to these Terms. They constitute a binding legal agreement. 
            </p>
            <p><strong>Key Definitions:</strong></p>
            <ul className="text-sm text-navy-300 grid sm:grid-cols-2 gap-x-4 gap-y-2 list-none pl-0">
              <li><strong>Toffee:</strong> The platform and services provided by Toffee AI Inc.</li>
              <li><strong>.toffee Bundle:</strong> The compressed, portable context artifact.</li>
              <li><strong>Cloud Services:</strong> Optional sync and backend infrastructure.</li>
              <li><strong>AI Platform:</strong> Supported third-party LLM providers (e.g., ChatGPT, Claude).</li>
            </ul>
          </div>

          {/* 3. Eligibility & 4. User Accounts */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">3. Eligibility & 4. User Accounts</h2>
            <p>
              You must be of legal age in your jurisdiction to form a binding contract. If opening a Business account, you represent that you have the authority to bind that entity.
            </p>
            <p>
              You are responsible for maintaining the confidentiality of your credentials. Multi-factor authentication is strongly encouraged. Account sharing is strictly prohibited outside of designated Enterprise plan functionalities.
            </p>
          </div>

          {/* 5. Local Mode & 6. Cloud Services */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><HardDrive className="w-5 h-5 text-accent-emerald" /> 5. Local Mode</h2>
              <p className="text-sm text-navy-300">
                You may use Toffee completely anonymously in Local Mode. We offer no cloud synchronization, and you are entirely responsible for backing up your own local `.toffee` bundles.
              </p>
            </div>
            
            <div className="bg-navy-900/50 p-6 rounded-2xl border border-navy-800">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Cloud className="w-5 h-5 text-accent-violet" /> 6. Cloud Services</h2>
              <p className="text-sm text-navy-300">
                Cloud sync is an optional service subject to fair usage limits. While we maintain redundant backups, we do not guarantee absolute protection against data loss.
              </p>
            </div>
          </div>

          {/* 7. Browser Extension & 8. AI Platform Usage */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">7. Browser Extension & 8. AI Platform Usage</h2>
            <p>
              The Toffee Browser Extension requires specific browser permissions to inject and extract context from supported AI platforms. We provide automatic updates to maintain compatibility as these third-party platforms evolve.
            </p>
            <div className="bg-accent-violet/10 border border-accent-violet/20 p-4 rounded-xl mt-4">
              <p className="text-sm text-navy-200 mb-0 font-medium flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-accent-violet shrink-0 mt-0.5" />
                You are strictly responsible for complying with the Terms of Service of any third-party AI Platform (e.g., OpenAI, Anthropic) you interact with using Toffee. Toffee is an independent infrastructure tool and holds no official affiliation with these platforms.
              </p>
            </div>
          </div>

          {/* 9. Responsibilities & 10. Prohibited Activities */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">9. User Responsibilities & 10. Prohibited Activities</h2>
            <p>You agree to use the platform responsibly. Prohibited activities include:</p>
            <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm text-navy-300">
              {[
                "Illegal activities or fraud", 
                "Abuse of Toffee APIs", 
                "Reverse engineering (where prohibited)", 
                "Security testing without authorization", 
                "Malware distribution or Spam", 
                "Unauthorized automation", 
                "Circumventing usage limits", 
                "Copyright infringement"
              ].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> {item}
                </div>
              ))}
            </div>
          </div>

          {/* 11, 12, 13 Subscription, Billing, Refunds */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">11. Subscriptions, Billing & Refunds</h2>
            <p>
              Toffee offers Free, Pro, and Enterprise tiers. Subscriptions automatically renew unless canceled prior to the billing cycle. Taxes are calculated based on your jurisdiction. 
            </p>
            <p>
              Refunds are generally limited to 14 days post-purchase, subject to consumer law considerations and exceptions within negotiated Enterprise agreements.
            </p>
          </div>

          {/* 14. Intellectual Property */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">14. Intellectual Property</h2>
            <p>
              Toffee AI Inc. retains all rights, title, and interest in the Toffee platform, algorithms, code, and trademarks. You are granted a limited, revocable license to use the service.
            </p>
            <p className="font-semibold text-accent-emerald">
              You retain absolute ownership of all AI conversations and `.toffee` bundles you create.
            </p>
          </div>

          {/* 15, 16, 17 Liability, Availability, Termination */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">15. Liability, Availability & Termination</h2>
            <p>
              Toffee is provided "AS IS". We limit our liability for indirect damages, data loss, or outages caused by third-party AI platforms or force majeure events. 
            </p>
            <p>
              We aim for 99.9% uptime but reserve the right to perform planned maintenance. We may suspend or terminate accounts that violate these Terms. Upon termination, cloud data will be purged.
            </p>
          </div>

          {/* 18 & 19 Governing Law & Contact */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-navy-800 pb-2">18. Governing Law & 19. Contact</h2>
            <p>
              These Terms are governed by the laws of the State of California. Any disputes will be subject to binding arbitration, except where consumer rights dictate otherwise.
            </p>
            <p>
              For legal inquiries, enterprise contracts, or questions about these terms, contact us at: <a href="mailto:legal@toffee.ai" className="text-toffee-400 font-bold hover:underline">legal@toffee.ai</a>.
            </p>
          </div>

        </div>

        {/* ── Final Statement ── */}
        <div className="mt-24 p-10 glass-card border-toffee-500/30 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-toffee-500/5" />
          <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Our Mission</h3>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto relative z-10">
            Toffee exists to make AI knowledge portable, secure, and user-controlled. These Terms are designed to support that mission while providing a fair, transparent framework for everyone who uses the platform.
          </p>
          <div className="mt-8 text-center relative z-10">
            <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay</p>
          </div>
        </div>

      </section>
    </div>
  );
}
