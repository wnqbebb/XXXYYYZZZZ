---
name: inp-optimization
description: Interaction to Next Paint optimization for sub-200ms interaction latency. Critical for responsive user experiences.
metadata:
  tags: inp, interactivity, javascript, main-thread, event-loop
---

# INP Optimization Rules

## MUST: Understand INP Measurement

```yaml
INP_BREAKDOWN:
  Input_Delay: Time from interaction to event handler start
  Processing_Time: Time spent in event handlers
  Presentation_Delay: Time to render frame after handlers complete

TARGETS:
  good: <= 200ms total
  needs_improvement: 200ms - 500ms
  poor: > 500ms

WORST_INTERACTION:
  # INP represents the worst interaction (or 98th percentile)
  # One slow interaction can ruin your score
```

## MUST: Yield to Main Thread

```typescript
// BAD: Blocking the main thread
button.addEventListener('click', () => {
  heavyComputation();        // 500ms blocking
  updateUI();                // Delayed
});

// GOOD: Yield with scheduler.yield() (Chrome 115+)
button.addEventListener('click', async () => {
  await scheduler.yield();   // Yield to allow rendering
  heavyComputation();
  await scheduler.yield();
  updateUI();
});

// GOOD: Fallback with setTimeout
function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

// GOOD: Break into smaller chunks
async function processLargeArray(items: any[]) {
  const chunkSize = 50;
  
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    processChunk(chunk);
    
    // Yield every chunk
    await scheduler.yield?.() ?? yieldToMain();
  }
}
```

## MUST: Use requestIdleCallback for Non-Critical Work

```typescript
// lib/idle-work.ts
export function runWhenIdle(callback: () => void, timeout?: number) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    // Fallback: use setTimeout with 0
    setTimeout(callback, 1);
  }
}

// Usage: Analytics, non-critical state updates
runWhenIdle(() => {
  // Send analytics
  analytics.track('page_view');
});

runWhenIdle(() => {
  // Prefetch next page data
  prefetchData('/next-page');
}, 2000); // Timeout after 2s
```

## MUST: Debounce/Throttle Event Handlers

```typescript
// hooks/useDebounce.ts
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  ) as T;
}

// hooks/useThrottle.ts
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const inThrottle = useRef(false);
  
  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => inThrottle.current = false, limit);
      }
    },
    [callback, limit]
  ) as T;
}

// Usage: Search input
function Search() {
  const debouncedSearch = useDebounce((query: string) => {
    performSearch(query);  // Expensive operation
  }, 300);
  
  return (
    <input 
      onChange={(e) => debouncedSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## MUST: Optimize React Renders

```tsx
// BAD: Unnecessary re-renders cause INP issues
function SlowList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');
  
  // Runs on every render
  const filtered = items.filter(item => 
    item.name.includes(filter)
  );
  
  return (
    <>
      <input onChange={e => setFilter(e.target.value)} />
      {filtered.map(item => <Item key={item.id} {...item} />)}
    </>
  );
}

// GOOD: Memoize expensive computations
import { memo, useMemo, useCallback } from 'react';

const Item = memo(function Item({ item }: { item: Item }) {
  return <div>{item.name}</div>;
});

function FastList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('');
  
  // Only recalculate when dependencies change
  const filtered = useMemo(() => 
    items.filter(item => item.name.includes(filter)),
    [items, filter]
  );
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);
  
  return (
    <>
      <input onChange={handleChange} />
      {filtered.map(item => <Item key={item.id} item={item} />)}
    </>
  );
}
```

## MUST: Use Web Workers for Heavy Computation

```typescript
// workers/heavy-worker.ts
self.onmessage = function(e) {
  const { data } = e.data;
  const result = heavyComputation(data);
  self.postMessage({ result });
};

// hooks/useWorker.ts
export function useWorker<T, R>(workerScript: string) {
  const workerRef = useRef<Worker>();
  
  useEffect(() => {
    workerRef.current = new Worker(workerScript);
    return () => workerRef.current?.terminate();
  }, [workerScript]);
  
  const run = useCallback((data: T): Promise<R> => {
    return new Promise((resolve) => {
      workerRef.current!.onmessage = (e) => resolve(e.data.result);
      workerRef.current!.postMessage({ data });
    });
  }, []);
  
  return { run };
}

// Usage
function DataProcessor() {
  const { run } = useWorker('/workers/heavy-worker.js');
  
  const handleProcess = async () => {
    // Runs off main thread
    const result = await run(largeDataset);
    updateUI(result);
  };
  
  return <button onClick={handleProcess}>Process</button>;
}
```

## FORBIDDEN: INP Killers

```yaml
PROHIBITED:
  Synchronous layout reads after writes:
    WRONG: |
      element.style.width = '100px';
      const height = element.offsetHeight; // Forces sync layout
    RIGHT: |
      // Batch reads before writes
      const height = element.offsetHeight;
      requestAnimationFrame(() => {
        element.style.width = '100px';
      });

  setState in animation loops:
    WRONG: |
      window.addEventListener('scroll', () => {
        setState({ scrollY: window.scrollY }); // Every frame!
      });
    RIGHT: |
      // Use CSS transforms or refs
      const elementRef = useRef();
      useEffect(() => {
        const handler = () => {
          elementRef.current.style.transform = `translateY(${window.scrollY}px)`;
        };
        window.addEventListener('scroll', handler, { passive: true });
      }, []);

  Large component trees without virtualization:
    WRONG: Rendering 1000+ items at once
    RIGHT: Use react-window or react-virtualized

  Expensive operations in render:
    WRONG: JSON.parse, array.sort, filter in render
    RIGHT: Use useMemo or move to useEffect/web worker
```

## MUST: Optimize Event Listeners

```typescript
// Use passive listeners for scroll/touch
window.addEventListener('scroll', handler, { passive: true });
window.addEventListener('touchstart', handler, { passive: true });

// Remove listeners when not needed
useEffect(() => {
  const handler = () => { /* ... */ };
  window.addEventListener('scroll', handler, { passive: true });
  
  return () => window.removeEventListener('scroll', handler);
}, []);

// Use Intersection Observer instead of scroll listeners
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadContent();
      }
    });
  },
  { rootMargin: '100px' }
);
```

---

**INP under 200ms means your site feels instant. Make it so.**
