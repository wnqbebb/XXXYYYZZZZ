import { useState, useEffect } from 'react';

/**
 * Hook para detectar preferencia de movimiento reducido
 * 
 * WCAG 2.3.3 - Animation from Interactions
 * Respetar prefers-reduced-motion es esencial para usuarios
 * con trastornos vestibulares.
 * 
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * 
 * return (
 *   <motion.div
 *     animate={prefersReducedMotion ? {} : { scale: 1.2 }}
 *   />
 * );
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Escuchar cambios
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Variantes de animación seguras para movimiento reducido
 */
export const useAccessibleAnimations = () => {
  const prefersReducedMotion = useReducedMotion();

  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: prefersReducedMotion 
        ? { duration: 0 } 
        : { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: prefersReducedMotion 
        ? { duration: 0 } 
        : { duration: 0.2 }
    },
  };

  const slideVariants = {
    hidden: { 
      opacity: 0,
      x: prefersReducedMotion ? 0 : -20 
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: prefersReducedMotion 
        ? { duration: 0 } 
        : { duration: 0.3, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0,
      x: prefersReducedMotion ? 0 : 20,
      transition: prefersReducedMotion 
        ? { duration: 0 } 
        : { duration: 0.2 }
    },
  };

  const scaleVariants = {
    hidden: { 
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: prefersReducedMotion 
        ? { duration: 0 } 
        : { duration: 0.2 }
    },
    exit: { 
      opacity: 0,
      scale: prefersReducedMotion ? 1 : 0.95,
      transition: prefersReducedMotion 
        ? { duration: 0 } 
        : { duration: 0.2 }
    },
  };

  return {
    prefersReducedMotion,
    fadeVariants,
    slideVariants,
    scaleVariants,
  };
};

/**
 * CSS para desactivar animaciones cuando el usuario lo prefiere
 * Agregar esto al CSS global
 */
export const getReducedMotionStyles = (): string => `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export default useReducedMotion;
