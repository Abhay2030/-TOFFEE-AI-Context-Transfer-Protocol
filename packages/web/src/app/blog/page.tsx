import Link from "next/link";
import { ArrowRight, Search as SearchIcon, Mail, TrendingUp, BookOpen, Clock, Tag, ChevronRight, CheckCircle2, Shield, Sparkles, Terminal, Layers } from "lucide-react";

const CATEGORIES = [
  { name: "Product & Company", topics: ["Product Updates", "Release Notes", "Company News"] },
  { name: "AI & Technology", topics: ["AI News", "AI Research", "AI Comparisons"] },
  { name: "Learning & Tutorials", topics: ["Tutorials", "Prompt Engineering", "Productivity"] },
  { name: "Engineering", topics: ["Browser Extensions", "Security", "Privacy", "Developer Blog"] }
];

const TRENDING_TAGS = [
  "AI Memory", "Context Engineering", "Prompt Engineering", "Browser Extensions", 
  "AI Infrastructure", "GPT-5", "Claude 3.5", "Gemini 1.5 Pro", "Semantic Compression", 
  "Security", "Zero Trust"
];

const FEATURED_ARTICLES = [
  {
    title: "The Architecture of Semantic Context Compression",
    category: "AI Research",
    date: "July 24, 2026",
    readTime: "8 min read",
    author: "Abhay",
    image: "bg-toffee-500/20",
    summary: "A deep dive into how Toffee algorithms shrink 128k token conversations into portable .toffee bundles without losing meaning or entity relationships.",
    trending: true
  },
  {
    title: "Manifest V3: Overcoming Deep Shadow DOMs in AI Extensions",
    category: "Engineering",
    date: "July 18, 2026",
    readTime: "12 min read",
    author: "Abhay",
    image: "bg-accent-violet/20",
    summary: "How we built a recursive Shadow DOM traversal engine to pierce Microsoft Copilot's React structure and extract AI intent.",
    trending: false
  },
  {
    title: "Claude vs ChatGPT: A Context Window Analysis",
    category: "AI Comparisons",
    date: "July 12, 2026",
    readTime: "6 min read",
    author: "Abhay",
    image: "bg-accent-emerald/20",
    summary: "Comparing how different frontier models prioritize structured context versus conversational history, and what it means for developers.",
    trending: true
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-navy-950 pt-24 pb-16">
      
      {/* ── Hero Section ── */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-16 pb-20 border-b border-navy-800/50">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-toffee-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-xs font-medium mb-6">
            <BookOpen className="w-4 h-4" />
            <span>The Toffee Knowledge Hub</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
            Insights for the <span className="toffee-gradient-text">AI-Native Future</span>
          </h1>
          
          <p className="text-xl text-navy-400 mb-10 leading-relaxed max-w-2xl">
            Explore engineering deep dives, AI research, product updates, browser extension development, security insights, and practical guides on building smarter AI workflows.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mb-10">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
            <input 
              type="text" 
              placeholder="Search articles, research, tutorials..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-navy-900/50 border border-navy-700/50 text-white placeholder:text-navy-500 focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-navy-800 hover:bg-navy-700 text-xs font-semibold text-white rounded-lg transition-colors">
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#featured" className="btn-primary py-3 px-6 text-sm">Explore Articles</a>
            <a href="#newsletter" className="btn-secondary py-3 px-6 text-sm inline-flex items-center gap-2">
              <Mail className="w-4 h-4" /> Subscribe
            </a>
          </div>
        </div>
      </section>

      {/* ── Trending Tags ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 border-b border-navy-800/50 overflow-x-auto">
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-toffee-500 shrink-0" />
          <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider shrink-0 mr-2">Trending:</span>
          {TRENDING_TAGS.map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-navy-900 border border-navy-800 text-xs text-navy-300 whitespace-nowrap hover:border-toffee-500/30 hover:text-toffee-400 transition-colors cursor-pointer">
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured Articles ── */}
      <section id="featured" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-toffee-500" /> Featured Articles
          </h2>
          <Link href="#" className="text-sm font-medium text-toffee-400 hover:text-toffee-300 flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {FEATURED_ARTICLES.map((article, i) => (
            <article key={i} className="glass-card flex flex-col overflow-hidden group hover:-translate-y-1 transition-all duration-300 border-navy-800 hover:border-toffee-500/30">
              <div className={`h-48 w-full ${article.image} relative overflow-hidden`}>
                {article.trending && (
                  <div className="absolute top-4 left-4 bg-toffee-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Trending
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 to-transparent opacity-60" />
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-medium text-accent-violet px-2 py-1 bg-accent-violet/10 rounded-md">
                    {article.category}
                  </span>
                  <span className="text-xs text-navy-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-toffee-400 transition-colors leading-tight">
                  {article.title}
                </h3>
                <p className="text-sm text-navy-400 mb-6 flex-1 line-clamp-3">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-navy-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-navy-800 flex items-center justify-center text-[10px] font-bold text-toffee-400">A</div>
                    <span className="text-xs font-medium text-navy-300">{article.author}</span>
                  </div>
                  <span className="text-xs text-navy-500">{article.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Categories Grid ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <h2 className="text-3xl font-bold text-white mb-12">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <div key={category.name} className="glass-card p-6 border-navy-800 hover:border-navy-700">
              <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-navy-800/50">{category.name}</h3>
              <ul className="space-y-3">
                {category.topics.map(topic => (
                  <li key={topic}>
                    <Link href="#" className="text-sm text-navy-400 hover:text-toffee-400 flex items-center gap-2 transition-colors">
                      <ChevronRight className="w-3 h-3" /> {topic}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Future Content Series & Standards ── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-20 border-t border-navy-800/50">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Layers className="w-6 h-6 text-accent-emerald" /> Future Content Series
            </h2>
            <div className="space-y-4">
              <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-800/50">
                <h4 className="font-semibold text-white mb-1">Toffee Engineering</h4>
                <p className="text-sm text-navy-400">Architecture, performance, browser extension internals.</p>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-800/50">
                <h4 className="font-semibold text-white mb-1">AI Context Lab</h4>
                <p className="text-sm text-navy-400">Original research on AI memory and semantic compression.</p>
              </div>
              <div className="bg-navy-900/50 p-4 rounded-xl border border-navy-800/50">
                <h4 className="font-semibold text-white mb-1">The Prompt Journal</h4>
                <p className="text-sm text-navy-400">Prompt engineering and context optimization strategies.</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-toffee-500" /> Trust & Quality Standards
            </h2>
            <p className="text-navy-300 mb-6">
              The Toffee Blog aims to be the definitive publication for AI memory and secure cross-platform workflows. Every article we publish must:
            </p>
            <ul className="space-y-3">
              {[
                "Be technically accurate and heavily researched",
                "Cite reliable sources and empirical data",
                "Include practical, real-world examples",
                "Be reviewed by our engineering team",
                "Display version compatibility and update history",
                "Maintain absolute editorial transparency"
              ].map(standard => (
                <li key={standard} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent-emerald shrink-0" />
                  <span className="text-sm text-navy-200">{standard}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Newsletter Signup ── */}
      <section id="newsletter" className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-24">
        <div className="glass-card p-12 text-center relative overflow-hidden border-toffee-500/30">
          <div className="absolute inset-0 bg-gradient-to-br from-toffee-500/5 to-accent-violet/5 -z-10" />
          
          <div className="w-16 h-16 mx-auto rounded-2xl toffee-gradient flex items-center justify-center mb-6 shadow-lg shadow-toffee-500/20">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Stay Ahead of the AI Revolution</h2>
          <p className="text-navy-300 max-w-xl mx-auto mb-8">
            Join thousands of developers and power users. Get weekly AI insights, engineering deep dives, research summaries, and exclusive beta access.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              className="flex-1 px-4 py-3 rounded-xl bg-navy-900 border border-navy-700 text-white placeholder:text-navy-500 focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/50 transition-all"
            />
            <button type="submit" className="btn-primary py-3 px-6 whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-navy-500 mt-4">No spam. Unsubscribe at any time.</p>
        </div>
        
        {/* Creator Note */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium text-navy-500 tracking-widest uppercase">Designed & Developed by Abhay</p>
        </div>
      </section>

    </div>
  );
}
