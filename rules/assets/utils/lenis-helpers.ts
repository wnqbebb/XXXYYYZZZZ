/**
 * Utilidades y Helpers para Lenis Smooth Scroll
 * 
 * Funciones de utilidad para casos de uso comunes:
 * - scrollToSection con offset inteligente
 * - scrollToTop
 * - pause/resume helpers
 * - Detección de Lenis
 */

import type Lenis from "lenis";
import { Easings, Durations, CONSTANTS } from "../lenis.config";

// ============================================
// TYPES
// ============================================

export interface ScrollToSectionOptions {
  /** Offset adicional en píxeles */
  offset?: number;
  /** Duración de la animación en segundos */
  duration?: number;
  /** Función de easing */
  easing?: (t: number) => number;
  /** Scroll inmediato sin animación */
  immediate?: boolean;
  /** Callback al completar */
  onComplete?: () => void;
  /** Callback al iniciar */
  onStart?: () => void;
  /** Forzar scroll nativo si Lenis no está disponible */
  fallbackToNative?: boolean;
}

export interface ScrollToTopOptions {
  /** Duración de la animación en segundos */
  duration?: number;
  /** Función de easing */
  easing?: (t: number) => number;
  /** Callback al completar */
  onComplete?: () => void;
  /** Forzar scroll nativo */
  fallbackToNative?: boolean;
}

export interface HeaderOffsetOptions {
  /** Selector CSS del header */
  selector?: string;
  /** Offset fijo alternativo */
  fixedOffset?: number;
  /** Offset adicional (margen) */
  additionalOffset?: number;
  /** Recalcular en resize */
  recalculateOnResize?: boolean;
}

// ============================================
// DETECCIÓN Y ACCESO
// ============================================

/**
 * Verifica si Lenis está activo e inicializado
 */
export function isLenisActive(): boolean {
  if (typeof window === "undefined") return false;
  
  // Verificar instancia global (si se expone)
  const globalLenis = (window as Window & { __lenis?: Lenis }).__lenis;
  if (globalLenis) return true;
  
  // Verificar por data attribute
  const lenisElement = document.querySelector('[data-lenis]');
  if (lenisElement) return true;
  
  return false;
}

/**
 * Obtiene la instancia de Lenis si está disponible
 * Retorna null si Lenis no está inicializado
 */
export function getLenisInstance(): Lenis | null {
  if (typeof window === "undefined") return null;
  return (window as Window & { __lenis?: Lenis }).__lenis || null;
}

/**
 * Obtiene información del estado actual de scroll
 */
export function getScrollInfo(): {
  scroll: number;
  limit: number;
  progress: number;
  velocity: number;
  direction: number;
} | null {
  if (typeof window === "undefined") return null;
  
  const lenis = getLenisInstance();
  if (lenis) {
    return {
      scroll: lenis.scroll,
      limit: lenis.limit,
      progress: lenis.progress,
      velocity: lenis.velocity,
      direction: lenis.direction,
    };
  }
  
  // Fallback nativo
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return {
    scroll: window.scrollY,
    limit: docHeight,
    progress: docHeight > 0 ? window.scrollY / docHeight : 0,
    velocity: 0,
    direction: 0,
  };
}

// ============================================
// SCROLL TO SECTION
// ============================================

/**
 * Hace scroll a una sección con offset inteligente
 * 
 * @param target - Selector CSS, ID con #, o elemento HTML
 * @param options - Opciones de scroll
 * 
 * @example
 * ```typescript
 * // Básico
 * scrollToSection('#about');
 * 
 * // Con offset para header
 * scrollToSection('#services', { 
 *   offset: -80,
 *   duration: 1.5 
 * });
 * 
 * // Con callback
 * scrollToSection('#contact', {
 *   onComplete: () => console.log('Llegó!')
 * });
 * ```
 */
