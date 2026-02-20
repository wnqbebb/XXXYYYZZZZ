---
name: barba-transition-patterns
description: Common transition animation patterns. Load when creating transitions.
metadata:
  tags: barba, transitions, animations, patterns, gsap
---

# Transition Patterns Rules

## MUST: Return Promises

```typescript
// CORRECT: Return a Promise
leave({ current }) {
  return gsap.to(current.container, {
    opacity: 0,
    duration: 0.5
  })
  // GSAP tweens return thenable (Promise-like)
}

// CORRECT: Explicit Promise
leave({ current }) {
  return new Promise(resolve => {
    gsap.to(current.container, {
      opacity: 0,
      duration: 0.5,
      onComplete: resolve
    })
  })
}

// FORBIDDEN: Not returning Promise
leave({ current }) {
  gsap.to(current.container, { opacity: 0 }) // ❌
}
```

## Pattern 1: Fade

```typescript
{
  name: 'fade',
  
  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  },
  
  enter({ next }) {
    return gsap.from(next.container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  }
}
```

## Pattern 2: Slide

```typescript
{
  name: 'slide',
  sync: true, // Both pages visible
  
  leave({ current }) {
    return gsap.to(current.container, {
      x: '-100%',
      duration: 0.6,
      ease: 'power2.inOut'
    })
  },
  
  enter({ next }) {
    gsap.set(next.container, { x: '100%' }) // Set initial
    
    return gsap.to(next.container, {
      x: '0%',
      duration: 0.6,
      ease: 'power2.inOut'
    })
  }
}
```

## Pattern 3: Scale + Fade

```typescript
{
  name: 'scale-fade',
  
  leave({ current }) {
    return gsap.to(current.container, {
      scale: 0.95,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  },
  
  enter({ next }) {
    gsap.set(next.container, { scale: 1.05 })
    
    return gsap.to(next.container, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  }
}
```

## Pattern 4: Clip-Path Reveal

```typescript
{
  name: 'clip-reveal',
  
  leave({ current }) {
    return gsap.to(current.container, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 0.8,
      ease: 'power3.inOut'
    })
  },
  
  enter({ next }) {
    gsap.set(next.container, {
      clipPath: 'circle(0% at 50% 50%)'
    })
    
    return gsap.to(next.container, {
      clipPath: 'circle(150% at 50% 50%)',
      duration: 0.8,
      ease: 'power3.inOut'
    })
  }
}
```

## Pattern 5: Custom Cursor Follow

```typescript
{
  name: 'cursor-reveal',
  sync: true,
  
  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.3
    })
  },
  
  enter({ next }) {
    // Reveal from cursor position
    return gsap.from(next.container, {
      opacity: 0,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
}
```

## Pattern 6: Stagger Content

```typescript
{
  name: 'stagger-content',
  
  enter({ next }) {
    const elements = next.container.querySelectorAll('.animate-item')
    
    return gsap.from(elements, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out',
      delay: 0.2 // Wait for container visible
    })
  }
}
```

## Scroll Reset Pattern

```typescript
{
  name: 'with-scroll-reset',
  
  beforeEnter({ next }) {
    // Reset scroll before animation
    window.scrollTo(0, 0)
  },
  
  enter({ next }) {
    // Ensure container at top
    next.container.scrollTop = 0
    
    return gsap.from(next.container, {
      opacity: 0,
      duration: 0.5
    })
  }
}
```

---

**Patterns ready. Proceed to [gsap-integration.md](./gsap-integration.md)**
