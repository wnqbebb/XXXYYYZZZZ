'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

interface UseMatterOptions {
  width?: number
  height?: number
  gravity?: { x: number; y: number }
  enableSleeping?: boolean
  wireframes?: boolean
}

interface UseMatterReturn {
  engine: React.MutableRefObject<Matter.Engine | null>
  render: React.MutableRefObject<Matter.Render | null>
  runner: React.MutableRefObject<Matter.Runner | null>
  addBody: (body: Matter.Body) => Matter.Body
  removeBody: (body: Matter.Body) => void
  addConstraint: (constraint: Matter.Constraint) => Matter.Constraint
  removeConstraint: (constraint: Matter.Constraint) => void
}

/**
 * Hook for Matter.js engine initialization and management
 */
export function useMatter(
  containerRef: React.RefObject<HTMLElement>,
  options: UseMatterOptions = {}
): UseMatterReturn {
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  
  const {
    width = 800,
    height = 600,
    gravity = { x: 0, y: 1 },
    enableSleeping = true,
    wireframes = false
  } = options
  
  // Initialize engine
  useEffect(() => {
    if (!containerRef.current) return
    
    // Create engine
    const engine = Matter.Engine.create({
      enableSleeping
    })
    engine.gravity = gravity
    engineRef.current = engine
    
    // Create renderer
    const render = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    })
    renderRef.current = render
    
    // Create runner
    const runner = Matter.Runner.create()
    runnerRef.current = runner
    
    // Start
    Matter.Runner.run(runner, engine)
    Matter.Render.run(render)
    
    // Cleanup
    return () => {
      Matter.Runner.stop(runner)
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
      Matter.Composite.clear(engine.world, false)
      
      if (render.canvas) {
        render.canvas.remove()
      }
    }
  }, [])
  
  // Add body helper
  const addBody = useCallback((body: Matter.Body): Matter.Body => {
    if (engineRef.current) {
      Matter.Composite.add(engineRef.current.world, body)
    }
    return body
  }, [])
  
  // Remove body helper
  const removeBody = useCallback((body: Matter.Body) => {
    if (engineRef.current) {
      Matter.Composite.remove(engineRef.current.world, body)
    }
  }, [])
  
  // Add constraint helper
  const addConstraint = useCallback((constraint: Matter.Constraint): Matter.Constraint => {
    if (engineRef.current) {
      Matter.Composite.add(engineRef.current.world, constraint)
    }
    return constraint
  }, [])
  
  // Remove constraint helper
  const removeConstraint = useCallback((constraint: Matter.Constraint) => {
    if (engineRef.current) {
      Matter.Composite.remove(engineRef.current.world, constraint)
    }
  }, [])
  
  return {
    engine: engineRef,
    render: renderRef,
    runner: runnerRef,
    addBody,
    removeBody,
    addConstraint,
    removeConstraint
  }
}
