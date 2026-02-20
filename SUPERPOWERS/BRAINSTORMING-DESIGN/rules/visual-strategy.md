---
name: visual-strategy
description: Design systems, visual identity, and aesthetic direction. Load during Phase 4 of brainstorming-design to define the visual language and brand expression.
metadata:
  tags: visual-design, design-systems, branding, typography, color-theory, ui-patterns
---

# Visual Strategy & Design Systems

**Creating cohesive visual languages that communicate, guide, and delight.**

---

## Brand Attributes to Visual Translation

### The Attribute Matrix

```
Brand Attribute → Visual Expression

PROFESSIONAL
├── Typography: Sans-serif, moderate weight, ample spacing
├── Color: Muted palette, high contrast for readability
├── Imagery: Authentic photography, real people
├── Layout: Grid-based, generous whitespace
└── Motion: Subtle, purposeful, never flashy

PLAYFUL
├── Typography: Rounded, varied weights, expressive
├── Color: Bright, saturated, unexpected combinations
├── Imagery: Illustrations, animations, characters
├── Layout: Asymmetric, broken grids, overlapping
└── Motion: Bouncy, elastic, surprising

LUXURIOUS
├── Typography: Elegant serifs, thin weights, generous leading
├── Color: Deep, rich hues, metallic accents
├── Imagery: High-end photography, macro details
├── Layout: Expansive whitespace, editorial
└── Motion: Slow, smooth, refined

TECHNICAL
├── Typography: Monospace accents, precise alignment
├── Color: Dark themes, neon accents, data viz palette
├── Imagery: Abstract, geometric, diagrams
├── Layout: Dense information, modular
└── Motion: Precise, geometric, functional
```

### Competitive Visual Analysis

```markdown
# Visual Competitive Analysis

## Direct Competitors

### Competitor A (www.competitor-a.com)
**Strengths:**
- Clean navigation
- Strong photography
- Clear CTAs

**Weaknesses:**
- Generic color palette
- Dense text blocks
- Weak mobile experience

**Opportunities:**
- More distinctive color
- Better content hierarchy
- Interactive elements

### Competitor B (www.competitor-b.com)
...

## Cross-Industry Inspiration

### Industry: Fashion (Farfetch)
**Applicable Patterns:**
- Editorial layout
- Full-bleed imagery
- Minimal UI chrome

### Industry: SaaS (Linear)
**Applicable Patterns:**
- Dark mode default
- Subtle gradients
- Keyboard shortcuts visible

## Visual Differentiation Strategy

| Element | Category Norm | Our Approach |
|---------|--------------|--------------|
| Color | Blues/greys | Warm earth tones |
| Typography | Sans-serif | Serif headers, sans body |
| Imagery | Stock photos | Custom illustrations |
| Interactions | Standard | Physics-based animations |
```

---

## Design System Foundations

### Typography Scale

**Modular Scale** (1.25 ratio):
```
Size:     12px  14px  16px  20px  25px  31px  39px  48px  61px
Usage:    Caps  Small Body H4    H3    H2    H1    Disp. Hero

CSS Custom Properties:
--text-xs: 0.75rem;   /* 12px */
--text-sm: 0.875rem;  /* 14px */
--text-base: 1rem;    /* 16px */
--text-lg: 1.25rem;   /* 20px */
--text-xl: 1.563rem;  /* 25px */
--text-2xl: 1.953rem; /* 31px */
--text-3xl: 2.441rem; /* 39px */
--text-4xl: 3.052rem; /* 48px */
--text-5xl: 3.815rem; /* 61px */
```

**Type Pairing Strategies**:
```
CLASSIC CONTRAST:
├── Headers: Playfair Display (Serif, elegant)
└── Body: Inter (Sans-serif, readable)

MODERN HARMONY:
├── Headers: Satoshi (Geometric sans, bold)
└── Body: Satoshi (Same family, lighter weight)

TECHNICAL EDITORIAL:
├── Headers: JetBrains Mono (Monospace, structured)
└── Body: system-ui (Clean, familiar)
```

### Color System

