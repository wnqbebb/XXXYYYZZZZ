---
name: matter-react-integration
description: React integration patterns for Matter.js. Load when using React with physics.
metadata:
  tags: matter, react, hooks, integration, component
---

# React Integration Rules

## MUST: useMatter Hook

```typescript
// hooks/useMatter.ts
'use client'

import { useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'

interface UseMatterOptions {
  width?: number
  height?: number
  gravity?: { x: number; y: number }
  enableSleeping?: boolean
}

export function useMatter(
  containerRef: React.RefObject<HTMLElement>,
  options: UseMatterOptions = {}
) {
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)
  const runnerRef = useRef<Matter.Runner | null>(null)
  
  const {
    width = 800,
    height = 600,
    gravity = { x: 0, y: 1 },
    enableSleeping = true
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
    
    // Create renderer (dev only)
    const render = Matter.Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
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
  const addBody = useCallback((body: Matter.Body) => {
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
  
  return {
    engine: engineRef,
    render: renderRef,
    runner: runnerRef,
    addBody,
    removeBody
  }
}
```

---

## MUST: PhysicsScene Component

```typescript
// components/PhysicsScene.tsx
'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { useMatter } from '../hooks/useMatter'
import Matter from 'matter-js'

interface PhysicsSceneProps {
  width?: number
  height?: number
  gravity?: { x: number; y: number }
  children?: ReactNode
  className?: string
  onReady?: (engine: Matter.Engine) => void
}

export function PhysicsScene({
  width = 800,
  height = 600,
  gravity = { x: 0, y: 1 },
  children,
  className = '',
  onReady
}: PhysicsSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { engine, addBody } = useMatter(containerRef, {
    width,
    height,
    gravity
  })
  
  useEffect(() => {
    if (engine.current && onReady) {
      onReady(engine.current)
    }
  }, [engine, onReady])
  
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
```

---

## MUST: PhysicsBody Component

```typescript
// components/PhysicsBody.tsx
'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface PhysicsBodyProps {
  engine: React.MutableRefObject<Matter.Engine | null>
  type: 'rectangle' | 'circle' | 'polygon'
  x: number
  y: number
  width?: number
  height?: number
  radius?: number
  sides?: number
  options?: Matter.IBodyDefinition
  onClick?: (body: Matter.Body) => void
}

export function PhysicsBody({
  engine,
  type,
  x,
  y,
  width = 80,
  height = 80,
  radius = 40,
  sides = 6,
  options = {},
  onClick
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
      default:
        body = Matter.Bodies.rectangle(x, y, width, height, options)
    }
    
    bodyRef.current = body
    Matter.Composite.add(engine.current.world, body)
    
    // Cleanup
    return () => {
      if (engine.current && bodyRef.current) {
        Matter.Composite.remove(engine.current.world, bodyRef.current)
      }
    }
  }, [engine, type, x, y, width, height, radius, sides])
  
  // Update position if props change
  useEffect(() => {
    if (bodyRef.current) {
      Matter.Body.setPosition(bodyRef.current, { x, y })
    }
  }, [x, y])
  
  return null
}
```

---

## MUST: useMouseConstraint Hook

```typescript
// hooks/useMouseConstraint.ts
'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface UseMouseConstraintOptions {
  stiffness?: number
  render?: boolean
}

export function useMouseConstraint(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  options: UseMouseConstraintOptions = {}
) {
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null)
  
  const { stiffness = 0.2, render = true } = options
  
  useEffect(() => {
    if (!engineRef.current || !canvasRef.current) return
    
    const mouse = Matter.Mouse.create(canvasRef.current)
    
    const mouseConstraint = Matter.MouseConstraint.create(
      engineRef.current,
      {
        mouse: mouse,
        constraint: {
          stiffness,
          render: {
            visible: render,
            strokeStyle: '#90EE90',
            lineWidth: 2
          }
        }
      }
    )
    
    mouseConstraintRef.current = mouseConstraint
    Matter.Composite.add(engineRef.current.world, mouseConstraint)
    
    return () => {
      if (engineRef.current && mouseConstraintRef.current) {
        Matter.Composite.remove(
          engineRef.current.world,
          mouseConstraintRef.current
        )
      }
    }
  }, [engineRef, canvasRef, stiffness, render])
  
  return mouseConstraintRef
}
```

