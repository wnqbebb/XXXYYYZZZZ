"use client";

import React, { 
  useRef, 
  useEffect, 
  useCallback, 
  forwardRef,
  ReactNode,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenisContext } from "./ReactProvider";

// ============================================
// TYPES
// ============================================

export interface HorizontalScrollProps {
  /** Secciones/contenido a scroll horizontal */
  children: ReactNode;
  /** Altura del contenedor (determina duración del scroll) */
  containerHeight?: string;
  /** Velocidad del scroll (1 = normal, 2 = el doble de rápido) */
  scrollSpeed?: number;
  /** Pin el contenedor durante el scroll horizontal */
  pin?: boolean;
  /** Espaciado entre secciones */
  gap?: number;
  /** Padding interno del track */
  padding?: number;
  /** Clase CSS del wrapper */
  className?: string;
  /** Clase CSS del track horizontal */
  trackClassName?: string;
  /** Callback cuando inicia el scroll horizontal */
  onHorizontalStart?: () => void;
  /** Callback cuando termina el scroll horizontal */
  onHorizontalEnd?: () => void;
  /** Callback durante el progreso (0 a 1) */
  onProgress?: (progress: number) => void;
  /** Dirección: normal (izq a der) o reverse */
  direction?: "normal" | "reverse";
  /** Ajustar velocidad a la cantidad de contenido */
  autoAdjustSpeed?: boolean;
  /** Id del trigger para referencia externa */
  triggerId?: string;
  /** Deshabilitar en móvil */
  disableOnMobile?: boolean;
  /** Breakpoint para móvil */
  mobileBreakpoint?: number;
}

export interface HorizontalSectionProps {
  children: ReactNode;
  /** Ancho fijo o auto */
  width?: string | number;
  /** Clase CSS */
  className?: string;
  /** Pin esta sección específica */
  pin?: boolean | number;
  /** ID para referencia */
  id?: string;
}

// ============================================
// COMPONENT: HorizontalSection
// ============================================

/**
 * Sección individual dentro del scroll horizontal
 */
export const HorizontalSection = forwardRef<HTMLDivElement, HorizontalSectionProps>(
  ({ children, width = "100vw", className = "", id }, ref) => {
    const style: React.CSSProperties = {
      width: typeof width === "number" ? `${width}px` : width,
      flexShrink: 0,
      height: "100%",
    };

    return (
      <div
        ref={ref}
        id={id}
        className={`horizontal-section ${className}`}
        style={style}
      >
        {children}
      </div>
    );
  }
);

HorizontalSection.displayName = "HorizontalSection";

// ============================================
// COMPONENT: HorizontalScroll
// ============================================

/**
 * Scroll Horizontal con Lenis y GSAP ScrollTrigger
 * 
 * Transforma scroll vertical en movimiento horizontal.
 * Perfecto para storytelling, portfolios, y presentaciones.
 * 
 * @example
 * ```tsx
 * <HorizontalScroll containerHeight="400vh" pin>
 *   <HorizontalSection width="100vw">
 *     <HeroContent />
 *   </HorizontalSection>
 *   <HorizontalSection width="100vw">
 *     <GalleryContent />
 *   </HorizontalSection>
 *   <HorizontalSection width="50vw">
 *     <FinalContent />
 *   </HorizontalSection>
 * </HorizontalScroll>
 * ```
 */
