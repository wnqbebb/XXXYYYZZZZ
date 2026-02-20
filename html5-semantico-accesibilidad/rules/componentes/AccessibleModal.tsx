import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface AccessibleModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  /** Función para cerrar el modal */
  onClose: () => void;
  /** Título del modal (para aria-labelledby) */
  title: string;
  /** Contenido del modal */
  children: React.ReactNode;
  /** Descripción adicional (para aria-describedby) */
  description?: string;
  /** Si cerrar al hacer click en el overlay */
  closeOnOverlayClick?: boolean;
  /** Si cerrar con Escape */
  closeOnEscape?: boolean;
  /** Elemento a enfocar inicialmente (default: primer elemento enfocable) */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** Ref del elemento que abrió el modal (para retornar foco) */
  triggerRef?: React.RefObject<HTMLElement>;
}

/**
 * AccessibleModal - Modal completamente accesible
 * 
 * Características:
 * - Trap focus dentro del modal
 * - Cierra con Escape
 * - Retorna foco al trigger
 * - Aria attributes correctos
 * - Portal para evitar problemas de z-index
 * 
 * WCAG:
 * - 2.1.2 No Keyboard Trap
 * - 2.4.3 Focus Order
 * - 2.4.7 Focus Visible
 * 
 * @example
 * <AccessibleModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirmar acción"
 *   description="¿Estás seguro de que deseas continuar?"
 * >
 *   <p>Contenido del modal...</p>
 * </AccessibleModal>
 */
export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  description,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  initialFocusRef,
  triggerRef,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).substr(2, 9)}`);
  const descriptionId = useRef(`modal-desc-${Math.random().toString(36).substr(2, 9)}`);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Guardar elemento enfocado antes de abrir
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Restaurar foco al cerrar
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Focus trap y escape
  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    // Enfocar elemento inicial
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else {
      const focusableElements = getFocusableElements(modal);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        modal.focus();
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        e.preventDefault();
        onClose();
      }

      if (e.key === 'Tab') {
        handleTabKey(e, modal);
      }
    };

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, closeOnEscape, initialFocusRef]);

  const handleTabKey = (e: KeyboardEvent, modal: HTMLDivElement) => {
    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

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
  };

  const getFocusableElements = (element: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(element.querySelectorAll(focusableSelectors)).filter(
      (el) => {
        // Filtrar elementos no visibles
        const style = window.getComputedStyle(el as Element);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }
    ) as HTMLElement[];
  };

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && closeOnOverlayClick) {
        onClose();
      }
    },
    [closeOnOverlayClick, onClose]
  );

  if (!isOpen) return null;

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId.current}
        aria-describedby={description ? descriptionId.current : undefined}
        tabIndex={-1}
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '24px',
          position: 'relative',
          outline: 'none',
        }}
      >
        <header style={{ marginBottom: '16px' }}>
          <h2 id={titleId.current} style={{ margin: 0 }}>
            {title}
          </h2>
          {description && (
            <p id={descriptionId.current} style={{ margin: '8px 0 0' }}>
              {description}
            </p>
          )}
        </header>

        <div>{children}</div>

        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '4px 8px',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AccessibleModal;
