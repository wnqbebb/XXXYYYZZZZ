---
name: html5-landmark-elements
description: Landmark elements for accessibility. Load when creating page regions.
metadata:
  tags: html5, landmarks, accessibility, a11y
---

# Landmark Elements Rules

## MUST: Landmark Regions

```html
<body>
  <!-- Banner -->
  <header>
    <nav aria-label="Principal">...</nav>
  </header>
  
  <!-- Navigation (if separate from header) -->
  <nav aria-label="Secondary">...</nav>
  
  <!-- Main content -->
  <main id="main-content">
    <!-- Page-specific content -->
  </main>
  
  <!-- Complementary content -->
  <aside>
    <!-- Related, but separate from main -->
  </aside>
  
  <!-- Contentinfo -->
  <footer>
    <!-- Footer content -->
  </footer>
</body>
```

### Landmark Reference

```yaml
<header>:
  Role: banner (top level only)
  Use: Site header, article header
  Multiple: OK if nested in section/article

<nav>:
  Role: navigation
  Use: Primary/secondary navigation
  ARIA: aria-label for multiple navs

<main>:
  Role: main
  Use: Primary content (ONE per page)
  ARIA: aria-label if not obvious

<aside>:
  Role: complementary
  Use: Sidebar, callouts, related links
  ARIA: aria-label to describe

<footer>:
  Role: contentinfo (top level only)
  Use: Site footer, article footer
  Multiple: OK if nested

<section>:
  Role: region (if labeled)
  Use: Thematic grouping
  ARIA: aria-labelledby recommended

<article>:
  Role: article
  Use: Self-contained content
  Examples: Blog post, comment, card
```

## MUST: Multiple Navigation Labels

```html
<!-- Primary navigation -->
<nav aria-label="Principal">
  <a href="/">Inicio</a>
  <a href="/about">Nosotros</a>
</nav>

<!-- Secondary navigation -->
<nav aria-label="Legal">
  <a href="/privacy">Privacidad</a>
  <a href="/terms">Términos</a>
</nav>

<!-- Breadcrumb navigation -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Inicio</a></li>
    <li><a href="/category">Categoría</a></li>
    <li aria-current="page">Artículo</li>
  </ol>
</nav>
```

## MUST: Section with Heading

```html
<!-- Good: Section with explicit heading -->
<section aria-labelledby="section-heading">
  <h2 id="section-heading">Título de Sección</h2>
  <p>Contenido...</p>
</section>

<!-- Alternative: Implicit heading -->
<section>
  <h2>Título de Sección</h2>
  <p>Contenido...</p>
</section>
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Multiple main elements:
    WRONG: <main>...</main> <main>...</main>
    RIGHT: Only one main per page
    
  Div with role instead of semantic:
    WRONG: <div role="navigation">
    RIGHT: <nav>
    
  Missing aria-label on multiple landmarks:
    WRONG: Two <nav> without labels
    RIGHT: <nav aria-label="Primary"> + <nav aria-label="Secondary">
```

---

**Landmarks mastered. Screen reader navigation enabled.**
