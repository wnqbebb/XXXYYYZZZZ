---
name: best-practices
description: Code organization, naming conventions, anti-patterns, and maintainability guidelines for Tailwind CSS projects.
version: 4.0.0
---

# Best Practices - Code Organization Mastery

> Write maintainable, scalable, and consistent Tailwind CSS code.

---

## MUST

### 1. Organize Classes with Consistent Ordering

**✅ CORRECT:**
```tsx
// Order: Layout > Flexbox/Grid > Spacing > Sizing > Typography > Visuals > Interactions
<div className="
  /* Layout */
  relative
  
  /* Flexbox/Grid */
  flex items-center justify-between gap-4
  
  /* Spacing */
  px-4 py-3
  
  /* Sizing */
  w-full h-12
  
  /* Typography */
  text-sm font-medium
  
  /* Visuals */
  bg-white rounded-lg border shadow-sm
  
  /* Interactions */
  hover:bg-gray-50 hover:shadow-md
  focus-visible:ring-2 focus-visible:ring-offset-2
  transition-colors duration-200
">
```

### 2. Use Multi-line Formatting for Complex Components

**✅ CORRECT:**
```tsx
<button
  className="
    inline-flex items-center justify-center
    gap-2 px-4 py-2
    text-sm font-medium
    bg-primary text-primary-foreground
    rounded-md
    hover:bg-primary/90
    focus-visible:outline-none focus-visible:ring-2
    disabled:pointer-events-none disabled:opacity-50
    transition-colors
  "
>
  Click me
</button>
```

**❌ AVOID:**
```tsx
// ❌ Hard to read, hard to maintain
<button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 transition-colors">
  Click me
</button>
```

### 3. Extract Repeating Patterns to Components

**✅ CORRECT:**
```tsx
// Reusable Card component
function Card({ children, className }) {
  return (
    <div className={cn("rounded-xl border bg-card p-6 shadow", className)}>
      {children}
    </div>
  )
}

// Usage
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

**❌ AVOID:**
```tsx
// ❌ Repeating the same classes everywhere
<div className="rounded-xl border bg-card p-6 shadow">
  <h3>Title 1</h3>
</div>
<div className="rounded-xl border bg-card p-6 shadow">
  <h3>Title 2</h3>
</div>
```

### 4. Use `cn()` for Conditional Classes

**✅ CORRECT:**
```tsx
import { cn } from '@/lib/utils'

function Button({ variant, size, isLoading, children }) {
  return (
    <button
      className={cn(
        // Base styles
        "inline-flex items-center justify-center rounded-md font-medium",
        
        // Variant styles
        variant === 'primary' && "bg-primary text-white",
        variant === 'secondary' && "bg-secondary text-secondary-foreground",
        
        // Size styles
        size === 'sm' && "h-8 px-3 text-sm",
        size === 'lg' && "h-12 px-6 text-lg",
        
        // State styles
        isLoading && "opacity-70 cursor-wait",
        
        // Interactive styles
        "hover:opacity-90 transition-opacity"
      )}
    >
      {children}
    </button>
  )
}
```

---

## FORBIDDEN

### 1. Never Use Inline Arbitrary Values

**❌ FORBIDDEN:**
```tsx
// ❌ Arbitrary values scattered in templates
<div className="w-[387px] h-[243px] mt-[17px] p-[23px]">
```

**✅ CORRECT:**
```css
@theme {
  --spacing-card-width: 387px;
  --spacing-card-height: 243px;
}
```

```tsx
// ✅ Use theme-defined values
<div className="w-card-width h-card-height mt-4 p-6">
```

### 2. Never Mix Tailwind with Inline Styles

**❌ FORBIDDEN:**
```tsx
// ❌ Mixing approaches
<div 
  className="p-4 rounded-lg"
  style={{ width: '387px', marginTop: '17px' }}
>
```

**✅ CORRECT:**
```tsx
// ✅ All in Tailwind
<div className="p-4 rounded-lg w-card-width mt-4">
```

### 3. Never Use `!important` in Class Names

**❌ FORBIDDEN:**
```tsx
// ❌ Using !important
<div className="!p-4 !text-red-500">
```

**✅ CORRECT:**
```tsx
// ✅ Proper specificity
<div className="p-4 text-red-500">
```

Or if needed, use Tailwind's built-in important modifier:
```css
@theme {
  --color-critical: #ef4444 !important;
}
```

### 4. Never Create "Utility Dump" Components

**❌ FORBIDDEN:**
```tsx
// ❌ Component that accepts any className without structure
function Box({ className, children }) {
  return <div className={className}>{children}</div>
}

