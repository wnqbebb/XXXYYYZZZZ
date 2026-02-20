---
name: dark-mode
description: Dark mode implementation strategies with @variant directive. System preference, manual toggle, and hybrid approaches.
version: 4.0.0
---

# Dark Mode - Theme Switching Mastery

> Implement elegant dark mode with system preference detection, manual toggles, and seamless transitions.

---

## MUST

### 1. Define Dark Mode Variant in CSS

**✅ CORRECT:**
```css
/* globals.css */
@import "tailwindcss";

/* System preference (default) */
@variant dark (&:where(.dark, .dark *));

/* Or: Media query only */
@variant dark (&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *));
```

### 2. Use Semantic Color Tokens

**✅ CORRECT:**
```css
@theme {
  /* Light mode defaults */
  --color-background: #ffffff;
  --color-foreground: #0f172a;
  --color-card: #ffffff;
  --color-card-foreground: #0f172a;
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-secondary: #f1f5f9;
  --color-secondary-foreground: #0f172a;
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  --color-accent: #f1f5f9;
  --color-accent-foreground: #0f172a;
  --color-destructive: #ef4444;
  --color-destructive-foreground: #ffffff;
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #3b82f6;
}

/* Dark mode overrides */
.dark {
  --color-background: #0f172a;
  --color-foreground: #f8fafc;
  --color-card: #1e293b;
  --color-card-foreground: #f8fafc;
  --color-primary: #60a5fa;
  --color-primary-foreground: #0f172a;
  --color-secondary: #1e293b;
  --color-secondary-foreground: #f8fafc;
  --color-muted: #334155;
  --color-muted-foreground: #94a3b8;
  --color-accent: #334155;
  --color-accent-foreground: #f8fafc;
  --color-destructive: #f87171;
  --color-destructive-foreground: #0f172a;
  --color-border: #334155;
  --color-input: #334155;
  --color-ring: #60a5fa;
}
```

### 3. Implement Smooth Theme Transitions

**✅ CORRECT:**
```css
/* globals.css */
@import "tailwindcss";

/* Smooth transition between themes */
* {
  @apply transition-colors duration-200;
}

/* Or more targeted */
html {
  @apply transition-colors duration-200;
}

body {
  @apply bg-background text-foreground;
}
```

### 4. Support System Preference

**✅ CORRECT:**
```typescript
// hooks/use-theme.ts
import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      const newTheme = theme === 'system' ? systemTheme : theme
      
      root.classList.remove('light', 'dark')
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }

    applyTheme()
    mediaQuery.addEventListener('change', applyTheme)
    
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  return { theme, setTheme, resolvedTheme }
}
```

---

## FORBIDDEN

### 1. Never Hardcode Dark Colors

**❌ FORBIDDEN:**
```tsx
// ❌ Hardcoded dark colors
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">
    Content
  </p>
</div>
```

**✅ CORRECT:**
```tsx
// ✅ Semantic color tokens
<div className="bg-background">
  <p className="text-foreground">
    Content
  </p>
</div>
```

### 2. Never Forget to Persist User Preference

**❌ FORBIDDEN:**
```typescript
// ❌ Theme resets on page reload
const [theme, setTheme] = useState('light')
```

**✅ CORRECT:**
```typescript
// ✅ Persist to localStorage
const [theme, setTheme] = useState<Theme>(() => {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem('theme') as Theme) || 'system'
})

useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])
```

### 3. Never Cause Flash of Wrong Theme

**❌ FORBIDDEN:**
```tsx
// ❌ Theme applied after hydration
function App() {
  const { resolvedTheme } = useTheme()
  return <div className={resolvedTheme}>...</div>
}
```

**✅ CORRECT:**
```html
<!-- Inline script in <head> prevents flash -->
<script>
  (function() {
    const theme = localStorage.getItem('theme') || 'system'
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const resolved = theme === 'system' ? systemTheme : theme
    document.documentElement.classList.add(resolved)
  })()
</script>
```

---

## WHY

### Semantic Tokens Benefits

1. **Consistency**: Same token means same purpose everywhere
2. **Maintainability**: Change in one place updates everywhere
3. **Accessibility**: Ensures proper contrast ratios
4. **Flexibility**: Easy to add new themes (sepia, high-contrast)

