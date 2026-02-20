import React, { useEffect, useState } from 'react';

/**
 * Announce - Componente para anuncios a screen readers
 * 
 * Usa regiones vivas (live regions) para anunciar cambios
 * dinámicos de contenido a tecnologías asistivas.
 * 
 * WCAG 4.1.3 - Status Messages
 * 
 * @example
 * // Anuncio político (no interrumpe)
 * <Announce mode="polite">Se han guardado los cambios</Announce>
 * 
 * // Anuncio asertivo (interrumpe)
 * <Announce mode="assertive" role="alert">Error al guardar</Announce>
 */

interface AnnounceProps {
  /** Mensaje a anunciar */
  children: React.ReactNode;
  /** Modo del anuncio: polite (no interrumpe) o assertive (interrumpe) */
  mode?: 'polite' | 'assertive';
  /** Rol ARIA */
  role?: 'status' | 'alert' | 'log';
  /** Si el contenido debe ser anunciado como unidad completa */
  atomic?: boolean;
  /** Tiempo antes de limpiar el mensaje (ms) */
  clearAfter?: number;
}

export const Announce: React.FC<AnnounceProps> = ({
  children,
  mode = 'polite',
  role = 'status',
  atomic = true,
  clearAfter,
}) => {
  const [message, setMessage] = useState<React.ReactNode>(children);

  useEffect(() => {
    setMessage(children);
    
    if (clearAfter) {
      const timer = setTimeout(() => {
        setMessage('');
      }, clearAfter);
      return () => clearTimeout(timer);
    }
  }, [children, clearAfter]);

  return (
    <div
      role={role}
      aria-live={mode}
      aria-atomic={atomic}
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
      }}
    >
      {message}
    </div>
  );
};

/**
 * Hook para hacer anuncios programáticos
 */
export const useAnnouncer = () => {
  const [announcement, setAnnouncement] = useState<{
    message: string;
    mode: 'polite' | 'assertive';
  } | null>(null);

  const announce = (message: string, mode: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement({ message, mode });
    // Limpiar después de anunciar
    setTimeout(() => setAnnouncement(null), 1000);
  };

  const AnnouncerComponent = () => {
    if (!announcement) return null;
    return (
      <Announce mode={announcement.mode}>
        {announcement.message}
      </Announce>
    );
  };

  return { announce, AnnouncerComponent };
};

export default Announce;
