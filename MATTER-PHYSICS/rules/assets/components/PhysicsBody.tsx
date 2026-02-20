'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

type BodyType = 'rectangle' | 'circle' | 'polygon' | 'trapezoid'

interface PhysicsBodyProps {
  engine: React.MutableRefObject<Matter.Engine | null>
  type: BodyType
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  sides?: number
  slope?: number
  options?: Matter.IBodyDefinition
  onCreate?: (body: Matter.Body) => void
}

/**
 * Component for creating and managing a physics body
 */
export function PhysicsBody({
  engine,
  type,
  x,
  y,
  width = 80,
  height = 80,
  radius = 40,
  sides = 6,
  slope = 0.5,
  options = {},
  onCreate
}: PhysicsBodyProps) {
  const bodyRef = useRef<Matter.Body | null>(null)
  
  useEffect(() => {
    if (!engine.current) return
    
    // Create body based on type
    let body: Matter.Body
    
    switch (type) {
      case 'rectangle':
        body = Matter.Bodies.rectangle(x, y, width, height, options)
        break
      case 'circle':
        body = Matter.Bodies.circle(x, y, radius, options)
        break
      case 'polygon':
        body = Matter.Bodies.polygon(x, y, sides, radius, options)
        break
      case 'trapezoid':
        body = Matter.Bodies.trapezoid(x, y, width, height, slope, options)
        break
      default:
        body = Matter.Bodies.rectangle(x, y, width, height, options)
    }
    
    bodyRef.current = body
    Matter.Composite.add(engine.current.world, body)
    
    if (onCreate) {
      onCreate(body)
    }
    
    return () => {
      if (engine.current && bodyRef.current) {
        Matter.Composite.remove(engine.current.world, bodyRef.current)
      }
    }
  }, [])
  
  return null
}
