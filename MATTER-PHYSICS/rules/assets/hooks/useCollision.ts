'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

type CollisionEventType = 'collisionStart' | 'collisionActive' | 'collisionEnd'

interface CollisionCallback {
  (event: Matter.IEventCollision<Matter.Engine>): void
}

/**
 * Hook for listening to collision events
 */
export function useCollision(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  event: CollisionEventType,
  callback: CollisionCallback
) {
  const callbackRef = useRef(callback)
  
  // Keep callback ref up to date
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  
  useEffect(() => {
    if (!engineRef.current) return
    
    const handler = (e: Matter.IEventCollision<Matter.Engine>) => {
      callbackRef.current(e)
    }
    
    Matter.Events.on(engineRef.current, event, handler)
    
    return () => {
      if (engineRef.current) {
        Matter.Events.off(engineRef.current, event, handler)
      }
    }
  }, [engineRef, event])
}

/**
 * Hook for collision start events
 */
export function useCollisionStart(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  callback: CollisionCallback
) {
  return useCollision(engineRef, 'collisionStart', callback)
}

/**
 * Hook for collision active events
 */
export function useCollisionActive(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  callback: CollisionCallback
) {
  return useCollision(engineRef, 'collisionActive', callback)
}

/**
 * Hook for collision end events
 */
export function useCollisionEnd(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  callback: CollisionCallback
) {
  return useCollision(engineRef, 'collisionEnd', callback)
}

/**
 * Hook for specific body collision
 */
export function useBodyCollision(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  bodyLabel: string,
  callback: (body: Matter.Body, otherBody: Matter.Body) => void
) {
  useCollisionStart(engineRef, (event) => {
    event.pairs.forEach((pair) => {
      const { bodyA, bodyB } = pair
      
      if (bodyA.label === bodyLabel) {
        callback(bodyA, bodyB)
      } else if (bodyB.label === bodyLabel) {
        callback(bodyB, bodyA)
      }
    })
  })
}
