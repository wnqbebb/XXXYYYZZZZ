---
name: "Server Components"
description: "Fundamentos, patrones y mejores prácticas para React Server Components en Next.js App Router"
tags: ["server-components", "rsc", "app-router", "ssr"]
---

# Server Components

## Descripción

Los Server Components son el default en App Router. Se ejecutan exclusivamente en el servidor, pueden acceder a recursos del backend directamente y no envían JavaScript al cliente.

## Directrices Críticas

### MUST

- **MUST** usar Server Components por defecto para todo componente nuevo
- **MUST** obtener datos directamente en Server Components usando `fetch` o llamadas a base de datos
- **MUST** usar `async/await` para data fetching en Server Components
- **MUST** mantener Server Components como funciones async cuando hagan data fetching
- **MUST** pasar datos a Client Components como props cuando sea necesario interactividad

### FORBIDDEN

- **FORBIDDEN** usar hooks de React (`useState`, `useEffect`, `useContext`) en Server Components
- **FORBIDDEN** usar event handlers (`onClick`, `onSubmit`) en Server Components
- **FORBIDDEN** usar APIs del browser (`window`, `document`, `localStorage`) en Server Components
- **FORBIDDEN** usar `use client` sin una razón específica de interactividad
- **FORBIDDEN** hacer `fetch` en loops sin considerar el impacto en performance

### WHY

Los Server Components reducen el bundle de JavaScript enviado al cliente, permiten acceso directo a recursos del servidor (bases de datos, APIs internas), y mejoran el Time to First Byte (TTFB) al renderizar en el servidor.

## Ejemplos

### ✅ Correcto: Data Fetching en Server Component

```tsx
// app/blog/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts')
  if (!res.ok) throw new Error('Failed to fetch posts')
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  )
}
```

### ✅ Correcto: Composición Server + Client Components

```tsx
// app/page.tsx (Server Component)
import { getProducts } from '@/lib/products'
import { ProductGrid } from './product-grid'
import { CartProvider } from './cart-provider'

export default async function HomePage() {
  const products = await getProducts()
  
  return (
    <CartProvider>
      <ProductGrid products={products} />
    </CartProvider>
  )
}
```

```tsx
// app/product-grid.tsx (Client Component)
'use client'

import { useState } from 'react'

export function ProductGrid({ products }) {
  const [filter, setFilter] = useState('')
  
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(filter.toLowerCase())
  )
  
  return (
    <div>
      <input 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter products..."
      />
      <div className="grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
```

### ❌ Incorrecto: Hooks en Server Component

```tsx
// ❌ ERROR: No se puede usar useState en Server Component
export default function Counter() {
  const [count, setCount] = useState(0) // ❌ Error!
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

### ❌ Incorrecto: Event handlers en Server Component

```tsx
// ❌ ERROR: No se puede usar onClick sin 'use client'
export default function Button({ children }) {
  return (
    <button onClick={() => console.log('clicked')}>
      {children}
    </button>
  ) // ❌ Error!
}
```

## Patrones Avanzados

### Serialización de Props

Los Server Components pueden pasar props serializables a Client Components:

```tsx
// ✅ Funciona: Props serializables
<ClientComponent 
  data={{ id: 1, name: 'Test' }}
  items={[1, 2, 3]}
  callback={undefined} // No se pueden pasar funciones
/>

// ❌ No funciona: Funciones no son serializables
<ClientComponent 
  onAction={() => {}} // ❌ Error!
  Component={MyComponent} // ❌ Error!
/>
```

### Children como Props

Un patrón poderoso es pasar Server Components como children de Client Components:

```tsx
// app/layout.tsx
import { ClientLayout } from './client-layout'

export default function RootLayout({ children }) {
  return (
    <ClientLayout>
      {children} {/* Server Component como children */}
    </ClientLayout>
  )
}
```

```tsx
// app/client-layout.tsx
'use client'

export function ClientLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        Toggle Sidebar
      </button>
      {children} {/* Renderiza el Server Component */}
    </div>
  )
}
```

## Referencias

- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [React Server Components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)
