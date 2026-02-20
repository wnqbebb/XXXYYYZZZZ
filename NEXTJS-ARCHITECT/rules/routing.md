---
name: "Routing"
description: "Convenciones de App Router, rutas dinámicas, paralelas, interceptadas y grupos de rutas"
tags: ["routing", "app-router", "dynamic-routes", "parallel-routes", "intercepting-routes"]
---

# Routing en Next.js App Router

## Descripción

Next.js App Router usa convenciones de archivo basadas en el sistema de archivos. Las carpetas definen rutas y los archivos especiales (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`) definen el comportamiento.

## Convenciones de Archivos

| Archivo | Propósito |
|---------|-----------|
| `page.tsx` | UI única de la ruta |
| `layout.tsx` | UI compartida entre rutas hijas |
| `loading.tsx` | UI de carga mientras se carga la ruta |
| `error.tsx` | UI de error cuando algo falla |
| `not-found.tsx` | UI 404 cuando no se encuentra un recurso |
| `route.ts` | Endpoint API (Route Handler) |
| `template.tsx` | Layout re-mounteado en navegación |
| `default.tsx` | Fallback para Parallel Routes |

## Directrices Críticas

### MUST

- **MUST** usar `page.tsx` para definir el contenido de una ruta
- **MUST** usar `layout.tsx` para UI compartida entre rutas
- **MUST** usar corchetes `[param]` para rutas dinámicas
- **MUST** usar paréntesis `(group)` para agrupar rutas sin afectar la URL
- **MUST** usar `generateStaticParams` para pre-renderizar rutas dinámicas

### FORBIDDEN

- **FORBIDDEN** exportar múltiples componentes de `page.tsx`
- **FORBIDDEN** olvidar que `layout.tsx` no re-renderiza entre rutas hijas
- **FORBIDDEN** usar `useRouter` en Server Components (usar `redirect`)
- **FORBIDDEN** confundir `[param]` (dinámico) con `(group)` (agrupación)

### WHY

Las convenciones de archivo proporcionan una estructura predecible, permiten optimizaciones automáticas y hacen que el código sea más mantenible.

## Ejemplos

### ✅ Estructura básica

```
app/
├── page.tsx              # / (home)
├── layout.tsx            # Root layout
├── about/
│   └── page.tsx          # /about
├── blog/
│   ├── page.tsx          # /blog (lista)
│   └── [slug]/
│       └── page.tsx      # /blog/:slug (detalle)
└── dashboard/
    ├── layout.tsx        # Layout del dashboard
    ├── page.tsx          # /dashboard
    ├── settings/
    │   └── page.tsx      # /dashboard/settings
    └── loading.tsx       # Loading state para dashboard/*
```

### ✅ Layout anidado

```tsx
// app/layout.tsx (Root Layout)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>Global Header</header>
        {children}
        <footer>Global Footer</footer>
      </body>
    </html>
  )
}
```

```tsx
// app/dashboard/layout.tsx (Dashboard Layout)
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside>
        <nav>{/* Links del dashboard */}</nav>
      </aside>
      <main>{children}</main>
    </div>
  )
}
```

### ✅ Rutas dinámicas

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}

// Generar páginas estáticas en build time
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

### ✅ Rutas dinámicas con múltiples segmentos

```tsx
// app/shop/[category]/[product]/page.tsx
export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>
}) {
  const { category, product } = await params
  
  return (
    <div>
      <h1>Category: {category}</h1>
      <h2>Product: {product}</h2>
    </div>
  )
}
```

### ✅ Catch-all segments

```tsx
// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params // slug es un array
  
  return (
    <div>
      <h1>Documentation</h1>
      <p>Path: {slug.join('/')}</p>
    </div>
  )
}

// /docs/installation -> slug = ['installation']
// /docs/api/routes -> slug = ['api', 'routes']
```

### ✅ Route Groups

```
app/
├── (marketing)/           # Grupo: no afecta la URL
│   ├── layout.tsx         # Layout específico de marketing
│   ├── page.tsx           # /
│   ├── about/
│   │   └── page.tsx       # /about
│   └── contact/
│       └── page.tsx       # /contact
└── (shop)/
    ├── layout.tsx         # Layout específico de tienda
│   ├── shop/
│   │   └── page.tsx       # /shop
│   └── cart/
│       └── page.tsx       # /cart
```

### ✅ Parallel Routes (@slots)

```
app/
├── @team/                 # Slot: @team
│   └── page.tsx
├── @analytics/            # Slot: @analytics
│   └── page.tsx
├── layout.tsx             # Renderiza los slots
└── page.tsx               # Página principal
```

```tsx
// app/layout.tsx
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  team: React.ReactNode
  analytics: React.ReactNode
}) {
  return (
    <div>
      <main>{children}</main>
      <aside>{team}</aside>
      <section>{analytics}</section>
    </div>
  )
}
```

### ✅ Intercepting Routes

```
app/
├── feed/
│   └── page.tsx           # /feed (lista)
├── photo/
│   └── [id]/
│       └── page.tsx       # /photo/:id (página completa)
└── feed/
    └── @modal/
        └── (.)photo/
            └── [id]/
                └── page.tsx  # Intercepta /photo/:id desde /feed
```

Convenciones de interceptación:
- `(.)` - Interceptar en el mismo nivel
- `(..)` - Interceptar un nivel arriba
- `(..)(..)` - Interceptar dos niveles arriba
- `(...)` - Interceptar desde root

### ✅ Route Handlers (API Routes)

```ts
// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const users = await getUsersFromDB()
  return NextResponse.json(users)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const user = await createUser(body)
  return NextResponse.json(user, { status: 201 })
}
```

```ts
// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getUserById(id)
  
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(user)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const user = await updateUser(id, body)
  return NextResponse.json(user)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await deleteUser(id)
  return NextResponse.json({ success: true })
}
```

## Navegación

### Link Component

```tsx
import Link from 'next/link'

// Navegación básica
<Link href="/about">About</Link>

// Con prefetch deshabilitado
<Link href="/about" prefetch={false}>About</Link>

// Con replace (reemplaza historial en vez de push)
<Link href="/about" replace>About</Link>

// Scroll a un elemento específico
<Link href="/about#team">Team Section</Link>

// Navegación dinámica
<Link href={`/blog/${post.slug}`}>{post.title}</Link>
```

### Programmatic Navigation

```tsx
// En Client Components
'use client'

import { useRouter } from 'next/navigation'

export function Navigation() {
  const router = useRouter()
  
  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

```tsx
// En Server Actions/Components
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  // ... crear post
  redirect('/posts') // Redirección server-side
}
```

## Referencias

- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Parallel Routes](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes)
- [Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)
