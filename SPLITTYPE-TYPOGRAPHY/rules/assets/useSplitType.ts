/**
 * useSplitType - React Hook para SplitType
 * 
 * Hook base para integrar SplitType en aplicaciones React con cleanup automático
 * y soporte para re-split en resize cuando es necesario.
 * 
 * @example
 * ```tsx
 * const { containerRef, textRef, isReady } = useSplitType({
 *   types: 'words, chars',
 *   absolute: false
 * })
 * 
 * useEffect(() => {
 *   if (!isReady || !textRef.current) return
 *   
 *   gsap.from(textRef.current.chars, {
 *     y: 50,
 *     opacity: 0,
 *     stagger: 0.02
 *   })
 * }, [isReady])
 * ```
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import SplitType from 'split-type'

interface UseSplitTypeOptions {
  /** Tipos de split: 'lines', 'words', 'chars' o combinación */
  types?: string
  /** Usar posición absoluta */
  absolute?: boolean
  /** Tag HTML para elementos divididos */
  tagName?: string
  /** Clase para líneas */
  lineClass?: string
  /** Clase para palabras */
  wordClass?: string
  /** Clase para caracteres */
  charClass?: string
  /** Clase para todos los elementos divididos */
  splitClass?: string
  /** Delay de debounce para resize (ms) */
  debounceMs?: number
  /** Callback cuando el split está listo */
  onReady?: (instance: SplitType) => void
}

interface UseSplitTypeReturn {
  /** Ref para el contenedor del texto */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Ref a la instancia de SplitType */
  textRef: React.MutableRefObject<SplitType | null>
  /** Indica si el split está listo */
  isReady: boolean
  /** Función para re-split manual */
  reSplit: () => void
  /** Función para revertir */
  revert: () => void
}

export function useSplitType(options: UseSplitTypeOptions = {}): UseSplitTypeReturn {
  const {
    types = 'words, chars',
    absolute = false,
    tagName = 'div',
    lineClass = 'line',
    wordClass = 'word',
    charClass = 'char',
    splitClass,
    debounceMs = 100,
    onReady
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const previousWidthRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  // Función para crear el split
  const createSplit = useCallback(() => {
    if (!containerRef.current) return

    // Cleanup anterior si existe
    if (textRef.current) {
      textRef.current.revert()
    }

    // Crear nueva instancia
    textRef.current = new SplitType(containerRef.current, {
      types,
      absolute,
      tagName,
      lineClass,
      wordClass,
      charClass,
      splitClass
    })

    previousWidthRef.current = containerRef.current.offsetWidth
    setIsReady(true)
    onReady?.(textRef.current)
  }, [types, absolute, tagName, lineClass, wordClass, charClass, splitClass, onReady])

  // Función para re-split manual
  const reSplit = useCallback(() => {
    textRef.current?.split()
  }, [])

  // Función para revertir
  const revert = useCallback(() => {
    resizeObserverRef.current?.disconnect()
    textRef.current?.revert()
    textRef.current = null
    setIsReady(false)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Solo necesita ResizeObserver si absolute=true o types incluye 'lines'
    const needsObserver = absolute || types.includes('lines')

    if (needsObserver) {
      // Debounce helper
      let timeoutId: ReturnType<typeof setTimeout>
      
      const handleResize = (entries: ResizeObserverEntry[]) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          const [entry] = entries
          const width = Math.floor(entry.contentRect.width)
          
          if (previousWidthRef.current !== width && textRef.current) {
            textRef.current.split()
            previousWidthRef.current = width
          }
        }, debounceMs)
      }

      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(container)
    }

    // Crear split inicial
    createSplit()

    return () => {
      clearTimeout(timeoutId)
      resizeObserverRef.current?.disconnect()
      textRef.current?.revert()
    }
  }, [createSplit, absolute, types, debounceMs])

  return {
    containerRef,
    textRef,
    isReady,
    reSplit,
    revert
  }
}

export default useSplitType
