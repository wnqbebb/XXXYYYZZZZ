---
name: "Client Components"
description: "Uso correcto de Client Components, directivas 'use client' y patrones de interacción"
tags: ["client-components", "use-client", "interactivity", "hooks"]
---

# Client Components

## Descripción

Los Client Components se ejecutan en el navegador. Son necesarios para interactividad, estado local, efectos secundarios y APIs del browser. Se activan con la directiva `'use client'`.

## Directrices Críticas

### MUST

- **MUST** agregar `'use client'` en la primera línea del archivo antes de cualquier importación
- **MUST** usar Client Components solo cuando se necesite interactividad del usuario
- **MUST** mantener Client Components lo más pequeños posible ("leaves of the tree")
- **MUST** usar Server Components para data fetching y pasar datos como props
- **MUST** considerar el impacto en el bundle size al crear Client Components

### FORBIDDEN

- **FORBIDDEN** usar `'use client'` en todo el árbol de componentes sin necesidad
- **FORBIDDEN** hacer data fetching directamente en Client Components (usar Server Components)
- **FORBIDDEN** importar Server Components en Client Components (rompe el boundary)
- **FORBIDDEN** usar `async/await` en Client Components (no soportado por React en cliente)
- **FORBIDDEN** olvidar que los Client Components se hidratan y ejecutan en el cliente

### WHY

Los Client Components aumentan el JavaScript enviado al cliente. Usarlos estratégicamente mantiene las aplicaciones rápidas mientras proporciona la interactividad necesaria.

## Ejemplos

### ✅ Correcto: Directiva 'use client'

```tsx
// app/components/counter.tsx
'use client'

import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  )
}
```

### ✅ Correcto: Client Component pequeño y enfocado

```tsx
// app/components/like-button.tsx
'use client'

import { useState } from 'react'
import { likePost } from './actions'

export function LikeButton({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, setIsPending] = useState(false)
  
  async function handleLike() {
    setIsPending(true)
    const result = await likePost(postId)
    setLikes(result.likes)
    setIsPending(false)
  }
  
  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {likes}
    </button>
  )
}
```

### ✅ Correcto: Server Component envuelve Client Component

```tsx
// app/post-card.tsx (Server Component)
import { getPostLikes } from '@/lib/posts'
import { LikeButton } from './like-button'

export async function PostCard({ postId }) {
  const likes = await getPostLikes(postId)
  
  return (
    <article>
      <h2>Post Title</h2>
      <p>Post content...</p>
      <LikeButton postId={postId} initialLikes={likes} />
    </article>
  )
}
```

### ❌ Incorrecto: 'use client' en la posición incorrecta

```tsx
// ❌ ERROR: 'use client' debe ser la primera línea
import { useState } from 'react'
'use client' // ❌ Error!

export function Component() {
  // ...
}
```

### ❌ Incorrecto: Data fetching en Client Component

```tsx
// ❌ MAL: Data fetching en Client Component
'use client'

import { useEffect, useState } from 'react'

export function UserList() {
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

```tsx
// ✅ BIEN: Data fetching en Server Component
// app/users/page.tsx
async function getUsers() {
  const res = await fetch('/api/users')
  return res.json()
}

export default async function UsersPage() {
  const users = await getUsers()
  
  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### ❌ Incorrecto: Importar Server Component en Client Component

```tsx
// ❌ ERROR: No importar Server Components en Client Components
'use client'

import { ServerCard } from './server-card' // ❌ Rompe el boundary!

export function ClientWrapper() {
  return <ServerCard />
}
```

```tsx
// ✅ BIEN: Pasar Server Component como children
// app/page.tsx
import { ClientWrapper } from './client-wrapper'
import { ServerCard } from './server-card'

export default function Page() {
  return (
    <ClientWrapper>
      <ServerCard /> {/* ✅ Server Component como children */}
    </ClientWrapper>
  )
}
```

```tsx
// app/client-wrapper.tsx
'use client'

export function ClientWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && children}
    </div>
  )
}
```

## Hooks Permitidos en Client Components

```tsx
'use client'

import { 
  useState, 
  useEffect, 
  useContext, 
  useReducer, 
  useMemo, 
  useCallback,
  useRef,
  useLayoutEffect,
  useId
} from 'react'

// Todos los hooks de React están disponibles
```

## APIs del Browser Disponibles

```tsx
'use client'

export function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth)
  
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return <span>{width}px</span>
}
```

## Referencias

- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [React Hooks](https://react.dev/reference/react)
