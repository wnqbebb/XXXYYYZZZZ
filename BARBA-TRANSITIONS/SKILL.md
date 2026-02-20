---
name: barba-transitions
description: Barba.js for seamless page transitions and PJAX navigation. Use when (1) Creating fluid page transitions, (2) Building SPA-like experiences in MPA, (3) Implementing route animations, (4) Adding page prefetching. MANDATORY for page transition effects.
metadata:
  tags: barba, transitions, pjax, routing, page-animation, navigation
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: high
  category: animation
---

# Barba Transitions Master System

**Seamless page transitions. Fluid navigation experiences.**

Barba.js creates smooth, fluid transitions between pages by preventing full page reloads and instead replacing content dynamically. Combined with GSAP, it enables award-winning page transition animations.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - User says: "page transitions", "smooth navigation", "SPA feel"
  - Building multi-page sites with fluid transitions
  - Creating portfolio/agency sites
  - Implementing page reveal effects
  - Adding page prefetching for performance
  - Any project requiring route animations

DO NOT USE WHEN:
  - Single Page Applications (SPA) - use React Router
  - Simple sites with no transitions
  - Sites with heavy dynamic content per page
  - When SEO crawling is problematic (use carefully)
```

---

## How Barba Works

### The PJAX Pattern

```
Traditional Navigation:
User clicks → Full page reload → White flash → New page renders

Barba Navigation:
User clicks → Barba intercepts → Transition animation → 
Content replaced → New page renders seamlessly
```

### Core Concepts

```yaml
Views:
  - Define containers that persist between pages
  - Usually the content wrapper
  - Identified by data-barba attributes

Transitions:
  - Define animation between pages
  - leave: Animation when leaving current page
  - enter: Animation when entering new page
  - once: Animation on first load only

Hooks:
  - before: Before transition starts
  - beforeLeave: Before leaving current page
  - afterLeave: After leaving current page
  - beforeEnter: Before entering new page
  - afterEnter: After entering new page
  - after: After transition completes
```

---

## The Barba Stack

### Core Dependencies

```yaml
Core:
  - @barba/core: ^2.10.0
  
Optional Plugins:
  - @barba/prefetch: Prefetch pages on hover
  - @barba/router: Route matching
  - @barba/head: Update head elements

Animation Partner:
  - gsap: ^3.12.0 (for transitions)
  
Integration:
  - next.js: ^14/15 (with custom integration)
  - lenis: Smooth scroll reset between pages
```

---

## Rule Files Index

### Foundation Rules

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/installation-setup.md](./rules/installation-setup.md) | Installation and initialization | Starting with Barba |
| [rules/core-concepts.md](./rules/core-concepts.md) | Core concepts and structure | Understanding basics |
| [rules/transition-patterns.md](./rules/transition-patterns.md) | Transition animation patterns | Creating transitions |
| [rules/gsap-integration.md](./rules/gsap-integration.md) | GSAP + Barba integration | Adding animations |
| [rules/prefetching.md](./rules/prefetching.md) | Page prefetching setup | Performance optimization |
| [rules/nextjs-integration.md](./rules/nextjs-integration.md) | Next.js App Router integration | Using with Next.js |

### Asset Library

```
rules/assets/
├── components/
│   ├── BarbaProvider.tsx       # React context provider
│   ├── PageTransition.tsx      # Transition wrapper
│   └── TransitionLayout.tsx    # Layout with transitions
├── hooks/
│   ├── useBarba.ts             # Barba hook
│   └── usePageTransition.ts    # Transition control
├── lib/
│   └── barba.ts                # Barba configuration
└── transitions/
    ├── fade.ts                 # Fade transition
    ├── slide.ts                # Slide transition
    └── reveal.ts               # Reveal transition
```

---

## Quick Start Workflow

### Step 1: Installation

```bash
# Install core
npm install @barba/core

# Install prefetch plugin (recommended)
npm install @barba/prefetch

# GSAP for animations
npm install gsap @gsap/react
```

### Step 2: HTML Structure

```html
<!-- MUST: Add data-barba attributes -->
<body data-barba="wrapper">
  <!-- Persistent elements (header, nav) -->
  <header>...</header>
  
  <!-- Transition container -->
  <main data-barba="container" data-barba-namespace="home">
    <!-- Page content -->
  </main>
  
  <!-- Persistent elements (footer) -->
  <footer>...</footer>
</body>
```

### Step 3: Initialize Barba

```typescript
import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'

// Register prefetch plugin
barba.use(barbaPrefetch)

// Initialize
barba.init({
  transitions: [{
    name: 'default',
    leave(data) {
      // Leave animation
    },
    enter(data) {
      // Enter animation
    }
  }]
})
```

---

## Architecture Principles

### 1. Container Structure

```yaml
MUST:
  - Use data-barba="wrapper" on body/main
  - Use data-barba="container" on content area
  - Use data-barba-namespace for page identification
  - Keep header/footer outside container

FORBIDDEN:
  - Wrapping entire body including header
  - Multiple containers without namespaces
  - Dynamic namespace changes
```

### 2. Animation Performance

```yaml
MUST:
  - Use transform/opacity for transitions
  - Kill GSAP animations on leave
  - Reset scroll position between pages
  - Use will-change sparingly

FORBIDDEN:
  - Layout-triggering animations
  - Heavy calculations during transition
  - Blocking the main thread
  - Animating width/height
```

### 3. State Management

```yaml
MUST:
  - Reset component state on page enter
  - Re-initialize event listeners
  - Update active navigation state
  - Sync URL with current page

FORBIDDEN:
  - Sharing state between pages
  - Memory leaks from listeners
  - Stale data persistence
```

---

## Integration with Other Skills

```
DEPENDS ON:
  - gsap-animator (Transition animations)
  - nextjs-architect (App Router integration)

WORKS WITH:
  - lenis-scroll (Scroll reset)
  - performance-guardian (Prefetch optimization)

ENABLES:
  - AWWWARDS-BOILERPLATE (Seamless navigation)
  - Premium user experiences
```

---

## Common Patterns

### Fade Transition

```typescript
{
  name: 'fade',
  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.5
    })
  },
  enter({ next }) {
    return gsap.from(next.container, {
      opacity: 0,
      duration: 0.5
    })
  }
}
```

### Slide Transition

```typescript
{
  name: 'slide',
  leave({ current }) {
    return gsap.to(current.container, {
      x: '-100%',
      duration: 0.8,
      ease: 'power2.inOut'
    })
  },
  enter({ next }) {
    return gsap.from(next.container, {
      x: '100%',
      duration: 0.8,
      ease: 'power2.inOut'
    })
  }
}
```

---

## Troubleshooting

### Common Issues

Load [rules/nextjs-integration.md](./rules/nextjs-integration.md) for:
- Next.js App Router compatibility
- Server/Client component handling
- Dynamic route issues
- Scroll restoration

---

## Version History

```yaml
v3.0.0 (2026):
  - @barba/core 2.10+
  - Next.js 15 integration
  - React Server Components support
  - Improved TypeScript definitions

v2.0.0 (2025):
  - @barba/core 2.9+
  - Prefetch plugin optimization
  - GSAP 3 integration
```

---

**Barba.js transforms traditional multi-page sites into fluid, app-like experiences. Master it for award-winning navigation.**
