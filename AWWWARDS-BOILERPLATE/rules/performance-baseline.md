---
name: performance-baseline
description: Performance optimization baseline setup. Load when configuring performance.
metadata:
  tags: performance, optimization, core-web-vitals, speed
---

# Performance Baseline Rules

## MUST: Image Optimization

```tsx
// Use next/image for ALL images
import Image from 'next/image'

// Local image (automatic optimization)
import heroImage from './hero.jpg'

<Image
  src={heroImage}
  alt="Hero image"
  priority // For LCP images
  placeholder="blur" // Blur placeholder
  quality={85}
/>

// Remote image
<Image
  src="https://example.com/image.jpg"
  alt="Description"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### WHY: next/image

```yaml
Benefits:
  - Automatic WebP/AVIF conversion
  - Responsive sizes
  - Lazy loading
  - Priority loading for LCP
  - Blur placeholder

FORBIDDEN:
  - img tags (no optimization)
  - background-image for content images
  - Unoptimized external images
```

## MUST: Font Optimization

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevents FOIT
  preload: true,
  variable: '--font-sans',
})
```

### WHY: next/font

```yaml
Benefits:
  - Automatic optimization
  - Zero layout shift
  - No external requests
  - CSS variable support

FORBIDDEN:
  - Google Fonts link tags
  - @import for fonts
  - Unsubsetted font files
```

## MUST: Code Splitting

```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const Heavy3DScene = dynamic(() => import('./Heavy3DScene'), {
  loading: () => <Skeleton />,
  ssr: false, // Client-side only
})

// Dynamic import for libraries
const chart = dynamic(() => import('chart.js'), {
  ssr: false,
})
```

## MUST: Bundle Analysis

```bash
# Install analyzer
npm install -D @next/bundle-analyzer

# next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

# Run analysis
ANALYZE=true npm run build
```

## Performance Budgets

```yaml
Max Bundle Sizes:
  Initial JS: < 200KB gzipped
  Images: < 500KB per page
  Fonts: < 100KB total
  Third-party: < 100KB

Core Web Vitals Targets:
  LCP: < 1.2s
  FID: < 50ms
  CLS: < 0.05
  TTFB: < 200ms
```

---

**Performance configured. Proceed to [deployment-ready.md](./deployment-ready.md)**
