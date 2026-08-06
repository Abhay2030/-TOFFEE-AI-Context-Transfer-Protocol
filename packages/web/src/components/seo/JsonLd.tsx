/** Reusable JSON-LD structured data component for SEO */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization schema — used on every page via layout */
export function organizationJsonLd(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Toffee AI',
    url,
    logo: `${url}/logo.png`,
    description: 'The AI Context Transfer Protocol — portable, secure AI memory infrastructure.',
    foundingDate: '2025',
    founder: {
      '@type': 'Person',
      name: 'Abhay Donde',
      jobTitle: 'Founder & Lead Engineer',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'abhaydonde2007@gmail.com',
      contactType: 'customer support',
    },
    sameAs: [],
  };
}

/** WebSite schema — enables sitelinks search box */
export function websiteJsonLd(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Toffee AI',
    url,
    description: 'The AI Context Transfer Protocol. Never lose context between AI conversations.',
    publisher: {
      '@type': 'Organization',
      name: 'Toffee AI',
    },
  };
}

/** SoftwareApplication schema */
export function softwareAppJsonLd(url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Toffee',
    applicationCategory: 'BrowserApplication',
    operatingSystem: 'Chrome, Edge, Firefox',
    description: 'AI Context Transfer Protocol — capture, compress, and transfer AI conversation context across ChatGPT, Claude, Gemini, and more.',
    url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier with up to 10 context bundles',
    },
    author: {
      '@type': 'Person',
      name: 'Abhay Donde',
    },
  };
}

/** Article schema — for blog posts */
export function articleJsonLd(options: {
  url: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  siteUrl: string;
  tags?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: options.title,
    description: options.description,
    url: options.url,
    datePublished: options.publishedAt,
    dateModified: options.updatedAt || options.publishedAt,
    author: {
      '@type': 'Person',
      name: options.authorName,
      url: `${options.siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Toffee AI',
      url: options.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${options.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
    keywords: options.tags?.join(', '),
  };
}

/** FAQPage schema — for FAQ sections */
export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/** BreadcrumbList schema */
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
