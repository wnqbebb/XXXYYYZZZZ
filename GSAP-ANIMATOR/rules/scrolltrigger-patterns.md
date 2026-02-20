---
name: gsap-scrolltrigger-patterns
description: ScrollTrigger patterns for scroll-driven animations. Load when implementing scroll effects.
metadata:
  tags: gsap, scrolltrigger, scroll, pinning, scrub
---

# ScrollTrigger Patterns Rules

## MUST: Basic Setup

```typescript
// lib/gsap.ts - Register plugin first
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

## MUST: Basic ScrollTrigger

```typescript
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.element',        // Element that triggers
    start: 'top 80%',          // When animation starts
    end: 'bottom 20%',         // When animation ends
    scrub: 1,                  // Smooth scrub (0.5-3 recommended)
    markers: false,            // Set true for debugging
    toggleActions: 'play none none reverse' // On enter/leave/enterBack/leaveBack
  },
  y: -100,
  opacity: 1
})
```

### Toggle Actions Explained

```yaml
toggleActions: 'play none none reverse'
  Position 1 (enter):     What to do when entering
  Position 2 (leave):     What to do when leaving (scrolling past)
  Position 3 (enterBack): What to do when entering from bottom
  Position 4 (leaveBack): What to do when leaving to top

Values:
  - play:     Start animation
  - pause:    Pause animation
  - resume:   Resume from current
  - reverse:  Play backwards
  - restart:  Start from beginning
  - reset:    Go to start (no anim)
  - complete: Go to end (no anim)
  - none:     Do nothing
```

## MUST: Pinned Sections

```typescript
// Horizontal scroll section
const sections = gsap.utils.toArray<HTMLElement>('.panel')

const scrollTween = gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section',
    pin: true,                           // Pin the section
    scrub: 1,
    end: () => '+=' + document.querySelector('.horizontal-section')!.offsetWidth,
    anticipatePin: 1                     // Smooth pin start
  }
})
```

### WHY: anticipatePin

```yaml
anticipatePin: 1:
  MUST: For smooth pinning
  WHY: Prevents jitter at pin start
  WHEN: All pinned sections
```

## MUST: Snap Points

```typescript
// Snap to nearest section
ScrollTrigger.create({
  snap: {
    snapTo: 1 / (sections.length - 1),
    duration: { min: 0.2, max: 0.5 },
    delay: 0.1,
    ease: 'power2.inOut'
  }
})
```

## MUST: Parallax Layers

```typescript
gsap.utils.toArray<HTMLElement>('.parallax').forEach((layer) => {
  const speed = layer.dataset.speed || '0.5'
  
  gsap.to(layer, {
    y: `${100 * parseFloat(speed)}%`,
    ease: 'none',
    scrollTrigger: {
      trigger: layer,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
})
```

## MUST: Batch Animations (Performance)

```typescript
// Reveal multiple elements efficiently
ScrollTrigger.batch('.reveal', {
  onEnter: batch => gsap.to(batch, {
    y: 0,
    opacity: 1,
    stagger: 0.1,
    overwrite: true
  }),
  onLeave: batch => gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.1, overwrite: true }),
  onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 50, overwrite: true })
})
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Creating triggers in loops without cleanup:
    WRONG: items.forEach(item => ScrollTrigger.create({...}))
    RIGHT: Use ScrollTrigger.batch()
    
  Not refreshing on resize:
    WRONG: No resize handler
    RIGHT: ScrollTrigger.refresh() on resize
    
  Animating layout properties:
    WRONG: { width: 100, height: 200 }
    RIGHT: { scaleX: 1.5, scaleY: 2 }
```

---

**ScrollTrigger mastered. Scroll-driven animations ready.**
