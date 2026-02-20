/**
 * Event Utilities
 * Debounce, Throttle, Event Delegation
 */

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): Promise<ReturnType<T>>;
  cancel(): void;
  flush(): Promise<ReturnType<T>> | undefined;
}

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): DebouncedFunction<T> {
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

  const debounced = (...args: Parameters<T>): Promise<ReturnType<T>> => {
    lastArgs = args;
    
    if (timer === null) {
      return Promise.resolve(leading ? invoke(Date.now()) : result);
    }
    
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (trailing && lastArgs) {
        invoke(Date.now());
      }
      timer = null;
    }, delay);
    
    return Promise.resolve(result);
  };

  debounced.cancel = (): void => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
    lastCallTime = null;
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

export interface ThrottledFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel(): void;
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;
  let lastCall = 0;
  let lastArgs: Parameters<T> | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const invoke = (): void => {
    fn(...lastArgs!);
    lastArgs = null;
    lastCall = Date.now();
  };

  const throttled = (...args: Parameters<T>): void => {
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

  throttled.cancel = (): void => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };

  return throttled;
}

export function rafThrottle<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => void {
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

// Event Delegation
export class EventDelegator {
  private listeners = new Map<string, Map<string, EventListener>>();

  constructor(private root: EventTarget) {}

  on(
    event: string,
    selector: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Map());
      this.root.addEventListener(event, this.handleEvent.bind(this), options);
    }

    const key = `${event}:${selector}`;
    this.listeners.get(event)!.set(key, handler);

    return () => this.off(event, selector);
  }

  private handleEvent(e: Event): void {
    const handlers = this.listeners.get(e.type);
    if (!handlers) return;

    const target = e.target as HTMLElement;
    
    handlers.forEach((handler, key) => {
      const [, selector] = key.split(':');
      if (target.matches(selector) || target.closest(selector)) {
        handler(e);
      }
    });
  }

  private off(event: string, selector: string): void {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    const key = `${event}:${selector}`;
    handlers.delete(key);

    if (handlers.size === 0) {
      this.root.removeEventListener(event, this.handleEvent.bind(this));
      this.listeners.delete(event);
    }
  }

  destroy(): void {
    this.listeners.forEach((_, event) => {
      this.root.removeEventListener(event, this.handleEvent.bind(this));
    });
    this.listeners.clear();
  }
}

// AbortController-based event manager
export class EventManager {
  private controllers = new Map<string, AbortController>();

  addListener(
    target: EventTarget,
    event: string,
    handler: EventListener,
    scope: string = 'default',
    options?: AddEventListenerOptions
  ): void {
    if (!this.controllers.has(scope)) {
      this.controllers.set(scope, new AbortController());
    }

    const controller = this.controllers.get(scope)!;
    target.addEventListener(event, handler, {
      ...options,
      signal: controller.signal
    });
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
