// lib/resend-errors.ts
// Error handling utilities for Resend API

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

/**
 * Handle Resend API errors and return appropriate HTTP responses
 */
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

/**
 * Parse Resend validation error messages into structured format
 */
function parseValidationError(message: string): Record<string, string[]> {
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

/**
 * Check if an error is a Resend API error
 */
export function isResendError(error: unknown): error is ResendError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    'statusCode' in error &&
    typeof (error as ResendError).name === 'string' &&
    typeof (error as ResendError).statusCode === 'number'
  );
}

/**
 * Sanitize error for logging (remove sensitive data)
 */
export function sanitizeErrorForLogging(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      // Don't include stack trace in production logs
    };
  }
  return { error: String(error) };
}