export function scrollToSection(
  target: string | HTMLElement,
  options: ScrollToSectionOptions = {}
): void {
  const {
    offset = 0,
    duration = Durations.smooth,
    easing = Easings.easeOut,
    immediate = false,
    onComplete,
    onStart,
    fallbackToNative = true,
  } = options;

  if (typeof window === "undefined") return;

  // Resolver elemento target
  let element: HTMLElement | null;
  
  if (typeof target === "string") {
    // Remover # si existe
    const selector = target.startsWith("#") ? target : `#${target}`;
    element = document.querySelector(selector);
    
    // Intentar como selector CSS completo
    if (!element && !target.startsWith("#")) {
      element = document.querySelector(target);
    }
  } else {
    element = target;
  }

  if (!element) {
    console.warn(`[lenis-helpers] Elemento no encontrado: ${target}`);
    return;
  }

  // Ejecutar callback de inicio
  onStart?.();

  // Intentar usar Lenis
  const lenis = getLenisInstance();
  
  if (lenis) {
    lenis.scrollTo(element, {
      offset,
      duration: immediate ? 0 : duration * 1000,
      easing,
      immediate,
    });
    
    if (onComplete) {
      setTimeout(onComplete, immediate ? 0 : duration * 1000 + 50);
    }
    return;
  }

  // Fallback nativo
  if (fallbackToNative) {
    const rect = element.getBoundingClientRect();
    const targetY = window.scrollY + rect.top + offset;
    
    window.scrollTo({
      top: targetY,
      behavior: immediate ? "auto" : "smooth",
    });
    
    if (onComplete) {
      setTimeout(onComplete, immediate ? 0 : 500);
    }
  }
}

/**
 * Calcula el offset automáticamente basado en un header fijo
 */
export function calculateHeaderOffset(
  options: HeaderOffsetOptions = {}
): number {
  const {
    selector = "header",
    fixedOffset,
    additionalOffset = 0,
  } = options;

  if (typeof window === "undefined") return CONSTANTS.HEADER_OFFSET;

  // Usar offset fijo si se proporciona
  if (fixedOffset !== undefined) {
    return -fixedOffset - additionalOffset;
  }

  // Calcular dinámicamente
  const header = document.querySelector(selector);
  if (header) {
    const headerHeight = header.getBoundingClientRect().height;
    return -headerHeight - additionalOffset;
  }

  // Default fallback
  return -CONSTANTS.HEADER_OFFSET - additionalOffset;
}

/**
 * Scroll a sección con offset de header automático
 */
export function scrollToSectionWithHeader(
  target: string | HTMLElement,
  headerOptions: HeaderOffsetOptions = {},
  scrollOptions: Omit<ScrollToSectionOptions, "offset"> = {}
): void {
  const offset = calculateHeaderOffset(headerOptions);
  scrollToSection(target, { ...scrollOptions, offset });
}

// ============================================
// SCROLL TO TOP
// ============================================

/**
 * Hace scroll al inicio de la página
 * 
 * @example
 * ```typescript
 * // Básico
 * scrollToTop();
 * 
 * // Con duración personalizada
 * scrollToTop({ duration: 2 });
 * 
 * // Con callback
 * scrollToTop({ onComplete: () => console.log('En el top!') });
 * ```
 */
export function scrollToTop(options: ScrollToTopOptions = {}): void {
  const {
    duration = Durations.smooth,
    easing = Easings.easeOutExpo,
    onComplete,
    fallbackToNative = true,
  } = options;

  if (typeof window === "undefined") return;

  const lenis = getLenisInstance();

  if (lenis) {
    lenis.scrollTo(0, {
      duration: duration * 1000,
      easing,
    });
  } else if (fallbackToNative) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Limpiar hash de URL
  if (window.location.hash && window.history.pushState) {
    window.history.pushState(null, "", window.location.pathname);
  }

  if (onComplete) {
    setTimeout(onComplete, duration * 1000 + 50);
  }
}

/**
 * Determina si estamos lo suficientemente abajo como para mostrar "scroll to top"
 */
export function shouldShowScrollToTop(threshold: number = 500): boolean {
  const info = getScrollInfo();
  return info ? info.scroll > threshold : window.scrollY > threshold;
}

// ============================================
// PAUSE / RESUME
// ============================================

/**
 * Pausa temporalmente el smooth scroll de Lenis
 * Útil para modales, overlays, o cuando se necesita scroll nativo
 */
export function pauseLenis(): void {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Reanuda el smooth scroll de Lenis
 */
export function resumeLenis(): void {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.start();
  }
}

/**
 * Toggle del estado de pausa de Lenis
 * Retorna true si está pausado después del toggle
 */
export function toggleLenis(): boolean {
  const lenis = getLenisInstance();
  if (!lenis) return false;

  // Lenis no expone estado directamente, usamos tracking externo
  const isPaused = (window as Window & { __lenisPaused?: boolean }).__lenisPaused;
  
  if (isPaused) {
    lenis.start();
    (window as Window & { __lenisPaused?: boolean }).__lenisPaused = false;
    return false;
  } else {
    lenis.stop();
    (window as Window & { __lenisPaused?: boolean }).__lenisPaused = true;
    return true;
  }
}

