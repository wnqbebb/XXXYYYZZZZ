---
name: gsap-react-integration
description: React integration patterns for GSAP. Load when using GSAP with React.
metadata:
  tags: gsap, react, hooks, integration
---

# React Integration Rules

## MUST: useGSAP Hook

```typescript
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'

export function MyComponent() {
  const container = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    // This code runs after DOM is ready
    gsap.from('.box', {
      x: 100,
      opacity: 0,
      duration: 1
    })
  }, { scope: container }) // Scoped to container
  
  return (
    <div ref={container}>
      <div className="box">Animated</div>
    </div>
  )
}
```

### WHY: useGSAP vs useEffect/useLayoutEffect

```yaml
useGSAP:
  MUST: For all GSAP in React
  WHY: Automatic cleanup, proper timing
  BENEFITS:
    - Handles strict mode double-run
    - Automatic context cleanup
    - Proper RAF timing

FORBIDDEN:
  useEffect for GSAP:
    WRONG: useEffect(() => { gsap.to(...) }, [])
    RIGHT: useGSAP(() => { gsap.to(...) }, { scope })
```

## MUST: gsap.context()

```typescript
useGSAP(() => {
  // Create context (auto-cleanup on unmount)
  const ctx = gsap.context(() => {
    
    // All animations here are tracked
    gsap.to('.title', { y: 0, opacity: 1 })
    
    ScrollTrigger.create({
      trigger: '.section',
      start: 'top 80%',
      onEnter: () => gsap.to('.item', { x: 100 })
    })
    
  }, container) // Scope to this element
  
  // Return cleanup function
  return () => ctx.revert()
}, [])
```

## MUST: Dependencies Pattern

```typescript
export function AnimatedList({ items }: { items: string[] }) {
  const container = useRef<HTMLDivElement>(null)
  
  useGSAP(() => {
    gsap.from('.list-item', {
      y: 20,
      opacity: 0,
      stagger: 0.1
    })
  }, {
    scope: container,
    dependencies: [items] // Re-run when items change
  })
  
  return (
    <div ref={container}>
      {items.map(item => (
        <div key={item} className="list-item">{item}</div>
      ))}
    </div>
  )
}
```

## MUST: Refs for Elements

```typescript
export function ManualControl() {
  const boxRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween>()
  
  useGSAP(() => {
    // Store tween in ref for external control
    tweenRef.current = gsap.to(boxRef.current, {
      x: 100,
      paused: true // Start paused
    })
  }, [])
  
  const play = () => tweenRef.current?.play()
  const reverse = () => tweenRef.current?.reverse()
  
  return (
    <>
      <div ref={boxRef}>Box</div>
      <button onClick={play}>Play</button>
      <button onClick={reverse}>Reverse</button>
    </>
  )
}
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  setState in animations:
    WRONG: onUpdate: () => setProgress(gsap.progress())
    RIGHT: Use refs for DOM updates, not React state
    
  Querying DOM directly:
    WRONG: document.querySelector('.box')
    RIGHT: Use refs or scoped selectors
    
  Forgetting cleanup:
    WRONG: No return in useGSAP
    RIGHT: Return () => ctx.revert()
```

---

**React + GSAP mastered. Best practices enforced.**
