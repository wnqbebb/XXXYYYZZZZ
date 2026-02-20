'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface SmoothScrollProps {
  children: ReactNode
}

/**
 * SmoothScroll Component
 * Integrates Lenis smooth scrolling with GSAP ScrollTrigger
 * 
 * MUST: Wrap your entire app with this component in layout.tsx
 * MUST: Import and register GSAP plugins before use
 * 
 * @example
 * // app/layout.tsx
 * import { SmoothScroll } from '@/components/SmoothScroll'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <SmoothScroll>
 *           {children}
 *         </SmoothScroll>
 *       </body>
 *     </html>
 *   )
 * }
 */
export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // MUST: Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      return // Skip smooth scroll for accessibility
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // MUST: Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // MUST: Use GSAP ticker for Lenis animation frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    // MUST: Disable GSAP lag smoothing for smooth sync
    gsap.ticker.lagSmoothing(0)

    // Cleanup
    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return <>{children}</>
}

/**
 * Scroll to element helper
 * @param target - CSS selector or number (offset)
 * @param offset - Offset in pixels
 */
export function scrollTo(target: string | number, offset: number = 0): void {
  const lenis = new Lenis()
  
  lenis.scrollTo(target, {
    offset,
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })
  
  // Cleanup after scroll
  setTimeout(() => lenis.destroy(), 2000)
}
