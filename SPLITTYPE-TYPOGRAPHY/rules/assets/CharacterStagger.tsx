/**
 * CharacterStagger - Animación escalonada de caracteres
 * 
 * Componente especializado para animaciones escalonadas de caracteres
 * con múltiples variantes de dirección.
 * 
 * @example
 * ```tsx
 * <CharacterStagger 
 *   direction="fromCenter"
 *   stagger={0.03}
 *   className="text-6xl font-bold"
 * >
 *   ANIMATE
 * </CharacterStagger>
 * ```
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

export type StaggerDirection = 
  | 'start' 
  | 'end' 
  | 'center' 
  | 'edges' 
  | 'random'

export interface CharacterStaggerProps {
  /** Contenido de texto */
  children: string
  /** Dirección del stagger */
  direction?: StaggerDirection
  /** Delay entre caracteres */
  stagger?: number
  /** Duración de cada carácter */
  duration?: number
  /** Delay inicial */
  delay?: number
  /** Distancia de movimiento (para presets con translate) */
  distance?: number
  /** Rotación inicial */
  rotation?: number
  /** Escala inicial */
  scale?: number
  /** Easing */
  ease?: string
  /** Clase CSS */
  className?: string
  /** Preset de animación */
  preset?: 'fadeUp' | 'fadeDown' | 'scale' | 'rotate' | 'wave'
  /** Trigger al entrar en viewport */
  triggerOnView?: boolean
  /** Umbral para trigger */
  viewThreshold?: number
  /** Callback al completar */
  onComplete?: () => void
  /** Repetir animación */
  repeat?: number
  /** Yoyo (ida y vuelta) */
  yoyo?: boolean
  /** Estilos inline */
  style?: React.CSSProperties
}

export const CharacterStagger: React.FC<CharacterStaggerProps> = ({
  children,
  direction = 'start',
  stagger = 0.03,
  duration = 0.6,
  delay = 0,
  distance = 50,
  rotation = 0,
  scale = 1,
  ease = 'power3.out',
  className = '',
  preset = 'fadeUp',
  triggerOnView = false,
  viewThreshold = 0.2,
  onComplete,
  repeat = 0,
  yoyo = false,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [hasPlayed, setHasPlayed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Crear SplitType (solo caracteres)
    textRef.current = new SplitType(container, { 
      types: 'chars',
      charClass: 'stagger-char'
    })

    const chars = textRef.current.chars
    if (!chars || chars.length === 0) return

    // Calcular stagger config según dirección
    const getStaggerConfig = () => {
      const totalChars = chars.length
      
      switch (direction) {
        case 'start':
          return { each: stagger, from: 'start' }
        case 'end':
          return { each: stagger, from: 'end' }
        case 'center':
          return { each: stagger, from: 'center' }
        case 'edges':
          return { each: stagger, from: 'edges' }
        case 'random':
          return { each: stagger, from: 'random' }
        default:
          return { each: stagger, from: 'start' }
      }
    }

    // Calcular from/to según preset
    const getAnimationConfig = () => {
      const configs = {
        fadeUp: {
          from: { y: distance, opacity: 0 },
          to: { y: 0, opacity: 1 }
        },
        fadeDown: {
          from: { y: -distance, opacity: 0 },
          to: { y: 0, opacity: 1 }
        },
        scale: {
          from: { scale: 0, opacity: 0 },
          to: { scale: 1, opacity: 1 }
        },
        rotate: {
          from: { rotation: rotation || 90, opacity: 0, transformOrigin: 'center center' },
          to: { rotation: 0, opacity: 1 }
        },
        wave: {
          from: { y: 0 },
          to: { y: -distance }
        }
      }
      return configs[preset]
    }

    const animConfig = getAnimationConfig()
    const staggerConfig = getStaggerConfig()

    // Crear timeline
    timelineRef.current = gsap.timeline({
      delay,
      paused: triggerOnView,
      repeat,
      yoyo,
      onComplete: () => {
        setHasPlayed(true)
        onComplete?.()
      }
    })

    // Set estado inicial
    gsap.set(chars, animConfig.from)

    // Animar
    if (preset === 'wave') {
      // Wave es especial - animación continua
      timelineRef.current.to(chars, {
        ...animConfig.to,
        duration,
        stagger: staggerConfig,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
      })
    } else {
      timelineRef.current.to(chars, {
        ...animConfig.to,
        duration,
        stagger: staggerConfig,
        ease
      })
    }

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
  }, [children, direction, stagger, duration, delay, distance, rotation, scale, ease, preset, triggerOnView, viewThreshold, onComplete, repeat, yoyo, hasPlayed])

  return (
    <div
      ref={containerRef}
      className={`character-stagger ${className}`}
      style={{
        fontKerning: 'none',
        display: 'inline-block',
        ...style
      }}
    >
      {children}
    </div>
  )
}

CharacterStagger.displayName = 'CharacterStagger'

export default CharacterStagger
