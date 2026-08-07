import { Article, ArticleMeta, TableOfContentsItem } from './types';
import { completeGuideAiContextTransfer } from './articles/complete-guide-ai-context-transfer';
import { semanticCompressionExplained } from './articles/semantic-compression-explained';
import { howBrowserExtensionsCaptureContext } from './articles/how-browser-extensions-capture-context';
import { manifestV3ArchitectureDeepDive } from './articles/manifest-v3-architecture-deep-dive';
import { tokenOptimizationTechniques } from './articles/token-optimization-techniques';
import { buildingCrossAiMemorySystems } from './articles/building-cross-ai-memory-systems';
import { fragmentedAiMemoryProblem } from './articles/fragmented-ai-memory-problem';

/** All published articles, ordered by publish date (newest first) */
const ALL_ARTICLES: Article[] = [
  completeGuideAiContextTransfer,
  semanticCompressionExplained,
  howBrowserExtensionsCaptureContext,
  manifestV3ArchitectureDeepDive,
  tokenOptimizationTechniques,
  buildingCrossAiMemorySystems,
  fragmentedAiMemoryProblem,
].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

/** Get all articles (metadata only, no body content) */
export function getAllArticleMeta(): ArticleMeta[] {
  return ALL_ARTICLES.map(({ sections, faqs, relatedSlugs, ...meta }) => meta);
}

/** Get all articles with full content */
export function getAllArticles(): Article[] {
  return ALL_ARTICLES;
}

/** Get a single article by slug */
export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

/** Get all unique slugs (for generateStaticParams) */
export function getAllSlugs(): string[] {
  return ALL_ARTICLES.map((a) => a.slug);
}

/** Get related articles for a given article */
export function getRelatedArticles(slug: string, limit = 3): ArticleMeta[] {
  const article = getArticleBySlug(slug);
  if (!article || !article.relatedSlugs) return [];

  return article.relatedSlugs
    .map((s) => ALL_ARTICLES.find((a) => a.slug === s))
    .filter((a): a is Article => a !== undefined)
    .slice(0, limit)
    .map(({ sections, faqs, relatedSlugs, ...meta }) => meta);
}

/** Get all unique categories */
export function getAllCategories(): string[] {
  return [...new Set(ALL_ARTICLES.map((a) => a.category))];
}

/** Get all unique tags */
export function getAllTags(): string[] {
  return [...new Set(ALL_ARTICLES.flatMap((a) => a.tags))];
}

/** Extract table of contents from an article */
export function getTableOfContents(article: Article): TableOfContentsItem[] {
  return article.sections.map((s) => ({
    id: s.id,
    title: s.heading,
    level: s.level,
  }));
}

/** Get featured articles */
export function getFeaturedArticles(limit = 3): ArticleMeta[] {
  return ALL_ARTICLES
    .filter((a) => a.featured)
    .slice(0, limit)
    .map(({ sections, faqs, relatedSlugs, ...meta }) => meta);
}
