---
name: Error Handling for Resend
scope: error-handling
description: Comprehensive error handling strategies for Resend API integration, including rate limiting, validation errors, and network failures
---

# Error Handling for Resend Integration

## Metadata
- **Rule Name**: error-handling
- **Scope**: Error Management
- **Applies To**: API routes, form components, email services

---

## Directrices Críticas

### MUST

1. **MUST** handle all Resend API error types: `validation_error`, `not_found`, `rate_limit_exceeded`, `application_error`
2. **MUST** implement exponential backoff for rate limit retries
3. **MUST** log errors without exposing sensitive information
4. **MUST** return user-friendly error messages (never expose internal details)
5. **MUST** use idempotency keys for critical transactional emails
6. **MUST** implement circuit breaker pattern for repeated failures

### FORBIDDEN

1. **FORBIDDEN** to expose API keys, internal paths, or stack traces to clients
2. **FORBIDDEN** to retry immediately after rate limit errors
3. **FORBIDDEN** to ignore network errors or timeouts
4. **FORBIDDEN** to log email content containing PII (Personally Identifiable Information)
5. **FORBIDDEN** to swallow errors silently

### WHY

- **Error Types**: Resend returns specific error types that require different handling strategies
- **Rate Limiting**: Resend has API limits; proper handling prevents service disruption
- **Security**: Exposing internal details aids attackers
- **Idempotency**: Prevents duplicate emails on retry
- **Circuit Breaker**: Prevents cascading failures and reduces load on failing services

---

## Resend Error Types

| Error Name | Status Code | Description | Action |
|------------|-------------|-------------|--------|
| `validation_error` | 422 | Invalid input parameters | Return 400 with field errors |
| `not_found` | 404 | Resource not found | Return 404 |
| `rate_limit_exceeded` | 429 | Too many requests | Retry with exponential backoff |
| `application_error` | 500 | Resend server error | Retry or alert ops team |
| `internal_server_error` | 500 | Unexpected error | Log and investigate |

---

## Ejemplos

### ✅ Correct: Comprehensive Error Handler

```typescript
// lib/resend-errors.ts
import { Resend } from 'resend';

export type ResendErrorName = 
  | 'validation_error' 
  | 'not_found' 
  | 'rate_limit_exceeded' 
  | 'application_error' 
  | 'internal_server_error';

export interface ResendError {
  name: ResendErrorName;
  message: string;
  statusCode: number;
}

export interface ErrorResponse {
  error: string;
  code: string;
  retryAfter?: number;
  details?: Record<string, string[]>;
}

export function handleResendError(
  error: ResendError,
  headers?: Headers
): ErrorResponse & { status: number } {
  // Log error (without sensitive data)
  console.error('[Resend Error]', {
    name: error.name,
    statusCode: error.statusCode,
    timestamp: new Date().toISOString(),
  });

  switch (error.name) {
    case 'validation_error':
      return {
        status: 400,
        error: 'Invalid email configuration',
        code: 'VALIDATION_ERROR',
        details: parseValidationError(error.message),
      };

    case 'not_found':
      return {
        status: 404,
        error: 'Email resource not found',
        code: 'NOT_FOUND',
      };

    case 'rate_limit_exceeded': {
      const retryAfter = headers?.get('retry-after');
      return {
        status: 429,
        error: 'Too many requests. Please try again later.',
        code: 'RATE_LIMIT_EXCEEDED',
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : undefined,
      };
    }

    case 'application_error':
    case 'internal_server_error':
      return {
        status: 503,
        error: 'Email service temporarily unavailable. Please try again.',
        code: 'SERVICE_UNAVAILABLE',
      };

    default:
      return {
        status: 500,
        error: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      };
  }
}

function parseValidationError(message: string): Record<string, string[]> {
  // Parse Resend validation error messages
  const details: Record<string, string[]> = {};
  
  // Example: "from: Invalid email address"
  const match = message.match(/^(\w+):\s*(.+)$/);
  if (match) {
    details[match[1]] = [match[2]];
  } else {
    details.general = [message];
  }
  
  return details;
}
```

### ✅ Correct: API Route with Error Handling

```typescript
// app/api/send-email/route.ts
import { Resend } from 'resend';
import { z } from 'zod';
import { handleResendError } from '@/lib/resend-errors';
import { ContactEmail } from '@/emails/contact-email';

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    // Parse request
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Invalid JSON in request body', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    // Validate input
    const validatedData = contactSchema.safeParse(body);
    if (!validatedData.success) {
      return Response.json(
        {
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Generate idempotency key for critical emails
    const idempotencyKey = generateIdempotencyKey(validatedData.data);

    // Send email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [process.env.RESEND_TO_EMAIL!],
      replyTo: validatedData.data.email,
      subject: `Contact: ${validatedData.data.subject}`,
      react: ContactEmail(validatedData.data),
      headers: {
        'X-Idempotency-Key': idempotencyKey,
      },
    });

    if (error) {
      const errorResponse = handleResendError(error as any);
      
      // Add retry-after header for rate limits
      const headers: Record<string, string> = {};
      if (errorResponse.retryAfter) {
        headers['Retry-After'] = String(errorResponse.retryAfter);
      }

      return Response.json(errorResponse, { 
        status: errorResponse.status,
        headers 
      });
    }

    return Response.json(
      { 
        success: true, 
        messageId: data?.id,
        code: 'EMAIL_SENT'
      },
      { status: 200 }
    );

  } catch (error) {
    // Unexpected error
    console.error('[Unexpected Error]', error);
    
    return Response.json(
      { 
        error: 'An unexpected error occurred', 
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

function generateIdempotencyKey(data: { email: string; subject: string; message: string }): string {
  // Create a hash of the email content to prevent duplicates
  const content = `${data.email}:${data.subject}:${data.message}`;
  return Buffer.from(content).toString('base64').slice(0, 32);
}
```

