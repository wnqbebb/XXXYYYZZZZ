---
name: performance
description: Performance optimization and memory management
tags: [performance, memory, optimization, profiling]
version: 1.0.0
---

# Optimización de Rendimiento JavaScript

## 1. MEMORY MANAGEMENT

### WeakMap/WeakSet
- **MUST**: Usar WeakMap para datos privados asociados a objetos
- **MUST**: Usar WeakRef para cachés que no deben prevenir GC
- **FORBIDDEN**: Guardar referencias fuertes a DOM nodes innecesariamente
- **WHY**: Permite garbage collection automático

```typescript
// ✅ CORRECTO - Datos privados sin memory leaks
const privateData = new WeakMap<Component, PrivateData>();

class Component {
  constructor(element: HTMLElement) {
    privateData.set(this, { element, cache: new Map() });
  }
}
// Se limpia automáticamente cuando la instancia se destruye

// ❌ INCORRECTO - Memory leak garantizado
const componentData = new Map(); // Nunca se limpia
```

### WeakRef y FinalizationRegistry

```typescript
// ✅ CORRECTO - Cache con WeakRef
class WeakCache<K extends object, V> {
  private cache = new WeakMap<K, WeakRef<V>>();
  private finalizer = new FinalizationRegistry<K>((key) => {
    this.cache.delete(key);
    console.log('Limpiado:', key);
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

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }
}

// Uso
const imageCache = new WeakCache<HTMLElement, ImageBitmap>();

function loadImage(element: HTMLElement, src: string): void {
  if (imageCache.has(element)) return;
  
  createImageBitmap(new Image(src)).then(bitmap => {
    imageCache.set(element, bitmap);
  });
}
```

### Object Pooling
- **MUST**: Usar para objetos creados frecuentemente (partículas, bullets)
- **MUST**: Pre-allocar en fase de inicialización, no en gameplay

```typescript
// ✅ CORRECTO - Object Pool para partículas
interface Poolable {
  reset(): void;
  isActive: boolean;
}

class ObjectPool<T extends Poolable> {
  private pool: T[] = [];
  private active: Set<T> = new Set();
  private factory: () => T;
  private maxSize: number;

  constructor(factory: () => T, initialSize: number, maxSize: number = 1000) {
    this.factory = factory;
    this.maxSize = maxSize;
    
    // Pre-allocate durante inicialización
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }

  acquire(): T {
    let item: T;
    
    if (this.pool.length > 0) {
      item = this.pool.pop()!;
    } else if (this.active.size < this.maxSize) {
      item = this.factory();
    } else {
      throw new Error('Pool exhausted');
    }
    
    item.reset();
    item.isActive = true;
    this.active.add(item);
    return item;
  }

  release(item: T): void {
    if (!this.active.has(item)) return;
    
    item.isActive = false;
    this.active.delete(item);
    
    if (this.pool.length < this.maxSize) {
      this.pool.push(item);
    }
  }

  releaseAll(): void {
    this.active.forEach(item => {
      item.isActive = false;
      this.pool.push(item);
    });
    this.active.clear();
  }

  getActiveCount(): number {
    return this.active.size;
  }

  getAvailableCount(): number {
    return this.pool.length;
  }
}

// Implementación de partícula
class Particle implements Poolable {
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  life = 0;
  isActive = false;

  reset(): void {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 0;
  }

  update(deltaTime: number): void {
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    this.life -= deltaTime;
  }
}

// Uso
const particlePool = new ObjectPool(() => new Particle(), 100, 500);

// En gameplay - sin allocations
function spawnExplosion(x: number, y: number): void {
  for (let i = 0; i < 20; i++) {
    const particle = particlePool.acquire();
    particle.x = x;
    particle.y = y;
    particle.vx = (Math.random() - 0.5) * 100;
    particle.vy = (Math.random() - 0.5) * 100;
    particle.life = 1000;
  }
}

function updateParticles(deltaTime: number): void {
  // Iterar sobre partículas activas
  // Note: En implementación real, necesitarías trackear activas separadamente
}
```

### Memory Leaks Prevention
- **MUST**: Limpiar event listeners en cleanup
- **MUST**: Romper referencias circulares
- **MUST**: Usar FinalizationRegistry para cleanup automático

