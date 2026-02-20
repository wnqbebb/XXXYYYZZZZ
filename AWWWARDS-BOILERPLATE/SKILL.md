---
name: awwwards-boilerplate
description: Awwwards-ready project boilerplate for award-winning web experiences. Use when (1) Starting new premium web projects, (2) Setting up Awwwards-caliber sites, (3) Creating High-Ticket client projects, (4) Building immersive digital experiences. This is the foundation for 50K+ projects.
metadata:
  tags: awwwards, boilerplate, starter, nextjs, gsap, premium, high-ticket
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
  category: foundation
---

# AWWWARDS-BOILERPLATE Master System

**The foundation of award-winning digital experiences.**

This skill provides the complete scaffolding for Awwwards-caliber websites. It integrates Next.js 14+, GSAP, Lenis, Three.js, and Tailwind into a production-ready foundation that delivers 60fps animations, <1s LCP, and immersive experiences.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - User says: "Awwwards site", "premium website", "high-end web"
  - Starting projects with budget >5K
  - Client wants animations and immersive experiences
  - Building portfolio/showcase sites
  - Creating agency websites
  - Any project targeting design awards

DO NOT USE WHEN:
  - Simple landing pages (use basic templates)
  - MVP/Prototype phase
  - Projects with <2 weeks timeline
  - Static sites without animations
```

---

## The Awwwards Stack

### Core Technologies

```
Framework:        Next.js 15 (App Router)
Language:         TypeScript 5.3+
Styling:          Tailwind CSS 3.4+
Animation:        GSAP 3.12 + @gsap/react
Smooth Scroll:    Lenis 1.1
3D Graphics:      Three.js + React Three Fiber
UI Components:    shadcn/ui
Forms:            React Hook Form + Zod
Icons:            Lucide React
Fonts:            next/font (variable fonts)
```

### Performance Targets

```yaml
Core Web Vitals:
  LCP (Largest Contentful Paint): < 1.2s
  FID (First Input Delay): < 50ms
  CLS (Cumulative Layout Shift): < 0.05
  TTFB (Time to First Byte): < 200ms
  FCP (First Contentful Paint): < 0.8s

Animation Performance:
  Frame Rate: 60fps minimum
  Memory Usage: < 100MB
  Bundle Size: < 200KB initial
```

---

## Rule Files Index

### Foundation Rules

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/project-setup.md](./rules/project-setup.md) | Initial project creation | Starting new project |
| [rules/folder-structure.md](./rules/folder-structure.md) | Directory architecture | Setting up structure |
| [rules/dependencies.md](./rules/dependencies.md) | Package installation | Installing dependencies |
| [rules/configuration.md](./rules/configuration.md) | Config files setup | Configuring tools |

### Integration Rules

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/integration-patterns.md](./rules/integration-patterns.md) | Connecting all tools | Integrating stack |
| [rules/performance-baseline.md](./rules/performance-baseline.md) | Optimization setup | Performance tuning |
| [rules/deployment-ready.md](./rules/deployment-ready.md) | Production prep | Going live |

### Asset Library

```
rules/assets/
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind with custom theme
├── tsconfig.json               # TypeScript strict config
├── components/
│   ├── SmoothScroll.tsx        # Lenis + GSAP integration
│   ├── PageTransition.tsx      # Page transition wrapper
│   ├── AnimatedSection.tsx     # ScrollTrigger wrapper
│   └── Preloader.tsx           # Initial loading screen
├── hooks/
│   ├── useLenis.ts             # Lenis hook
│   ├── useGsap.ts              # GSAP context hook
│   └── useScrollProgress.ts    # Scroll progress tracking
├── lib/
│   ├── utils.ts                # cn() and utilities
│   └── gsap.ts                 # GSAP plugin registration
└── styles/
    └── globals.css             # Global styles + Tailwind
```

---

## Quick Start Workflow

### Step 1: Project Initialization

```bash
# MUST: Use official create-next-app
npx create-next-app@latest project-name \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

