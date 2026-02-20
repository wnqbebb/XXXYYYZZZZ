import { useCallback, useRef, useEffect } from 'react';

interface FocusManagerOptions {
  /** Contenedor para limitar la búsqueda de elementos enfocables */
  containerRef?: React.RefObject<HTMLElement>;
  /** Elemento a enfocar inicialmente */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Si debe hacer focus trap */
  trapFocus?: boolean;
}

/**
 * Hook para gestionar el foco en componentes accesibles
 * 
 * @example
 * const { focusFirst, focusLast, focusNext, focusPrevious, focusableElements } = useFocusManager({
 *   containerRef: modalRef,
 *   trapFocus: true,
 * });
 */
export const useFocusManager = (options: FocusManagerOptions = {}) => {
  const { containerRef, initialFocusRef, trapFocus } = options;
  const focusableRefs = useRef<HTMLElement[]>([]);

  const FOCUSABLE_SELECTORS = [
    'button:not([disabled]):not([aria-hidden="true"])',
    'a[href]:not([aria-hidden="true"])',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
    'select:not([disabled]):not([aria-hidden="true"])',
    'textarea:not([disabled]):not([aria-hidden="true"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
  ].join(', ');

  /**
   * Obtiene todos los elementos enfocables dentro del contenedor
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    const container = containerRef?.current;
    if (!container) {
      return [];
    }

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter((el) => {
      // Filtrar elementos no visibles
      const style = window.getComputedStyle(el);
      return (
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        el.offsetParent !== null
      );
    });

    focusableRefs.current = elements;
    return elements;
  }, [containerRef]);

  /**
   * Enfoca el primer elemento enfocable
   */
  const focusFirst = useCallback((): boolean => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[0].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  /**
   * Enfoca el último elemento enfocable
   */
  const focusLast = useCallback((): boolean => {
    const elements = getFocusableElements();
    if (elements.length > 0) {
      elements[elements.length - 1].focus();
      return true;
    }
    return false;
  }, [getFocusableElements]);

  /**
   * Enfoca el siguiente elemento
   */
  const focusNext = useCallback((): boolean => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(
      (el) => el === document.activeElement
    );

    if (currentIndex >= 0 && currentIndex < elements.length - 1) {
      elements[currentIndex + 1].focus();
      return true;
    }
    
    // Si está en el último y trapFocus está activo, volver al primero
    if (trapFocus && currentIndex === elements.length - 1) {
      elements[0].focus();
      return true;
    }
    
    return false;
  }, [getFocusableElements, trapFocus]);

  /**
   * Enfoca el elemento anterior
   */
  const focusPrevious = useCallback((): boolean => {
    const elements = getFocusableElements();
    const currentIndex = elements.findIndex(
      (el) => el === document.activeElement
    );

    if (currentIndex > 0) {
      elements[currentIndex - 1].focus();
      return true;
    }
    
    // Si está en el primero y trapFocus está activo, ir al último
    if (trapFocus && currentIndex === 0) {
      elements[elements.length - 1].focus();
      return true;
    }
    
    return false;
  }, [getFocusableElements, trapFocus]);

  /**
   * Enfoca un elemento específico por índice
   */
  const focusAtIndex = useCallback(
    (index: number): boolean => {
      const elements = getFocusableElements();
      if (index >= 0 && index < elements.length) {
        elements[index].focus();
        return true;
      }
      return false;
    },
    [getFocusableElements]
  );

  /**
   * Guarda el elemento actualmente enfocado
   */
  const saveFocus = useCallback((): (() => void) => {
    const previousElement = document.activeElement as HTMLElement;
    
    return () => {
      if (previousElement && 'focus' in previousElement) {
        previousElement.focus();
      }
    };
  }, []);

  /**
   * Maneja el evento Tab con focus trap
   */
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus) return;

      const elements = getFocusableElements();
      if (elements.length === 0) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements, trapFocus]
  );

  // Efecto para enfocar elemento inicial
  useEffect(() => {
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }
  }, [initialFocusRef]);

  return {
    getFocusableElements,
    focusableElements: focusableRefs.current,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    focusAtIndex,
    saveFocus,
    handleTabKey,
  };
};

export default useFocusManager;
