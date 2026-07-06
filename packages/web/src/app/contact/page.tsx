import Link from "next/link";
import { ArrowRight, Mail, Phone, MessageSquare, Building2, Globe, Shield, Sparkles, AlertTriangle, Bug, LifeBuoy, FileText, ChevronRight, Lock, CheckCircle2 } from "lucide-react";

const CONTACT_DEPARTMENTS = [
  {
    icon: Building2,
    title: "Sales Inquiry",
    purpose: "Help prospective customers understand pricing, features, and implementation.",
    idealFor: ["Product demonstrations", "Pricing questions", "Enterprise licensing", "Volume discounts"],
    cta: "Talk to Sales",
    email: "abhaydonde2007@gmail.com",
    time: "< 2 hours",
    color: "toffee-500"
  },
  {
    icon: LifeBuoy,
    title: "Technical Support",
    purpose: "Dedicated support for technical issues.",
    idealFor: ["Installation", "Browser Extension", "Cloud Sync", "Performance"],
    cta: "Open Support Ticket",
    email: "abhaydonde2007@gmail.com",
    time: "< 4 hours",
    color: "accent-emerald"
  },
  {
    icon: Globe,
    title: "Enterprise Contact",
    purpose: "Large organizations requiring enterprise solutions.",
    idealFor: ["Enterprise Deployment", "SSO Integration", "Security Review", "Custom Contracts"],
    cta: "Contact Enterprise Team",
    email: "abhaydonde2007@gmail.com",
    time: "< 1 hour",
    color: "accent-violet"
  },
  {
    icon: MessageSquare,
    title: "Partnerships",
    purpose: "Collaboration opportunities and integrations.",
    idealFor: ["AI Platform Integrations", "Browser Vendors", "Universities", "Technology Partners"],
    cta: "Propose Partnership",
    email: "abhaydonde2007@gmail.com",
    time: "24-48 hours",
    color: "blue-500"
  },
  {
    icon: Sparkles,
    title: "Press & Media",
    purpose: "Support journalists, media organizations, and podcast hosts.",
    idealFor: ["Media inquiries", "Press kit download", "Speaking requests", "Interview requests"],
    cta: "Contact PR",
    email: "abhaydonde2007@gmail.com",
    time: "24 hours",
    color: "pink-500"
  },
  {
    icon: Shield,
    title: "Security Reporting",
    purpose: "Responsible disclosure of security vulnerabilities.",
    idealFor: ["Security vulnerabilities", "Authentication flaws", "Privacy concerns"],
    cta: "Report Vulnerability",
    email: "abhaydonde2007@gmail.com",
    time: "Immediate",
    color: "red-500"
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero & Contact Form Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-toffee-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                Let&apos;s Build <br />
                <span className="toffee-gradient-text">Something Great</span>
              </h1>
              <p className="text-xl text-navy-400 leading-relaxed">
                Have a question, collaboration idea, bug report, or just want to say hello? I&apos;d love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-toffee-500/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">👨‍💻</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Creator</h3>
                  <p className="text-navy-300 font-medium">Abhay Donde</p>
                  <p className="text-sm text-navy-400">Software Engineer · AI Enthusiast</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-accent-violet/10 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-accent-violet" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Email</h3>
                  <a href="mailto:abhaydonde2007@gmail.com" className="text-navy-300 hover:text-toffee-400 transition-colors font-medium">
                    abhaydonde2007@gmail.com
                  </a>
                  <p className="text-sm text-navy-400 mt-1">Response within 24–48 hours</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-accent-emerald" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Location</h3>
                  <p className="text-navy-300 font-medium">Nashik, Maharashtra, India</p>
                  <p className="text-sm text-navy-400">Open to remote collaboration worldwide</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Education</h3>
                  <p className="text-navy-300 font-medium">BE Computer Engineering</p>
                  <p className="text-sm text-navy-400">Pravara College of Engineering · Ongoing</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-navy-800/50">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-xl">🤝</span> Open to Collaborate On
              </h3>
              <div className="flex flex-wrap gap-2">
                {["AI Projects", "SaaS Products", "Open Source", "Startup Ideas", "Web Apps", "Android"].map(item => (
                  <span key={item} className="px-4 py-2 bg-navy-900 border border-navy-700/50 rounded-lg text-sm font-medium text-navy-300">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="glass-card p-8 md:p-10 border-toffee-500/20 relative">
            <h2 className="text-2xl font-bold text-white mb-8">Send a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Your Name</label>
                <input type="text" placeholder="e.g. Rahul Sharma" className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Email Address</label>
                <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Topic</label>
                <select className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-navy-700 text-white focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50 appearance-none">
                  <option>General Enquiry</option>
                  <option>Bug Report</option>
                  <option>Feature Request</option>
                  <option>Collaboration / Business</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-300 mb-2">Message</label>
                <textarea rows={5} placeholder="Tell me what's on your mind..." className="w-full px-4 py-3 rounded-xl bg-navy-900/50 border border-navy-700 text-white placeholder-navy-500 focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50" />
              </div>
              
              <button type="button" className="btn-primary py-4 px-8 w-full flex items-center justify-center gap-2 font-bold text-base">
                <span className="text-xl">📨</span> Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── Guidelines ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
        <div className="glass-card p-8 border-navy-800 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-16 h-16 rounded-2xl bg-navy-900 flex items-center justify-center shrink-0 border border-navy-700">
            <span className="text-3xl">📬</span>
          </div>
          <div className="text-navy-300 text-sm leading-relaxed">
            <p className="mb-2"><strong className="text-white">Bug reports:</strong> Please describe the file type, browser, and steps to reproduce.</p>
            <p className="mb-2"><strong className="text-white">Feature requests:</strong> A short description of the problem you're solving is most helpful.</p>
            <p><strong className="text-white">Collaboration/Business:</strong> Include a brief overview of the project or opportunity.</p>
          </div>
        </div>
      </section>

      {/* ── About the Creator (Personalized for Toffee) ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-24 border-t border-navy-800/50">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          <div className="lg:w-1/3 w-full space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">About the Creator</h2>
              <div className="w-12 h-1 bg-toffee-500 rounded-full mb-6"></div>
              <p className="text-2xl font-bold text-white">Abhay Sachin Donde</p>
              <p className="text-toffee-400 font-medium text-lg">Founder & Builder of Toffee AI</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Firebase", "AI / ML", "Python", "Java", "C++", "Filmmaker & Story Writer"].map(skill => (
                <span key={skill} className="px-3 py-1 bg-navy-800/50 border border-navy-700/50 rounded-lg text-xs font-medium text-navy-200">
                  {skill}
                </span>
              ))}
            </div>
            
            <div className="glass-card p-6 border-accent-emerald/20">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">💻 Experience</h4>
              <div className="space-y-4 text-sm text-navy-300">
                <div>
                  <p className="text-white font-medium">Android Developer Intern</p>
                  <p className="text-navy-400">Sumago Infotech</p>
                  <p className="mt-2 text-xs">Built the "AEK Tunes" music application, gaining hands-on experience with native Android development patterns.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-2/3 w-full prose prose-invert prose-lg text-navy-300 max-w-none">
            <p className="text-2xl text-white font-medium leading-relaxed mb-8">
              👋 Hello! I am a passionate developer specializing in bridging the gap between complex backend logic and intuitive, visually striking user experiences.
            </p>
            
            <p>
              My work lives at the intersection of engineering precision and creative vision. I firmly believe that studying the direction, pacing, and visual effects of great films gives me a unique advantage as a developer — it trains me to care deeply about the UI/UX, the flow of an application, and the ultimate story a product tells its users.
            </p>
            
            <h3 className="text-white font-bold mt-10 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Toffee — The Project You're Using Right Now
            </h3>
            <p>
              Toffee is my vision for what a modern AI memory layer should feel like — fast, secure, beautiful, and genuinely useful. Built with a cutting-edge stack of Next.js, Turborepo, PostgreSQL, and WebGL, it seamlessly connects AI platforms. 
            </p>
            <p>
              Every pixel of the UI was crafted from scratch — from the glowing glassmorphism cards to the interactive 3D node networks. Toffee represents my core belief that complex infrastructure tools don't have to look like boring developer tools.
            </p>

            <h3 className="text-white font-bold mt-10 mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span> ScholarBot & Other Projects
            </h3>
            <p>
              Beyond Toffee, I've built <strong>ScholarBot</strong>, an elite multimodal AI tutoring platform engineered for university students using Python, Flask, and Gemini 2.5. 
            </p>
            <p>
              My other notable projects include <strong>Ziphay</strong> (a high-performance browser-based compression and upscaling tool), <strong>Air Canvas</strong> (Computer Vision-based gesture recognition), and <strong>KrishiMitra</strong> (an AgriTech advisory system bridging the information gap for Indian farmers).
            </p>

            <h3 className="text-white font-bold mt-10 mb-4">🎬 CineAbstra — The Creative Edge</h3>
            <p>
              Beyond software engineering, I am the Founder and Creative Director of <strong>CineAbstra</strong> — an upcoming platform dedicated to filmmaking and creative education. I have a profound passion for cinema and visual storytelling, which continuously inspires my approach to digital product design.
            </p>
          </div>
        </div>
      </section>

      {/* Creator Note */}
      <div className="mt-16 text-center pb-12">
        <p className="text-xs font-medium text-toffee-500/50 tracking-widest uppercase">Designed & Developed by Abhay</p>
      </div>
    </div>
  );
}
