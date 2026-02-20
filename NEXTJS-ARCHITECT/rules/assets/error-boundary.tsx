'use client'

/**
 * Error Boundary reutilizable para Next.js App Router
 * Colocar como error.tsx en cualquier segmento de ruta
 * 
 * Uso: Crear archivo error.tsx en la carpeta de la ruta
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  const router = useRouter()

  useEffect(() => {
    // Log del error a servicio de monitoreo
    // Ejemplos: Sentry, LogRocket, etc.
    console.error('Error capturado:', error)
    
    // Opcional: Enviar a servicio de tracking
    // sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icono de error */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg 
            className="w-8 h-8 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Algo salió mal
        </h2>
        
        {/* Mensaje de error (solo en desarrollo) */}
        <p className="text-gray-600 mb-6">
          {process.env.NODE_ENV === 'development' 
            ? error.message 
            : 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
          }
        </p>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Volver al inicio
          </button>
        </div>

        {/* ID de error para soporte */}
        {error.digest && (
          <p className="mt-4 text-xs text-gray-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
