# Web Workers y Multithreading

## Web Workers API

```typescript
// Main Thread
class WorkerPool {
  private workers: Worker[] = [];
  private queue: Array<{
    id: string;
    data: unknown;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];
  private active = new Map<string, Worker>();
  private workerScript: string;

  constructor(workerScript: string, poolSize: number = navigator.hardwareConcurrency ?? 4) {
    this.workerScript = workerScript;
    
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker(workerScript, { type: 'module' });
      worker.onmessage = (e) => this.handleMessage(e);
      worker.onerror = (e) => this.handleError(e);
      this.workers.push(worker);
    }
  }

  async execute<T>(data: unknown): Promise<T> {
    const id = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      this.queue.push({ id, data, resolve, reject });
      this.processQueue();
    });
  }

  private processQueue(): void {
    if (this.queue.length === 0) return;
    
    const availableWorker = this.workers.find(w => !Array.from(this.active.values()).includes(w));
    if (!availableWorker) return;

    const task = this.queue.shift()!;
    this.active.set(task.id, availableWorker);
    
    availableWorker.postMessage({ id: task.id, data: task.data });
  }

  private handleMessage(e: MessageEvent): void {
    const { id, result, error } = e.data;
    const task = this.queue.find(t => t.id === id);
    
    if (task) {
      if (error) {
        task.reject(new Error(error));
      } else {
        task.resolve(result);
      }
      this.active.delete(id);
      this.processQueue();
    }
  }

  private handleError(e: ErrorEvent): void {
    console.error('Worker error:', e);
  }

  terminate(): void {
    this.workers.forEach(w => w.terminate());
    this.queue.forEach(t => t.reject(new Error('Pool terminated')));
    this.workers = [];
    this.queue = [];
    this.active.clear();
  }
}

// Worker Script (worker.ts)
self.onmessage = (e: MessageEvent) => {
  const { id, data } = e.data;
  
  try {
    const result = processData(data);
    self.postMessage({ id, result });
  } catch (error) {
    self.postMessage({ 
      id, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
};

function processData(data: unknown): unknown {
  // CPU-intensive task
  return data;
}

export {};
```

---

## SharedArrayBuffer y Atomics

```typescript
// Sincronización con Atomics
class ConcurrentCounter {
  private buffer: SharedArrayBuffer;
  private counter: Int32Array;

  constructor(initialValue: number = 0) {
    this.buffer = new SharedArrayBuffer(4); // 4 bytes for 32-bit int
    this.counter = new Int32Array(this.buffer);
    Atomics.store(this.counter, 0, initialValue);
  }

  increment(): number {
    return Atomics.add(this.counter, 0, 1);
  }

  decrement(): number {
    return Atomics.sub(this.counter, 0, 1);
  }

  get(): number {
    return Atomics.load(this.counter, 0);
  }

  compareAndSwap(expected: number, newValue: number): boolean {
    return Atomics.compareExchange(this.counter, 0, expected, newValue) === expected;
  }

  getBuffer(): SharedArrayBuffer {
    return this.buffer;
  }
}

// Lock simple con Atomics
class SpinLock {
  private buffer: SharedArrayBuffer;
  private lock: Int32Array;

  constructor() {
    this.buffer = new SharedArrayBuffer(4);
    this.lock = new Int32Array(this.buffer);
    Atomics.store(this.lock, 0, 0); // 0 = unlocked, 1 = locked
  }

  acquire(): void {
    // Spin until we acquire the lock
    while (Atomics.compareExchange(this.lock, 0, 0, 1) !== 0) {
      Atomics.wait(this.lock, 0, 1); // Wait if locked
    }
  }

  release(): void {
    Atomics.store(this.lock, 0, 0);
    Atomics.notify(this.lock, 0, 1); // Notify one waiter
  }

  execute<T>(fn: () => T): T {
    this.acquire();
    try {
      return fn();
    } finally {
      this.release();
    }
  }
}

// Ring Buffer concurrente
class ConcurrentRingBuffer<T> {
  private buffer: SharedArrayBuffer;
  private head: Int32Array;
  private tail: Int32Array;
  private data: Int32Array;
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    const bufferSize = 12 + capacity * 4; // head + tail + data
    this.buffer = new SharedArrayBuffer(bufferSize);
    
    this.head = new Int32Array(this.buffer, 0, 1);
    this.tail = new Int32Array(this.buffer, 4, 1);
    this.data = new Int32Array(this.buffer, 12, capacity);
    
    Atomics.store(this.head, 0, 0);
    Atomics.store(this.tail, 0, 0);
  }

  push(value: number): boolean {
    const tail = Atomics.load(this.tail, 0);
    const nextTail = (tail + 1) % this.capacity;
    
    if (nextTail === Atomics.load(this.head, 0)) {
      return false; // Buffer full
    }
    
    Atomics.store(this.data, tail, value);
    Atomics.store(this.tail, 0, nextTail);
    Atomics.notify(this.tail, 0);
    return true;
  }

  pop(): number | undefined {
    const head = Atomics.load(this.head, 0);
    
    if (head === Atomics.load(this.tail, 0)) {
      return undefined; // Buffer empty
    }
    
    const value = Atomics.load(this.data, head);
    Atomics.store(this.head, 0, (head + 1) % this.capacity);
    Atomics.notify(this.head, 0);
    return value;
  }

  waitForPush(timeout?: number): boolean {
    const tail = Atomics.load(this.tail, 0);
    return Atomics.wait(this.tail, 0, tail, timeout) === 'ok';
  }

  waitForPop(timeout?: number): boolean {
    const head = Atomics.load(this.head, 0);
    return Atomics.wait(this.head, 0, head, timeout) === 'ok';
  }
}
```

