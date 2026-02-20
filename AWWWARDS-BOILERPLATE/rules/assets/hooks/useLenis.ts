'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * Hook to access Lenis instance
 * MUST be used inside SmoothScroll provider
 * 
 * @example
 * const lenis = useLenis()
 * lenis?.scrollTo('#section')
 */
export function useLenis(): Lenis | null {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Lenis instance should be available from SmoothScroll context
    // This is a placeholder for more complex context-based implementation
    return () => {
      // Cleanup handled by SmoothScroll component
    }
  }, [])

  return lenisRef.current
}

/**
 * Hook to track scroll progress (0-1)
 * @example
 * const progress = useScrollProgress()
 * // Use for scroll-based animations
 */
export function useScrollProgress(): number {
  const progressRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      progressRef.current = scrollTop / docHeight
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progressRef.current
}
