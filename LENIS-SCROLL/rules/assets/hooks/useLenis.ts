import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export interface UseLenisOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  infinite?: boolean;
  orientation?: 'vertical' | 'horizontal';
  gestureOrientation?: 'vertical' | 'horizontal' | 'both';
  syncTouch?: boolean;
  autoRaf?: boolean;
}

export function useLenis(options: UseLenisOptions = {}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      ...options,
    });

    if (!options.autoRaf) {
      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
