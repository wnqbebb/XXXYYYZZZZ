---
name: gsap-cleanup-memory
description: Memory management and cleanup for GSAP. Load when preventing memory leaks.
metadata:
  tags: gsap, cleanup, memory, leaks, performance
---

# Cleanup & Memory Rules

## MUST: gsap.context()

```typescript
useGSAP(() => {
  // Create context - all animations tracked
  const ctx = gsap.context(() => {
    gsap.to('.box', { x: 100 })
    
    ScrollTrigger.create({
      trigger: '.section',
      start: 'top 80%'
    })
  }, containerRef) // Scope to element
  
  // Return cleanup
  return () => ctx.revert()
}, [])
```

### What ctx.revert() Does

```yaml
Kills:
  - All tweens created in context
  - All timelines created in context
  - All ScrollTriggers in context
  
Restores:
  - Target elements to pre-animation state
  - Inline styles applied by GSAP
```

## MUST: Kill Specific Tweens

```typescript
const tween = gsap.to('.box', { x: 100 })

// Kill specific tween
tween.kill()

// Kill all tweens of target
gsap.killTweensOf('.box')

// Kill all tweens
gsap.globalTimeline.clear()
```

## MUST: Kill ScrollTriggers

```typescript
// Kill specific trigger
const trigger = ScrollTrigger.create({ ... })
trigger.kill()

// Kill all ScrollTriggers
ScrollTrigger.getAll().forEach(st => st.kill())

// Kill by query
ScrollTrigger.getAll().forEach(st => {
  if (st.trigger === '.my-section') {
    st.kill()
  }
})
```

## MUST: Component Unmount Pattern

```typescript
export function AnimatedSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  useGSAP(() => {
    const ctx = gsap.context(() => {
      // All animations here
      gsap.to('.item', { x: 100 })
      
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 80%'
      })
    }, sectionRef)
    
    return () => ctx.revert()
  }, [])
  
  return <section ref={sectionRef}>...</section>
}
```

## FORBIDDEN: Memory Leak Patterns

```yaml
FORBIDDEN:
  Creating without cleanup:
    WRONG: useEffect(() => { ScrollTrigger.create({...}) }, [])
    RIGHT: Return cleanup function
    
  Global timeline buildup:
    WRONG: Creating infinite tweens in loops
    RIGHT: Kill old tweens before creating new
    
  ScrollTrigger accumulation:
    WRONG: Creating new triggers on every render
    RIGHT: Create once, kill on unmount
```

---

**Memory leaks prevented. Cleanup mastered.**
