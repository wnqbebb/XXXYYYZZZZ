---
name: edge-middleware
description: Vercel Routing Middleware for request interception, A/B testing, and geolocation.
version: 4.0.0
---

# Edge Middleware - Request Interception

> Intercept and modify requests before they reach your application.

---

## MUST

### 1. Use middleware.ts at Project Root

**✅ CORRECT:**
```typescript
// middleware.ts (or middleware.js) at project root
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Intercept request
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

### 2. Use Matcher for Performance

**✅ CORRECT:**
```typescript
export const config = {
  // Only run on specific paths
  matcher: ['/dashboard/:path*', '/admin/:path*']
}
```

### 3. Return Response Early When Possible

**✅ CORRECT:**
```typescript
export function middleware(request: NextRequest) {
  // Redirect before hitting the app
  if (request.nextUrl.pathname === '/old') {
    return NextResponse.redirect(new URL('/new', request.url))
  }
  
  return NextResponse.next()
}
```

---

## FORBIDDEN

### 1. Never Do Heavy Computation in Middleware

**❌ FORBIDDEN:**
```typescript
export function middleware(request: NextRequest) {
  // ❌ Database query in middleware
  const user = await db.user.findMany()
}
```

**✅ CORRECT:**
```typescript
// ✅ Lightweight check only
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}
```

### 2. Never Forget Config Matcher

**❌ FORBIDDEN:**
```typescript
// ❌ Runs on every request including static files
export function middleware(request: NextRequest) {
  // ...
}
// No config!
```

**✅ CORRECT:**
```typescript
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

---

## WHY

### Middleware Execution Order

```
Request → Middleware → Cache → Application
```

### Use Cases

| Use Case | Example |
|----------|---------|
| Authentication | Check JWT token |
| A/B Testing | Split traffic |
| Geolocation | Redirect by country |
| Bot Detection | Block scrapers |
| URL Rewrites | Clean URLs |

---

## EXAMPLES

### Authentication Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  // Public paths that don't require auth
  const publicPaths = ['/login', '/register', '/api/auth']
  if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next()
  }
  
  // Check auth
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const isValid = await verifyAuth(token)
  if (!isValid) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

### A/B Testing

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check for existing variant
  const variant = request.cookies.get('variant')?.value
  
  if (!variant) {
    // Assign random variant
    const newVariant = Math.random() < 0.5 ? 'a' : 'b'
    const response = NextResponse.next()
    response.cookies.set('variant', newVariant)
    return response
  }
  
  // Rewrite to variant page
  if (request.nextUrl.pathname === '/landing') {
    const url = request.nextUrl.clone()
    url.pathname = `/landing-${variant}`
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}
```

### Geolocation Redirect

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const country = request.geo?.country || 'US'
  
  // Redirect to country-specific site
  if (request.nextUrl.pathname === '/') {
    const url = request.nextUrl.clone()
    
    switch (country) {
      case 'GB':
        url.pathname = '/uk'
        break
      case 'DE':
        url.pathname = '/de'
        break
      default:
        url.pathname = '/us'
    }
    
    return NextResponse.redirect(url)
  }
  
  return NextResponse.next()
}
```

### Bot Detection

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BLOCKED_UA = [
  'scrapy',
  'curl',
  'wget',
  'python-requests'
]

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || ''
  
  const isBot = BLOCKED_UA.some(ua => 
    userAgent.toLowerCase().includes(ua)
  )
  
  if (isBot) {
    return new NextResponse('Access Denied', { status: 403 })
  }
  
  return NextResponse.next()
}
```

### Custom Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  // Add custom headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // Add request ID for tracing
  response.headers.set('X-Request-Id', crypto.randomUUID())
  
  return response
}
```

---

## Related Assets

- [Auth Middleware Template](../assets/templates/middleware-auth.ts)
- [A/B Testing Template](../assets/templates/middleware-ab.ts)
- [Geolocation Template](../assets/templates/middleware-geo.ts)
