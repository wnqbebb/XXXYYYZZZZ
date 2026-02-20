/**
 * Utilidades para data fetching en Next.js
 * Incluye funciones tipadas, manejo de errores y revalidación
 */

import { revalidateTag, revalidatePath } from 'next/cache'

// Configuración base
const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL

// Opciones de fetch extendidas
interface FetcherOptions extends RequestInit {
  next?: {
    revalidate?: number | false
    tags?: string[]
  }
}

// Respuesta tipada
interface FetcherResponse<T> {
  data: T | null
  error: string | null
  status: number
}

/**
 * Fetcher tipado con manejo de errores
 * @param endpoint - Endpoint relativo (ej: '/posts')
 * @param options - Opciones de fetch
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<FetcherResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      return {
        data: null,
        error: `HTTP ${response.status}: ${errorText || response.statusText}`,
        status: response.status,
      }
    }
    
    const data = await response.json()
    return {
      data,
      error: null,
      status: response.status,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0,
    }
  }
}

/**
 * Fetcher con cache por tags
 * @param endpoint - Endpoint relativo
 * @param tags - Tags para invalidación
 * @param revalidate - Tiempo de revalidación en segundos
 */
export async function fetcherWithCache<T>(
  endpoint: string,
  tags: string[],
  revalidate: number = 3600
): Promise<FetcherResponse<T>> {
  return fetcher<T>(endpoint, {
    next: {
      revalidate,
      tags,
    },
  })
}

/**
 * Fetcher para datos dinámicos (sin cache)
 * @param endpoint - Endpoint relativo
 */
export async function fetcherDynamic<T>(
  endpoint: string
): Promise<FetcherResponse<T>> {
  return fetcher<T>(endpoint, {
    cache: 'no-store',
  })
}

/**
 * Revalidar datos por tags
 * @param tags - Tags a revalidar
 */
export async function revalidateByTags(tags: string[]) {
  for (const tag of tags) {
    revalidateTag(tag)
  }
}

/**
 * Revalidar múltiples paths
 * @param paths - Paths a revalidar
 */
export async function revalidateByPaths(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path)
  }
}

// ==================== EJEMPLOS DE USO ====================

/**
 * Obtener posts con cache
 * Uso en Server Component:
 * 
 * async function getPosts() {
 *   const { data, error } = await getPostsFetcher()
 *   if (error) throw new Error(error)
 *   return data
 * }
 */
export async function getPostsFetcher() {
  return fetcherWithCache<any[]>('/posts', ['posts', 'blog'], 3600)
}

/**
 * Obtener post por slug
 */
export async function getPostBySlugFetcher(slug: string) {
  return fetcherWithCache<any>(`/posts/${slug}`, [`post-${slug}`, 'posts'], 3600)
}

/**
 * Obtener datos del usuario (dinámico)
 */
export async function getUserDataFetcher(userId: string) {
  return fetcherDynamic<any>(`/users/${userId}`)
}

/**
 * Crear post (Server Action)
 */
export async function createPostAction(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  const { data, error } = await fetcher<any>('/posts', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  })
  
  if (error) {
    return { error, success: false }
  }
  
  // Revalidar cache
  await revalidateByTags(['posts', 'blog'])
  await revalidateByPaths(['/blog', '/'])
  
  return { data, success: true }
}

/**
 * Actualizar post (Server Action)
 */
export async function updatePostAction(slug: string, formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  const { data, error } = await fetcher<any>(`/posts/${slug}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  })
  
  if (error) {
    return { error, success: false }
  }
  
  // Revalidar cache específico y general
  await revalidateByTags([`post-${slug}`, 'posts', 'blog'])
  await revalidateByPaths([`/blog/${slug}`, '/blog', '/'])
  
  return { data, success: true }
}

/**
 * Eliminar post (Server Action)
 */
export async function deletePostAction(slug: string) {
  'use server'
  
  const { error } = await fetcher(`/posts/${slug}`, {
    method: 'DELETE',
  })
  
  if (error) {
    return { error, success: false }
  }
  
  await revalidateByTags(['posts', 'blog', `post-${slug}`])
  await revalidateByPaths(['/blog', '/'])
  
  return { success: true }
}
