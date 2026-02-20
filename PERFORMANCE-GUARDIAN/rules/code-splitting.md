---
name: code-splitting
description: Code splitting and lazy loading strategies for optimal loading performance. Load only what you need, when you need it.
metadata:
  tags: code-splitting, lazy-loading, dynamic-imports, chunks, performance
---

# Code Splitting Rules

## MUST: Dynamic Import Components

```tsx
// BAD: Static import increases initial bundle
import HeavyEditor from '@/components/HeavyEditor';

// GOOD: Dynamic import with loading state
import dynamic from 'next/dynamic';

const HeavyEditor = dynamic(
  () => import('@/components/HeavyEditor'),
  {
    ssr: false,                    // Disable SSR if uses window/document
    loading: () => <EditorSkeleton />,
  }
);

export default function Page() {
  const [showEditor, setShowEditor] = useState(false);
  
  return (
    <div>
      <button onClick={() => setShowEditor(true)}>
        Open Editor
      </button>
      {showEditor && <HeavyEditor />}
    </div>
  );
}
```

## MUST: Route-Based Splitting (Automatic)

```typescript
// Next.js App Router automatically splits by route
// app/page.tsx - Home chunk
// app/about/page.tsx - About chunk
// app/dashboard/page.tsx - Dashboard chunk

// Each route is loaded on demand
// No need for manual configuration

// Prefetch critical routes
import Link from 'next/link';

function Nav() {
  return (
    <nav>
      {/* Prefetched on hover */}
      <Link href="/dashboard" prefetch={true}>
        Dashboard
      </Link>
      
      {/* Prefetched when in viewport */}
      <Link href="/about" prefetch={true}>
        About
      </Link>
    </nav>
  );
}
```

## MUST: Conditional Loading Based on Viewport

```tsx
'use client';

import dynamic from 'next/dynamic';
import { useMediaQuery } from '@/hooks/useMediaQuery';

// Mobile-only component
const MobileNav = dynamic(() => import('./MobileNav'));

// Desktop-only component  
const DesktopNav = dynamic(() => import('./DesktopNav'));

export function ResponsiveNav() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <>
      {isMobile ? <MobileNav /> : <DesktopNav />}
    </>
  );
}
```

## MUST: Intersection Observer for Below-Fold

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const BelowFoldContent = dynamic(() => import('./BelowFoldContent'));

export function LazySection() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }  // Load 200px before visible
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {isVisible ? <BelowFoldContent /> : <Placeholder />}
    </div>
  );
}
```

## MUST: Library-Specific Splitting

```typescript
// Split heavy libraries by feature
// utils/chart-loader.ts
export async function loadChartLibrary() {
  const [{ default: Chart }, { default: zoomPlugin }] = await Promise.all([
    import('chart.js/auto'),
    import('chartjs-plugin-zoom'),
  ]);
  
  Chart.register(zoomPlugin);
  return Chart;
}

// components/Chart.tsx
'use client';

import { useEffect, useRef } from 'react';

export function Chart({ data }: { data: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    let chartInstance: any;
    
    async function initChart() {
      const Chart = await loadChartLibrary();
      
      if (canvasRef.current) {
        chartInstance = new Chart(canvasRef.current, {
          type: 'line',
          data: { datasets: [{ data }] },
        });
      }
    }
    
    initChart();
    
    return () => chartInstance?.destroy();
  }, [data]);
  
  return <canvas ref={canvasRef} />;
}
```

## WHY: Code Splitting Benefits

```yaml
BENEFITS:
  reduced_initial_load:
    impact: Faster FCP and LCP
    example: 2MB → 200KB initial
    
  on_demand_loading:
    impact: Users only download what they use
    example: Admin panel only loaded for admins
    
  better_caching:
    impact: Vendor chunks cached longer
    example: React chunk rarely changes
    
  parallel_loading:
    impact: Multiple small chunks vs one large
    example: HTTP/2 multiplexing

CHUNK_STRATEGY:
  vendor: |
    node_modules dependencies
    Long-term caching (hash-based)
    
  common: |
    Shared across multiple routes
    Medium-term caching
    
  route_specific: |
    Unique to each route
    Short-term caching
```

## FORBIDDEN: Splitting Anti-patterns

```yaml
PROHIBITED:
  Over-splitting:
    WRONG: Every component in separate chunk
    RIGHT: Group related components
    
  Loading on every render:
    WRONG: Dynamic import inside render
    RIGHT: Define outside component
    
  No loading state:
    WRONG: Blank while loading
    RIGHT: Always provide loading component
    
  Eager loading hidden content:
    WRONG: Load modal content on page load
    RIGHT: Load when modal opens
    
  Not handling errors:
    WRONG: No error boundary for lazy components
    RIGHT: Wrap in ErrorBoundary

BEST_PRACTICES:
  - Split at route level (automatic in Next.js)
  - Split heavy components (>100KB)
  - Split feature-specific code
  - Split based on user roles/permissions
  - Split below-fold content
  - Always provide loading states
  - Handle loading errors gracefully
```

## MUST: Preload Critical Chunks

```typescript
// Preload on user interaction hint
function ProductCard({ product }: { product: Product }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  
  const prefetchProduct = () => {
    // Prefetch product detail page
    const ProductDetail = import('@/app/product/[id]/page');
  };
  
  return (
    <Link
      ref={linkRef}
      href={`/product/${product.id}`}
      onMouseEnter={prefetchProduct}
      onFocus={prefetchProduct}
    >
      {product.name}
    </Link>
  );
}
```

## MUST: Handle Loading Errors

```tsx
// components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };
  
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Usage with lazy component
const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
});

export function SafeLazyComponent() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <LazyComponent />
    </ErrorBoundary>
  );
}
```

---

**Load less, load faster. Split wisely.**
