# Performance y Optimización

## Mejores Prácticas de Performance

### RAF Loop Optimizado

```typescript
// ✅ RAF loop eficiente
let rafId: number;
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function raf(currentTime: number) {
  rafId = requestAnimationFrame(raf);
  
  const deltaTime = currentTime - lastTime;
  
  // Skip frame si vamos muy rápido
  if (deltaTime < frameInterval) return;
  
  // Ajustar para el tiempo perdido
  lastTime = currentTime - (deltaTime % frameInterval);
  
  lenis.raf(currentTime);
}

requestAnimationFrame(raf);

// Cleanup
window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(rafId);
});
```

### Throttled Scroll Events

```typescript
// ✅ Throttle para eventos de scroll
function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Uso
lenis.on(
  'scroll',
  throttle((e) => {
    // Operaciones costosas aquí
    updateComplexAnimation(e);
  }, 16) // ~60fps
);
```

---

## Virtual Scroll

```typescript
// ✅ Virtual scroll para listas largas
class VirtualScroll {
  private container: HTMLElement;
  private items: HTMLElement[] = [];
  private itemHeight: number;
  private visibleCount: number;
  private buffer = 3;

  constructor(container: HTMLElement, itemHeight: number) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(window.innerHeight / itemHeight) + this.buffer * 2;
    
    this.setup();
  }

  setup() {
    // Crear elementos visibles
    for (let i = 0; i < this.visibleCount; i++) {
      const item = document.createElement('div');
      item.style.height = `${this.itemHeight}px`;
      item.style.position = 'absolute';
      item.style.width = '100%';
      this.container.appendChild(item);
      this.items.push(item);
    }

    // Actualizar en scroll
    lenis.on('scroll', ({ scroll }) => {
      this.update(scroll);
    });
  }

  update(scroll: number) {
    const startIndex = Math.floor(scroll / this.itemHeight) - this.buffer;
    
    this.items.forEach((item, i) => {
      const index = startIndex + i;
      const y = index * this.itemHeight - scroll;
      
      item.style.transform = `translateY(${y}px)`;
      item.dataset.index = String(index);
      
      // Actualizar contenido
      this.renderItem(item, index);
    });
  }

  renderItem(item: HTMLElement, index: number) {
    // Override para renderizar contenido
    item.textContent = `Item ${index}`;
  }
}
```

---

## Image Loading

### Lazy Loading con Lenis

```typescript
// ✅ Lazy loading de imágenes
const imageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  },
  {
    rootMargin: '50px',
  }
);

// Observar imágenes
document.querySelectorAll('img[data-src]').forEach((img) => {
  imageObserver.observe(img);
});

// Refrescar Lenis después de cargar imágenes
lenis.on('scroll', () => {
  // Verificar nuevas imágenes en viewport
  document.querySelectorAll('img[data-src]:not(.loaded)').forEach((img) => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100) {
      imageObserver.observe(img);
    }
  });
});
```

---

## Resize Optimization

```typescript
// ✅ Resize con debounce
let resizeTimeout: ReturnType<typeof setTimeout>;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    lenis.resize();
    ScrollTrigger.refresh();
  }, 100);
});

// ✅ ResizeObserver para elementos específicos
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    // Solo actualizar si el cambio es significativo
    if (entry.contentRect.height > 0) {
      lenis.resize();
    }
  }
});

resizeObserver.observe(document.body);
```

---

## Memory Management

### Cleanup Correcto

```typescript
// ✅ Cleanup completo
function cleanup() {
  // 1. Destruir Lenis
  lenis.destroy();
  
  // 2. Remover event listeners
  window.removeEventListener('resize', handleResize);
  
  // 3. Cancelar RAF
  cancelAnimationFrame(rafId);
  
  // 4. Limpiar observers
  intersectionObserver.disconnect();
  resizeObserver.disconnect();
  
  // 5. Matar ScrollTriggers
  ScrollTrigger.getAll().forEach((st) => st.kill());
  
  // 6. Limpiar referencias
  elements = [];
  callbacks = new Map();
}

// En React
useEffect(() => {
  // Setup...
  
  return () => {
    cleanup();
  };
}, []);
```

### WeakRef para Caché

```typescript
// ✅ Caché con WeakRef (no previene GC)
class WeakCache<K extends object, V> {
  private cache = new WeakMap<K, WeakRef<V>>();
  private finalizer = new FinalizationRegistry<K>((key) => {
    this.cache.delete(key);
  });

  set(key: K, value: V): void {
    const ref = new WeakRef(value);
    this.cache.set(key, ref);
    this.finalizer.register(value, key);
  }

  get(key: K): V | undefined {
    const ref = this.cache.get(key);
    return ref?.deref();
  }
}
```

---

## Mobile Optimization

### Touch Events

```typescript
// ✅ Optimización para touch
const lenis = new Lenis({
  // Reduce lerp en mobile para más responsividad
  lerp: isMobile ? 0.15 : 0.1,
  
  // Sincronizar touch
  syncTouch: true,
  syncTouchLerp: 0.075,
  touchInertiaExponent: 1.7,
  
  // Multiplicadores
  touchMultiplier: isMobile ? 1.5 : 1,
});
```

### Reduced Motion

```typescript
// ✅ Respetar prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const lenis = new Lenis({
  lerp: prefersReducedMotion ? 1 : 0.1,
  smoothWheel: !prefersReducedMotion,
  syncTouch: !prefersReducedMotion,
});

// O desactivar completamente
if (prefersReducedMotion) {
  // No inicializar Lenis
}
```

---

## Métricas de Performance

```typescript
// ✅ Monitor de performance
class PerformanceMonitor {
  private frames: number[] = [];
  private lastTime = performance.now();

  measure() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;
    
    this.frames.push(1000 / delta);
    if (this.frames.length > 60) this.frames.shift();
    
    const avg = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
    
    if (avg < 30) {
      console.warn('Low FPS detected:', avg.toFixed(1));
      this.optimize();
    }
  }

  optimize() {
    // Reducir calidad
    lenis.options.lerp = Math.min(1, lenis.options.lerp * 1.2);
    
    // Reducir elementos animados
    document.querySelectorAll('.parallax').forEach((el) => {
      if (!isInViewport(el)) {
        el.classList.add('paused');
      }
    });
  }
}

const monitor = new PerformanceMonitor();

function raf(time: number) {
  monitor.measure();
  lenis.raf(time);
  requestAnimationFrame(raf);
}
```

---

## Checklist de Performance

```yaml
PERFORMANCE_CHECKLIST:
  Setup:
    - [ ] RAF loop optimizado (no duplicado)
    - [ ] autoRaf: false cuando se use GSAP
    - [ ] Resize con debounce
    - [ ] Cleanup completo en desmontaje
  
  Scroll:
    - [ ] Event listeners throttled
    - [ ] Virtual scroll para listas largas
    - [ ] Lazy loading de imágenes
    - [ ] will-change solo en elementos animados
  
  Mobile:
    - [ ] syncTouch: true
    - [ ] Lerp ajustado para mobile
    - [ ] prefers-reduced-motion respetado
    - [ ] Touch multiplier optimizado
  
  Memory:
    - [ ] No memory leaks en event listeners
    - [ ] Observers disconnect en cleanup
    - [ ] WeakRef para cachés grandes
    - [ ] Imágenes no usadas liberadas
```
