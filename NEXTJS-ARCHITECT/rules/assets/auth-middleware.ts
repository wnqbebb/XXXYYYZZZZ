/**
 * Middleware de autenticación para Next.js
 * Protege rutas y redirige usuarios según su estado de autenticación
 * 
 * Uso: Colocar en la raíz del proyecto como middleware.ts
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Configuración de rutas
const PROTECTED_ROUTES = ['/dashboard', '/profile', '/settings']
const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password']
const ADMIN_ROUTES = ['/admin']

// Verificar si una ruta coincide con los patrones
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(route => pathname.startsWith(route))
}

// Verificar token de autenticación
async function verifyAuth(token: string | undefined): Promise<boolean> {
  if (!token) return false
  
  // Implementar verificación de JWT o sesión aquí
  // Ejemplo con JWT:
  // try {
  //   await jwtVerify(token, secret)
  //   return true
  // } catch {
  //   return false
  // }
  
  return true // Placeholder
}

// Obtener rol del usuario
async function getUserRole(token: string | undefined): Promise<string | null> {
  if (!token) return null
  
  // Decodificar token y retornar rol
  // return decoded.role
  
  return 'user' // Placeholder
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  
  // Verificar autenticación
  const isAuthenticated = await verifyAuth(token)
  const userRole = await getUserRole(token)
  
  // Proteger rutas de admin
  if (matchesRoute(pathname, ADMIN_ROUTES)) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  // Proteger rutas autenticadas
  if (matchesRoute(pathname, PROTECTED_ROUTES)) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Redirigir usuarios autenticados fuera de rutas públicas
  if (isAuthenticated && matchesRoute(pathname, PUBLIC_ROUTES)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

// Configurar matcher para evitar ejecutar en archivos estáticos
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
