---
name: dependencies
description: Package installation for Awwwards stack. Load after project setup.
metadata:
  tags: npm, packages, dependencies, installation
---

# Dependencies Installation Rules

## MUST: Core Animation Stack

```bash
# MUST: Install in this exact order
npm install gsap@^3.12.0 @gsap/react@^2.0.0
npm install lenis@^1.1.0
```

### WHY: Animation Stack

```yaml
gsap:
  MUST: "^3.12.0" (ScrollTrigger improvements)
  PURPOSE: Core animation engine
  FORBIDDEN: < 3.10 (missing features)

@gsap/react:
  MUST: "^2.0.0" (React 18 support)
  PURPOSE: React integration hooks
  FORBIDDEN: Using gsap without React wrapper

lenis:
  MUST: "^1.1.0" (latest API)
  PURPOSE: Smooth scrolling
  FORBIDDEN: Locomotive Scroll (outdated)
  FORBIDDEN: Asscroll (unmaintained)
```

## MUST: 3D Graphics Stack

```bash
# MUST: Three.js ecosystem
npm install three@^0.160.0 @react-three/fiber@^8.15.0 @react-three/drei@^9.90.0
npm install -D @types/three@^0.160.0
```

### WHY: 3D Stack

```yaml
three:
  MUST: "^0.160.0" (WebGPU prep, performance)
  PURPOSE: Core 3D library

@react-three/fiber:
  MUST: "^8.15.0" (React 18 concurrent features)
  PURPOSE: React renderer for Three.js

@react-three/drei:
  MUST: "^9.90.0" (helpers & abstractions)
  PURPOSE: Useful Three.js components

@types/three:
  MUST: Dev dependency
  PURPOSE: TypeScript definitions
```

## MUST: Utility Stack

```bash
# MUST: Class merging utilities
npm install clsx@^2.0.0 tailwind-merge@^2.0.0

# MUST: Icons
npm install lucide-react@^0.300.0

# MUST: Form handling
npm install react-hook-form@^7.49.0 zod@^3.22.0 @hookform/resolvers@^3.3.0

# MUST: Class variance authority (for component variants)
npm install class-variance-authority@^0.7.0
```

### WHY: Utilities

```yaml
clsx + tailwind-merge:
  PURPOSE: Conditional class merging
  EXAMPLE: cn("px-4", isActive && "bg-blue-500")
  FORBIDDEN: Template literals for classes

lucide-react:
  PURPOSE: Consistent icon system
  FORBIDDEN: react-icons (inconsistent sizing)
  FORBIDDEN: @heroicons/react (limited set)

react-hook-form + zod:
  PURPOSE: Type-safe form handling
  WHY: Performance (uncontrolled inputs)
  FORBIDDEN: Formik (large bundle)
  FORBIDDEN: Manual form state

class-variance-authority:
  PURPOSE: Component variant typing
  EXAMPLE: Button variants (primary, secondary, ghost)
```

## MUST: Dev Dependencies

```bash
# MUST: Additional dev tools
npm install -D @types/node@^20.0.0
npm install -D prettier@^3.0.0 prettier-plugin-tailwindcss@^0.5.0
npm install -D eslint-config-prettier@^9.0.0
```

## MUST: Verify Installation

```bash
# MUST: Check package.json has all dependencies
cat package.json | grep -A 20 '"dependencies"'

# MUST: Verify node_modules
check_node_modules() {
  [ -d "node_modules/gsap" ] && echo "✓ gsap"
  [ -d "node_modules/lenis" ] && echo "✓ lenis"
  [ -d "node_modules/three" ] && echo "✓ three"
  [ -d "node_modules/@react-three/fiber" ] && echo "✓ @react-three/fiber"
  [ -d "node_modules/lucide-react" ] && echo "✓ lucide-react"
  [ -d "node_modules/react-hook-form" ] && echo "✓ react-hook-form"
  [ -d "node_modules/zod" ] && echo "✓ zod"
  [ -d "node_modules/clsx" ] && echo "✓ clsx"
  [ -d "node_modules/tailwind-merge" ] && echo "✓ tailwind-merge"
}

check_node_modules
```

## MUST: Lock File

```bash
# MUST: Generate lock file
npm install

# MUST: Commit lock file
git add package-lock.json
git commit -m "chore: Add Awwwards stack dependencies"
```

## FORBIDDEN: Package Anti-patterns

```yaml
FORBIDDEN:
  jquery: 
    WHY: "Obsolete, conflicts with React"
    
  lodash (full):
    WHY: "Use lodash-es or native"
    FIX: "npm install lodash-es"
    
  moment:
    WHY: "Bundle bloat, mutable"
    FIX: "Use date-fns or native Intl"
    
  styled-components:
    WHY: "Runtime overhead, hydration issues"
    FIX: "Use Tailwind"
    
  framer-motion (with GSAP):
    WHY: "Duplicate animation libraries"
    FIX: "Choose one: GSAP for complex, Framer for simple"
    
  @mui/material:
    WHY: "Heavy bundle, styling conflicts"
    FIX: "Use shadcn/ui or custom components"
```

## Bundle Size Budgets

```yaml
INITIAL LOAD:
  JavaScript: < 200KB gzipped
  CSS: < 50KB gzipped
  Images: < 500KB total (lazy load rest)
  Fonts: < 100KB (subset if needed)

DEPENDENCIES IMPACT:
  gsap: ~25KB
  three: ~150KB (load on demand)
  lenis: ~5KB
  lucide-react: ~15KB (tree-shakeable)
  react-hook-form: ~10KB
  zod: ~15KB

TOTAL EXPECTED: ~220KB (within budget)
```

---

**After dependencies installed, proceed to [configuration.md](./configuration.md)**
