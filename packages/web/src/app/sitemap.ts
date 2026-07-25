import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://toffee-ai-context-transfer-protocol-red.vercel.app';

  // List of public static routes on the site
  const routes = [
    '',
    '/about',
    '/api-docs',
    '/blog',
    '/careers',
    '/contact',
    '/cookies',
    '/extension',
    '/features',
    '/install',
    '/legal',
    '/login',
    '/pricing',
    '/privacy',
    '/register',
    '/terms',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
