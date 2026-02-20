---
name: seo-core-web-vitals
description: Core Web Vitals optimization for LCP, INP, CLS and TTFB. Load when optimizing page performance.
metadata:
  tags: seo, core-web-vitals, lcp, inp, cls, ttfb, performance, crux
---

# Core Web Vitals Optimization Rules

## MUST: LCP (Largest Contentful Paint)

```yaml
Definition: Time to render the largest visible element
Target: < 2.5 seconds
Good: ≤ 2.5s | Needs Improvement: 2.5s - 4s | Poor: > 4s
```

### LCP Elements (Priority Order)

```yaml
Common LCP Elements:
  1. <img> element
  2. <image> inside <svg>
  3. <video> poster image
  4. Element with background-image (CSS)
  5. Block-level text elements
```

### MUST: Image Optimization for LCP

```tsx
// Next.js Image component (automatic optimization)
import Image from 'next/image'

// ✅ DO: Priority loading for LCP image
export function Hero() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Descripción descriptiva"
      width={1200}
      height={800}
      priority        // Critical for LCP
      quality={85}    // Balance quality/size
      sizes="100vw"   // Responsive sizing
    />
  )
}

// ✅ DO: Preload critical resources
// app/layout.tsx or page.tsx
export const metadata = {
  other: {
    'link': [
      {
        rel: 'preload',
        as: 'image',
        href: '/hero-image.webp',
        type: 'image/webp'
      }
    ]
  }
}
```

### MUST: Font Loading for LCP

```css
/* ✅ DO: Font display swap */
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap; /* Prevents invisible text */
  font-weight: 400;
}

/* ✅ DO: Preconnect to font CDN */
/* In HTML head */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### MUST: Critical CSS

```tsx
// Inline critical CSS
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <style>{`
          /* Critical above-fold styles */
          .hero { min-height: 100vh; }
          .hero-content { max-width: 1200px; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

## MUST: INP (Interaction to Next Paint)

```yaml
Definition: Responsiveness to user interactions
Target: < 200 milliseconds
Good: ≤ 200ms | Needs Improvement: 200ms - 500ms | Poor: > 500ms
Replaces: FID (First Input Delay) as of March 2024
```

### MUST: Optimize Event Handlers

```tsx
// ❌ BAD: Blocking main thread
function handleClick() {
  // Heavy computation blocks interaction
  const result = heavyCalculation()
  setState(result)
}

// ✅ GOOD: Yield to main thread
async function handleClick() {
  // Use scheduler.yield() or setTimeout
  await scheduler.yield?.() || new Promise(r => setTimeout(r, 0))
  const result = heavyCalculation()
  setState(result)
}

// ✅ GOOD: Web Workers for heavy tasks
// lib/worker.ts
const worker = new Worker('/worker.js')

function handleClick() {
  worker.postMessage({ action: 'calculate', data: input })
  worker.onmessage = (e) => setState(e.data)
}
```

### MUST: Debounce/Throttle Events

```tsx
// ✅ DO: Debounce scroll/resize
import { useCallback, useEffect } from 'react'
import { debounce } from '@/lib/utils'

function useDebouncedScroll(callback, delay = 100) {
  const debouncedCallback = useCallback(
    debounce(callback, delay),
    [callback, delay]
  )
  
  useEffect(() => {
    window.addEventListener('scroll', debouncedCallback)
    return () => window.removeEventListener('scroll', debouncedCallback)
  }, [debouncedCallback])
}

// ✅ DO: Passive event listeners
useEffect(() => {
  window.addEventListener('scroll', handler, { passive: true })
  window.addEventListener('touchstart', handler, { passive: true })
}, [])
```

### MUST: Optimize Third-Party Scripts

```tsx
// ✅ DO: Lazy load non-critical scripts
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Critical scripts load immediately */}
      <Script src="/analytics.js" strategy="afterInteractive" />
      
      {/* Non-critical scripts lazy load */}
      <Script 
        src="/chat-widget.js" 
        strategy="lazyOnload"
      />
      
      {/* Third-party with worker */}
      <Script
        src="https://third-party.com/script.js"
        strategy="worker" // Runs in web worker
      />
    </>
  )
}
```

---

## MUST: CLS (Cumulative Layout Shift)

```yaml
Definition: Visual stability during page load
Target: < 0.1
Good: ≤ 0.1 | Needs Improvement: 0.1 - 0.25 | Poor: > 0.25
```

### MUST: Image Dimensions

```tsx
// ✅ DO: Always specify dimensions
<Image
  src="/photo.jpg"
  width={800}
  height={600}
  alt="Description"
/>

// ✅ DO: Aspect ratio containers for responsive images
<div className="aspect-video relative">
  <Image
    src="/video-thumbnail.jpg"
    fill
    className="object-cover"
    alt="Video thumbnail"
  />
