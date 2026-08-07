import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User, BookOpen, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { getAllArticleMeta, getFeaturedArticles, getAllCategories } from '@/lib/blog';
import { JsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = 'https://toffee-ai-context-transfer-protocol-red.vercel.app';

export const metadata: Metadata = {
  title: 'Blog — AI Research, Engineering Guides & Technical Deep Dives | Toffee AI',
  description: 'In-depth technical articles about AI context transfer, semantic compression, browser extension architecture, token optimization, and building cross-platform AI memory systems.',
  keywords: ['AI blog', 'context transfer', 'semantic compression', 'browser extensions', 'LLM', 'token optimization'],
  openGraph: {
    title: 'Toffee AI Blog — AI Research & Engineering',
    description: 'In-depth technical articles about AI context transfer, semantic compression, and browser extension architecture.',
    url: `${SITE_URL}/blog`,
    siteName: 'Toffee AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toffee AI Blog',
    description: 'Technical deep dives into AI context transfer and infrastructure.',
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default function BlogPage() {
  const allArticles = getAllArticleMeta();
  const featured = getFeaturedArticles(1);
  const categories = getAllCategories();
  const featuredArticle = featured[0];
  const remainingArticles = allArticles.filter((a) => a.slug !== featuredArticle?.slug);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
      ])} />

      <div className="min-h-screen bg-navy-950">

        {/* ═══════════════════════════════════════════════
            HERO SECTION — Magazine-style header
        ═══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-toffee-500/[0.04] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-toffee-500/[0.06] rounded-full blur-[120px]" />
          <div className="absolute top-20 right-[20%] w-[300px] h-[300px] bg-accent-violet/[0.04] rounded-full blur-[80px]" />

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Eyebrow badge */}
            <div className="flex items-center gap-3 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-semibold tracking-wide uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Engineering Blog</span>
              </div>
              <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-navy-700 to-transparent" />
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight max-w-3xl">
              Research &{' '}
              <span className="bg-gradient-to-r from-toffee-400 via-toffee-300 to-accent-violet bg-clip-text text-transparent">
                Deep Dives
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-navy-400 leading-relaxed max-w-2xl mb-10">
              Original technical articles exploring AI context transfer, semantic compression,
              browser extension architecture, and the infrastructure powering cross-platform AI memory.
            </p>

            {/* Stats bar */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-toffee-500/10 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-toffee-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{allArticles.length}</p>
                  <p className="text-[11px] text-navy-500 uppercase tracking-wider font-medium">Articles</p>
                </div>
              </div>
              <div className="w-px h-10 bg-navy-800 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent-violet/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-accent-violet" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{categories.length}</p>
                  <p className="text-[11px] text-navy-500 uppercase tracking-wider font-medium">Categories</p>
                </div>
              </div>
              <div className="w-px h-10 bg-navy-800 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-accent-emerald/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-accent-emerald" />
                </div>
                <div>
                  <p className="text-lg font-bold text-white">In-Depth</p>
                  <p className="text-[11px] text-navy-500 uppercase tracking-wider font-medium">2,500+ words each</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            CATEGORY FILTER — Pill bar
        ═══════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <span className="px-4 py-2 rounded-full bg-toffee-500/15 border border-toffee-500/30 text-sm font-semibold text-toffee-400 whitespace-nowrap shrink-0">
              All Articles
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-full bg-navy-900/60 border border-navy-800 text-sm font-medium text-navy-400 whitespace-nowrap shrink-0 hover:border-navy-700 hover:text-navy-300 transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            FEATURED ARTICLE — Full-width hero card
        ═══════════════════════════════════════════════ */}
        {featuredArticle && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group block"
            >
              <div className={`relative rounded-2xl overflow-hidden border border-navy-800/50 hover:border-toffee-500/20 transition-all duration-500`}>
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${featuredArticle.coverGradient} opacity-40`} />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-navy-950/40" />

                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />

                <div className="relative z-10 p-8 sm:p-12 lg:p-16">
                  <div className="max-w-3xl">
                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-toffee-500/20 border border-toffee-500/30 text-toffee-300 text-xs font-bold uppercase tracking-widest">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </span>
                      <span className="px-3 py-1 rounded-full bg-navy-800/60 text-navy-300 text-xs font-medium">
                        {featuredArticle.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-5 leading-tight group-hover:text-toffee-300 transition-colors duration-300">
                      {featuredArticle.title}
                    </h2>

                    {/* Description */}
                    <p className="text-base sm:text-lg text-navy-300/90 mb-8 leading-relaxed line-clamp-3 max-w-2xl">
                      {featuredArticle.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-5">
                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-toffee-500/30 to-accent-violet/30 flex items-center justify-center border border-navy-700/50">
                          <User className="w-4.5 h-4.5 text-toffee-300" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{featuredArticle.author.name}</p>
                          <p className="text-xs text-navy-500">{featuredArticle.author.role}</p>
                        </div>
                      </div>

                      <div className="w-px h-8 bg-navy-800 hidden sm:block" />

                      {/* Date */}
                      <span className="text-sm text-navy-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>

                      {/* Reading time */}
                      <span className="text-sm text-navy-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredArticle.readingTime}
                      </span>

                      {/* CTA */}
                      <span className="ml-auto hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-toffee-400 group-hover:gap-3 transition-all duration-300">
                        Read Article
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            ARTICLE GRID — Clean, professional cards
        ═══════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Section header */}
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-xl font-bold text-white">Latest Articles</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-navy-800 to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {remainingArticles.map((article, index) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-navy-800/50 bg-navy-900/30 overflow-hidden hover:border-toffee-500/20 hover:bg-navy-900/50 transition-all duration-500 hover:shadow-lg hover:shadow-toffee-500/[0.03]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card header with gradient */}
                <div className="relative h-40 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${article.coverGradient} opacity-30`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/95 via-navy-900/50 to-transparent" />

                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }} />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-navy-950/70 border border-navy-700/50 text-[11px] font-semibold text-toffee-400 uppercase tracking-wider backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>

                  {/* Reading time badge */}
                  <div className="absolute top-4 right-4">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-navy-950/70 border border-navy-700/50 text-[11px] font-medium text-navy-300 backdrop-blur-sm">
                      <Clock className="w-3 h-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  {/* Article number watermark */}
                  <div className="absolute bottom-3 right-5 text-5xl font-black text-white/[0.03] select-none">
                    {String(index + 2).padStart(2, '0')}
                  </div>
                </div>

                {/* Card body */}
                <div className="flex-1 p-6 pt-4 flex flex-col">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-toffee-400 transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-navy-400 leading-relaxed mb-5 line-clamp-3 flex-1">
                    {article.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-md bg-navy-800/40 border border-navy-800/30 text-[10px] text-navy-500 font-medium uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-6 py-4 border-t border-navy-800/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-toffee-500/10 flex items-center justify-center">
                      <User className="w-3 h-3 text-toffee-400" />
                    </div>
                    <span className="text-xs text-navy-500 font-medium">{article.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-navy-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-toffee-500/50 to-accent-violet/50 transition-all duration-700" />
              </Link>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            NEWSLETTER CTA — Premium glassmorphism design
        ═══════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-toffee-500/[0.08] via-navy-900/80 to-accent-violet/[0.06]" />
            <div className="absolute inset-0 border border-navy-700/30 rounded-2xl" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }} />

            {/* Glow spots */}
            <div className="absolute top-0 left-1/4 w-[200px] h-[200px] bg-toffee-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-accent-violet/10 rounded-full blur-[80px]" />

            <div className="relative z-10 py-14 px-8 sm:px-12 lg:px-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-semibold tracking-wide uppercase mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                Stay in the Loop
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Never Miss an Article
              </h2>
              <p className="text-navy-400 max-w-xl mx-auto mb-8 leading-relaxed">
                Get notified when we publish new research about AI context transfer,
                browser extension engineering, and infrastructure deep dives. No spam — just quality content.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="engineer@company.com"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-navy-800/60 border border-navy-700/50 text-white placeholder-navy-500 focus:outline-none focus:border-toffee-500/50 focus:ring-1 focus:ring-toffee-500/20 transition-all text-sm"
                />
                <button className="btn-primary px-7 py-3.5 whitespace-nowrap text-sm font-semibold">
                  Subscribe
                </button>
              </div>

              <p className="text-[11px] text-navy-600 mt-4">
                Join 200+ engineers already subscribed. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
