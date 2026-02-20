---
name: "Caching"
description: "Estrategias de cacheo en Next.js: fetch cache, router cache, full route cache y revalidación"
tags: ["caching", "cache", "revalidate", "isr", "performance"]
---

# Caching en Next.js

## Descripción

Next.js implementa múltiples capas de caching para optimizar el rendimiento. Entender estas capas es crucial para construir aplicaciones rápidas y actualizadas.

## Capas de Caché

| Capa | Qué cachea | Dónde | Duración |
|------|-----------|-------|----------|
| **Request Memoization** | `fetch` con misma URL | Server | Durante el request |
| **Data Cache** | Resultados de `fetch` | Server | Persistente hasta revalidar |
| **Full Route Cache** | HTML y RSC payload | Server | Persistente hasta revalidar |
| **Router Cache** | RSC payload | Client | Sesión o tiempo configurado |

## Directrices Críticas

### MUST

- **MUST** usar `cache: 'no-store'` para datos que deben ser frescos en cada request
- **MUST** usar `next: { revalidate: N }` para datos que cambian periódicamente
- **MUST** usar `revalidatePath` después de mutaciones exitosas
- **MUST** usar `revalidateTag` para invalidación selectiva del cache
- **MUST** entender que `fetch` cachea por defecto (`force-cache`)

### FORBIDDEN

- **FORBIDDEN** ignorar la estrategia de cacheo y depender del default
- **FORBIDDEN** usar `revalidate: 0` como sustituto de `no-store`
- **FORBIDDEN** olvidar revalidar después de Server Actions
- **FORBIDDEN** asumir que los datos siempre están frescos sin verificar

### WHY

El caching apropiado reduce la carga del servidor, mejora los tiempos de respuesta y disminuye costos. Sin embargo, un caching incorrecto puede causar datos desactualizados y comportamientos inesperados.

## Estrategias de Fetch

### force-cache (Default)

```tsx
// Cachea hasta revalidar manualmente
const data = await fetch('https://api.example.com/data')
// o explícito:
const data = await fetch('https://api.example.com/data', {
  cache: 'force-cache'
})
```

### no-store

```tsx
// No cachea, siempre fetch fresco
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
})
```

### Revalidación por tiempo (ISR)

```tsx
// Revalida cada 60 segundos
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
})
```

### Revalidación por tags

```tsx
// Cachea con tags para invalidación selectiva
const data = await fetch('https://api.example.com/posts', {
  next: { 
    revalidate: 3600,
    tags: ['posts', 'blog']
  }
})
```

## Ejemplos

### ✅ Datos estáticos (cache por defecto)

```tsx
// app/about/page.tsx
// Datos que raramente cambian
async function getCompanyInfo() {
  const res = await fetch('https://api.example.com/company')
  return res.json()
}

export default async function AboutPage() {
  const info = await getCompanyInfo()
  return <AboutContent info={info} />
}
```

### ✅ Datos dinámicos (no cache)

```tsx
// app/dashboard/page.tsx
// Datos que cambian en cada request
async function getRealtimeStats() {
  const res = await fetch('https://api.example.com/stats', {
    cache: 'no-store'
  })
  return res.json()
}

export default async function DashboardPage() {
  const stats = await getRealtimeStats()
  return <Dashboard stats={stats} />
}
```

### ✅ ISR - Revalidación periódica

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Cada hora
  })
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

### ✅ Revalidación manual con Server Action

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: formData
  })
  
  revalidatePath('/posts') // Invalida el cache de /posts
  revalidatePath('/')      // Invalida el cache de la home
}
```

### ✅ Revalidación por tags

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { tags: ['posts'] }
  })
  return res.json()
}

// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: formData
  })
  
  revalidateTag('posts') // Invalida solo los fetch con tag 'posts'
}
```

### ✅ Revalidación múltiple

```tsx
// app/actions.ts
'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

export async function updateUser(formData: FormData) {
  const userId = formData.get('userId')
  
  await fetch(`https://api.example.com/users/${userId}`, {
    method: 'PUT',
    body: formData
  })
  
  // Revalidar múltiples paths y tags
  revalidatePath('/users')
  revalidatePath(`/users/${userId}`)
  revalidatePath('/dashboard')
  revalidateTag(`user-${userId}`)
  revalidateTag('users-list')
}
```

### ✅ Route Segment Config

```tsx
// app/blog/page.tsx
// Configuración a nivel de ruta
export const revalidate = 3600 // Revalidar cada hora
export const dynamic = 'force-dynamic' // Siempre dinámico
export const dynamicParams = true // Permitir params no en generateStaticParams

async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

### ❌ Incorrecto: Sin revalidar después de mutación

```tsx
// ❌ MAL: No revalidar después de crear
'use server'

export async function createPost(formData: FormData) {
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: formData
  })
  // ❌ Falta revalidatePath o revalidateTag!
}
```

### ❌ Incorrecto: Usar revalidate: 0 en lugar de no-store

```tsx
// ❌ MAL: No es lo mismo que no-store
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 0 }
})

// ✅ BIEN: Usar no-store para datos dinámicos
const data = await fetch('https://api.example.com/data', {
  cache: 'no-store'
})
```

## Request Memoization

Next.js automáticamente memoiza requests con la misma URL durante un solo render:

```tsx
// app/page.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  // Estos dos calls retornan la misma promesa memoizada
  const data1 = await getData()
  const data2 = await getData() // No hace fetch de nuevo
  
  return <div>{data1 === data2 ? 'Same data' : 'Different'}</div> // 'Same data'
}
```

## Router Cache (Cliente)

El Router Cache almacena el RSC payload en el cliente:

```tsx
// next.config.js
module.exports = {
  experimental: {
    staleTimes: {
      dynamic: 30,  // Segundos para páginas dinámicas
      static: 180,  // Segundos para páginas estáticas
    },
  },
}
```

Invalidar manualmente:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export function RefreshButton() {
  const router = useRouter()
  
  return (
    <button onClick={() => router.refresh()}>
      Refresh Data
    </button>
  )
}
```

## API de Revalidación Programática

```ts
// Revalidar desde un endpoint externo
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  
  const { path, tag } = await request.json()
  
  if (path) {
    revalidatePath(path)
  }
  
  if (tag) {
    revalidateTag(tag)
  }
  
  return NextResponse.json({ revalidated: true })
}
```

## Referencias

- [Next.js Caching](https://nextjs.org/docs/app/building-your-application/caching)
- [ISR](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [revalidatePath](https://nextjs.org/docs/app/api-reference/functions/revalidatePath)
- [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
