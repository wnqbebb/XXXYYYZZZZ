---
name: react-performance-patterns
description: React performance patterns and anti-patterns. Optimize renders, prevent unnecessary re-renders, and manage state efficiently.
metadata:
  tags: react, performance, memo, usememo, usecallback, re-renders, state
---

# React Performance Patterns

## MUST: Memoize Expensive Computations

```tsx
// BAD: Expensive calculation on every render
function ProductList({ products, filter }: Props) {
  // Runs on every render, even if products/filter haven't changed
  const filtered = products
    .filter(p => p.name.includes(filter))
    .sort((a, b) => a.price - b.price)
    .map(p => ({ ...p, displayPrice: formatPrice(p.price) }));

  return <div>{filtered.map(...)}</div>;
}

// GOOD: Memoize with useMemo
import { useMemo } from 'react';

function ProductList({ products, filter }: Props) {
  const filtered = useMemo(() => {
    return products
      .filter(p => p.name.includes(filter))
      .sort((a, b) => a.price - b.price)
      .map(p => ({ ...p, displayPrice: formatPrice(p.price) }));
  }, [products, filter]); // Only recalculate when these change

  return <div>{filtered.map(...)}</div>;
}
```

## MUST: Memoize Callback Functions

```tsx
// BAD: New function reference on every render
function Form() {
  const [value, setValue] = useState('');

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)} // New function every render
    />
  );
}

// GOOD: Stable callback with useCallback
import { useCallback } from 'react';

function Form() {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []); // Empty deps - function never recreates

  return <input value={value} onChange={handleChange} />;
}
```

## MUST: Memoize Components with React.memo

```tsx
// BAD: Child re-renders even when props haven't changed
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      <ExpensiveChild data={stableData} /> {/* Re-renders unnecessarily */}
    </div>
  );
}

// GOOD: Memoize child component
import { memo } from 'react';

const ExpensiveChild = memo(function ExpensiveChild({ data }: { data: Data }) {
  // Only re-renders if data reference changes
  return <div>{/* expensive render */}</div>;
});

// With custom comparison
const ExpensiveChild = memo(
  function ExpensiveChild({ data }: { data: Data }) {
    return <div>{/* expensive render */}</div>;
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (don't re-render)
    return prevProps.data.id === nextProps.data.id;
  }
);
```

## MUST: Use Virtualization for Long Lists

```tsx
// BAD: Rendering 1000+ items
function List({ items }: { items: Item[] }) {
  return (
    <div>
      {items.map(item => <Item key={item.id} {...item} />)} {/* Slow! */}
    </div>
  );
}

// GOOD: Virtualize with react-window
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <Item {...items[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

## MUST: Lazy Load Heavy Components

```tsx
// BAD: Import everything upfront
import HeavyChart from './HeavyChart';
import HeavyMap from './HeavyMap';

// GOOD: Lazy load with dynamic imports
import { lazy, Suspense } from 'react';

const HeavyChart = lazy(() => import('./HeavyChart'));
const HeavyMap = lazy(() => import('./HeavyMap'));

function Dashboard() {
  return (
    <Suspense fallback={<Skeleton />}>
      <HeavyChart />
      <HeavyMap />
    </Suspense>
  );
}
```

## MUST: Optimize Context Usage

```tsx
// BAD: Context value changes on every render
type ThemeContextType = { theme: string; toggle: () => void };

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggle: () => {},
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  // New object every render - triggers all consumers
  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// GOOD: Memoize context value
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const value = useMemo(() => ({
    theme,
    toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light'),
  }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// BETTER: Split contexts by concern
const ThemeStateContext = createContext('light');
const ThemeDispatchContext = createContext<() => void>(() => {});

// Components only re-render when their specific context changes
```

## WHY: React.memo vs useMemo

```yaml
REACT_MEMO:
  purpose: Prevent component re-renders
  use_when: |
    - Component is expensive to render
    - Props change infrequently
    - Parent re-renders often
  
  example: |
    const MemoizedCard = memo(Card);

USE_MEMO:
  purpose: Cache expensive calculations
  use_when: |
    - Computation is expensive
    - Dependencies change infrequently
    - Result is used in render
  
  example: |
    const sorted = useMemo(() => sort(items), [items]);

USE_CALLBACK:
  purpose: Cache function references
  use_when: |
    - Function passed to memoized child
    - Function used as dependency
    - Function recreated often
  
  example: |
    const handleClick = useCallback(() => {}, []);
```

## FORBIDDEN: React Performance Anti-patterns

```yaml
PROHIBITED:
  setState in render loop:
    WRONG: |
      items.map(item => {
        const [count, setCount] = useState(0); // Hook in loop!
        return <div>{count}</div>;
      });
    RIGHT: |
      // Lift state up or use single state object
      
  Inline object/array in props:
    WRONG: |
      <Component style={{ color: 'red' }} items={['a', 'b']} />
    RIGHT: |
      const style = useMemo(() => ({ color: 'red' }), []);
      const items = useMemo(() => ['a', 'b'], []);
      <Component style={style} items={items} />
      
  Anonymous functions in JSX:
    WRONG: |
      <button onClick={() => handleClick(id)}>Click</button>
    RIGHT: |
      const handleClick = useCallback((id: string) => {
        // handle click
      }, []);
      <button onClick={() => handleClick(id)}>Click</button>
      // Or use data attributes for simple cases
      
  Unnecessary useEffect:
    WRONG: |
      useEffect(() => {
        setDerivedValue(compute(value));
      }, [value]);
    RIGHT: |
      const derivedValue = useMemo(() => compute(value), [value]);
      
  Large contexts with frequent updates:
    WRONG: |
      // Single context with everything
      <AppContext.Provider value={{ user, theme, locale, ... }}>
    RIGHT: |
      // Split by domain
      <UserProvider><ThemeProvider><LocaleProvider>
```

## MUST: Use Production Build

```bash
# Development build (slow, includes warnings)
npm run dev

# Production build (optimized)
npm run build
npm start

# Analyze bundle
ANALYZE=true npm run build
```

## MUST: Profile Before Optimizing

```tsx
// Use React DevTools Profiler
// 1. Open React DevTools
// 2. Go to Profiler tab
// 3. Click record
// 4. Perform actions
// 5. Analyze renders

// Why did this render?
// Look for:
// - Unnecessary re-renders
// - Long render times
// - Cascade re-renders
```

---

**Don't optimize prematurely. Profile first, then optimize.**
