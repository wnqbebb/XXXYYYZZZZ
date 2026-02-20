"use client";

import React, { 
  useState, 
  useEffect, 
  useCallback, 
  forwardRef,
  ReactNode,
  ButtonHTMLAttributes,
} from "react";
import { useLenis, LenisEasings } from "./useLenis";

// ============================================
// TYPES
// ============================================

export interface ScrollToTopProps 
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Píxeles de scroll antes de mostrar el botón */
  threshold?: number;
  /** Posición en pantalla: bottom-right, bottom-left, bottom-center */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** Offset desde los bordes en píxeles */
  offset?: number;
  /** Duración de la animación de scroll en segundos */
  scrollDuration?: number;
  /** Duración de la animación de fade in/out */
  fadeDuration?: number;
  /** Callback al hacer click */
  onClick?: () => void;
  /** Callback al completar scroll */
  onScrollComplete?: () => void;
  /** Contenido personalizado (icono, texto) */
  children?: ReactNode;
  /** Mostrar siempre (ignorar threshold) */
  alwaysVisible?: boolean;
  /** Clase CSS cuando está visible */
  visibleClassName?: string;
  /** Clase CSS cuando está oculto */
  hiddenClassName?: string;
  /** Deshabilitar smooth scroll (scroll nativo instantáneo) */
  disableSmooth?: boolean;
  /** Easing de la animación */
  easing?: (t: number) => number;
}

// ============================================
// STYLES PREDEFINIDOS
// ============================================

const positionStyles: Record<string, React.CSSProperties> = {
  "bottom-right": {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    zIndex: 50,
  },
  "bottom-left": {
    position: "fixed",
    bottom: "2rem",
    left: "2rem",
    zIndex: 50,
  },
  "bottom-center": {
    position: "fixed",
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
  },
};

// ============================================
// DEFAULT ICON
// ============================================

const DefaultArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

// ============================================
// COMPONENT
// ============================================

/**
 * Botón de Scroll To Top con Lenis
 * 
 * Características:
 * - Aparece después de X píxeles de scroll
 * - Animación suave al hacer click
 * - Posiciones configurables
 * - Accesibilidad completa (ARIA)
 * - Animaciones de entrada/salida
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <ScrollToTop />
 * 
 * // Con threshold personalizado
 * <ScrollToTop threshold={500} />
 * 
 * // Posición personalizada
 * <ScrollToTop position="bottom-left" offset={32} />
 * 
 * // Con icono personalizado
 * <ScrollToTop>
 *   <MyCustomIcon />
 * </ScrollToTop>
 * ```
 */
