"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Lenis from "lenis";
import { useLenisContext } from "./ReactProvider";

// ============================================
// TYPES
// ============================================

export type LenisEventCallback = (e: LenisEvent) => void;

export interface LenisEvent {
  /** Posición actual del scroll */
  scroll: number;
  /** Posición objetivo del scroll */
  target: number;
  /** Velocidad actual del scroll */
  velocity: number;
  /** Dirección del scroll: 1 = abajo, -1 = arriba, 0 = quieto */
  direction: number;
  /** Límite máximo de scroll */
  limit: number;
  /** Progreso del scroll (0 a 1) */
  progress: number;
}

export interface UseLenisOptions {
  /** Callback ejecutado en cada frame de scroll */
  onScroll?: LenisEventCallback;
  /** Callback cuando el scroll se detiene */
  onScrollEnd?: LenisEventCallback;
  /** Callback cuando inicia un scroll programático */
  onScrollStart?: LenisEventCallback;
  /** Ejecutar callback inmediatamente al montar */
  immediate?: boolean;
}

export interface UseLenisReturn {
  /** Instancia de Lenis (null si no está listo) */
  lenis: Lenis | null;
  /** Indica si Lenis está inicializado */
  isReady: boolean;
  /** Posición actual del scroll */
  scroll: number;
  /** Velocidad actual del scroll */
  velocity: number;
  /** Dirección del scroll: 1 | -1 | 0 */
  direction: number;
  /** Función para hacer scroll a un elemento o posición */
  scrollTo: (
    target: string | number | HTMLElement,
    options?: ScrollToOptions
  ) => void;
  /** Suscribirse a eventos de scroll manualmente */
  on: (event: LenisEventName, callback: LenisEventCallback) => () => void;
}

export type LenisEventName = "scroll" | "scrollend" | "scrollstart";

export interface ScrollToOptions {
  /** Offset en píxeles (útil para headers fijos) */
  offset?: number;
  /** Duración de la animación en segundos */
  duration?: number;
  /** Tipo de easing: lineal o función personalizada */
  easing?: (t: number) => number;
  /** Forzar scroll inmediato sin animación */
  immediate?: boolean;
  /** Alinear elemento: start, center, end */
  align?: "start" | "center" | "end";
}

// ============================================
// EASING PRESETS
// ============================================

export const LenisEasings = {
  /** Lineal - sin easing */
  linear: (t: number) => t,
  /** Ease out suave */
  easeOut: (t: number) => 1 - Math.pow(1 - t, 3),
  /** Ease in-out suave */
  easeInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  /** Ease out exponencial - más pronunciado */
  easeOutExpo: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  /** Ease elástico suave */
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
} as const;

// ============================================
// HOOK PRINCIPAL
// ============================================

/**
 * Hook personalizado para interactuar con Lenis
 * 
 * Características:
 * - Acceso a la instancia de Lenis
 * - Suscripción a eventos de scroll
 * - Función scrollTo tipada
 * - Estado reactivo del scroll
 * 
 * @example
 * ```tsx
 * // Uso básico
 * const { lenis, scrollTo } = useLenis();
 * 
 * // Con callbacks
 * useLenis({
 *   onScroll: (e) => console.log('Scroll:', e.scroll),
 *   onScrollEnd: () => console.log('Scroll ended'),
 * });
 * 
 * // Scroll programático
 * scrollTo('#section', { offset: -80, duration: 1.5 });
 * ```
 */
