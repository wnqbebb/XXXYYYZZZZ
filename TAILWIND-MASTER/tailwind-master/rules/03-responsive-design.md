---
name: responsive-design
description: Mobile-first responsive design with container queries, breakpoints, and fluid layouts. Tailwind CSS v4 native container query support.
version: 4.0.0
---

# Responsive Design - Mobile-First Mastery

> Build truly responsive components with viewport breakpoints AND container queries for component-level responsiveness.

---

## MUST

### 1. Use Mobile-First Breakpoint Strategy

**✅ CORRECT:**
```tsx
// Start with mobile, add complexity at larger screens
<div className="
  grid
  grid-cols-1      /* Mobile: 1 column */
  sm:grid-cols-2   /* 640px+: 2 columns */
  lg:grid-cols-3   /* 1024px+: 3 columns */
  xl:grid-cols-4   /* 1280px+: 4 columns */
  gap-4
  md:gap-6
  lg:gap-8
">
```

### 2. Use Container Queries for Component Responsiveness

**✅ CORRECT:**
```tsx
// Component adapts to its container, not viewport
<div className="@container">
  <div className="
    flex flex-col
    @md:flex-row    /* Container >= 448px: horizontal */
    @lg:gap-6
    gap-4
  ">
    <div className="@md:w-1/3">Sidebar</div>
    <div className="@md:w-2/3">Content</div>
  </div>
</div>
```

### 3. Use Named Containers for Complex Layouts

**✅ CORRECT:**
```tsx
<div className="@container/main">
  <header className="@lg/main:p-8">
    <h1 className="@sm/main:text-xl @lg/main:text-3xl">Title</h1>
  </header>
  
  <div className="@container/sidebar">
    <aside className="@sm/sidebar:w-64">
      {/* Sidebar content */}
    </aside>
  </div>
</div>
```

### 4. Use Container Query Units for Fluid Sizing

**✅ CORRECT:**
```tsx
<div className="@container">
  {/* 50% of container width */}
  <div className="w-[50cqw]">Half width</div>
  
  {/* Font size relative to container */}
  <h2 className="text-[max(1.5rem,2cqi)]">Responsive Heading</h2>
  
  {/* Padding relative to container */}
  <div className="p-[3cqi]">Container-relative padding</div>
</div>
```

---

## FORBIDDEN

### 1. Never Use Desktop-First Approach

**❌ FORBIDDEN:**
```tsx
// ❌ Desktop-first (harder to maintain)
<div className="
  grid grid-cols-4        /* Desktop first */
  lg:grid-cols-3          /* Undo at smaller screens */
  md:grid-cols-2
  sm:grid-cols-1
">
```

**✅ CORRECT:**
```tsx
// ✅ Mobile-first (cleaner, maintainable)
<div className="
  grid grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
">
```

### 2. Never Mix Viewport and Container Queries Without Purpose

**❌ FORBIDDEN:**
```tsx
// ❌ Confusing mix without clear intent
<div className="@container">
  <div className="lg:flex @md:block">
    {/* Which breakpoint applies? */}
  </div>
</div>
```

**✅ CORRECT:**
```tsx
// ✅ Clear separation of concerns
// Use viewport for page layout
<div className="lg:flex">
  {/* Use container for component layout */}
  <div className="@container">
    <div className="@md:flex">
      {/* Component content */}
    </div>
  </div>
</div>
```

### 3. Never Use Arbitrary Breakpoints Without Theme Definition

**❌ FORBIDDEN:**
```tsx
// ❌ Arbitrary breakpoint
<div className="min-[850px]:flex">
```

**✅ CORRECT:**
```css
@theme {
  --breakpoint-tablet: 53.125rem;  /* 850px */
}
```

```tsx
// ✅ Theme-defined breakpoint
<div className="tablet:flex">
```

---

## WHY

### Container Queries vs Media Queries

