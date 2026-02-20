/**
 * TypewriterEffect - Efecto máquina de escribir
 * 
 * Componente que simula el efecto de una máquina de escribir con
 * opciones de cursor, velocidad y callbacks.
 * 
 * @example
 * ```tsx
 * <TypewriterEffect 
 *   text="Hola Mundo"
 *   speed={50}
 *   cursor={true}
 *   cursorStyle="|"
 *   onComplete={() => console.log('Done!')}
 * />
 * ```
 */

'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import SplitType from 'split-type'
import { gsap } from 'gsap'

export interface TypewriterEffectProps {
  /** Texto a escribir */
  text: string
  /** Velocidad en ms por carácter */
  speed?: number
  /** Delay inicial en ms */
  delay?: number
  /** Mostrar cursor */
  cursor?: boolean
  /** Estilo del cursor */
  cursorStyle?: string
  /** Clase CSS del cursor */
  cursorClassName?: string
  /** Parpadear cursor */
  cursorBlink?: boolean
  /** Clase CSS */
  className?: string
  /** Clase CSS del texto */
  textClassName?: string
  /** Callback al completar */
  onComplete?: () => void
  /** Callback por carácter */
  onCharacter?: (char: string, index: number) => void
  /** Iniciar automáticamente */
  autoStart?: boolean
  /** Trigger al entrar en viewport */
  triggerOnView?: boolean
  /** Borrar al final y repetir */
  loop?: boolean
  /** Pausa antes de borrar (ms) */
  deletePause?: number
  /** Velocidad de borrado */
  deleteSpeed?: number
  /** Estilos inline */
  style?: React.CSSProperties
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorStyle = '|',
  cursorClassName = 'typewriter-cursor',
  cursorBlink = true,
  className = '',
  textClassName = '',
  onComplete,
  onCharacter,
  autoStart = true,
  triggerOnView = false,
  loop = false,
  deletePause = 2000,
  deleteSpeed = 30,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const createAnimation = useCallback(() => {
    if (!textRef.current || !containerRef.current) return

    const chars = textRef.current.chars
    if (!chars || chars.length === 0) return

    // Cleanup anterior
    timelineRef.current?.kill()

    // Ocultar todos los caracteres
    gsap.set(chars, { opacity: 0 })

    // Crear timeline
    timelineRef.current = gsap.timeline({
      delay: delay / 1000,
      onStart: () => setIsTyping(true),
      onComplete: () => {
        setIsTyping(false)
        setIsComplete(true)
        onComplete?.()
      }
    })

    // Animar cada carácter
    chars.forEach((char, index) => {
      timelineRef.current?.to(char, {
        opacity: 1,
        duration: speed / 1000,
        ease: 'none',
        onStart: () => {
          onCharacter?.(char.textContent || '', index)
        }
      })
    })

    // Loop: borrar y repetir
    if (loop) {
      timelineRef.current
        .to({}, { duration: deletePause / 1000 }) // Pausa
        .to(chars, {
          opacity: 0,
          duration: deleteSpeed / 1000,
          stagger: {
            each: deleteSpeed / 1000,
            from: 'end'
          },
          ease: 'none',
          onComplete: () => {
            setIsComplete(false)
            createAnimation() // Reiniciar
          }
        })
    }
  }, [text, speed, delay, loop, deletePause, deleteSpeed, onComplete, onCharacter])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Crear SplitType
    textRef.current = new SplitType(container, { 
      types: 'chars',
      charClass: 'typewriter-char'
    })

    if (autoStart && !triggerOnView) {
      createAnimation()
    }

    // Trigger on view
    let observer: IntersectionObserver | null = null
    if (triggerOnView) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            createAnimation()
            observer?.disconnect()
          }
        },
        { threshold: 0.5 }
      )
      observer.observe(container)
    }

    // Cursor blink
    let cursorTween: gsap.core.Tween | null = null
    if (cursor && cursorBlink && cursorRef.current) {
      cursorTween = gsap.to(cursorRef.current, {
        opacity: 0,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'steps(1)'
      })
    }

    return () => {
      observer?.disconnect()
      timelineRef.current?.kill()
      cursorTween?.kill()
      textRef.current?.revert()
    }
  }, [createAnimation, autoStart, triggerOnView, cursor, cursorBlink])

  // Controlar visibilidad del cursor
  useEffect(() => {
    if (cursorRef.current) {
      if (isComplete && !loop) {
        gsap.set(cursorRef.current, { opacity: 1 })
      }
    }
  }, [isComplete, loop])

  return (
    <div
      className={`typewriter-effect ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style
      }}
    >
      <span
        ref={containerRef}
        className={`typewriter-text ${textClassName}`}
        style={{ fontKerning: 'none' }}
      >
        {text}
      </span>
      {cursor && (
        <span
          ref={cursorRef}
          className={cursorClassName}
          style={{
            marginLeft: '2px',
            fontWeight: 'normal',
            userSelect: 'none'
          }}
        >
          {cursorStyle}
        </span>
      )}
    </div>
  )
}

TypewriterEffect.displayName = 'TypewriterEffect'

export default TypewriterEffect