export function useLenis(options: UseLenisOptions = {}): UseLenisReturn {
  const { lenis: contextLenis, isReady: contextIsReady } = useLenisContext();
  
  // Estado local para valores reactivos
  const [scrollState, setScrollState] = useState({
    scroll: 0,
    velocity: 0,
    direction: 0,
  });

  // Refs para callbacks (evitar re-suscripciones)
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const callbacksRef = useRef({
    onScroll: null as ((e: LenisEvent) => void) | null,
    onScrollEnd: null as ((e: LenisEvent) => void) | null,
    onScrollStart: null as ((e: LenisEvent) => void) | null,
  });

  // ============================================
  // SUSCRIPCIÓN A EVENTOS
  // ============================================

  useEffect(() => {
    if (!contextLenis || !contextIsReady) return;

    const lenis = contextLenis;

    // Handler principal de scroll
    const handleScroll = (e: LenisEvent) => {
      setScrollState({
        scroll: e.scroll,
        velocity: e.velocity,
        direction: e.direction,
      });
      optionsRef.current.onScroll?.(e);
      callbacksRef.current.onScroll?.(e);
    };

    // Handler de scroll end
    const handleScrollEnd = (e: LenisEvent) => {
      optionsRef.current.onScrollEnd?.(e);
      callbacksRef.current.onScrollEnd?.(e);
    };

    // Handler de scroll start
    const handleScrollStart = (e: LenisEvent) => {
      optionsRef.current.onScrollStart?.(e);
      callbacksRef.current.onScrollStart?.(e);
    };

    // Suscribir a eventos
    lenis.on("scroll", handleScroll);
    lenis.on("scrollend", handleScrollEnd);
    lenis.on("scrollstart", handleScrollStart);

    // Ejecutar immediate si se solicita
    if (optionsRef.current.immediate) {
      handleScroll({
        scroll: lenis.scroll,
        target: lenis.targetScroll,
        velocity: lenis.velocity,
        direction: lenis.direction,
        limit: lenis.limit,
        progress: lenis.progress,
      });
    }

    // Cleanup
    return () => {
      lenis.off("scroll", handleScroll);
      lenis.off("scrollend", handleScrollEnd);
      lenis.off("scrollstart", handleScrollStart);
    };
  }, [contextLenis, contextIsReady]);

  // ============================================
  // MÉTODOS PÚBLICOS
  // ============================================

  /**
   * Navega a un target con opciones
   */
  const scrollTo = useCallback(
    (target: string | number | HTMLElement, opts: ScrollToOptions = {}) => {
      if (!contextLenis) {
        console.warn("[useLenis] Lenis no está inicializado");
        return;
      }

      const {
        offset = 0,
        duration = 1.2,
        easing = LenisEasings.easeOut,
        immediate = false,
        align,
      } = opts;

      let finalTarget: string | number | HTMLElement = target;

      // Calcular offset adicional basado en align
      if (align && typeof target !== "number") {
        const element = typeof target === "string" 
          ? document.querySelector(target) 
          : target;
        
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          switch (align) {
            case "center":
              finalTarget = rect.top + contextLenis.scroll - (viewportHeight / 2) + (rect.height / 2);
              break;
            case "end":
              finalTarget = rect.top + contextLenis.scroll - viewportHeight + rect.height;
              break;
            case "start":
            default:
              finalTarget = rect.top + contextLenis.scroll;
              break;
          }
        }
      }

      contextLenis.scrollTo(finalTarget, {
        offset,
        duration: immediate ? 0 : duration * 1000,
        easing,
        immediate,
      });
    },
    [contextLenis]
  );

  /**
   * Suscribirse manualmente a eventos
   */
  const on = useCallback(
    (event: LenisEventName, callback: LenisEventCallback) => {
      if (!contextLenis) {
        console.warn("[useLenis] Lenis no está inicializado");
        return () => {};
      }

      // Guardar en callbacksRef para persistencia
      if (event === "scroll") callbacksRef.current.onScroll = callback;
      if (event === "scrollend") callbacksRef.current.onScrollEnd = callback;
      if (event === "scrollstart") callbacksRef.current.onScrollStart = callback;

      contextLenis.on(event, callback);

      // Retornar función de cleanup
      return () => {
        contextLenis.off(event, callback);
        if (event === "scroll") callbacksRef.current.onScroll = null;
        if (event === "scrollend") callbacksRef.current.onScrollEnd = null;
        if (event === "scrollstart") callbacksRef.current.onScrollStart = null;
      };
    },
    [contextLenis]
  );

  return {
    lenis: contextLenis,
    isReady: contextIsReady,
    scroll: scrollState.scroll,
    velocity: scrollState.velocity,
    direction: scrollState.direction,
    scrollTo,
    on,
  };
}

export default useLenis;