### ✅ Correct: Exponential Backoff Retry

```typescript
// lib/retry.ts
interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryableErrors?: string[];
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000,
    retryableErrors = ['rate_limit_exceeded', 'application_error'],
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      // Check if error is retryable
      const errorName = (error as any)?.name;
      if (!retryableErrors.includes(errorName)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay
      );

      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage in API route
import { withRetry } from '@/lib/retry';

export async function POST(request: Request) {
  const body = await request.json();
  
  try {
    const result = await withRetry(
      () => resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL!,
        to: [body.to],
        subject: body.subject,
        html: body.html,
      }),
      {
        maxRetries: 3,
        baseDelay: 2000, // Start with 2 seconds
        retryableErrors: ['rate_limit_exceeded', 'application_error'],
      }
    );
    
    return Response.json({ success: true, data: result });
  } catch (error) {
    return Response.json(
      { error: 'Failed after retries' },
      { status: 503 }
    );
  }
}
```

### ✅ Correct: Circuit Breaker Pattern

```typescript
// lib/circuit-breaker.ts
type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerOptions {
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenMaxCalls?: number;
}

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

  async execute(...args: any[]): Promise<any> {
    if (this.state === 'OPEN') {
      if (this.shouldAttemptReset()) {
        this.state = 'HALF_OPEN';
        this.halfOpenCalls = 0;
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    if (this.state === 'HALF_OPEN' && this.halfOpenCalls >= (this.options.halfOpenMaxCalls || 3)) {
      throw new Error('Circuit breaker is HALF_OPEN - max calls reached');
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

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
    this.lastFailureTime = null;
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= (this.options.failureThreshold || 5)) {
      this.state = 'OPEN';
    }
  }

  private shouldAttemptReset(): boolean {
    if (!this.lastFailureTime) return true;
    return Date.now() - this.lastFailureTime >= (this.options.resetTimeout || 60000);
  }

  getState(): CircuitState {
    return this.state;
  }
}

// Usage
const resendBreaker = new CircuitBreaker(
  (emailData: any) => resend.emails.send(emailData),
  {
    failureThreshold: 3,
    resetTimeout: 30000, // 30 seconds
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await resendBreaker.execute(body);
    return Response.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Circuit breaker')) {
      return Response.json(
        { error: 'Email service temporarily unavailable', code: 'CIRCUIT_OPEN' },
        { status: 503 }
      );
    }
    throw error;
  }
}
```

### ❌ Incorrect: Poor Error Handling

```typescript
// ❌ DON'T DO THIS
export async function POST(request: Request) {
  const body = await request.json();
  
  // ❌ No try-catch
  const result = await resend.emails.send(body);
  
  // ❌ No error checking
  return Response.json(result);
}

// ❌ DON'T DO THIS - Exposing sensitive info
export async function POST(request: Request) {
  try {
    const result = await resend.emails.send(body);
    return Response.json(result);
  } catch (error) {
    // ❌ Exposing internal error details
    return Response.json(
      { 
        error: error.message,
        stack: error.stack, // ❌ Never expose stack traces!
        apiKey: process.env.RESEND_API_KEY, // ❌ NEVER!
      },
      { status: 500 }
    );
  }
}
```

---

## Error Monitoring Integration

```typescript
// lib/error-monitor.ts
interface ErrorContext {
  userId?: string;
  emailId?: string;
  timestamp: string;
  [key: string]: any;
}

export function monitorError(
  error: Error,
  context: ErrorContext
): void {
  // Send to error monitoring service (Sentry, LogRocket, etc.)
  const sanitizedContext = {
    ...context,
    // Remove sensitive data
    apiKey: undefined,
    emailContent: undefined,
  };

  // Example: Sentry.captureException(error, { extra: sanitizedContext });
  console.error('[Monitored Error]', {
    error: error.message,
    context: sanitizedContext,
  });
}

// Usage in API route
import { monitorError } from '@/lib/error-monitor';

export async function POST(request: Request) {
  try {
    // ... send email
  } catch (error) {
    monitorError(error as Error, {
      timestamp: new Date().toISOString(),
      // Don't include email content or PII
    });
    
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
```

---

## Related Assets

- [Error Handler Utility](./assets/resend-errors.ts)
- [Retry Utility](./assets/retry.ts)
- [Circuit Breaker](./assets/circuit-breaker.ts)

## References

- [Resend Error Handling](https://resend.com/docs/api-reference/errors)
- [Exponential Backoff](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
