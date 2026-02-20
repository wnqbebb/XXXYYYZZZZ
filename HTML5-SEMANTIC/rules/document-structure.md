---
name: html5-document-structure
description: HTML5 document structure and outline. Load when building page layouts.
metadata:
  tags: html5, structure, document, outline
---

# Document Structure Rules

## MUST: Basic Document Template

```html
<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Descripción de la página">
  <title>Título de la Página - Sitio</title>
</head>
<body>
  <!-- Page content -->
</body>
</html>
```

### Required Meta Tags

```yaml
charset:
  MUST: <meta charset="UTF-8">
  FIRST: Must be first in head
  WHY: Prevents encoding issues

viewport:
  MUST: <meta name="viewport" content="width=device-width, initial-scale=1.0">
  WHY: Responsive design
  FORBIDDEN: user-scalable=no

description:
  MUST: <meta name="description" content="...">
  LENGTH: 50-160 characters
  WHY: SEO & social sharing

title:
  MUST: <title>Page - Site</title>
  LENGTH: 30-60 characters
  UNIQUE: Every page
```

## MUST: Language Declaration

```html
<!-- Primary language -->
<html lang="es">

<!-- Language changes within page -->
<p>Este es un texto en español.</p>
<p lang="en">This is English text.</p>
<p lang="fr">Ceci est français.</p>
```

## MUST: Document Outline

```html
<body>
  <!-- Skip link for accessibility -->
  <a href="#main-content" class="skip-link">
    Saltar al contenido principal
  </a>
  
  <header>
    <nav aria-label="Principal">...</nav>
  </header>
  
  <main id="main-content">
    <article>
      <h1>Título Principal (Solo uno por página)</h1>
      
      <section>
        <h2>Sección 1</h2>
        <p>Contenido...</p>
      </section>
      
      <section>
        <h2>Sección 2</h2>
        <h3>Subsección 2.1</h3>
        <h3>Subsección 2.2</h3>
      </section>
    </article>
  </main>
  
  <aside>
    <h2>Contenido Relacionado</h2>
  </aside>
  
  <footer>
    <p>&copy; 2026</p>
  </footer>
</body>
```

## MUST: Heading Hierarchy

```yaml
Rules:
  h1: Exactly ONE per page (main title)
  h2: Major sections
  h3: Subsections
  h4-h6: Further nesting
  
Hierarchy:
  - Never skip levels (h1 → h3)
  - Never go back up (h3 → h2 within same section)
  
Example:
  h1: Page Title
    h2: Section 1
      h3: Subsection 1.1
      h3: Subsection 1.2
    h2: Section 2
      h3: Subsection 2.1
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Multiple h1:
    WRONG: <h1>Title</h1> <h1>Another</h1>
    RIGHT: Single h1, use h2 for sections
    
  Skipping levels:
    WRONG: <h1>Title</h1> <h3>Section</h3>
    RIGHT: <h1>Title</h1> <h2>Section</h2>
    
  Using for style:
    WRONG: <h4>Looks small</h4> (just for size)
    RIGHT: Use CSS: <p class="small-heading">
```

---

**Document structure mastered. Semantic foundation complete.**