```typescript
// ✅ CORRECTO - Cleanup automático con AbortController
class EventManager {
  private controllers = new Map<string, AbortController>();

  addListener(
    target: EventTarget,
    event: string,
    handler: EventListener,
    scope: string = 'default'
  ): void {
    if (!this.controllers.has(scope)) {
      this.controllers.set(scope, new AbortController());
    }
    
    const controller = this.controllers.get(scope)!;
    target.addEventListener(event, handler, { signal: controller.signal });
  }

  removeScope(scope: string): void {
    const controller = this.controllers.get(scope);
    if (controller) {
      controller.abort();
      this.controllers.delete(scope);
    }
  }

  removeAll(): void {
    this.controllers.forEach(controller => controller.abort());
    this.controllers.clear();
  }
}

// Uso
const events = new EventManager();

class Widget {
  private element: HTMLElement;
  private scope = `widget-${Math.random()}`;

  constructor(element: HTMLElement) {
    this.element = element;
    
    events.addListener(element, 'click', this.handleClick, this.scope);
    events.addListener(window, 'resize', this.handleResize, this.scope);
    events.addListener(document, 'keydown', this.handleKeydown, this.scope);
  }

  destroy(): void {
    events.removeScope(this.scope);
  }

  private handleClick = (e: Event): void => { /* ... */ };
  private handleResize = (): void => { /* ... */ };
  private handleKeydown = (e: KeyboardEvent): void => { /* ... */ };
}

// ✅ CORRECTO - Romper referencias circulares
class Node {
  id: string;
  private _parent?: WeakRef<Node>;
  children: Node[] = [];

  constructor(id: string) {
    this.id = id;
  }

  get parent(): Node | undefined {
    return this._parent?.deref();
  }

  set parent(value: Node | undefined) {
    this._parent = value ? new WeakRef(value) : undefined;
  }

  addChild(child: Node): void {
    child.parent = this;
    this.children.push(child);
  }

  // Limpieza explícita si es necesario
  destroy(): void {
    this.children = [];
    this._parent = undefined;
  }
}
```

## 2. DEBOUNCE & THROTTLE

### Debounce
- **MUST**: Usar para eventos que disparan múltiples veces (resize, input)
- **MUST**: Cancelar debounce pendiente en cleanup

```typescript
// ✅ CORRECTO - Debounce con cancelación
function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): { 
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel(): void;
  flush(): Promise<ReturnType<T>> | undefined;
} {
  const { leading = false, trailing = true } = options;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastCallTime: number | null = null;
  let result: ReturnType<T>;

  const invoke = (time: number): ReturnType<T> => {
    lastCallTime = time;
    result = fn(...lastArgs!);
    return result;
  };

  const leadingEdge = (time: number): ReturnType<T> | undefined => {
    timer = setTimeout(timerExpired, delay);
    return leading ? invoke(time) : result;
  };

  const remainingWait = (time: number): number => {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    return delay - timeSinceLastCall;
  };

  const shouldInvoke = (time: number): boolean => {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    return lastCallTime === null || timeSinceLastCall >= delay;
  };

  const timerExpired = (): void => {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timer = setTimeout(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time: number): ReturnType<T> | undefined => {
    timer = null;
    if (trailing && lastArgs) {
      return invoke(time);
    }
    lastArgs = null;
    return result;
  };

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    lastArgs = args;
    
    if (timer === null) {
      return Promise.resolve(leadingEdge(Date.now()));
    }
    
    clearTimeout(timer);
    timer = setTimeout(timerExpired, delay);
    return Promise.resolve(result);
  };

  debounced.cancel = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    lastArgs = null;
    lastCallTime = null;
    timer = null;
  };

  debounced.flush = (): Promise<ReturnType<T>> | undefined => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    if (lastArgs) {
      return Promise.resolve(invoke(Date.now()));
    }
    return undefined;
  };

  return debounced;
}

// Uso
class SearchComponent {
  private searchDebounced: ReturnType<typeof debounce>;
  private abortController: AbortController | null = null;

  constructor() {
    this.searchDebounced = debounce(this.performSearch.bind(this), 300, {
      trailing: true
    });
  }

  onInput(value: string): void {
    // Cancela request anterior
    this.abortController?.abort();
    this.abortController = new AbortController();
    
    this.searchDebounced(value, this.abortController.signal);
  }

  private async performSearch(
    query: string, 
    signal: AbortSignal
  ): Promise<void> {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        signal
      });
      const results = await response.json();
      this.displayResults(results);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Ignorar abortos
      }
      this.displayError(error);
    }
  }

  destroy(): void {
    this.searchDebounced.cancel();
    this.abortController?.abort();
  }

  private displayResults(results: unknown[]): void { /* ... */ }
  private displayError(error: unknown): void { /* ... */ }
}
```

### Throttle
- **MUST**: Usar para scroll y mousemove (60fps máximo)
- **MUST**: Usar requestAnimationFrame + throttle para animaciones