---

## Comlink Pattern

```typescript
// Comlink-like RPC entre main y worker
interface RpcMessage {
  id: string;
  type: 'call' | 'response' | 'error';
  method?: string;
  args?: unknown[];
  result?: unknown;
  error?: string;
}

class RpcWorker<T> {
  private worker: Worker;
  private pending = new Map<string, { resolve: Function; reject: Function }>();
  private proxy: T;

  constructor(workerScript: string) {
    this.worker = new Worker(workerScript, { type: 'module' });
    this.worker.onmessage = (e) => this.handleMessage(e.data);
    
    this.proxy = new Proxy({} as T, {
      get: (_, prop: string) => {
        return (...args: unknown[]) => this.call(prop, args);
      }
    });
  }

  getProxy(): T {
    return this.proxy;
  }

  private async call(method: string, args: unknown[]): Promise<unknown> {
    const id = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.worker.postMessage({
        id,
        type: 'call',
        method,
        args
      } as RpcMessage);
    });
  }

  private handleMessage(msg: RpcMessage): void {
    const pending = this.pending.get(msg.id);
    if (!pending) return;

    this.pending.delete(msg.id);

    if (msg.type === 'response') {
      pending.resolve(msg.result);
    } else if (msg.type === 'error') {
      pending.reject(new Error(msg.error));
    }
  }

  terminate(): void {
    this.pending.forEach(({ reject }) => 
      reject(new Error('Worker terminated'))
    );
    this.worker.terminate();
  }
}

// Worker-side RPC handler
class RpcWorkerHost<T extends Record<string, Function>> {
  constructor(private implementation: T) {
    self.onmessage = (e: MessageEvent<RpcMessage>) => {
      this.handleMessage(e.data);
    };
  }

  private async handleMessage(msg: RpcMessage): Promise<void> {
    if (msg.type !== 'call') return;

    try {
      const method = this.implementation[msg.method!];
      if (!method) {
        throw new Error(`Method ${msg.method} not found`);
      }

      const result = await method.apply(this.implementation, msg.args || []);
      
      self.postMessage({
        id: msg.id,
        type: 'response',
        result
      } as RpcMessage);
    } catch (error) {
      self.postMessage({
        id: msg.id,
        type: 'error',
        error: error instanceof Error ? error.message : String(error)
      } as RpcMessage);
    }
  }
}

// Usage
// worker.ts
interface Calculator {
  add(a: number, b: number): Promise<number>;
  factorial(n: number): Promise<number>;
}

const calculator = {
  add: (a: number, b: number) => a + b,
  factorial: (n: number) => {
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }
};

new RpcWorkerHost(calculator);

// main.ts
const worker = new RpcWorker<Calculator>('./worker.ts');
const calc = worker.getProxy();

const sum = await calc.add(5, 3);
const fact = await calc.factorial(20);
```

---

## Service Workers

```typescript
// service-worker.ts
const CACHE_NAME = 'v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/styles.css'
];

// Install: Cache static assets
self.addEventListener('install', (e: ExtendableEvent) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => (self as any as ServiceWorkerGlobalScope).skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (e: ExtendableEvent) => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => (self as any as ServiceWorkerGlobalScope).clients.claim())
  );
});

// Fetch: Cache strategies
self.addEventListener('fetch', (e: FetchEvent) => {
  const { request } = e;
  
  // API requests: Network first, cache fallback
  if (request.url.includes('/api/')) {
    e.respondWith(networkFirst(request));
    return;
  }
  
  // Static assets: Cache first, network fallback
  if (request.destination === 'image' || request.destination === 'style') {
    e.respondWith(cacheFirst(request));
    return;
  }
  
  // Default: Stale while revalidate
  e.respondWith(staleWhileRevalidate(request));
});

// Cache strategies
async function networkFirst(request: Request): Promise<Response> {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error('Network error and no cache');
  }
}

async function cacheFirst(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  const networkResponse = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cached = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    caches.open(CACHE_NAME).then(cache => {
      cache.put(request, networkResponse.clone());
    });
    return networkResponse;
  });
  
  return cached || fetchPromise;
}

// Background Sync
self.addEventListener('sync', (e: SyncEvent) => {
  if (e.tag === 'sync-orders') {
    e.waitUntil(syncPendingOrders());
  }
});

async function syncPendingOrders(): Promise<void> {
  const db = await openDB('pending-orders', 1);
  const orders = await db.getAll('orders');
  
  for (const order of orders) {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: { 'Content-Type': 'application/json' }
      });
      await db.delete('orders', order.id);
    } catch (error) {
      console.error('Failed to sync order:', order.id);
    }
  }
}

// Push Notifications
self.addEventListener('push', (e: PushEvent) => {
  const data = e.data?.json() ?? {};
  
  e.waitUntil(
    (self as any as ServiceWorkerGlobalScope).registration.showNotification(
      data.title || 'New Notification',
      {
        body: data.body,
        icon: '/icon.png',
        badge: '/badge.png',
        data: data.url,
        actions: data.actions || []
      }
    )
  );
});

self.addEventListener('notificationclick', (e: NotificationEvent) => {
  e.notification.close();
  
  e.waitUntil(
    (self as any as ServiceWorkerGlobalScope).clients.openWindow(e.notification.data)
  );
});
```
