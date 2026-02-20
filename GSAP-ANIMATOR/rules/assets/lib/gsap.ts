import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * GSAP Plugin Registration
 * MUST: Import this file before using GSAP plugins
 * 
 * @example
 * import '@/lib/gsap' // At top of component
 */

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Refresh all ScrollTriggers
 * MUST: Call after layout changes, image loads, etc.
 */
export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTriggers
 * MUST: Call when unmounting pages with scroll animations
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Create animation with reduced motion support
 */
export function accessibleAnimation(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars
): gsap.core.Tween | void {
  if (prefersReducedMotion()) {
    // Instant animation
    gsap.set(target, { ...vars, duration: 0, delay: 0 })
    return
  }
  return gsap.to(target, vars)
}
