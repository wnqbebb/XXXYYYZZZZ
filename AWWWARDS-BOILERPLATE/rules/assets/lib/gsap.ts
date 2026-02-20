import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * GSAP Plugin Registration
 * MUST import this file BEFORE using GSAP in any component
 * 
 * @example
 * import '@/lib/gsap' // At the top of your component
 */

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Refresh ScrollTrigger on resize
 * MUST call this after layout shifts
 */
export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh()
}

/**
 * Kill all ScrollTriggers
 * MUST call this when unmounting pages with heavy scroll animations
 */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

/**
 * Create a GSAP context with automatic cleanup
 * @example
 * useGSAP(() => {
 *   gsap.to('.element', { x: 100 })
 * }, { scope: container })
 */
export { useGSAP } from "@gsap/react"
