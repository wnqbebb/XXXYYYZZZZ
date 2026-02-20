"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  useCallback,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ============================================
// TYPES
// ============================================

export interface LenisContextType {
  /** Instancia de Lenis para acceso directo */
  lenis: Lenis | null;
  /** Indica si Lenis está inicializado y listo */
  isReady: boolean;
  /** Pausa el smooth scroll */
  pause: () => void;
  /** Reanuda el smooth scroll */
  resume: () => void;
  /** Detiene Lenis completamente */
  destroy: () => void;
  /** Reinicia Lenis con nuevas opciones */
  refresh: () => void;
}

interface LenisProviderProps {
  children: ReactNode;
  /** Opciones de configuración de Lenis */
  options?: Omit<LenisOptions, "wrapper" | "content">;
  /** Altura del header fijo para offset automático */
  headerOffset?: number;
  /** Deshabilitar integración con GSAP ScrollTrigger */
  disableGsapIntegration?: boolean;
  /** Callback cuando Lenis está listo */
  onReady?: (lenis: Lenis) => void;
}

interface LenisOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
  orientation?: "vertical" | "horizontal";
  gestureOrientation?: "vertical" | "horizontal" | "both";
  normalizeWheel?: boolean;
}

// ============================================
// CONTEXT
// ============================================

const LenisContext = createContext<LenisContextType | null>(null);

export const useLenisContext = (): LenisContextType => {
  const context = useContext(LenisContext);
  if (!context) {
    throw new Error("useLenisContext debe usarse dentro de LenisProvider");
  }
  return context;
};

// ============================================
// PROVIDER COMPONENT
// ============================================

/**
 * Provider de React para Lenis Smooth Scroll
 * 
 * Características:
 * - Inicialización automática de Lenis
 * - Integración nativa con GSAP ScrollTrigger
 * - Manejo de cleanup correcto
 * - Compatible con Next.js App Router
 * - Soporte para header offset
 * 
 * @example
 * ```tsx
 * // layout.tsx
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="es">
 *       <body>
 *         <LenisProvider headerOffset={80}>
 *           {children}
 *         </LenisProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function LenisProvider({
  children,
  options = {},
  headerOffset = 0,
  disableGsapIntegration = false,
  onReady,
}: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [isReady, setIsReady] = useState(false);
  const rafIdRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  // Default options optimizadas para producción
  const defaultOptions: LenisOptions = {
    lerp: 0.1,              // Interpolación suave (0.1 = suave, 1 = instantáneo)
    duration: 1.2,          // Duración base de animaciones
    smoothWheel: true,      // Habilitar smooth scroll en wheel
    wheelMultiplier: 1,     // Multiplicador de velocidad de wheel
    touchMultiplier: 2,     // Multiplicador de velocidad de touch
    infinite: false,        // Scroll infinito (para carruseles)
    orientation: "vertical",
    gestureOrientation: "vertical",
    normalizeWheel: true,   // Normalizar eventos de wheel entre navegadores
  };

  const mergedOptions = { ...defaultOptions, ...options };

  /**
   * Inicializa Lenis y configura integraciones
   */
  const initLenis = useCallback(() => {
    // Prevenir múltiples inicializaciones
    if (lenisRef.current) return;

    const lenis = new Lenis({
      ...mergedOptions,
    });

    lenisRef.current = lenis;

    // ============================================
    // GSAP ScrollTrigger Integration
    // ============================================
    if (!disableGsapIntegration && typeof window !== "undefined") {
      // Registrar plugin si no está registrado
      gsap.registerPlugin(ScrollTrigger);

      // Sincronizar Lenis con ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Usar gsap.ticker para el loop de animación
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      // Deshabilitar lag smoothing de GSAP para mejor rendimiento
      gsap.ticker.lagSmoothing(0);
    } else {
      // Loop alternativo sin GSAP
      const raf = (time: number) => {
        lenis.raf(time);
        rafIdRef.current = requestAnimationFrame(raf);
      };
      rafIdRef.current = requestAnimationFrame(raf);
    }

    // Configurar offset automático para anchors
    if (headerOffset > 0) {
      lenis.on("scroll", ({ scroll, limit }: { scroll: number; limit: number }) => {
        // Store scroll position for global access
        (window as Window & { __lenisScroll?: number; __lenisLimit?: number }).__lenisScroll = scroll;
        (window as Window & { __lenisScroll?: number; __lenisLimit?: number }).__lenisLimit = limit;
      });
    }

    setIsReady(true);
    onReady?.(lenis);

    // eslint-disable-next-line no-console
    console.log("[Lenis] Initialized successfully");
  }, [mergedOptions, headerOffset, disableGsapIntegration, onReady]);

  /**
   * Limpia y destruye la instancia de Lenis
   */
  const destroyLenis = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (lenisRef.current) {
      // Remover de GSAP ticker si existe
      if (!disableGsapIntegration) {
        gsap.ticker.remove((time) => {
          lenisRef.current?.raf(time * 1000);
        });
      }

      lenisRef.current.destroy();
      lenisRef.current = null;
      setIsReady(false);

      // eslint-disable-next-line no-console
      console.log("[Lenis] Destroyed");
    }
  }, [disableGsapIntegration]);

  // Inicializar en mount
  useEffect(() => {
    initLenis();

    // Cleanup en unmount
    return () => {
      destroyLenis();
    };
  }, [initLenis, destroyLenis]);

  // ============================================
  // PUBLIC API
  // ============================================

  const pause = useCallback(() => {
    if (lenisRef.current && !isPausedRef.current) {
      lenisRef.current.stop();
      isPausedRef.current = true;
    }
  }, []);

  const resume = useCallback(() => {
    if (lenisRef.current && isPausedRef.current) {
      lenisRef.current.start();
      isPausedRef.current = false;
    }
  }, []);

  const destroy = useCallback(() => {
    destroyLenis();
  }, [destroyLenis]);

  const refresh = useCallback(() => {
    destroyLenis();
    // Pequeño delay para asegurar cleanup completo
    setTimeout(() => {
      initLenis();
    }, 0);
  }, [destroyLenis, initLenis]);

  const contextValue: LenisContextType = {
    lenis: lenisRef.current,
    isReady,
    pause,
    resume,
    destroy,
    refresh,
  };

  return (
    <LenisContext.Provider value={contextValue}>
      {children}
    </LenisContext.Provider>
  );
}

export default LenisProvider;
