---
name: "Authentication"
description: "Patrones de autenticación en Next.js: middleware, protección de rutas, sesiones y autorización"
tags: ["authentication", "auth", "middleware", "session", "authorization"]
---

# Authentication en Next.js

## Descripción

Next.js proporciona múltiples capas para implementar autenticación: Middleware para protección de rutas, Server Components para verificación de sesiones, y Server Actions para operaciones autenticadas.

## Directrices Críticas

### MUST

- **MUST** usar Middleware para protección de rutas a nivel de edge
- **MUST** verificar sesión en Server Actions antes de operaciones sensibles
- **MUST** usar cookies seguras (`httpOnly`, `secure`, `sameSite`)
- **MUST** implementar CSRF protection para formularios
- **MUST** usar HTTPS en producción para todas las operaciones de auth
- **MUST** hashear contraseñas con algoritmos seguros (bcrypt, Argon2)

### FORBIDDEN

- **FORBIDDEN** almacenar secrets o tokens en código del cliente
- **FORBIDDEN** confiar solo en validación del cliente para auth
- **FORBIDDEN** enviar contraseñas en texto plano
- **FORBIDDEN** usar `localStorage` para tokens sensibles (usar cookies httpOnly)
- **FORBIDDEN** exponer información de usuarios en errores

### WHY

La autenticación es crítica para la seguridad. Next.js permite implementarla de manera segura con verificación en múltiples capas (middleware, server components, server actions).

## Middleware

### ✅ Middleware básico de autenticación

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  // Verificar autenticación
  const isAuthenticated = await verifyAuth(token)
  
  // Rutas protegidas
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  // Redirigir usuarios autenticados fuera de login/register
  if (isAuthenticated && 
      (request.nextUrl.pathname === '/login' || 
       request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
```

### ✅ Middleware con roles

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth, getUserRole } from './lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const isAuthenticated = await verifyAuth(token)
  const pathname = request.nextUrl.pathname
  
  // Rutas de admin
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    const role = await getUserRole(token)
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  // Rutas protegidas generales
  if (pathname.startsWith('/dashboard') && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*']
}
```

## Server Components

### ✅ Verificación de sesión en Server Component

```tsx
// app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <DashboardContent userId={session.user.id} />
    </div>
  )
}
```

### ✅ Verificación de autorización

```tsx
// app/admin/page.tsx
import { notFound, redirect } from 'next/navigation'
import { getSession, requireRole } from '@/lib/auth'

export default async function AdminPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  // Verificar rol específico
  if (session.user.role !== 'admin') {
    notFound() // O redirect('/unauthorized')
  }
  
  return <AdminDashboard />
}
```

## Server Actions

### ✅ Server Action autenticada

```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'

export async function updateProfile(formData: FormData) {
  const session = await getSession()
  
  if (!session) {
    return { error: 'Unauthorized' }
  }
  
  const name = formData.get('name') as string
  
  // Actualizar solo el usuario autenticado
  await db.user.update({
    where: { id: session.user.id },
    data: { name }
  })
  
  revalidatePath('/profile')
  return { success: true }
}
```

### ✅ Server Action con autorización

```tsx
// app/admin/actions.ts
'use server'

import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function deleteUser(userId: string) {
  const session = await getSession()
  
  if (!session) {
    return { error: 'Unauthorized' }
  }
  
  if (session.user.role !== 'admin') {
    return { error: 'Forbidden: Admin access required' }
  }
  
  await db.user.delete({ where: { id: userId } })
  
  revalidatePath('/admin/users')
  return { success: true }
}
```

## Route Handlers

### ✅ API Route protegida

```ts
// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true }
  })
  
  return NextResponse.json(user)
}
```

### ✅ API Route con autorización

```ts
// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession, requireAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await requireAdmin() // Lanza error si no es admin
    
    const users = await db.user.findMany()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
}
```

## Client Components

### ✅ Hook de autenticación

```tsx
// hooks/use-auth.ts
'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useRequireAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])
  
  return { session, status }
}

export function useRequireRole(role: string) {
  const { session, status } = useRequireAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (session && session.user.role !== role) {
      router.push('/unauthorized')
    }
  }, [session, role, router])
  
  return { session, status }
}
```

### ✅ Botón de logout

```tsx
// app/components/logout-button.tsx
'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })}>
      Logout
    </button>
  )
}
```

## Implementación de Auth (sin librería)

### Lib de autenticación

```ts
// lib/auth.ts
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import bcrypt from 'bcrypt'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)
  
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7 // 7 días
  })
  
  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  
  if (!token) return null
  
  try {
    const { payload } = await jwtVerify(token, secret)
    const user = await db.user.findUnique({
      where: { id: payload.userId as string }
    })
    return user
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}
```

### Login Server Action

```tsx
// app/login/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createSession, verifyPassword, getUserByEmail } from '@/lib/auth'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const user = await getUserByEmail(email)
  
  if (!user || !await verifyPassword(password, user.passwordHash)) {
    return { error: 'Invalid credentials' }
  }
  
  await createSession(user.id)
  redirect('/dashboard')
}
```

## Referencias

- [Next.js Authentication](https://nextjs.org/docs/app/building-your-application/authentication)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [NextAuth.js](https://next-auth.js.org/)
- [Auth.js](https://authjs.dev/)