**Primary Palette**:
```
CSS Custom Properties:
--primary-50: #eff6ff;   /* Lightest - backgrounds */
--primary-100: #dbeafe;
--primary-200: #bfdbfe;
--primary-300: #93c5fd;
--primary-400: #60a5fa;
--primary-500: #3b82f6;  /* Base */
--primary-600: #2563eb;  /* Interactive */
--primary-700: #1d4ed8;  /* Hover */
--primary-800: #1e40af;
--primary-900: #1e3a8a;  /* Darkest - text */

Semantic Usage:
--color-text: var(--primary-900);
--color-link: var(--primary-600);
--color-link-hover: var(--primary-700);
--color-background: var(--primary-50);
--color-accent: var(--primary-500);
```

**Semantic Colors**:
```
SUCCESS (Green family)
├── --success-50: #f0fdf4
├── --success-500: #22c55e (Base)
└── --success-700: #15803d

WARNING (Amber family)
├── --warning-50: #fffbeb
├── --warning-500: #f59e0b (Base)
└── --warning-700: #b45309

ERROR (Red family)
├── --error-50: #fef2f2
├── --error-500: #ef4444 (Base)
└── --error-700: #b91c1c

INFO (Blue family)
├── --info-50: #eff6ff
├── --info-500: #3b82f6 (Base)
└── --info-700: #1d4ed8
```

**Dark Mode Strategy**:
```
Light → Dark Mapping:
--bg-primary: white → --bg-primary: #0f0f0f
--text-primary: #111 → --text-primary: #f5f5f5
--border: #e5e5e5 → --border: #333
--surface: white → --surface: #1a1a1a

Color Adjustments:
├── Reduce saturation 20% (vibrant colors hurt in dark)
├── Increase contrast (washed out looks worse on dark)
└── Use lighter tints of brand color for accents
```

### Spacing System

**Base-4 or Base-8 Scale**:
```
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
--space-16: 8rem;     /* 128px */

Component Spacing:
├── Button padding: --space-3 --space-5
├── Card padding: --space-5
├── Section padding: --space-16
└── Grid gap: --space-6
```

---

## Component Library

### Core Components Spec

**Button System**:
```
Variants:
├── Primary: Filled, brand color
├── Secondary: Outlined, brand color
├── Tertiary: Text only, brand color
├── Destructive: Red, for dangerous actions
└── Ghost: Transparent, subtle

Sizes:
├── sm: height 32px, text-sm
├── md: height 40px, text-base (default)
├── lg: height 48px, text-lg
└── xl: height 56px, text-xl

States:
├── Default
├── Hover (+10% brightness)
├── Active (-5% brightness)
├── Focus (ring outline)
├── Disabled (50% opacity, no-pointer-events)
└── Loading (spinner replaces text)
```

**Card Patterns**:
```
Structure:
┌─────────────────────────────┐
│ [Image/Icon]                │  ← Media area
├─────────────────────────────┤
│ Title                       │  ← Header
│ Description text...         │  ← Content
├─────────────────────────────┤
│ [Action]          [Action]  │  ← Footer
└─────────────────────────────┘

Variants:
├── Elevated: Shadow, white background
├── Outlined: Border, transparent background
├── Filled: Solid background color
└── Interactive: Hover state, cursor pointer
```

### Layout Patterns

**The 12-Column Grid**:
```
Desktop (≥1024px): 12 columns
Tablet (768-1023px): 8 columns
Mobile (<768px): 4 columns

Gutter: 24px (desktop), 16px (mobile)
Margin: 48px (desktop), 16px (mobile)

Content Widths:
├── Full: 100%
├── Wide: max-width 1440px
├── Default: max-width 1200px
├── Narrow: max-width 800px
└── Text: max-width 65ch (optimal reading)
```

**Responsive Breakpoints**:
```
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */

Mobile-First Approach:
/* Base styles for mobile */
.component { ... }

/* Tablet and up */
@media (min-width: 768px) {
  .component { ... }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component { ... }
}
```

---

## Imagery & Assets

### Photography Guidelines

