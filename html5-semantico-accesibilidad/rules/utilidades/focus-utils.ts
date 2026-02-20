/**
 * Utilidades de gestión de foco
 * 
 * Funciones para manipular el foco de forma accesible
 */

/**
 * Obtiene todos los elementos enfocables dentro de un contenedor
 */
export const getFocusableElements = (
  container: HTMLElement,
  selector?: string
): HTMLElement[] => {
  const defaultSelector = [
    'button:not([disabled]):not([aria-hidden="true"])',
    'a[href]:not([aria-hidden="true"])',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
    'select:not([disabled]):not([aria-hidden="true"])',
    'textarea:not([disabled]):not([aria-hidden="true"])',
    '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])',
  ].join(', ');

  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(selector || defaultSelector)
  );

  // Filtrar elementos no visibles
  return elements.filter((el) => {
    const style = window.getComputedStyle(el);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      el.offsetParent !== null
    );
  });
};

/**
 * Enfoca el primer elemento enfocable
 */
export const focusFirstElement = (container: HTMLElement): boolean => {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[0].focus();
    return true;
  }
  return false;
};

/**
 * Enfoca el último elemento enfocable
 */
export const focusLastElement = (container: HTMLElement): boolean => {
  const elements = getFocusableElements(container);
  if (elements.length > 0) {
    elements[elements.length - 1].focus();
    return true;
  }
  return false;
};

/**
 * Guarda el elemento actualmente enfocado y retorna función para restaurarlo
 */
export const saveFocus = (): (() => void) => {
  const previousElement = document.activeElement as HTMLElement | null;
  
  return () => {
    if (previousElement && 'focus' in previousElement) {
      previousElement.focus();
    }
  };
};

/**
 * Enfoca un elemento y hace scroll para que sea visible
 */
export const focusAndScroll = (
  element: HTMLElement,
  options?: ScrollIntoViewOptions
): void => {
  element.focus();
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
    ...options,
  });
};

/**
 * Crea un focus trap dentro de un contenedor
 */
export class FocusTrap {
  private container: HTMLElement;
  private previousFocus: Element | null;
  private eventListener: (e: KeyboardEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.previousFocus = null;
    this.eventListener = this.handleKeyDown.bind(this);
  }

  activate(): void {
    this.previousFocus = document.activeElement;
    this.container.addEventListener('keydown', this.eventListener);
    focusFirstElement(this.container);
  }

  deactivate(): void {
    this.container.removeEventListener('keydown', this.eventListener);
    if (this.previousFocus instanceof HTMLElement) {
      this.previousFocus.focus();
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;

    const elements = getFocusableElements(this.container);
    if (elements.length === 0) return;

    const firstElement = elements[0];
    const lastElement = elements[elements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
}

/**
 * Anuncia cambios de foco para debugging
 */
export const announceFocusChange = (
  element: HTMLElement,
  announceFunction?: (message: string) => void
): void => {
  const tagName = element.tagName.toLowerCase();
  const ariaLabel = element.getAttribute('aria-label');
  const textContent = element.textContent?.slice(0, 50) || '';
  
  const message = `Foco en: ${tagName}${
    ariaLabel ? ` (${ariaLabel})` : ''
  } ${textContent}`;
  
  console.log('[Focus]', message);
  announceFunction?.(message);
};

/**
 * Configura un observer para anunciar cambios de foco
 */
export const setupFocusObserver = (
  callback?: (element: HTMLElement) => void
): (() => void) => {
  const handleFocus = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target) {
      callback?.(target);
    }
  };

  document.addEventListener('focusin', handleFocus);
  
  return () => {
    document.removeEventListener('focusin', handleFocus);
  };
};

export default {
  getFocusableElements,
  focusFirstElement,
  focusLastElement,
  saveFocus,
  focusAndScroll,
  FocusTrap,
  announceFocusChange,
  setupFocusObserver,
};
