# Integración Lenis + GSAP ScrollTrigger

## Setup Oficial

```typescript
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ✅ CONFIGURACIÓN OFICIAL RECOMENDADA
const lenis = new Lenis({
  autoRaf: false, // GSAP manejará el RAF
});

// Sincronizar Lenis con ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

// Añadir Lenis al ticker de GSAP
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convertir a ms
});

// Desactivar lag smoothing para sincronización perfecta
gsap.ticker.lagSmoothing(0);
```

---

## MUST: Sincronización Correcta

```typescript
// ❌ INCORRECTO: Sin sincronización
const lenis = new Lenis({ autoRaf: true });
// ScrollTrigger no sabe del scroll suavizado

// ❌ INCORRECTO: Doble RAF
const lenis = new Lenis({ autoRaf: true });
gsap.ticker.add((time) => lenis.raf(time * 1000));
// RAF duplicado = performance issues

// ✅ CORRECTO: Sincronización oficial
const lenis = new Lenis({ autoRaf: false });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## ScrollTrigger con Lenis

### Setup Básico

```typescript
// ✅ ScrollTrigger funciona normalmente
gsap.to('.element', {
  x: 100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1, // Smooth scrubbing
  },
});
```

### Scrub con Lenis

```typescript
// ✅ Scrub suave con Lenis
gsap.to('.element', {
  y: -200,
  rotation: 360,
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5, // Más suave con Lenis
  },
});
```

### Pin con Lenis

```typescript
// ✅ Pin funciona correctamente
gsap.to('.pinned', {
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=500', // Pinear por 500px
    pin: true,
    pinSpacing: true,
  },
});
```

---

## ScrollTo con GSAP

```typescript
// ✅ Scroll a sección con Lenis + GSAP
function scrollToSection(selector: string) {
  const target = document.querySelector(selector);
  if (!target) return;

  // Usar Lenis para scroll suave
  lenis.scrollTo(target, {
    offset: -100,
    duration: 1.2,
  });
}

// Con ScrollTrigger
function scrollToTrigger(trigger: ScrollTrigger) {
  const target = trigger.start;
  lenis.scrollTo(target, {
    duration: 1,
  });
}
```

---

## Refresh de ScrollTrigger

```typescript
// ✅ MUST: Refrescar después de cambios
window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

// Después de cargar imágenes/datos
imagesLoaded('.container', () => {
  ScrollTrigger.refresh();
});

// En React/Vue después de mount
useEffect(() => {
  const timer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
  return () => clearTimeout(timer);
}, []);
```

---

## Velocity-Based Animations

```typescript
// ✅ Animaciones basadas en velocidad de scroll
let currentVelocity = 0;

lenis.on('scroll', ({ velocity }) => {
  currentVelocity = velocity;
});

// Skew basado en velocidad
gsap.to('.skew-element', {
  skewY: () => currentVelocity * 0.05,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});

// Scale basado en velocidad
gsap.to('.scale-element', {
  scale: () => 1 + Math.abs(currentVelocity) * 0.001,
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});
```

---

## Parallax con Lenis

```typescript
// ✅ Parallax suave con Lenis
gsap.utils.toArray('.parallax').forEach((element: HTMLElement) => {
  const speed = element.dataset.speed || 0.5;
  
  gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
});

// Parallax con dirección
gsap.to('.parallax-up', {
  y: -100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});

gsap.to('.parallax-down', {
  y: 100,
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
  },
});
```

---

## Horizontal Scroll + Lenis

```typescript
// ✅ Scroll horizontal con Lenis
const lenis = new Lenis({
  orientation: 'horizontal',
  gestureOrientation: 'both',
});

// GSAP horizontal scroll
gsap.to('.container', {
  x: () => -(document.querySelector('.container').scrollWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.wrapper',
    start: 'top top',
    end: () => '+=' + document.querySelector('.container').scrollWidth,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  },
});
```

---

## Cleanup Correcto

```typescript
// ✅ MUST: Cleanup al desmontar
function cleanup() {
  // Matar todos los ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  
  // Destruir Lenis
  lenis.destroy();
  
  // Remover del ticker
  gsap.ticker.remove(lenisRafCallback);
}

// En React
useEffect(() => {
  // Setup...
  
  return () => {
    cleanup();
  };
}, []);
```

---

## Troubleshooting

### Problema: ScrollTrigger no funciona

```typescript
// ✅ Solución: Asegurar sincronización
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Problema: Pin no funciona correctamente

```typescript
// ✅ Solución: Refrescar después de layout
ScrollTrigger.refresh();

// O con delay
setTimeout(() => ScrollTrigger.refresh(), 100);
```

### Problema: Lag en animaciones

```typescript
// ✅ Solución: Ajustar lerp o usar duration
const lenis = new Lenis({
  lerp: 0.1,        // Más alto = más responsive
  // o
  duration: 1.0,    // Más bajo = más rápido
});
```

---

## Checklist GSAP + Lenis

```yaml
GSAP_LENIS_CHECKLIST:
  Setup:
    - [ ] autoRaf: false en Lenis
    - [ ] lenis.on('scroll', ScrollTrigger.update)
    - [ ] gsap.ticker.add((time) => lenis.raf(time * 1000))
    - [ ] gsap.ticker.lagSmoothing(0)
  
  ScrollTrigger:
    - [ ] Refresh después de load
    - [ ] Refresh después de cambios de layout
    - [ ] Kill triggers en cleanup
  
  Performance:
    - [ ] No hay doble RAF
    - [ ] Scrub values apropiados
    - [ ] Lag smoothing desactivado
  
  Cleanup:
    - [ ] ScrollTrigger.kill() en desmontaje
    - [ ] lenis.destroy() en desmontaje
    - [ ] Remover callbacks del ticker
```
