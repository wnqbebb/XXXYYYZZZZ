/**
 * WordReveal - Revelado de palabras
 * 
 * Componente para animaciones de revelado a nivel de palabra.
 * Ideal para títulos y headlines.
 * 
 * @example
 * ```tsx
 * <WordReveal 
 *   preset="slideUp"
 *   stagger={0.1}
 *   className="text-4xl font-bold"
 * >
 *   Cada palabra cuenta una historia
 * </WordReveal>
 * ```
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

export type WordRevealPreset =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scaleUp'
  | 'scaleDown'
  | 'slideUp'
  | 'slideDown'
  | 'clip'
  | 'blur'

export interface WordRevealProps {
  /** Contenido de texto */
  children: string
  /** Preset de animación */
  preset?: WordRevealPreset
  /** Duración de cada palabra */
  duration?: number
  /** Stagger entre palabras */
  stagger?: number
  /** Delay inicial */
  delay?: number
  /** Distancia de movimiento */
  distance?: number
  /** Easing */
  ease?: string
  /** Clase CSS */
  className?: string
  /** Clase para cada palabra */
  wordClassName?: string
  /** Trigger al entrar en viewport */
  triggerOnView?: boolean
  /** Umbral para trigger */
  viewThreshold?: number
  /** Callback al completar */
  onComplete?: () => void
  /** Callback por palabra */
  onWord?: (word: string, index: number) => void
  /** Estilos inline */
  style?: React.CSSProperties
  /** Tag del contenedor */
  as?: keyof JSX.IntrinsicElements
}

const presets: Record<WordRevealPreset, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  fadeUp: {
    from: { y: 40, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeDown: {
    from: { y: -40, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeLeft: {
    from: { x: 40, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeRight: {
    from: { x: -40, opacity: 0 },
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
  slideUp: {
    from: { yPercent: 100, opacity: 0 },
    to: { yPercent: 0, opacity: 1, ease: 'power3.out' }
  },
  slideDown: {
    from: { yPercent: -100, opacity: 0 },
    to: { yPercent: 0, opacity: 1, ease: 'power3.out' }
  },
  clip: {
    from: { clipPath: 'inset(0 100% 0 0)' },
    to: { clipPath: 'inset(0 0% 0 0)', ease: 'power3.out' }
  },
  blur: {
    from: { filter: 'blur(8px)', opacity: 0 },
    to: { filter: 'blur(0px)', opacity: 1, ease: 'power2.out' }
  }
}

export const WordReveal: React.FC<WordRevealProps> = ({
  children,
  preset = 'fadeUp',
  duration = 0.6,
  stagger = 0.08,
  delay = 0,
  distance = 40,
  ease = 'power3.out',
  className = '',
  wordClassName = '',
  triggerOnView = false,
  viewThreshold = 0.2,
  onComplete,
  onWord,
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

    // Crear SplitType (solo palabras)
    textRef.current = new SplitType(container, { 
      types: 'words',
      wordClass: `word-reveal-word ${wordClassName}`
    })

    const words = textRef.current.words
    if (!words || words.length === 0) return

    const presetConfig = presets[preset]

    // Ajustar configuración según preset
    let fromConfig = { ...presetConfig.from }
    if (preset === 'fadeUp' || preset === 'fadeDown') {
      fromConfig = { ...fromConfig, y: preset === 'fadeUp' ? distance : -distance }
    } else if (preset === 'fadeLeft' || preset === 'fadeRight') {
      fromConfig = { ...fromConfig, x: preset === 'fadeLeft' ? distance : -distance }
    }

    // Crear timeline
    timelineRef.current = gsap.timeline({
      delay,
      paused: triggerOnView,
      onComplete: () => {
        setHasPlayed(true)
        onComplete?.()
      }
    })

    // Set estado inicial
    gsap.set(words, fromConfig)

    // Animar con callback por palabra
    words.forEach((word, index) => {
      timelineRef.current?.to(word, {
        ...presetConfig.to,
        duration,
        ease,
        onStart: () => {
          onWord?.(word.textContent || '', index)
        }
      }, index * stagger)
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
  }, [children, preset, duration, stagger, delay, distance, ease, wordClassName, triggerOnView, viewThreshold, onComplete, onWord, hasPlayed])

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `word-reveal ${className}`,
      style: {
        fontKerning: 'none',
        overflow: 'hidden',
        ...style
      }
    },
    children
  )
}

WordReveal.displayName = 'WordReveal'

export default WordReveal
