// lib/retry.ts
// Retry utility with exponential backoff

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryableErrors?: string[];
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

/**
 * Execute an operation with retry logic and exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    retryableErrors = ['rate_limit_exceeded', 'application_error', 'ECONNRESET', 'ETIMEDOUT'],
    onRetry,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const errorName = (error as any)?.name || (error as any)?.code;
      if (!retryableErrors.includes(errorName)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      const delay = Math.min(exponentialDelay + jitter, maxDelay);

      // Call onRetry callback if provided
      onRetry?.(attempt + 1, delay, lastError);

      // Wait before retrying
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Sleep for a specified duration
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a retryable function wrapper
 */
export function createRetryableFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    return withRetry(() => fn(...args), options);
  }) as T;
}

// Usage examples:

// Example 1: Direct usage
// const result = await withRetry(
//   () => resend.emails.send(emailData),
//   { maxRetries: 3, baseDelay: 2000 }
// );

// Example 2: Wrapping a function
// const sendEmailWithRetry = createRetryableFunction(
//   resend.emails.send.bind(resend.emails),
//   { maxRetries: 3, retryableErrors: ['rate_limit_exceeded'] }
// );
