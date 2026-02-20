---
name: caching-strategies
description: HTTP caching, CDN configuration, and service worker strategies for optimal performance.
metadata:
  tags: caching, cache-control, cdn, service-worker, http-headers
---

# Caching Strategies

## MUST: Set Proper Cache-Control Headers

```yaml
STATIC_ASSETS:
  pattern: "/_next/static/*"
  headers:
    Cache-Control: "public, max-age=31536000, immutable"
  why: |
    Next.js hashes filenames on build
    Content never changes at same URL
    Cache forever

IMAGES:
  pattern: "/images/*"
  headers:
    Cache-Control: "public, max-age=86400, stale-while-revalidate=604800"
  why: |
    Cache for 1 day
    Serve stale while revalidating for 7 days

API_RESPONSES:
  pattern: "/api/*"
  headers:
    Cache-Control: "public, max-age=60, s-maxage=3600"
  why: |
    Browser caches 1 minute
    CDN caches 1 hour (s-maxage)

HTML_PAGES:
  pattern: "/"
  headers:
    Cache-Control: "public, max-age=0, must-revalidate"
  why: |
    Always check for updates
    Critical for dynamic content
```

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};
```

## MUST: Implement Stale-While-Revalidate

```typescript
// app/page.tsx - Next.js ISR with SWR
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { 
      revalidate: 3600,
      tags: ['homepage'],
    },
  });
  
  return <div>{/* content */}</div>;
}

// On-demand revalidation
// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { tag, path } = await request.json();
  
  if (tag) {
    revalidateTag(tag);
  }
  
  if (path) {
    revalidatePath(path);
  }
  
  return Response.json({ revalidated: true, now: Date.now() });
}
```

## MUST: Configure CDN Properly

```yaml
VERCEL_CDN:
  automatic: true
  features:
    - Global edge network
    - Automatic HTTPS
    - Compression (Brotli/Gzip)
    - DDoS protection

CUSTOM_CDN:
  cloudflare:
    page_rules:
      - pattern: "*.css"
        cache_level: cache_everything
        edge_cache_ttl: 1 month
      - pattern: "*.js"
        cache_level: cache_everything
        edge_cache_ttl: 1 month
    
  aws_cloudfront:
    behaviors:
      - path_pattern: "/_next/static/*"
        ttl: 31536000
        compress: true
```

## MUST: Use Service Worker for Offline

```typescript
// public/sw.js (Workbox)
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Precache critical assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache API responses
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);
```

## WHY: Cache Directives Explained

```yaml
DIRECTIVES:
  public:
    meaning: Response can be cached by any cache
    vs_private: Private means only browser can cache
    
  max-age:
    meaning: Seconds to cache
    example: max-age=3600 = 1 hour
    
  s-maxage:
    meaning: CDN/shared cache max-age
    use: Override max-age for CDNs
    
  stale-while-revalidate:
    meaning: Serve stale content while fetching fresh
    example: stale-while-revalidate=86400
    benefit: Instant load, background update
    
  immutable:
    meaning: Content will never change
    use: Hashed filenames only
    
  must-revalidate:
    meaning: Never serve stale content
    use: Dynamic HTML pages
    
  no-cache:
    meaning: Must revalidate before using cached
    vs_no_store: no-store prevents storing entirely
```

## FORBIDDEN: Caching Mistakes

```yaml
PROHIBITED:
  Caching HTML with long TTL:
    WRONG: Cache-Control: max-age=86400 for HTML
    RIGHT: Cache-Control: max-age=0, must-revalidate
    
  Not versioning assets:
    WRONG: style.css (no hash)
    RIGHT: style.a3f2b1.css (hashed)
    
  Ignoring CDN cache:
    WRONG: Only setting browser cache
    RIGHT: Set s-maxage for CDN
    
  Cache busting with query strings:
    WRONG: style.css?v=123
    RIGHT: style.a3f2b1.css
    
  Over-caching API responses:
    WRONG: Cache user-specific data
    RIGHT: Vary: Cookie or no-cache

CACHE_KEY_BEST_PRACTICES:
  - Use hashed filenames for static assets
  - Include version in URL, not query string
  - Use Vary header correctly
  - Normalize Accept-Encoding
```

## MUST: Implement Cache Warming

```typescript
// scripts/warm-cache.ts
const pages = ['/', '/about', '/products', '/contact'];

async function warmCache() {
  const baseUrl = process.env.SITE_URL;
  
  for (const page of pages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      console.log(`Warmed: ${page} - ${response.status}`);
    } catch (error) {
      console.error(`Failed to warm: ${page}`, error);
    }
  }
}

warmCache();
```

## MUST: Monitor Cache Hit Rates

```yaml
METRICS_TO_TRACK:
  - CDN cache hit ratio (target: > 90%)
  - Origin requests per minute
  - Cache miss rate by asset type
  - Time to cache refresh

VERCEL_ANALYTICS:
  - Data Cache hit rate
  - Full Route Cache usage
  - ISR revalidation count
```

---

**Cache aggressively, invalidate wisely.**
