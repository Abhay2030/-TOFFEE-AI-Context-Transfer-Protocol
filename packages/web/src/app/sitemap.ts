import { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toffee-ai-context-transfer-protocol-red.vercel.app';

  // List of public static routes on the site
  const staticRoutes = [
    { url: '', priority: 1.0, changefreq: 'daily' as const },
    { url: '/about', priority: 0.8, changefreq: 'monthly' as const },
    { url: '/api-docs', priority: 0.9, changefreq: 'weekly' as const },
    { url: '/blog', priority: 0.9, changefreq: 'weekly' as const },
    { url: '/careers', priority: 0.7, changefreq: 'weekly' as const },
    { url: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { url: '/cookies', priority: 0.5, changefreq: 'monthly' as const },
    { url: '/extension', priority: 0.8, changefreq: 'monthly' as const },
    { url: '/features', priority: 0.9, changefreq: 'monthly' as const },
    { url: '/install', priority: 0.9, changefreq: 'monthly' as const },
    { url: '/legal', priority: 0.5, changefreq: 'monthly' as const },
    { url: '/pricing', priority: 0.9, changefreq: 'monthly' as const },
    { url: '/privacy', priority: 0.5, changefreq: 'monthly' as const },
    { url: '/terms', priority: 0.5, changefreq: 'monthly' as const },
  ];

  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changefreq,
    priority: route.priority,
  }));

  // Dynamic blog routes
  const blogSlugs = getAllSlugs();
  const blogSitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(), // Ideally read from article metadata
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticSitemap, ...blogSitemap];
}
