# Manejo de Errores Profesional

## Jerarquía de Errores Personalizados

```typescript
// Base Error Class
abstract class AppError extends Error {
  abstract readonly code: string;
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace?.(this, this.constructor);
  }

  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      stack: this.stack
    };
  }
}

// Domain Errors
class ValidationError extends AppError {
  readonly code = 'VALIDATION_ERROR';
  readonly statusCode = 400;
  readonly isOperational = true;

  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string[]>,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }
}

class NotFoundError extends AppError {
  readonly code = 'NOT_FOUND';
  readonly statusCode = 404;
  readonly isOperational = true;

  constructor(
    resource: string,
    identifier: string,
    context?: Record<string, unknown>
  ) {
    super(`${resource} with id '${identifier}' not found`, context);
  }
}

class ConflictError extends AppError {
  readonly code = 'CONFLICT';
  readonly statusCode = 409;
  readonly isOperational = true;
}

// Infrastructure Errors
class DatabaseError extends AppError {
  readonly code = 'DATABASE_ERROR';
  readonly statusCode = 500;
  readonly isOperational = false;
}

class NetworkError extends AppError {
  readonly code = 'NETWORK_ERROR';
  readonly statusCode = 503;
  readonly isOperational = true;
}

class ExternalServiceError extends AppError {
  readonly code = 'EXTERNAL_SERVICE_ERROR';
  readonly statusCode = 502;
  readonly isOperational = false;
}

// Security Errors
class AuthenticationError extends AppError {
  readonly code = 'UNAUTHENTICATED';
  readonly statusCode = 401;
  readonly isOperational = true;
}

class AuthorizationError extends AppError {
  readonly code = 'UNAUTHORIZED';
  readonly statusCode = 403;
  readonly isOperational = true;
}

class RateLimitError extends AppError {
  readonly code = 'RATE_LIMIT_EXCEEDED';
  readonly statusCode = 429;
  readonly isOperational = true;

  constructor(
    message: string,
    public readonly retryAfter: number,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }
}
```

---

## Error Handling Patterns

```typescript
// Result Type para errores tipados
type Result<T, E = AppError> = 
  | { success: true; data: T }
  | { success: false; error: E };

function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

function fail<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Try-Catch wrapper
type AsyncFunction<T extends any[], R> = (...args: T) => Promise<R>;

function withErrorHandling<T extends any[], R>(
  fn: AsyncFunction<T, R>,
  errorMapper: (error: unknown) => AppError
): AsyncFunction<T, Result<R>> {
  return async (...args: T): Promise<Result<R>> => {
    try {
      const data = await fn(...args);
      return ok(data);
    } catch (error) {
      return fail(errorMapper(error));
    }
  };
}

// Retry with exponential backoff
interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: (error: Error) => boolean;
}

async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxAttempts,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    retryableErrors = () => true
  } = options;

  let attempt = 1;
  let delay = initialDelay;

  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      
      if (error instanceof Error && !retryableErrors(error)) {
        throw error;
      }

      await sleep(delay);
      delay = Math.min(delay * backoffMultiplier, maxDelay);
      attempt++;
    }
  }

  throw new Error('Max retries exceeded');
}

// Circuit Breaker
interface CircuitBreakerOptions {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenMaxCalls: number;
}

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private nextAttempt = Date.now();
  private halfOpenCalls = 0;

  constructor(
    private fn: () => Promise<unknown>,
    private options: CircuitBreakerOptions
  ) {}

  async execute<T>(): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
      this.halfOpenCalls = 0;
    }

    if (this.state === 'HALF_OPEN') {
      if (this.halfOpenCalls >= this.options.halfOpenMaxCalls) {
        throw new Error('Circuit breaker is HALF_OPEN');
      }
      this.halfOpenCalls++;
    }

    try {
      const result = await this.fn();
      this.onSuccess();
      return result as T;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    
    if (this.failures >= this.options.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.options.resetTimeout;
    }
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Dead Letter Queue para errores
class DeadLetterQueue {
  private queue: Array<{
    item: unknown;
    error: Error;
    timestamp: number;
    attempts: number;
  }> = [];

  constructor(
    private maxAttempts = 3,
    private retryDelay = 5000
  ) {}

  async add(item: unknown, error: Error): Promise<void> {
    const existing = this.queue.find(q => 
      JSON.stringify(q.item) === JSON.stringify(item)
    );

    if (existing) {
      existing.attempts++;
      existing.error = error;
      existing.timestamp = Date.now();
    } else {
      this.queue.push({
        item,
        error,
        timestamp: Date.now(),
        attempts: 1
      });
    }
  }

  async process<T>(
    processor: (item: T) => Promise<void>
  ): Promise<void> {
    const now = Date.now();
    const processable = this.queue.filter(
      q => now - q.timestamp >= this.retryDelay && q.attempts < this.maxAttempts
    );

    for (const entry of processable) {
      try {
        await processor(entry.item as T);
        this.queue = this.queue.filter(q => q !== entry);
      } catch (error) {
        entry.attempts++;
        entry.error = error as Error;
        entry.timestamp = now;
      }
    }
  }

  getFailed(): Array<{ item: unknown; error: Error; attempts: number }> {
    return this.queue
      .filter(q => q.attempts >= this.maxAttempts)
      .map(({ item, error, attempts }) => ({ item, error, attempts }));
  }
}
```

