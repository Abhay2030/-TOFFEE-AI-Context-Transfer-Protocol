import Link from "next/link";
import { ArrowRight, Users, Briefcase, ChevronRight, CheckCircle2, Shield, Sparkles, Terminal, Layers, Heart, Coffee, Globe, Cpu } from "lucide-react";

const POSITIONS = [
  {
    department: "Engineering",
    roles: [
      "Senior Frontend Engineer", "Backend Engineer", "Full Stack Engineer", 
      "Browser Extension Engineer", "AI Engineer", "Machine Learning Engineer", 
      "DevOps Engineer", "Security Engineer", "Site Reliability Engineer", "QA Automation Engineer"
    ]
  },
  {
    department: "Product",
    roles: ["Product Manager", "Technical Program Manager", "Product Designer", "UX Researcher"]
  },
  {
    department: "Design",
    roles: ["Senior Product Designer", "Visual Designer", "Motion Designer", "Brand Designer", "3D Designer"]
  },
  {
    department: "Growth & Marketing",
    roles: ["Developer Relations Engineer", "Technical Writer", "Content Strategist", "Product Marketing Manager", "Community Manager"]
  }
];

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
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-24 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-toffee-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald text-xs font-medium mb-6">
          <Briefcase className="w-4 h-4" />
          <span>We are hiring worldwide</span>
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
          <div className="aspect-[21/9] rounded-2xl glass-card border-toffee-500/30 overflow-hidden flex items-center justify-center bg-navy-900/50 shadow-2xl shadow-toffee-500/10 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent z-10 opacity-80" />
            <div className="absolute w-full h-full" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(168, 123, 68, 0.1) 0%, transparent 70%)' }} />
            <div className="text-center z-20">
              <Cpu className="w-16 h-16 text-toffee-400 mx-auto mb-4 animate-pulse-soft" />
              <p className="text-navy-300 font-mono text-sm tracking-widest uppercase">[ Interactive 3D AI Memory Network Visual ]</p>
            </div>
          </div>
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
          <div className="glass-card p-8 border-l-4 border-l-toffee-500">
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
          </div>
        </div>
      </section>

      {/* ── Company Culture & Principles ── */}
      <section id="culture" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-16">Our Culture & Engineering Principles</h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-6 border-navy-800 hover:border-toffee-500/30 transition-colors">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-toffee-400"/> Build for the Long Term</h4>
            <p className="text-sm text-navy-400">We prioritize durable engineering over short-term shortcuts. Everyone owns outcomes, not just tasks.</p>
          </div>
          <div className="glass-card p-6 border-navy-800 hover:border-accent-violet/30 transition-colors">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Terminal className="w-4 h-4 text-accent-violet"/> Innovation & Learning</h4>
            <p className="text-sm text-navy-400">Question assumptions, experiment boldly. We invest in personal growth through research and mentorship.</p>
          </div>
          <div className="glass-card p-6 border-navy-800 hover:border-accent-emerald/30 transition-colors">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-accent-emerald"/> Transparency</h4>
            <p className="text-sm text-navy-400">Open communication, honest feedback, and clear decision-making are part of our daily culture.</p>
          </div>
        </div>

        <div className="glass-card p-10 bg-navy-900/50">
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
        </div>
      </section>

      {/* ── Benefits & Perks ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Benefits & Perks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((benefit, i) => (
            <div key={i} className="glass-card p-6">
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
            </div>
          ))}
        </div>
      </section>

      {/* ── Hiring Process ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Our Hiring Process</h2>
        <p className="text-center text-navy-400 mb-12 max-w-2xl mx-auto">We value transparency and respect your time. Candidates receive timely feedback throughout the process.</p>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {["Application Review", "Intro Call", "Technical Assessment", "System Design", "Team Interview", "Leadership", "Offer"].map((step, i) => (
            <div key={i} className="flex flex-col items-center flex-1 w-full relative">
              <div className="w-10 h-10 rounded-full bg-navy-800 border-2 border-toffee-500/50 flex items-center justify-center text-toffee-400 font-bold text-sm mb-3 relative z-10">
                {i + 1}
              </div>
              <span className="text-xs text-center font-medium text-navy-300">{step}</span>
              {i < 6 && <div className="hidden md:block absolute top-5 left-[50%] w-full h-0.5 bg-navy-800" />}
            </div>
          ))}
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section id="roles" className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20 border-t border-navy-800/50">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white">Open Positions</h2>
          <span className="text-sm font-medium text-toffee-400">Remote-First • Global</span>
        </div>

        <div className="space-y-12">
          {POSITIONS.map((dept, i) => (
            <div key={i}>
              <h3 className="text-xl font-bold text-white mb-6 pb-2 border-b border-navy-800/50">{dept.department}</h3>
              <div className="grid gap-4">
                {dept.roles.map((role, j) => (
                  <Link href="#" key={j} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-toffee-500/30 transition-all cursor-pointer">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-toffee-400 transition-colors mb-1">{role}</h4>
                      <p className="text-sm text-navy-400">Remote • Full-time</p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex items-center gap-2 text-toffee-400 font-medium text-sm">
                      Apply Now <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Internship Program ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="glass-card p-12 border-accent-violet/20 bg-gradient-to-br from-navy-900 to-navy-950 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/10 rounded-full blur-3xl" />
          <h2 className="text-3xl font-bold text-white mb-4">Build the Future of AI: Internship Program</h2>
          <p className="text-navy-300 max-w-2xl mb-8">
            Our internship program is designed for ambitious students and recent graduates who want to work on real products, not practice projects. Interns contribute directly to production systems with guidance from experienced mentors.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {["Frontend", "Backend", "AI & ML", "Product Design", "DevOps & Cloud", "Cybersecurity"].map(track => (
              <span key={track} className="px-3 py-1 bg-navy-800 rounded-full text-xs text-navy-200 border border-navy-700">
                {track}
              </span>
            ))}
          </div>
          <Link href="#" className="btn-primary py-3 px-6 inline-flex items-center gap-2">
            View Internship Tracks <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Final Call to Action ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24 text-center border-t border-navy-800/50">
        <h2 className="text-4xl font-extrabold text-white mb-6">Build the Future of AI Infrastructure</h2>
        <p className="text-lg text-navy-300 mb-10 max-w-2xl mx-auto">
          Every conversation. Every line of code. Every design decision helps shape how the next generation of artificial intelligence remembers, collaborates, and evolves.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#roles" className="btn-primary py-4 px-8 text-lg">
            View Open Positions
          </a>
          <a href="#" className="btn-secondary py-4 px-8 text-lg">
            Join the Talent Community
          </a>
        </div>
        
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
  );
}
