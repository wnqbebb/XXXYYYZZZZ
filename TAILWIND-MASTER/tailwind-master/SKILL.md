---
name: tailwind-master
description: |
  Tailwind CSS v4 Mastery - Complete design system architecture with CSS-first configuration, 
  component patterns using CVA, responsive design with container queries, animations, 
  dark mode, and production optimization. MANDATORY for all Tailwind projects.
metadata:
  tags: 
    - tailwind
    - css
    - styling
    - design-system
    - responsive
    - animations
    - cva
    - tailwind-v4
    - oxide-engine
  author: Santiago Workflow Systems
  version: 4.0.0
  priority: critical
  last_updated: 2025-02-19
---

# Tailwind CSS Master System v4

**CSS-First Configuration. Oxide Engine. Design-System Ready. Production-Proven.**

> 🚀 **Tailwind CSS v4** represents a generational leap with the Rust-powered Oxide engine, 
> CSS-first configuration via `@theme`, and 2-5x faster build times.

---

## Quick Start

### New Project (Vite)
```bash
npm install -D @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

### New Project (PostCSS)
```bash
npm install -D @tailwindcss/postcss
```

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### CSS Entry Point (v4)
```css
/* globals.css */
@import "tailwindcss";

@theme {
  --color-primary: #3B82F6;
  --color-secondary: #10B981;
  --font-family-sans: "Inter", system-ui, sans-serif;
}
```

---

## Architecture Overview

```
tailwind-master/
├── SKILL.md                    # This file - Master Manifest
├── rules/
│   ├── 01-configuration.md     # CSS-first config, @theme, @source
│   ├── 02-component-patterns.md # CVA, variants, compound patterns
│   ├── 03-responsive-design.md # Container queries, breakpoints
│   ├── 04-animations.md        # Keyframes, transitions, micro-interactions
│   ├── 05-performance.md       # Optimization, tree-shaking
│   ├── 06-dark-mode.md         # @variant dark strategies
│   ├── 07-best-practices.md    # Code organization, anti-patterns
│   └── assets/
│       ├── components/         # Ready-to-use TSX components
│       ├── hooks/              # Custom React hooks
│       ├── utils/              # cn(), twMerge helpers
│       └── styles/             # CSS templates
└── references/
    ├── official-docs.md        # Links to official documentation
    └── migration-guides.md     # v3 to v4 migration
```

---

## Rule Index

| Rule | Topic | Priority |
|------|-------|----------|
| [01-configuration](rules/01-configuration.md) | CSS-first config, @theme, @source | CRITICAL |
| [02-component-patterns](rules/02-component-patterns.md) | CVA, variants, type-safe components | CRITICAL |
| [03-responsive-design](rules/03-responsive-design.md) | Container queries, breakpoints | HIGH |
| [04-animations](rules/04-animations.md) | Keyframes, transitions, micro-interactions | HIGH |
| [05-performance](rules/05-performance.md) | Optimization, build performance | MEDIUM |
| [06-dark-mode](rules/06-dark-mode.md) | Dark mode strategies | MEDIUM |
| [07-best-practices](rules/07-best-practices.md) | Code organization | MEDIUM |

---

## Key Differences: v3 vs v4

| Aspect | v3 | v4 |
|--------|-----|-----|
| **Config File** | `tailwind.config.js` | `@theme` in CSS |
| **Entry Point** | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| **Engine** | JavaScript | Rust (Oxide) |
| **Build Speed** | Baseline | 2-5x faster |
| **Content** | Manual `content: [...]` | Automatic detection |
| **Theme Values** | JS objects | CSS custom properties |
| **Dark Mode** | `darkMode: 'class'` | `@variant dark (&:where(.dark, .dark *))` |

---

## Design Tokens (Default)

### Colors
```css
@theme {
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
}
```

### Spacing Scale
```css
@theme {
  --spacing-0: 0px;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  --spacing-24: 6rem;     /* 96px */
}
```

### Breakpoints
```css
@theme {
  --breakpoint-sm: 40rem;   /* 640px */
  --breakpoint-md: 48rem;   /* 768px */
  --breakpoint-lg: 64rem;   /* 1024px */
  --breakpoint-xl: 80rem;   /* 1280px */
  --breakpoint-2xl: 96rem;  /* 1536px */
}
```

---

## Component Architecture

### The CVA Pattern
```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

---

## Pre-flight Checklist

### For New Projects
- [ ] Install `@tailwindcss/vite` or `@tailwindcss/postcss`
- [ ] Create `globals.css` with `@import "tailwindcss"`
- [ ] Define custom theme in `@theme` block
- [ ] Set up `cn()` utility with `clsx` + `tailwind-merge`
- [ ] Install `class-variance-authority` for components
- [ ] Configure VS Code with Tailwind CSS IntelliSense

### For Migration (v3 → v4)
- [ ] Run `npx @tailwindcss/upgrade`
- [ ] Convert `tailwind.config.js` to `@theme` in CSS
- [ ] Update PostCSS config to use `@tailwindcss/postcss`
- [ ] Replace `@tailwind` directives with `@import "tailwindcss"`
- [ ] Update dark mode to use `@variant`
- [ ] Test all custom animations and keyframes
- [ ] Verify container queries work (now native in v4)

### Production Checklist
- [ ] No arbitrary values (use theme config)
- [ ] All animations defined in `@theme`
- [ ] Container queries used for component responsiveness
- [ ] `motion-reduce` variants for accessibility
- [ ] Dark mode fully tested
- [ ] Build performance verified (<150ms for large projects)

---

## VS Code Configuration

### Recommended Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "csstools.postcss"
  ]
}
```

### Settings for CVA Autocomplete
```json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

---

## Resources

- [Official Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Oxide Engine Announcement](https://tailwindcss.com/blog/tailwindcss-v4)
- [CVA Documentation](https://cva.style/docs)
- [Tailwind UI](https://tailwindui.com)

---

*Last updated: 2025-02-19 | Version 4.0.0*
