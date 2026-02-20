---
name: performance
description: Performance optimization, build configuration, tree-shaking, and production best practices for Tailwind CSS v4.
version: 4.0.0
---

# Performance - Production Optimization

> Maximize performance with the Oxide engine, tree-shaking, and production-ready configurations.

---

## MUST

### 1. Leverage the Oxide Engine

Tailwind CSS v4's Rust-powered Oxide engine delivers 2-5x faster builds:

**✅ CORRECT:**
```bash
# Use @tailwindcss/vite for fastest builds
npm install -D @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],  // Direct Vite integration
})
```

### 2. Use Automatic Content Detection

**✅ CORRECT:**
```css
/* No manual content configuration needed */
@import "tailwindcss";
```

The Oxide engine automatically scans your project for Tailwind classes.

### 3. Minimize Custom CSS

**✅ CORRECT:**
```css
/* Use @apply for reusable patterns */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
  }
}
```

**❌ AVOID:**
```css
/* Don't write raw CSS when utilities exist */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: color 0.2s;
}
```

### 4. Use Production Build for Deployment

**✅ CORRECT:**
```bash
# Vite
vite build

# Next.js
next build

# Custom build
npx @tailwindcss/cli -i input.css -o output.css --minify
```

---

## FORBIDDEN

### 1. Never Import Unused Components/Libraries

**❌ FORBIDDEN:**
```typescript
// ❌ Imports entire library
import * as Icons from 'lucide-react'

// ❌ Imports all of lodash
import _ from 'lodash'
```

**✅ CORRECT:**
```typescript
// ✅ Tree-shakeable imports
import { Home, User, Settings } from 'lucide-react'

// ✅ Specific lodash functions
import debounce from 'lodash/debounce'
```

### 2. Never Use `@apply` with Arbitrary Values

**❌ FORBIDDEN:**
```css
/* ❌ Arbitrary values in @apply */
.card {
  @apply p-[2.5rem] m-[17px];
}
```

**✅ CORRECT:**
```css
@theme {
  --spacing-card: 2.5rem;
  --spacing-card-margin: 17px;
}

.card {
  @apply p-card m-card-margin;
}
```

### 3. Never Disable Purging in Production

**❌ FORBIDDEN:**
```css
/* ❌ Don't import all utilities */
@import "tailwindcss/utilities" source(none);
```

**✅ CORRECT:**
```css
/* ✅ Let automatic detection work */
@import "tailwindcss";
```

---

## WHY

### Oxide Engine Benefits

| Metric | v3 (JavaScript) | v4 (Oxide/Rust) |
|--------|-----------------|-----------------|
| Build Time | 600ms | ~120ms |
| Memory Usage | Higher | Lower |
| Content Detection | Manual | Automatic |
| CSS Processing | PostCSS-based | Native CSS |

### Tree-Shaking

Tailwind CSS automatically removes unused utilities:
- Only generates classes found in your templates
- Dead code elimination at build time
- Minimal CSS bundle size

---

## EXAMPLES

### Optimal Vite Configuration

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    mode === 'analyze' && visualizer({ open: true }),
  ],
  build: {
    cssMinify: 'lightningcss',  // Fast CSS minification
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}))
```

### Next.js Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
}

module.exports = nextConfig
```

### CSS Optimization

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Only define what you need */
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  
  /* Custom spacing (not entire scale) */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
}

/* Use @layer for organization */
@layer components {
  /* Reusable patterns only */
  .btn {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
  }
}

@layer utilities {
  /* Custom utilities */
  .text-balance {
    text-wrap: balance;
  }
}
```

### Lazy Loading Components

```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'))
const DataTable = lazy(() => import('./DataTable'))

function Dashboard() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <HeavyChart />
      <DataTable />
    </Suspense>
  )
}
```

### Image Optimization

```tsx
// Next.js Image
import Image from 'next/image'

function OptimizedImage() {
  return (
    <Image
      src="/photo.jpg"
      alt="Description"
      width={800}
      height={600}
      priority={false}  // Only for above-fold images
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### Font Optimization

```tsx
// Next.js Font Optimization
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',  // Prevent FOIT
  variable: '--font-inter',
})

// Use in layout
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

---

## Bundle Analysis

### Analyzing Bundle Size

```bash
# Install analyzer
npm install -D @next/bundle-analyzer

# Run analysis
ANALYZE=true npm run build
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
```

### CSS Size Monitoring

```bash
# Check CSS bundle size
ls -la .next/static/css/

# Analyze CSS content
npx purgecss --css .next/static/css/*.css --content .next/server/**/*.html
```

---

## Performance Checklist

### Development
- [ ] Using `@tailwindcss/vite` or `@tailwindcss/postcss`
- [ ] Build time under 150ms for large projects
- [ ] No console warnings about unused imports
- [ ] Components use tree-shakeable imports

### Production Build
- [ ] CSS is minified
- [ ] JavaScript is minified and split into chunks
- [ ] Images are optimized (WebP/AVIF)
- [ ] Fonts use `font-display: swap`
- [ ] No unused dependencies in bundle

### Runtime
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Blocking Time < 200ms

---

## Related Assets

- [Vite Config Template](../assets/configs/vite.config.ts)
- [Next.js Config Template](../assets/configs/next.config.js)
- [Bundle Analysis Script](../assets/scripts/analyze-bundle.js)