```typescript
// ✅ CORRECTO - Throttle con RAF para 60fps
function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): (...args: Parameters<T>) => void {
  const { leading = true, trailing = true } = options;
  let lastCall = 0;
  let lastArgs: Parameters<T> | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const invoke = (): void => {
    fn(...lastArgs!);
    lastArgs = null;
    lastCall = Date.now();
  };

  return (...args: Parameters<T>): void => {
    const now = Date.now();
    const remaining = limit - (now - lastCall);
    lastArgs = args;

    if (remaining <= 0) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (leading) {
        invoke();
      } else {
        lastCall = now;
        if (trailing) {
          timer = setTimeout(invoke, limit);
        }
      }
    } else if (!timer && trailing) {
      timer = setTimeout(invoke, remaining);
    }
  };
}

// ✅ CORRECTO - Throttle con RAF para animaciones
function rafThrottle<T extends (...args: unknown[]) => unknown>(
  fn: T
): (...args: Parameters<T>) => void {
  let rafId: number | null = null;
  let lastArgs: Parameters<T> | null = null;

  const invoke = (): void => {
    rafId = null;
    if (lastArgs) {
      fn(...lastArgs);
      lastArgs = null;
    }
  };

  return (...args: Parameters<T>): void => {
    lastArgs = args;
    
    if (rafId === null) {
      rafId = requestAnimationFrame(invoke);
    }
  };
}

// Uso en scroll (máximo 60fps)
class ScrollManager {
  private handleScroll: () => void;
  private rafId: number | null = null;

  constructor() {
    // 16ms = ~60fps
    this.handleScroll = throttle(this.onScroll.bind(this), 16);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  private onScroll(): void {
    const scrollY = window.scrollY;
    
    // Actualizar UI
    this.updateProgress(scrollY);
    this.checkVisibleElements(scrollY);
  }

  private updateProgress(scrollY: number): void {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = scrollY / maxScroll;
    document.documentElement.style.setProperty('--scroll-progress', String(progress));
  }

  private checkVisibleElements(scrollY: number): void {
    // Lógica de intersection manual si es necesario
  }

  destroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// Uso en mouse tracking
class MouseTracker {
  private mouseX = 0;
  private mouseY = 0;
  private targetX = 0;
  private targetY = 0;
  private rafId: number | null = null;

  constructor() {
    document.addEventListener(
      'mousemove', 
      rafThrottle(this.onMouseMove.bind(this))
    );
    this.animate();
  }

  private onMouseMove(e: MouseEvent): void {
    this.targetX = e.clientX;
    this.targetY = e.clientY;
  }

  private animate(): void {
    // Interpolación suave (Lerp)
    this.mouseX += (this.targetX - this.mouseX) * 0.1;
    this.mouseY += (this.targetY - this.mouseY) * 0.1;
    
    this.updateCursor();
    this.rafId = requestAnimationFrame(() => this.animate());
  }

  private updateCursor(): void {
    // Actualizar posición de cursor personalizado
  }

  destroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
```

## 3. LAZY LOADING

### Dynamic Imports
- **MUST**: Code-split por rutas y features
- **MUST**: Prefetch rutas probables
- **WHY**: Reduce initial bundle size

```typescript
// ✅ CORRECTO - Router con lazy loading
type RouteComponent = () => Promise<{ default: React.ComponentType }>;

interface Route {
  path: string;
  component: RouteComponent;
  prefetch?: boolean;
}

class LazyRouter {
  private routes = new Map<string, Route>();
  private cache = new Map<string, React.ComponentType>();
  private preloadQueue: string[] = [];

  register(route: Route): void {
    this.routes.set(route.path, route);
    
    if (route.prefetch) {
      this.preloadQueue.push(route.path);
    }
  }

  async navigate(path: string): Promise<React.ComponentType | null> {
    // Check cache
    if (this.cache.has(path)) {
      return this.cache.get(path)!;
    }

    const route = this.routes.get(path);
    if (!route) return null;

    // Mostrar skeleton mientras carga
    this.showSkeleton();

    try {
      const module = await route.component();
      const Component = module.default;
      
      this.cache.set(path, Component);
      this.hideSkeleton();
      
      // Prefetch siguientes rutas
      this.prefetchAdjacent(path);
      
      return Component;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  private showSkeleton(): void {
    document.body.classList.add('loading');
  }

  private hideSkeleton(): void {
    document.body.classList.remove('loading');
  }

  private handleError(error: unknown): void {
    console.error('Failed to load route:', error);
    // Mostrar error UI
  }

  private prefetchAdjacent(currentPath: string): void {
    // Prefetch rutas relacionadas
    const index = this.preloadQueue.indexOf(currentPath);
    const toPrefetch = [
      this.preloadQueue[index - 1],
      this.preloadQueue[index + 1]
    ].filter(Boolean);

    // Delay para no competir con carga actual
    setTimeout(() => {
      toPrefetch.forEach(path => this.prefetch(path));
    }, 2000);
  }

  private prefetch(path: string): void {
    if (this.cache.has(path)) return;
    
    const route = this.routes.get(path);
    if (!route) return;

    // Usar requestIdleCallback si está disponible
    const schedule = window.requestIdleCallback || setTimeout;
    
    schedule(() => {
      route.component().then(module => {
        this.cache.set(path, module.default);
      });
    });
  }
}

// Uso
const router = new LazyRouter();

router.register({
  path: '/dashboard',
  component: () => import('./pages/Dashboard'),
  prefetch: true
});

router.register({
  path: '/analytics',
  component: () => import('./pages/Analytics'),
  prefetch: true
});

router.register({
  path: '/settings',
  component: () => import('./pages/Settings')
});
```

### Intersection Observer
- **MUST**: Usar para lazy load de imágenes y componentes
- **FORBIDDEN**: Scroll event listeners para detectar visibilidad

