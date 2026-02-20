import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
  scroll: number;
  limit: number;
  velocity: number;
  direction: number;
  progress: number;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scroll: 0,
  limit: 0,
  velocity: 0,
  direction: 1,
  progress: 0,
});

export const useLenisContext = () => useContext(LenisContext);

interface LenisProviderProps {
  children: React.ReactNode;
  options?: ConstructorParameters<typeof Lenis>[0];
}

export function LenisProvider({ children, options }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [scrollData, setScrollData] = useState({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 1,
    progress: 0,
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      ...options,
    });

    lenisRef.current.on('scroll', (e) => {
      setScrollData({
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      });
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisRef.current,
        ...scrollData,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
