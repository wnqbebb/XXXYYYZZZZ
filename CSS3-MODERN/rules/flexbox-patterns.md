---
name: css3-flexbox-patterns
description: Flexbox layout patterns and techniques. Load when building 1D layouts.
metadata:
  tags: css, flexbox, layout, flex
---

# Flexbox Patterns Rules

## MUST: Center Everything

```css
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
```

## MUST: Card Layout

```css
.card-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  flex: 1 1 300px; /* grow shrink basis */
}
```

## MUST: Space Between

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## MUST: Column Direction

```css
.flex-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

## MUST: Order Property

```css
/* Visual order different from DOM */
.flex-order {
  display: flex;
}

.flex-order .item-1 { order: 2; }
.flex-order .item-2 { order: 1; }
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Using flex for 2D grid layouts:
    WRONG: Nested flex containers for grid
    RIGHT: Use CSS Grid
    
  Fixed widths with flex:
    WRONG: width: 300px on flex items
    RIGHT: flex-basis: 300px or min-width
```

---

**Flexbox mastered. 1D layouts perfected.**
