---
name: configuration
description: CSS-first configuration using @theme, @source, and @variant directives. Tailwind CSS v4 architecture.
version: 4.0.0
---

# Configuration - CSS-First Architecture

> Tailwind CSS v4 moves from JavaScript configuration to CSS-first configuration using the `@theme` directive.

---

## MUST

### 1. Use `@import "tailwindcss"` as Single Entry Point

**✅ CORRECT:**
```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* Your theme configuration */
}
```

**❌ FORBIDDEN:**
```css
/* v3 style - NO LONGER VALID in v4 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Define All Theme Values in `@theme` Block

**✅ CORRECT:**
```css
@theme {
  /* Colors */
  --color-primary: #3B82F6;
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* Typography */
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-mono: "JetBrains Mono", monospace;
  
  /* Font sizes with line-height and weight */
  --text-xs: 0.75rem;
  --text-xs--line-height: 1rem;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.25rem;
  --text-base: 1rem;
  --text-base--line-height: 1.5rem;
  --text-lg: 1.125rem;
  --text-lg--line-height: 1.75rem;
  
  /* Spacing */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
  --spacing-128: 32rem;
  
  /* Border radius */
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-dropdown: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  
  /* Animations */
  --animate-fade-in: fadeIn 0.5s ease-out;
  --animate-slide-up: slideUp 0.5s ease-out;
  
  /* Breakpoints */
  --breakpoint-3xl: 120rem;  /* 1920px */
}

/* Define keyframes separately */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
```

### 3. Use Automatic Content Detection

Tailwind v4 automatically detects files containing utility classes. No manual `content` configuration needed.

**✅ CORRECT:**
```css
@import "tailwindcss";
/* No @source needed for standard project structure */
```

### 4. Use `@source` for Explicit Path Control (When Needed)

**✅ CORRECT:**
```css
@import "tailwindcss";

/* Include additional sources */
@source "../shared-components/**/*.tsx";
@source "../node_modules/@mycompany/ui-lib/**/*.tsx";

/* Exclude specific paths */
@source not "../src/components/legacy";
```

---

## FORBIDDEN

### 1. Never Use `tailwind.config.js` for New Projects

**❌ FORBIDDEN:**
```javascript
// tailwind.config.js - DEPRECATED in v4 for new projects
module.exports = {
  theme: {
    extend: {
      colors: { primary: '#3B82F6' }
    }
  }
}
```

**Exception:** Use `@config` directive only for incremental migration:
```css
@import "tailwindcss";
@config "../tailwind.config.js";  /* Migration bridge only */
```

### 2. Never Use Arbitrary Values in Production

**❌ FORBIDDEN:**
```html
<!-- Avoid arbitrary values -->
<div class="w-[387px] h-[243px] mt-[17px]">
```

**✅ CORRECT:**
```css
@theme {
  --spacing-card-width: 387px;
  --spacing-card-height: 243px;
}
```

```html
<div class="w-card-width h-card-height mt-4">
```

### 3. Never Disable Preflight Without Understanding Implications

**❌ FORBIDDEN:**
```css
/* Don't disable preflight unless absolutely necessary */
@layer theme, base, components, utilities;
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/utilities" layer(utilities);
/* Missing @import "tailwindcss/preflight" */
```

---

## WHY

### CSS-First Configuration Benefits

1. **Native CSS Custom Properties**: All theme values become CSS variables accessible anywhere
2. **No JavaScript Build Step**: Configuration is processed as CSS, not JS
3. **IDE Autocompletion**: Works out of the box with CSS custom properties
4. **Framework Agnostic**: Design tokens usable in any context
5. **Better Performance**: Oxide engine processes CSS natively

### Automatic Content Detection

The Oxide engine scans your project automatically:
- Detects JSX/TSX, Vue, Svelte, HTML files
- Finds classes in template literals
- Works across monorepos
- No manual path configuration needed

---

## EXAMPLES

### Complete Theme Configuration

```css
/* globals.css */
@import "tailwindcss";

