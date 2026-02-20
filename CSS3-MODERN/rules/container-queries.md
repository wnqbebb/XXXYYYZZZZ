---
name: css3-container-queries
description: Container queries for component-based responsive design. Load when component needs responsive behavior.
metadata:
  tags: css, container-queries, responsive, components
---

# Container Queries Rules

## MUST: Basic Setup

```css
/* Define container */
.card-container {
  container-type: inline-size;
  container-name: card; /* Optional name */
}

/* Query container */
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
  
  .card-image {
    width: 40%;
  }
}
```

## MUST: Named Containers

```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}

.main {
  container-type: inline-size;
  container-name: main;
}

@container sidebar (min-width: 300px) {
  .widget { /* Styles */ }
}

@container main (min-width: 800px) {
  .content { /* Styles */ }
}
```

## MUST: Query Units

```css
@container (min-width: 400px) {
  .card {
    /* cqw = container query width */
    padding: 5cqw;
    
    /* cqh = container query height */
    min-height: 30cqh;
  }
}
```

## MUST: Container Types

```yaml
container-type: size:
  Queries: width AND height
  Use: When both dimensions matter
  
container-type: inline-size:
  Queries: width only
  Use: Most common (horizontal layouts)
  
container-type: block-size:
  Queries: height only
  Use: Vertical layouts
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Using without container-type:
    WRONG: @container on element without container-type parent
    RIGHT: Always define container-type first
    
  Over-nesting containers:
    WRONG: Multiple nested container queries
    RIGHT: Flat structure, clear hierarchy
```

---

**Container Queries mastered. Component-responsive design.**