```typescript
// ✅ CORRECTO - Lazy Image Loader
interface LazyImageOptions {
  rootMargin?: string;
  threshold?: number;
  placeholder?: string;
  errorImage?: string;
}

class LazyImageLoader {
  private observer: IntersectionObserver;
  private loadingImages = new Map<HTMLImageElement, AbortController>();
  private options: Required<LazyImageOptions>;

  constructor(options: LazyImageOptions = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0,
      placeholder: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      errorImage: '/images/error.png',
      ...options
    };

    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold
      }
    );
  }

  observe(img: HTMLImageElement): void {
    // Guardar src real
    const realSrc = img.dataset.src;
    if (!realSrc) return;

    // Aplicar placeholder
    img.src = this.options.placeholder;
    
    this.observer.observe(img);
  }

  unobserve(img: HTMLImageElement): void {
    this.observer.unobserve(img);
    
    // Cancelar carga en progreso
    const controller = this.loadingImages.get(img);
    if (controller) {
      controller.abort();
      this.loadingImages.delete(img);
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadImage(entry.target as HTMLImageElement);
        this.observer.unobserve(entry.target);
      }
    });
  }

  private async loadImage(img: HTMLImageElement): Promise<void> {
    const src = img.dataset.src;
    if (!src) return;

    const controller = new AbortController();
    this.loadingImages.set(img, controller);

    try {
      // Preload image
      await this.preloadImage(src, controller.signal);
      
      if (!controller.signal.aborted) {
        img.src = src;
        img.classList.add('loaded');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      
      img.src = this.options.errorImage;
      img.classList.add('error');
    } finally {
      this.loadingImages.delete(img);
      delete img.dataset.src;
    }
  }

  private preloadImage(src: string, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      
      const onLoad = (): void => resolve();
      const onError = (): void => reject(new Error(`Failed to load: ${src}`));
      const onAbort = (): void => reject(new DOMException('Aborted', 'AbortError'));
      
      image.onload = onLoad;
      image.onerror = onError;
      signal.addEventListener('abort', onAbort);
      
      image.src = src;
    });
  }

  destroy(): void {
    this.observer.disconnect();
    this.loadingImages.forEach(controller => controller.abort());
    this.loadingImages.clear();
  }
}

// ✅ CORRECTO - Lazy Component Loader
class LazyComponentLoader {
  private observer: IntersectionObserver;
  private componentCache = new Map<string, HTMLElement>();

  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '100px' }
    );
  }

  register(
    container: HTMLElement,
    loader: () => Promise<HTMLElement>
  ): void {
    container.dataset.loader = 'true';
    (container as unknown as { _loader: () => Promise<HTMLElement> })._loader = loader;
    this.observer.observe(container);
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadComponent(entry.target as HTMLElement);
        this.observer.unobserve(entry.target);
      }
    });
  }

  private async loadComponent(container: HTMLElement): Promise<void {
    const loader = (container as unknown as { _loader?: () => Promise<HTMLElement> })._loader;
    if (!loader) return;

    // Mostrar skeleton
    container.innerHTML = '<div class="skeleton"></div>';

    try {
      const component = await loader();
      container.innerHTML = '';
      container.appendChild(component);
      container.classList.add('loaded');
    } catch (error) {
      container.innerHTML = '<div class="error">Failed to load</div>';
    }

    delete (container as unknown as { _loader?: () => Promise<HTMLElement> })._loader;
  }

  destroy(): void {
    this.observer.disconnect();
  }
}

// Uso
const imageLoader = new LazyImageLoader();
const componentLoader = new LazyComponentLoader();

// Lazy load imágenes
document.querySelectorAll('img[data-src]').forEach(img => {
  imageLoader.observe(img as HTMLImageElement);
});

// Lazy load componentes pesados
const heavyChart = document.getElementById('heavy-chart');
if (heavyChart) {
  componentLoader.register(heavyChart, async () => {
    const { HeavyChartComponent } = await import('./components/HeavyChart');
    return new HeavyChartComponent().render();
  });
}
```

## 4. CACHING STRATEGIES

### Memoization
- **MUST**: Usar para funciones puras costosas
- **MUST**: Limitar tamaño de caché (LRU)
- **WHY**: Evita recálculos innecesarios