---

## Error Boundary (React)

```typescript
// React Error Boundary
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    
    // Report to error tracking service
    reportError({
      error,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback error={this.state.error!} />;
    }

    return this.props.children;
  }
}

// Hook para async errors
function useErrorHandler(): (error: unknown) => void {
  const [_, setError] = useState<Error | null>(null);
  
  return useCallback((error: unknown) => {
    const normalizedError = error instanceof Error ? error : new Error(String(error));
    setError(() => {
      throw normalizedError;
    });
  }, []);
}

// Async Error Boundary pattern
function useAsyncError() {
  const [error, setError] = useState<Error | null>(null);
  
  if (error) throw error;
  
  return useCallback((e: unknown) => {
    setError(e instanceof Error ? e : new Error(String(e)));
  }, []);
}
```

---

## Global Error Handling

```typescript
// Global error handlers
class GlobalErrorHandler {
  private reporters: Array<(error: AppError) => void> = [];

  constructor() {
    this.setupHandlers();
  }

  addReporter(reporter: (error: AppError) => void): void {
    this.reporters.push(reporter);
  }

  private setupHandlers(): void {
    // Uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      this.handleError(error, 'uncaughtException');
      process.exit(1);
    });

    // Unhandled rejections
    process.on('unhandledRejection', (reason: unknown) => {
      const error = reason instanceof Error ? reason : new Error(String(reason));
      this.handleError(error, 'unhandledRejection');
    });

    // Browser
    if (typeof window !== 'undefined') {
      window.onerror = (message, source, lineno, colno, error) => {
        this.handleError(error || new Error(String(message)), 'window.onerror');
        return true;
      };

      window.onunhandledrejection = (event) => {
        const error = event.reason instanceof Error 
          ? event.reason 
          : new Error(String(event.reason));
        this.handleError(error, 'unhandledrejection');
      };
    }
  }

  private handleError(error: Error, source: string): void {
    const appError = this.normalizeError(error, source);
    
    console.error('Global error:', appError);
    
    this.reporters.forEach(reporter => {
      try {
        reporter(appError);
      } catch (e) {
        console.error('Error reporter failed:', e);
      }
    });
  }

  private normalizeError(error: Error, source: string): AppError {
    if (error instanceof AppError) {
      return error;
    }

    return new (class extends AppError {
      readonly code = 'UNKNOWN_ERROR';
      readonly statusCode = 500;
      readonly isOperational = false;
      
      constructor() {
        super(error.message, { source, originalStack: error.stack });
      }
    })();
  }
}

// Error Reporting Services
class SentryReporter {
  report(error: AppError): void {
    // Send to Sentry
  }
}

class ConsoleReporter {
  report(error: AppError): void {
    const level = error.isOperational ? 'warn' : 'error';
    console[level](`[${error.code}] ${error.message}`, error.context);
  }
}

class MetricsReporter {
  report(error: AppError): void {
    // Increment error counter metric
    metrics.increment('errors', 1, {
      code: error.code,
      operational: String(error.isOperational)
    });
  }
}
```
