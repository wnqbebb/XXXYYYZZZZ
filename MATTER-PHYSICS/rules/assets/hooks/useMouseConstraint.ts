'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface UseMouseConstraintOptions {
  stiffness?: number
  render?: boolean
  strokeStyle?: string
  lineWidth?: number
}

/**
 * Hook for adding mouse drag interaction to physics world
 */
export function useMouseConstraint(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  options: UseMouseConstraintOptions = {}
) {
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)
  
  const {
    stiffness = 0.2,
    render = true,
    strokeStyle = '#90EE90',
    lineWidth = 2
  } = options
  
  useEffect(() => {
    if (!engineRef.current || !canvasRef.current) return
    
    // Create mouse
    const mouse = Matter.Mouse.create(canvasRef.current)
    
    // Create mouse constraint
    const mouseConstraint = Matter.MouseConstraint.create(
      engineRef.current,
      {
        mouse: mouse,
        constraint: {
          stiffness,
          render: {
            visible: render,
            strokeStyle,
            lineWidth
          }
        }
      }
    )
    
    mouseConstraintRef.current = mouseConstraint
    Matter.Composite.add(engineRef.current.world, mouseConstraint)
    
    // Prevent scrolling on touch
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
    
    return () => {
      if (engineRef.current && mouseConstraintRef.current) {
        Matter.Composite.remove(
          engineRef.current.world,
          mouseConstraintRef.current
        )
      }
    }
  }, [engineRef, canvasRef, stiffness, render, strokeStyle, lineWidth])
  
  return mouseConstraintRef
}
