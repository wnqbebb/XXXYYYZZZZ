---
name: integration-patterns
description: Integration patterns connecting all tools. Load when wiring up the stack.
metadata:
  tags: integration, patterns, wiring, connection
---

# Integration Patterns Rules

## MUST: Root Layout Setup

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SmoothScroll } from '@/components/effects/SmoothScroll'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import '@/lib/gsap' // Register GSAP plugins
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Site Name',
    template: '%s | Site Name'
  },
  description: 'Site description for SEO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  )
}
```

## MUST: Global Styles

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  --primary-foreground: 0 0% 98%;
  --secondary: 0 0% 96.1%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --accent: 0 0% 96.1%;
  --accent-foreground: 0 0% 9%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 89.8%;
  --input: 0 0% 89.8%;
  --ring: 0 0% 3.9%;
  --radius: 0.5rem;
}

.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --card: 0 0% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 0 0% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 14.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 14.9%;
  --muted-foreground: 0 0% 63.9%;
  --accent: 0 0% 14.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 14.9%;
  --input: 0 0% 14.9%;
  --ring: 0 0% 83.1%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

/* Lenis smooth scroll */
html.lenis {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

/* Selection color */
::selection {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
```

## MUST: Animation Component Pattern

```tsx
// components/effects/AnimatedSection.tsx
'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'scale-in'
  delay?: number
  duration?: number
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const animations = {
      'fade-up': { y: 50, opacity: 0 },
      'fade-in': { opacity: 0 },
      'slide-left': { x: -50, opacity: 0 },
      'scale-in': { scale: 0.9, opacity: 0 },
    }

    const ctx = gsap.context(() => {
      gsap.from(element, {
        ...animations[animation],
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [animation, delay, duration])

  return (
    <div ref={sectionRef} className={cn(className)}>
      {children}
    </div>
  )
}
```

---

**Integration complete. Proceed to [performance-baseline.md](./performance-baseline.md)**
