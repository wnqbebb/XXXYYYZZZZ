/**
 * TextReveal - Componente de revelado de texto
 * 
 * Componente con animación de revelado usando GSAP. Soporta múltiples presets
 * y configuraciones de animación.
 * 
 * @example
 * ```tsx
 * <TextReveal 
 *   preset="fadeUp"
 *   stagger={0.02}
 *   duration={0.8}
 *   className="text-5xl font-bold"
 * >
 *   Bienvenido a la experiencia
 * </TextReveal>
 * ```
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

export type TextRevealPreset =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scaleUp'
  | 'scaleDown'
  | 'rotateX'
  | 'rotateY'
  | 'blur'
  | 'clip'

export interface TextRevealProps {
  /** Contenido de texto */
  children: string
  /** Preset de animación */
  preset?: TextRevealPreset
  /** Tipos de split */
  types?: string
  /** Qué animar */
  animate?: 'chars' | 'words' | 'lines'
  /** Duración de la animación */
  duration?: number
  /** Stagger entre elementos */
  stagger?: number
  /** Delay inicial */
  delay?: number
  /** Easing */
  ease?: string
  /** Clase CSS */
  className?: string
  /** Iniciar automáticamente */
  autoPlay?: boolean
  /** Trigger al entrar en viewport */
  triggerOnView?: boolean
  /** Umbral para trigger */
  viewThreshold?: number
  /** Callback al completar */
  onComplete?: () => void
  /** Estilos inline */
  style?: React.CSSProperties
  /** Tag del contenedor */
  as?: keyof JSX.IntrinsicElements
}

const presets: Record<TextRevealPreset, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  fadeUp: {
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeDown: {
    from: { y: -60, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeLeft: {
    from: { x: 60, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeRight: {
    from: { x: -60, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' }
  },
  scaleUp: {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1, ease: 'back.out(1.7)' }
  },
  scaleDown: {
    from: { scale: 1.5, opacity: 0 },
    to: { scale: 1, opacity: 1, ease: 'power3.out' }
  },
  rotateX: {
    from: { rotateX: -90, opacity: 0, transformOrigin: 'center bottom' },
    to: { rotateX: 0, opacity: 1, ease: 'power3.out' }
  },
  rotateY: {
    from: { rotateY: 90, opacity: 0, transformOrigin: 'center center' },
    to: { rotateY: 0, opacity: 1, ease: 'power3.out' }
  },
  blur: {
    from: { filter: 'blur(10px)', opacity: 0 },
    to: { filter: 'blur(0px)', opacity: 1, ease: 'power2.out' }
  },
  clip: {
    from: { clipPath: 'inset(100% 0 0 0)' },
    to: { clipPath: 'inset(0% 0 0 0)', ease: 'power3.out' }
  }
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  preset = 'fadeUp',
  types = 'words, chars',
  animate = 'chars',
  duration = 0.8,
  stagger = 0.02,
  delay = 0,
  ease = 'power3.out',
  className = '',
  autoPlay = true,
  triggerOnView = false,
  viewThreshold = 0.2,
  onComplete,
  style,
  as: Component = 'div'
}) => {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Crear SplitType
    textRef.current = new SplitType(container, { types })
    const elements = textRef.current[animate]

    if (!elements || elements.length === 0) return

    const presetConfig = presets[preset]

    // Crear timeline
    timelineRef.current = gsap.timeline({
      delay,
      paused: !autoPlay || triggerOnView,
      onComplete: () => {
        setHasPlayed(true)
        onComplete?.()
      }
    })

    // Set estado inicial
    gsap.set(elements, presetConfig.from)

    // Animar
    timelineRef.current.to(elements, {
      ...presetConfig.to,
      duration,
      stagger,
      ease
    })

    // Trigger on view
    let observer: IntersectionObserver | null = null
    if (triggerOnView) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasPlayed) {
            timelineRef.current?.play()
            observer?.disconnect()
          }
        },
        { threshold: viewThreshold }
      )
      observer.observe(container)
    }

    return () => {
      observer?.disconnect()
      timelineRef.current?.kill()
      textRef.current?.revert()
    }
  }, [children, preset, types, animate, duration, stagger, delay, ease, autoPlay, triggerOnView, viewThreshold, onComplete, hasPlayed])

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `text-reveal ${className}`,
      style: {
        fontKerning: 'none',
        perspective: '1000px',
        ...style
      }
    },
    children
  )
}

TextReveal.displayName = 'TextReveal'

export default TextReveal
