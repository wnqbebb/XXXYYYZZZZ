'use client'

import { useState, useEffect } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    const updateMatch = () => setMatches(media.matches)
    updateMatch()
    
    media.addEventListener('change', updateMatch)
    return () => media.removeEventListener('change', updateMatch)
  }, [query])

  return matches
}

// Predefined breakpoints
export function useBreakpoint(breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl') {
  const breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
  }
  
  return useMediaQuery(breakpoints[breakpoint])
}

export function useIsMobile() {
  return !useBreakpoint('md')
}

export function useIsDesktop() {
  return useBreakpoint('lg')
}
