---
name: async
description: Asynchronous programming patterns, Event Loop deep dive, and best practices
tags: [async, promises, event-loop, web-workers, concurrency, atomics]
version: 2.0.0
---

# Patrones Asíncronos Avanzados

> **"Understanding the Event Loop is understanding JavaScript."**

## Índice

1. [Promise Patterns](#1-promise-patterns)
2. [Async/Await Best Practices](#2-asyncawait-best-practices)
3. [Event Loop Deep Dive](#3-event-loop-deep-dive)
4. [AbortController & Cancellation](#4-abortcontroller--cancellation)
5. [Web Workers Integration](#5-web-workers-integration)
6. [SharedArrayBuffer & Atomics](#6-sharedarraybuffer--atomics)

---

## 1. PROMISE PATTERNS

### Promise.all con Manejo de Errores

- **MUST**: Usar `.catch()` en cada promise individual para evitar que un error detenga todo
- **MUST**: Tipar correctamente los resultados con fallbacks
- **FORBIDDEN**: `Promise.all` sin manejo de errores individuales
- **WHY**: Un rechazo en Promise.all rechaza todo el resultado. El patrón individual.catch() permite resultados parciales.

```typescript
// ✅ CORRECTO - Manejo de errores individual
interface DashboardData {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

async function fetchDashboardData(): Promise<DashboardData> {
  const [users, posts, comments] = await Promise.all([
    fetchUsers().catch((err) => {
      console.error('Failed to fetch users:', err);
      return [] as User[];
    }),
    fetchPosts().catch((err) => {
      console.error('Failed to fetch posts:', err);
      return [] as Post[];
    }),
    fetchComments().catch((err) => {
      console.error('Failed to fetch comments:', err);
      return [] as Comment[];
    })
  ]);

  return { users, posts, comments };
}

// ❌ INCORRECTO - Sin manejo individual, un fallo arruina todo
try {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),    // Si falla, todo falla
    fetchPosts(),
    fetchComments()
  ]);
} catch (error) {
  // No sabemos cuál falló ni tenemos datos parciales
}
```

### Promise.allSettled

- **MUST**: Usar cuando necesitas todos los resultados independientemente de éxito o fallo
- **MUST**: Verificar `status` antes de acceder a `value` o `reason`
- **FORBIDDEN**: Usar `Promise.all` cuando necesitas procesar resultados parciales
- **WHY**: allSettled nunca rechaza; siempre resuelve con el estado de cada promise

```typescript
// ✅ CORRECTO - Procesamiento de resultados parciales
interface SettledResult<T> {
  successful: T[];
  failed: { index: number; reason: unknown }[];
}

async function fetchWithFallback<T>(
  fetchers: Array<() => Promise<T>>
): Promise<SettledResult<T>> {
  const results = await Promise.allSettled(fetchers.map(f => f()));
  
  const successful: T[] = [];
  const failed: { index: number; reason: unknown }[] = [];
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      successful.push(result.value);
    } else {
      failed.push({ index, reason: result.reason });
    }
  });
  
  return { successful, failed };
}

// ✅ TYPE GUARD para narrowing seguro
function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

function isRejected<T>(result: PromiseSettledResult<T>): result is PromiseRejectedResult {
  return result.status === 'rejected';
}

// Uso con type guards:
const results = await Promise.allSettled([fetchA(), fetchB(), fetchC()]);
const values = results.filter(isFulfilled).map(r => r.value);
const errors = results.filter(isRejected).map(r => r.reason);

// ❌ INCORRECTO - Acceso inseguro a value
const results = await Promise.allSettled([fetchA(), fetchB()]);
results.forEach(r => {
  console.log(r.value); // ❌ TypeScript error, puede ser rejected
});
```

### Promise.race vs Promise.any

- **MUST**: Usar `Promise.race` para timeouts (primero en completar, éxito o error)
- **MUST**: Usar `Promise.any` para "primera respuesta exitosa"
- **FORBIDDEN**: `Promise.race` cuando necesitas el primer éxito ignorando rechazos
- **WHY**: 
  - `race`: primera en settle (resolve o reject)
  - `any`: primera en fulfill (solo resolve; si todas rechazan → AggregateError)

```typescript
// ✅ Promise.race - TIMEOUT PATTERN (primero en completar)
class TimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  abortController?: AbortController
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      abortController?.abort();
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// ✅ Promise.any - PRIMERA RESPUESTA EXITOSA
async function fetchFromMultipleSources<T>(urls: string[]): Promise<T> {
  const controllers = urls.map(() => new AbortController());
  
  const fetchPromises = urls.map((url, index) => 
    fetch(url, { signal: controllers[index].signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
      })
      .finally(() => {
        // Cancelar otras requests cuando una gane
        controllers.forEach((c, i) => {
          if (i !== index) c.abort();
        });
      })
  );

  try {
    return await Promise.any(fetchPromises);
  } catch (error) {
    // AggregateError contiene TODOS los errores
    if (error instanceof AggregateError) {
      console.error('All sources failed:', error.errors);
    }
    throw error;
  }
}

// ❌ INCORRECTO - Usar race cuando quieres el primer éxito
// Si una promise rechaza rápido, race devuelve el rechazo
const result = await Promise.race([
  fetchFastButMightFail(),  // ❌ Rechaza inmediatamente
  fetchSlowButReliable()    // Nunca se considera
]);
```

### Sequential Async con Reduce

- **MUST**: Usar `reduce` con `Promise` acumulador para secuencias dinámicas
- **MUST**: Mantener tipado a través de la cadena de reducción
- **FORBIDDEN**: `for` loop sin acumulación de estado asíncrono
- **WHY**: El patrón reduce mantiene el estado acumulado de forma funcional

```typescript
// ✅ SECUENCIAL CON REDUCE - Cadena dependiente
type AsyncReducer<T, R> = (acc: R, item: T) => Promise<R>;

async function reduceAsync<T, R>(
  items: T[],
  reducer: AsyncReducer<T, R>,
  initialValue: R
): Promise<R> {
  return items.reduce(
    async (accPromise: Promise<R>, item: T) => {
      const acc = await accPromise;
      return reducer(acc, item);
    },
    Promise.resolve(initialValue)
  );
}

// ✅ EJEMPLO: Migraciones de base de datos
interface Migration {
  version: number;
  up: (db: Database) => Promise<void>;
  down: (db: Database) => Promise<void>;
}

async function runMigrations(
  db: Database,
  migrations: Migration[],
  targetVersion: number
): Promise<void> {
  await reduceAsync(migrations, async (_, migration) => {
    if (migration.version <= targetVersion) {
      console.log(`Running migration ${migration.version}`);
      await migration.up(db);
    }
  }, undefined);
}

// ✅ PIPELINE ASÍNCRONA TIPADA
class AsyncPipeline<T> {
  private operations: Array<(input: unknown) => Promise<unknown>> = [];

  add<R>(operation: (input: T) => Promise<R>): AsyncPipeline<R> {
    this.operations.push(operation as (input: unknown) => Promise<unknown>);
    return this as unknown as AsyncPipeline<R>;
  }

  async execute(initialValue: T): Promise<unknown> {
    return this.operations.reduce(
      async (acc, operation) => operation(await acc),
      Promise.resolve(initialValue)
    );
  }
}

// Uso:
const result = await new AsyncPipeline<string>()
  .add(async (url) => fetch(url))
  .add(async (res) => res.json())
  .add(async (data) => processData(data))
  .execute('https://api.example.com/data');

// ❌ INCORRECTO - Sin acumulación de estado
async function badSequential(items: Item[]) {
  const results = [];
  for (const item of items) {
    results.push(await process(item)); // No hay acceso al resultado anterior
  }
  return results;
}
```

### Parallel con Limitación de Concurrencia

- **MUST**: Limitar concurrencia para evitar sobrecarga de recursos
- **MUST**: Implementar retry con backoff exponencial
- **FORBIDDEN**: `Promise.all` con arrays grandes sin limitación
- **WHY**: Recursos limitados (conexiones HTTP, CPU, memoria) requieren throttling

```typescript
// ✅ POOL DE PROMESAS CON CONCURRENCIA LIMITADA
interface PoolOptions {
  concurrency: number;
  retryAttempts?: number;
  retryDelay?: number;
}

interface PoolResult<T> {
  fulfilled: Array<{ index: number; value: T }>;
  rejected: Array<{ index: number; error: unknown }>;
}

async function promisePool<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: PoolOptions
): Promise<PoolResult<R>> {
  const { concurrency, retryAttempts = 0, retryDelay = 1000 } = options;
  
  const results = new Map<number, R>();
  const errors = new Map<number, unknown>();
  const executing = new Set<Promise<void>>();
  
  async function processWithRetry(
    item: T,
    index: number,
    attempt: number = 0
  ): Promise<void> {
    try {
      const result = await processor(item, index);
      results.set(index, result);
    } catch (error) {
      if (attempt < retryAttempts) {
        await delay(retryDelay * Math.pow(2, attempt)); // Backoff exponencial
        return processWithRetry(item, index, attempt + 1);
      }
      errors.set(index, error);
    }
  }
  
  for (let i = 0; i < items.length; i++) {
    const promise = processWithRetry(items[i], i).then(() => {
      executing.delete(promise);
    });
    
    executing.add(promise);
    
    if (executing.size >= concurrency) {
      await Promise.race(executing);
    }
  }
  
  await Promise.all(executing);
  
  return {
    fulfilled: Array.from(results.entries()).map(([index, value]) => ({
      index,
      value
    })),
    rejected: Array.from(errors.entries()).map(([index, error]) => ({
      index,
      error
    }))
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ✅ USO PRÁCTICO - Upload de archivos
async function uploadFiles(files: File[]): Promise<void> {
  const results = await promisePool(
    files,
    async (file, index) => {
      console.log(`Uploading ${index + 1}/${files.length}: ${file.name}`);
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }
      return response.text();
    },
    { 
      concurrency: 3,      // Máximo 3 uploads simultáneos
      retryAttempts: 2,    // Reintentar hasta 2 veces
      retryDelay: 1000     // Empezar con 1s de delay
    }
  );
  
  console.log(`Success: ${results.fulfilled.length}`);
  console.log(`Failed: ${results.rejected.length}`);
}

// ❌ INCORRECTO - Promise.all sin limitación
const results = await Promise.all(
  files.map(f => uploadFile(f)) // 1000 uploads simultáneos = crash
);
```

### Async Pool Pattern (Worker Pool)

- **MUST**: Implementar patrón de pool reutilizable para recursos costosos
- **MUST**: Manejar graceful shutdown con cleanup
- **WHY**: La creación/destrucción frecuente de workers es costosa

```typescript
// ✅ ASYNC POOL ORIENTADO A OBJETOS
interface PoolTask<T, R> {
  item: T;
  resolve: (value: R) => void;
  reject: (reason: unknown) => void;
}

interface WorkerAdapter<T, R> {
  execute(item: T): Promise<R>;
  terminate(): void | Promise<void>;
}

class AsyncPool<T, R> {
  private queue: PoolTask<T, R>[] = [];
  private activeWorkers = 0;
  private workers: WorkerAdapter<T, R>[];
  private isShutdown = false;

  constructor(
    createWorker: () => WorkerAdapter<T, R>,
    private options: { concurrency: number }
  ) {
    this.workers = Array.from(
      { length: options.concurrency },
      createWorker
    );
  }

  async execute(item: T): Promise<R> {
    if (this.isShutdown) {
      throw new Error('Pool is shutdown');
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.activeWorkers >= this.options.concurrency || this.queue.length === 0) {
      return;
    }

    const workerIndex = this.activeWorkers;
    this.activeWorkers++;
    const worker = this.workers[workerIndex];

    while (this.queue.length > 0 && !this.isShutdown) {
      const task = this.queue.shift()!;
      try {
        const result = await worker.execute(task.item);
        task.resolve(result);
      } catch (error) {
        task.reject(error);
      }
    }

    this.activeWorkers--;
  }

  async shutdown(graceful: boolean = true): Promise<void> {
    this.isShutdown = true;

    if (!graceful) {
      // Rechazar tareas pendientes
      while (this.queue.length > 0) {
        const task = this.queue.shift()!;
        task.reject(new Error('Pool shutdown'));
      }
    }

    // Esperar a que terminen las tareas activas
    while (this.activeWorkers > 0) {
      await delay(100);
    }

    // Terminar workers
    await Promise.all(this.workers.map(w => w.terminate()));
  }
}

// Uso con Web Workers:
const workerPool = new AsyncPool(
  () => ({
    execute: (data: number[]) => runWorkerTask(data),
    terminate: () => {} // Cleanup si es necesario
  }),
  { concurrency: navigator.hardwareConcurrency ?? 4 }
);
```

---

## 2. ASYNC/AWAIT BEST PRACTICES

### Error Handling con try/catch

- **MUST**: Crear jerarquía de errores tipados
- **MUST**: Usar type guards para discriminar errores
- **FORBIDDEN**: `catch (e) { return null; }` - silenciar errores
- **WHY**: Errores tipados permiten manejo selectivo y logging apropiado

```typescript
// ✅ JERARQUÍA DE ERRORES
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 0;
}

class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>
  ) {
    super(message);
  }
}

class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
}

// ✅ RESULT TYPE (Functional Error Handling)
type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function safeAsync<T>(
  promise: Promise<T>
): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof AppError 
        ? error 
        : new Error(String(error)) as AppError
    };
  }
}

// ✅ USO CON TYPE NARROWING
async function loadUserProfile(userId: string): Promise<void> {
  const result = await safeAsync(fetchUserData(userId));
  
  if (!result.success) {
    switch (result.error.code) {
      case 'NOT_FOUND':
        showNotFoundMessage();
        break;
      case 'NETWORK_ERROR':
        showOfflineMessage();
        break;
      case 'VALIDATION_ERROR':
        showValidationErrors(result.error.fieldErrors);
        break;
      default:
        showGenericError();
    }
    return;
  }
  
  displayUser(result.data);
}

// ❌ INCORRECTO - Silenciar errores
try {
  await riskyOperation();
} catch (e) {
  // NUNCA hacer esto - errores silenciados son bugs ocultos
}
```

### Top-Level Await

- **MUST**: Usar en módulos ES6 para inicialización
- **MUST**: Proveer fallback para errores de carga
- **FORBIDDEN**: Top-level await sin manejo de errores
- **WHY**: Simplifica código de inicialización; módulos dependientes esperan automáticamente

```typescript
// ✅ CONFIGURACIÓN CON FALLBACK
// config.ts
interface Config {
  apiUrl: string;
  timeout: number;
  features: Record<string, boolean>;
}

const rawConfig = await readFile('./config.json', 'utf-8')
  .catch(() => '{}');

export const config: Config = {
  apiUrl: 'http://localhost:3000',
  timeout: 5000,
  features: {},
  ...JSON.parse(rawConfig)
};

// ✅ INICIALIZACIÓN ORDENADA
// db.ts
const pool = createPool({
  host: process.env.DB_HOST ?? 'localhost',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'app'
});

await pool.query('SELECT 1');
console.log('Database connected');
export { pool };

// ✅ CARGA CONDICIONAL
const environment = process.env.NODE_ENV ?? 'development';
const configModule = await import(`./config.${environment}.ts`);
export const appConfig = configModule.default;

// app.ts - Todo se inicializa en orden de dependencias
import { config } from './config.ts';
import { db } from './db.ts';
import { cache } from './cache.ts';

await db.migrate();
await cache.connect();
export const app = createApp({ db, cache, config });

// ❌ INCORRECTO - Sin manejo de errores
export const config = await fetch('/api/config').then(r => r.json());
// Si falla, el módulo no se carga y no hay fallback
```

### Async Iterables

- **MUST**: Usar `for await...of` para procesamiento de streams
- **MUST**: Implementar `[Symbol.asyncIterator]` para fuentes de datos paginadas
- **WHY**: Permite procesar datos en chunks sin cargar todo en memoria

```typescript
// ✅ GENERADOR ASÍNCRONO
async function* fetchPaginatedData<T>(
  endpoint: string,
  pageSize: number = 100
): AsyncGenerator<T[], void, unknown> {
  let page = 0;
  let hasMore = true;
  
  while (hasMore) {
    const response = await fetch(
      `${endpoint}?page=${page}&limit=${pageSize}`
    );
    const data: T[] = await response.json();
    
    if (data.length === 0) {
      hasMore = false;
    } else {
      yield data;
      page++;
    }
  }
}

// Uso eficiente:
for await (const batch of fetchPaginatedData<User>('/api/users')) {
  for (const user of batch) {
    await processUser(user);
  }
}

// ✅ STREAM DE ARCHIVO GRANDE
async function* readLines(filePath: string): AsyncGenerator<string, void, unknown> {
  const fileStream = createReadStream(filePath, { encoding: 'utf-8' });
  const rl = createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  for await (const line of rl) {
    yield line;
  }
}

// ✅ BATCH PROCESSING
async function* batch<T>(
  source: AsyncIterable<T>,
  size: number
): AsyncGenerator<T[], void, unknown> {
  let batch: T[] = [];
  
  for await (const item of source) {
    batch.push(item);
    if (batch.length >= size) {
      yield batch;
      batch = [];
    }
  }
  
  if (batch.length > 0) {
    yield batch;
  }
}

// Uso: Insertar en batches de 50
for await (const userBatch of batch(fetchPaginatedData('/api/users'), 50)) {
  await db.users.insertMany(userBatch);
}

// ✅ EARLY TERMINATION
async function findFirst<T>(
  source: AsyncIterable<T>,
  predicate: (item: T) => boolean
): Promise<T | undefined> {
  for await (const item of source) {
    if (predicate(item)) {
      return item; // Se detiene al encontrar el primero
    }
  }
  return undefined;
}
```

---

## 3. EVENT LOOP DEEP DIVE

### Microtasks vs Macrotasks

- **MUST**: Entender el orden de ejecución para evitar bugs de timing
- **MUST**: Usar `queueMicrotask` para operaciones que deben ejecutarse antes del render
- **WHY**: Microtasks se ejecutan antes del siguiente macrotask y antes de repaints

```typescript
// ✅ ORDEN DE EJECUCIÓN
console.log('1. Script start');

setTimeout(() => console.log('2. Macrotask (setTimeout)'), 0);

queueMicrotask(() => console.log('3. Microtask (queueMicrotask)'));

Promise.resolve().then(() => console.log('4. Microtask (Promise)'));

console.log('5. Script end');

// Output:
// 1. Script start
// 5. Script end
// 3. Microtask (queueMicrotask)
// 4. Microtask (Promise)
// 2. Macrotask (setTimeout)

// ✅ USAR queueMicrotask PARA BATCHING
class Batcher<T> {
  private items: T[] = [];
  private scheduled = false;

  add(item: T): void {
    this.items.push(item);
    
    if (!this.scheduled) {
      this.scheduled = true;
      queueMicrotask(() => this.flush());
    }
  }

  private flush(): void {
    const batch = this.items;
    this.items = [];
    this.scheduled = false;
    
    // Procesar todo el batch sincrónicamente
    processBatch(batch);
  }
}

// ❌ INCORRECTO - setTimeout para operaciones urgentes
setTimeout(() => updateUI(), 0); 
// El browser puede renderizar antes, causando flicker
```

### process.nextTick vs queueMicrotask

- **MUST**: Usar `queueMicrotask` en código cross-platform (browser + Node.js)
- **MUST**: Usar `process.nextTick` solo en Node.js para operaciones críticas de performance
- **WHY**: 
  - `nextTick` se ejecuta ANTES de cualquier otro microtask (más rápido pero puede starve el event loop)
  - `queueMicrotask` es el estándar ECMAScript, consistente en todos los runtimes

```typescript
// ✅ queueMicrotask - Cross-platform
async function scheduleWork<T>(work: () => T): Promise<T> {
  return new Promise((resolve) => {
    queueMicrotask(() => {
      resolve(work());
    });
  });
}

// ✅ Node.js específico - nextTick para máxima prioridad
// Útil para librerías de streams donde cada tick cuenta
import { nextTick } from 'process';

function highPriorityWork(callback: () => void): void {
  nextTick(callback); // Se ejecuta antes que Promise.then()
}

// ⚠️ CUIDADO: nextTick puede causar starvation
function dangerousRecursion(count: number): void {
  if (count > 0) {
    nextTick(() => dangerousRecursion(count - 1));
    // Nunca permite que otros microtasks se ejecuten
  }
}
```

### setImmediate vs setTimeout(0)

- **MUST**: Usar `setImmediate` en Node.js para operaciones después de I/O
- **MUST**: En browser, usar `setTimeout(fn, 0)` (no hay setImmediate nativo)
- **WHY**: 
  - `setImmediate`: Ejecuta después de I/O, antes de timers
  - `setTimeout(0)`: Mínimo 4ms delay en browsers (HTML5 spec)

```typescript
// ✅ Node.js - setImmediate para defer después de I/O
import { setImmediate } from 'timers';

function deferAfterIO(callback: () => void): void {
  setImmediate(callback); // Más eficiente que setTimeout(0)
}

// ✅ Cross-platform fallback
const defer = typeof setImmediate === 'function' 
  ? setImmediate 
  : (fn: () => void) => setTimeout(fn, 0);

// ✅ EJEMPLO: Yield al event loop para UI responsive
async function heavyComputationWithYield(
  items: number[],
  onProgress: (percent: number) => void
): Promise<number[]> {
  const results: number[] = [];
  const batchSize = 100;
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    results.push(...batch.map(expensiveOperation));
    
    onProgress((i / items.length) * 100);
    
    // Yield para permitir actualizaciones de UI
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return results;
}
```

---

## 4. ABORTCONTROLLER & CANCELLATION

### Cancelación de Fetch

- **MUST**: Usar `AbortController` para requests cancelables
- **MUST**: Componer señales para múltiples fuentes de cancelación
- **WHY**: Evita memory leaks, race conditions y trabajo innecesario

```typescript
// ✅ ABORT CONTROLLER BÁSICO
class CancellableRequest<T> {
  private controller: AbortController;
  private promise: Promise<T>;
  
  constructor(
    executor: (signal: AbortSignal) => Promise<T>
  ) {
    this.controller = new AbortController();
    this.promise = executor(this.controller.signal);
  }
  
  get signal(): AbortSignal {
    return this.controller.signal;
  }
  
  cancel(reason?: string): void {
    this.controller.abort(reason);
  }
  
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }
}

// ✅ COMPOSICIÓN DE SEÑALES
function composeSignals(...signals: (AbortSignal | undefined)[]): AbortSignal {
  const controller = new AbortController();
  
  for (const signal of signals) {
    if (!signal) continue;
    
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    
    signal.addEventListener('abort', () => {
      controller.abort(signal.reason);
    }, { once: true });
  }
  
  return controller.signal;
}

// ✅ FETCH CON TIMEOUT Y CANCELACIÓN
async function fetchWithCancellation(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout, ...fetchOptions } = options;
  const controller = new AbortController();
  
  const fetchPromise = fetch(url, {
    ...fetchOptions,
    signal: composeSignals(controller.signal, fetchOptions.signal)
  });
  
  if (timeout) {
    const timeoutId = setTimeout(() => {
      controller.abort(new TimeoutError(timeout));
    }, timeout);
    
    try {
      const response = await fetchPromise;
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }
  
  return fetchPromise;
}

// ✅ DETECTAR ABORT ERROR
function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

// Uso:
try {
  const response = await fetch(url, { signal });
} catch (error) {
  if (isAbortError(error)) {
    console.log('Request was cancelled');
    return;
  }
  throw error;
}
```

---

## 5. WEB WORKERS INTEGRATION

### Async Worker API

- **MUST**: Envolver Worker en Promise-based API con timeout
- **MUST**: Manejar errores de worker y cleanup automático
- **WHY**: La API nativa de Workers es callback-based y propensa a memory leaks

```typescript
// ✅ ASYNC WORKER WRAPPER
interface WorkerMessage<T = unknown> {
  id: string;
  type: 'request' | 'response' | 'error' | 'progress';
  payload: T;
  error?: string;
  progress?: { current: number; total: number };
}

class AsyncWorker {
  private worker: Worker;
  private pendingRequests = new Map<string, {
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
    timeout: ReturnType<typeof setTimeout>;
  }>();
  private progressHandlers = new Map<string, (progress: { current: number; total: number }) => void>();
  
  constructor(workerScript: string | URL) {
    this.worker = new Worker(workerScript, { type: 'module' });
    this.worker.onmessage = (e: MessageEvent<WorkerMessage>) => {
      this.handleMessage(e.data);
    };
    this.worker.onerror = (error) => {
      console.error('Worker error:', error);
      this.rejectAll(error);
    };
  }
  
  async execute<T>(
    task: string, 
    data: unknown, 
    options: { timeoutMs?: number; onProgress?: (p: { current: number; total: number }) => void } = {}
  ): Promise<T> {
    const { timeoutMs = 30000, onProgress } = options;
    const id = crypto.randomUUID();
    
    if (onProgress) {
      this.progressHandlers.set(id, onProgress);
    }
    
    return new Promise<T>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        this.progressHandlers.delete(id);
        reject(new TimeoutError(timeoutMs));
      }, timeoutMs);
      
      this.pendingRequests.set(id, { resolve, reject, timeout });
      
      this.worker.postMessage({
        id,
        type: 'request',
        task,
        payload: data
      });
    });
  }
  
  private handleMessage(message: WorkerMessage): void {
    const request = this.pendingRequests.get(message.id);
    if (!request) return;
    
    if (message.type === 'progress' && message.progress) {
      this.progressHandlers.get(message.id)?.(message.progress);
      return;
    }
    
    clearTimeout(request.timeout);
    this.pendingRequests.delete(message.id);
    this.progressHandlers.delete(message.id);
    
    if (message.type === 'error') {
      request.reject(new Error(message.error || 'Worker error'));
    } else {
      request.resolve(message.payload);
    }
  }
  
  private rejectAll(error: unknown): void {
    this.pendingRequests.forEach(({ reject, timeout }) => {
      clearTimeout(timeout);
      reject(error);
    });
    this.pendingRequests.clear();
    this.progressHandlers.clear();
  }
  
  terminate(): void {
    this.rejectAll(new Error('Worker terminated'));
    this.worker.terminate();
  }
}

// ✅ WORKER POOL
class WorkerPool {
  private workers: AsyncWorker[] = [];
  private queue: Array<{ task: string; data: unknown; resolve: (v: unknown) => void; reject: (r: unknown) => void }> = [];
  private activeWorkers = new Set<number>();
  
  constructor(
    workerScript: string | URL,
    poolSize: number = navigator.hardwareConcurrency ?? 4
  ) {
    for (let i = 0; i < poolSize; i++) {
      this.workers.push(new AsyncWorker(workerScript));
    }
  }
  
  async execute<T>(task: string, data: unknown, timeoutMs?: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, data, resolve, reject });
      this.processQueue();
    });
  }
  
  private processQueue(): void {
    if (this.queue.length === 0) return;
    
    const availableIndex = this.workers.findIndex((_, i) => !this.activeWorkers.has(i));
    if (availableIndex === -1) return;
    
    const task = this.queue.shift()!;
    this.activeWorkers.add(availableIndex);
    
    this.workers[availableIndex].execute(task.task, task.task)
      .then(task.resolve)
      .catch(task.reject)
      .finally(() => {
        this.activeWorkers.delete(availableIndex);
        this.processQueue();
      });
  }
  
  terminate(): void {
    this.workers.forEach(w => w.terminate());
    this.queue.forEach(t => t.reject(new Error('Pool terminated')));
    this.queue = [];
  }
}
```

---

## 6. SHAREDARRAYBUFFER & ATOMICS

### Patrones de Memoria Compartida

- **MUST**: Usar `Atomics` para sincronización thread-safe
- **MUST**: Entender los costos de transfer vs. shared memory
- **FORBIDDEN**: Acceso no-atómico a SharedArrayBuffer desde múltiples threads
- **WHY**: SharedArrayBuffer permite zero-copy communication; Atomics previene race conditions

```typescript
// ✅ CREAR SHARED ARRAY BUFFER
const SHARED_SIZE = 1024 * 1024; // 1MB
const sharedBuffer = new SharedArrayBuffer(SHARED_SIZE);
const sharedArray = new Int32Array(sharedBuffer);

// ✅ ATOMICS - Operaciones thread-safe
// Escribir valor (retorna valor escrito)
Atomics.store(sharedArray, 0, 42);

// Leer valor (retorna valor leído)
const value = Atomics.load(sharedArray, 0);

// Suma atómica (retorna valor anterior)
const previous = Atomics.add(sharedArray, 1, 10);

// AND, OR, XOR atómicos
Atomics.and(sharedArray, 2, 0xFF);
Atomics.or(sharedArray, 3, 0x01);

// Compare and Exchange (CAS)
// Si index 0 === 42, escribir 100. Retorna valor anterior.
const oldValue = Atomics.compareExchange(sharedArray, 0, 42, 100);

// ✅ SINCRONIZACIÓN CON ATOMICS.WAIT Y ATOMICS.NOTIFY
// Worker thread espera por condición:
Atomics.wait(sharedArray, 0, 0); // Espera hasta que index 0 !== 0

// Main thread notifica:
Atomics.store(sharedArray, 0, 1);
Atomics.notify(sharedArray, 0, 1); // Despierta 1 waiter

// ✅ POOL DE WORKERS CON SAB
class SharedWorkerPool {
  private workers: Worker[] = [];
  private taskQueue: SharedArrayBuffer;
  private resultQueue: SharedArrayBuffer;
  private controlBuffer: SharedArrayBuffer;
  
  constructor(poolSize: number = 4) {
    // Control: [nextTaskId, completedCount, activeWorkers]
    this.controlBuffer = new SharedArrayBuffer(3 * Int32Array.BYTES_PER_ELEMENT);
    this.taskQueue = new SharedArrayBuffer(poolSize * 64); // 64 bytes por tarea
    this.resultQueue = new SharedArrayBuffer(poolSize * 64);
    
    for (let i = 0; i < poolSize; i++) {
      const worker = new Worker('./sab-worker.js', { type: 'module' });
      worker.postMessage({
        workerId: i,
        control: this.controlBuffer,
        tasks: this.taskQueue,
        results: this.resultQueue
      }, [this.controlBuffer, this.taskQueue, this.resultQueue]);
      this.workers.push(worker);
    }
  }
  
  execute(task: unknown): Promise<unknown> {
    return new Promise((resolve) => {
      const taskId = Atomics.add(new Int32Array(this.controlBuffer), 0, 1);
      // Escribir tarea y notificar worker...
    });
  }
}

// ✅ RING BUFFER CONCURRENT-SAFE (produtor-consumidor)
class AtomicRingBuffer<T extends ArrayBufferView> {
  private buffer: SharedArrayBuffer;
  private data: T;
  private head: Int32Array;  // Posición de escritura
  private tail: Int32Array;  // Posición de lectura
  private size: number;
  
  constructor(
    TypedArray: new (buffer: SharedArrayBuffer) => T,
    capacity: number
  ) {
    this.size = capacity;
    // 4 bytes para head, 4 para tail, resto para datos
    this.buffer = new SharedArrayBuffer(8 + capacity * (TypedArray as unknown as typeof Int8Array).BYTES_PER_ELEMENT);
    this.head = new Int32Array(this.buffer, 0, 1);
    this.tail = new Int32Array(this.buffer, 4, 1);
    this.data = new TypedArray(this.buffer, 8);
  }
  
  push(value: number): boolean {
    const currentHead = Atomics.load(this.head, 0);
    const nextHead = (currentHead + 1) % this.size;
    
    if (nextHead === Atomics.load(this.tail, 0)) {
      return false; // Buffer lleno
    }
    
    this.data[currentHead] = value;
    Atomics.store(this.head, 0, nextHead);
    Atomics.notify(this.head, 0, 1);
    return true;
  }
  
  pop(): number | null {
    const currentTail = Atomics.load(this.tail, 0);
    
    if (currentTail === Atomics.load(this.head, 0)) {
      return null; // Buffer vacío
    }
    
    const value = this.data[currentTail];
    Atomics.store(this.tail, 0, (currentTail + 1) % this.size);
    return value;
  }
}

// ❌ INCORRECTO - Acceso no-atómico desde múltiples threads
// Thread 1:
sharedArray[0] = sharedArray[0] + 1; // Read-Modify-Write no-atómico

// Thread 2:
sharedArray[0] = sharedArray[0] + 1; // Race condition! Pérdida de actualizaciones

// ✅ CORRECTO:
Atomics.add(sharedArray, 0, 1); // Thread-safe
```

### COOP y COEP Headers

Para usar `SharedArrayBuffer`, el servidor debe enviar headers de seguridad:

```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

```typescript
// ✅ DETECTAR SOPORTE
function isSharedArrayBufferSupported(): boolean {
  try {
    new SharedArrayBuffer(1);
    return true;
  } catch {
    return false;
  }
}

// ✅ FALLBACK GRACEFUL
async function parallelProcess(
  data: number[],
  workerScript: string
): Promise<number[]> {
  if (isSharedArrayBufferSupported()) {
    // Usar SAB para zero-copy
    const sab = new SharedArrayBuffer(data.length * 4);
    const sharedArray = new Int32Array(sab);
    sharedArray.set(data);
    
    const worker = new Worker(workerScript);
    worker.postMessage({ buffer: sab }, [sab]);
    
    return new Promise((resolve) => {
      worker.onmessage = () => resolve(Array.from(sharedArray));
    });
  } else {
    // Fallback: Transferable ArrayBuffer o structured clone
    const worker = new Worker(workerScript);
    worker.postMessage({ data });
    
    return new Promise((resolve) => {
      worker.onmessage = (e) => resolve(e.data);
    });
  }
}
```

---

## Quick Reference

| Patrón | Cuándo Usar | Evitar |
|--------|-------------|--------|
| `Promise.all` | Operaciones independientes | Sin .catch() individual |
| `Promise.allSettled` | Necesitas todos los resultados | Cuando un error debe detener todo |
| `Promise.race` | Timeouts o primera en completar | Cuando necesitas el primer éxito ignorando rechazos |
| `Promise.any` | Primera respuesta exitosa | Cuando el orden importa |
| `queueMicrotask` | Antes del siguiente macrotask | En lugar de Promise.resolve() |
| `setImmediate` | Después de I/O (Node.js) | En browsers (no existe) |
| `Atomics` | Sincronización SAB | Datos no-compartidos |
| `SharedArrayBuffer` | Zero-copy entre workers | Cuando COOP/COEP no están disponibles |

## Checklist de Revisión

- [ ] ¿Las operaciones paralelas usan `Promise.all` con manejo individual?
- [ ] ¿Se usa `Promise.allSettled` cuando se necesitan resultados parciales?
- [ ] ¿Se entiende la diferencia entre `race` y `any`?
- [ ] ¿Las funciones async tienen manejo de errores tipados?
- [ ] ¿Se limita concurrencia con Promise Pool para arrays grandes?
- [ ] ¿Se usa `queueMicrotask` para operaciones urgentes post-sync?
- [ ] ¿Los fetch requests usan AbortController con timeout?
- [ ] ¿Workers tienen timeout y manejo de errores?
- [ ] ¿SharedArrayBuffer usa Atomics para acceso sincronizado?
- [ ] ¿Hay graceful fallback si SAB no está soportado?
