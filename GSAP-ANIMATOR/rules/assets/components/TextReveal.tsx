'use client'

import { useRef, useEffect } from 'react'
import SplitType from 'split-type'
import { gsap } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  children: string
  className?: string
  type?: 'chars' | 'words' | 'lines'
  stagger?: number
  duration?: number
}

/**
 * TextReveal Component
 * Animates text with character/word/line reveal
 * 
 * @example
 * <TextReveal type="chars" stagger={0.02}>
 *   Hello World
 * </TextReveal>
 */
export function TextReveal({
  children,
  className,
  type = 'chars',
  stagger = 0.02,
  duration = 0.8,
}: TextRevealProps) {
  const textRef = useRef<HTMLDivElement>(null)
  const splitRef = useRef<SplitType | null>(null)

  useEffect(() => {
    if (!textRef.current) return

    // Split text
    splitRef.current = new SplitType(textRef.current, {
      types: type,
    })

    // Animate
    const elements = splitRef.current[type] as HTMLElement[]
    
    gsap.from(elements, {
      y: 100,
      opacity: 0,
      stagger,
      duration,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
      },
    })

    return () => {
      splitRef.current?.revert()
    }
  }, [children, type, stagger, duration])

  return (
    <div ref={textRef} className={cn(className)}>
      {children}
    </div>
  )
}
