---
name: gsap-performance-60fps
description: Performance optimization for 60fps animations. Load when optimizing animations.
metadata:
  tags: gsap, performance, 60fps, optimization
---

# Performance 60fps Rules

## MUST: GPU-Accelerated Properties

```typescript
// ✅ DO: Animate these (GPU accelerated)
gsap.to('.element', {
  x: 100,        // transform: translateX()
  y: 100,        // transform: translateY()
  scale: 1.5,    // transform: scale()
  rotation: 360, // transform: rotate()
  skewX: 10,     // transform: skewX()
  opacity: 0.5   // opacity
})

// ❌ NEVER: Animate these (trigger layout/paint)
gsap.to('.element', {
  width: 100,    // Triggers layout
  height: 100,   // Triggers layout
  top: 100,      // Triggers layout
  left: 100,     // Triggers layout
  margin: 20,    // Triggers layout
  padding: 20    // Triggers layout
})
```

## MUST: will-change Strategy

```typescript
// Add before animation
element.style.willChange = 'transform, opacity'

// Run animation
gsap.to(element, { x: 100, opacity: 0.5 })

// Remove after animation (MUST)
gsap.to(element, {
  x: 100,
  opacity: 0.5,
  onComplete: () => {
    element.style.willChange = 'auto'
  }
})
```

## MUST: force3D

```typescript
// Force GPU layer creation
gsap.to('.element', {
  x: 100,
  force3D: true  // Creates GPU layer
})

// Or set globally
gsap.defaults({
  force3D: true
})
```

## MUST: Debounce Resize

```typescript
import { debounce } from '@/lib/utils'

const handleResize = debounce(() => {
  ScrollTrigger.refresh()
}, 200)

window.addEventListener('resize', handleResize)
```

## MUST: Batch DOM Reads/Writes

```typescript
// ❌ BAD: Interleaving reads and writes
const height = element.offsetHeight  // Read (forces layout)
element.style.height = '100px'        // Write (invalidates)
const width = element.offsetWidth     // Read (forces re-layout!)

// ✅ GOOD: Batch reads, then writes
const height = element.offsetHeight   // Read
const width = element.offsetWidth     // Read
element.style.height = '100px'        // Write
element.style.width = '100px'         // Write
```

## MUST: quickSetter for Frequent Updates

```typescript
// For mouse followers, scroll progress, etc.
const setX = gsap.quickSetter('.follower', 'x', 'px')
const setY = gsap.quickSetter('.follower', 'y', 'px')

// Much faster than gsap.to() in RAF
window.addEventListener('mousemove', (e) => {
  setX(e.clientX)
  setY(e.clientY)
})
```

## FORBIDDEN: Performance Killers

```yaml
FORBIDDEN:
  Continuous blur animations:
    WRONG: gsap.to(el, { filter: 'blur(10px)' })
    WHY: Expensive paint operation
    RIGHT: Animate opacity with blurred duplicate
    
  Animating many elements:
    WRONG: 100+ individual tweens
    RIGHT: Use sprites or canvas for particles
    
  setState in onUpdate:
    WRONG: onUpdate: () => setState(...)
    WHY: Triggers React re-render every frame
    RIGHT: Use refs, direct DOM manipulation
```

---

**60fps achieved. Performance optimized.**
