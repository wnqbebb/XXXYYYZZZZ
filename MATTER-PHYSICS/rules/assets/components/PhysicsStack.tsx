'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface PhysicsStackProps {
  engine: React.MutableRefObject<Matter.Engine | null>
  x: number
  y: number
  columns: number
  rows: number
  columnGap?: number
  rowGap?: number
  bodyWidth?: number
  bodyHeight?: number
  options?: Matter.IBodyDefinition
  onCreate?: (bodies: Matter.Body[]) => void
}

/**
 * Component for creating a stack of physics bodies
 */
export function PhysicsStack({
  engine,
  x,
  y,
  columns,
  rows,
  columnGap = 0,
  rowGap = 0,
  bodyWidth = 40,
  bodyHeight = 40,
  options = {},
  onCreate
}: PhysicsStackProps) {
  const bodiesRef = useRef<Matter.Body[]>([])
  
  useEffect(() => {
    if (!engine.current) return
    
    // Create stack using Composites
    const stack = Matter.Composites.stack(
      x,
      y,
      columns,
      rows,
      columnGap,
      rowGap,
      (stackX, stackY) => {
        return Matter.Bodies.rectangle(
          stackX,
          stackY,
          bodyWidth,
          bodyHeight,
          options
        )
      }
    )
    
    // Extract bodies from composite
    bodiesRef.current = stack.bodies
    
    // Add to world
    Matter.Composite.add(engine.current.world, stack)
    
    if (onCreate) {
      onCreate(bodiesRef.current)
    }
    
    return () => {
      if (engine.current) {
        Matter.Composite.remove(engine.current.world, stack)
      }
    }
  }, [])
  
  return null
}