# MUST: Enter project directory
cd project-name
```

### Step 2: Dependencies Installation

```bash
# Core animation stack
npm install gsap @gsap/react lenis

# 3D capabilities
npm install three @react-three/fiber @react-three/drei

# Utilities
npm install clsx tailwind-merge
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react

# Dev dependencies
npm install -D @types/three
```

### Step 3: Configuration Setup

Load [rules/configuration.md](./rules/configuration.md) for complete setup of:
- `next.config.ts` - Image optimization, headers, redirects
- `tailwind.config.ts` - Custom theme, animations, colors
- `tsconfig.json` - Strict mode paths

### Step 4: Integration

Load [rules/integration-patterns.md](./rules/integration-patterns.md) for:
- Smooth scroll + GSAP synchronization
- Page transition setup
- Global animation context

---

## Architecture Principles

### 1. Server-First Rendering

```yaml
MUST:
  - Use Server Components by default
  - Fetch data server-side
  - Keep animations client-side only
  - Implement proper loading states

FORBIDDEN:
  - 'use client' on entire pages
  - Client-side data fetching for initial load
  - Blocking renders with animations
```

### 2. Animation Performance

```yaml
MUST:
  - Use transform/opacity only
  - Implement will-change strategically
  - Kill animations on unmount
  - Support prefers-reduced-motion

FORBIDDEN:
  - Animating layout properties (width/height)
  - setState in animation loops
  - Creating new tweens in mousemove
  - Ignoring mobile performance
```

### 3. Code Organization

```yaml
MUST:
  - Colocate related files
  - Use absolute imports (@/)
  - Keep components under 200 lines
  - Extract reusable animations

FORBIDDEN:
  - Deep nesting (>3 levels)
  - Circular dependencies
  - Magic numbers (use constants)
  - Inline styles (use Tailwind)
```

---

## Quality Gates

### Before Development

- [ ] Node.js 18+ installed
- [ ] TypeScript strict mode enabled
- [ ] ESLint + Prettier configured
- [ ] Git initialized

### During Development

- [ ] Lighthouse score >90 on all metrics
- [ ] No console errors/warnings
- [ ] 60fps on target devices
- [ ] Responsive breakpoints tested

### Before Deployment

- [ ] Bundle analysis completed
- [ ] Images optimized
- [ ] Fonts preloaded
- [ ] Meta tags complete
- [ ] Analytics connected

---

## Integration with Other Skills

```
DEPENDS ON:
  - nextjs-architect (App Router patterns)
  - html5-semantic (Structure)
  - css3-modern (Styling foundations)
  - js-advanced (Patterns)

WORKS WITH:
  - gsap-animator (Animations)
  - lenis-scroll (Smooth scroll)
  - tailwind-master (Styling)
  - threejs-creative (3D elements)
  - performance-guardian (Optimization)
  - vercel-deploy (Deployment)

ENABLES:
  - All creative skills
  - High-ticket project delivery
  - Awwwards submissions
```

---

## Version History

```yaml
v3.0.0 (2026):
  - Next.js 15 App Router
  - GSAP 3.12 + ScrollTrigger
  - Lenis 1.1 smooth scroll
  - Three.js React 18 integration
  - shadcn/ui components
  - Strict TypeScript 5.3

v2.0.0 (2025):
  - Next.js 14 migration
  - App Router adoption
  - Server Components patterns

v1.0.0 (2024):
  - Initial boilerplate
  - Pages Router
  - Basic GSAP integration
```

---

## Support & Resources

### Documentation References

- [Next.js Documentation](https://nextjs.org/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Three.js Fundamentals](https://threejs.org/manual/)
- [Lenis GitHub](https://github.com/studio-freight/lenis)

### Troubleshooting

Load [rules/deployment-ready.md](./rules/deployment-ready.md) for:
- Common build errors
- Performance debugging
- Vercel deployment issues
- Asset optimization

---

**This boilerplate is the result of 100+ Awwwards-caliber projects. Use it as the foundation for your next award-winning site.**
