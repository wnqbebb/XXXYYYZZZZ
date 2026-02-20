import { useEffect, useRef, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
  options?: ConstructorParameters<typeof Lenis>[0];
}

export function SmoothScroll({ children, options }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);

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

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
