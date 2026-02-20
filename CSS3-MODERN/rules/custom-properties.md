---
name: css3-custom-properties
description: CSS Custom Properties (variables) for theming. Load when creating design systems.
metadata:
  tags: css, custom-properties, variables, theming
---

# Custom Properties Rules

## MUST: Global Variables

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-secondary: #64748b;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;
  
  /* Typography */
  --font-sans: system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  
  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
}
```

## MUST: Usage Pattern

```css
.button {
  background-color: var(--color-primary);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  transition: background-color var(--transition-fast);
}

.button:hover {
  background-color: var(--color-primary-dark);
}
```

## MUST: Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0f172a;
    --color-text: #f8fafc;
    --color-primary: #60a5fa;
  }
}
```

## MUST: Local Scope

```css
.card {
  --card-padding: 1.5rem;
  --card-bg: white;
  
  padding: var(--card-padding);
  background: var(--card-bg);
}

.card-large {
  --card-padding: 2rem; /* Override locally */
}
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Using variables without fallbacks:
    WRONG: color: var(--color)
    RIGHT: color: var(--color, blue)
    
  Dynamic property names:
    WRONG: var(--color-#{$name})
    RIGHT: Use separate variables or CSS-in-JS
```

---

**Custom Properties mastered. Theming system ready.**
