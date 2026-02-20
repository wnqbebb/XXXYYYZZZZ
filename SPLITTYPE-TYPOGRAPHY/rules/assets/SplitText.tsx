/**
 * SplitText - Componente base de texto dividido
 * 
 * Componente React que encapsula SplitType con todas las opciones disponibles.
 * 
 * @example
 * ```tsx
 * <SplitText 
 *   types="words, chars"
 *   className="text-4xl font-bold"
 *   onReady={(text) => animate(text.chars)}
 * >
 *   Hello World
 * </SplitText>
 * ```
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import SplitType from 'split-type'

export interface SplitTextProps {
  /** Contenido de texto */
  children: string
  /** Tipos de split */
  types?: string
  /** Usar posición absoluta */
  absolute?: boolean
  /** Tag HTML para elementos */
  tagName?: string
  /** Clase CSS base */
  className?: string
  /** Clase para líneas */
  lineClass?: string
  /** Clase para palabras */
  wordClass?: string
  /** Clase para caracteres */
  charClass?: string
  /** Clase para todos los elementos */
  splitClass?: string
  /** Callback cuando está listo */
  onReady?: (instance: SplitType) => void
  /** Observar resize y re-split */
  observeResize?: boolean
  /** Delay de debounce para resize */
  resizeDebounceMs?: number
  /** Estilos inline */
  style?: React.CSSProperties
  /** Tag del contenedor */
  as?: keyof JSX.IntrinsicElements
}

export const SplitText: React.FC<SplitTextProps> = ({
  children,
  types = 'words, chars',
  absolute = false,
  tagName = 'div',
  className = '',
  lineClass = 'line',
  wordClass = 'word',
  charClass = 'char',
  splitClass,
  onReady,
  observeResize,
  resizeDebounceMs = 100,
  style,
  as: Component = 'div'
}) => {
  const containerRef = useRef<HTMLElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const previousWidthRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  // Crear split
  const createSplit = useCallback(() => {
    if (!containerRef.current) return

    // Cleanup anterior
    if (textRef.current) {
      textRef.current.revert()
    }

    // Crear instancia
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

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Determinar si necesita observer
    const needsObserver = observeResize ?? (absolute || types.includes('lines'))

    if (needsObserver) {
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
        }, resizeDebounceMs)
      }

      resizeObserverRef.current = new ResizeObserver(handleResize)
      resizeObserverRef.current.observe(container)
    }

    createSplit()

    return () => {
      clearTimeout(timeoutId)
      resizeObserverRef.current?.disconnect()
      textRef.current?.revert()
    }
  }, [createSplit, absolute, types, observeResize, resizeDebounceMs])

  return React.createElement(
    Component,
    {
      ref: containerRef,
      className: `split-text ${className}`,
      style: {
        fontKerning: 'none',
        ...style
      },
      'data-split-ready': isReady
    },
    children
  )
}

SplitText.displayName = 'SplitText'

export default SplitText
