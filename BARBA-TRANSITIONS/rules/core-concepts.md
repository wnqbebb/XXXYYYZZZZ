---
name: barba-core-concepts
description: Core concepts and lifecycle hooks. Load when understanding Barba basics.
metadata:
  tags: barba, concepts, lifecycle, hooks, namespace
---

# Core Concepts Rules

## The Lifecycle Hooks

```
COMPLETE LIFECYCLE:

before → beforeLeave → leave → afterLeave → 
beforeEnter → enter → afterEnter → after

┌─────────────────────────────────────────────────────┐
│  1. before          │ Before anything happens       │
│  2. beforeLeave     │ Before leaving current page   │
│  3. leave           │ Leaving animation (REQUIRED)  │
│  4. afterLeave      │ After leaving current page    │
│  5. [Page fetch]    │ Barba fetches new page        │
│  6. beforeEnter     │ Before entering new page      │
│  7. enter           │ Entering animation (REQUIRED) │
│  8. afterEnter      │ After entering new page       │
│  9. after           │ Everything complete           │
└─────────────────────────────────────────────────────┘
```

### Hook Usage

```typescript
{
  name: 'my-transition',
  
  // 1. Global before (runs on all transitions)
  before({ current, next, trigger }) {
    // current: { container, namespace, url }
    // next: { container, namespace, url, html }
    // trigger: 'barba' | 'back' | 'forward' | Element
    
    console.log(`Navigating from ${current.namespace} to ${next.namespace}`)
  },
  
  // 2. Before leaving
  beforeLeave({ current }) {
    // Cleanup current page
    destroyCurrentPageScripts()
  },
  
  // 3. Leave animation (MUST return Promise)
  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.5
    })
  },
  
  // 4. After leaving
  afterLeave({ current }) {
    // Current container removed from DOM
    console.log('Left:', current.namespace)
  },
  
  // 5. Before entering (new container in DOM)
  beforeEnter({ next }) {
    // Prepare new page
    next.container.style.opacity = '0'
  },
  
  // 6. Enter animation (MUST return Promise)
  enter({ next }) {
    return gsap.to(next.container, {
      opacity: 1,
      duration: 0.5
    })
  },
  
  // 7. After entering
  afterEnter({ next }) {
    // Initialize new page scripts
    initNewPageScripts()
  },
  
  // 8. After everything
  after({ current, next }) {
    console.log('Transition complete')
  }
}
```

## Namespaces

### Purpose

```yaml
Namespace:
  PURPOSE: Identify page type for targeting
  USAGE: Route-specific transitions
  EXAMPLE: "home", "about", "product-detail"
```

### Targeting Specific Transitions

```typescript
transitions: [
  // Only for home → about
  {
    name: 'home-to-about',
    from: { namespace: 'home' },
    to: { namespace: 'about' },
    leave() { /* ... */ },
    enter() { /* ... */ }
  },
  
  // Any page → contact
  {
    name: 'to-contact',
    to: { namespace: 'contact' },
    leave() { /* ... */ },
    enter() { /* ... */ }
  },
  
  // Default (catches all)
  {
    name: 'default',
    leave() { /* ... */ },
    enter() { /* ... */ }
  }
]
```

## The Data Object

```typescript
// Available in all hooks
{
  current: {
    container: HTMLElement,  // Current page container
    namespace: string,       // Current namespace
    url: URL                 // Current URL object
  },
  
  next: {
    container: HTMLElement,  // New page container (after fetch)
    namespace: string,       // New namespace
    url: URL,               // New URL object
    html: string            // Raw HTML response
  },
  
  trigger: 'barba' | 'back' | 'forward' | HTMLElement
}
```

## Sync Mode

```typescript
// Async mode (default): leave → fetch → enter
transitions: [{
  sync: false, // or omitted
  leave() { /* ... */ },
  enter() { /* ... */ }
}]

// Sync mode: leave + enter simultaneously
transitions: [{
  sync: true,
  leave() { /* animate out */ },
  enter() { /* animate in simultaneously */ }
}]
```

### When to Use Sync

```yaml
USE sync: true WHEN:
  - Both pages visible during transition
  - Slide/swap animations
  - Cross-fade effects
  
USE sync: false (default) WHEN:
  - Sequential animations
  - One page replaces another
  - Most standard transitions
```

---

**Concepts understood. Proceed to [transition-patterns.md](./transition-patterns.md)**
