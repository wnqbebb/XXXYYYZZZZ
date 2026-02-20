---
name: gsap-animator
description: GSAP animation mastery for award-winning web experiences. Use when (1) Creating scroll animations with ScrollTrigger, (2) Building complex timeline sequences, (3) Implementing micro-interactions, (4) Animating text with SplitText, (5) Optimizing for 60fps performance. MANDATORY for animated sites.
metadata:
  tags: gsap, animation, scrolltrigger, timeline, performance, awwwards, splittext
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
  category: animation
---

# GSAP Animator Master System

**The gold standard of web animation. 60fps or nothing.**

GSAP (GreenSock Animation Platform) is the industry-standard animation library for the web. Combined with ScrollTrigger, it enables scroll-driven animations that power the world's most awarded websites.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - User says: "animaciones", "scroll effects", "parallax"
  - Implementing scroll-triggered reveals
  - Creating page load animations
  - Building horizontal scroll sections
  - Animating text (characters, words, lines)
  - Creating pinned scroll sections
  - Implementing micro-interactions (hover, click)
  - Complex timeline sequences
  - ANY Awwwards-style site

DO NOT USE WHEN:
  - Simple CSS transitions suffice
  - User prefers reduced motion
  - One-off simple animations
  - Server-side rendering only (no client JS)
```

---

## The GSAP Stack

### Core Dependencies

```yaml
Core:
  - gsap: ^3.12.5 (animation engine)
  
Official Plugins:
  - ScrollTrigger: ^3.12.5 (scroll-driven animations)
  - SplitText: ^3.12.5 (text splitting)
  - Flip: ^3.12.5 (layout transitions)
  - Observer: ^3.12.5 (scroll/resize/touch)

React Integration:
  - @gsap/react: ^2.1.0 (React hooks)
  
Utilities:
  - lenis: ^1.1.0 (smooth scroll sync)
```

### Plugin Registration

```typescript
// lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip)
}

export { gsap, ScrollTrigger, SplitText, Flip }
```

---

## The Golden Rules

### Performance Commandments

```yaml
✅ DO:
  - Animate transform (x, y, scale, rotate, skew)
  - Animate opacity
  - Use will-change (add before, remove after)
  - Use force3D: true for GPU acceleration
  - Use gsap.context() for cleanup
  - Kill animations on unmount

❌ NEVER:
  - Animate width, height, top, left, margin, padding
  - Animate filter: blur() continuously
  - Use setState in onUpdate callbacks
  - Create new tweens in mousemove/RAF loops
  - Forget cleanup (causes memory leaks)
  - Ignore prefers-reduced-motion
```

---

## Rule Files Index

### Core Animation

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/scrolltrigger-patterns.md](./rules/scrolltrigger-patterns.md) | Scroll-driven animations | Scroll effects needed |
| [rules/timeline-mastery.md](./rules/timeline-mastery.md) | Complex sequences | Multi-step animations |
| [rules/react-integration.md](./rules/react-integration.md) | React + GSAP patterns | Using React |
| [rules/text-animations.md](./rules/text-animations.md) | SplitText patterns | Text animations |

### Optimization

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/performance-60fps.md](./rules/performance-60fps.md) | Performance optimization | Optimization needed |
| [rules/cleanup-memory.md](./rules/cleanup-memory.md) | Memory management | Preventing leaks |
| [rules/mobile-optimization.md](./rules/mobile-optimization.md) | Mobile/touch | Mobile support |

### Asset Library

```
rules/assets/
├── components/
│   ├── AnimatedSection.tsx     # Scroll-triggered wrapper
│   ├── ParallaxImage.tsx       # Parallax effect
│   ├── TextReveal.tsx          # Text animation component
│   └── HorizontalScroll.tsx    # Horizontal scroll section
├── hooks/
│   ├── useGsap.tsx             # GSAP context hook
│   ├── useScrollTrigger.tsx    # ScrollTrigger hook
│   └── useReducedMotion.tsx    # Accessibility hook
├── lib/
│   └── gsap.ts                 # Plugin registration
└── animations/
    ├── fade-up.ts              # Fade + translate preset
    ├── stagger-reveal.ts       # Staggered reveal preset
    └── horizontal-scroll.ts    # Horizontal scroll preset
```

---

## Quick Start Patterns

### ScrollTrigger Basic

```typescript
gsap.to('.element', {
  scrollTrigger: {
    trigger: '.element',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 1
  },
  y: -100,
  opacity: 1
})
```

### Timeline Sequence

```typescript
const tl = gsap.timeline()
tl.from('.title', { y: 100, opacity: 0, duration: 1 })
  .from('.subtitle', { y: 50, opacity: 0, duration: 0.8 }, '-=0.5')
  .from('.cta', { scale: 0, duration: 0.5, ease: 'back.out' }, '-=0.3')
```

### React Integration

```tsx
'use client'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'

export function HeroAnimation() {
  const container = useRef<HTMLDivElement>(null)
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', { y: 100, opacity: 0, duration: 1 })
    }, container)
    
    return () => ctx.revert()
  }, [])
  
  return <div ref={container}>...</div>
}
```

---

## Integration with Other Skills

```
DEPENDS ON:
  - html5-semantic (Structure)
  - css3-modern (Styling foundations)

WORKS WITH:
  - lenis-scroll (Smooth scroll sync)
  - barba-transitions (Page transitions)
  - threejs-creative (WebGL + GSAP)
  - splittype-typography (Text splitting)
  - performance-guardian (Optimization)

ENABLES:
  - AWWWARDS-BOILERPLATE animations
  - Premium user experiences
  - Award-winning sites
```

---

## Version History

```yaml
v3.0.0 (2026):
  - GSAP 3.12.5
  - ScrollTrigger advanced features
  - React 18 concurrent mode support
  - Improved mobile performance

v2.0.0 (2025):
  - GSAP 3.10+
  - @gsap/react hooks
  - Strict TypeScript
```

---

**Master GSAP. Create experiences that captivate.**
