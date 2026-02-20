---
name: seo-technical
description: Technical SEO mastery for maximum search visibility. Use when (1) Configuring meta tags and structured data, (2) Optimizing Core Web Vitals, (3) Implementing AI Search Optimization (GEO), (4) Setting up international SEO, (5) Ensuring crawlability and indexability. MANDATORY for all sites targeting organic traffic.
metadata:
  tags: seo, technical-seo, core-web-vitals, structured-data, schema-org, json-ld, meta-tags, open-graph, twitter-cards, robots, sitemap, canonical, hreflang, ee-at, geo, ai-search, google, bing, neil-patel, romuald-fons
  author: Santiago Workflow Systems
  version: 4.0.0
  priority: critical
  category: seo
---

# SEO Technical Master System

**Discoverable. Indexable. Rankable. Future-proof for AI Search.**

El SEO técnico es el fundamento de cualquier estrategia de visibilidad orgánica. Basado en las metodologías de Neil Patel, Romuald Fons y las directrices oficiales de Google y Bing, optimizado para la era de la IA.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - User says: "seo", "posicionamiento", "google", "ranking"
  - Creating new pages or sites
  - Implementing meta tags and structured data
  - Optimizing Core Web Vitals (LCP, INP, CLS)
  - Setting up international/multi-language sites
  - Configuring robots.txt and sitemaps
  - ANY site targeting organic traffic
  - Preparing for AI search (ChatGPT, Perplexity, Gemini)

DO NOT USE WHEN:
  - Site is purely internal/private
  - User explicitly says "no SEO needed"
```

---

## The SEO Stack (2026)

### Core Dependencies

```yaml
Framework:
  - next: ^15.x (App Router with Metadata API)
  
Schema & Structured Data:
  - schema-dts: ^1.1.x (TypeScript Schema.org types)
  
Analytics & Monitoring:
  - @vercel/analytics: ^1.x
  - @vercel/speed-insights: ^1.x
  
Utilities:
  - next-sitemap: ^4.x (Sitemap generation)
  - next-seo: ^6.x (SEO helpers - legacy projects)
```

### Official Tools Integration

```typescript
// Google Search Console
// Bing Webmaster Tools
// PageSpeed Insights API
// Schema.org Validator
```

---

## The Golden Rules (Neil Patel + Romuald Fons)

### Performance Commandments

```yaml
✅ DO (Neil Patel):
  - Prioritize Core Web Vitals above all
  - Mobile-first indexing ALWAYS
  - HTTPS everywhere
  - Fast server response (< 200ms TTFB)
  - Compress images (WebP/AVIF)
  - Lazy load below-fold content

✅ DO (Romuald Fons - CRAWL Budget):
  - Optimize crawl budget (silos arquitectónicos)
  - Internal linking estratégico
  - Eliminar contenido thin/duplicado
  - URLs limpias y descriptivas
  - Jerarquía clara: Home > Categoría > Producto

❌ NEVER:
  - Block CSS/JS in robots.txt
  - Use infinite scroll without paginación alternativa
  - Duplicate content sin canonical
  - Ignore mobile usability
  - Neglect hreflang implementation
  - Forget alt text on images
```

---

## Rule Files Index

### Core SEO

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/meta-tags-nextjs.md](./rules/meta-tags-nextjs.md) | Metadata API, OG, Twitter Cards | All pages |
| [rules/structured-data.md](./rules/structured-data.md) | Schema.org, JSON-LD, Rich Snippets | Any structured data |
| [rules/technical-crawlability.md](./rules/technical-crawlability.md) | Robots, sitemap, canonical, URLs | Site setup |

### Performance & UX

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/core-web-vitals.md](./rules/core-web-vitals.md) | LCP, INP, CLS optimization | Performance issues |
| [rules/international-seo.md](./rules/international-seo.md) | Hreflang, i18n routing | Multi-language sites |

### AI & Future SEO

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/ai-search-optimization.md](./rules/ai-search-optimization.md) | GEO (Generative Engine Optimization) | AI search readiness |
| [rules/content-optimization.md](./rules/content-optimization.md) | E-E-A-T, semantic SEO | Content strategy |

### Asset Library

```
rules/assets/
├── components/
│   ├── JsonLd.tsx              # JSON-LD wrapper component
│   ├── MetaTags.tsx            # Dynamic meta tags
│   ├── Breadcrumbs.tsx         # BreadcrumbList schema
│   ├── FAQSchema.tsx           # FAQPage structured data
│   └── OrganizationSchema.tsx  # Organization/LocalBusiness
├── lib/
│   ├── seo-utils.ts            # SEO helper functions
│   ├── schema-generator.ts     # Schema.org generators
│   └── url-helpers.ts          # URL canonicalization
└── types/
    └── seo.ts                  # TypeScript definitions
