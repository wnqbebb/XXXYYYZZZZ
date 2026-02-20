/**
 * Memoization Utilities
 * Cache de resultados de funciones
 */

export class LRUCache<K, V> {
  private cache = new Map<K, V>();

  constructor(private maxSize: number) {}

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
      // Eliminar el más antiguo (primero)
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

export interface MemoizeOptions<T extends (...args: any[]) => any> {
  maxSize?: number;
  keyGenerator?: (...args: Parameters<T>) => string;
  ttl?: number;
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions<T> = {}
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

// Async memoization
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: MemoizeOptions<T> = {}
): T {
  const { maxSize = 100, keyGenerator, ttl } = options;
  const cache = new LRUCache<string, { promise: Promise<any>; expiry: number }>(maxSize);

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && (ttl === undefined || Date.now() < cached.expiry)) {
      return cached.promise;
    }

    const promise = fn(...args);
    cache.set(key, {
      promise,
      expiry: ttl ? Date.now() + ttl : Infinity
    });

    return promise;
  }) as T;
}

// WeakMap-based memoization for object arguments
export function weakMemoize<T extends (obj: object, ...args: any[]) => any>(
  fn: T
): T {
  const cache = new WeakMap<object, Map<string, ReturnType<T>>>();

  return ((obj: object, ...args: any[]): ReturnType<T> => {
    if (!cache.has(obj)) {
      cache.set(obj, new Map());
    }

    const objCache = cache.get(obj)!;
    const key = JSON.stringify(args);

    if (!objCache.has(key)) {
      objCache.set(key, fn(obj, ...args));
    }

    return objCache.get(key)!;
  }) as T;
}

// Deep equality memoization
export function deepMemoize<T extends (...args: any[]) => any>(
  fn: T,
  options: { maxSize?: number; ttl?: number } = {}
): T {
  const { maxSize = 100, ttl } = options;
  const cache: Array<{
    args: any[];
    value: ReturnType<T>;
    expiry: number;
  }> = [];

  const deepEqual = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a !== 'object' || a === null || b === null) return false;
    
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    
    return keysA.every(key => deepEqual(a[key], b[key]));
  };

  return ((...args: Parameters<T>): ReturnType<T> => {
    const now = Date.now();
    
    const cached = cache.find(entry => 
      deepEqual(entry.args, args) && entry.expiry > now
    );
    
    if (cached) {
      return cached.value;
    }

    const value = fn(...args) as ReturnType<T>;
    
    if (cache.length >= maxSize) {
      cache.shift();
    }
    
    cache.push({
      args,
      value,
      expiry: ttl ? now + ttl : Infinity
    });

    return value;
  }) as T;
}
