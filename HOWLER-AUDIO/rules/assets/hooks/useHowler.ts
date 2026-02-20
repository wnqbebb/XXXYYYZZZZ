'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'

interface UseHowlerOptions {
  src: string | string[]
  volume?: number
  loop?: boolean
  autoplay?: boolean
  html5?: boolean
  onLoad?: () => void
  onEnd?: () => void
  onError?: (id: number, error: unknown) => void
}

/**
 * Hook for Howler.js audio
 * 
 * @example
 * const { play, pause, stop, isPlaying, duration } = useHowler({
 *   src: ['/audio/music.mp3'],
 *   volume: 0.5,
 *   loop: true
 * })
 */
export function useHowler(options: UseHowlerOptions) {
  const soundRef = useRef<Howl | null>(null)
  const { src, volume = 0.5, loop = false, autoplay = false, html5 = false, onLoad, onEnd, onError } = options

  useEffect(() => {
    soundRef.current = new Howl({
      src: Array.isArray(src) ? src : [src],
      volume,
      loop,
      html5,
      autoplay,
      onload: onLoad,
      onend: onEnd,
      onloaderror: onError,
      onplayerror: onError
    })

    return () => {
      soundRef.current?.unload()
    }
  }, [src])

  const play = useCallback(() => {
    soundRef.current?.play()
  }, [])

  const pause = useCallback(() => {
    soundRef.current?.pause()
  }, [])

  const stop = useCallback(() => {
    soundRef.current?.stop()
  }, [])

  const fade = useCallback((from: number, to: number, duration: number) => {
    soundRef.current?.fade(from, to, duration)
  }, [])

  const seek = useCallback((time: number) => {
    soundRef.current?.seek(time)
  }, [])

  return {
    play,
    pause,
    stop,
    fade,
    seek,
    sound: soundRef.current,
    isPlaying: () => soundRef.current?.playing() || false,
    duration: () => soundRef.current?.duration() || 0,
    currentTime: () => soundRef.current?.seek() || 0
  }
}