</div>
```

```css
/* ✅ DO: CSS aspect-ratio */
.aspect-video {
  aspect-ratio: 16 / 9;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

/* ✅ DO: Min-height for dynamic content */
.dynamic-content {
  min-height: 200px; /* Reserve space */
}
```

### MUST: Font Loading Strategy

```css
/* ✅ DO: System font stack fallback */
body {
  font-family: 'Custom Font', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ✅ DO: Size-adjust for font fallback */
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%; /* Adjusts fallback font size */
  ascent-override: 90%;
  descent-override: 20%;
}
```

### MUST: Reserve Space for Dynamic Content

```tsx
// ✅ DO: Reserve space for ads/embeds
function AdContainer() {
  return (
    <div 
      className="ad-container"
      style={{ minHeight: 250 }} // Reserve ad space
    >
      <AdComponent />
    </div>
  )
}

// ✅ DO: Skeleton loaders
function ProductList() {
  const { data, isLoading } = useProducts()
  
  if (isLoading) {
    return <ProductSkeleton count={6} /> // Same dimensions as real content
  }
  
  return <ProductGrid products={data} />
}
```

---

## MUST: TTFB (Time to First Byte)

```yaml
Definition: Time until first byte from server
Target: < 600 milliseconds
Good: ≤ 600ms | Needs Improvement: 600ms - 800ms | Poor: > 800ms
```

### MUST: Edge Deployment

```typescript
// ✅ DO: Deploy to edge (Vercel Edge)
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}

export function middleware(request: NextRequest) {
  // Edge execution for minimal latency
  return NextResponse.next()
}

// ✅ DO: Edge API routes
// app/api/data/route.ts
export const runtime = 'edge'

export async function GET() {
  const data = await fetch('https://api.example.com', {
    cf: { cacheTtl: 60 } // Cloudflare cache
  })
  return Response.json(await data.json())
}
```

### MUST: Streaming & Suspense

```tsx
// ✅ DO: Streaming with Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      {/* Static content loads immediately */}
      <Header />
      <Hero />
      
      {/* Dynamic content streams in */}
      <Suspense fallback={<ProductSkeleton />}>
        <ProductList />
      </Suspense>
      
      <Suspense fallback={<ReviewSkeleton />}>
        <Reviews />
      </Suspense>
    </>
  )
}
```

### MUST: Caching Strategy

```typescript
// ✅ DO: Aggressive caching for static assets
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      }
    ]
  }
}
```

---

## MUST: Resource Hints

```html
<!-- ✅ DO: Preconnect to critical origins -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- ✅ DO: DNS prefetch for third-party -->
<link rel="dns-prefetch" href="https://analytics.example.com">

<!-- ✅ DO: Prefetch likely next page -->
<link rel="prefetch" href="/about">

<!-- ✅ DO: Prerender for certain navigation -->
<link rel="prerender" href="/checkout">
```

---

## MUST: Monitoring & Real User Data

```typescript
// ✅ DO: Web Vitals reporting
// app/_components/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    const body = JSON.stringify(metric)
    
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitals', body)
    } else {
      fetch('/api/vitals', { body, method: 'POST', keepalive: true })
    }
  })
  
  return null
}

// ✅ DO: CRUX data integration
// lib/crux.ts
export async function getCruxData(url: string) {
  const response = await fetch(
    `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${API_KEY}`,
    {
      method: 'POST',
      body: JSON.stringify({
        origin: url,
        metrics: ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift']
      })
    }
  )
  return response.json()
}
```

---

## FORBIDDEN: Performance Anti-patterns

```yaml
FORBIDDEN:
  Render-blocking resources:
    WRONG: Synchronous scripts in <head>
    WHY: Delays First Paint and LCP
    RIGHT: Async/defer or move to bottom
    
  Unoptimized images:
    WRONG: PNG for photos, no lazy loading
    WHY: Huge file sizes, slow LCP
    RIGHT: WebP/AVIF, proper sizing, lazy loading
    
  Layout thrashing:
    WRONG: Reading then writing DOM in loop
    WHY: Forces multiple reflows
    RIGHT: Batch reads, then batch writes
    
  Memory leaks:
    WRONG: Event listeners without cleanup
    WHY: Slows down INP over time
    RIGHT: Always cleanup in useEffect return
    
  Third-party bloat:
    WRONG: Loading all analytics at once
    WHY: Kills TTFB and INP
    RIGHT: Lazy load, use Partytown for non-critical
    
  Unsized media:
    WRONG: Images without width/height
    WHY: Causes CLS
    RIGHT: Always specify dimensions or aspect-ratio
```

---

## MUST: Performance Budget

```yaml
Recommended Budgets:
  JavaScript: < 300KB (gzipped)
  Images: < 500KB per page
  Fonts: < 100KB total
  Third-party: < 200KB
  
Tools:
  Lighthouse CI: Automated testing
  Webpack Bundle Analyzer: Size analysis
  SpeedCurve: RUM monitoring
  Calibre: Performance budgets
```

---

**Core Web Vitals optimized. Performance maximized. Rankings secured.**