| Feature | Media Queries | Container Queries |
|---------|--------------|-------------------|
| Based on | Viewport width | Parent container width |
| Use case | Page layout | Component layout |
| Portability | Component breaks in different contexts | Component adapts anywhere |
| Syntax | `sm:`, `md:`, `lg:` | `@sm:`, `@md:`, `@lg:` |

### When to Use Each

**Use Media Queries for:**
- Page-level layout (header, footer, main grid)
- Navigation behavior
- Global typography scale

**Use Container Queries for:**
- Card components
- Sidebar widgets
- Reusable UI components
- Dashboard panels

---

## EXAMPLES

### Responsive Grid System

```tsx
// components/layout/ResponsiveGrid.tsx
interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveGrid({ children, className }: ResponsiveGridProps) {
  return (
    <div className={`
      grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      2xl:grid-cols-5
      gap-4
      sm:gap-5
      lg:gap-6
      ${className}
    `}>
      {children}
    </div>
  )
}
```

### Container-Responsive Card

```tsx
// components/ui/ResponsiveCard.tsx
interface ResponsiveCardProps {
  title: string
  description: string
  image: string
}

export function ResponsiveCard({ title, description, image }: ResponsiveCardProps) {
  return (
    <div className="@container">
      <div className="
        flex flex-col
        @md:flex-row
        @lg:flex-col
        gap-4
        rounded-lg
        border
        overflow-hidden
      ">
        <img 
          src={image} 
          alt={title}
          className="
            w-full
            h-48
            @md:w-1/3
            @md:h-auto
            @lg:w-full
            @lg:h-48
            object-cover
          "
        />
        <div className="
          p-4
          @md:p-6
          @md:flex-1
          @lg:p-4
        ">
          <h3 className="
            text-lg
            @md:text-xl
            font-semibold
            mb-2
          ">
            {title}
          </h3>
          <p className="
            text-sm
            @md:text-base
            text-muted-foreground
          ">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Dashboard Layout with Mixed Queries

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      {/* Header - viewport responsive */}
      <header className="
        h-16
        lg:h-20
        border-b
        px-4
        lg:px-8
      ">
        {/* Header content */}
      </header>
      
      <div className="flex">
        {/* Sidebar - viewport responsive */}
        <aside className="
          hidden
          lg:block
          w-64
          flex-shrink-0
          border-r
          min-h-[calc(100vh-5rem)]
        ">
          {/* Sidebar content */}
        </aside>
        
        {/* Main content area */}
        <main className="flex-1 p-4 lg:p-8">
          {/* Widgets grid - container responsive */}
          <div className="@container">
            <div className="
              grid
              grid-cols-1
              @md:grid-cols-2
              @xl:grid-cols-3
              gap-4
              @md:gap-6
            ">
              <StatsWidget />
              <ChartWidget />
              <RecentActivityWidget />
            </div>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Stats Widget (Container-Responsive)

```tsx
// components/dashboard/StatsWidget.tsx
export function StatsWidget() {
  return (
    <div className="@container">
      <div className="
        rounded-lg
        border
        p-4
        @md:p-6
      ">
        <div className="
          flex
          items-center
          justify-between
        ">
          <div>
            <p className="
              text-sm
              @md:text-base
              text-muted-foreground
            ">
              Total Revenue
            </p>
            <p className="
              text-2xl
              @md:text-3xl
              font-bold
              mt-1
            ">
              $45,231.89
            </p>
          </div>
          <div className="
            h-10
            w-10
            @md:h-12
            @md:w-12
            rounded-full
            bg-primary/10
            flex
            items-center
            justify-center
          ">
            <DollarIcon className="
              h-5
              w-5
              @md:h-6
              @md:w-6
              text-primary
            " />
          </div>
        </div>
        
        <div className="
          mt-4
          flex
          items-center
          gap-2
        ">
          <Badge variant="success">+20.1%</Badge>
          <span className="
            text-xs
            @md:text-sm
            text-muted-foreground
          ">
            from last month
          </span>
        </div>
      </div>
    </div>
  )
}
```

### Product Card with Named Container

```tsx
// components/product/ProductCard.tsx
interface ProductCardProps {
  product: {
    name: string
    price: number
    image: string
    rating: number
    reviews: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="@container/product">
      <div className="
        group
        relative
        rounded-xl
        border
        overflow-hidden
        hover:shadow-lg
        transition-shadow
      ">
        {/* Image container */}
        <div className="
          aspect-square
          @md/product:aspect-[4/3]
          bg-gray-100
          relative
          overflow-hidden
        ">
          <img
            src={product.image}
            alt={product.name}
            className="
              w-full
              h-full
              object-cover
              group-hover:scale-105
              transition-transform
              duration-300
            "
          />
          
          {/* Quick actions - appear on hover */}
          <div className="
            absolute
            inset-x-0
            bottom-0
            p-4
            bg-gradient-to-t
            from-black/50
            to-transparent
            opacity-0
            group-hover:opacity-100
            transition-opacity
          ">
            <Button size="sm" className="w-full">
              Quick Add
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 @md/product:p-5">
          <h3 className="
            font-medium
            text-sm
            @md/product:text-base
            line-clamp-2
          ">
            {product.name}
          </h3>
          
          <div className="
            mt-2
            flex
            items-center
            gap-2
          ">
            <div className="flex items-center">
              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm ml-1">{product.rating}</span>
            </div>
            <span className="text-muted-foreground text-sm">
              ({product.reviews})
            </span>
          </div>
          
          <p className="
            mt-2
            text-lg
            @md/product:text-xl
            font-bold
          ">
            ${product.price}
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Fluid Typography with clamp()

```css
@theme {
  /* Fluid typography using CSS clamp() */
  --text-fluid-sm: clamp(0.875rem, 0.8rem + 0.25vw, 1rem);
  --text-fluid-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
  --text-fluid-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
  --text-fluid-xl: clamp(1.25rem, 1rem + 1.25vw, 1.5rem);
  --text-fluid-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-fluid-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
  --text-fluid-4xl: clamp(2.25rem, 1.8rem + 2.25vw, 3rem);
}
```

```tsx
// Usage
<h1 className="text-fluid-4xl font-bold">Fluid Heading</h1>
<p className="text-fluid-base">Fluid paragraph text</p>
```

---

## Breakpoint Reference

### Default Breakpoints (Viewport)

| Name | Width | Usage |
|------|-------|-------|
| `sm` | 640px | Large phones, small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Default Container Sizes

| Name | Width | Usage |
|------|-------|-------|
| `@3xs` | 256px | Tiny containers |
| `@2xs` | 288px | Small widgets |
| `@xs` | 320px | Mobile cards |
| `@sm` | 384px | Small cards |
| `@md` | 448px | Medium cards |
| `@lg` | 512px | Large cards |
| `@xl` | 576px | Sidebars |
| `@2xl` | 672px | Wide cards |
| `@3xl` | 768px | Full-width cards |
| `@4xl` | 896px | Wide layouts |
| `@5xl` | 1024px | Large layouts |
| `@6xl` | 1152px | Extra large |
| `@7xl` | 1280px | Maximum width |

---

## Custom Breakpoints

```css
@theme {
  /* Custom viewport breakpoints */
  --breakpoint-xs: 20rem;      /* 320px */
  --breakpoint-tablet: 48rem;   /* 768px */
  --breakpoint-desktop: 64rem;  /* 1024px */
  --breakpoint-wide: 90rem;     /* 1440px */
  --breakpoint-ultrawide: 120rem; /* 1920px */
  
  /* Custom container sizes */
  --container-card: 24rem;
  --container-sidebar: 20rem;
  --container-content: 48rem;
  --container-wide: 80rem;
}
```

---

## Related Assets

- [Responsive Grid Component](../assets/components/responsive-grid.tsx)
- [Container Card Component](../assets/components/container-card.tsx)
- [Dashboard Layout](../assets/components/dashboard-layout.tsx)
