---
name: barba-gsap-integration
description: GSAP integration with Barba for advanced animations. Load when adding GSAP animations.
metadata:
  tags: barba, gsap, animation, integration
---

# GSAP Integration Rules

## MUST: Cleanup GSAP

```typescript
{
  name: 'gsap-transition',
  
  beforeLeave({ current }) {
    // MUST: Kill all ScrollTriggers on current page
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars.trigger && current.container.contains(st.vars.trigger)) {
        st.kill()
      }
    })
    
    // MUST: Kill all tweens on current page
    gsap.killTweensOf(current.container.querySelectorAll('*'))
  },
  
  leave({ current }) {
    // Create leave tween
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.5
    })
  },
  
  afterEnter({ next }) {
    // MUST: Refresh ScrollTrigger for new content
    ScrollTrigger.refresh()
    
    // Initialize new page animations
    initPageAnimations(next.container)
  }
}
```

## MUST: Context Pattern

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

function initPageAnimations(container: HTMLElement) {
  // Use GSAP context for automatic cleanup
  const ctx = gsap.context(() => {
    // All animations scoped to container
    
    gsap.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top 80%'
      }
    })
    
    // More animations...
    
  }, container) // Scope to container
  
  return ctx
}

// Store contexts for cleanup
const contexts = new WeakMap()

{
  afterEnter({ next }) {
    const ctx = initPageAnimations(next.container)
    contexts.set(next.container, ctx)
  },
  
  beforeLeave({ current }) {
    // Cleanup context
    const ctx = contexts.get(current.container)
    if (ctx) {
      ctx.revert() // Kill all animations
      contexts.delete(current.container)
    }
  }
}
```

## Timeline Pattern

```typescript
{
  name: 'timeline-transition',
  
  leave({ current }) {
    const tl = gsap.timeline()
    
    tl.to(current.container.querySelectorAll('section'), {
      y: -50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4
    })
    .to(current.container, {
      opacity: 0,
      duration: 0.2
    })
    
    return tl
  },
  
  enter({ next }) {
    const tl = gsap.timeline()
    
    tl.from(next.container, {
      opacity: 0,
      duration: 0.3
    })
    .from(next.container.querySelectorAll('section'), {
      y: 50,
      opacity: 0,
      stagger: 0.1,
      duration: 0.4
    }, '-=0.1')
    
    return tl
  }
}
```

## ScrollTrigger Sync

```typescript
{
  name: 'with-scrolltrigger',
  
  beforeEnter({ next }) {
    // Set initial states
    gsap.set(next.container.querySelectorAll('.reveal'), {
      opacity: 0,
      y: 30
    })
  },
  
  enter({ next }) {
    // Wait for DOM then create ScrollTriggers
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        ScrollTrigger.batch('.reveal', {
          onEnter: batch => gsap.to(batch, {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            overwrite: true
          })
        })
        
        ScrollTrigger.refresh()
        resolve(undefined)
      })
    })
  }
}
```

---

**GSAP integration complete. Proceed to [prefetching.md](./prefetching.md)**