```typescript
// ✅ CORRECTO - LRU Cache con límite de tamaño
class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Mover al final (más reciente)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Eliminar el más antiguo
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}

// ✅ CORRECTO - Memoize con LRU
function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: {
    maxSize?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
    ttl?: number;
  } = {}
): T {
  const { maxSize = 100, keyGenerator, ttl } = options;
  const cache = new LRUCache<string, { value: ReturnType<T>; expiry: number }>(maxSize);

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && (ttl === undefined || Date.now() < cached.expiry)) {
      return cached.value;
    }

    const value = fn(...args) as ReturnType<T>;
    cache.set(key, {
      value,
      expiry: ttl ? Date.now() + ttl : Infinity
    });

    return value;
  }) as T;
}

// Ejemplos de uso
// 1. Cálculos costosos
const fibonacci = memoize((n: number): number => {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}, { maxSize: 1000 });

// 2. Parseo de datos grandes
const parseCSV = memoize(
  (csv: string): Record<string, string>[] => {
    // Parsing costoso...
    return csv.split('\n').map(line => {
      const [name, value] = line.split(',');
      return { name, value };
    });
  },
  { maxSize: 50, ttl: 60000 } // 1 minuto TTL
);

// 3. Transformaciones de datos
interface User {
  id: string;
  name: string;
  email: string;
}

const getUserDisplayName = memoize(
  (user: User): string => {
    return `${user.name} <${user.email}>`;
  },
  {
    keyGenerator: (user) => user.id,
    maxSize: 1000
  }
);

// ✅ CORRECTO - Computed properties cache
class ComputedState<T extends Record<string, unknown>> {
  private state: T;
  private computedCache = new Map<string, unknown>();
  private dependencies = new Map<string, Set<string>>();
  private subscribers = new Map<string, Set<(value: unknown) => void>>();

  constructor(initialState: T) {
    this.state = { ...initialState };
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.state[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    if (this.state[key] === value) return;
    
    this.state[key] = value;
    this.invalidate(key as string);
  }

  computed<R>(
    name: string,
    deps: (keyof T)[],
    compute: (state: T) => R
  ): R {
    // Verificar caché
    if (this.computedCache.has(name)) {
      return this.computedCache.get(name) as R;
    }

    // Registrar dependencias
    this.dependencies.set(name, new Set(deps as string[]));

    // Calcular y cachear
    const value = compute(this.state);
    this.computedCache.set(name, value);

    return value;
  }

  private invalidate(changedKey: string): void {
    // Invalidar computed que dependen de esta key
    this.dependencies.forEach((deps, computedName) => {
      if (deps.has(changedKey)) {
        this.computedCache.delete(computedName);
        
        // Notificar subscribers
        const subs = this.subscribers.get(computedName);
        if (subs) {
          const newValue = this.computedCache.get(computedName);
          subs.forEach(cb => cb(newValue));
        }
      }
    });
  }

  subscribe(computedName: string, callback: (value: unknown) => void): () => void {
    if (!this.subscribers.has(computedName)) {
      this.subscribers.set(computedName, new Set());
    }
    this.subscribers.get(computedName)!.add(callback);

    return () => {
      this.subscribers.get(computedName)?.delete(callback);
    };
  }
}

// Uso
const state = new ComputedState({
  firstName: 'John',
  lastName: 'Doe',
  age: 30
});

const fullName = state.computed('fullName', ['firstName', 'lastName'], (s) => {
  console.log('Computing fullName...'); // Solo se ejecuta una vez
  return `${s.firstName} ${s.lastName}`;
});

console.log(fullName); // John Doe
console.log(state.computed('fullName', ['firstName', 'lastName'], (s) => `${s.firstName} ${s.lastName}`)); // John Doe (cached)

state.set('firstName', 'Jane');
const newFullName = state.computed('fullName', ['firstName', 'lastName'], (s) => `${s.firstName} ${s.lastName}`);
console.log(newFullName); // Jane Doe (recomputado)
```

### Request Caching
- **MUST**: Cachear requests GET idempotentes
- **MUST**: Invalidar caché cuando sea necesario

```typescript
// ✅ CORRECTO - API Client con caché inteligente
interface CacheEntry<T> {
  data: T;
  expiry: number;
  etag?: string;
}

interface RequestConfig {
  cache?: boolean;
  ttl?: number;
  tags?: string[];
}

class CachedAPIClient {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();
  private tagIndex = new Map<string, Set<string>>();

  constructor(private baseURL: string) {}

  async get<T>(
    endpoint: string, 
    config: RequestConfig = {}
  ): Promise<T> {
    const { cache = true, ttl = 60000, tags = [] } = config;
    const cacheKey = `GET:${endpoint}`;

    // Verificar caché
    if (cache) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() < cached.expiry) {
        return cached.data as T;
      }
    }

    // Deduplicar requests en vuelo
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey) as Promise<T>;
    }

    const request = this.fetchWithCache<T>(endpoint, cacheKey, ttl, tags);
    this.pendingRequests.set(cacheKey, request);

    try {
      const result = await request;
      return result;
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  private async fetchWithCache<T>(
    endpoint: string,
    cacheKey: string,
    ttl: number,
    tags: string[]
  ): Promise<T> {
    const headers: Record<string, string> = {};
    
    // ETag para revalidación
    const cached = this.cache.get(cacheKey);
    if (cached?.etag) {
      headers['If-None-Match'] = cached.etag;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, { headers });

    // 304 Not Modified
    if (response.status === 304 && cached) {
      cached.expiry = Date.now() + ttl;
      return cached.data as T;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const etag = response.headers.get('ETag') ?? undefined;

    // Guardar en caché
    this.cache.set(cacheKey, {
      data,
      expiry: Date.now() + ttl,
      etag
    });

    // Indexar por tags
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(cacheKey);
    });

    return data;
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Invalidar cachés relacionadas
    this.invalidateByPattern(endpoint);

    return response.json();
  }

  invalidateByTag(tag: string): void {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      keys.forEach(key => this.cache.delete(key));
      this.tagIndex.delete(tag);
    }
  }

  invalidateByPattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  invalidateAll(): void {
    this.cache.clear();
    this.tagIndex.clear();
  }
}

// Uso
const api = new CachedAPIClient('https://api.example.com');

// Cache con tags para invalidación
const users = await api.get('/users', { 
  cache: true, 
  ttl: 300000,
  tags: ['users']
});

// Deduplicación automática - solo un request
const [r1, r2, r3] = await Promise.all([
  api.get('/users/1'),
  api.get('/users/1'),
  api.get('/users/1')
]);

// Invalidar después de mutación
await api.post('/users', { name: 'New User' });
// Caché de /users se invalida automáticamente
```

## 5. PROFILING & MONITORING

