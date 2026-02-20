---
name: nextjs-streaming
description: Streaming and Suspense patterns. Load when implementing streaming UI.
metadata:
  tags: nextjs, streaming, suspense, performance
---

# Streaming Patterns

## Progressive Loading

```tsx
import { Suspense } from 'react'
import { ProductSkeleton } from '@/components/skeletons'

export default function ProductPage() {
  return (
    <>
      <ProductInfo /> {/* Load immediately */}
      
      <Suspense fallback={<ProductSkeleton />}>
        <Reviews /> {/* Stream when ready */}
      </Suspense>
      
      <Suspense fallback={<ProductSkeleton />}>
        <RelatedProducts /> {/* Stream when ready */}
      </Suspense>
    </>
  )
}
```

## Loading UI

```tsx
// app/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-gray-200 animate-pulse rounded" />
      <div className="h-64 bg-gray-200 animate-pulse rounded" />
      <div className="h-32 bg-gray-200 animate-pulse rounded" />
    </div>
  )
}
```

## Instant Loading States

```tsx
// components/ui/skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 ${className}`} />
  )
}
```
