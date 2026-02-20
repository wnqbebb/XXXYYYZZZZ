---
name: seo-meta-tags-nextjs
description: Meta tags, Metadata API and social sharing optimization for Next.js. Load when configuring page metadata.
metadata:
  tags: seo, meta-tags, metadata-api, open-graph, twitter-cards, nextjs
---

# Meta Tags & Metadata API Rules

## MUST: Metadata API (Next.js 15)

```typescript
// app/layout.tsx - Root metadata
import type { Metadata, Viewport } from 'next'

// Separate viewport export (Next.js 15 best practice)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

export const metadata: Metadata = {
  // Title configuration
  title: {
    default: 'Brand Name - Value Proposition',
    template: '%s | Brand Name'
  },
  
  // Meta description (150-160 chars optimal)
  description: 'Descripción persuasiva que incluye keywords principales de forma natural. Máximo 160 caracteres para evitar truncamiento.',
  
  // Keywords (less important but still used)
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  
  // Authors
  authors: [{ name: 'Author Name', url: 'https://author.com' }],
  creator: 'Brand Name',
  publisher: 'Brand Name',
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}
```

### WHY: Separate Viewport Export

```yaml
Next.js 15 Change:
  - viewport and themeColor moved to separate export
  - Prevents warnings in development
  - Better TypeScript support
  - Required for build optimization
```

---

## MUST: Open Graph (Facebook, LinkedIn, WhatsApp)

```typescript
// Complete Open Graph configuration
export const metadata: Metadata = {
  openGraph: {
    // Basic
    title: 'Título Optimizado para Redes Sociales',
    description: 'Descripción atractiva que incentive el clic. Entre 100-200 caracteres.',
    url: 'https://tusitio.com/pagina-especifica',
    siteName: 'Nombre del Sitio',
    
    // Images (CRITICAL for CTR)
    images: [
      {
        url: 'https://tusitio.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Descripción accesible de la imagen'
      }
    ],
    
    // Locale
    locale: 'es_ES',
    alternateLocale: ['en_US', 'pt_BR'],
    
    // Type
    type: 'website', // article, product, profile, etc.
    
    // For articles
    publishedTime: '2026-01-15T08:00:00Z',
    modifiedTime: '2026-01-20T10:30:00Z',
    authors: ['https://tusitio.com/autor'],
    tags: ['tag1', 'tag2']
  }
}
```

### WHY: OG Image Dimensions

```yaml
Recommended Sizes:
  Facebook/LinkedIn: 1200 x 630px (1.91:1 ratio)
  Twitter: 1200 x 675px (16:9 ratio)
  WhatsApp: 300 x 200px minimum
  
File Requirements:
  Format: JPG or PNG
  Size: < 8MB
  Safe Zone: Keep text within center 80%
```

---

## MUST: Twitter Cards

```typescript
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image', // summary, summary_large_image, app, player
    site: '@brandhandle',        // Site Twitter handle
    creator: '@authorhandle',    // Content creator handle
    title: 'Título para Twitter',
    description: 'Descripción optimizada para Twitter.',
    images: ['https://tusitio.com/twitter-card.jpg']
  }
}
```

### WHY: Twitter Card Types

```yaml
summary:
  - Small image (144x144)
  - Good for simple shares
  
summary_large_image:
  - Large image (2:1 ratio, min 300x157)
  - Higher CTR, recommended
  
player:
  - For video/audio content
  - Requires additional configuration
  
app:
  - For mobile app promotion
  - Deep linking support
```

---

## MUST: Dynamic Metadata