**Style Direction**:
```
Lifestyle:
├── Authentic, not staged
├── Natural lighting
├── Diverse representation
└─→ Contextual (showing product in use)

Product:
├── Consistent background
├── Multiple angles
├── Detail shots
└── Scale reference

Team/Portrait:
├── Consistent lighting
├── Similar framing
├── Approachable expressions
└── Environmental context
```

**Image Specifications**:
```
Format: WebP (with JPG fallback)
Quality: 85% (balance of size/quality)

Sizes:
├── Thumbnail: 200px wide
├── Card: 600px wide
├── Hero: 1920px wide
└── Full-bleed: 2560px wide

Aspect Ratios:
├── 16:9 - Cinematic, videos
├── 4:3 - Standard photography
├── 1:1 - Social media, products
├── 3:2 - Classic photography
└── 21:9 - Ultra-wide hero
```

### Iconography

**System Selection**:
```
Phosphor Icons (Recommended):
├── Consistent stroke width
├── Multiple weights (thin to bold)
├── 7000+ icons
└── React/Vue/Angular support

Lucide (Alternative):
├── Feather icons fork
├── Active development
└── Tree-shakeable

Custom Icons:
├── When brand needs unique expression
├── Maintain same grid (24x24 base)
└── Same stroke width as system
```

---

## Motion & Animation

### Animation Principles

**Purposeful Motion**:
```
DO:
✓ Guide attention to changes
✓ Provide feedback on interactions
✓ Show relationships between elements
✓ Create sense of space and depth
✓ Delight within constraints

DON'T:
✗ Animate for decoration only
✗ Slow down task completion
✗ Cause motion sickness
✗ Distract from content
✗ Block user input
```

**Timing Standards**:
```
Durations:
├── Instant: 0ms (color changes)
├── Fast: 100-150ms (micro-interactions)
├── Normal: 200-300ms (UI transitions)
├── Slow: 400-500ms (page transitions)
└── Ambient: 8-20s (continuous loops)

Easing:
├── ease-out: Entering elements (decelerate)
├── ease-in: Exiting elements (accelerate)
├── ease-in-out: Moving between states
└── spring: Playful interactions

Performance:
├── Animate only transform and opacity
├── Use will-change sparingly
├── Prefer CSS over JS animation
└── Respect prefers-reduced-motion
```

---

## Accessibility in Design

### WCAG 2.1 AA Compliance

**Color Contrast**:
```
Normal text: 4.5:1 minimum
Large text: 3:1 minimum
UI components: 3:1 minimum

Tools:
├── WebAIM Contrast Checker
├── Stark (Figma plugin)
└── axe DevTools
```

**Touch Targets**:
```
Minimum size: 44×44px (Apple)
Recommended: 48×48px (Material)
Spacing between: 8px minimum
```

**Focus Indicators**:
```
Visible focus ring on all interactive elements
Outline: 2px solid brand-color
Outline-offset: 2px
```

---

## Design Handoff

### Spec Documentation

```markdown
# Component: Button

## Anatomy
[Diagram with numbered parts]

## Variants
- Primary, Secondary, Tertiary, Destructive

## States
[Visual of each state]

## Spacing
- Padding: 12px 24px
- Border-radius: 6px
- Gap between buttons: 12px

## Typography
- Font: Inter
- Weight: 500
- Size: 16px
- Line-height: 1.5

## Colors
- Background: #3b82f6
- Text: #ffffff
- Hover: #2563eb
- Active: #1d4ed8

## Interaction
- Hover: Background darken 10%
- Active: Background darken 15%
- Focus: Ring outline 2px
- Disabled: Opacity 0.5

## Usage
DO:
- One primary action per view
- Use for important CTAs

DON'T:
- Multiple primary buttons together
- Use for navigation
```

---

## Validation Checklist

- [ ] Brand attributes translated to visual elements
- [ ] Typography scale defined and documented
- [ ] Complete color system with semantic tokens
- [ ] Spacing system consistent throughout
- [ ] Core components spec'd with all variants
- [ ] Responsive breakpoints defined
- [ ] Image guidelines established
- [ ] Animation principles documented
- [ ] Accessibility requirements met (WCAG 2.1 AA)
- [ ] Design tokens exportable for development
