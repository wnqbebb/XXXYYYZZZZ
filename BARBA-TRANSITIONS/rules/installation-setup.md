---
name: barba-installation
description: Installation and setup for Barba.js. Load when starting with Barba.
metadata:
  tags: barba, installation, setup, npm
---

# Installation & Setup Rules

## MUST: Install Core Packages

```bash
# Core Barba
npm install @barba/core@^2.10.0

# Prefetch plugin (highly recommended)
npm install @barba/prefetch@^2.1.0

# GSAP for animations
npm install gsap@^3.12.0
```

### WHY: These Versions

```yaml
@barba/core@^2.10.0:
  MUST: Latest stable with bug fixes
  WHY: Improved lifecycle hooks
  FORBIDDEN: < 2.9 (missing features)

@barba/prefetch@^2.1.0:
  MUST: For hover prefetching
  WHY: Dramatically improves perceived performance
  FORBIDDEN: Not using prefetch on production sites

gsap@^3.12.0:
  MUST: For transition animations
  WHY: Best animation library for Barba
  ALTERNATIVE: anime.js, but GSAP preferred
```

## MUST: HTML Structure

```html
<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body data-barba="wrapper">
  
  <!-- Persistent: Header stays during transitions -->
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  
  <!-- MUST: Container gets replaced -->
  <main 
    data-barba="container" 
    data-barba-namespace="home"
  >
    <!-- Page-specific content -->
    <h1>Welcome</h1>
    <p>Page content here...</p>
  </main>
  
  <!-- Persistent: Footer stays -->
  <footer>
    <p>&copy; 2026</p>
  </footer>
  
  <!-- Scripts -->
  <script src="/js/barba-init.js"></script>
</body>
</html>
```

### WHY: This Structure

```yaml
data-barba="wrapper":
  MUST: On body or main wrapper
  WHY: Defines transition boundaries
  FORBIDDEN: Multiple wrappers

data-barba="container":
  MUST: On content area only
  WHY: Only this gets replaced
  FORBIDDEN: Including header/footer inside

data-barba-namespace:
  MUST: Unique per page type
  WHY: Target specific transitions
  EXAMPLE: "home", "about", "product"
```

## MUST: Basic Initialization

```typescript
// lib/barba.ts
import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'

// Register plugins
barba.use(barbaPrefetch)

// Initialize with basic transition
export function initBarba() {
  barba.init({
    debug: process.env.NODE_ENV === 'development',
    
    transitions: [
      {
        name: 'default',
        
        // Runs once on first load
        once({ next }) {
          console.log('First load:', next.namespace)
        },
        
        // Before leaving current page
        beforeLeave({ current }) {
          console.log('Leaving:', current.namespace)
        },
        
        // Leave animation (REQUIRED)
        leave({ current }) {
          return new Promise(resolve => {
            current.container.style.opacity = '0'
            setTimeout(resolve, 300)
          })
        },
        
        // Before entering new page
        beforeEnter({ next }) {
          console.log('Entering:', next.namespace)
        },
        
        // Enter animation (REQUIRED)
        enter({ next }) {
          return new Promise(resolve => {
            next.container.style.opacity = '0'
            requestAnimationFrame(() => {
              next.container.style.transition = 'opacity 0.3s'
              next.container.style.opacity = '1'
              setTimeout(resolve, 300)
            })
          })
        },
        
        // After transition complete
        after({ next }) {
          console.log('Completed:', next.namespace)
          window.scrollTo(0, 0)
        }
      }
    ]
  })
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBarba)
} else {
  initBarba()
}
```

## MUST: Verify Setup

```javascript
// Check Barba is loaded
console.log('Barba version:', barba.version)

// Check current namespace
console.log('Current page:', barba.data.current.namespace)

// Verify data attributes
console.log('Wrapper:', document.querySelector('[data-barba="wrapper"]'))
console.log('Container:', document.querySelector('[data-barba="container"]'))
```

## FORBIDDEN: Common Mistakes

```yaml
FORBIDDEN:
  Multiple containers:
    WRONG: <main data-barba="container"> + <section data-barba="container">
    RIGHT: One container per page
    
  Missing namespace:
    WRONG: <main data-barba="container">
    RIGHT: <main data-barba="container" data-barba-namespace="page-name">
    
  Scripts inside container:
    WRONG: <script> inside data-barba="container"
    RIGHT: Scripts outside or lazy-loaded
    
  Body as container:
    WRONG: <body data-barba="container">
    RIGHT: <body data-barba="wrapper"> + inner container
```

---

**Setup complete. Proceed to [core-concepts.md](./core-concepts.md)**
