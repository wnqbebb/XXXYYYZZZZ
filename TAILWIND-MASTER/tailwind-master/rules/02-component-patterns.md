---
name: component-patterns
description: Type-safe component variants using CVA (Class Variance Authority). Compound variants, slots, and design system patterns.
version: 4.0.0
---

# Component Patterns - CVA Mastery

> Build type-safe, maintainable components with Class Variance Authority (CVA) and Tailwind CSS.

---

## MUST

### 1. Use CVA for All Components with Variants

**✅ CORRECT:**
```typescript
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
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

### 2. Always Export VariantProps Type

**✅ CORRECT:**
```typescript
export type ButtonVariantProps = VariantProps<typeof buttonVariants>
```

### 3. Use Compound Variants for Complex Conditions

**✅ CORRECT:**
```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        outline: 'border-2 bg-transparent',
      },
      size: {
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-6 py-3',
      },
      color: {
        blue: '',
        red: '',
        green: '',
      },
    },
    compoundVariants: [
      // Outline + Color combinations
      { variant: 'outline', color: 'blue', class: 'border-blue-500 text-blue-500 hover:bg-blue-50' },
      { variant: 'outline', color: 'red', class: 'border-red-500 text-red-500 hover:bg-red-50' },
      { variant: 'outline', color: 'green', class: 'border-green-500 text-green-500 hover:bg-green-50' },
      // Large size gets extra shadow
      { size: 'lg', variant: 'default', class: 'shadow-lg' },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      color: 'blue',
    },
  }
)
```

### 4. Implement `cn()` Utility with tailwind-merge

**✅ CORRECT:**
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**WHY:** `tailwind-merge` resolves conflicting Tailwind classes intelligently:
- `px-4 px-6` → `px-6`
- `text-red-500 text-blue-500` → `text-blue-500`
- `hidden block` → `block`

---

## FORBIDDEN

### 1. Never Use Template Literals for Conditional Classes

**❌ FORBIDDEN:**
```typescript
// ❌ Hard to read, not type-safe
function Button({ variant, size, children }) {
  const className = `
    inline-flex items-center justify-center rounded-md
    ${variant === 'primary' ? 'bg-blue-500 text-white' : ''}
    ${variant === 'secondary' ? 'bg-gray-200 text-gray-800' : ''}
    ${size === 'sm' ? 'px-3 py-1.5 text-sm' : ''}
    ${size === 'lg' ? 'px-6 py-3 text-lg' : ''}
  `
  return <button className={className}>{children}</button>
}
```

**✅ CORRECT:**
```typescript
// ✅ Clean, type-safe, maintainable
const buttonVariants = cva('...', { variants: { ... } })

function Button({ variant, size, className, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

### 2. Never Spread Props Without Type Safety

**❌ FORBIDDEN:**
```typescript
// ❌ No type safety on variant/size
function Button(props) {
  return <button className={buttonVariants(props)} {...props} />
}
```

**✅ CORRECT:**
```typescript
// ✅ Full type safety
interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
  className?: string
}

function Button({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </button>
  )
}
```

### 3. Never Forget Disabled States

**❌ FORBIDDEN:**
```typescript
const buttonVariants = cva('...', {
  variants: {
    variant: { ... },
    // ❌ Missing disabled state
  },
})
```

**✅ CORRECT:**
```typescript
const buttonVariants = cva(
  'inline-flex items-center... disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: { ... },
    },
  }
)
```

---

## WHY

### Benefits of CVA

1. **Type Safety**: Full TypeScript inference for all variants
2. **Maintainability**: Centralized style definitions
3. **Composability**: Easy to extend and override
4. **Readability**: Declarative variant definitions
5. **Performance**: No runtime class string manipulation

### The `cn()` Pattern

```typescript
cn('base', condition && 'conditional', ['array', 'of', 'classes'], {
  'conditional-class': isActive,
})
// → Merged and deduplicated classes
```

---

## EXAMPLES

### Complete Button Component

```typescript
// components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

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

export { Button, buttonVariants }
```

### Card Component with Multiple Slots

```typescript
// components/ui/card.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### Input Component with States

```typescript
// components/ui/input.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        success: 'border-success focus-visible:ring-success',
      },
      size: {
        default: 'h-10',
        sm: 'h-8 px-2',
        lg: 'h-12 px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
```

### Badge Component

```typescript
// components/ui/badge.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'border-transparent bg-success text-success-foreground hover:bg-success/80',
        warning: 'border-transparent bg-warning text-warning-foreground hover:bg-warning/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

### Alert Component

```typescript
// components/ui/alert.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success: 'border-success/50 text-success dark:border-success [&>svg]:text-success',
        warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
```

---

## Advanced Patterns

### Polymorphic Components with Slot

```typescript
// components/ui/polymorphic-button.tsx
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const polymorphicButtonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: { ... },
      size: { ... },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface PolymorphicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof polymorphicButtonVariants> {
  asChild?: boolean
}

function PolymorphicButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: PolymorphicButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(polymorphicButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

// Usage:
// <PolymorphicButton asChild>
//   <a href="/link">Link Button</a>
// </PolymorphicButton>
```

### Component with Data Attributes

```typescript
// components/ui/status-badge.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        online: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        offline: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        away: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        busy: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      },
    },
    defaultVariants: {
      status: 'offline',
    },
  }
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  className?: string
  label?: string
}

function StatusBadge({ status, className, label }: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ status }), className)}
      data-status={status}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label || status}
    </span>
  )
}
```

---

## Related Assets

- [Button Component](../assets/components/button.tsx)
- [Card Component](../assets/components/card.tsx)
- [Input Component](../assets/components/input.tsx)
- [Badge Component](../assets/components/badge.tsx)
- [cn() Utility](../assets/utils/cn.ts)
