---
name: folder-structure
description: Project folder architecture and organization. Load when setting up directory structure.
metadata:
  tags: structure, organization, folders, architecture
---

# Folder Structure Rules

## MUST: Root Directory Structure

```
my-project/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page
│   ├── loading.tsx          # Global loading UI
│   ├── error.tsx            # Global error boundary
│   ├── not-found.tsx        # 404 page
│   ├── globals.css          # Global styles
│   ├── template.tsx         # Page transition wrapper
│   │
│   ├── sections/            # Page sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Features.tsx
│   │   └── Contact.tsx
│   │
│   └── (routes)/            # Route groups
│       └── about/
│           └── page.tsx
│
├── components/
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── input.tsx
│   │
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Sidebar.tsx
│   │
│   └── effects/             # Animation components
│       ├── SmoothScroll.tsx
│       ├── PageTransition.tsx
│       ├── AnimatedSection.tsx
│       ├── ParallaxImage.tsx
│       └── TextReveal.tsx
│
├── hooks/
│   ├── useLenis.ts
│   ├── useGsap.ts
│   ├── useScrollProgress.ts
│   ├── useInView.ts
│   └── useMediaQuery.ts
│
├── lib/
│   ├── utils.ts             # cn() and utilities
│   ├── gsap.ts              # GSAP setup
│   ├── constants.ts         # App constants
│   └── api.ts               # API helpers
│
├── types/
│   └── index.ts             # Global TypeScript types
│
├── public/
│   ├── images/              # Static images
│   ├── fonts/               # Custom fonts
│   └── videos/              # Static videos
│
├── styles/
│   └── components.css       # Component-specific styles
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## MUST: Naming Conventions

```yaml
Files:
  Components: PascalCase (Hero.tsx, Button.tsx)
  Hooks: camelCase with use prefix (useLenis.ts)
  Utilities: camelCase (utils.ts, constants.ts)
  Styles: camelCase (globals.css, components.css)

Folders:
  lowercase: app/, components/, lib/, hooks/
  Routes: (group)/, [param]/

FORBIDDEN:
  - Spaces in filenames
  - Mixed case in folders
  - index.ts in every folder (use specific names)
```

## MUST: Import Aliases

```typescript
// MUST: Use @/ alias for all imports
import { Button } from '@/components/ui/Button'
import { useLenis } from '@/hooks/useLenis'
import { cn } from '@/lib/utils'

// FORBIDDEN: Relative imports beyond 2 levels
import { Button } from '../../../components/ui/Button' // ❌
```

## MUST: Component Organization

```typescript
// 1. Imports (React/Next first, then libraries, then local)
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'

// 2. Types/Interfaces
interface ComponentProps {
  title: string
  className?: string
}

// 3. Component
export function Component({ title, className }: ComponentProps) {
  // Hooks
  const ref = useRef(null)
  
  // Effects
  useEffect(() => {
    // Animation logic
  }, [])
  
  // Render
  return <div className={cn('', className)}>{title}</div>
}
```

---

**Structure complete. Proceed to [integration-patterns.md](./integration-patterns.md)**
