---
name: html5-semantic
description: Semantic HTML5 for accessibility, SEO, and document structure. Use when (1) Building page structure, (2) Creating accessible components, (3) Optimizing for SEO, (4) Defining document outline, (5) Implementing ARIA patterns. MANDATORY for all markup.
metadata:
  tags: html5, semantic, accessibility, a11y, seo, markup, structure
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
  category: foundation
---

# HTML5 Semantic Master System

**Structure is meaning. Meaning is accessibility. Accessibility is inclusion.**

Semantic HTML5 provides the foundation for accessible, SEO-friendly, and maintainable web applications. Proper semantic structure enables screen readers, improves search rankings, and creates logical document outlines.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - Creating ANY HTML structure
  - Building component markup
  - Implementing navigation
  - Creating forms
  - Building layouts
  - Adding ARIA attributes
  - Optimizing for SEO
  - Ensuring accessibility

DO NOT USE WHEN:
  - Using only divs/span (forbidden anyway)
  - Ignoring semantic meaning
```

---

## The Semantic Stack

### Core Technologies

```yaml
HTML5 Elements:
  - Structural: header, nav, main, article, section, aside, footer
  - Text: h1-h6, p, ul/ol/li, dl/dt/dd, blockquote, cite
  - Media: img, figure/figcaption, audio, video, picture
  - Forms: form, fieldset, legend, label, input, select, textarea
  - Interactive: button, a, details/summary, dialog
  
ARIA:
  - Roles: landmark, widget, abstract roles
  - Properties: aria-label, aria-describedby, aria-expanded
  - States: aria-checked, aria-selected, aria-hidden
  
Meta:
  - SEO: title, meta description, Open Graph
  - Accessibility: lang, dir, viewport
```

---

## Rule Files Index

### Document Structure

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/document-structure.md](./rules/document-structure.md) | Page outline | Building layouts |
| [rules/landmark-elements.md](./rules/landmark-elements.md) | Landmark regions | Accessibility |

### Content

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/text-content.md](./rules/text-content.md) | Text semantics | Typography |
| [rules/media-elements.md](./rules/media-elements.md) | Images, video | Media content |
| [rules/forms.md](./rules/forms.md) | Form structure | Input fields |

### Accessibility

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/aria-patterns.md](./rules/aria-patterns.md) | ARIA usage | Complex components |
| [rules/accessibility-checklist.md](./rules/accessibility-checklist.md) | a11y validation | Testing |

### SEO

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/seo-meta.md](./rules/seo-meta.md) | Meta tags | Search optimization |

### Asset Library

```
rules/assets/
├── templates/
│   ├── page-template.html      # Complete page structure
│   ├── form-template.html      # Accessible form
│   └── navigation-template.html # Semantic nav
├── components/
│   ├── SkipLink.tsx            # Skip navigation
│   ├── VisuallyHidden.tsx      # Screen reader text
│   └── FocusManager.tsx        # Focus management
└── checklists/
    └── a11y-checklist.md       # Validation checklist
```

---

## Quick Start Patterns

### Page Structure

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Page description">
  <title>Page Title</title>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  
  <header>
    <nav aria-label="Main">
      <!-- Navigation -->
    </nav>
  </header>
  
  <main id="main">
    <article>
      <h1>Main Title</h1>
      <section>
        <h2>Section Title</h2>
      </section>
    </article>
  </main>
  
  <aside>
    <!-- Related content -->
  </aside>
  
  <footer>
    <!-- Footer content -->
  </footer>
</body>
</html>
```

### Accessible Form

```html
<form>
  <fieldset>
    <legend>Contact Information</legend>
    
    <label for="email">Email Address</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      required
      aria-required="true"
      aria-describedby="email-error"
    >
    <span id="email-error" role="alert"></span>
  </fieldset>
</form>
```

---

## Golden Rules

```yaml
MUST:
  - Use semantic elements (not just divs)
  - Maintain heading hierarchy (h1 → h6)
  - Include alt text for images
  - Associate labels with inputs
  - Provide skip links
  - Use landmarks (header, nav, main, footer)
  - Set lang attribute on html
  - Include viewport meta tag

FORBIDDEN:
  - Div soup (divs without meaning)
  - Skipping heading levels
  - Images without alt
  - Inputs without labels
  - Clickable divs (use button)
  - Duplicate h1 tags
```

---

## Integration

```
DEPENDS ON:
  - None (foundation skill)

WORKS WITH:
  - css3-modern (Styling)
  - js-advanced (Enhancement)
  - tailwind-master (Utility classes)
  - seo-technical (Meta optimization)

ENABLES:
  - All other skills
  - Accessibility
  - SEO
  - Screen readers
```

---

**Semantic HTML5. The foundation of the accessible web.**
