/**
 * Observable Pattern
 * Implementación tipo RxJS simplificada
 */

export interface Observer<T> {
  next: (value: T) => void;
  error?: (err: Error) => void;
  complete?: () => void;
}

export interface Subscription {
  unsubscribe(): void;
  get closed(): boolean;
}

export type UnaryFunction<T, R> = (source: T) => R;

export class Observable<T> {
  constructor(
    private subscribeFn: (observer: Observer<T>) => (() => void) | void
  ) {}

  subscribe(observer: Partial<Observer<T>>): Subscription {
    let closed = false;
    let cleanup: (() => void) | void;

    const fullObserver: Observer<T> = {
      next: (value) => {
        if (!closed && observer.next) {
          try {
            observer.next(value);
          } catch (err) {
            if (observer.error) {
              observer.error(err as Error);
            }
          }
        }
      },
      error: (err) => {
        if (!closed && observer.error) {
          closed = true;
          observer.error(err);
        }
      },
      complete: () => {
        if (!closed && observer.complete) {
          closed = true;
          observer.complete();
        }
      }
    };

    cleanup = this.subscribeFn(fullObserver);

    return {
      unsubscribe: () => {
        if (!closed) {
          closed = true;
          cleanup?.();
        }
      },
      get closed() {
        return closed;
      }
    };
  }

  // Operators
  pipe<A>(op1: UnaryFunction<Observable<T>, A>): A;
  pipe<A, B>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>): B;
  pipe<A, B, C>(op1: UnaryFunction<Observable<T>, A>, op2: UnaryFunction<A, B>, op3: UnaryFunction<B, C>): C;
  pipe(...operators: UnaryFunction<any, any>[]): any {
    return operators.reduce((prev, fn) => fn(prev), this);
  }

  map<R>(fn: (value: T) => R): Observable<R> {
    return new Observable(observer => {
      return this.subscribe({
        next: (value) => observer.next(fn(value)),
        error: (err) => observer.error?.(err),
        complete: () => observer.complete?.()
      });
    });
  }

  filter(predicate: (value: T) => boolean): Observable<T> {
    return new Observable(observer => {
      return this.subscribe({
        next: (value) => {
          if (predicate(value)) {
            observer.next(value);
          }
        },
        error: (err) => observer.error?.(err),
        complete: () => observer.complete?.()
      });
    });
  }

  debounceTime(ms: number): Observable<T> {
    return new Observable(observer => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      return this.subscribe({
        next: (value) => {
          if (timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            observer.next(value);
          }, ms);
        },
        error: (err) => observer.error?.(err),
        complete: () => {
          if (timeoutId) clearTimeout(timeoutId);
          observer.complete?.();
        }
      });
    });
  }

  distinctUntilChanged(compare?: (a: T, b: T) => boolean): Observable<T> {
    return new Observable(observer => {
      let previous: T;
      let hasPrevious = false;

      return this.subscribe({
        next: (value) => {
          if (!hasPrevious || (compare ? !compare(previous, value) : previous !== value)) {
            previous = value;
            hasPrevious = true;
            observer.next(value);
          }
        },
        error: (err) => observer.error?.(err),
        complete: () => observer.complete?.()
      });
    });
  }

  scan<R>(accumulator: (acc: R, value: T) => R, seed: R): Observable<R> {
    return new Observable(observer => {
      let acc = seed;

      return this.subscribe({
        next: (value) => {
          acc = accumulator(acc, value);
          observer.next(acc);
        },
        error: (err) => observer.error?.(err),
        complete: () => observer.complete?.()
      });
    });
  }

  take(count: number): Observable<T> {
    return new Observable(observer => {
      let taken = 0;
      let subscription: Subscription | null = null;

      subscription = this.subscribe({
        next: (value) => {
          if (taken < count) {
            observer.next(value);
            taken++;
            if (taken >= count) {
              observer.complete?.();
              subscription?.unsubscribe();
            }
          }
        },
        error: (err) => observer.error?.(err),
        complete: () => observer.complete?.()
      });

      return () => subscription?.unsubscribe();
    });
  }

  // Static creation operators
  static of<T>(...values: T[]): Observable<T> {
    return new Observable(observer => {
      values.forEach(value => observer.next(value));
      observer.complete?.();
    });
  }

  static from<T>(iterable: Iterable<T>): Observable<T> {
    return new Observable(observer => {
      try {
        for (const value of iterable) {
          observer.next(value);
        }
        observer.complete?.();
      } catch (err) {
        observer.error?.(err as Error);
      }
    });
  }

  static fromEvent<T extends Event>(
    target: EventTarget,
    eventName: string
  ): Observable<T> {
    return new Observable(observer => {
      const handler = (event: Event) => observer.next(event as T);
      target.addEventListener(eventName, handler);
      return () => target.removeEventListener(eventName, handler);
    });
  }

  static interval(ms: number): Observable<number> {
    return new Observable(observer => {
      let count = 0;
      const intervalId = setInterval(() => {
        observer.next(count++);
      }, ms);
      return () => clearInterval(intervalId);
    });
  }

  static merge<T>(...observables: Observable<T>[]): Observable<T> {
    return new Observable(observer => {
      let completed = 0;
      const subscriptions: Subscription[] = [];

      observables.forEach(obs => {
        subscriptions.push(obs.subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error?.(err),
          complete: () => {
            completed++;
            if (completed >= observables.length) {
              observer.complete?.();
            }
          }
        }));
      });

      return () => subscriptions.forEach(s => s.unsubscribe());
    });
  }
}

// Subject - Observable que puede emitir valores
export class Subject<T> extends Observable<T> {
  private observers: Observer<T>[] = [];
  private _closed = false;

  constructor() {
    super(observer => {
      this.observers.push(observer);
      return () => {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
          this.observers.splice(index, 1);
        }
      };
    });
  }

  next(value: T): void {
    if (this._closed) return;
    this.observers.forEach(observer => {
      try {
        observer.next(value);
      } catch (err) {
        observer.error?.(err as Error);
      }
    });
  }

  error(err: Error): void {
    if (this._closed) return;
    this._closed = true;
    this.observers.forEach(observer => observer.error?.(err));
    this.observers = [];
  }

  complete(): void {
    if (this._closed) return;
    this._closed = true;
    this.observers.forEach(observer => observer.complete?.());
    this.observers = [];
  }

  get closed(): boolean {
    return this._closed;
  }
}

// BehaviorSubject - tiene valor actual
export class BehaviorSubject<T> extends Subject<T> {
  private currentValue: T;

  constructor(initialValue: T) {
    super();
    this.currentValue = initialValue;
  }

  get value(): T {
    return this.currentValue;
  }

  next(value: T): void {
    this.currentValue = value;
    super.next(value);
  }

  subscribe(observer: Partial<Observer<T>>): Subscription {
    const subscription = super.subscribe(observer);
    if (!subscription.closed && observer.next) {
      observer.next(this.currentValue);
    }
    return subscription;
  }
}
