---
name: API Routes for Resend
scope: api-routes
description: Best practices for creating Next.js API routes to handle email sending with Resend API
---

# API Routes for Resend Email Integration

## Metadata
- **Rule Name**: api-routes
- **Scope**: Next.js App Router API Routes
- **Applies To**: `app/api/**/*.route.ts`

---

## Directrices Críticas

### MUST

1. **MUST** initialize Resend client as a singleton at module level
2. **MUST** validate all incoming request data using Zod or similar schema validator
3. **MUST** implement proper HTTP status codes (200, 400, 429, 500)
4. **MUST** use `from` address verified in Resend dashboard for production
5. **MUST** handle rate limiting with appropriate retry logic
6. **MUST** return structured JSON responses with consistent error format

### FORBIDDEN

1. **FORBIDDEN** to expose Resend API key in client-side code
2. **FORBIDDEN** to use `setTimeout` or `setInterval` for rate limit handling
3. **FORBIDDEN** to send emails without input validation
4. **FORBIDDEN** to use unverified `from` addresses in production
5. **FORBIDDEN** to log sensitive information (email content, API keys)

### WHY

- **Singleton Pattern**: Prevents multiple unnecessary client instances and connection overhead
- **Input Validation**: Protects against injection attacks and malformed data
- **HTTP Status Codes**: Enables proper client-side error handling
- **Verified Domains**: Ensures email deliverability and prevents spam filtering
- **Rate Limiting**: Resend has rate limits; proper handling prevents service disruption

---

## Ejemplos

### ✅ Correct: Contact Form API Route

```typescript
// app/api/send-email/route.ts
import { Resend } from 'resend';
import { z } from 'zod';
import { ContactEmail } from '@/emails/contact-email';

// Initialize Resend client as singleton
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Send email using React Email template
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Acme <onboarding@resend.dev>',
      to: [process.env.RESEND_TO_EMAIL || 'admin@example.com'],
      replyTo: validatedData.email,
      subject: `Contact Form: ${validatedData.subject}`,
      react: ContactEmail(validatedData),
    });

    if (error) {
      console.error('Resend API Error:', error);
      
      // Handle specific error types
      switch (error.name) {
        case 'validation_error':
          return Response.json(
            { error: 'Invalid email configuration', details: error.message },
            { status: 400 }
          );
        case 'rate_limit_exceeded':
          return Response.json(
            { error: 'Rate limit exceeded. Please try again later.' },
            { status: 429 }
          );
        default:
          return Response.json(
            { error: 'Failed to send email', details: error.message },
            { status: 500 }
          );
      }
    }

    return Response.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );

  } catch (error) {
    console.error('Request processing error:', error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return Response.json(
        { 
          error: 'Validation failed', 
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message
          }))
        },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### ✅ Correct: Simple HTML Email Route

```typescript
// app/api/send-notification/route.ts
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const notificationSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, html, text } = notificationSchema.parse(body);

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [to],
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, id: data?.id });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid input', issues: error.issues },
        { status: 400 }
      );
    }

    return Response.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
```

### ❌ Incorrect: Missing Validation

```typescript
// ❌ DON'T DO THIS
import { Resend } from 'resend';

export async function POST(request: Request) {
  const body = await request.json();
  
  // ❌ No validation - vulnerable to injection
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  await resend.emails.send({
    from: 'test@example.com', // ❌ Unverified domain
    to: body.to, // ❌ No validation
    subject: body.subject,
    html: body.html, // ❌ Potential XSS
  });
  
  return Response.json({ success: true });
}
```

### ❌ Incorrect: Client-Side API Key

```typescript
// ❌ DON'T DO THIS - NEVER expose API key client-side
'use client';

import { Resend } from 'resend';

const resend = new Resend('re_123456789'); // ❌ API key exposed!

export function ContactForm() {
  const handleSubmit = async () => {
    await resend.emails.send({...}); // ❌ Won't work, security risk
  };
}
```

---

## Rate Limiting Strategy

```typescript
// lib/rate-limit.ts
import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute
  });

  return {
    check: (token: string, limit: number) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
        }
        
        if (tokenCount[0] > limit) {
          reject(new Error('Rate limit exceeded'));
        } else {
          resolve();
        }
      }),
  };
}

// Usage in API route
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    await limiter.check(ip, 5); // 5 requests per minute
    
    // ... rest of handler
  } catch {
    return Response.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
}
```

---

## Related Assets

- [Contact Form API Route](./assets/api-contact-route.ts) - Complete implementation
- [Rate Limiter Utility](./assets/rate-limit.ts) - Rate limiting helper

## References

- [Resend Node.js SDK Documentation](https://resend.com/docs/sdk/typescript)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Zod Validation](https://zod.dev/)
