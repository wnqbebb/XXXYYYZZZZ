import Lenis from 'lenis';

export const lenisPresets = {
  smooth: {
    lerp: 0.08,
    duration: 1.5,
    smoothWheel: true,
    wheelMultiplier: 0.8,
    touchMultiplier: 1.5,
  },
  responsive: {
    lerp: 0.15,
    duration: 0.8,
    smoothWheel: true,
    wheelMultiplier: 1.2,
  },
  horizontal: {
    orientation: 'horizontal' as const,
    gestureOrientation: 'both' as const,
    smoothWheel: true,
  },
  webgl: {
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: true,
  },
};

export function createLenis(preset: keyof typeof lenisPresets = 'smooth', overrides?: Partial<Lenis['options']>) {
  return new Lenis({
    ...lenisPresets[preset],
    ...overrides,
  });
}
