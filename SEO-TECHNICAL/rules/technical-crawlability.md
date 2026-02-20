---
name: seo-technical-crawlability
description: Crawlability, indexability and technical foundation for search engines. Load when setting up site architecture.
metadata:
  tags: seo, crawlability, robots, sitemap, canonical, url-structure, redirects, romuald-fons
---

# Technical Crawlability Rules

## MUST: Robots.txt Configuration

```
# public/robots.txt

# Allow all crawlers
User-agent: *

# Allow main content
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/

# Disallow URL patterns
Disallow: /*?*sort=        # Sorting parameters
Disallow: /*?*filter=      # Filter parameters
Disallow: /search?q=        # Search results

# Allow critical resources (CRITICAL!)
Allow: /*.js$
Allow: /*.css$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$

# Sitemap location
Sitemap: https://tusitio.com/sitemap.xml

# Crawl delay (optional, be careful)
# Crawl-delay: 1
```

### WHY: Allow CSS/JS

```yaml
CRITICAL: Never block CSS/JS
  - Google renders pages using CSS/JS
  - Blocking prevents proper indexing
  - Mobile-first indexing requires CSS
  - Core Web Vitals need CSS/JS analysis
  
Exception: Only block if truly private
```

---

## MUST: Dynamic Robots.txt (Next.js)

```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/cart',
          '/checkout',
          '/account',
          '/*?*sort=',
          '/*?*filter='
        ]
      },
      {
        userAgent: 'Googlebot-Image',
        allow: '/images/'
      },
      {
        userAgent: 'AdsBot-Google',
        allow: '/'
      }
    ],
    sitemap: 'https://tusitio.com/sitemap.xml',
    host: 'https://tusitio.com'
  }
}
```

---

## MUST: Sitemap.xml (Dynamic Generation)

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllPosts, getAllProducts, getAllCategories } from '@/lib/content'

const BASE_URL = 'https://tusitio.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all dynamic content
  const [posts, products, categories] = await Promise.all([
    getAllPosts(),
    getAllProducts(),
    getAllCategories()
  ])
  
  // Static pages
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9
    }
  ]
  
  // Dynamic blog posts
  const postPages = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7
  }))
  
  // Product pages
  const productPages = products.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8
  }))
  
  // Category pages
  const categoryPages = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6
  }))
  
  return [...staticPages, ...postPages, ...productPages, ...categoryPages]
}
```

### WHY: Sitemap Priorities

```yaml
Priority Guidelines:
  1.0: Homepage
  0.9: Main category pages
  0.8: Product pages, about, contact
  0.7: Blog posts, articles
  0.6: Sub-categories, tags
  0.5: Archive pages, paginated content
  0.3: Utility pages

Change Frequency:
  always: Homepage with live content
  daily: Active blogs, news
  weekly: Regularly updated content
  monthly: Static pages
  yearly: Archive content
  never: Permanent URLs
```

---

## MUST: Sitemap Index (Large Sites)

```typescript
// app/sitemap-index.xml/route.ts
import { getServerSideSitemapIndex } from 'next-sitemap/server'

export async function GET() {
  const lastmod = new Date().toISOString()
  
  return getServerSideSitemapIndex([
    `https://tusitio.com/sitemap-pages.xml`,
    `https://tusitio.com/sitemap-posts.xml`,
    `https://tusitio.com/sitemap-products.xml`,
    `https://tusitio.com/sitemap-categories.xml`,
    `https://tusitio.com/sitemap-images.xml`
  ])
}

// Individual sitemaps
// app/sitemap-posts.xml/route.ts
import { getServerSideSitemap } from 'next-sitemap/server'

