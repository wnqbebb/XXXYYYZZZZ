---
name: font-optimization
description: Font loading optimization strategies for zero-layout-shift typography. Fast, beautiful text rendering.
metadata:
  tags: fonts, next-font, web-fonts, font-display, cls, typography
---

# Font Optimization Rules

## MUST: Use next/font

```typescript
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';

// Sans-serif body font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

// Serif display font
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  preload: false,  // Only preload critical fonts
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

```css
/* globals.css */
:root {
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-serif: var(--font-playfair), Georgia, serif;
}

body {
  font-family: var(--font-sans);
}

h1, h2, h3 {
  font-family: var(--font-serif);
}
```

## MUST: Understand font-display Values

```yaml
AUTO:
  behavior: Browser decides (usually block)
  use: Not recommended

BLOCK:
  period: 3s invisible text
  fallback: Swap after 3s
  use: When font is critical to brand
  caution: Causes invisible text

SWAP:
  period: 0s (immediate fallback)
  fallback: Swap when font loads
  use: Recommended default
  benefit: No invisible text
  
OPTIONAL:
  period: 100ms block, then swap
  fallback: Use fallback if font not cached
  use: When font nice-to-have
  benefit: Fast initial paint

FALLBACK:
  period: 100ms block, 3s swap
  fallback: Use fallback after timeout
  use: Balance between block and swap
```

## MUST: Preload Critical Fonts

```html
<!-- In <head> for critical fonts -->
<link 
  rel="preload" 
  href="/fonts/critical-font.woff2" 
  as="font" 
  type="font/woff2" 
  crossOrigin="anonymous"
/>

<!-- Preconnect to font CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
```

```typescript
// next/font handles preloading automatically
const font = Inter({
  subsets: ['latin'],
  preload: true,  // Default for first font
});
```

## MUST: Use Font Fallbacks with Size Adjust

```css
/* Minimize CLS with size-adjust */
@font-face {
  font-family: 'Custom Font';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  
  /* Match fallback font metrics */
  size-adjust: 100%;
  ascent-override: 95%;
  descent-override: 25%;
  line-gap-override: 0%;
}

/* Fallback font with matching metrics */
@font-face {
  font-family: 'Custom Font Fallback';
  src: local('Arial');
  ascent-override: 95%;
  descent-override: 25%;
  line-gap-override: 0%;
}

/* Usage */
.custom-text {
  font-family: 'Custom Font', 'Custom Font Fallback', sans-serif;
}
```

## MUST: Subset Fonts

```typescript
// next/font automatic subsetting
const font = Inter({
  subsets: ['latin'],        // Only Latin characters
  // subsets: ['latin', 'cyrillic'],  // Multiple subsets
});

// Manual font subsetting with glyphhanger
// package.json scripts
{
  "scripts": {
    "subset-fonts": "glyphhanger --subset='*.woff2' --formats=woff2"
  }
}

// Or use pyftsubset (fonttools)
// pyftsubset font.ttf --text="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" --output-file=font-subset.woff2
```

## WHY: Font Loading Impact

```yaml
PERFORMANCE_FACTORS:
  file_size:
    full_font: 200-500KB
    subset_latin: 20-50KB
    savings: 80-90% with subsetting
    
  render_blocking:
    impact: Delays first paint
    solution: font-display: swap
    
  layout_shift:
    cause: Different font metrics
    solution: size-adjust, fallback matching
    
  requests:
    google_fonts: 1 request per font
    self_hosted: Controlled caching
```

## FORBIDDEN: Font Anti-patterns

```yaml
PROHIBITED:
  Loading all font weights:
    WRONG: 100, 200, 300, 400, 500, 600, 700, 800, 900
    RIGHT: Only weights you use (usually 400, 500, 700)
    
  Multiple font families:
    WRONG: 5+ different fonts
    RIGHT: Maximum 2-3 font families
    
  No font-display:
    WRONG: Missing font-display property
    RIGHT: Always specify font-display: swap
    
  Render-blocking font loading:
    WRONG: Synchronous font loading in <head>
    RIGHT: Use next/font or preload with caution
    
  Unoptimized web fonts:
    WRONG: Using TTF/OTF instead of WOFF2
    RIGHT: WOFF2 for all modern browsers

OPTIMIZATION_CHECKLIST:
  - [ ] Using next/font for Google fonts
  - [ ] Self-hosting custom fonts
  - [ ] font-display: swap on all fonts
  - [ ] Subsetting to used characters only
  - [ ] Preloading only critical fonts (max 2)
  - [ ] Matching fallback font metrics
  - [ ] Limiting font families (2-3 max)
  - [ ] Limiting font weights (3-4 max)
```

## MUST: Variable Fonts (When Available)

```css
/* Single file for all weights */
@font-face {
  font-family: 'Inter Variable';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;  /* Range of weights */
  font-display: swap;
}

/* Usage */
.variable-font {
  font-family: 'Inter Variable', sans-serif;
  font-weight: 450;  /* Any value between 100-900 */
}
```

```typescript
// next/font with variable fonts
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Automatically uses variable font if available
});
```

## MUST: Self-Host Google Fonts

```typescript
// next/font automatically self-hosts
// No external requests to fonts.googleapis.com

const font = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// Benefits:
// - No external DNS lookup
// - Better caching control
// - No render-blocking from third-party
// - GDPR compliant (no Google tracking)
```

---

**Fonts should be invisible to performance. Optimize them completely.**
