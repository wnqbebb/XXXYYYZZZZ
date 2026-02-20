import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  /** Si es true, el elemento es visible en foco (útil para skip links) */
  focusable?: boolean;
}

/**
 * VisuallyHidden - Oculta contenido visualmente pero mantiene accesibilidad
 * 
 * Útil para proporcionar contexto adicional a screen readers
 * sin afectar el diseño visual.
 * 
 * @example
 * <button>
 *   <VisuallyHidden>Agregar al carrito:</VisuallyHidden>
 *   <span>Producto XYZ</span>
 * </button>
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({
  children,
  focusable = false,
}) => {
  return (
    <span
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
        ...(focusable && {
          ':focus': {
            position: 'fixed',
            top: 0,
            left: 0,
            width: 'auto',
            height: 'auto',
            padding: '8px 16px',
            margin: 0,
            clip: 'auto',
            background: '#000',
            color: '#fff',
            zIndex: 10000,
          },
        }),
      }}
    >
      {children}
    </span>
  );
};

/**
 * Hook para crear estilos de visually hidden
 */
export const useVisuallyHiddenStyles = () => {
  return {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  } as React.CSSProperties;
};

export default VisuallyHidden;
