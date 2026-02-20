'use client'

import { useEffect, useRef } from 'react'
import { Howl } from 'howler'

interface SoundEffectProps {
  src: string
  trigger: 'hover' | 'click'
  children: React.ReactNode
  volume?: number
}

/**
 * SoundEffect Component
 * Wraps children with sound effects
 * 
 * @example
 * <SoundEffect src="/audio/hover.mp3" trigger="hover">
 *   <button>Hover me</button>
 * </SoundEffect>
 */
export function SoundEffect({ 
  src, 
  trigger, 
  children, 
  volume = 0.3 
}: SoundEffectProps) {
  const soundRef = useRef<Howl | null>(null)

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      volume,
      preload: true
    })

    return () => {
      soundRef.current?.unload()
    }
  }, [src, volume])

  const playSound = () => {
    soundRef.current?.play()
  }

  return (
    <span
      onMouseEnter={trigger === 'hover' ? playSound : undefined}
      onClick={trigger === 'click' ? playSound : undefined}
    >
      {children}
    </span>
  )
}
