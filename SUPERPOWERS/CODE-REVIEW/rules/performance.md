---
name: performance
description: Performance optimization patterns and anti-patterns. Load during Pillar 2 of code-review to identify and fix performance issues.
metadata:
  tags: performance, optimization, react-performance, memory, rendering, bundling
---

# Performance Optimization

**Fast is better than slow. Every millisecond counts.**

---

## React Performance

### Re-render Optimization

**Understanding React Renders**:
```
When does React re-render?
1. State changes (useState, useReducer)
2. Props change (parent re-renders)
3. Context value changes
4. Parent re-renders (even if props don't change)

The Problem:
Parent renders → All children render → Grandchildren render
                          ↓
              Unnecessary work = Jank
```

**Memoization Strategy**:
```typescript
// WRONG: Component re-renders when parent updates
function ExpensiveList({ items }) {
  // This calculation runs on every render
  const sorted = items.sort((a, b) => b.score - a.score)
  
  return <ul>{sorted.map(...)}</ul>
}

// CORRECT: Memoize expensive calculations
import { useMemo } from 'react'

function ExpensiveList({ items }) {
  const sorted = useMemo(
    () => items.sort((a, b) => b.score - a.score),
    [items]  // Only re-sort when items change
  )
  
  return <ul>{sorted.map(...)}</ul>
}

// WRONG: New function on every render
function SearchForm({ onSearch }) {
  const handleSubmit = (e) => {  // New function each render
    e.preventDefault()
    onSearch(query)
  }
  
  return <form onSubmit={handleSubmit}>...</form>
}

// CORRECT: Memoize callbacks (when needed)
import { useCallback } from 'react'

function SearchForm({ onSearch }) {
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      onSearch(query)
    },
    [onSearch, query]  // Only recreate when deps change
  )
  
  return <form onSubmit={handleSubmit}>...</form>
}
```

**When to Memoize**:
```
USE useMemo WHEN:
├── Expensive calculation (>1ms)
├── Object/array identity matters (dependency)
├── Preventing child re-renders
└── Stable reference needed

DON'T useMemo WHEN:
├── Calculation is cheap (<1ms)
├── Premature optimization
├── Dependencies change every render
└── It makes code harder to read

USE useCallback WHEN:
├── Passed to memoized child
├── Used in dependency array
├── Event handler in list item
└── Function reference must be stable

DON'T useCallback WHEN:
├── Not passed to children
├── Child is not memoized
├── Dependencies change constantly
```

**React.memo for Components**:
```typescript
// WRONG: List re-renders when parent updates
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <UserItem key={user.id} user={user} />
      ))}
    </ul>
  )
}

function UserItem({ user }) {  // Re-renders even if user didn't change
  return <li>{user.name}</li>
}

// CORRECT: Memoize list items
const UserItem = React.memo(function UserItem({ user }) {
  return <li>{user.name}</li>
})

// With custom comparison
const UserItem = React.memo(
  function UserItem({ user }) {
    return <li>{user.name}</li>
  },
  (prevProps, nextProps) => {
    return prevProps.user.id === nextProps.user.id
  }
)
```

### State Management Performance

**State Colocation**:
```typescript
// WRONG: State too high in tree
default function App() {
  const [formData, setFormData] = useState({})  // Only Form needs this
  
  return (
    <div>
      <Header />
      <Form data={formData} onChange={setFormData} />  
      <Footer />
    </div>
  )  // Header and Footer re-render on every keystroke!
}

// CORRECT: State closest to usage
function Form() {
  const [formData, setFormData] = useState({})  // Local state
  
  return <form>...</form>
}
```

**Context Optimization**:
```typescript
// WRONG: Context value changes on every render
function App() {
  const [user, setUser] = useState(null)
  
  // New object every render → all consumers re-render
  const value = { user, setUser, theme: 'dark' }
  
  return (
    <UserContext.Provider value={value}>
      <App />
    </UserContext.Provider>
  )
}

// CORRECT: Split contexts by update frequency
function App() {
  const [user, setUser] = useState(null)
  
  // Static value - never causes re-render
  const themeValue = useMemo(() => ({ theme: 'dark' }), [])
  
  // Separate contexts
  return (
    <ThemeContext.Provider value={themeValue}>
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeContext.Provider>
  )
}
```

---

## Rendering Performance

### The Golden Rules

```
ANIMATION PERFORMANCE:
├── ALWAYS use transform and opacity for animations
├── NEVER animate width, height, top, left, margin, padding
├── Use will-change sparingly (add before, remove after)
├── Prefer CSS animations over JavaScript
└── Use requestAnimationFrame for JS animations

LAYOUT PERFORMANCE:
├── Minimize DOM depth
├── Avoid forced synchronous layout
├── Batch DOM reads and writes
├── Use CSS containment
└── Virtualize long lists
```

