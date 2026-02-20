/**
 * Configuración centralizada de Lenis Smooth Scroll
 * 
 * Este archivo exporta:
 * - Opciones por defecto para diferentes casos de uso
 * - Tipos personalizados
 * - Constantes (durations, easings)
 * - Helpers de configuración
 */

import type { LenisOptions } from "lenis";

// ============================================
// TIPOS PERSONALIZADOS
// ============================================

/**
 * Opciones extendidas de Lenis con metadatos
 */
export interface LenisConfig extends LenisOptions {
  /** Nombre identificador de esta configuración */
  name?: string;
  /** Descripción del caso de uso */
  description?: string;
  /** Casos de uso recomendados */
  recommendedFor?: string[];
}

/**
 * Presets predefinidos de configuración
 */
export type LenisPreset = 
  | "default"
  | "smooth"
  | "snappy"
  | "cinematic"
  | "minimal"
  | "gaming"
  | "mobile";

/**
 * Dirección de scroll soportada
 */
export type ScrollDirection = "vertical" | "horizontal" | "both";

/**
 * Orientación de gestos
 */
export type GestureOrientation = "vertical" | "horizontal" | "both";

// ============================================
// EASINGS (Funciones de interpolación)
// ============================================

/**
 * Funciones de easing predefinidas
 * Todas reciben t (0 a 1) y retornan valor interpolado (0 a 1)
 */
export const Easings = {
  // === LINEALES ===
  linear: (t: number): number => t,
  
  // === EASE OUT (deceleración) ===
  easeOut: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeOutQuad: (t: number): number => 1 - (1 - t) * (1 - t),
  easeOutCubic: (t: number): number => 1 - Math.pow(1 - t, 3),
  easeOutQuart: (t: number): number => 1 - Math.pow(1 - t, 4),
  easeOutExpo: (t: number): number => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutCirc: (t: number): number => Math.sqrt(1 - Math.pow(t - 1, 2)),
  
  // === EASE IN (aceleración) ===
  easeIn: (t: number): number => t * t * t,
  easeInQuad: (t: number): number => t * t,
  easeInCubic: (t: number): number => t * t * t,
  
  // === EASE IN-OUT ===
  easeInOut: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutCubic: (t: number): number => 
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  easeInOutExpo: (t: number): number => 
    t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
  
  // === ELÁSTICOS ===
  easeOutElastic: (t: number): number => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBack: (t: number): number => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  // === ESPECIALES ===
  /** Easing suave para lectura de contenido */
  reading: (t: number): number => 1 - Math.pow(1 - t, 2.5),
  /** Easing para presentaciones/diapositivas */
  presentation: (t: number): number => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
} as const;

/** Tipo para las funciones de easing disponibles */
export type EasingName = keyof typeof Easings;

// ============================================
// DURACIONES
// ============================================

/**
 * Duraciones predefinidas para scrollTo (en segundos)
 */
export const Durations = {
  /** Instántaneo - sin animación */
  instant: 0,
  /** Muy rápido - 300ms */
  fast: 0.3,
  /** Rápido - 500ms */
  quick: 0.5,
  /** Normal - 800ms */
  normal: 0.8,
  /** Suave - 1.2s */
  smooth: 1.2,
  /** Lento - 1.8s */
  slow: 1.8,
  /** Cinemático - 2.5s */
  cinematic: 2.5,
  /** Storytelling - 3.5s */
  storytelling: 3.5,
} as const;

/** Tipo para las duraciones disponibles */
export type DurationName = keyof typeof Durations;

// ============================================
// CONSTANTES
// ============================================

export const CONSTANTS = {
  /** Valor por defecto de lerp (interpolación) */
  DEFAULT_LERP: 0.1,
  /** Valor mínimo recomendado de lerp */
  MIN_LERP: 0.01,
  /** Valor máximo recomendado de lerp (más alto = más instantáneo) */
  MAX_LERP: 1,
  /** Duración base para scrollTo */
  DEFAULT_SCROLL_DURATION: 1.2,
  /** Offset típico para headers fijos (en píxeles) */
  HEADER_OFFSET: 80,
  /** Offset mínimo recomendado */
  MIN_OFFSET: 20,
  /** Multiplicador de wheel por defecto */
  DEFAULT_WHEEL_MULTIPLIER: 1,
  /** Multiplicador de touch por defecto */
  DEFAULT_TOUCH_MULTIPLIER: 2,
} as const;

// ============================================
// CONFIGURACIONES PRESETS
// ============================================

/**
 * Configuración por defecto - Balance entre suavidad y respuesta
 */
export const defaultConfig: LenisConfig = {
  name: "default",
  description: "Configuración balanceada para la mayoría de casos de uso",
  recommendedFor: ["sitios corporativos", "blogs", "e-commerce"],
  lerp: 0.1,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
};

/**
 * Configuración ultra-suave para experiencias premium
 */
export const smoothConfig: LenisConfig = {
  name: "smooth",
  description: "Scroll muy suave para experiencias premium y portfolios",
  recommendedFor: ["portfolios creativos", "agencias", "landing pages premium"],
  lerp: 0.05,
  duration: 1.5,
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
};

/**
 * Configuración rápida y responsiva
 */
export const snappyConfig: LenisConfig = {
  name: "snappy",
  description: "Scroll rápido y responsivo para aplicaciones web",
  recommendedFor: ["dashboards", "aplicaciones SaaS", " herramientas web"],
  lerp: 0.2,
  duration: 0.6,
  smoothWheel: true,
  wheelMultiplier: 1.2,
  touchMultiplier: 2.5,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
};

