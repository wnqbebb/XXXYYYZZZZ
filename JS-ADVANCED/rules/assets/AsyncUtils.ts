/**
 * Async Utilities
 * Retry, Timeout, Parallel Execution
 */

export class TimeoutError extends Error {
  constructor(public readonly timeoutMs: number) {
    super(`Operation timed out after ${timeoutMs}ms`);
    this.name = 'TimeoutError';
  }
}

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  abortController?: AbortController
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    const timer = setTimeout(() => {
      abortController?.abort();
      reject(new TimeoutError(timeoutMs));
    }, timeoutMs);

    promise.finally(() => clearTimeout(timer));
  });

  return Promise.race([promise, timeoutPromise]);
}

export interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: (error: Error) => boolean;
  onRetry?: (error: Error, attempt: number) => void;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const {
    maxAttempts,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    retryableErrors = () => true,
    onRetry
  } = options;

  let attempt = 1;
  let delay = initialDelay;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }

      if (error instanceof Error && !retryableErrors(error)) {
        throw error;
      }

      onRetry?.(error as Error, attempt);

      await sleep(delay);
      delay = Math.min(delay * backoffMultiplier, maxDelay);
      attempt++;
    }
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function* fetchPaginated<T>(
  fetcher: (page: number) => Promise<T[]>,
  options: { continueWhile?: (items: T[]) => boolean } = {}
): AsyncGenerator<T[], void, unknown> {
  let page = 0;
  
  while (true) {
    const items = await fetcher(page);
    
    if (items.length === 0) return;
    if (options.continueWhile && !options.continueWhile(items)) return;
    
    yield items;
    page++;
  }
}

export async function* batch<T>(
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

export class PromisePool<T, R> {
  private queue: Array<{ item: T; index: number }> = [];
  private results = new Map<number, R>();
  private errors = new Map<number, Error>();
  private active = 0;

  constructor(
    private processor: (item: T, index: number) => Promise<R>,
    private concurrency: number
  ) {}

  async process(items: T[]): Promise<{ fulfilled: Array<{ index: number; value: R }>; rejected: Array<{ index: number; error: Error }> }> {
    this.queue = items.map((item, index) => ({ item, index }));
    
    const workers = Array.from({ length: this.concurrency }, () => this.worker());
    await Promise.all(workers);
    
    return {
      fulfilled: Array.from(this.results.entries()).map(([index, value]) => ({ index, value })),
      rejected: Array.from(this.errors.entries()).map(([index, error]) => ({ index, error }))
    };
  }

  private async worker(): Promise<void> {
    while (this.queue.length > 0) {
      const { item, index } = this.queue.shift()!;
      this.active++;
      
      try {
        const result = await this.processor(item, index);
        this.results.set(index, result);
      } catch (error) {
        this.errors.set(index, error as Error);
      }
      
      this.active--;
    }
  }
}

export function createCancellablePromise<T>(
  executor: (
    resolve: (value: T) => void,
    reject: (reason?: unknown) => void,
    signal: AbortSignal
  ) => void
): { promise: Promise<T>; cancel: () => void } {
  const controller = new AbortController();
  
  const promise = new Promise<T>((resolve, reject) => {
    controller.signal.addEventListener('abort', () => {
      reject(new DOMException('Cancelled', 'AbortError'));
    });
    
    executor(resolve, reject, controller.signal);
  });
  
  return {
    promise,
    cancel: () => controller.abort()
  };
}
