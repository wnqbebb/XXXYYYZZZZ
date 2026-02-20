---
name: barba-prefetching
description: Page prefetching for performance. Load when optimizing navigation speed.
metadata:
  tags: barba, prefetch, performance, optimization
---

# Prefetching Rules

## MUST: Install & Configure

```bash
npm install @barba/prefetch
```

```typescript
import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'

// Register plugin
barba.use(barbaPrefetch, {
  // Hover delay before prefetch (ms)
  delay: 50,
  
  // Limit concurrent requests
  limit: 5
})
```

## How It Works

```
USER INTERACTION → PREFETCH → CLICK → INSTANT LOAD

Hover link → Barba fetches page in background → 
User clicks → Page already cached → Instant transition
```

## MUST: Selective Prefetching

```typescript
// Only prefetch links in viewport
barba.use(barbaPrefetch, {
  root: document.querySelector('main'),
  rootMargin: '0px',
  threshold: 0.5 // 50% visible
})

// Or manual control
const links = document.querySelectorAll('a[data-prefetch]')
barba.prefetch(links)
```

## MUST: Respect Data Usage

```typescript
// Check connection type
if (navigator.connection) {
  const { saveData, effectiveType } = navigator.connection
  
  // Skip prefetch on slow connections or data saver
  if (saveData || effectiveType === '2g' || effectiveType === 'slow-2g') {
    // Don't prefetch
  } else {
    barba.use(barbaPrefetch)
  }
}
```

---

**Prefetching configured. Proceed to [nextjs-integration.md](./nextjs-integration.md)**