export async function GET() {
  const posts = await getAllPosts()
  
  const fields = posts.map((post) => ({
    loc: `https://tusitio.com/blog/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'weekly',
    priority: 0.7,
    images: post.images?.map((img) => ({
      loc: img.url,
      caption: img.caption,
      title: img.title
    }))
  }))
  
  return getServerSideSitemap(fields)
}
```

---

## MUST: URL Structure (Romuald Fons Silo Architecture)

```yaml
URL Best Practices:
  - Lowercase only
  - Hyphens as separators
  - No special characters
  - No parameters when possible
  - Descriptive and concise
  - Target keyword included

Silo Structure:
  Home
  ├── /categoria-principal/ (Hub)
  │   ├── /subcategoria-1/
  │   │   ├── /producto-a/
  │   │   └── /producto-b/
  │   └── /subcategoria-2/
  │       ├── /producto-c/
  │       └── /producto-d/
  └── /blog/
      ├── /categoria-blog/
      │   └── /articulo-optimizado/
      └── /guia-completa/
```

### MUST: URL Patterns in Next.js

```typescript
// app/[category]/[subcategory]/[product]/page.tsx
// Results in: /electronica/moviles/iphone-16-pro

interface ProductPageProps {
  params: {
    category: string    // electronica
    subcategory: string // moviles
    product: string     // iphone-16-pro
  }
}

// Generate static params for all combinations
export async function generateStaticParams() {
  const products = await getAllProducts()
  
  return products.map((product) => ({
    category: product.category.slug,
    subcategory: product.subcategory.slug,
    product: product.slug
  }))
}
```

---

## MUST: Canonical URLs

```typescript
// app/producto/[slug]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug)
  
  return {
    // Self-referencing canonical
    alternates: {
      canonical: `https://tusitio.com/producto/${product.slug}`
    }
  }
}

// For pages with query parameters
// app/buscar/page.tsx
export const metadata: Metadata = {
  robots: {
    index: false, // Don't index search results
    follow: true
  }
}

// Pagination with canonical
// app/blog/page/[number]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const pageNumber = parseInt(params.number)
  
  return {
    alternates: {
      // First page canonical is /blog
      canonical: pageNumber === 1 
        ? 'https://tusitio.com/blog'
        : `https://tusitio.com/blog/page/${pageNumber}`
    }
  }
}
```

### WHY: Canonical Best Practices

```yaml
Self-Referencing Canonical:
  - Every page should have canonical
  - Points to itself by default
  - Prevents parameter-based duplicates
  
Cross-Domain Canonical:
  - For syndicated content
  - Points to original source
  - Passes authority to source

Pagination:
  - Page 1 canonical = /blog (no /page/1)
  - Subsequent pages self-canonical
  - Use rel="prev/next" (deprecated but helpful)
```

---

## MUST: Redirects Strategy

```typescript
// next.config.js
module.exports = {
  async redirects() {
    return [
      // Permanent redirects (301)
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true // 301
      },
      {
        source: '/blog/:slug',
        destination: '/articulos/:slug',
        permanent: true
      },
      
      // Temporary redirects (307)
      {
        source: '/promo-old',
        destination: '/promo-new',
        permanent: false // 307
      },
      
      // Wildcard redirects
      {
        source: '/products/:path*',
        destination: '/productos/:path*',
        permanent: true
      },
      
      // Query parameter handling
      {
        source: '/search',
        destination: '/buscar',
        permanent: true
      },
      
      // Trailing slash normalization
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true
      }
    ]
  }
}
```

### WHY: Redirect Types

```yaml
301 - Permanent Redirect:
  - Use for: URL changes, migrations
  - Passes: ~90-95% link equity
  - Cached: By browsers indefinitely
  
302 - Found (Temporary):
  - Use for: A/B tests, maintenance
  - Passes: Minimal link equity
  - Not cached
  
307 - Temporary Redirect (HTTP/1.1):
  - Use for: True temporary changes
  - Preserves: HTTP method (POST stays POST)
  - Modern replacement for 302
  
308 - Permanent Redirect (HTTP/1.1):
  - Use for: Permanent URL changes
  - Preserves: HTTP method
  - Modern replacement for 301