/**
 * Ejecuta una función con Lenis pausado temporalmente
 */
export function withLenisPaused<T>(fn: () => T): T {
  pauseLenis();
  try {
    const result = fn();
    return result;
  } finally {
    resumeLenis();
  }
}

// ============================================
// REFRESH Y SYNC
// ============================================

/**
 * Fuerza un recálculo de las dimensiones de Lenis
 * Útil después de cambios dinámicos en el DOM
 */
export function refreshLenis(): void {
  const lenis = getLenisInstance();
  if (lenis) {
    lenis.resize();
  }
}

/**
 * Actualiza ScrollTrigger y Lenis
 * Útil después de cargar imágenes o contenido dinámico
 */
export function syncScroll(): void {
  refreshLenis();
  
  // Trigger resize event para ScrollTrigger
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("resize"));
  }
}

// ============================================
// UTILIDADES DE SCROLL
// ============================================

/**
 * Calcula la posición de scroll para centrar un elemento
 */
export function calculateCenterScroll(
  element: HTMLElement,
  offset: number = 0
): number {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const elementCenter = rect.top + rect.height / 2;
  const viewportCenter = viewportHeight / 2;
  
  return window.scrollY + elementCenter - viewportCenter + offset;
}

/**
 * Scroll a un elemento centrado en viewport
 */
export function scrollToCenter(
  target: string | HTMLElement,
  offset: number = 0,
  duration: number = Durations.smooth
): void {
  if (typeof window === "undefined") return;

  let element: HTMLElement | null;
  
  if (typeof target === "string") {
    element = document.querySelector(target);
  } else {
    element = target;
  }

  if (!element) {
    console.warn(`[lenis-helpers] Elemento no encontrado: ${target}`);
    return;
  }

  const targetY = calculateCenterScroll(element, offset);
  const lenis = getLenisInstance();

  if (lenis) {
    lenis.scrollTo(targetY, {
      duration: duration * 1000,
      easing: Easings.easeOut,
    });
  } else {
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }
}

/**
 * Bloquea el scroll de la página
 */
export function lockScroll(): void {
  if (typeof document === "undefined") return;
  
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.dataset.scrollY = scrollY.toString();
  
  pauseLenis();
}

/**
 * Desbloquea el scroll de la página
 */
export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  
  const scrollY = document.body.dataset.scrollY || "0";
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, parseInt(scrollY));
  delete document.body.dataset.scrollY;
  
  resumeLenis();
}

// ============================================
// LISTENERS
// ============================================

export type ScrollCallback = (info: {
  scroll: number;
  limit: number;
  progress: number;
  velocity: number;
  direction: number;
}) => void;

/**
 * Suscribe a eventos de scroll de Lenis
 * Retorna función para unsubscribe
 */
export function onLenisScroll(callback: ScrollCallback): () => void {
  const lenis = getLenisInstance();
  
  if (lenis) {
    const handler = (e: { scroll: number; limit: number; progress: number; velocity: number; direction: number }) => {
      callback({
        scroll: e.scroll,
        limit: e.limit,
        progress: e.progress,
        velocity: e.velocity,
        direction: e.direction,
      });
    };
    
    lenis.on("scroll", handler);
    return () => lenis.off("scroll", handler);
  }
  
  // Fallback nativo
  let rafId: number;
  let lastScroll = window.scrollY;
  
  const nativeHandler = () => {
    const currentScroll = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    callback({
      scroll: currentScroll,
      limit: docHeight,
      progress: docHeight > 0 ? currentScroll / docHeight : 0,
      velocity: currentScroll - lastScroll,
      direction: currentScroll > lastScroll ? 1 : currentScroll < lastScroll ? -1 : 0,
    });
    
    lastScroll = currentScroll;
    rafId = requestAnimationFrame(nativeHandler);
  };
  
  rafId = requestAnimationFrame(nativeHandler);
  
  return () => cancelAnimationFrame(rafId);
}

// ============================================
// EXPORTS
// ============================================

export default {
  isLenisActive,
  getLenisInstance,
  getScrollInfo,
  scrollToSection,
  calculateHeaderOffset,
  scrollToSectionWithHeader,
  scrollToTop,
  shouldShowScrollToTop,
  pauseLenis,
  resumeLenis,
  toggleLenis,
  withLenisPaused,
  refreshLenis,
  syncScroll,
  calculateCenterScroll,
  scrollToCenter,
  lockScroll,
  unlockScroll,
  onLenisScroll,
};
