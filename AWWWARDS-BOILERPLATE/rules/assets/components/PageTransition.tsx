'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from '@/lib/gsap'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
}

/**
 * PageTransition Component
 * Adds smooth page transition animations
 * 
 * MUST: Use in app/template.tsx
 * 
 * @example
 * // app/template.tsx
 * import { PageTransition } from '@/components/effects/PageTransition'
 * 
 * export default function Template({ children }) {
 *   return <PageTransition>{children}</PageTransition>
 * }
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Entry animation
    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
    })

    return () => ctx.revert()
  }, [pathname])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}
