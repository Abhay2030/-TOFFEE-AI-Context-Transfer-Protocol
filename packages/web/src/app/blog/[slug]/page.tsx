import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User, ChevronRight, ArrowRight, Share2, BookOpen, Hash } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getAllSlugs, getRelatedArticles, getTableOfContents } from '@/lib/blog';
import { JsonLd, articleJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/components/seo/JsonLd';

const SITE_URL = 'https://toffee-ai-context-transfer-protocol-red.vercel.app';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: `${article.title} | Toffee AI Blog`,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.description,
      url: `${SITE_URL}/blog/${article.slug}`,
      siteName: 'Toffee AI',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.name],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const toc = getTableOfContents(article);
  const related = getRelatedArticles(slug);
  const publishDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const updateDate = article.updatedAt
    ? new Date(article.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <JsonLd data={articleJsonLd({
        url: `${SITE_URL}/blog/${article.slug}`,
        title: article.title,
        description: article.description,
        publishedAt: article.publishedAt,
        updatedAt: article.updatedAt,
        authorName: article.author.name,
        siteUrl: SITE_URL,
        tags: article.tags,
      })} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: SITE_URL },
        { name: 'Blog', url: `${SITE_URL}/blog` },
        { name: article.title, url: `${SITE_URL}/blog/${article.slug}` },
      ])} />
      {article.faqs && article.faqs.length > 0 && (
        <JsonLd data={faqJsonLd(article.faqs)} />
      )}

      <div className="min-h-screen bg-navy-950">

        {/* ═══════════════════════════════════════════════
            ARTICLE HERO — Immersive header
        ═══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${article.coverGradient} opacity-20`} />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-950/80 to-navy-950" />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }} />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-navy-500 mb-10" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-toffee-400 transition-colors font-medium">Home</Link>
              <ChevronRight className="w-3 h-3 text-navy-600" />
              <Link href="/blog" className="hover:text-toffee-400 transition-colors font-medium">Blog</Link>
              <ChevronRight className="w-3 h-3 text-navy-600" />
              <span className="text-navy-400 truncate max-w-[280px]">{article.title}</span>
            </nav>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-bold uppercase tracking-wider">
                {article.category}
              </span>
              <span className="text-xs text-navy-500 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {article.readingTime}
              </span>
              <span className="text-xs text-navy-500 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3" />
                {article.sections.length} sections
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-navy-400 leading-relaxed mb-10 max-w-3xl">
              {article.description}
            </p>

            {/* Author & Date bar */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-navy-800/40">
              {/* Author */}
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-toffee-500/30 to-accent-violet/30 flex items-center justify-center border border-navy-700/40 shadow-lg shadow-toffee-500/5">
                  <User className="w-5 h-5 text-toffee-300" />
                </div>
                <div>
                  <Link href="/about" className="text-sm font-semibold text-white hover:text-toffee-400 transition-colors">
                    {article.author.name}
                  </Link>
                  <p className="text-xs text-navy-500">{article.author.role}</p>
                </div>
              </div>

              <div className="w-px h-10 bg-navy-800/50 hidden sm:block" />

              {/* Dates */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-navy-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-navy-600" />
                  Published {publishDate}
                </span>
                {updateDate && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent-emerald/60" />
                    Updated {updateDate}
                  </span>
                )}
              </div>

              {/* Share placeholder */}
              <div className="ml-auto hidden sm:flex items-center gap-2 text-xs text-navy-500">
                <Share2 className="w-3.5 h-3.5" />
                Share
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            TWO-COLUMN LAYOUT — TOC sidebar + Article
        ═══════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">

            {/* ── MAIN CONTENT ── */}
            <div className="min-w-0">

              {/* Table of Contents — Mobile (collapsible look) */}
              {toc.length > 3 && (
                <nav className="lg:hidden mb-10 rounded-xl bg-navy-900/40 border border-navy-800/40 p-5" aria-label="Table of contents">
                  <h2 className="text-xs font-bold text-navy-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" />
                    In This Article
                  </h2>
                  <ol className="space-y-2">
                    {toc.map((item, i) => (
                      <li key={item.id} className={item.level === 3 ? 'ml-5' : ''}>
                        <a
                          href={`#${item.id}`}
                          className="group flex items-start gap-2.5 text-sm text-navy-400 hover:text-toffee-400 transition-colors py-0.5"
                        >
                          <span className="text-[10px] text-navy-600 font-mono mt-0.5 shrink-0 group-hover:text-toffee-500 transition-colors">
                            {item.level === 2 ? `${String(i + 1).padStart(2, '0')}` : '—'}
                          </span>
                          <span className="leading-snug">{item.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {/* Article Body */}
              <div className="
                prose prose-invert prose-lg max-w-none
                prose-headings:font-extrabold prose-headings:text-white prose-headings:tracking-tight
                prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-navy-800/30
                prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-navy-100
                prose-p:text-navy-300 prose-p:leading-[1.8] prose-p:mb-5
                prose-a:text-toffee-400 prose-a:font-medium prose-a:underline-offset-2 prose-a:decoration-toffee-500/30 hover:prose-a:decoration-toffee-400
                prose-strong:text-white prose-strong:font-semibold
                prose-code:text-toffee-300 prose-code:bg-navy-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm prose-code:font-normal
                prose-pre:bg-[#0c1222] prose-pre:border prose-pre:border-navy-800/50 prose-pre:rounded-xl prose-pre:shadow-lg prose-pre:shadow-navy-950/50
                prose-table:border-collapse prose-table:w-full prose-table:rounded-lg prose-table:overflow-hidden
                prose-th:bg-navy-800/60 prose-th:border prose-th:border-navy-700/50 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-th:text-white prose-th:uppercase prose-th:tracking-wider prose-th:text-xs
                prose-td:border prose-td:border-navy-800/40 prose-td:px-4 prose-td:py-3 prose-td:text-sm prose-td:text-navy-300
                prose-li:text-navy-300 prose-li:leading-relaxed prose-li:marker:text-toffee-500/40
                prose-ul:space-y-1 prose-ol:space-y-1
                prose-blockquote:border-l-2 prose-blockquote:border-toffee-500/40 prose-blockquote:bg-navy-900/30 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:px-5
                prose-hr:border-navy-800/30
                prose-img:rounded-xl prose-img:shadow-lg
              ">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-28">
                    {section.level === 2 ? (
                      <h2>{section.heading}</h2>
                    ) : (
                      <h3>{section.heading}</h3>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </section>
                ))}
              </div>

              {/* ── FAQ SECTION ── */}
              {article.faqs && article.faqs.length > 0 && (
                <section className="mt-20 pt-12 border-t border-navy-800/30">
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-navy-800 to-transparent" />
                  </div>
                  <div className="space-y-4">
                    {article.faqs.map((faq, i) => (
                      <div key={i} className="rounded-xl bg-navy-900/30 border border-navy-800/30 overflow-hidden hover:border-navy-700/50 transition-colors">
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-toffee-500/10 flex items-center justify-center shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-toffee-400">Q{i + 1}</span>
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white mb-3 leading-snug">{faq.question}</h3>
                              <p className="text-sm text-navy-400 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ── TAGS ── */}
              <div className="mt-12 pt-8 border-t border-navy-800/30">
                <div className="flex items-start gap-3">
                  <Tag className="w-4 h-4 text-navy-600 mt-1 shrink-0" />
                  <div className="flex items-center gap-2 flex-wrap">
                    {article.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1.5 rounded-lg bg-navy-900/40 border border-navy-800/30 text-xs text-navy-400 font-medium hover:border-navy-700/50 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RELATED ARTICLES ── */}
              {related.length > 0 && (
                <section className="mt-16 pt-12 border-t border-navy-800/30">
                  <div className="flex items-center gap-3 mb-8">
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">Continue Reading</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-navy-800 to-transparent" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {related.map((r) => (
                      <Link
                        key={r.slug}
                        href={`/blog/${r.slug}`}
                        className="group block rounded-xl border border-navy-800/30 bg-navy-900/20 overflow-hidden hover:border-toffee-500/20 transition-all duration-500"
                      >
                        {/* Mini gradient header */}
                        <div className={`h-20 relative overflow-hidden`}>
                          <div className={`absolute inset-0 bg-gradient-to-br ${r.coverGradient} opacity-25`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 to-transparent" />
                          <div className="absolute bottom-3 left-4">
                            <span className="text-[10px] font-bold text-toffee-400 uppercase tracking-widest">{r.category}</span>
                          </div>
                        </div>

                        <div className="p-5">
                          <h3 className="text-sm font-bold text-white mb-2 group-hover:text-toffee-400 transition-colors line-clamp-2 leading-snug">
                            {r.title}
                          </h3>
                          <p className="text-xs text-navy-500 line-clamp-2 leading-relaxed mb-3">{r.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-navy-600 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {r.readingTime}
                            </span>
                            <span className="text-[11px] text-toffee-500 font-medium flex items-center gap-1 group-hover:gap-1.5 transition-all">
                              Read <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* ── BACK TO BLOG ── */}
              <div className="mt-12 pt-8 border-t border-navy-800/30">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2.5 text-sm font-semibold text-navy-400 hover:text-toffee-400 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to all articles
                </Link>
              </div>
            </div>

            {/* ── SIDEBAR — Table of Contents (Desktop sticky) ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                {toc.length > 3 && (
                  <nav className="rounded-xl bg-navy-900/30 border border-navy-800/30 p-5" aria-label="Table of contents">
                    <h2 className="text-[10px] font-bold text-navy-500 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                      <Hash className="w-3 h-3" />
                      On This Page
                    </h2>
                    <ol className="space-y-1">
                      {toc.map((item, i) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={`
                              group flex items-start gap-2 text-[13px] py-1.5 transition-colors
                              ${item.level === 3 ? 'ml-4 text-navy-500 hover:text-navy-300' : 'text-navy-400 hover:text-toffee-400 font-medium'}
                            `}
                          >
                            {item.level === 2 && (
                              <span className="text-[10px] text-navy-600 font-mono mt-0.5 shrink-0 w-4 text-right group-hover:text-toffee-500/70 transition-colors">
                                {String(toc.filter((t, j) => t.level === 2 && j <= i).length).padStart(2, '0')}
                              </span>
                            )}
                            <span className="leading-snug">{item.title}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {/* Author card */}
                <div className="mt-6 rounded-xl bg-navy-900/30 border border-navy-800/30 p-5">
                  <h3 className="text-[10px] font-bold text-navy-500 uppercase tracking-[0.15em] mb-4">Written By</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-toffee-500/25 to-accent-violet/25 flex items-center justify-center border border-navy-700/40">
                      <User className="w-4.5 h-4.5 text-toffee-300" />
                    </div>
                    <div>
                      <Link href="/about" className="text-sm font-semibold text-white hover:text-toffee-400 transition-colors">
                        {article.author.name}
                      </Link>
                      <p className="text-[11px] text-navy-500">{article.author.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-navy-500 leading-relaxed">{article.author.bio}</p>
                </div>
              </div>
            </aside>

          </div>
        </div>

      </div>
    </>
  );
}
