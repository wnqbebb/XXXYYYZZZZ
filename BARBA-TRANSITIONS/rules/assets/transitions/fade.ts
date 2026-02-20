import { gsap } from 'gsap'
import type { TransitionDefinition } from '@barba/core'

/**
 * Simple fade transition
 * Usage: Import and add to barba.init transitions array
 */
export const fadeTransition: TransitionDefinition = {
  name: 'fade',
  
  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  },
  
  enter({ next }) {
    return gsap.from(next.container, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  }
}

/**
 * Fade with slight scale
 */
export const fadeScaleTransition: TransitionDefinition = {
  name: 'fade-scale',
  
  leave({ current }) {
    return gsap.to(current.container, {
      opacity: 0,
      scale: 0.98,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  },
  
  enter({ next }) {
    gsap.set(next.container, { scale: 1.02 })
    
    return gsap.to(next.container, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.inOut'
    })
  }
}