```

---

## Quick Start Patterns

### Basic Page Metadata

```tsx
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Título Optimizado | Brand',
  description: 'Descripción persuasiva con keywords naturales. Máximo 160 caracteres.',
  keywords: ['keyword principal', 'keyword secundaria'],
  
  // Open Graph (Facebook, LinkedIn, WhatsApp)
  openGraph: {
    title: 'Título para Redes Sociales',
    description: 'Descripción para compartir',
    url: 'https://tusitio.com/pagina',
    siteName: 'Nombre del Sitio',
    images: [{
      url: 'https://tusitio.com/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Descripción de la imagen'
    }],
    locale: 'es_ES',
    type: 'website'
  },
  
  // Twitter Cards
  twitter: {
    card: 'summary_large_image',
    title: 'Título Twitter',
    description: 'Descripción Twitter',
    images: ['https://tusitio.com/twitter-image.jpg']
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  
  // Canonical
  alternates: {
    canonical: 'https://tusitio.com/pagina'
  }
}
```

### Structured Data (JSON-LD)

```tsx
// app/producto/page.tsx
import { Product, WithContext } from 'schema-dts'

export default function ProductPage() {
  const jsonLd: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Nombre del Producto',
    image: [
      'https://tusitio.com/producto-1.jpg',
      'https://tusitio.com/producto-2.jpg'
    ],
    description: 'Descripción detallada del producto',
    brand: {
      '@type': 'Brand',
      name: 'Marca del Producto'
    },
    offers: {
      '@type': 'Offer',
      url: 'https://tusitio.com/producto',
      priceCurrency: 'EUR',
      price: '99.99',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '128'
    }
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Content */}
    </>
  )
}
```

### Dynamic Metadata (Romuald Fons Pattern)

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { getPostBySlug } from '@/lib/posts'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags
    }
  }
}
```

---

## Core Web Vitals Targets (Google 2026)

```yaml
LCP (Largest Contentful Paint):
  Target: < 2.5s
  Good: ≤ 2.5s
  Needs Improvement: 2.5s - 4.0s
  Poor: > 4.0s

INP (Interaction to Next Paint):
  Target: < 200ms
  Good: ≤ 200ms
  Needs Improvement: 200ms - 500ms
  Poor: > 500ms

CLS (Cumulative Layout Shift):
  Target: < 0.1
  Good: ≤ 0.1
  Needs Improvement: 0.1 - 0.25
  Poor: > 0.25

TTFB (Time to First Byte):
  Target: < 600ms
  Good: ≤ 600ms
  Needs Improvement: 600ms - 800ms
  Poor: > 800ms
```

---

## AI Search Optimization (GEO)

```yaml
FOR AI SEARCH ENGINES (ChatGPT, Perplexity, Gemini):
  - Structured data comprehensive
  - Clear entity relationships
  - FAQ schema for common questions
  - Author expertise signals (E-E-A-T)
  - Fast, accurate answers in content
  - Citations and references
  - Semantic HTML structure
```

---

## Integration with Other Skills

```
DEPENDS ON:
  - html5-semantic (Semantic structure)
  - performance-guardian (Speed optimization)

WORKS WITH:
  - nextjs-architect (App Router patterns)
  - vercel-deploy (Edge optimization)

ENABLES:
  - Organic traffic growth
  - Rich snippets in SERPs
  - AI search visibility
  - International reach
```

---

## Version History

```yaml
v4.0.0 (2026):
  - AI Search Optimization (GEO) added
  - INP replaces FID in Core Web Vitals
  - Next.js 15 Metadata API patterns
  - Romuald Fons crawl budget strategies
  - Neil Patel performance commandments

v3.0.0 (2025):
  - Next.js 14 App Router
  - Schema-dts integration
  - Core Web Vitals focus
```

---

**Master SEO. Dominate SERPs. Own the AI Search era.**
