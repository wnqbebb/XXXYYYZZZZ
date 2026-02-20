---
name: "Data Fetching"
description: "Patrones modernos de obtención de datos en Next.js con fetch, caching y revalidación"
tags: ["data-fetching", "fetch", "cache", "revalidate", "api"]
---

# Data Fetching

## Descripción

Next.js App Router utiliza el API nativo `fetch` extendido con opciones de caching. Los Server Components pueden hacer data fetching directamente, colocando la lógica cerca de donde se usa.

## Directrices Críticas

### MUST

- **MUST** usar `fetch` nativo del navegador/Node.js en Server Components
- **MUST** marcar Server Components como `async` cuando hagan data fetching
- **MUST** usar `cache: 'no-store'` para datos que cambian en cada request
- **MUST** usar `next: { revalidate: N }` para datos que cambian periódicamente
- **MUST** manejar errores en data fetching con try/catch o error boundaries
- **MUST** usar `generateStaticParams` para rutas dinámicas estáticas

### FORBIDDEN

- **FORBIDDEN** usar `axios` u otras librerías de HTTP sin necesidad específica
- **FORBIDDEN** hacer data fetching en Client Components (usar Server Actions o Route Handlers)
- **FORBIDDEN** ignorar el manejo de errores en peticiones fetch
- **FORBIDDEN** usar `fetch` sin considerar la estrategia de cacheo apropiada
- **FORBIDDEN** hacer múltiples requests duplicados innecesarios

### WHY

El data fetching en Server Components elimina la necesidad de APIs intermedias, reduce el JavaScript del cliente y permite acceso directo a bases de datos. El sistema de caching automático de Next.js optimiza el rendimiento.

## Estrategias de Caché

| Opción | Comportamiento | Uso |
|--------|---------------|-----|
| `force-cache` (default) | Cachea hasta revalidar manualmente | Datos estáticos |
| `no-store` | No cachea, fetch en cada request | Datos dinámicos |
| `no-cache` | Revalida en cada request | Datos semi-dinámicos |
| `next: { revalidate: N }` | Revalida cada N segundos | ISR |
| `next: { tags: ['tag'] }` | Revalida por tag | Invalidación selectiva |

## Ejemplos

### ✅ Correcto: Data fetching básico

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  
  if (!res.ok) {
    throw new Error('Failed to fetch posts')
  }
  
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

### ✅ Correcto: Datos dinámicos (no cache)

```tsx
// app/dashboard/page.tsx
async function getRealtimeData() {
  const res = await fetch('https://api.example.com/realtime', {
    cache: 'no-store' // Siempre datos frescos
  })
  return res.json()
}

export default async function DashboardPage() {
  const data = await getRealtimeData()
  
  return <Dashboard data={data} />
}
```

### ✅ Correcto: Revalidación periódica (ISR)

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidar cada hora
  })
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
```

### ✅ Correcto: Revalidación con tags

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { 
      revalidate: 3600,
      tags: ['posts', 'blog']
    }
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
  
  revalidateTag('posts') // Invalida el cache
}
```

### ✅ Correcto: generateStaticParams

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://api.example.com/posts/${slug}`).then(r => r.json())
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

### ✅ Correcto: Múltiples requests en paralelo

```tsx
// app/dashboard/page.tsx
async function getDashboardData() {
  // Requests independientes en paralelo
  const [user, posts, analytics] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/analytics').then(r => r.json())
  ])
  
  return { user, posts, analytics }
}

export default async function DashboardPage() {
  const { user, posts, analytics } = await getDashboardData()
  
  return (
    <div>
      <UserCard user={user} />
      <PostList posts={posts} />
      <Analytics data={analytics} />
    </div>
  )
}
```

### ❌ Incorrecto: Requests secuenciales innecesarios

```tsx
// ❌ MAL: Requests secuenciales cuando pueden ser paralelos
export default async function DashboardPage() {
  const user = await fetch('/api/user').then(r => r.json()) // Espera...
  const posts = await fetch('/api/posts').then(r => r.json()) // Espera...
  const analytics = await fetch('/api/analytics').then(r => r.json()) // Espera...
  
  return <Dashboard user={user} posts={posts} analytics={analytics} />
}
```

### ❌ Incorrecto: Sin manejo de errores

```tsx
// ❌ MAL: Sin manejo de errores
export default async function Page() {
  const data = await fetch('/api/data').then(r => r.json()) // ❌ Puede fallar
  return <Component data={data} />
}
```

```tsx
// ✅ BIEN: Con manejo de errores
export default async function Page() {
  try {
    const res = await fetch('/api/data')
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    
    const data = await res.json()
    return <Component data={data} />
  } catch (error) {
    return <ErrorMessage error={error} />
  }
}
```

## Patrones Avanzados

### Data Fetcher Reutilizable

```tsx
// lib/fetcher.ts
const BASE_URL = process.env.API_URL

export async function fetcher<T>(
  endpoint: string,
  options?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })
  
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }
  
  return res.json()
}

// Uso
const posts = await fetcher<Post[]>('/posts', {
  next: { revalidate: 3600, tags: ['posts'] }
})
```

### Conexión a Base de Datos Directa

```tsx
// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function getUsers() {
  const { rows } = await pool.query('SELECT * FROM users')
  return rows
}

// app/users/page.tsx
import { getUsers } from '@/lib/db'

export default async function UsersPage() {
  const users = await getUsers() // Directo a la DB, no necesita fetch
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

## Referencias

- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching in Next.js](https://nextjs.org/docs/app/building-your-application/caching)
