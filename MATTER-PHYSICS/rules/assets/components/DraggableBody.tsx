'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

type BodyType = 'rectangle' | 'circle' | 'polygon'

interface DraggableBodyProps {
  engine: React.MutableRefObject<Matter.Engine | null>
  canvasRef: React.RefObject<HTMLCanvasElement>
  type: BodyType
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  sides?: number
  options?: Matter.IBodyDefinition
  onDragStart?: (body: Matter.Body) => void
  onDragEnd?: (body: Matter.Body) => void
}

/**
 * Component for creating a draggable physics body with mouse interaction
 */
export function DraggableBody({
  engine,
  canvasRef,
  type,
  x,
  y,
  width = 80,
  height = 80,
  radius = 40,
  sides = 6,
  options = {},
  onDragStart,
  onDragEnd
}: DraggableBodyProps) {
  const bodyRef = useRef<Matter.Body | null>(null)
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)
  
  useEffect(() => {
    if (!engine.current || !canvasRef.current) return
    
    // Create body
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
      default:
        body = Matter.Bodies.rectangle(x, y, width, height, options)
    }
    
    bodyRef.current = body
    Matter.Composite.add(engine.current.world, body)
    
    // Create mouse constraint for this body
    const mouse = Matter.Mouse.create(canvasRef.current)
    const mouseConstraint = Matter.MouseConstraint.create(engine.current, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: true,
          strokeStyle: '#90EE90',
          lineWidth: 2
        }
      }
    })
    
    mouseConstraintRef.current = mouseConstraint
    Matter.Composite.add(engine.current.world, mouseConstraint)
    
    // Drag events
    if (onDragStart) {
      Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
        if (event.body === bodyRef.current) {
          onDragStart(event.body)
        }
      })
    }
    
    if (onDragEnd) {
      Matter.Events.on(mouseConstraint, 'enddrag', (event) => {
        if (event.body === bodyRef.current) {
          onDragEnd(event.body)
        }
      })
    }
    
    return () => {
      if (engine.current) {
        if (bodyRef.current) {
          Matter.Composite.remove(engine.current.world, bodyRef.current)
        }
        if (mouseConstraintRef.current) {
          Matter.Composite.remove(engine.current.world, mouseConstraintRef.current)
        }
      }
    }
  }, [])
  
  return null
}
