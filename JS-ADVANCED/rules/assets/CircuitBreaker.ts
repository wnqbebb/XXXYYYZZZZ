/**
 * Circuit Breaker Pattern
 * Resiliencia para servicios externos
 */

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenMaxCalls: number;
  successThreshold?: number;
}

export interface CircuitBreakerMetrics {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  totalCalls: number;
  rejectedCalls: number;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private successes = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private totalCalls = 0;
  private rejectedCalls = 0;
  private halfOpenCalls = 0;
  private nextAttempt = 0;

  constructor(
    private fn: (...args: any[]) => Promise<any>,
    private options: CircuitBreakerOptions
  ) {}

  async execute<T>(...args: any[]): Promise<T> {
    this.totalCalls++;

    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        this.rejectedCalls++;
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
      this.halfOpenCalls = 0;
      this.successes = 0;
    }

    if (this.state === 'HALF_OPEN') {
      if (this.halfOpenCalls >= this.options.halfOpenMaxCalls) {
        this.rejectedCalls++;
        throw new Error('Circuit breaker is HALF_OPEN');
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await this.fn(...args);
      this.onSuccess();
      return result as T;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.lastSuccessTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      this.successes++;
      if (this.successes >= (this.options.successThreshold || 1)) {
        this.reset();
      }
    } else {
      this.failures = 0;
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.state === 'HALF_OPEN') {
      this.trip();
    } else if (this.failures >= this.options.failureThreshold) {
      this.trip();
    }
  }

  private trip(): void {
    this.state = 'OPEN';
    this.nextAttempt = Date.now() + this.options.resetTimeout;
  }

  private reset(): void {
    this.state = 'CLOSED';
    this.failures = 0;
    this.successes = 0;
    this.halfOpenCalls = 0;
  }

  forceOpen(): void {
    this.state = 'OPEN';
    this.nextAttempt = Infinity;
  }

  forceClosed(): void {
    this.reset();
  }

  getMetrics(): CircuitBreakerMetrics {
    return {
      state: this.state,
      failures: this.failures,
      successes: this.successes,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalCalls: this.totalCalls,
      rejectedCalls: this.rejectedCalls
    };
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Decorator para métodos de clase
export function CircuitBreakerDecorator(options: CircuitBreakerOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const breaker = new CircuitBreaker(originalMethod.bind(target), options);

    descriptor.value = async function (...args: any[]) {
      return breaker.execute(...args);
    };

    descriptor.value.circuitBreaker = breaker;
  };
}
