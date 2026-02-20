'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

type BodyType = 'rectangle' | 'circle' | 'polygon'

interface UsePhysicsBodyOptions {
  type: BodyType
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  sides?: number
  options?: Matter.IBodyDefinition
}

interface UsePhysicsBodyReturn {
  body: React.MutableRefObject<Matter.Body | null>
  setPosition: (x: number, y: number) => void
  setVelocity: (x: number, y: number) => void
  setAngle: (angle: number) => void
  applyForce: (x: number, y: number) => void
  applyTorque: (torque: number) => void
}

/**
 * Hook for managing a single physics body
 */
export function usePhysicsBody(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  options: UsePhysicsBodyOptions
): UsePhysicsBodyReturn {
  const bodyRef = useRef<Matter.Body | null>(null)
  
  const {
    type,
    x,
    y,
    width = 80,
    height = 80,
    radius = 40,
    sides = 6,
    options: bodyOptions = {}
  } = options
  
  // Create body on mount
  useEffect(() => {
    if (!engineRef.current) return
    
    let body: Matter.Body
    
    switch (type) {
      case 'rectangle':
        body = Matter.Bodies.rectangle(x, y, width, height, bodyOptions)
        break
      case 'circle':
        body = Matter.Bodies.circle(x, y, radius, bodyOptions)
        break
      case 'polygon':
        body = Matter.Bodies.polygon(x, y, sides, radius, bodyOptions)
        break
      default:
        body = Matter.Bodies.rectangle(x, y, width, height, bodyOptions)
    }
    
    bodyRef.current = body
    Matter.Composite.add(engineRef.current.world, body)
    
    return () => {
      if (engineRef.current && bodyRef.current) {
        Matter.Composite.remove(engineRef.current.world, bodyRef.current)
      }
    }
  }, [])
  
  // Update position if props change (for controlled components)
  useEffect(() => {
    if (bodyRef.current) {
      Matter.Body.setPosition(bodyRef.current, { x, y })
    }
  }, [x, y])
  
  // Control methods
  const setPosition = useCallback((newX: number, newY: number) => {
    if (bodyRef.current) {
      Matter.Body.setPosition(bodyRef.current, { x: newX, y: newY })
    }
  }, [])
  
  const setVelocity = useCallback((vx: number, vy: number) => {
    if (bodyRef.current) {
      Matter.Body.setVelocity(bodyRef.current, { x: vx, y: vy })
    }
  }, [])
  
  const setAngle = useCallback((angle: number) => {
    if (bodyRef.current) {
      Matter.Body.setAngle(bodyRef.current, angle)
    }
  }, [])
  
  const applyForce = useCallback((fx: number, fy: number) => {
    if (bodyRef.current) {
      Matter.Body.applyForce(bodyRef.current, bodyRef.current.position, {
        x: fx,
        y: fy
      })
    }
  }, [])
  
  const applyTorque = useCallback((torque: number) => {
    if (bodyRef.current) {
      Matter.Body.setAngularVelocity(bodyRef.current, torque)
    }
  }, [])
  
  return {
    body: bodyRef,
    setPosition,
    setVelocity,
    setAngle,
    applyForce,
    applyTorque
  }
}
