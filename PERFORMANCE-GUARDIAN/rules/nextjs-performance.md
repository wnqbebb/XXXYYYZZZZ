---
name: nextjs-performance
description: Next.js 14/15 specific performance optimizations. App Router, Server Components, and edge runtime best practices.
metadata:
  tags: nextjs, app-router, server-components, edge-runtime, streaming, react
---

# Next.js Performance Rules

## MUST: Use Server Components by Default

```tsx
// GOOD: Server Component (default in App Router)
// app/page.tsx - No 'use client' directive
import { db } from '@/lib/db';

// This runs on the server only
export default async function Page() {
  const data = await db.query('SELECT * FROM posts');
  
  return (
    <main>
      <h1>Posts</h1>
      {data.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </main>
  );
}

// Zero JavaScript sent to client for this component
```

## MUST: Minimize Client Components

```tsx
// BAD: Entire page is client component
'use client';

export default function Page() {
  // All JS sent to client
  return <div>...</div>;
}

// GOOD: Isolate interactivity
// app/page.tsx - Server Component
import { PostList } from './PostList';
import { InteractiveFilter } from './InteractiveFilter';

export default async function Page() {
  const posts = await fetchPosts();
  
  return (
    <main>
      {/* Interactive part only */}
      <InteractiveFilter />
      
      {/* Static part server-rendered */}
      <PostList posts={posts} />
    </main>
  );
}

// app/InteractiveFilter.tsx - Client Component
'use client';

export function InteractiveFilter() {
  const [filter, setFilter] = useState('');
  // Only this component's JS is sent to client
  return <input onChange={e => setFilter(e.target.value)} />;
}
```

## MUST: Use Streaming with Suspense

```tsx
// app/page.tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <main>
      {/* Static content renders immediately */}
      <Hero />
      
      {/* Dynamic content streams in */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid />
      </Suspense>
      
      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />
      </Suspense>
    </main>
  );
}

// app/ProductGrid.tsx
async function ProductGrid() {
  // This doesn't block other components
  const products = await fetchProducts();
  
  return (
    <div className="grid">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

## MUST: Configure Image Optimization

```typescript
// next.config.js
module.exports = {
  images: {
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Image sizes for layout
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Modern formats
    formats: ['image/avif', 'image/webp'],
    
    // Remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
    
    // Quality default
    quality: 85,
    
    // Enable placeholder generation
    placeholder: 'blur',
  },
};
```

## MUST: Use Edge Runtime When Appropriate

```tsx
// app/api/route.ts
export const runtime = 'edge';

export async function GET(request: Request) {
  // Runs at edge locations worldwide
  // Lower latency for users
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  const data = await fetch(`https://api.example.com/${id}`);
  return Response.json(await data.json());
}

// app/page.tsx - Edge-rendered page
export const runtime = 'edge';

export default function Page() {
  return <div>Edge-rendered content</div>;
}
```

## MUST: Implement Proper Caching

```tsx
// app/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const data = await fetch('https://api.example.com/data', {
    next: { 
      revalidate: 3600,
      tags: ['posts'],
    },
  });
  
  return <div>...</div>;
}

// On-demand revalidation
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```

## MUST: Optimize Metadata

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Site Name',
    default: 'Site Name',
  },
  description: 'Site description',
  keywords: ['nextjs', 'react'],
  authors: [{ name: 'Author' }],
  openGraph: {
    title: 'Site Name',
    description: 'Site description',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Preconnect to critical domains
  other: {
    preconnect: 'https://fonts.googleapis.com',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};
```

## WHY: App Router Benefits

```yaml
SERVER_COMPONENTS:
  zero_client_js: |
    No JavaScript sent for server components
    Smaller bundle sizes
    
  direct_backend_access: |
    Query databases directly
    No API layer needed
    
  automatic_code_splitting: |
    Each route is separate chunk
    Automatic lazy loading

STREAMING:
  progressive_rendering: |
    Send HTML as it's ready
    Faster TTFB and FCP
    
  selective_hydration: |
    Hydrate components as they arrive
    Better interactivity timing

EDGE_RUNTIME:
  global_distribution: |
    Run close to users
    Lower latency
    
  cold_start: |
    Faster than Node.js serverless
    Better for sporadic traffic
```

## FORBIDDEN: Next.js Anti-patterns

```yaml
PROHIBITED:
  'use client' on entire page:
    WRONG: Every component is client-side
    RIGHT: Use Server Components, isolate interactivity
    
  Blocking page with data fetching:
    WRONG: await fetch() without Suspense
    RIGHT: Wrap in Suspense with fallback
    
  No caching strategy:
    WRONG: Fetch on every request
    RIGHT: Use revalidate or cache
    
  Large server components:
    WRONG: Transfer huge payloads
    RIGHT: Paginate, stream large data
    
  getServerSideProps in App Router:
    WRONG: Using Pages Router patterns
    RIGHT: Use async Server Components

OPTIMIZATION_CHECKLIST:
  - [ ] Server Components as default
  - [ ] Client Components only for interactivity
  - [ ] Suspense boundaries for dynamic content
  - [ ] Proper caching strategies
  - [ ] Image optimization configured
  - [ ] Font optimization with next/font
  - [ ] Metadata properly set
  - [ ] Edge runtime where beneficial
```

## MUST: Script Loading Strategy

```tsx
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* Load before page becomes interactive */}
      <Script
        src="https://analytics.com/script.js"
        strategy="beforeInteractive"
      />
      
      {/* Load after page becomes interactive (default) */}
      <Script
        src="https://chat-widget.com/script.js"
        strategy="afterInteractive"
      />
      
      {/* Load during idle time */}
      <Script
        src="https://optional.com/script.js"
        strategy="lazyOnload"
      />
      
      {/* Worker thread (experimental) */}
      <Script
        src="https://heavy.com/script.js"
        strategy="worker"
      />
    </>
  );
}
```

---

**Next.js 14+ is built for performance. Use it correctly.**