export const HorizontalScroll = forwardRef<HTMLDivElement, HorizontalScrollProps>(
  (
    {
      children,
      containerHeight = "300vh",
      scrollSpeed = 1,
      pin = true,
      gap = 0,
      padding = 0,
      className = "",
      trackClassName = "",
      onHorizontalStart,
      onHorizontalEnd,
      onProgress,
      direction = "normal",
      autoAdjustSpeed = true,
      triggerId,
      disableOnMobile = true,
      mobileBreakpoint = 768,
    },
    forwardedRef
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<ScrollTrigger | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const { lenis } = useLenisContext();

    // Merge refs
    useEffect(() => {
      if (typeof forwardedRef === "function") {
        forwardedRef(containerRef.current);
      } else if (forwardedRef) {
        forwardedRef.current = containerRef.current;
      }
    }, [forwardedRef]);

    // ============================================
    // MOBILE DETECTION
    // ============================================

    useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < mobileBreakpoint);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }, [mobileBreakpoint]);

    // ============================================
    // HORIZONTAL SCROLL SETUP
    // ============================================

    const setupHorizontalScroll = useCallback(() => {
      if (!containerRef.current || !trackRef.current) return;
      if (disableOnMobile && isMobile) return;

      const container = containerRef.current;
      const track = trackRef.current;

      // Registrar ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Calcular el scroll total necesario
      const trackWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = trackWidth - viewportWidth;

      if (scrollDistance <= 0) return;

      // Ajustar velocidad basado en contenido
      const adjustedSpeed = autoAdjustSpeed 
        ? scrollSpeed * (trackWidth / viewportWidth)
        : scrollSpeed;

      // Crear la animación GSAP
      const tween = gsap.to(track, {
        x: direction === "normal" ? -scrollDistance : scrollDistance,
        ease: "none",
        scrollTrigger: {
          id: triggerId || "horizontal-scroll",
          trigger: container,
          start: "top top",
          end: () => `+=${scrollDistance / adjustedSpeed}`,
          scrub: 1,
          pin: pin,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: onHorizontalStart,
          onLeave: onHorizontalEnd,
          onEnterBack: onHorizontalStart,
          onLeaveBack: onHorizontalEnd,
          onUpdate: (self) => {
            onProgress?.(self.progress);
          },
        },
      });

      triggerRef.current = tween.scrollTrigger as ScrollTrigger;

      // Refresh ScrollTrigger después de montar
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      return () => {
        tween.kill();
        triggerRef.current?.kill();
      };
    }, [
      isMobile,
      disableOnMobile,
      scrollSpeed,
      pin,
      direction,
      autoAdjustSpeed,
      triggerId,
      onHorizontalStart,
      onHorizontalEnd,
      onProgress,
    ]);

    // ============================================
    // EFFECT: Setup
    // ============================================

    useEffect(() => {
      // Delay para asegurar que todo está renderizado
      const timer = setTimeout(() => {
        const cleanup = setupHorizontalScroll();
        
        return () => {
          cleanup?.();
        };
      }, 100);

      return () => clearTimeout(timer);
    }, [setupHorizontalScroll]);

    // ============================================
    // EFFECT: Handle Resize
    // ============================================

    useEffect(() => {
      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // ============================================
    // EFFECT: Sync with Lenis
    // ============================================

    useEffect(() => {
      if (lenis) {
        // Asegurar que ScrollTrigger se actualiza con Lenis
        lenis.on("scroll", ScrollTrigger.update);
      }

      return () => {
        if (lenis) {
          lenis.off("scroll", ScrollTrigger.update);
        }
      };
    }, [lenis]);

    // ============================================
    // RENDER: Mobile fallback
    // ============================================

    if (disableOnMobile && isMobile) {
      return (
        <div className={`horizontal-scroll-mobile ${className}`}>
          {children}
        </div>
      );
    }

    // ============================================
    // RENDER: Desktop horizontal
    // ============================================

    const containerStyle: React.CSSProperties = {
      height: containerHeight,
      position: "relative",
      overflow: "hidden",
    };

    const trackStyle: React.CSSProperties = {
      display: "flex",
      gap: `${gap}px`,
      padding: `0 ${padding}px`,
      height: "100vh",
      width: "max-content",
      willChange: "transform",
    };

    return (
      <div
        ref={containerRef}
        className={`horizontal-scroll-container ${className}`}
        style={containerStyle}
        data-horizontal-scroll
      >
        <div
          ref={trackRef}
          className={`horizontal-scroll-track ${trackClassName}`}
          style={trackStyle}
        >
          {children}
        </div>
      </div>
    );
  }
);

HorizontalScroll.displayName = "HorizontalScroll";

export default HorizontalScroll;

// ============================================
// UTILIDADES PARA HORIZONTAL SCROLL
// ============================================

/**
 * Hook para controlar scroll horizontal programáticamente
 */
export function useHorizontalScroll(triggerId?: string) {
  const scrollToSection = useCallback((index: number) => {
    const trigger = ScrollTrigger.getById(triggerId || "horizontal-scroll");
    if (!trigger) {
      console.warn(`[useHorizontalScroll] Trigger no encontrado: ${triggerId}`);
      return;
    }

    const sections = document.querySelectorAll(".horizontal-section");
    if (!sections[index]) {
      console.warn(`[useHorizontalScroll] Sección ${index} no encontrada`);
      return;
    }

    const progress = index / (sections.length - 1);
    const scrollTo = trigger.start + (trigger.end - trigger.start) * progress;
    
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  }, [triggerId]);

  const getProgress = useCallback(() => {
    const trigger = ScrollTrigger.getById(triggerId || "horizontal-scroll");
    return trigger?.progress || 0;
  }, [triggerId]);

  return {
    scrollToSection,
    getProgress,
  };
}

/**
 * Componente para navegación de dots en horizontal scroll
 */
export interface HorizontalNavProps {
  /** Cantidad de secciones */
  count: number;
  /** Trigger ID del horizontal scroll */
  triggerId?: string;
  /** Clase CSS del contenedor */
  className?: string;
  /** Clase CSS del dot activo */
  activeClassName?: string;
  /** Clase CSS de dots inactivos */
  inactiveClassName?: string;
}

export const HorizontalNav: React.FC<HorizontalNavProps> = ({
  count,
  triggerId,
  className = "",
  activeClassName = "bg-primary",
  inactiveClassName = "bg-gray-300",
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollToSection } = useHorizontalScroll(triggerId);

  useEffect(() => {
    const trigger = ScrollTrigger.getById(triggerId || "horizontal-scroll");
    if (!trigger) return;

    const updateActive = () => {
      const progress = trigger.progress;
      const index = Math.round(progress * (count - 1));
      setActiveIndex(index);
    };

    trigger.vars.onUpdate = updateActive;
    
    return () => {
      trigger.kill();
    };
  }, [triggerId, count]);

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => scrollToSection(i)}
          className={`w-3 h-3 rounded-full transition-colors ${
            i === activeIndex ? activeClassName : inactiveClassName
          }`}
          aria-label={`Ir a sección ${i + 1}`}
          aria-current={i === activeIndex ? "true" : undefined}
        />
      ))}
    </div>
  );
};
