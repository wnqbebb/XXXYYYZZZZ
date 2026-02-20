---
name: "Server Actions"
description: "Mutaciones server-side con Server Actions, formularios, manejo de errores y revalidación"
tags: ["server-actions", "mutations", "forms", "revalidate", "actions"]
---

# Server Actions

## Descripción

Las Server Actions permiten ejecutar código server-side directamente desde componentes React. Son ideales para formularios, mutaciones de datos y operaciones que requieren acceso a recursos del servidor.

## Directrices Críticas

### MUST

- **MUST** agregar `'use server'` al inicio del archivo o función
- **MUST** usar Server Actions para mutaciones POST/PUT/DELETE
- **MUST** usar `revalidatePath` o `revalidateTag` después de mutaciones
- **MUST** manejar errores devolviendo objetos de error, no lanzando excepciones
- **MUST** validar datos de entrada en Server Actions (nunca confiar en el cliente)
- **MUST** usar `redirect()` después de mutaciones exitosas

### FORBIDDEN

- **FORBIDDEN** usar Server Actions para operaciones de solo lectura (usar Server Components)
- **FORBIDDEN** lanzar errores en Server Actions (devolver objetos de error)
- **FORBIDDEN** olvidar revalidar el cache después de mutaciones
- **FORBIDDEN** confiar en validación solo del cliente
- **FORBIDDEN** exponer información sensible en errores

### WHY

Las Server Actions eliminan la necesidad de crear endpoints API manuales, proporcionan seguridad type-safe entre cliente y servidor, y manejan automáticamente CSRF protection.

## Ejemplos

### ✅ Correcto: Server Action básica

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // Validación server-side obligatoria
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' }
  }
  
  try {
    await fetch('https://api.example.com/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content })
    })
    
    revalidatePath('/posts')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to create post' }
  }
}
```

### ✅ Correcto: Formulario con Server Action

```tsx
// app/posts/new/page.tsx
import { createPost } from './actions'

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" required />
      </div>
      <button type="submit">Create Post</button>
    </form>
  )
}
```

### ✅ Correcto: Server Action con estado (useActionState)

```tsx
// app/components/post-form.tsx
'use client'

import { useActionState } from 'react'
import { createPost } from './actions'

const initialState = { error: '', success: false }

export function PostForm() {
  const [state, formAction, isPending] = useActionState(createPost, initialState)
  
  return (
    <form action={formAction}>
      <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </div>
      
      {state.error && (
        <p className="error">{state.error}</p>
      )}
      
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  )
}
```

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title') as string
  
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters', success: false }
  }
  
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title })
  })
  
  revalidatePath('/posts')
  return { success: true, error: '' }
}
```

### ✅ Correcto: Redirect después de mutación

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  
  const res = await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title })
  })
  
  const post = await res.json()
  
  revalidatePath('/posts')
  redirect(`/posts/${post.id}`) // redirect debe ir al final
}
```

### ✅ Correcto: Revalidación por tag

```tsx
// app/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function updateUser(formData: FormData) {
  const userId = formData.get('userId') as string
  
  await fetch(`https://api.example.com/users/${userId}`, {
    method: 'PUT',
    body: formData
  })
  
  revalidateTag(`user-${userId}`)
  revalidateTag('users-list')
}
```

### ✅ Correcto: Server Action inline

```tsx
// app/posts/page.tsx
import { revalidatePath } from 'next/cache'

export default function PostsPage() {
  async function deletePost(formData: FormData) {
    'use server'
    
    const postId = formData.get('postId') as string
    
    await fetch(`https://api.example.com/posts/${postId}`, {
      method: 'DELETE'
    })
    
    revalidatePath('/posts')
  }
  
  return (
    <form action={deletePost}>
      <input type="hidden" name="postId" value="123" />
      <button type="submit">Delete Post</button>
    </form>
  )
}
```

### ❌ Incorrecto: Sin revalidación

```tsx
// ❌ MAL: Sin revalidar el cache
'use server'

export async function createPost(formData: FormData) {
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: formData
  })
  // ❌ Falta revalidatePath o revalidateTag!
}
```

### ❌ Incorrecto: Lanzando errores

```tsx
// ❌ MAL: Lanzando errores en Server Actions
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  
  if (!title) {
    throw new Error('Title is required') // ❌ No lanzar errores!
  }
  
  // ...
}
```

```tsx
// ✅ BIEN: Devolver objetos de error
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  
  if (!title) {
    return { error: 'Title is required', success: false } // ✅ Devolver error
  }
  
  // ...
  return { success: true }
}
```

### ❌ Incorrecto: Sin validación server-side

```tsx
// ❌ MAL: Sin validación server-side
'use server'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  
  // ❌ No hay validación! El cliente puede enviar cualquier cosa
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title })
  })
}
```

```tsx
// ✅ BIEN: Con validación server-side
'use server'

import { z } from 'zod'

const schema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().min(10)
})

export async function createPost(formData: FormData) {
  const data = {
    title: formData.get('title'),
    content: formData.get('content')
  }
  
  const result = schema.safeParse(data)
  
  if (!result.success) {
    return { 
      error: 'Validation failed', 
      issues: result.error.issues 
    }
  }
  
  await fetch('https://api.example.com/posts', {
    method: 'POST',
    body: JSON.stringify(result.data)
  })
}
```

## Patrones Avanzados

### Server Action con Autenticación

```tsx
// app/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const session = await auth()
  
  if (!session?.user) {
    return { error: 'Unauthorized' }
  }
  
  const post = await fetch('https://api.example.com/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.user.token}`
    },
    body: formData
  })
  
  revalidatePath('/posts')
  return { success: true, postId: post.id }
}
```

### Optimistic Updates

```tsx
// app/components/like-button.tsx
'use client'

import { useOptimistic } from 'react'
import { likePost } from './actions'

export function LikeButton({ postId, initialLikes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    initialLikes,
    (state) => state + 1
  )
  
  async function handleLike() {
    addOptimisticLike(undefined)
    await likePost(postId)
  }
  
  return (
    <button onClick={handleLike}>
      ❤️ {optimisticLikes}
    </button>
  )
}
```

## Referencias

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React useActionState](https://react.dev/reference/react/useActionState)
- [React useOptimistic](https://react.dev/reference/react/useOptimistic)
