'use client'

import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Object3D } from 'three'

type AnimationCallback = (delta: number, elapsed: number) => void

interface UseAnimationOptions {
  autoStart?: boolean
}

export function useAnimation(
  callback: AnimationCallback,
  options: UseAnimationOptions = {}
) {
  const { autoStart = true } = options
  const isPlayingRef = useRef(autoStart)
  
  const play = useCallback(() => {
    isPlayingRef.current = true
  }, [])
  
  const pause = useCallback(() => {
    isPlayingRef.current = false
  }, [])
  
  const toggle = useCallback(() => {
    isPlayingRef.current = !isPlayingRef.current
  }, [])
  
  useFrame((state, delta) => {
    if (!isPlayingRef.current) return
    callback(delta, state.clock.elapsedTime)
  })
  
  return { play, pause, toggle, isPlaying: () => isPlayingRef.current }
}

// Hook for smooth follow animation
export function useSmoothFollow(
  target: React.RefObject<Object3D>,
  follower: React.RefObject<Object3D>,
  lerpFactor = 0.1
) {
  useFrame(() => {
    if (!target.current || !follower.current) return
    
    follower.current.position.lerp(target.current.position, lerpFactor)
    follower.current.quaternion.slerp(target.current.quaternion, lerpFactor)
  })
}

// Hook for rotation animation
export function useRotation(
  ref: React.RefObject<Object3D>,
  speed = 1,
  axis: 'x' | 'y' | 'z' = 'y'
) {
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation[axis] += delta * speed
  })
}