```typescript
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { getPost } from '@/lib/posts'

// Generate metadata dynamically
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      robots: { index: false, follow: false }
    }
  }
  
  return {
    title: post.title,
    description: post.excerpt || post.metaDescription,
    keywords: post.tags,
    
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: post.authors.map(a => a.name),
      tags: post.tags,
      images: post.coverImage ? [{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.title
      }] : undefined
    },
    
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined
    },
    
    alternates: {
      canonical: `https://tusitio.com/blog/${post.slug}`
    }
  }
}
```

---

## MUST: Canonical URLs

```typescript
export const metadata: Metadata = {
  // Canonical URL
  alternates: {
    canonical: 'https://tusitio.com/pagina-canonical',
    
    // For paginated content
    prev: 'https://tusitio.com/pagina?page=2',
    next: 'https://tusitio.com/pagina?page=4',
    
    // Language alternates (hreflang)
    languages: {
      'es-ES': 'https://tusitio.com/es/pagina',
      'en-US': 'https://tusitio.com/en/page',
      'x-default': 'https://tusitio.com/pagina'
    }
  }
}
```

---

## MUST: Icons & Favicons

```typescript
export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/shortcut-icon.png',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' }
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png'
      }
    ]
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Apple specific
  appleWebApp: {
    capable: true,
    title: 'App Title',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/apple-splash-2048-2732.jpg'
    ]
  },
  
  // Application name
  applicationName: 'Brand Name',
  
  // Generator (optional, remove for security)
  generator: 'Next.js'
}
```

---

## MUST: Verification Tags

```typescript
export const metadata: Metadata = {
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      me: ['my-email@example.com', 'https://my-social-profile.com']
    }
  }
}
```

---

## MUST: Archive & Indexing Control

```typescript
export const metadata: Metadata = {
  // Archive control
  archives: ['https://tusitio.com/archives/2026'],
  
  // Assets
  assets: ['https://tusitio.com/assets'],
  
  // Bookmarks
  bookmarks: ['https://tusitio.com/bookmarks'],
  
  // Category
  category: 'technology',
  
  // Classification
  classification: 'Business',
  
  // No index for specific pages
  robots: {
    index: false,      // Don't index this page
    follow: true,      // But follow links
    noarchive: true,   // Don't show cached version
    nosnippet: true,   // Don't show snippet
    noimageindex: true // Don't index images
  }
}
```

---

## FORBIDDEN: Meta Tag Anti-patterns

```yaml
FORBIDDEN:
  Duplicate title tags:
    WRONG: Same title on multiple pages
    WHY: Confuses search engines, dilutes relevance
    RIGHT: Unique, descriptive titles per page
    
  Title too long:
    WRONG: "Keyword1 | Keyword2 | Keyword3 | Brand Name - Best Service Ever"
    WHY: Truncated in SERPs, looks spammy
    RIGHT: "Primary Keyword - Value Proposition | Brand" (50-60 chars)
    
  Missing meta description:
    WRONG: No description or auto-generated
    WHY: Lower CTR, missed opportunity
    RIGHT: Compelling 150-160 char description with CTA
    
  Keyword stuffing:
    WRONG: "SEO SEO SEO best SEO services SEO expert"
    WHY: Penalty risk, poor UX
    RIGHT: Natural language with 1-2 keywords
    
  Blocking CSS/JS:
    WRONG: Disallow: /css/ or /js/ in robots.txt
    WHY: Google can't render page properly
    RIGHT: Allow all resources needed for rendering
    
  Noindex on important pages:
    WRONG: Accidentally noindex on homepage
    WHY: Page removed from search results
    RIGHT: Double-check before deploying
```

---

## MUST: Title Tag Formulas (Neil Patel)

```yaml
Homepage:
  Formula: "Primary Keyword - Value Proposition | Brand"
  Example: "Diseño Web Profesional - Creamos Experiencias Digitales | Agency"
  Length: 50-60 characters

Category Pages:
  Formula: "Category Name | Parent Category | Brand"
  Example: "Laptops Gaming | Ordenadores | TechStore"
  
Product Pages:
  Formula: "Product Name - Key Feature | Brand"
  Example: "MacBook Pro M4 - 16GB RAM 512GB SSD | Apple"
  
Blog Posts:
  Formula: "Title with Keyword | Blog | Brand"
  Example: "Guía SEO 2026: Domina Google | Blog | Agency"
  
Location Pages:
  Formula: "Service in City - Area | Brand"
  Example: "Abogados en Madrid - Centro | LegalFirm"
```

---

## MUST: Meta Description Best Practices

```yaml
Optimal Length: 150-160 characters
Structure:
  - Hook (first 120 chars visible)
  - Value proposition
  - Call to action
  - Brand mention (optional)

Examples:
  Good: "Descubre las mejores estrategias SEO para 2026. Aumenta tu tráfico orgánico un 300% con nuestros métodos probados. ¡Empieza hoy!"
  
  Bad: "SEO, marketing digital, posicionamiento web, agencia SEO, servicios SEO Madrid Barcelona"
```

---

**Meta tags optimized. Social sharing ready. CTR maximized.**
