/**
 * useSplitTextReveal - Hook para revelado de texto al scroll
 * 
 * Hook especializado para animaciones de revelado de texto con ScrollTrigger.
 * Incluye soporte para scrub, pin y toggle actions.
 * 
 * @example
 * ```tsx
 * const { containerRef } = useSplitTextReveal({
 *   preset: 'fadeUp',
 *   scrollTrigger: {
 *     trigger: '.section',
 *     start: 'top 80%',
 *     end: 'top 20%',
 *     scrub: 1
 *   }
 * })
 * ```
 */

import { useEffect, useRef, useCallback } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Registrar ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export type RevealPreset =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeLeft'
  | 'fadeRight'
  | 'scaleUp'
  | 'clipReveal'
  | 'maskReveal'
  | 'blurIn'

interface ScrollTriggerConfig {
  /** Elemento trigger (default: el contenedor) */
  trigger?: string | Element
  /** Punto de inicio */
  start?: string
  /** Punto de fin */
  end?: string
  /** Scrub (suavizado) */
  scrub?: boolean | number
  /** Pin el elemento */
  pin?: boolean
  /** Toggle actions */
  toggleActions?: string
  /** Callbacks */
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

interface UseSplitTextRevealOptions {
  /** Preset de revelado */
  preset?: RevealPreset
  /** Tipos de split */
  types?: string
  /** Qué animar: chars, words o lines */
  animate?: 'chars' | 'words' | 'lines'
  /** Duración (ignorado si scrub) */
  duration?: number
  /** Stagger entre elementos */
  stagger?: number
  /** Configuración de ScrollTrigger */
  scrollTrigger: ScrollTriggerConfig
  /** Easing (ignorado si scrub) */
  ease?: string
  /** Markers para debug */
  markers?: boolean
  /** Delay inicial */
  delay?: number
}

interface UseSplitTextRevealReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  scrollTriggerRef: React.MutableRefObject<ScrollTrigger | null>
  animationRef: React.MutableRefObject<gsap.core.Tween | gsap.core.Timeline | null>
  refresh: () => void
  kill: () => void
}

export function useSplitTextReveal(
  options: UseSplitTextRevealOptions
): UseSplitTextRevealReturn {
  const {
    preset = 'fadeUp',
    types = 'words, chars',
    animate = 'chars',
    duration = 1,
    stagger = 0.02,
    scrollTrigger: scrollTriggerConfig,
    ease = 'power2.out',
    markers = false,
    delay = 0
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)

  // Configuraciones de presets
  const getPresetConfig = useCallback(() => {
    const configs: Record<RevealPreset, { from: gsap.TweenVars; to: gsap.TweenVars }> = {
      fadeUp: {
        from: { y: 50, opacity: 0 },
        to: { y: 0, opacity: 1 }
      },
      fadeDown: {
        from: { y: -50, opacity: 0 },
        to: { y: 0, opacity: 1 }
      },
      fadeLeft: {
        from: { x: 50, opacity: 0 },
        to: { x: 0, opacity: 1 }
      },
      fadeRight: {
        from: { x: -50, opacity: 0 },
        to: { x: 0, opacity: 1 }
      },
      scaleUp: {
        from: { scale: 0, opacity: 0 },
        to: { scale: 1, opacity: 1 }
      },
      clipReveal: {
        from: { clipPath: 'inset(0 100% 0 0)' },
        to: { clipPath: 'inset(0 0% 0 0)' }
      },
      maskReveal: {
        from: { yPercent: 100 },
        to: { yPercent: 0 }
      },
      blurIn: {
        from: { filter: 'blur(10px)', opacity: 0 },
        to: { filter: 'blur(0px)', opacity: 1 }
      }
    }
    return configs[preset]
  }, [preset])

  // Crear animación
  const createAnimation = useCallback(() => {
    if (!textRef.current || !containerRef.current) return

    const elements = textRef.current[animate]
    if (!elements || elements.length === 0) return

    const config = getPresetConfig()

    // Cleanup anterior
    animationRef.current?.kill()
    scrollTriggerRef.current?.kill()

    // Configurar ScrollTrigger
    const stConfig: ScrollTrigger.Vars = {
      trigger: scrollTriggerConfig.trigger || containerRef.current,
      start: scrollTriggerConfig.start || 'top 80%',
      end: scrollTriggerConfig.end,
      scrub: scrollTriggerConfig.scrub,
      pin: scrollTriggerConfig.pin,
      toggleActions: scrollTriggerConfig.toggleActions || 'play none none none',
      markers,
      onEnter: scrollTriggerConfig.onEnter,
      onLeave: scrollTriggerConfig.onLeave,
      onEnterBack: scrollTriggerConfig.onEnterBack,
      onLeaveBack: scrollTriggerConfig.onLeaveBack
    }

    // Set estado inicial
    gsap.set(elements, config.from)

    // Crear animación
    if (scrollTriggerConfig.scrub) {
      // Animación con scrub
      animationRef.current = gsap.to(elements, {
        ...config.to,
        scrollTrigger: stConfig,
        stagger: scrollTriggerConfig.scrub ? stagger : undefined
      })
    } else {
      // Animación con toggle actions
      animationRef.current = gsap.to(elements, {
        ...config.to,
        duration,
        delay,
        ease,
        stagger,
        scrollTrigger: stConfig
      })
    }

    scrollTriggerRef.current = ScrollTrigger.getById(
      animationRef.current.scrollTrigger?.vars.id as string
    ) || ScrollTrigger.getAll().find(st => st.trigger === stConfig.trigger) || null
  }, [animate, duration, delay, ease, stagger, markers, scrollTriggerConfig, getPresetConfig])

  // Refresh
  const refresh = useCallback(() => {
    ScrollTrigger.refresh()
  }, [])

  // Kill
  const kill = useCallback(() => {
    animationRef.current?.kill()
    scrollTriggerRef.current?.kill()
    textRef.current?.revert()
  }, [])

  // Inicialización
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Esperar a que el DOM esté listo
    const init = () => {
      textRef.current = new SplitType(container, { types })
      createAnimation()
    }

    // Usar requestAnimationFrame para asegurar layout completo
    requestAnimationFrame(init)

    return () => {
      animationRef.current?.kill()
      scrollTriggerRef.current?.kill()
      textRef.current?.revert()
    }
  }, [createAnimation, types])

  return {
    containerRef,
    scrollTriggerRef,
    animationRef,
    refresh,
    kill
  }
}

export default useSplitTextReveal
