import React from 'react';

interface SkipLinkProps {
  /** ID del elemento al que saltar */
  targetId: string;
  /** Texto del enlace */
  children?: React.ReactNode;
  /** Clase CSS adicional */
  className?: string;
}

/**
 * SkipLink - Enlace para saltar al contenido principal
 * 
 * WCAG 2.4.1 - Bypass Blocks
 * Permite a usuarios de teclado saltar navegación repetitiva
 * 
 * @example
 * <SkipLink targetId="main-content">Saltar al contenido principal</SkipLink>
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId,
  children = 'Saltar al contenido principal',
  className = '',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.tabIndex = -1;
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
      // Eliminar tabindex después de perder foco
      target.addEventListener('blur', () => {
        target.removeAttribute('tabindex');
      }, { once: true });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className={`skip-link ${className}`}
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#000',
        color: '#fff',
        padding: '8px 16px',
        textDecoration: 'none',
        zIndex: 10000,
        transition: 'top 0.3s',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;