**Forced Synchronous Layout**:
```javascript
// WRONG: Interleaving read/write causes layout thrashing
function updatePositions() {
  const boxes = document.querySelectorAll('.box')
  
  boxes.forEach(box => {
    const width = box.offsetWidth  // READ (forces layout)
    box.style.width = width * 2 + 'px'  // WRITE (invalidates layout)
    // Next iteration: READ forces recalculation!
  })
}

// CORRECT: Batch reads then writes
function updatePositions() {
  const boxes = document.querySelectorAll('.box')
  
  // READ phase
  const widths = Array.from(boxes).map(box => box.offsetWidth)
  
  // WRITE phase (single layout calculation)
  boxes.forEach((box, i) => {
    box.style.width = widths[i] * 2 + 'px'
  })
}
```

**CSS Containment**:
```css
/* Isolate this component's layout from parent */
.component {
  contain: layout;
}

/* Isolate layout and paint */
.component {
  contain: layout paint;
}

/* Strict containment (most performant) */
.component {
  contain: strict;
  /* Equivalent to: layout paint style size */
}
```

---

## List Virtualization

### For Large Lists

```typescript
// WRONG: Rendering 10,000 items kills performance
function BigList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ExpensiveItem key={item.id} data={item} />
      ))}
    </ul>
  )
}

// CORRECT: Virtualize with react-window
import { FixedSizeList } from 'react-window'

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ExpensiveItem data={items[index]} />
    </div>
  )
  
  return (
    <FixedSizeList
      height={500}
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  )
  // Only renders visible items (~10) instead of 10,000
}
```

---

## Image Optimization

### Best Practices

```
FORMAT SELECTION:
├── Photos: WebP (with JPEG fallback)
├── Graphics: SVG
├── Icons: SVG or icon font
├── Animations: WebP or video (not GIF)
└── Favicons: Multiple sizes ICO/PNG

SIZING:
├── Serve exact sizes needed
├── Use srcset for responsive images
├── Lazy load below-fold images
├── Use blur-up placeholder
└── Set explicit width/height (prevent CLS)
```

**Next.js Image Component**:
```typescript
import Image from 'next/image'

// Automatic optimization
<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority  // Above-fold, preload
  quality={85}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Responsive
<Image
  src="/photo.jpg"
  alt="Description"
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## Memory Management

### Leak Prevention

```typescript
// WRONG: Event listener leak
useEffect(() => {
  window.addEventListener('resize', handleResize)
  // Never removed!
}, [])

// CORRECT: Cleanup subscriptions
useEffect(() => {
  window.addEventListener('resize', handleResize)
  
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

// WRONG: SetInterval without cleanup
useEffect(() => {
  setInterval(() => {
    setCount(c => c + 1)
  }, 1000)
  // Interval keeps running after unmount!
}, [])

// CORRECT: Clear interval on cleanup
useEffect(() => {
  const id = setInterval(() => {
    setCount(c => c + 1)
  }, 1000)
  
  return () => clearInterval(id)
}, [])

// WRONG: Closure capturing large object
useEffect(() => {
  fetchHugeDataset().then(data => {
    setData(data)
  })
}, [])

// CORRECT: Abort fetch on cleanup
useEffect(() => {
  const controller = new AbortController()
  
  fetchHugeDataset({ signal: controller.signal })
    .then(data => setData(data))
    .catch(err => {
      if (err.name !== 'AbortError') throw err
    })
  
  return () => controller.abort()
}, [])
```

---

## Bundle Optimization

### Code Splitting

```typescript
// Route-based splitting (automatic in Next.js)
// pages/index.tsx → index.js chunk
// pages/about.tsx → about.js chunk

// Component-level splitting
import dynamic from 'next/dynamic'

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <ChartSkeleton />,
  ssr: false  // Client-side only
})

// Library splitting
import { motion } from 'framer-motion'  // 50KB

// vs.

import { motion } from 'framer-motion/esm/components/Motion'  // Tree-shake
```

**Tree Shaking**:
```typescript
// WRONG: Imports entire library
import _ from 'lodash'
_.map(items, fn)

// CORRECT: Import only what you need
import map from 'lodash/map'
map(items, fn)

// OR: Use ES modules version
import { map } from 'lodash-es'

// BEST: Use native or lighter alternative
items.map(fn)  // Native Array.map
```

---

## Performance Budgets

### Defining Limits

```javascript
// lighthouse-ci.config.js
module.exports = {
  ci: {
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-byte-weight': ['error', { maxNumericValue: 500000 }], // 500KB
      },
    },
  },
}
```

---

## Performance Checklist

- [ ] Components use React.memo when beneficial
- [ ] Expensive calculations use useMemo
- [ ] Callbacks use useCallback when passed to children
- [ ] State is colocated closest to usage
- [ ] Context is split by update frequency
- [ ] Lists are virtualized if >100 items
- [ ] Images are optimized and lazy-loaded
- [ ] Animations use transform/opacity only
- [ ] Event listeners are cleaned up
- [ ] Intervals/timeouts are cleared
- [ ] Fetch requests can be aborted
- [ ] Bundle size is monitored
- [ ] Code is split appropriately
- [ ] Performance budgets are enforced