---

## MUST: useCollision Hook

```typescript
// hooks/useCollision.ts
'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface CollisionCallback {
  (event: Matter.IEventCollision<Matter.Engine>): void
}

export function useCollision(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  event: 'collisionStart' | 'collisionActive' | 'collisionEnd',
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

// Usage example
export function useCollisionStart(
  engineRef: React.MutableRefObject<Matter.Engine | null>,
  callback: CollisionCallback
) {
  return useCollision(engineRef, 'collisionStart', callback)
}
```

---

## MUST: Custom Renderer Component

```typescript
// components/CustomRenderer.tsx
'use client'

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface CustomRendererProps {
  engineRef: React.MutableRefObject<Matter.Engine | null>
  width: number
  height: number
}

export function CustomRenderer({
  engineRef,
  width,
  height
}: CustomRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  
  useEffect(() => {
    const canvas = canvasRef.current
    const engine = engineRef.current
    if (!canvas || !engine) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Handle pixel ratio
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)
    
    // Render loop
    function render() {
      if (!ctx || !engine) return
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Get all bodies
      const bodies = Matter.Composite.allBodies(engine.world)
      
      // Render each body
      bodies.forEach(body => {
        if (!body.render.visible) return
        
        ctx.beginPath()
        const vertices = body.vertices
        
        ctx.moveTo(vertices[0].x, vertices[0].y)
        for (let i = 1; i < vertices.length; i++) {
          ctx.lineTo(vertices[i].x, vertices[i].y)
        }
        ctx.lineTo(vertices[0].x, vertices[0].y)
        
        ctx.fillStyle = body.render.fillStyle || '#4ecdc4'
        ctx.strokeStyle = body.render.strokeStyle || '#000'
        ctx.lineWidth = body.render.lineWidth || 1
        
        ctx.fill()
        ctx.stroke()
      })
      
      animationRef.current = requestAnimationFrame(render)
    }
    
    render()
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [engineRef, width, height])
  
  return (
    <canvas
      ref={canvasRef}
      style={{ width, height }}
      className="absolute inset-0"
    />
  )
}
```

---

## MUST: Avoid setState in Physics Loop

```typescript
// WRONG: Causes re-render every frame
function WrongExample() {
  const [bodies, setBodies] = useState<Matter.Body[]>([])
  
  useEffect(() => {
    Matter.Events.on(engine, 'afterUpdate', () => {
      setBodies([...bodies]) // ❌ Re-render every frame!
    })
  }, [])
  
  return <div>{bodies.length}</div>
}

// RIGHT: Use refs for physics data
function RightExample() {
  const bodiesRef = useRef<Matter.Body[]>([])
  const [, forceUpdate] = useState({})
  
  useEffect(() => {
    // Only update React state when needed
    const interval = setInterval(() => {
      forceUpdate({}) // Throttled UI update
    }, 100)
    
    return () => clearInterval(interval)
  }, [])
  
  return <div>{bodiesRef.current.length}</div>
}
```

---

## FORBIDDEN: React Anti-patterns

```yaml
FORBIDDEN:
  State in physics loop:
    WRONG: setState in collisionStart
    RIGHT: Use refs, throttle UI updates
    
  Creating engine in render:
    WRONG: const engine = Engine.create()
    RIGHT: useRef + useEffect
    
  Not cleaning up:
    WRONG: No cleanup on unmount
    RIGHT: Remove listeners, stop runner
    
  Direct DOM manipulation:
    WRONG: document.getElementById in component
    RIGHT: useRef for canvas/container
    
  Multiple engines:
    WRONG: New engine every render
    RIGHT: Single engine in useEffect
```

---

**React + Matter.js. Components physics-enabled.**
