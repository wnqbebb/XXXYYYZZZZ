'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect reduced motion preference
 * @returns boolean indicating if user prefers reduced motion
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion()
 * 
 * if (prefersReducedMotion) {
 *   // Skip animations
 * } else {
 *   // Run animations
 * }
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}