export const ScrollToTop = forwardRef<HTMLButtonElement, ScrollToTopProps>(
  (
    {
      threshold = 300,
      position = "bottom-right",
      offset,
      scrollDuration = 1.2,
      fadeDuration = 300,
      onClick,
      onScrollComplete,
      children,
      alwaysVisible = false,
      visibleClassName = "opacity-100 translate-y-0",
      hiddenClassName = "opacity-0 translate-y-4 pointer-events-none",
      disableSmooth = false,
      easing = LenisEasings.easeOutExpo,
      className = "",
      style = {},
      ...props
    },
    forwardedRef
  ) => {
    const { scrollTo, scroll, isReady } = useLenis();
    const [isVisible, setIsVisible] = useState(alwaysVisible);

    // ============================================
    // VISIBILITY LOGIC
    // ============================================

    useEffect(() => {
      if (alwaysVisible) {
        setIsVisible(true);
        return;
      }

      const checkScroll = () => {
        const currentScroll = scroll;
        const shouldShow = currentScroll > threshold;
        
        setIsVisible(prev => {
          if (prev !== shouldShow) return shouldShow;
          return prev;
        });
      };

      // Check inicial
      checkScroll();

      // Usar listener nativo como fallback si Lenis no está listo
      const handleNativeScroll = () => {
        const shouldShow = window.scrollY > threshold;
        setIsVisible(shouldShow);
      };

      if (isReady) {
        // Lenis maneja el scroll, usamos el estado reactivo
        checkScroll();
      } else {
        window.addEventListener("scroll", handleNativeScroll, { passive: true });
      }

      return () => {
        window.removeEventListener("scroll", handleNativeScroll);
      };
    }, [scroll, threshold, alwaysVisible, isReady]);

    // ============================================
    // CLICK HANDLER
    // ============================================

    const handleClick = useCallback(() => {
      // Ejecutar callback personalizado
      onClick?.();

      if (disableSmooth || !isReady) {
        // Fallback nativo
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Callback después de aproximadamente 500ms
        if (onScrollComplete) {
          setTimeout(onScrollComplete, 500);
        }
        return;
      }

      // Scroll suave con Lenis
      scrollTo(0, {
        duration: scrollDuration,
        easing,
        immediate: false,
      });

      // Callback después de la duración estimada
      if (onScrollComplete) {
        setTimeout(() => {
          onScrollComplete();
        }, scrollDuration * 1000 + 100);
      }

      // Limpiar hash de URL
      if (window.location.hash && window.history.pushState) {
        window.history.pushState(null, "", window.location.pathname);
      }
    }, [onClick, disableSmooth, isReady, scrollTo, scrollDuration, easing, onScrollComplete]);

    // ============================================
    // KEYBOARD HANDLER
    // ============================================

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick]
    );

    // ============================================
    // STYLES
    // ============================================

    const baseStyles: React.CSSProperties = {
      ...positionStyles[position],
      ...(offset !== undefined && {
        bottom: `${offset}px`,
        ...(position !== "bottom-center" && {
          [position === "bottom-right" ? "right" : "left"]: `${offset}px`,
        }),
      }),
      transition: `opacity ${fadeDuration}ms ease, transform ${fadeDuration}ms ease`,
      ...style,
    };

    // Clases CSS combinadas
    const visibilityClass = isVisible ? visibleClassName : hiddenClassName;
    const finalClassName = `${className} ${visibilityClass}`.trim();

    return (
      <button
        ref={forwardedRef}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={finalClassName}
        style={baseStyles}
        aria-label="Volver arriba"
        aria-hidden={!isVisible}
        tabIndex={isVisible ? 0 : -1}
        type="button"
        {...props}
      >
        {children || <DefaultArrowIcon />}
      </button>
    );
  }
);

ScrollToTop.displayName = "ScrollToTop";

export default ScrollToTop;

// ============================================
// VARIANTES ESPECIALIZADAS
// ============================================

/**
 * Botón de scroll to top con estilo de "fab" (floating action button)
 */
export const FabScrollToTop = forwardRef<HTMLButtonElement, ScrollToTopProps>(
  (props, ref) => (
    <ScrollToTop
      ref={ref}
      className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:shadow-xl hover:scale-110 transition-transform"
      {...props}
    />
  )
);

FabScrollToTop.displayName = "FabScrollToTop";

/**
 * Botón con texto en lugar de icono
 */
export interface TextScrollToTopProps extends ScrollToTopProps {
  text?: string;
}

export const TextScrollToTop = forwardRef<HTMLButtonElement, TextScrollToTopProps>(
  ({ text = "Volver arriba", ...props }, ref) => (
    <ScrollToTop
      ref={ref}
      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full shadow-lg hover:bg-gray-800 transition-colors"
      {...props}
    >
      {text}
    </ScrollToTop>
  )
);

TextScrollToTop.displayName = "TextScrollToTop";

/**
 * Botón mínimo (solo aparece cuando se hace scroll hacia arriba)
 */
export const SmartScrollToTop = forwardRef<HTMLButtonElement, ScrollToTopProps>(
  (props, ref) => {
    const [showOnUp, setShowOnUp] = useState(false);
    const { direction, scroll } = useLenis();
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
      if (direction === -1 && scroll > 500) {
        setShowOnUp(true);
      } else if (direction === 1 || scroll < 100) {
        setShowOnUp(false);
      }
      setLastScrollY(scroll);
    }, [direction, scroll]);

    return (
      <ScrollToTop
        ref={ref}
        {...props}
        alwaysVisible={showOnUp}
      />
    );
  }
);

SmartScrollToTop.displayName = "SmartScrollToTop";