/**
 * Configuración cinemática para storytelling
 */
export const cinematicConfig: LenisConfig = {
  name: "cinematic",
  description: "Scroll lento y cinematográfico para storytelling",
  recommendedFor: ["one-page stories", "presentaciones", "experiencias inmersivas"],
  lerp: 0.03,
  duration: 2.5,
  smoothWheel: true,
  wheelMultiplier: 0.6,
  touchMultiplier: 1.2,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
};

/**
 * Configuración mínima - casi desactivado
 */
export const minimalConfig: LenisConfig = {
  name: "minimal",
  description: "Smooth scroll muy sutil, casi imperceptible",
  recommendedFor: ["sitios con mucho contenido", "documentación", "wikipedia-like"],
  lerp: 0.15,
  duration: 0.8,
  smoothWheel: true,
  wheelMultiplier: 1.1,
  touchMultiplier: 2,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
};

/**
 * Configuración para gaming/interactivo
 */
export const gamingConfig: LenisConfig = {
  name: "gaming",
  description: "Scroll preciso para sitios interactivos y gaming",
  recommendedFor: ["sitios de videojuegos", "experiencias interactivas", "galerías 3D"],
  lerp: 0.12,
  duration: 0.5,
  smoothWheel: true,
  wheelMultiplier: 1.5,
  touchMultiplier: 3,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "both",
  normalizeWheel: true,
};

/**
 * Configuración optimizada para móvil
 */
export const mobileConfig: LenisConfig = {
  name: "mobile",
  description: "Optimizada para dispositivos táctiles",
  recommendedFor: ["mobile-first", "PWA", "apps híbridas"],
  lerp: 0.08,
  duration: 0.9,
  smoothWheel: false, // En móvil usamos touch
  wheelMultiplier: 1,
  touchMultiplier: 1.8,
  infinite: false,
  orientation: "vertical",
  gestureOrientation: "vertical",
  normalizeWheel: true,
};

/**
 * Mapa de todas las configuraciones disponibles
 */
export const presets: Record<LenisPreset, LenisConfig> = {
  default: defaultConfig,
  smooth: smoothConfig,
  snappy: snappyConfig,
  cinematic: cinematicConfig,
  minimal: minimalConfig,
  gaming: gamingConfig,
  mobile: mobileConfig,
};

// ============================================
// HELPERS
// ============================================

/**
 * Obtiene una configuración por nombre de preset
 */
export function getPreset(preset: LenisPreset): LenisConfig {
  return presets[preset] || presets.default;
}

/**
 * Crea una configuración personalizada mezclando con un preset base
 */
export function createConfig(
  base: LenisPreset | LenisConfig,
  overrides: Partial<LenisConfig> = {}
): LenisConfig {
  const baseConfig = typeof base === "string" ? getPreset(base) : base;
  return {
    ...baseConfig,
    ...overrides,
    name: overrides.name || `${baseConfig.name}-custom`,
  };
}

/**
 * Determina el mejor preset basado en el tipo de sitio
 */
export function detectBestPreset(siteType: string): LenisPreset {
  const type = siteType.toLowerCase();
  
  if (type.includes("portfolio") || type.includes("creative")) return "smooth";
  if (type.includes("app") || type.includes("dashboard") || type.includes("saas")) return "snappy";
  if (type.includes("story") || type.includes("landing")) return "cinematic";
  if (type.includes("game") || type.includes("interactive")) return "gaming";
  if (type.includes("doc") || type.includes("wiki")) return "minimal";
  if (type.includes("mobile") || type.includes("pwa")) return "mobile";
  
  return "default";
}

/**
 * Calcula el lerp ideal basado en la duración deseada
 * Fórmula aproximada: lerp más bajo = scroll más suave/lento
 */
export function calculateLerp(targetDuration: number): number {
  // Mapeo inverso: duración más larga = lerp más bajo
  if (targetDuration <= 0.5) return 0.2;
  if (targetDuration <= 0.8) return 0.15;
  if (targetDuration <= 1.2) return 0.1;
  if (targetDuration <= 1.8) return 0.07;
  if (targetDuration <= 2.5) return 0.05;
  return 0.03;
}

/**
 * Valida opciones de Lenis y retorna advertencias
 */
export function validateConfig(config: LenisConfig): string[] {
  const warnings: string[] = [];
  
  if (config.lerp && (config.lerp < 0.001 || config.lerp > 1)) {
    warnings.push(`lerp (${config.lerp}) fuera de rango recomendado (0.01 - 1)`);
  }
  
  if (config.duration && config.duration < 0.1) {
    warnings.push(`duration (${config.duration}) muy bajo, puede causar flickering`);
  }
  
  if (config.wheelMultiplier && config.wheelMultiplier > 3) {
    warnings.push(`wheelMultiplier (${config.wheelMultiplier}) muy alto, scroll puede ser difícil de controlar`);
  }
  
  if (config.touchMultiplier && config.touchMultiplier > 5) {
    warnings.push(`touchMultiplier (${config.touchMultiplier}) muy alto para móvil`);
  }
  
  return warnings;
}

// ============================================
// EXPORTS
// ============================================

export default {
  Easings,
  Durations,
  CONSTANTS,
  presets,
  defaultConfig,
  smoothConfig,
  snappyConfig,
  cinematicConfig,
  minimalConfig,
  gamingConfig,
  mobileConfig,
  getPreset,
  createConfig,
  detectBestPreset,
  calculateLerp,
  validateConfig,
};
