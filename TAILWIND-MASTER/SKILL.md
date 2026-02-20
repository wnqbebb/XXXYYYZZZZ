---
name: tailwind-master
description: Tailwind CSS mastery with custom configurations and advanced patterns. Use (1) Styling components, (2) Creating design systems, (3) Responsive design, (4) Custom animations. MANDATORY for all Tailwind projects.
metadata:
  tags: tailwind, css, styling, design-system, responsive
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
---

# Tailwind Master System

**Utility-first. Design-system ready. Production-proven.**

---

## Configuration

### tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
```

---

## Patterns

### Component Extraction

```typescript
// components/ui/button.tsx
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        secondary: 'bg-secondary text-white hover:bg-secondary/90',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
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

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
  md:gap-6
  lg:gap-8
">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## Utility Patterns

```tsx
// Layout
<div className="container mx-auto px-4 sm:px-6 lg:px-8">

// Flexbox centering
<div className="flex items-center justify-center min-h-screen">

// Card with hover
<div className="
  bg-white
  rounded-lg
  shadow-md
  hover:shadow-xl
  transition-shadow
  duration-300
  p-6
">

// Text truncation
<p className="truncate max-w-xs">

// Aspect ratio
<div className="aspect-video bg-gray-200">
```

---

## Checklist

- [ ] Config extends theme properly
- [ ] Mobile-first responsive
- [ ] Component variants defined
- [ ] Animations in config
- [ ] Custom colors/spacing
- [ ] No arbitrary values (use config)
