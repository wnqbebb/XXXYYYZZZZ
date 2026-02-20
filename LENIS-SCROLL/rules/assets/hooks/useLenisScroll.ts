import { useEffect } from 'react';
import { useLenisContext } from '../components/LenisProvider';

export function useLenisScroll() {
  const { scroll, limit, velocity, direction, progress } = useLenisContext();
  return { scroll, limit, velocity, direction, progress };
}

export function useLenisEvent(
  event: 'scroll' | 'start' | 'stop',
  callback: (e: any) => void
) {
  const { lenis } = useLenisContext();

  useEffect(() => {
    if (!lenis) return;

    lenis.on(event, callback);
    return () => {
      lenis.off(event, callback);
    };
  }, [lenis, event, callback]);
}
