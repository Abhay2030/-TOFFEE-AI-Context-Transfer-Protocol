import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, User, BookOpen } from 'lucide-react';
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

      <div className="min-h-screen bg-navy-950 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <header className="max-w-3xl mb-16 pt-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Technical Knowledge Hub</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Research, Engineering &{' '}
              <span className="toffee-gradient-text">Deep Dives</span>
            </h1>
            <p className="text-lg text-navy-400 leading-relaxed">
              Original technical articles exploring AI context transfer, semantic compression,
              browser extension architecture, and the infrastructure powering cross-platform AI memory.
            </p>
          </header>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-12">
            <span className="px-4 py-2 rounded-full bg-toffee-500/10 border border-toffee-500/30 text-sm font-medium text-toffee-400">
              All Articles
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-4 py-2 rounded-full bg-navy-900 border border-navy-800 text-sm font-medium text-navy-300"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="group block mb-16"
            >
              <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${featuredArticle.coverGradient} border border-navy-800 p-8 md:p-12 hover:border-toffee-500/30 transition-all`}>
                <div className="absolute inset-0 bg-navy-950/60" />
                <div className="relative z-10 max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-toffee-500/20 text-toffee-400 text-xs font-bold uppercase tracking-wider">
                      Featured
                    </span>
                    <span className="text-xs text-navy-300">{featuredArticle.category}</span>
                    <span className="text-xs text-navy-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {featuredArticle.readingTime}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 group-hover:text-toffee-400 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-navy-300 mb-6 leading-relaxed line-clamp-3">
                    {featuredArticle.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-navy-300">
                      <User className="w-4 h-4" />
                      <span>{featuredArticle.author.name}</span>
                    </div>
                    <span className="text-sm text-navy-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Article Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col bg-navy-900/30 border border-navy-800 rounded-xl overflow-hidden hover:border-toffee-500/30 transition-all"
              >
                {/* Gradient Header Bar */}
                <div className={`h-2 bg-gradient-to-r ${article.coverGradient}`} />

                <div className="flex-1 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-medium text-toffee-400">{article.category}</span>
                    <span className="text-xs text-navy-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readingTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-toffee-400 transition-colors line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-sm text-navy-400 leading-relaxed mb-4 line-clamp-3">
                    {article.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-navy-800/50 text-[10px] text-navy-400 font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-navy-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-navy-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <span className="text-xs text-toffee-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <section className="mt-20 p-10 rounded-2xl bg-navy-900/50 border border-navy-800 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-navy-400 max-w-xl mx-auto mb-8">
              Get notified when we publish new articles about AI context transfer,
              browser extension engineering, and infrastructure deep dives.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                className="flex-1 px-4 py-3 rounded-xl bg-navy-800 border border-navy-700 text-white placeholder-navy-500 focus:outline-none focus:border-toffee-500/50"
              />
              <button className="btn-primary px-6 py-3 whitespace-nowrap">Subscribe</button>
            </div>
          </section>

        </div>
      </div>
    </>
  );
}
