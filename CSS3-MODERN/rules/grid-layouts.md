---
name: css3-grid-layouts
description: CSS Grid layout patterns and techniques. Load when building 2D layouts.
metadata:
  tags: css, grid, layout, grid-template
---

# Grid Layouts Rules

## MUST: Basic Grid

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

## MUST: Responsive Grid

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

## MUST: Named Areas

```css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

## MUST: Grid Template Shortcuts

```css
/* repeat() */
grid-template-columns: repeat(3, 1fr);
grid-template-columns: repeat(auto-fit, 200px);

/* minmax() */
grid-template-columns: minmax(200px, 1fr) 2fr;

/* auto-fill vs auto-fit */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Fixed column counts without responsiveness:
    WRONG: grid-template-columns: 1fr 1fr 1fr
    RIGHT: grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))
    
  Using grid for 1D layouts:
    WRONG: Grid for simple row/column
    RIGHT: Use Flexbox for 1D
```

---

**Grid mastered. 2D layouts perfected.**
