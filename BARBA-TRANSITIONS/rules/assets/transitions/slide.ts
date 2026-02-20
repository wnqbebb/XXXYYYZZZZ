import { gsap } from 'gsap'
import type { TransitionDefinition } from '@barba/core'

/**
 * Slide transition - pushes current page to left, new from right
 * sync: true means both animations run simultaneously
 */
export const slideTransition: TransitionDefinition = {
  name: 'slide',
  sync: true,
  
  leave({ current }) {
    return gsap.to(current.container, {
      x: '-30%',
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    })
  },
  
  enter({ next }) {
    gsap.set(next.container, { x: '30%', opacity: 0 })
    
    return gsap.to(next.container, {
      x: '0%',
      opacity: 1,
      duration: 0.5,
      ease: 'power2.inOut'
    })
  }
}

/**
 * Slide up transition
 */
export const slideUpTransition: TransitionDefinition = {
  name: 'slide-up',
  sync: true,
  
  leave({ current }) {
    return gsap.to(current.container, {
      y: -50,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    })
  },
  
  enter({ next }) {
    gsap.set(next.container, { y: 50, opacity: 0 })
    
    return gsap.to(next.container, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out',
      delay: 0.1
    })
  }
}
