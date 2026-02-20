---
name: "Error Handling"
description: "Manejo de errores en Next.js: error boundaries, not-found, loading states y expected errors"
tags: ["error-handling", "error-boundary", "not-found", "loading", "suspense"]
---

# Error Handling en Next.js

## Descripción

Next.js proporciona un sistema completo de manejo de errores con file conventions: `error.tsx` para errores en runtime, `not-found.tsx` para recursos no encontrados, y `loading.tsx` para estados de carga.

## Directrices Críticas

### MUST

- **MUST** crear archivos `error.tsx` para manejar errores en segmentos de ruta
- **MUST** usar `notFound()` para recursos que no existen (404)
- **MUST** crear archivos `loading.tsx` para mostrar UI de carga
- **MUST** usar `'use client'` en archivos `error.tsx` (deben ser Client Components)
- **MUST** implementar función `reset()` para recuperación de errores
- **MUST** diferenciar entre expected errors (devolver objetos) y unexpected errors (lanzar)

### FORBIDDEN

- **FORBIDDEN** ignorar el manejo de errores en data fetching
- **FORBIDDEN** usar `error.tsx` para expected errors de formularios
- **FORBIDDEN** mostrar información sensible en mensajes de error
- **FORBIDDEN** olvidar que `error.tsx` no captura errores en layouts del mismo segmento

### WHY

Un buen manejo de errores mejora la experiencia del usuario, facilita el debugging y previene que la aplicación se rompa completamente.

## File Conventions

| Archivo | Propósito | Tipo de Componente |
|---------|-----------|-------------------|
| `error.tsx` | Captura errores en el segmento y sus hijos | Client Component |
| `not-found.tsx` | Muestra UI cuando se llama `notFound()` | Server/Client Component |
| `loading.tsx` | Muestra UI mientras carga el segmento | Server/Client Component |
| `global-error.tsx` | Captura errores en toda la aplicación | Client Component |

## Ejemplos

### ✅ Error Boundary básico

```tsx
// app/blog/error.tsx
'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log del error a servicio de reporting
    console.error('Blog error:', error)
  }, [error])

  return (
    <div className="error-container">
      <h2>Something went wrong!</h2>
      <p>We couldn&apos;t load the blog posts.</p>
      <button
        onClick={reset}
        className="retry-button"
      >
        Try again
      </button>
    </div>
  )
}
```

### ✅ Error Boundary con más detalle

```tsx
// app/dashboard/error.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  
  useEffect(() => {
    // Enviar a servicio de error tracking
    logErrorToService(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Dashboard Error
        </h1>
        <p className="mt-2 text-gray-600">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="mt-4 space-x-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
```

### ✅ Global Error

```tsx
// app/global-error.tsx
'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="error-page">
          <h1>Application Error</h1>
          <p>Something went wrong in the application.</p>
          <button onClick={reset}>Reload Application</button>
        </div>
      </body>
    </html>
  )
}
```

### ✅ Not Found Page

```tsx
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-gray-600">Page not found</p>
        <Link 
          href="/"
          className="mt-4 inline-block text-blue-500 hover:underline"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
```

### ✅ Not Found específico de recurso

```tsx
// app/blog/[slug]/not-found.tsx
import Link from 'next/link'

export default function PostNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold">Post Not Found</h2>
      <p className="mt-2 text-gray-600">
        The blog post you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/blog"
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        View all posts
      </Link>
    </div>
  )
}
```

### ✅ Uso de notFound()

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'

async function getPost(slug: string) {
  const post = await db.post.findUnique({ where: { slug } })
  return post
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  
  if (!post) {
    notFound() // Renderiza not-found.tsx del segmento
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

### ✅ Loading State

```tsx
// app/blog/loading.tsx
export default function Loading() {
  return (
    <div className="loading-container">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )
}
```

### ✅ Loading con Skeleton

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
        
        {/* Table skeleton */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### ✅ Expected Errors en Server Actions

```tsx
// app/actions.ts
'use server'

// Expected errors: devolver objetos, NO lanzar
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const user = await getUserByEmail(email)
  
  if (!user) {
    return { error: 'Invalid credentials' } // ✅ Expected error
  }
  
  if (!await verifyPassword(password, user.passwordHash)) {
    return { error: 'Invalid credentials' } // ✅ Expected error
  }
  
  await createSession(user.id)
  return { success: true }
}
```

```tsx
// app/login/page.tsx
'use client'

import { useActionState } from 'react'
import { login } from './actions'

const initialState = { error: '', success: false }

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      
      {state.error && (
        <p className="error">{state.error}</p> // ✅ Mostrar expected error
      )}
      
      <button type="submit" disabled={isPending}>
        Login
      </button>
    </form>
  )
}
```

### ❌ Incorrecto: Lanzar expected errors

```tsx
// ❌ MAL: Lanzar expected errors
'use server'

export async function login(formData: FormData) {
  const email = formData.get('email')
  
  if (!email) {
    throw new Error('Email is required') // ❌ No lanzar expected errors!
  }
  
  // ...
}
```

### ❌ Incorrecto: Error boundary sin 'use client'

```tsx
// ❌ ERROR: Falta 'use client'
// app/blog/error.tsx

export default function Error({ error, reset }) {
  // ❌ Error boundaries deben ser Client Components!
  return <div>Error occurred</div>
}
```

```tsx
// ✅ BIEN: Con 'use client'
'use client' // ✅ Obligatorio

export default function Error({ error, reset }) {
  return <div>Error occurred</div>
}
```

## Jerarquía de Errores

```
app/
├── error.tsx              # Captura errores en toda la app (excepto root layout)
├── layout.tsx
├── page.tsx
├── blog/
│   ├── error.tsx          # Captura errores en /blog/*
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/
│       ├── error.tsx      # Captura errores en /blog/:slug
│       └── page.tsx
```

## Suspense Boundaries

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { PostList, PostListSkeleton } from './components/post-list'
import { Analytics, AnalyticsSkeleton } from './components/analytics'

export default function HomePage() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      <Suspense fallback={<PostListSkeleton />}>
        <PostList />
      </Suspense>
      
      <Suspense fallback={<AnalyticsSkeleton />}>
        <Analytics />
      </Suspense>
    </div>
  )
}
```

## Referencias

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
