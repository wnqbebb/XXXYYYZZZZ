---
name: lcp-optimization
description: Largest Contentful Paint optimization strategies for sub-2.5s load times. Critical for perceived performance.
metadata:
  tags: lcp, loading, images, fonts, critical-css, preload
---

# LCP Optimization Rules

## MUST: Identify LCP Element

```typescript
// Use PerformanceObserver to identify LCP element
new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lastEntry = entries[entries.length - 1];
  
  console.log('LCP Element:', lastEntry.element);
  console.log('LCP URL:', lastEntry.url);
  console.log('LCP Render Time:', lastEntry.renderTime);
  console.log('LCP Load Time:', lastEntry.loadTime);
  console.log('LCP Size:', lastEntry.size);
}).observe({ entryTypes: ['largest-contentful-paint'] });
```

## MUST: Optimize LCP Image

```tsx
// app/page.tsx - Hero image optimization
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-screen">
      {/* LCP Image MUST have priority */}
      <Image
        src="/hero-image.jpg"
        alt="Hero description"
        fill
        priority        // ← CRITICAL for LCP
        quality={85}    // Balance quality/size
        sizes="100vw"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        className="object-cover"
      />
      
      <div className="relative z-10">
        <h1>Your Content</h1>
      </div>
    </section>
  );
}
```

## MUST: Preload Critical Resources

```html
<!-- app/layout.tsx head -->
<head>
  <!-- Preconnect to critical domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  
  <!-- Preload LCP image if not using Next.js Image with priority -->
  <link 
    rel="preload" 
    as="image" 
    href="/hero-image.jpg" 
    type="image/jpeg"
    fetchpriority="high"
  />
  
  <!-- Preload critical font -->
  <link 
    rel="preload" 
    href="/fonts/hero-font.woff2" 
    as="font" 
    type="font/woff2" 
    crossOrigin="anonymous"
  />
</head>
```

## MUST: Inline Critical CSS

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

// critical-css.ts
export const criticalCSS = `
  /* Above-the-fold styles only */
  :root {
    --font-sans: 'Inter', system-ui, sans-serif;
    --color-primary: #0070f3;
  }
  
  body {
    margin: 0;
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
  
  /* Hero section critical styles */
  .hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
`;
```

## MUST: Optimize Server Response Time (TTFB)

```typescript
// middleware.ts - Edge caching
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add cache headers for static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set(
      'Cache-Control',
      'public, max-age=31536000, immutable'
    );
  }
  
  return response;
}

// app/page.tsx - Use streaming for dynamic content
export default async function Page() {
  // Start with static shell
  return (
    <main>
      <Hero /> {/* Static, immediate render */}
      
      {/* Dynamic content streams in */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
    </main>
  );
}
```

## WHY: LCP Elements by Type

```yaml
COMMON_LCP_ELEMENTS:
  1. <img> elements
  2. <image> inside SVG
  3. <video> poster images
  4. Elements with background-image (CSS)
  5. Block-level text elements (if no image)

LCP_EXCLUSIONS:
  - SVGs (unless containing <image>)
  - Videos without poster
  - Invisible elements (opacity: 0, visibility: hidden)
  - Elements extending beyond viewport
```

## FORBIDDEN: LCP Anti-patterns

```yaml
WRONG:
  Lazy loading LCP image:
    impact: Delays LCP by 100-500ms
    fix: Remove loading="lazy", add priority
    
  Using unoptimized image formats:
    impact: Larger file sizes, slower decode
    fix: Use WebP/AVIF with fallbacks
    
  Render-blocking resources:
    impact: Delays paint
    fix: Inline critical CSS, defer non-critical
    
  Client-side rendering of LCP content:
    impact: Significant delay
    fix: Use SSR or SSG for LCP content

RIGHT:
  - Always prioritize LCP image
  - Use modern image formats (WebP, AVIF)
  - Minimize render-blocking resources
  - Server-render LCP content
  - Preload critical resources
```

## MUST: Image Optimization Checklist

```yaml
IMAGE_OPTIMIZATION:
  format:
    - Use AVIF when supported (30% smaller than WebP)
    - Use WebP as primary (25% smaller than JPEG)
    - JPEG fallback for older browsers
    
  sizing:
    - Provide width/height to prevent CLS
    - Use srcset for responsive images
    - Size appropriately for viewport
    
  loading:
    - priority for LCP images
    - lazy for below-fold images
    - eager only when necessary
    
  quality:
    - 85% is usually optimal
    - Lower for thumbnails (60-70%)
    - Higher for hero images (85-90%)
```

---

**LCP under 2.5s is not optional. It's the first impression.**