@theme {
  /* ========================================
     COLOR SYSTEM
     ======================================== */
  --color-brand-50: #f0f9ff;
  --color-brand-100: #e0f2fe;
  --color-brand-200: #bae6fd;
  --color-brand-300: #7dd3fc;
  --color-brand-400: #38bdf8;
  --color-brand-500: #0ea5e9;
  --color-brand-600: #0284c7;
  --color-brand-700: #0369a1;
  --color-brand-800: #075985;
  --color-brand-900: #0c4a6e;
  
  --color-success-50: #f0fdf4;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  
  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  
  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  
  /* ========================================
     TYPOGRAPHY
     ======================================== */
  --font-family-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-family-heading: "Cal Sans", "Inter", sans-serif;
  --font-family-mono: "JetBrains Mono", "Fira Code", monospace;
  
  --text-display: 4.5rem;
  --text-display--font-weight: 700;
  --text-display--letter-spacing: -0.025em;
  --text-display--line-height: 1.1;
  
  --text-h1: 2.25rem;
  --text-h1--font-weight: 700;
  --text-h1--letter-spacing: -0.025em;
  --text-h1--line-height: 1.2;
  
  --text-h2: 1.875rem;
  --text-h2--font-weight: 600;
  --text-h2--letter-spacing: -0.025em;
  --text-h2--line-height: 1.3;
  
  /* ========================================
     SPACING
     ======================================== */
  --spacing-4\.5: 1.125rem;
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;
  --spacing-128: 32rem;
  
  /* ========================================
     BORDER RADIUS
     ======================================== */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;
  --radius-full: 9999px;
  
  /* ========================================
     SHADOWS
     ======================================== */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
  --shadow-card: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-dropdown: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* ========================================
     ANIMATIONS
     ======================================== */
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
  --animate-fade-out: fadeOut 0.3s ease-in forwards;
  --animate-slide-up: slideUp 0.5s ease-out forwards;
  --animate-slide-down: slideDown 0.5s ease-out forwards;
  --animate-scale-in: scaleIn 0.3s ease-out forwards;
  --animate-spin-slow: spin 3s linear infinite;
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  
  /* ========================================
     BREAKPOINTS
     ======================================== */
  --breakpoint-xs: 20rem;    /* 320px */
  --breakpoint-3xl: 120rem;  /* 1920px */
}

/* ========================================
   KEYFRAMES
   ======================================== */
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* ========================================
   CUSTOM COMPONENTS
   ======================================== */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center rounded-lg font-medium transition-colors;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-card border border-gray-200;
  }
  
  .input {
    @apply flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm;
  }
}

/* ========================================
   DARK MODE VARIANT
   ======================================== */
@variant dark (&:where(.dark, .dark *));
```

### Framework-Specific Setups

#### Next.js App Router
```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --font-family-sans: var(--font-inter), system-ui, sans-serif;
}
```

```typescript
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  )
}
```

#### Vite + React
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  /* Your theme */
}
```

---

## ANTI-PATTERNS

### 1. Mixing v3 and v4 Syntax
```css
/* ❌ DON'T */
@import "tailwindcss";
@tailwind base;  /* Conflicting! */

/* ✅ DO */
@import "tailwindcss";
/* Only use @theme, @source, @variant */
```

### 2. Overriding Default Theme Without `initial`
```css
/* ❌ DON'T - This merges with defaults */
@theme {
  --color-*: initial;  /* Reset first if needed */
  --color-custom: #123456;
}
```

### 3. Defining Keyframes Inside @theme
```css
/* ❌ DON'T */
@theme {
  --animate-spin: spin 1s linear infinite;
  @keyframes spin { ... }  /* Invalid! */
}

/* ✅ DO */
@theme {
  --animate-spin: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

---

## Migration from v3

### Using the Upgrade Tool
```bash
npx @tailwindcss/upgrade
```

### Manual Migration Checklist
1. Replace `@tailwind` directives with `@import "tailwindcss"`
2. Move `theme.extend` to `@theme` block
3. Convert camelCase to kebab-case CSS variables
4. Move keyframes outside `@theme`
5. Update PostCSS config
6. Remove `tailwind.config.js` (after verification)

---

## Related Assets

- [Complete Theme Template](../assets/styles/complete-theme.css)
- [PostCSS Config Template](../assets/configs/postcss.config.js)
- [Vite Config Template](../assets/configs/vite.config.ts)
