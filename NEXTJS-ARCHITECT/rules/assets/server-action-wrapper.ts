/**
 * Wrapper para Server Actions con manejo de errores estándar
 * Proporciona tipado seguro y respuestas consistentes
 */

import { redirect } from 'next/navigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { ZodSchema, ZodError } from 'zod'

// Tipo de respuesta estándar para Server Actions
export interface ActionResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string[]>
  fieldErrors?: Record<string, string>
}

// Opciones para el wrapper
interface ActionWrapperOptions {
  revalidatePaths?: string[]
  revalidateTags?: string[]
  redirectTo?: string
}

/**
 * Wrapper para Server Actions con manejo de errores
 * @param action - Función que ejecuta la acción
 * @param options - Opciones de revalidación y redirección
 */
export function createServerAction<T>(
  action: () => Promise<T>,
  options: ActionWrapperOptions = {}
): () => Promise<ActionResponse<T>> {
  return async () => {
    try {
      const data = await action()
      
      // Revalidar paths si se especificaron
      if (options.revalidatePaths) {
        for (const path of options.revalidatePaths) {
          revalidatePath(path)
        }
      }
      
      // Revalidar tags si se especificaron
      if (options.revalidateTags) {
        for (const tag of options.revalidateTags) {
          revalidateTag(tag)
        }
      }
      
      // Redirigir si se especificó
      if (options.redirectTo) {
        redirect(options.redirectTo)
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Server Action Error:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}

/**
 * Wrapper para Server Actions con FormData y validación Zod
 * @param schema - Schema de Zod para validación
 * @param action - Función que ejecuta la acción con datos validados
 * @param options - Opciones de revalidación y redirección
 */
export function createFormAction<T>(
  schema: ZodSchema<T>,
  action: (data: T) => Promise<unknown>,
  options: ActionWrapperOptions = {}
) {
  return async (formData: FormData): Promise<ActionResponse> => {
    try {
      // Convertir FormData a objeto
      const rawData = Object.fromEntries(formData.entries())
      
      // Validar con Zod
      const validatedData = schema.parse(rawData)
      
      // Ejecutar acción
      const result = await action(validatedData)
      
      // Revalidar paths
      if (options.revalidatePaths) {
        for (const path of options.revalidatePaths) {
          revalidatePath(path)
        }
      }
      
      // Revalidar tags
      if (options.revalidateTags) {
        for (const tag of options.revalidateTags) {
          revalidateTag(tag)
        }
      }
      
      // Redirigir
      if (options.redirectTo) {
        redirect(options.redirectTo)
      }
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Form Action Error:', error)
      
      // Manejar errores de validación de Zod
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {}
        
        for (const issue of error.issues) {
          const path = issue.path.join('.')
          if (!fieldErrors[path]) {
            fieldErrors[path] = issue.message
          }
        }
        
        return {
          success: false,
          error: 'Validation failed',
          fieldErrors,
        }
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}

/**
 * Wrapper para Server Actions con estado (useActionState)
 * @param action - Función que ejecuta la acción
 * @param options - Opciones de revalidación y redirección
 */
export function createStatefulAction<T>(
  action: (prevState: unknown, formData: FormData) => Promise<T>,
  options: ActionWrapperOptions = {}
) {
  return async (
    prevState: unknown,
    formData: FormData
  ): Promise<ActionResponse<T>> => {
    try {
      const data = await action(prevState, formData)
      
      if (options.revalidatePaths) {
        for (const path of options.revalidatePaths) {
          revalidatePath(path)
        }
      }
      
      if (options.revalidateTags) {
        for (const tag of options.revalidateTags) {
          revalidateTag(tag)
        }
      }
      
      if (options.redirectTo) {
        redirect(options.redirectTo)
      }
      
      return { success: true, data }
    } catch (error) {
      console.error('Stateful Action Error:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}

// ==================== EJEMPLOS DE USO ====================

/*
// 1. Server Action simple
// app/actions.ts
'use server'

import { createServerAction } from '@/lib/server-action-wrapper'

export const deletePost = createServerAction(
  async (postId: string) => {
    await db.post.delete({ where: { id: postId } })
    return { deleted: true }
  },
  {
    revalidatePaths: ['/posts', '/'],
    revalidateTags: ['posts'],
  }
)

// Uso:
// const result = await deletePost('123')
// if (!result.success) console.error(result.error)
*/

/*
// 2. Server Action con FormData y validación
// app/actions.ts
'use server'

import { z } from 'zod'
import { createFormAction } from '@/lib/server-action-wrapper'

const createPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
})

export const createPost = createFormAction(
  createPostSchema,
  async (data) => {
    const post = await db.post.create({ data })
    return post
  },
  {
    revalidatePaths: ['/posts'],
    revalidateTags: ['posts'],
    redirectTo: '/posts',
  }
)

// Uso en componente:
// <form action={createPost}>
//   <input name="title" />
//   <textarea name="content" />
//   <button type="submit">Create</button>
// </form>
*/

/*
// 3. Server Action con estado (useActionState)
// app/actions.ts
'use server'

import { createStatefulAction } from '@/lib/server-action-wrapper'

export const updateProfile = createStatefulAction(
  async (prevState, formData) => {
    const name = formData.get('name') as string
    const bio = formData.get('bio') as string
    
    const user = await db.user.update({
      where: { id: prevState?.userId },
      data: { name, bio },
    })
    
    return user
  },
  {
    revalidatePaths: ['/profile'],
  }
)

// Uso en componente:
// const [state, formAction, isPending] = useActionState(updateProfile, null)
*/