### Performance API
- **MUST**: Usar performance.mark/measure para métricas
- **MUST**: Enviar métricas a analytics

```typescript
// ✅ CORRECTO - Performance Monitor
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();
  private marks: Set<string> = new Set();
  private beaconUrl?: string;
  private sampleRate: number;

  constructor(options: { beaconUrl?: string; sampleRate?: number } = {}) {
    this.beaconUrl = options.beaconUrl;
    this.sampleRate = options.sampleRate ?? 1.0;
  }

  mark(name: string): void {
    if (this.sampleRate < 1 && Math.random() > this.sampleRate) return;
    
    const markName = `${name}_start`;
    performance.mark(markName);
    this.marks.add(markName);
  }

  measure(name: string, startMark?: string, endMark?: string): number | null {
    if (this.sampleRate < 1 && Math.random() > this.sampleRate) return null;

    const start = startMark ?? `${name}_start`;
    const end = endMark ?? `${name}_end`;

    try {
      performance.mark(end);
      const measure = performance.measure(name, start, end);
      const duration = measure.duration;

      // Guardar métrica
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      this.metrics.get(name)!.push(duration);

      // Cleanup
      performance.clearMarks(start);
      performance.clearMarks(end);
      performance.clearMeasures(name);
      this.marks.delete(start);

      return duration;
    } catch (error) {
      console.warn(`Failed to measure ${name}:`, error);
      return null;
    }
  }

  // Medir función automáticamente
  measureFunction<T extends (...args: unknown[]) => unknown>(
    name: string,
    fn: T
  ): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
      this.mark(name);
      try {
        const result = fn(...args);
        
        if (result instanceof Promise) {
          return result.finally(() => {
            this.measure(name);
          }) as ReturnType<T>;
        }
        
        this.measure(name);
        return result;
      } catch (error) {
        this.measure(name);
        throw error;
      }
    }) as T;
  }

  // Métricas de Web Vitals
  observeWebVitals(): void {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.report('LCP', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const fid = entry.processingStart - entry.startTime;
        this.report('FID', fid);
      }
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as unknown as { hadRecentInput: boolean }).hadRecentInput) {
          clsValue += (entry as unknown as { value: number }).value;
        }
      }
      this.report('CLS', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });

    // Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const ttfb = navigation.responseStart - navigation.startTime;
      this.report('TTFB', ttfb);
    }
  }

  // Long Task detection
  observeLongTasks(): void {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.report('LongTask', entry.duration);
        
        // Log si es crítico
        if (entry.duration > 100) {
          console.warn('Long task detected:', entry.duration, 'ms');
        }
      }
    }).observe({ entryTypes: ['longtask'] });
  }

  getStats(name: string): { avg: number; min: number; max: number; count: number } | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    return {
      avg: sum / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    };
  }

  private report(metric: string, value: number): void {
    // Enviar a analytics
    if (this.beaconUrl && navigator.sendBeacon) {
      navigator.sendBeacon(this.beaconUrl, JSON.stringify({
        metric,
        value,
        timestamp: Date.now(),
        url: window.location.href
      }));
    }

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${metric}: ${value.toFixed(2)}ms`);
    }
  }

  flush(): void {
    if (this.beaconUrl && navigator.sendBeacon) {
      const data = JSON.stringify({
        metrics: Object.fromEntries(this.metrics),
        url: window.location.href,
        timestamp: Date.now()
      });
      navigator.sendBeacon(this.beaconUrl, data);
    }
    this.metrics.clear();
  }
}

// Uso
const perf = new PerformanceMonitor({ 
  beaconUrl: '/api/metrics',
  sampleRate: 0.1 
});

// Medir función
const heavyComputation = perf.measureFunction('fibonacci', (n: number): number => {
  if (n < 2) return n;
  return heavyComputation(n - 1) + heavyComputation(n - 2);
});

// Medir bloque manual
async function loadData(): Promise<void> {
  perf.mark('dataLoad');
  const data = await fetch('/api/data').then(r => r.json());
  perf.measure('dataLoad');
  return data;
}

// Iniciar monitoreo
perf.observeWebVitals();
perf.observeLongTasks();
```

### Memory Profiling
- **MUST**: Usar Chrome DevTools Memory tab
- **MUST**: Hacer heap snapshots antes/después

```typescript
// ✅ CORRECTO - Memory Profiler helper
class MemoryProfiler {
  private snapshots: { name: string; time: number; heap: number }[] = [];
  private isProfiling = false;

  startProfiling(): void {
    if (this.isProfiling) return;
    this.isProfiling = true;
    
    // Forzar GC si está disponible (Node.js o Chrome con flag)
    if ('gc' in globalThis) {
      (globalThis as unknown as { gc: () => void }).gc();
    }

    this.takeSnapshot('start');
  }