### Token Naming Convention

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `background` | white | slate-900 | Page background |
| `foreground` | slate-900 | white | Primary text |
| `card` | white | slate-800 | Card backgrounds |
| `muted` | slate-100 | slate-700 | Subtle backgrounds |
| `border` | slate-200 | slate-700 | Borders, dividers |
| `primary` | blue-500 | blue-400 | Primary actions |

---

## EXAMPLES

### Complete Theme Provider

```typescript
// components/theme-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: 'light' | 'dark'
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem(storageKey) as Theme
    if (saved) setTheme(saved)
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      root.classList.remove('light', 'dark')
      
      const systemTheme = mediaQuery.matches ? 'dark' : 'light'
      const newTheme = theme === 'system' ? systemTheme : theme
      
      root.classList.add(newTheme)
      setResolvedTheme(newTheme)
    }

    applyTheme()
    mediaQuery.addEventListener('change', applyTheme)
    
    return () => mediaQuery.removeEventListener('change', applyTheme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    resolvedTheme,
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
```

### Theme Toggle Component

```typescript
// components/ui/theme-toggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className="mr-2 h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className="mr-2 h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Monitor className="mr-2 h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Simple Toggle Button

```typescript
// components/ui/simple-theme-toggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function SimpleThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )
      }
    </Button>
  )
}
```

### Next.js Layout with Theme

```typescript
// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system'
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                const resolved = theme === 'system' ? systemTheme : theme
                document.documentElement.classList.add(resolved)
              })()
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system" storageKey="app-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Component with Dark Mode Support

```tsx
// components/ui/alert.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// Usage - automatically adapts to theme
function Example() {
  return (
    <div className="bg-background text-foreground">
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again.
        </AlertDescription>
      </Alert>
    </div>
  )
}
```

---

## Complete Color System

```css
@theme {
  /* ========================================
     BASE COLORS
     ======================================== */
  
  /* Light mode (default) */
  --color-background: #ffffff;
  --color-foreground: #020617;
  
  /* Card colors */
  --color-card: #ffffff;
  --color-card-foreground: #020617;
  
  /* Popover colors */
  --color-popover: #ffffff;
  --color-popover-foreground: #020617;
  
  /* Primary brand colors */
  --color-primary: #0f172a;
  --color-primary-foreground: #f8fafc;
  
  /* Secondary colors */
  --color-secondary: #f1f5f9;
  --color-secondary-foreground: #0f172a;
  
  /* Muted colors */
  --color-muted: #f1f5f9;
  --color-muted-foreground: #64748b;
  
  /* Accent colors */
  --color-accent: #f1f5f9;
  --color-accent-foreground: #0f172a;
  
  /* Destructive colors */
  --color-destructive: #ef4444;
  --color-destructive-foreground: #f8fafc;
  
  /* Border and input */
  --color-border: #e2e8f0;
  --color-input: #e2e8f0;
  --color-ring: #0f172a;
  
  /* Status colors */
  --color-success: #22c55e;
  --color-success-foreground: #f0fdf4;
  --color-warning: #f59e0b;
  --color-warning-foreground: #fffbeb;
  --color-info: #3b82f6;
  --color-info-foreground: #eff6ff;
}

/* ========================================
   DARK MODE OVERRIDES
   ======================================== */
.dark {
  --color-background: #020617;
  --color-foreground: #f8fafc;
  
  --color-card: #0f172a;
  --color-card-foreground: #f8fafc;
  
  --color-popover: #0f172a;
  --color-popover-foreground: #f8fafc;
  
  --color-primary: #f8fafc;
  --color-primary-foreground: #020617;
  
  --color-secondary: #1e293b;
  --color-secondary-foreground: #f8fafc;
  
  --color-muted: #1e293b;
  --color-muted-foreground: #94a3b8;
  
  --color-accent: #1e293b;
  --color-accent-foreground: #f8fafc;
  
  --color-destructive: #7f1d1d;
  --color-destructive-foreground: #f8fafc;
  
  --color-border: #1e293b;
  --color-input: #1e293b;
  --color-ring: #cbd5e1;
  
  --color-success: #166534;
  --color-success-foreground: #dcfce7;
  --color-warning: #92400e;
  --color-warning-foreground: #fef3c7;
  --color-info: #1e40af;
  --color-info-foreground: #dbeafe;
}
```

---

## Related Assets

- [ThemeProvider Component](../assets/components/theme-provider.tsx)
- [ThemeToggle Component](../assets/components/theme-toggle.tsx)
- [useTheme Hook](../assets/hooks/use-theme.ts)
- [Complete Color System](../assets/styles/color-system.css)
