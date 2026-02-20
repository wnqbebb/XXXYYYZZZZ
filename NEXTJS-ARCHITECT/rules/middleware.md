---
name: nextjs-middleware
description: Middleware patterns for request interception. Load when implementing middleware.
metadata:
  tags: nextjs, middleware, intercept, routing
---

# Middleware Patterns

## Basic Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check auth token
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/protected')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Add headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', crypto.randomUUID())
  
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  })
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

## A/B Testing

```typescript
export function middleware(request: NextRequest) {
  const variant = request.cookies.get('ab-variant')?.value || 
    (Math.random() > 0.5 ? 'a' : 'b')
  
  const response = NextResponse.next()
  response.cookies.set('ab-variant', variant)
  
  return response
}
```

## Geolocation

```typescript
export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US'
  const currency = country === 'ES' ? 'EUR' : 'USD'
  
  request.headers.set('x-currency', currency)
  
  return NextResponse.next()
}
```
