"use client";

import React, { 
  ReactNode, 
  AnchorHTMLAttributes, 
  forwardRef, 
  useCallback,
  MouseEvent,
  KeyboardEvent,
} from "react";
import { useLenis } from "./useLenis";
import { LenisEasings } from "./useLenis";

// ============================================
// TYPES
// ============================================

export interface SmoothScrollLinkProps 
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Target del scroll (#section-id o elemento) */
  href: string;
  /** Contenido del link */
  children: ReactNode;
  /** Offset en píxeles (útil para headers fijos) */
  offset?: number;
  /** Duración de la animación en segundos */
  duration?: number;
  /** Función de easing personalizada */
  easing?: (t: number) => number;
  /** Forzar scroll inmediato sin animación */
  immediate?: boolean;
  /** Alinear al: start, center, end */
  align?: "start" | "center" | "end";
  /** Callback antes de iniciar el scroll */
  onScrollStart?: () => void;
  /** Callback al completar el scroll */
  onScrollComplete?: () => void;
  /** Deshabilitar el smooth scroll (comportamiento nativo) */
  disableSmooth?: boolean;
  /** Clase CSS activa cuando el target está en viewport */
  activeClassName?: string;
  /** Selector del contenedor del header (para calcular offset dinámico) */
  headerSelector?: string;
  /** Offset adicional para móvil */
  mobileOffset?: number;
}

// ============================================
// COMPONENT
// ============================================

/**
 * Componente Link con Smooth Scroll integrado
 * 
 * Características:
 * - Scroll suave a secciones por ID
 * - Offset automático para headers fijos
 * - Preserva accesibilidad (keyboard navigation)
 * - Soporte para active states
 * - Manejo de hash en URL
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <SmoothScrollLink href="#about">Ir a About</SmoothScrollLink>
 * 
 * // Con offset para header fijo
 * <SmoothScrollLink href="#services" offset={-80}>
 *   Servicios
 * </SmoothScrollLink>
 * 
 * // Con callbacks
 * <SmoothScrollLink 
 *   href="#contact" 
 *   duration={1.5}
 *   onScrollComplete={() => console.log('Llegó a contacto')}
 * >
 *   Contacto
 * </SmoothScrollLink>
 * ```
 */
export const SmoothScrollLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  (
    {
      href,
      children,
      offset = 0,
      duration = 1.2,
      easing = LenisEasings.easeOut,
      immediate = false,
      align = "start",
      onScrollStart,
      onScrollComplete,
      disableSmooth = false,
      activeClassName,
      headerSelector,
      mobileOffset,
      onClick,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const { scrollTo, lenis, isReady } = useLenis();

    /**
     * Calcula el offset final considerando header dinámico y responsive
     */
    const calculateOffset = useCallback((): number => {
      let finalOffset = offset;

      // Offset dinámico basado en header
      if (headerSelector) {
        const header = document.querySelector(headerSelector);
        if (header) {
          finalOffset = -header.getBoundingClientRect().height;
        }
      }

      // Offset diferente para móvil
      if (mobileOffset !== undefined && window.innerWidth < 768) {
        finalOffset = mobileOffset;
      }

      return finalOffset;
    }, [offset, headerSelector, mobileOffset]);

    /**
     * Handler del click
     */
    const handleClick = useCallback(
      (e: MouseEvent<HTMLAnchorElement>) => {
        // Siempre prevenir default para anchors
        if (href.startsWith("#")) {
          e.preventDefault();
        }

        // Ejecutar onClick original si existe
        onClick?.(e);

        // Si smooth está deshabilitado o Lenis no está listo, fallback nativo
        if (disableSmooth || !isReady || !lenis) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }

        // Validar que es un hash link
        if (!href.startsWith("#")) {
          console.warn(`[SmoothScrollLink] href debe empezar con #: ${href}`);
          return;
        }

        const targetId = href.slice(1);
        const targetElement = document.getElementById(targetId);

        if (!targetElement) {
          console.warn(`[SmoothScrollLink] Elemento no encontrado: ${href}`);
          return;
        }

        // Callback de inicio
        onScrollStart?.();

        // Calcular offset final
        const finalOffset = calculateOffset();

        // Ejecutar scroll
        scrollTo(targetElement, {
          offset: finalOffset,
          duration,
          easing,
          immediate,
          align,
        });

        // Actualizar URL hash sin saltar
        if (window.history.pushState) {
          window.history.pushState(null, "", href);
        }

        // Callback de completado (aproximado basado en duración)
        if (onScrollComplete) {
          setTimeout(() => {
            onScrollComplete();
          }, duration * 1000 + 100);
        }
      },
      [
        href,
        disableSmooth,
        isReady,
        lenis,
        onClick,
        onScrollStart,
        calculateOffset,
        scrollTo,
        duration,
        easing,
        immediate,
        align,
        onScrollComplete,
      ]
    );

    /**
     * Handler para keyboard navigation (accesibilidad)
     */
    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLAnchorElement>) => {
        // Activar con Enter o Space
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick(e as unknown as MouseEvent<HTMLAnchorElement>);
        }

        // Ejecutar handler original si existe
        props.onKeyDown?.(e);
      },
      [handleClick, props]
    );

    // Determinar clase activa
    const finalClassName = [className, activeClassName].filter(Boolean).join(" ");

    return (
      <a
        ref={forwardedRef}
        href={href}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={finalClassName}
        role="link"
        tabIndex={0}
        {...props}
      >
        {children}
      </a>
    );
  }
);

SmoothScrollLink.displayName = "SmoothScrollLink";

export default SmoothScrollLink;

// ============================================
// VARIANTES ESPECIALIZADAS
// ============================================

/**
 * Link optimizado para navegación con header fijo
 */
export interface NavLinkProps extends Omit<SmoothScrollLinkProps, "offset"> {
  /** Altura del header para offset automático */
  headerHeight?: number;
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ headerHeight = 80, ...props }, ref) => (
    <SmoothScrollLink
      ref={ref}
      offset={-headerHeight}
      duration={1}
      {...props}
    />
  )
);

NavLink.displayName = "NavLink";

/**
 * Link para tabs de sección con scroll rápido
 */
export const TabLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  (props, ref) => (
    <SmoothScrollLink
      ref={ref}
      duration={0.6}
      easing={LenisEasings.easeOutExpo}
      {...props}
    />
  )
);

TabLink.displayName = "TabLink";

/**
 * Link con efecto de scroll "lento" para revelar contenido
 */
export const SlowScrollLink = forwardRef<HTMLAnchorElement, SmoothScrollLinkProps>(
  (props, ref) => (
    <SmoothScrollLink
      ref={ref}
      duration={2}
      easing={LenisEasings.easeInOut}
      {...props}
    />
  )
);

SlowScrollLink.displayName = "SlowScrollLink";
