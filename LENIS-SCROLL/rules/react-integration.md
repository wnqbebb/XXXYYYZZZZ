# Integración React + Lenis

## Hook useLenis

```typescript
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface UseLenisOptions {
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
    // ✅ MUST: Verificar prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      return; // No inicializar Lenis
    }

    // Crear instancia
    lenisRef.current = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      ...options,
    });

    // RAF loop si no es autoRaf
    if (!options.autoRaf) {
      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }

    // ✅ MUST: Cleanup
    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
```

---

## LenisProvider (Context)

```typescript
import React, { createContext, useContext, useEffect, useRef } from 'react';
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
```

---

## Hook useLenisScroll

```typescript
import { useEffect, useState } from 'react';
import { useLenisContext } from './LenisProvider';

export function useLenisScroll() {
  const { scroll, limit, velocity, direction, progress } = useLenisContext();
  return { scroll, limit, velocity, direction, progress };
}

// Hook para suscribirse a eventos específicos
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
```

---

## Componente SmoothScroll

```typescript
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: React.ReactNode;
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
```

---

## Componente ScrollVelocity

```typescript
import { useEffect, useRef, useState } from 'react';
import { useLenisContext } from './LenisProvider';

interface ScrollVelocityProps {
  children: (velocity: number, direction: number) => React.ReactNode;
}

export function ScrollVelocity({ children }: ScrollVelocityProps) {
  const { velocity, direction } = useLenisContext();
  return <>{children(velocity, direction)}</>;
}

// Uso
function MyComponent() {
  return (
    <ScrollVelocity>
      {(velocity, direction) => (
        <div style={{ transform: `skewY(${velocity * 0.05}deg)` }}>
          Content
        </div>
      )}
    </ScrollVelocity>
  );
}
```

---

## ScrollTo con React Router

```typescript
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenisContext } from './LenisProvider';

export function useLenisRouter() {
  const { lenis } = useLenisContext();
  const location = useLocation();

  useEffect(() => {
    if (!lenis) return;

    // Scroll to top en navegación
    lenis.scrollTo(0, { immediate: true });
  }, [location.pathname, lenis]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && lenis) {
      lenis.scrollTo(element, { offset: -100 });
    }
  };

  return { scrollToSection };
}
```

---

## Integración GSAP + React

```typescript
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenisContext } from './LenisProvider';

gsap.registerPlugin(ScrollTrigger);

export function useGSAPWithLenis() {
  const { lenis } = useLenisContext();
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!lenis) return;

    // Sincronización
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      // Cleanup
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, [lenis]);

  const addTrigger = (trigger: ScrollTrigger) => {
    triggersRef.current.push(trigger);
  };

  return { addTrigger };
}

// Hook para animaciones
export function useScrollAnimation(
  animation: (tl: gsap.core.Timeline) => void,
  deps: any[] = []
) {
  const ref = useRef<HTMLDivElement>(null);
  const { addTrigger } = useGSAPWithLenis();

  useEffect(() => {
    if (!ref.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1,
      },
    });

    animation(tl);

    if (tl.scrollTrigger) {
      addTrigger(tl.scrollTrigger);
    }

    return () => {
      tl.kill();
    };
  }, deps);

  return ref;
}
```

---

## Ejemplo Completo App

```typescript
// App.tsx
import { LenisProvider } from './components/LenisProvider';
import { SmoothScroll } from './components/SmoothScroll';
import { Home } from './pages/Home';

function App() {
  return (
    <LenisProvider
      options={{
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: true,
      }}
    >
      <Home />
    </LenisProvider>
  );
}

// Page.tsx
import { useLenisScroll } from './hooks/useLenisScroll';
import { ParallaxSection } from './components/ParallaxSection';

function Home() {
  const { scroll, progress } = useLenisScroll();

  return (
    <main>
      <ParallaxSection speed={0.5}>
        <h1>Smooth Scroll Experience</h1>
      </ParallaxSection>
      
      <div>Progress: {progress * 100}%</div>
    </main>
  );
}
```

---

## Checklist React + Lenis

```yaml
REACT_LENIS_CHECKLIST:
  Setup:
    - [ ] prefers-reduced-motion verificado
    - [ ] LenisProvider envuelve la app
    - [ ] Cleanup en useEffect return
  
  Hooks:
    - [ ] useLenisContext para acceso global
    - [ ] useLenisScroll para valores de scroll
    - [ ] useLenisEvent para eventos específicos
  
  GSAP:
    - [ ] Sincronización en useEffect
    - [ ] ScrollTrigger.refresh() después de mount
    - [ ] Kill triggers en cleanup
  
  Router:
    - [ ] Scroll to top en cambio de ruta
    - [ ] Anchor links funcionan con Lenis
  
  Performance:
    - [ ] No recreación de instancias innecesaria
    - [ ] RAF loop eficiente
    - [ ] State updates optimizados
```
