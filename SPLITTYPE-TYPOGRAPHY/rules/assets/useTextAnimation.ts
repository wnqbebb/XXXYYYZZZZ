/**
 * useTextAnimation - Hook con animaciones GSAP integradas
 * 
 * Hook avanzado que combina SplitType con GSAP para animaciones de texto
 * listas para usar con presets incluidos.
 * 
 * @example
 * ```tsx
 * const { containerRef, play, reverse } = useTextAnimation({
 *   preset: 'fadeUp',
 *   stagger: 0.02,
 *   duration: 0.8
 * })
 * 
 * // Play animation
 * play()
 * ```
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

// Presets de animación
export type AnimationPreset = 
  | 'fadeUp'
  | 'fadeDown'
  | 'scaleIn'
  | 'rotateX'
  | 'rotateY'
  | 'blurReveal'
  | 'slideLeft'
  | 'slideRight'
  | 'elastic'
  | 'typewriter'

interface AnimationConfig {
  from: gsap.TweenVars
  to: gsap.TweenVars
}

const presets: Record<AnimationPreset, AnimationConfig> = {
  fadeUp: {
    from: { y: 50, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  fadeDown: {
    from: { y: -50, opacity: 0 },
    to: { y: 0, opacity: 1, ease: 'power3.out' }
  },
  scaleIn: {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1, ease: 'back.out(1.7)' }
  },
  rotateX: {
    from: { rotateX: -90, opacity: 0, transformOrigin: 'center bottom' },
    to: { rotateX: 0, opacity: 1, ease: 'power3.out' }
  },
  rotateY: {
    from: { rotateY: 90, opacity: 0, transformOrigin: 'center center' },
    to: { rotateY: 0, opacity: 1, ease: 'power3.out' }
  },
  blurReveal: {
    from: { filter: 'blur(10px)', opacity: 0 },
    to: { filter: 'blur(0px)', opacity: 1, ease: 'power2.out' }
  },
  slideLeft: {
    from: { x: 50, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' }
  },
  slideRight: {
    from: { x: -50, opacity: 0 },
    to: { x: 0, opacity: 1, ease: 'power3.out' }
  },
  elastic: {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1, ease: 'elastic.out(1, 0.5)' }
  },
  typewriter: {
    from: { opacity: 0 },
    to: { opacity: 1, ease: 'none' }
  }
}

interface UseTextAnimationOptions {
  /** Preset de animación */
  preset?: AnimationPreset
  /** Tipos de split */
  types?: 'chars' | 'words' | 'lines' | string
  /** Duración de la animación */
  duration?: number
  /** Stagger entre elementos */
  stagger?: number
  /** Delay inicial */
  delay?: number
  /** Animar caracteres, palabras o líneas */
  animate?: 'chars' | 'words' | 'lines'
  /** Callback al completar */
  onComplete?: () => void
  /** Iniciar automáticamente */
  autoPlay?: boolean
  /** Pausar al salir de viewport */
  pauseOffscreen?: boolean
}

interface UseTextAnimationReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  timelineRef: React.MutableRefObject<gsap.core.Timeline | null>
  play: () => void
  reverse: () => void
  pause: () => void
  resume: () => void
  restart: () => void
  isReady: boolean
  isAnimating: boolean
}

export function useTextAnimation(
  options: UseTextAnimationOptions = {}
): UseTextAnimationReturn {
  const {
    preset = 'fadeUp',
    types = 'words, chars',
    duration = 0.8,
    stagger = 0.02,
    delay = 0,
    animate = 'chars',
    onComplete,
    autoPlay = false,
    pauseOffscreen = false
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)

  // Crear animación
  const createAnimation = useCallback(() => {
    if (!textRef.current) return

    const presetConfig = presets[preset]
    const elements = textRef.current[animate]

    if (!elements || elements.length === 0) return

    // Cleanup anterior
    timelineRef.current?.kill()

    // Crear timeline
    timelineRef.current = gsap.timeline({
      delay,
      onStart: () => setIsAnimating(true),
      onComplete: () => {
        setIsAnimating(false)
        onComplete?.()
      },
      onReverseComplete: () => setIsAnimating(false)
    })

    // Set estado inicial
    gsap.set(elements, presetConfig.from)

    // Animar
    timelineRef.current.to(elements, {
      ...presetConfig.to,
      duration: preset === 'typewriter' ? 0.05 : duration,
      stagger: preset === 'typewriter' ? stagger / 2 : stagger
    })

    if (!autoPlay) {
      timelineRef.current.pause()
    }
  }, [preset, animate, duration, stagger, delay, onComplete, autoPlay])

  // Controladores
  const play = useCallback(() => {
    timelineRef.current?.play()
  }, [])

  const reverse = useCallback(() => {
    timelineRef.current?.reverse()
  }, [])

  const pause = useCallback(() => {
    timelineRef.current?.pause()
  }, [])

  const resume = useCallback(() => {
    timelineRef.current?.resume()
  }, [])

  const restart = useCallback(() => {
    timelineRef.current?.restart()
  }, [])

  // Inicialización
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Crear SplitType
    textRef.current = new SplitType(container, { types })
    setIsReady(true)

    // Crear animación
    createAnimation()

    // Intersection Observer para pausar fuera de viewport
    if (pauseOffscreen) {
      intersectionObserverRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            timelineRef.current?.resume()
          } else {
            timelineRef.current?.pause()
          }
        },
        { threshold: 0 }
      )
      intersectionObserverRef.current.observe(container)
    }

    return () => {
      intersectionObserverRef.current?.disconnect()
      timelineRef.current?.kill()
      textRef.current?.revert()
    }
  }, [createAnimation, types, pauseOffscreen])

  return {
    containerRef,
    timelineRef,
    play,
    reverse,
    pause,
    resume,
    restart,
    isReady,
    isAnimating
  }
}

export default useTextAnimation