  takeSnapshot(label: string): void {
    const heap = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize;
    
    this.snapshots.push({
      name: label,
      time: performance.now(),
      heap: heap ?? 0
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Memory] ${label}: ${this.formatBytes(heap ?? 0)}`);
    }
  }

  endProfiling(): MemoryReport {
    this.takeSnapshot('end');
    this.isProfiling = false;

    const report = this.generateReport();
    
    if (process.env.NODE_ENV === 'development') {
      console.table(report.comparisons);
    }

    return report;
  }

  private generateReport(): MemoryReport {
    const comparisons: MemoryComparison[] = [];
    
    for (let i = 1; i < this.snapshots.length; i++) {
      const current = this.snapshots[i];
      const previous = this.snapshots[i - 1];
      
      comparisons.push({
        from: previous.name,
        to: current.name,
        delta: current.heap - previous.heap,
        deltaFormatted: this.formatBytes(current.heap - previous.heap),
        duration: current.time - previous.time
      });
    }

    return {
      snapshots: [...this.snapshots],
      comparisons,
      totalDelta: this.snapshots[this.snapshots.length - 1].heap - this.snapshots[0].heap
    };
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  reset(): void {
    this.snapshots = [];
    this.isProfiling = false;
  }
}

interface MemoryReport {
  snapshots: { name: string; time: number; heap: number }[];
  comparisons: MemoryComparison[];
  totalDelta: number;
}

interface MemoryComparison {
  from: string;
  to: string;
  delta: number;
  deltaFormatted: string;
  duration: number;
}

// Memory leak detector
class MemoryLeakDetector {
  private measurements: number[] = [];
  private maxMeasurements: number;
  private threshold: number;

  constructor(options: { maxMeasurements?: number; threshold?: number } = {}) {
    this.maxMeasurements = options.maxMeasurements ?? 10;
    this.threshold = options.threshold ?? 1.1; // 10% growth
  }

  check(): { hasLeak: boolean; growthRate: number } {
    const heap = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize ?? 0;
    this.measurements.push(heap);

    if (this.measurements.length > this.maxMeasurements) {
      this.measurements.shift();
    }

    if (this.measurements.length < 3) {
      return { hasLeak: false, growthRate: 0 };
    }

    const first = this.measurements[0];
    const last = this.measurements[this.measurements.length - 1];
    const growthRate = last / first;

    return {
      hasLeak: growthRate > this.threshold,
      growthRate
    };
  }
}

// Uso
const profiler = new MemoryProfiler();
const leakDetector = new MemoryLeakDetector();

// Test de memoria
async function testComponent(): Promise<void> {
  profiler.startProfiling();
  
  const component = new HeavyComponent();
  profiler.takeSnapshot('after-creation');
  
  // Simular uso
  await component.loadData();
  profiler.takeSnapshot('after-data');
  
  component.destroy();
  
  // Esperar GC
  await new Promise(r => setTimeout(r, 1000));
  profiler.takeSnapshot('after-cleanup');
  
  const report = profiler.endProfiling();
  
  // Verificar que no haya leak
  if (report.totalDelta > 1024 * 1024) { // > 1MB
    console.warn('Possible memory leak detected:', report.totalDelta);
  }
}
```

## 6. WEB WORKERS

### Offloading
- **MUST**: Mover cálculos pesados a Worker
- **MUST**: Usar Transferable Objects para datos grandes
- **WHY**: Mantiene main thread libre para UI

```typescript
// ✅ CORRECTO - Worker Pool
interface WorkerTask<T, R> {
  id: string;
  data: T;
  resolve: (result: R) => void;
  reject: (error: Error) => void;
}

interface WorkerWrapper {
  worker: Worker;
  busy: boolean;
  taskId?: string;
}

class WorkerPool {
  private workers: WorkerWrapper[] = [];
  private queue: WorkerTask<unknown, unknown>[] = [];
  private taskMap = new Map<string, WorkerTask<unknown, unknown>>();

  constructor(
    private workerScript: string,
    private poolSize: number = navigator.hardwareConcurrency || 4
  ) {
    this.initialize();
  }

  private initialize(): void {
    for (let i = 0; i < this.poolSize; i++) {
      this.createWorker();
    }
  }

  private createWorker(): void {
    const worker = new Worker(this.workerScript);
    const wrapper: WorkerWrapper = { worker, busy: false };

    worker.onmessage = (e) => {
      const { id, result, error } = e.data;
      const task = this.taskMap.get(id);

      if (task) {
        if (error) {
          task.reject(new Error(error));
        } else {
          task.resolve(result);
        }
        this.taskMap.delete(id);
      }

      wrapper.busy = false;
      wrapper.taskId = undefined;
      this.processQueue();
    };

    worker.onerror = (error) => {
      console.error('Worker error:', error);
      if (wrapper.taskId) {
        const task = this.taskMap.get(wrapper.taskId);
        if (task) {
          task.reject(new Error('Worker error'));
          this.taskMap.delete(wrapper.taskId);
        }
      }
      wrapper.busy = false;
      this.processQueue();
    };

    this.workers.push(wrapper);
  }

  execute<T, R>(data: T, transferables?: Transferable[]): Promise<R> {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}-${Math.random()}`;
      const task: WorkerTask<T, R> = { id, data, resolve, reject };
      
      this.taskMap.set(id, task as WorkerTask<unknown, unknown>);
      this.queue.push(task as WorkerTask<unknown, unknown>);
      
      this.processQueue(transferables);
    });
  }

  private processQueue(transferables?: Transferable[]): void {
    if (this.queue.length === 0) return;

    const availableWorker = this.workers.find(w => !w.busy);
    if (!availableWorker) return;

    const task = this.queue.shift()!;
    availableWorker.busy = true;
    availableWorker.taskId = task.id;

    availableWorker.worker.postMessage(
      { id: task.id, data: task.data },
      { transfer: transferables }
    );
  }

  terminate(): void {
    this.workers.forEach(w => w.worker.terminate());
    this.workers = [];
    this.queue = [];
    
    // Reject pending tasks
    this.taskMap.forEach(task => {
      task.reject(new Error('Worker pool terminated'));
    });
    this.taskMap.clear();
  }
}

