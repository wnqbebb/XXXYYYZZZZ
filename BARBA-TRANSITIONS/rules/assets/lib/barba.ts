import barba from '@barba/core'
import barbaPrefetch from '@barba/prefetch'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Initialize Barba with GSAP transitions
 * MUST: Call this once in your app entry point
 * 
 * @example
 * // app/layout.tsx or _app.tsx
 * import { initBarba } from '@/lib/barba'
 * 
 * useEffect(() => {
 *   initBarba()
 * }, [])
 */
export function initBarba() {
  // Register prefetch plugin
  barba.use(barbaPrefetch, {
    delay: 50,
    limit: 5
  })

  // Initialize Barba
  barba.init({
    debug: process.env.NODE_ENV === 'development',
    
    transitions: [
      {
        name: 'default-fade',
        
        once({ next }) {
          // Initial page load animation
          gsap.from(next.container, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          })
        },
        
        beforeLeave({ current }) {
          // Cleanup current page ScrollTriggers
          ScrollTrigger.getAll().forEach(st => {
            if (st.vars.trigger && current.container.contains(st.vars.trigger as Element)) {
              st.kill()
            }
          })
          
          // Kill tweens
          gsap.killTweensOf(current.container.querySelectorAll('*'))
        },
        
        leave({ current }) {
          // Fade out current page
          return gsap.to(current.container, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.inOut'
          })
        },
        
        beforeEnter({ next }) {
          // Prepare new page
          gsap.set(next.container, { opacity: 0 })
          window.scrollTo(0, 0)
        },
        
        enter({ next }) {
          // Fade in new page
          return gsap.to(next.container, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut'
          })
        },
        
        afterEnter({ next }) {
          // Refresh ScrollTrigger for new content
          ScrollTrigger.refresh()
          
          // Dispatch custom event for page load
          window.dispatchEvent(new CustomEvent('pageload', {
            detail: { namespace: next.namespace }
          }))
        }
      }
    ]
  })
}

/**
 * Navigate programmatically
 * @param href - URL to navigate to
 */
export function navigateTo(href: string) {
  barba.go(href)
}

/**
 * Get current namespace
 */
export function getCurrentNamespace(): string | null {
  return barba.data.current.namespace
}
