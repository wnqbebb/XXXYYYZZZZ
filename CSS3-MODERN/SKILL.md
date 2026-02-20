---
name: css3-modern
description: Modern CSS3 mastery including Grid, Flexbox, Custom Properties, and advanced layouts. Use when (1) Building responsive layouts, (2) Creating modern CSS architectures, (3) Implementing CSS animations, (4) Using CSS Custom Properties for theming. MANDATORY for all styling.
metadata:
  tags: css3, flexbox, grid, custom-properties, responsive, layout, container-queries
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
  category: foundation
---

# CSS3 Modern Master System

**Layout is architecture. CSS is the blueprint.**

Modern CSS3 provides powerful tools for creating responsive, maintainable, and performant layouts. This skill covers Grid, Flexbox, Custom Properties, Container Queries, and modern selectors.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - Building any layout or component structure
  - Creating responsive designs
  - Implementing CSS architecture
  - Setting up design systems
  - Creating animations and transitions
  - Building theme systems
  - ANY project using CSS

DO NOT USE WHEN:
  - Using only Tailwind utilities (use tailwind-master instead)
  - Inline styles only (forbidden anyway)
```

---

## The CSS3 Stack

### Core Technologies

```yaml
Layout Systems:
  - CSS Grid: Two-dimensional layouts
  - Flexbox: One-dimensional layouts
  - Container Queries: Component-based responsive
  
Styling:
  - Custom Properties (CSS Variables): Theming
  - calc(): Dynamic calculations
  - clamp(): Responsive values
  - min()/max(): Constraint-based sizing
  
Selectors:
  - :is()/:where(): Logical grouping
  - :has(): Parent selection
  - :not(): Negation
  - Attribute selectors
  
Effects:
  - Transitions: State changes
  - Animations: Keyframe sequences
  - Transforms: 2D/3D transformations
  - Filters: Visual effects
```

---

## Rule Files Index

### Layout Systems

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/grid-layouts.md](./rules/grid-layouts.md) | CSS Grid patterns | Complex 2D layouts |
| [rules/flexbox-patterns.md](./rules/flexbox-patterns.md) | Flexbox patterns | Component layouts |
| [rules/container-queries.md](./rules/container-queries.md) | Container queries | Component-responsive |

### Styling & Theming

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/custom-properties.md](./rules/custom-properties.md) | CSS variables | Theming systems |
| [rules/modern-functions.md](./rules/modern-functions.md) | calc, clamp, etc | Dynamic values |

### Effects

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/animations-transitions.md](./rules/animations-transitions.md) | Motion | CSS animations |
| [rules/transforms-3d.md](./rules/transforms-3d.md) | 2D/3D transforms | Transform effects |

### Responsive

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/responsive-design.md](./rules/responsive-design.md) | Media queries | Responsive layouts |

### Asset Library

```
rules/assets/
├── variables/
│   ├── theme.css              # Custom properties theme
│   └── breakpoints.css        # Responsive breakpoints
├── layouts/
│   ├── grid-system.css        # Grid utility classes
│   ├── flex-utilities.css     # Flexbox helpers
│   └── container-queries.css  # Container query patterns
└── animations/
    ├── fade-transitions.css   # Fade presets
    └── slide-transitions.css  # Slide presets
```

---

## Quick Start Patterns

### Grid Layout

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.grid-item {
  grid-column: span 4; /* 4 of 12 columns */
}
```

### Flexbox Centering

```css
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### Custom Properties Theme

```css
:root {
  --color-primary: #3b82f6;
  --color-secondary: #64748b;
  --space-md: 1rem;
  --radius: 0.5rem;
}

.button {
  background: var(--color-primary);
  padding: var(--space-md);
  border-radius: var(--radius);
}
```

### Container Query

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
```

---

## Integration with Other Skills

```
DEPENDS ON:
  - html5-semantic (Structure)

WORKS WITH:
  - tailwind-master (Utility classes)
  - gsap-animator (CSS + JS animations)
  - nextjs-architect (App Router styling)

ENABLES:
  - All visual skills
  - Design systems
  - Theme architectures
```

---

## Golden Rules

```yaml
MUST:
  - Use CSS Grid for 2D layouts
  - Use Flexbox for 1D layouts
  - Use Custom Properties for theming
  - Use Container Queries for components
  - Mobile-first responsive approach

FORBIDDEN:
  - Float-based layouts (obsolete)
  - Fixed widths without media queries
  - !important (except utilities)
  - Inline styles (except dynamic JS)
```

---

**Modern CSS3 mastered. Layouts that scale.**
