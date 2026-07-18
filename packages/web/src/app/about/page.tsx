import { ArrowRight, Download, Brain, Globe, Shield, Sparkles, Workflow, Lock, Users, Zap } from "lucide-react";
import { PageTransition } from "@/components/ui/PageTransition";
import { GlassCard } from "@/components/ui/GlassCard";

export default function AboutPage() {
  return (
    <PageTransition>
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center pt-16 pb-24">
        {/* Glowing Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-toffee-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8 text-white">
          The Universal Memory Layer for <span className="toffee-gradient-text">Artificial Intelligence</span>
        </h1>
        
        <p className="text-xl text-navy-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          AI models are becoming smarter, but your knowledge remains trapped inside individual conversations and platforms. Toffee unlocks that knowledge, making your AI memory portable, secure, and instantly reusable across every major AI ecosystem.
        </p>

        <GlassCard className="inline-block px-6 py-4 mb-12 border-toffee-500/30 shadow-lg shadow-toffee-500/10">
          <p className="text-lg font-medium text-navy-200">
            We&apos;re building the infrastructure that allows AI conversations to move as freely as information moves across the internet.
          </p>
        </GlassCard>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/install" className="btn-primary py-4 px-8 text-lg inline-flex items-center gap-2">
            Start Free <Download className="w-5 h-5" />
          </Link>
          <a href="#technology" className="btn-secondary py-4 px-8 text-lg inline-flex items-center gap-2">
            Explore the Technology <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* ── The Vision ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20 border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-toffee-500" />
          The Vision
        </h2>
        <div className="prose prose-invert prose-lg text-navy-300 max-w-none space-y-6">
          <p>
            Artificial intelligence has transformed how humans create, research, code, learn, and solve problems.
          </p>
          <p className="font-semibold text-white">Yet every conversation begins the same way. Every AI platform starts with zero memory.</p>
          <ul className="list-disc pl-5 space-y-2 text-navy-400">
            <li>Projects lose continuity.</li>
            <li>Teams repeat context.</li>
            <li>Ideas become fragmented.</li>
            <li>Valuable knowledge disappears inside isolated chat histories.</li>
          </ul>
          <p className="text-xl font-medium text-toffee-400 py-4">
            Toffee exists to solve one fundamental challenge: Your AI memory should belong to you—not the platform you started on.
          </p>
          <p>
            We believe AI conversations should be portable, persistent, and interoperable, enabling users to move seamlessly between models without rebuilding context. Our long-term vision is to become the universal context infrastructure powering the next generation of AI applications.
          </p>
        </div>
      </section>

      {/* ── Why We Exist & Our Mission ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <GlassCard className="p-10 border-accent-violet/20 hover:border-accent-violet/40 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-accent-violet" /> Why We Exist
            </h2>
            <div className="text-navy-300 space-y-4">
              <p>The AI ecosystem is expanding rapidly, but memory remains fragmented. Users constantly switch between:</p>
              <div className="flex flex-wrap gap-2 py-2">
                {["ChatGPT", "Claude", "Gemini", "Copilot", "Grok", "Perplexity"].map(p => (
                  <span key={p} className="px-3 py-1 bg-navy-800 rounded-lg text-sm text-white">{p}</span>
                ))}
              </div>
              <p>Each model has unique strengths, but none can access the context built inside another platform. This creates unnecessary repetition, increased costs, slower workflows, and lost productivity.</p>
              <p className="font-medium text-accent-violet">Toffee bridges these disconnected ecosystems with a secure, intelligent context layer.</p>
            </div>
          </GlassCard>

          <GlassCard className="p-10 border-accent-emerald/20 hover:border-accent-emerald/40 transition-colors">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Brain className="w-6 h-6 text-accent-emerald" /> Our Mission
            </h2>
            <div className="text-navy-300 space-y-4">
              <p className="text-lg font-semibold text-white">Build the world&apos;s most trusted AI memory infrastructure.</p>
              <p>We want every AI interaction to become:</p>
              <ul className="grid grid-cols-2 gap-2 text-navy-400">
                <li className="flex items-center gap-2"><Check /> Portable</li>
                <li className="flex items-center gap-2"><Check /> Secure</li>
                <li className="flex items-center gap-2"><Check /> Searchable</li>
                <li className="flex items-center gap-2"><Check /> Shareable</li>
                <li className="flex items-center gap-2"><Check /> Persistent</li>
                <li className="flex items-center gap-2"><Check /> Private</li>
                <li className="flex items-center gap-2"><Check /> Cross-platform</li>
              </ul>
              <p className="font-medium text-accent-emerald pt-4">Just as cloud storage changed how we manage files, Toffee aims to change how we manage AI knowledge.</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ── Category & Technology ── */}
      <section id="technology" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-20 border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white mb-8">What is Toffee?</h2>
        <div className="prose prose-invert prose-lg text-navy-300 max-w-none space-y-6">
          <p>
            Toffee is an <strong>AI Context Transfer Protocol (ACTP)</strong> designed to preserve the intelligence accumulated during AI conversations. Instead of transferring raw chat history, Toffee extracts meaning, identifies important entities, compresses context, and packages it into a secure <code className="text-toffee-400">.toffee</code> bundle that can be understood by any supported AI model.
          </p>
          <p className="text-xl text-white font-medium">Think of it as a portable memory layer for modern AI workflows.</p>
          
          <h3 className="text-2xl font-bold text-white mt-12 mb-6">Category We Are Creating</h3>
          <p>Toffee is not another chatbot, AI assistant, prompt library, or standard extension. Toffee introduces an entirely new software category:</p>
          <div className="py-4 text-center">
            <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-toffee-400 to-accent-violet">AI Context Infrastructure</span>
          </div>
          <p>This category enables AI systems to exchange structured understanding rather than isolated conversations.</p>

          <h3 className="text-2xl font-bold text-white mt-12 mb-6">The Technology</h3>
          <p>Our platform combines browser-native intelligence with AI-powered semantic processing. Together, these technologies dramatically reduce repetitive prompting while preserving meaning and intent.</p>
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            {[
              "Intelligent Context Capture", "Semantic Compression", 
              "Knowledge Extraction", "Context Prioritization",
              "Entity Recognition", "Token Optimization",
              "Cross-Platform Injection", "Secure Bundle Generation",
              "Local-First Storage", "Enterprise Cloud Synchronization"
            ].map(tech => (
              <div key={tech} className="bg-navy-800/50 rounded-lg px-4 py-3 text-sm text-navy-200 border border-navy-700/50">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-6 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-navy-800 -z-10" />
          
          {[
            { step: "1", title: "Capture", icon: Sparkles, desc: "Extract structured conversation history from supported AI platforms." },
            { step: "2", title: "Understand", icon: Brain, desc: "Analyze intent, decisions, preferences, and context using AI semantic processing." },
            { step: "3", title: "Compress", icon: Zap, desc: "Transform thousands of tokens into highly efficient portable knowledge bundles." },
            { step: "4", title: "Continue", icon: ArrowRight, desc: "Inject that knowledge into another AI platform and continue without rebuilding context." }
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-navy-900 border border-navy-700 flex items-center justify-center mb-6 shadow-lg">
                <item.icon className="w-8 h-8 text-toffee-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-sm text-navy-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Principles & Privacy ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Shield className="w-8 h-8 text-accent-emerald" /> Privacy by Design
            </h2>
            <div className="text-navy-300 space-y-4">
              <p className="text-lg font-medium text-white">Privacy is not a feature. It is the foundation of our architecture.</p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3 bg-navy-800/30 p-3 rounded-lg"><Lock className="w-5 h-5 text-accent-emerald" /> Local-First Processing</li>
                <li className="flex items-center gap-3 bg-navy-800/30 p-3 rounded-lg"><Shield className="w-5 h-5 text-accent-emerald" /> Zero-Trust Architecture & End-to-End Encryption</li>
                <li className="flex items-center gap-3 bg-navy-800/30 p-3 rounded-lg"><Globe className="w-5 h-5 text-accent-emerald" /> Zero-Knowledge Cloud Storage & User-Owned Data</li>
              </ul>
              <p className="pt-4 font-bold text-accent-emerald">Your conversations remain yours.</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
              <Workflow className="w-8 h-8 text-toffee-500" /> Our Core Principles
            </h2>
            <div className="grid gap-4">
              {[
                { title: "User Ownership", desc: "Users own their AI memory." },
                { title: "Interoperability", desc: "Knowledge should flow across platforms." },
                { title: "Privacy First", desc: "Processing should happen locally whenever possible." },
                { title: "Performance", desc: "Context transfer should feel instant." },
                { title: "Transparency", desc: "Users should always know what is captured, processed, and shared." },
                { title: "Innovation", desc: "We build foundational infrastructure for the AI-native future." }
              ].map(principle => (
                <GlassCard key={principle.title} className="p-4 border-l-4 border-l-toffee-500">
                  <h4 className="text-white font-bold">{principle.title}</h4>
                  <p className="text-sm text-navy-400">{principle.desc}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Built for Everyone ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-12">Built for Everyone</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { icon: Code, title: "Developers", desc: "Move coding sessions between models." },
            { icon: Search, title: "Researchers", desc: "Preserve complex investigations." },
            { icon: BookOpen, title: "Students", desc: "Continue learning across assistants." },
            { icon: PenTool, title: "Creators", desc: "Maintain consistent creative direction." },
            { icon: Building2, title: "Enterprises", desc: "Secure collaborative workflows." }
              ].map(persona => (
            <GlassCard key={persona.title} className="p-6 flex flex-col items-center justify-center hover:-translate-y-1 transition-transform">
              <persona.icon className="w-8 h-8 text-toffee-400 mb-4" />
              <h4 className="text-white font-bold mb-2">{persona.title}</h4>
              <p className="text-xs text-navy-400 leading-relaxed">{persona.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── About the Creator ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-24 border-t border-navy-800/50">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column - Profile & Stats */}
          <div className="lg:w-1/3 w-full space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">About the Creator</h2>
              <div className="w-12 h-1 bg-toffee-500 rounded-full mb-6"></div>
              <p className="text-2xl font-bold text-white">Abhay Sachin Donde</p>
              <p className="text-toffee-400 font-medium text-lg">Founder & Builder of Toffee AI</p>
              <p className="text-navy-400 mt-2 flex items-center gap-2 font-medium">
                <Globe className="w-4 h-4" /> Nashik, Maharashtra, India
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "React", "Next.js", "Node.js", "PostgreSQL", "Firebase", "AI / ML", "Python", "Java", "C++"].map(skill => (
                <span key={skill} className="px-3 py-1 bg-navy-800/50 border border-navy-700/50 rounded-lg text-xs font-medium text-navy-200">
                  {skill}
                </span>
              ))}
            </div>
            <GlassCard className="p-6 border-toffee-500/20">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">🎓 Education</h4>
              <div className="space-y-4 text-sm text-navy-300">
                <div>
                  <p className="text-white font-medium">Bachelor of Engineering — Computer Eng.</p>
                  <p className="text-navy-400">Pravara College of Engineering · Ongoing</p>
                </div>
                <div className="pt-3 border-t border-navy-700/50">
                  <p className="text-white font-medium">Diploma in Computer Technology</p>
                  <p className="text-navy-400">K.K. Wagh Engineering College · Completed</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-accent-emerald/20">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">💻 Experience</h4>
              <div className="space-y-4 text-sm text-navy-300">
                <div>
                  <p className="text-white font-medium">Android Developer Intern</p>
                  <p className="text-navy-400">Sumago Infotech</p>
                  <p className="mt-2 text-xs">Built the "AEK Tunes" music application, gaining hands-on experience with native Android development patterns.</p>
                </div>
              </div>
            </GlassCard>
          </div>
          
          {/* Right Column - Biography */}
          <div className="lg:w-2/3 w-full prose prose-invert prose-lg text-navy-300 max-w-none">
            <p className="text-2xl text-white font-medium leading-relaxed mb-8">
              👋 Hello! I am a passionate developer specializing in bridging the gap between complex backend logic and intuitive, visually striking user experiences.
            </p>
            
            <p>
              My work lives at the intersection of engineering precision and creative vision. I firmly believe that studying the direction, pacing, and visual effects of great films gives me a unique advantage as a developer — it trains me to care deeply about the UI/UX, the flow of an application, and the ultimate story a product tells its users.
            </p>
            
            <h3 className="text-white font-bold mt-10 mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-toffee-400" /> Toffee — The Project You're Using Right Now
            </h3>
            <p>
              Toffee is my vision for what a modern AI memory layer should feel like — fast, secure, beautiful, and genuinely useful. Built with a cutting-edge stack of Next.js, Turborepo, PostgreSQL, and WebGL, it seamlessly connects AI platforms. 
            </p>
            <p>
              Every pixel of the UI was crafted from scratch — from the glowing glassmorphism cards to the interactive 3D node networks. Toffee represents my core belief that complex infrastructure tools don't have to look like boring developer tools.
            </p>

            <h3 className="text-white font-bold mt-10 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-accent-violet" /> ScholarBot & Other Projects
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

            <div className="mt-12 p-8 bg-navy-800/30 rounded-2xl border border-navy-700/50 hover:border-toffee-500/30 transition-colors">
              <h4 className="text-white font-bold text-xl mb-3 flex items-center gap-2">
                <Users className="w-6 h-6 text-toffee-400" /> Let's Connect
              </h4>
              <p className="text-base mb-6">
                Whether I'm optimizing an AI API route, training a hand-gesture recognition model, or conceptualizing a new startup — I'm always eager to push boundaries. I'm actively looking for opportunities to collaborate on innovative projects that leverage AI and modern web technologies.
              </p>
              <a href="mailto:abhay@example.com" className="btn-primary py-3 px-8 text-sm">
                Let's build something extraordinary
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Future & CTA ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 text-center border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white mb-6">Why Toffee Matters</h2>
        <div className="text-navy-300 text-lg space-y-4 mb-16">
          <p>The internet standardized information exchange. Cloud computing standardized infrastructure. Containers standardized deployment. Git standardized source code collaboration.</p>
          <p className="text-2xl font-bold text-toffee-400 py-4">Toffee aims to standardize AI context portability.</p>
          <p>We believe the next generation of AI will not be defined solely by larger models—but by how effectively knowledge moves between them.</p>
        </div>

        <GlassCard className="p-12 border-toffee-500/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-toffee-500/5" />
          <h3 className="text-4xl font-extrabold text-white mb-6 relative z-10">Build Without Starting Over</h3>
          <p className="text-lg text-navy-300 mb-8 max-w-2xl mx-auto relative z-10">
            Experience AI workflows where conversations, knowledge, and context travel with you—not remain locked inside a single platform.
          </p>
          <Link href="/install" className="btn-primary py-4 px-10 text-lg inline-flex items-center gap-2 relative z-10">
            <Download className="w-5 h-5" /> Install Toffee
          </Link>
          <p className="mt-6 text-sm text-navy-400 font-medium relative z-10 uppercase tracking-widest">Own your AI memory. Continue every conversation. Anywhere.</p>
        </GlassCard>
        
        {/* Creator Note */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay Sachin Donde</p>
        </div>
      </section>

    </div>
    </PageTransition>
  );
}

// Helpers for Built for Everyone icons
function Check() {
  return <Sparkles className="w-4 h-4 text-accent-emerald shrink-0" />;
}
function Code(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>; }
function Search(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>; }
function BookOpen(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>; }
function PenTool(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"></path><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="m2 2 7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>; }
function Building2(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>; }
