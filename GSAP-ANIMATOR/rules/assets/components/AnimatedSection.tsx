'use client'

import { useRef, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'scale-in'
  delay?: number
  duration?: number
}

/**
 * AnimatedSection Component
 * Wraps content with scroll-triggered animation
 * 
 * @example
 * <AnimatedSection animation="fade-up" delay={0.2}>
 *   <h2>Section Title</h2>
 *   <p>Content...</p>
 * </AnimatedSection>
 */
export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 0.8,
}: AnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const animations = {
      'fade-up': { y: 50, opacity: 0 },
      'fade-in': { opacity: 0 },
      'slide-left': { x: -50, opacity: 0 },
      'scale-in': { scale: 0.9, opacity: 0 },
    }

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        ...animations[animation],
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })

    return () => ctx.revert()
  }, [animation, delay, duration])

  return (
    <div ref={sectionRef} className={cn(className)}>
      {children}
    </div>
  )
}