```

---

## MUST: Internal Linking Strategy (Romuald Fons)

```tsx
// ✅ DO: Contextual internal linking
export function ArticleContent({ content, relatedPosts }) {
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      {/* Related posts with context */}
      <section className="related-posts">
        <h2>Artículos relacionados</h2>
        {relatedPosts.map((post) => (
          <a 
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="related-link"
          >
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
          </a>
        ))}
      </section>
      
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb">
        <ol>
          <li><a href="/">Inicio</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/blog/categoria">Categoría</a></li>
          <li aria-current="page">Artículo actual</li>
        </ol>
      </nav>
    </article>
  )
}
```

### WHY: Internal Linking Rules

```yaml
Romuald Fons Silo Rules:
  - Link related content within same silo
  - Use descriptive anchor text
  - Limit links per page (100-150 max)
  - Prioritize important pages
  - Avoid orphan pages
  - Footer links for main categories
  
Link Distribution:
  - Homepage: Links to main categories
  - Category pages: Links to subcategories and products
  - Product pages: Links to related products
  - Blog: Links to relevant products and categories
```

---

## MUST: Pagination Handling

```tsx
// app/blog/page/[number]/page.tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const currentPage = parseInt(params.number)
  const totalPages = await getTotalPages()
  
  return {
    title: `Blog - Página ${currentPage}`,
    robots: {
      // Allow indexing but be careful with thin content
      index: currentPage <= 3, // Only index first 3 pages
      follow: true
    },
    alternates: {
      canonical: currentPage === 1 
        ? 'https://tusitio.com/blog'
        : `https://tusitio.com/blog/page/${currentPage}`
    }
  }
}

// Pagination component with proper links
function Pagination({ currentPage, totalPages }) {
  return (
    <nav aria-label="Paginación">
      {currentPage > 1 && (
        <a 
          href={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`}
          rel="prev"
        >
          ← Anterior
        </a>
      )}
      
      <span>Página {currentPage} de {totalPages}</span>
      
      {currentPage < totalPages && (
        <a 
          href={`/blog/page/${currentPage + 1}`}
          rel="next"
        >
          Siguiente →
        </a>
      )}
    </nav>
  )
}
```

---

## FORBIDDEN: Crawlability Anti-patterns

```yaml
FORBIDDEN:
  Orphan pages:
    WRONG: Pages with no internal links
    WHY: Google can't discover them
    RIGHT: Every page needs at least one internal link
    
  Infinite crawl spaces:
    WRONG: Calendar archives with infinite pages
    WHY: Wastes crawl budget
    RIGHT: Limit archive depth, use noindex
    
  Soft 404s:
    WRONG: 200 status for "not found" pages
    WHY: Confuses search engines
    RIGHT: Return proper 404/410 status
    
  Redirect chains:
    WRONG: A → B → C → D
    WHY: Dilutes link equity, slows crawling
    RIGHT: Direct redirect: A → D
    
  Duplicate content:
    WRONG: /product and /product?color=red as separate pages
    WHY: Cannibalization, wasted crawl budget
    RIGHT: Canonical or parameter handling
    
  Parameter explosion:
    WRONG: Unlimited URL combinations with filters
    WHY: Infinite URLs, wasted crawl budget
    RIGHT: Robots.txt disallow or canonical
```

---

## MUST: Crawl Budget Optimization

```yaml
Romuald Fons Crawl Budget Strategy:

1. Eliminate Low-Value Pages:
   - Thin content pages
   - Duplicate content
   - Outdated content
   - Internal search results
   
2. Improve Site Speed:
   - Fast server response
   - Optimized assets
   - Good Core Web Vitals
   
3. Strategic Internal Linking:
   - Link to important pages frequently
   - Reduce click depth to important content
   - Use navigation menus wisely
   
4. XML Sitemap Optimization:
   - Include only indexable URLs
   - Update lastmod accurately
   - Split large sitemaps
   
5. Monitor Crawl Stats:
   - Google Search Console Crawl Stats
   - Server log analysis
   - Identify crawl waste
```

---

**Crawlability perfected. Indexability ensured. Architecture optimized.**
