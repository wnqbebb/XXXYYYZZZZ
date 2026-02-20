// lib/circuit-breaker.ts
// Circuit breaker pattern for resilient API calls

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenMaxCalls?: number;
  onStateChange?: (state: CircuitState) => void;
}

/**
 * Circuit breaker implementation for preventing cascading failures
 */
export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private halfOpenCalls = 0;

  constructor(
    private operation: (...args: any[]) => Promise<any>,
    private options: CircuitBreakerOptions = {}
  ) {
    this.options = {
      failureThreshold: 5,
      resetTimeout: 60000, // 1 minute
      halfOpenMaxCalls: 3,
      ...options,
    };
  }

  /**
   * Execute operation with circuit breaker protection
   */
  async execute(...args: any[]): Promise<any> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.transitionTo('HALF_OPEN');
        this.halfOpenCalls = 0;
      } else {
        throw new CircuitBreakerError('Circuit breaker is OPEN');
      }
    }

    if (this.state === 'HALF_OPEN' && this.halfOpenCalls >= (this.options.halfOpenMaxCalls || 3)) {
      throw new CircuitBreakerError('Circuit breaker is HALF_OPEN - max calls reached');
    }

    if (this.state === 'HALF_OPEN') {
      this.halfOpenCalls++;
    }

    try {
      const result = await this.operation(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Get current circuit state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get current failure count
   */
  getFailureCount(): number {
    return this.failureCount;
  }

  /**
   * Manually reset the circuit breaker
   */
  reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.halfOpenCalls = 0;
    this.transitionTo('CLOSED');
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.transitionTo('CLOSED');
    this.lastFailureTime = null;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= (this.options.failureThreshold || 5)) {
      this.transitionTo('OPEN');
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime >= (this.options.resetTimeout || 60000);
  }

  private transitionTo(state: CircuitState): void {
    if (this.state !== state) {
      this.state = state;
      this.options.onStateChange?.(state);
    }
  }
}

/**
 * Custom error for circuit breaker
 */
export class CircuitBreakerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerError';
  }
}

/**
 * Create a circuit breaker for Resend email operations
 */
export function createEmailCircuitBreaker(
  sendEmailFn: (data: any) => Promise<any>,
  options?: CircuitBreakerOptions
): CircuitBreaker {
  return new CircuitBreaker(sendEmailFn, {
    failureThreshold: 3,
    resetTimeout: 30000, // 30 seconds
    ...options,
  });
}

// Usage example:
// 
// const resendBreaker = createEmailCircuitBreaker(
//   (emailData) => resend.emails.send(emailData),
//   {
//     failureThreshold: 3,
//     resetTimeout: 30000,
//     onStateChange: (state) => {
//       console.log(`Circuit breaker state changed to: ${state}`);
//     },
//   }
// );
// 
// // In API route:
// try {
//   const result = await resendBreaker.execute(emailData);
//   return Response.json({ success: true, data: result });
// } catch (error) {
//   if (error instanceof CircuitBreakerError) {
//     return Response.json(
//       { error: 'Email service temporarily unavailable', code: 'CIRCUIT_OPEN' },
//       { status: 503 }
//     );
//   }
//   throw error;
// }