// Usage: Complete chaos
<Box className="p-4 m-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 focus:ring-2 disabled:opacity-50">
```

**✅ CORRECT:**
```tsx
// ✅ Structured component with defined variants
function Alert({ variant, children }) {
  return (
    <div className={cn(
      "p-4 rounded-lg",
      variant === 'error' && "bg-red-100 text-red-800 border border-red-200",
      variant === 'success' && "bg-green-100 text-green-800 border border-green-200",
    )}>
      {children}
    </div>
  )
}
```

---

## WHY

### Class Ordering Convention

Consistent ordering makes classes:
- **Scannable**: Find what you need quickly
- **Maintainable**: Know where to add new classes
- **Reviewable**: Easier code reviews

### Order Priority:
1. **Layout** (`relative`, `absolute`, `fixed`, `z-10`)
2. **Flexbox/Grid** (`flex`, `grid`, `items-center`, `gap-4`)
3. **Spacing** (`p-4`, `m-2`, `px-6`)
4. **Sizing** (`w-full`, `h-12`, `min-w-0`)
5. **Typography** (`text-sm`, `font-bold`, `leading-tight`)
6. **Visuals** (`bg-white`, `rounded-lg`, `border`, `shadow`)
7. **Interactions** (`hover:`, `focus:`, `disabled:`, `transition`)
8. **Modifiers** (`dark:`, `md:`, `motion-reduce:`)

---

## EXAMPLES

### Project Structure

```
my-app/
├── app/
│   ├── globals.css           # Tailwind entry + theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Pages
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── index.ts          # Barrel export
│   ├── layout/               # Layout components
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── footer.tsx
│   └── forms/                # Form-specific components
│       ├── text-field.tsx
│       └── select-field.tsx
├── lib/
│   ├── utils.ts              # cn() and utilities
│   └── constants.ts          # App constants
├── hooks/
│   ├── use-theme.ts
│   └── use-media-query.ts
└── types/
    └── index.ts              # TypeScript types
```

### Component File Structure

```tsx
// components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// ========================================
// VARIANTS
// ========================================
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
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

// ========================================
// TYPES
// ========================================
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

// ========================================
// COMPONENT
// ========================================
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

// ========================================
// EXPORTS
// ========================================
export { Button, buttonVariants }
```

### Utility File (cn.ts)

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class values into a single string,
 * merging Tailwind classes intelligently.
 * 
 * @example
 * cn('px-4', 'px-6') // => 'px-6' (conflict resolved)
 * cn('text-red-500', 'text-blue-500') // => 'text-blue-500'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Conditionally joins class names
 * @deprecated Use cn() instead
 */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs)
}
```

### Barrel Export Pattern

```typescript
// components/ui/index.ts
export { Button, buttonVariants, type ButtonProps } from './button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card'
export { Input, type InputProps } from './input'
export { Label } from './label'
export { Badge, badgeVariants } from './badge'

// Usage elsewhere:
// import { Button, Card, Input } from '@/components/ui'
```

### Form Component Pattern

```tsx
// components/forms/text-field.tsx
import { useId } from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export function TextField({
  label,
  error,
  helperText,
  className,
  ...props
}: TextFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  const helperId = `${id}-helper`

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-describedby={error ? errorId : helperId}
        aria-invalid={!!error}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
```

---

## Anti-Patterns Reference

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Arbitrary values | Not reusable, hard to maintain | Define in `@theme` |
| Inline styles | Breaks Tailwind's utility model | Use utility classes |
| `!important` | Specificity wars | Proper component structure |
| Class name concatenation | No conflict resolution | Use `cn()` utility |
| Copy-paste classes | Inconsistency, maintenance burden | Extract to components |
| Deep nesting | Specificity issues | Flatten structure |
| Mixed units | Inconsistent spacing | Use spacing scale |

---

## VS Code Settings

```json
{
  "editor.quickSuggestions": {
    "strings": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "headwind.runOnSave": false
}
```

---

## Related Assets

- [Project Structure Template](../assets/configs/project-structure.md)
- [VS Code Settings](../assets/configs/vscode-settings.json)
- [ESLint Config](../assets/configs/eslint.config.js)
- [Prettier Config](../assets/configs/prettier.config.js)
