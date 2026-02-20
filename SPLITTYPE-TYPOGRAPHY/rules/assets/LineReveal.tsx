/**
 * LineReveal - Revelado de líneas
 * 
 * Componente para animaciones de revelado a nivel de línea.
 * Ideal para párrafos y bloques de texto.
 * 
 * @example
 * ```tsx
 * <LineReveal 
 *   preset="slideUp"
 *   stagger={0.15}
 *   className="text-lg leading-relaxed"
 * >
 *   Este es un párrafo largo que se revelará línea por línea,
 *   creando un efecto elegante y profesional para el contenido.
 * </LineReveal>
 * ```
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

export type LineRevealPreset =
  | 'fadeUp'
  | 'fadeDown'
  | 'slideUp'
  | 'slideDown'
  | 'clip'
  | 'mask'
  | 'blur'
  | 'width'

export interface LineRevealProps {
  /** Contenido de texto */
  children: string
  /** Preset de animación */
  preset?: LineRevealPreset
  /** Duración de cada línea */
  duration?: number
  /** Stagger entre líneas */
  stagger?: number
  /** Delay inicial */
  delay?: number
  /** Easing */
  ease?: string
  /** Clase CSS */
  className?: string
  /** Clase para cada línea */
  lineClassName?: string
  /** Clase para el wrapper de línea */
  lineWrapperClassName?: string
  /** Trigger al entrar en viewport */
  triggerOnView?: boolean
  /** Umbral para trigger */
  viewThreshold?: number
  /** Callback al completar */
  onComplete?: () => void
  /** Callback por línea */
  onLine?: (line: string, index: number) => void
  /** Re-split en resize */
  observeResize?: boolean
  /** Estilos inline */
  style?: React.CSSProperties
  /** Tag del contenedor */
  as?: keyof JSX.IntrinsicElements
}

const presets: Record<LineRevealPreset, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
  fadeUp: {
    from: { y: 30, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeDown: {
    from: { y: -30, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  slideUp: {
    from: { yPercent: 100 },
    to: { yPercent: 0, ease: 'power3.out' }
  },
  slideDown: {
    from: { yPercent: -100 },
    to: { yPercent: 0, ease: 'power3.out' }
  },
  clip: {
    from: { clipPath: 'inset(0 0 100% 0)' },
    to: { clipPath: 'inset(0 0 0% 0)', ease: 'power3.out' }
  },
  mask: {
    from: { yPercent: 100 },
    to: { yPercent: 0, ease: 'power3.out' }
  },
  blur: {
    from: { filter: 'blur(5px)', opacity: 0 },
    to: { filter: 'blur(0px)', opacity: 1, ease: 'power2.out' }
  },
  width: {
    from: { scaleX: 0, transformOrigin: 'left center' },
    to: { scaleX: 1, ease: 'power3.out' }
  }
}

export const LineReveal: React.FC<LineRevealProps> = ({
  children,
  preset = 'slideUp',
  duration = 0.8,
  stagger = 0.1,
  delay = 0,
  ease = 'power3.out',
  className = '',
  lineClassName = '',
  lineWrapperClassName = '',
  triggerOnView = false,
  viewThreshold = 0.2,
  onComplete,
  onLine,
  observeResize = true,
  style,
  as: Component = 'div'
}) => {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const previousWidthRef = useRef<number>(0)
  const [hasPlayed, setHasPlayed] = useState(false)

  // Crear split
  const createSplit = useCallback(() => {
    if (!containerRef.current) return

    // Cleanup anterior
    if (textRef.current) {
      textRef.current.revert()
    }

    // Crear SplitType (solo líneas)
    textRef.current = new SplitType(containerRef.current, { 
      types: 'lines',
      lineClass: `line-reveal-line ${lineClassName}`
    })

    previousWidthRef.current = containerRef.current.offsetWidth

    const lines = textRef.current.lines
    if (!lines || lines.length === 0) return

    const presetConfig = presets[preset]

    // Para presets mask/slide, envolver líneas en overflow:hidden
    if (preset === 'mask' || preset === 'slideUp' || preset === 'slideDown') {
      lines.forEach(line => {
        const wrapper = document.createElement('div')
        wrapper.className = `line-reveal-wrapper ${lineWrapperClassName}`
        wrapper.style.overflow = 'hidden'
        wrapper.style.display = 'block'
        
        line.parentNode?.insertBefore(wrapper, line)
        wrapper.appendChild(line)
      })
    }

    // Crear timeline
    timelineRef.current?.kill()
    timelineRef.current = gsap.timeline({
      delay,
      paused: triggerOnView && !hasPlayed,
      onComplete: () => {
        setHasPlayed(true)
        onComplete?.()
      }
    })

    // Set estado inicial
    gsap.set(lines, presetConfig.from)

    // Animar con callback por línea
    lines.forEach((line, index) => {
      timelineRef.current?.to(line, {
        ...presetConfig.to,
        duration,
        ease,
        onStart: () => {
          onLine?.(line.textContent || '', index)
        }
      }, index * stagger)
    })

    // Play si no es trigger on view o ya ha jugado
    if (!triggerOnView || hasPlayed) {
      timelineRef.current.play()
    }
  }, [preset, duration, stagger, delay, ease, lineClassName, lineWrapperClassName, triggerOnView, hasPlayed, onComplete, onLine])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Crear split inicial
    createSplit()

    // ResizeObserver
    if (observeResize) {
      let timeoutId: ReturnType<typeof setTimeout>

      const handleResize = (entries: ResizeObserverEntry[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          const [entry] = entries
          const width = Math.floor(entry.contentRect.width)

          if (previousWidthRef.current !== width) {
            // Recrear todo el split y animación
            timelineRef.current?.kill()
            createSplit()
          }
        }, 100)
      }

      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(container)
    }

    // Trigger on view
    let observer: IntersectionObserver | null = null
    if (triggerOnView && !hasPlayed) {
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
      resizeObserverRef.current?.disconnect()
      timelineRef.current?.kill()
      textRef.current?.revert()
    }
  }, [createSplit, observeResize, triggerOnView, viewThreshold, hasPlayed])

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `line-reveal ${className}`,
      style: {
        fontKerning: 'none',
        ...style
      }
    },
    children
  )
}

LineReveal.displayName = 'LineReveal'

export default LineReveal
