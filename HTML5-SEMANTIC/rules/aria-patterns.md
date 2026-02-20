---
name: html5-aria-patterns
description: ARIA patterns for complex components. Load when semantic HTML is insufficient.
metadata:
  tags: html5, aria, accessibility, a11y, roles
---

# ARIA Patterns Rules

## MUST: When to Use ARIA

```yaml
USE ARIA WHEN:
  - Creating custom components (tabs, modals, accordion)
  - Semantic HTML doesn't provide enough information
  - Dynamic content updates
  - Complex interactions

DON'T USE ARIA WHEN:
  - Native HTML element exists (use <button>, not <div role="button">)
  - Semantic HTML is sufficient
  - You don't understand the pattern
```

## MUST: Common Patterns

### Modal/Dialog

```html
<button aria-haspopup="dialog" aria-controls="modal">
  Abrir Modal
</button>

<div 
  id="modal"
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
>
  <h2 id="modal-title">Título del Modal</h2>
  <p id="modal-desc">Descripción del contenido</p>
  <button>Cerrar</button>
</div>
```

### Accordion

```html
<div class="accordion">
  <h3>
    <button 
      aria-expanded="false"
      aria-controls="section1"
      id="accordion-header-1"
    >
      Título de Sección
    </button>
  </h3>
  <div 
    id="section1"
    role="region"
    aria-labelledby="accordion-header-1"
    hidden
  >
    Contenido de la sección
  </div>
</div>
```

### Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Sample Tabs">
    <button 
      role="tab"
      aria-selected="true"
      aria-controls="tab-1"
      id="tab-1-label"
    >
      Tab 1
    </button>
    <button 
      role="tab"
      aria-selected="false"
      aria-controls="tab-2"
      id="tab-2-label"
      tabindex="-1"
    >
      Tab 2
    </button>
  </div>
  
  <div 
    role="tabpanel"
    id="tab-1"
    aria-labelledby="tab-1-label"
  >
    Contenido Tab 1
  </div>
</div>
```

## MUST: Live Regions

```html
<!-- Polite: Announces when idle -->
<div aria-live="polite" aria-atomic="true">
  <p>5 items added to cart</p>
</div>

<!-- Assertive: Interrupts immediately -->
<div aria-live="assertive" role="alert">
  <p>Form submission failed</p>
</div>
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Redundant roles:
    WRONG: <nav role="navigation">
    RIGHT: <nav>
    
  aria-hidden on focusable:
    WRONG: <button aria-hidden="true">
    RIGHT: Remove from DOM or disable
    
  Fake links:
    WRONG: <span role="link" tabindex="0">
    RIGHT: <a href="...">
```

---

**ARIA mastered. Complex components accessible.**