// ✅ CORRECTO - Worker para procesamiento de datos
// worker.ts (compilado a worker.js)
/*
self.onmessage = (e) => {
  const { id, data } = e.data;
  
  try {
    const result = heavyProcessing(data);
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ id, error: error.message });
  }
};

function heavyProcessing(data: Float64Array): Float64Array {
  // Procesamiento intensivo
  const result = new Float64Array(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = Math.sqrt(data[i] * data[i] + data[i] * 2);
  }
  return result;
}
*/

// Cliente tipado
class DataProcessor {
  private pool: WorkerPool;

  constructor() {
    this.pool = new WorkerPool('/workers/data-processor.js', 4);
  }

  async processLargeDataset(data: Float64Array): Promise<Float64Array> {
    // Transfer ownership - no copy!
    const result = await this.pool.execute<Float64Array, Float64Array>(
      data,
      [data.buffer]
    );
    
    return result;
  }

  async processMultiple(datasets: Float64Array[]): Promise<Float64Array[]> {
    return Promise.all(
      datasets.map(data => this.processLargeDataset(data))
    );
  }

  terminate(): void {
    this.pool.terminate();
  }
}

// ✅ CORRECTO - Worker para image processing
class ImageProcessor {
  private pool: WorkerPool;

  constructor() {
    this.pool = new WorkerPool('/workers/image-worker.js', 2);
  }

  async applyFilter(
    imageData: ImageData,
    filter: 'blur' | 'sharpen' | 'grayscale'
  ): Promise<ImageData> {
    // Transfer ArrayBuffer para evitar copia
    const buffer = imageData.data.buffer;
    
    const result = await this.pool.execute<
      { data: Uint8ClampedArray; width: number; height: number; filter: string },
      Uint8ClampedArray
    >(
      {
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
        filter
      },
      [buffer]
    );

    return new ImageData(
      new Uint8ClampedArray(result),
      imageData.width,
      imageData.height
    );
  }

  async resize(
    imageData: ImageData,
    newWidth: number,
    newHeight: number
  ): Promise<ImageData> {
    const result = await this.pool.execute(
      {
        data: imageData.data,
        width: imageData.width,
        height: imageData.height,
        newWidth,
        newHeight
      },
      [imageData.data.buffer]
    );

    return new ImageData(
      new Uint8ClampedArray(result as Uint8ClampedArray),
      newWidth,
      newHeight
    );
  }
}

// ✅ CORRECTO - Worker para sorting/grandes datasets
class SortWorker {
  private worker: Worker;

  constructor() {
    this.worker = new Worker('/workers/sort-worker.js');
  }

  sort<T extends number | string>(
    array: T[],
    compareFn?: (a: T, b: T) => number
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString();

      this.worker.onmessage = (e) => {
        if (e.data.id === id) {
          if (e.data.error) {
            reject(new Error(e.data.error));
          } else {
            resolve(e.data.result);
          }
        }
      };

      // Para arrays grandes, usar Transferable
      const isLargeArray = array.length > 10000;
      const data = isLargeArray && typeof array[0] === 'number'
        ? new Float64Array(array as number[])
        : array;

      const transferables = isLargeArray && data instanceof Float64Array
        ? [data.buffer]
        : undefined;

      this.worker.postMessage(
        { id, data, compareFn: compareFn?.toString() },
        { transfer: transferables }
      );
    });
  }

  terminate(): void {
    this.worker.terminate();
  }
}

// Uso en main thread
async function processInWorker(): Promise<void> {
  const processor = new DataProcessor();
  
  // Array grande
  const data = new Float64Array(1000000);
  for (let i = 0; i < data.length; i++) {
    data[i] = Math.random();
  }

  // UI no se bloquea
  const result = await processor.processLargeDataset(data);
  console.log('Processed:', result.length);
  
  processor.terminate();
}
```

---

## CHECKLIST RÁPIDO

### Memory
- [ ] WeakMap/WeakSet para referencias temporales
- [ ] Object pooling para objetos frecuentes
- [ ] Limpieza de event listeners
- [ ] Uso de FinalizationRegistry

### Rendimiento
- [ ] Debounce para input/resize
- [ ] Throttle (con RAF) para scroll/mouse
- [ ] IntersectionObserver para lazy loading
- [ ] Memoization con límites

### Arquitectura
- [ ] Dynamic imports para code splitting
- [ ] Web Workers para cálculos pesados
- [ ] Transferable Objects para datos grandes
- [ ] Caché estratégica con invalidación

### Monitoreo
- [ ] Performance.mark/measure
- [ ] Web Vitals tracking
- [ ] Memory profiling en dev
- [ ] Métricas en producción
