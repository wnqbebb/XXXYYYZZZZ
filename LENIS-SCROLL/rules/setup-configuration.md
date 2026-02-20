# Setup y Configuración de Lenis

## Instalación

```bash
npm install lenis
yarn add lenis
pnpm add lenis
```

### CDN (No recomendado para producción)

```html
<script src="https://unpkg.com/lenis@1.3.17/dist/lenis.min.js"></script>
```

---

## CSS Requerido

### MUST: Incluir CSS de Lenis

```css
/* Opción 1: Importar desde node_modules */
import 'lenis/dist/lenis.css';

/* Opción 2: Link en HTML */
<link rel="stylesheet" href="https://unpkg.com/lenis@1.3.17/dist/lenis.css">

/* Opción 3: CSS Manual (si no puedes importar) */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```

---

## Configuraciones

### Setup Básico (Auto RAF)

```typescript
import Lenis from 'lenis';

// ✅ CORRECTO: Para la mayoría de casos
const lenis = new Lenis({
  autoRaf: true,
});

// Escuchar scroll
lenis.on('scroll', (e) => {
  console.log(e.scroll, e.limit, e.velocity, e.direction);
});
```

### Custom RAF Loop

```typescript
// ✅ CORRECTO: Cuando necesitas control total del loop
const lenis = new Lenis({
  autoRaf: false, // Importante
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
```

### Configuración Avanzada

```typescript
interface LenisOptions {
  wrapper?: HTMLElement | Window;      // Container de scroll (default: window)
  content?: HTMLElement;               // Contenido a scrollear (default: document.documentElement)
  eventsTarget?: HTMLElement | Window; // Elemento para wheel/touch (default: wrapper)
  
  // Smoothness
  lerp?: number;                       // Interpolación (0-1), default: 0.1
  duration?: number;                   // Duración en segundos, default: 1.2
  easing?: (t: number) => number;      // Función de easing
  
  // Orientación
  orientation?: 'vertical' | 'horizontal';      // default: 'vertical'
  gestureOrientation?: 'vertical' | 'horizontal' | 'both'; // default: 'vertical'
  
  // Multiplicadores
  wheelMultiplier?: number;            // Multiplicador de wheel, default: 1
  touchMultiplier?: number;            // Multiplicador de touch, default: 1
  
  // Touch
  syncTouch?: boolean;                 // Sincronizar touch (iOS<16 puede ser inestable)
  syncTouchLerp?: number;              // Lerp durante syncTouch, default: 0.075
  touchInertiaExponent?: number;       // Fuerza de inercia, default: 1.7
  
  // Comportamiento
  infinite?: boolean;                  // Scroll infinito
  smoothWheel?: boolean;               // Suavizar wheel events, default: true
  overscroll?: boolean;                // Similar a CSS overscroll-behavior, default: true
  
  // Auto
  autoRaf?: boolean;                   // Auto requestAnimationFrame, default: false
  autoResize?: boolean;                // Auto resize con ResizeObserver, default: true
  autoToggle?: boolean;                // Auto start/stop basado en overflow
  
  // Callbacks
  prevent?: (node: HTMLElement) => boolean;     // Prevenir smooth scroll en elementos
  virtualScroll?: (e: VirtualScrollEvent) => boolean | void; // Modificar eventos
}
```

---

## Presets de Configuración

### Preset: Smooth Premium

```typescript
// ✅ Para experiencias premium, más suave
const lenis = new Lenis({
  lerp: 0.08,
  duration: 1.5,
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
});
```

### Preset: Responsive

```typescript
// ✅ Para sitios rápidos, más responsive
const lenis = new Lenis({
  lerp: 0.15,
  duration: 0.8,
  smoothWheel: true,
  wheelMultiplier: 1.2,
});
```

### Preset: Horizontal Scroll

```typescript
// ✅ Para scroll horizontal
const lenis = new Lenis({
  orientation: 'horizontal',
  gestureOrientation: 'both',
  smoothWheel: true,
});
```

### Preset: WebGL Sync

```typescript
// ✅ Optimizado para sincronización WebGL
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: true, // Importante para touch
});
```

---

## Métodos Principales

```typescript
// Scroll a posición
lenis.scrollTo(target, options);

// Target puede ser:
lenis.scrollTo(100);                    // Número (px)
lenis.scrollTo('#section');             // Selector
lenis.scrollTo(document.querySelector('.element')); // Elemento

// Opciones de scrollTo
lenis.scrollTo(target, {
  offset: -100,           // Offset en px
  duration: 1.2,          // Duración override
  easing: (t) => t,       // Easing override
  lerp: 0.1,              // Lerp override (si no hay duration)
  immediate: false,       // Sin animación
  lock: false,            // Bloquear scroll durante animación
  force: false,           // Forzar scroll aunque esté parado
  onComplete: () => {},   // Callback al completar
});

// Control de estado
lenis.start();           // Iniciar
lenis.stop();            // Detener
lenis.destroy();         // Destruir instancia

// Actualización
lenis.resize();          // Recalcular dimensiones
lenis.raf(time);         // Update frame (si autoRaf: false)

// Scroll manual (no recomendado)
lenis.scroll = 100;      // Set scroll position
```

---

## Eventos

```typescript
// Evento scroll - más importante
lenis.on('scroll', (e) => {
  e.scroll;      // Posición actual (suavizada)
  e.limit;       // Límite máximo de scroll
  e.velocity;    // Velocidad actual
  e.direction;   // 1 = down, -1 = up
  e.progress;    // Progreso 0-1
});

// Otros eventos
lenis.on('start', () => {});     // Inicio de scroll
lenis.on('stop', () => {});      // Fin de scroll
```

---

## Propiedades Útiles

```typescript
lenis.scroll;           // Posición actual
lenis.targetScroll;     // Posición objetivo
lenis.animatedScroll;   // Posición animada
lenis.velocity;         // Velocidad actual
lenis.direction;        // Dirección (1/-1)
lenis.progress;         // Progreso 0-1
lenis.limit;            // Límite máximo
lenis.isScrolling;      // Boolean o 'smooth' | 'native' | false
lenis.isStopped;        // Está detenido
```

---

## Data Attributes

```html
<!-- Prevenir smooth scroll en elemento -->
<div data-lenis-prevent>
  Este elemento usa scroll nativo
</div>

<!-- Prevenir en elemento y todos sus hijos -->
<div data-lenis-prevent="true">
  ...
</div>

<!-- Anchor link -->
<a href="#section" data-lenis-link>Ir a sección</a>
```

---

## Checklist de Setup

```yaml
SETUP_CHECKLIST:
  Instalación:
    - [ ] npm install lenis
    - [ ] CSS importado o incluido
  
  Configuración:
    - [ ] autoRaf: true (o custom RAF loop)
    - [ ] lerp o duration configurado
    - [ ] Eventos de scroll registrados
  
  Integración:
    - [ ] GSAP ScrollTrigger sincronizado (si aplica)
    - [ ] prefers-reduced-motion implementado
    - [ ] Cleanup/destroy en desmontaje
  
  Testing:
    - [ ] Scroll funciona en desktop
    - [ ] Scroll funciona en mobile
    - [ ] Touch funciona correctamente
    - [ ] No hay lag en animaciones
```
