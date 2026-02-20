'use client'

import { useRef, useEffect, ReactNode } from 'react'
import Matter from 'matter-js'
import { useMatter } from '../hooks/useMatter'

interface PhysicsSceneProps {
  width?: number
  height?: number
  gravity?: { x: number; y: number }
  enableSleeping?: boolean
  wireframes?: boolean
  children?: ReactNode
  className?: string
  onReady?: (engine: Matter.Engine) => void
  onUpdate?: (engine: Matter.Engine) => void
}

/**
 * Main physics scene container component
 */
export function PhysicsScene({
  width = 800,
  height = 600,
  gravity = { x: 0, y: 1 },
  enableSleeping = true,
  wireframes = false,
  children,
  className = '',
  onReady,
  onUpdate
}: PhysicsSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { engine, render, addBody, removeBody } = useMatter(containerRef, {
    width,
    height,
    gravity,
    enableSleeping,
    wireframes
  })
  
  // Call onReady when engine is initialized
  useEffect(() => {
    if (engine.current && onReady) {
      onReady(engine.current)
    }
  }, [engine, onReady])
  
  // Setup update callback
  useEffect(() => {
    if (!engine.current || !onUpdate) return
    
    const handler = () => {
      if (engine.current) {
        onUpdate(engine.current)
      }
    }
    
    Matter.Events.on(engine.current, 'afterUpdate', handler)
    
    return () => {
      if (engine.current) {
        Matter.Events.off(engine.current, 'afterUpdate', handler)
      }
    }
  }, [engine, onUpdate])
  
  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {children}
    </div>
  )
}
