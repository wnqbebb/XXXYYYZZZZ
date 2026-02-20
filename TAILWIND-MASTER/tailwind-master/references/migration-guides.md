# Migration Guides

## v3 to v4 Migration

### Quick Migration

```bash
# Use the official upgrade tool
npx @tailwindcss/upgrade
```

### Manual Migration Steps

#### 1. Update Dependencies

```bash
# Remove old packages
npm uninstall tailwindcss autoprefixer

# Install new packages
npm install -D @tailwindcss/postcss
# OR for Vite
npm install -D @tailwindcss/vite
```

#### 2. Update PostCSS Config

```javascript
// postcss.config.js (Before)
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// postcss.config.js (After)
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

#### 3. Update CSS Entry Point

```css
/* globals.css (Before) */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
  }
}

/* globals.css (After) */
@import "tailwindcss";

@theme {
  --color-background: #ffffff;
  --color-foreground: #0f172a;
}
```

#### 4. Migrate tailwind.config.js

```javascript
// tailwind.config.js (Before)
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

```css
/* globals.css (After) */
@import "tailwindcss";

@theme {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  --font-family-sans: "Inter", system-ui, sans-serif;
}
```

#### 5. Update Dark Mode

```javascript
// tailwind.config.js (Before)
module.exports = {
  darkMode: 'class',
}
```

```css
/* globals.css (After) */
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));
```

#### 6. Update Animations

```javascript
// tailwind.config.js (Before)
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
}
```

```css
/* globals.css (After) */
@import "tailwindcss";

@theme {
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

### Breaking Changes

| Feature | v3 | v4 |
|---------|-----|-----|
| Config file | `tailwind.config.js` | `@theme` in CSS |
| Entry point | `@tailwind` directives | `@import "tailwindcss"` |
| Content array | Manual configuration | Automatic detection |
| Dark mode | `darkMode: 'class'` | `@variant dark` |
| Plugins | `plugins: [...]` | CSS imports |
| Separator | `:` (configurable) | `:` (fixed) |

### Common Issues

#### Issue: Classes not being generated
**Solution:** Ensure files are being detected by automatic content detection or add `@source` directive.

```css
@import "tailwindcss";
@source "../path/to/files/**/*.tsx";
```

#### Issue: Custom colors not working
**Solution:** Use CSS custom property syntax.

```css
@theme {
  --color-brand: #3B82F6;  /* NOT --color-brand-500 in v4 */
}
```

#### Issue: Animations not working
**Solution:** Move keyframes outside `@theme` block.

```css
@theme {
  --animate-fade: fade 0.5s ease-out;
}

@keyframes fade {
  /* keyframes here */
}
```
