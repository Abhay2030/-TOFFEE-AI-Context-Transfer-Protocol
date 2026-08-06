/** Blog system types for the Toffee knowledge hub */

export interface Author {
  name: string;
  role: string;
  bio: string;
  avatar?: string;
  url?: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;        // ISO 8601
  updatedAt?: string;         // ISO 8601
  author: Author;
  category: string;
  tags: string[];
  readingTime: string;        // e.g. "12 min read"
  featured?: boolean;
  coverGradient: string;      // Tailwind gradient classes for visual header
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface ArticleSection {
  id: string;
  heading: string;
  level: 2 | 3;
  content: string;            // HTML string
}

export interface Article extends ArticleMeta {
  sections: ArticleSection[];
  faqs?: { question: string; answer: string }[];
  relatedSlugs?: string[];
}
