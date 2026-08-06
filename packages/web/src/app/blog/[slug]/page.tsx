import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Tag, User, ChevronRight } from 'lucide-react';
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

      <div className="min-h-screen bg-navy-950 pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-navy-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-navy-300 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full bg-toffee-500/10 border border-toffee-500/20 text-toffee-400 text-xs font-medium">
                {article.category}
              </span>
              <span className="text-xs text-navy-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {article.readingTime}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              {article.title}
            </h1>

            <p className="text-lg text-navy-400 leading-relaxed mb-8">
              {article.description}
            </p>

            {/* Author & Date */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-t border-b border-navy-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-toffee-500/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-toffee-400" />
                </div>
                <div>
                  <Link href="/about" className="text-sm font-medium text-white hover:text-toffee-400 transition-colors">
                    {article.author.name}
                  </Link>
                  <p className="text-xs text-navy-400">{article.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-navy-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Published {publishDate}
                </span>
                {updateDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Updated {updateDate}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* Table of Contents */}
          {toc.length > 3 && (
            <nav className="mb-12 p-6 rounded-2xl bg-navy-900/50 border border-navy-800" aria-label="Table of contents">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Table of Contents</h2>
              <ol className="space-y-2">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'ml-4' : ''}>
                    <a
                      href={`#${item.id}`}
                      className="text-sm text-navy-400 hover:text-toffee-400 transition-colors"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Article Body */}
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-navy-300 prose-a:text-toffee-400 prose-strong:text-white prose-code:text-toffee-300 prose-code:bg-navy-800/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-navy-800 prose-pre:rounded-xl prose-table:border-collapse prose-th:border prose-th:border-navy-700 prose-th:bg-navy-900 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:text-white prose-td:border prose-td:border-navy-800 prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-li:text-navy-300 prose-ul:text-navy-300">
            {article.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                {section.level === 2 ? (
                  <h2>{section.heading}</h2>
                ) : (
                  <h3>{section.heading}</h3>
                )}
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </section>
            ))}
          </div>

          {/* FAQ Section */}
          {article.faqs && article.faqs.length > 0 && (
            <section className="mt-16 pt-12 border-t border-navy-800/50">
              <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {article.faqs.map((faq, i) => (
                  <div key={i} className="bg-navy-900/50 border border-navy-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{faq.question}</h3>
                    <p className="text-navy-300 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-navy-800/50">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-navy-500" />
              {article.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-navy-900 border border-navy-800 text-xs text-navy-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="mt-16 pt-12 border-t border-navy-800/50">
              <h2 className="text-2xl font-bold text-white mb-8">Continue Reading</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/blog/${r.slug}`}
                    className="group block bg-navy-900/50 border border-navy-800 rounded-xl p-6 hover:border-toffee-500/30 transition-all"
                  >
                    <span className="text-xs text-toffee-400 font-medium">{r.category}</span>
                    <h3 className="text-base font-bold text-white mt-2 mb-2 group-hover:text-toffee-400 transition-colors line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="text-xs text-navy-400 line-clamp-2">{r.description}</p>
                    <span className="text-xs text-navy-500 mt-3 block">{r.readingTime}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <div className="mt-12 pt-8 border-t border-navy-800/50">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-navy-400 hover:text-toffee-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to all articles
            </Link>
          </div>

        </article>
      </div>
    </>
  );
}
