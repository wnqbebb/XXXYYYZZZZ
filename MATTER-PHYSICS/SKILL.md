---
name: matter-physics
description: Matter.js for 2D physics simulations and interactive experiences. Use when (1) Creating physics-based interactions, (2) Building game mechanics, (3) Implementing particle systems, (4) Adding collision effects, (5) Creating draggable physics objects. MANDATORY for physics-enabled sites.
metadata:
  tags: matter, physics, 2d, simulation, collision, rigid-body, joints, constraints
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: high
  category: physics
---

# Matter.js Physics Master System

**Realistic physics. Interactive worlds. Performance optimized.**

Matter.js is a 2D rigid body physics engine written in JavaScript. It enables the creation of realistic physics simulations, interactive games, and engaging user experiences with collision detection, constraints, and dynamic bodies.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - User says: "física", "physics", "gravity", "collisiones"
  - Creating draggable interactive objects
  - Building physics-based games
  - Implementing particle systems with collision
  - Adding realistic falling/bouncing objects
  - Creating chain/rope simulations
  - Physics-based UI interactions
  - Stacking games or puzzles
  - ANY site requiring realistic object behavior

DO NOT USE WHEN:
  - Simple CSS animations suffice
  - 3D physics is needed (use THREE.js + cannon-es)
  - Server-side rendering only
  - Performance-critical mobile games (consider planck.js)
```

---

## The Matter.js Stack

### Core Dependencies

```yaml
Core:
  - matter-js: ^0.19.0 (physics engine)
  
TypeScript Support:
  - @types/matter-js: ^0.19.0

Optional Extensions:
  - poly-decomp: ^0.3.0 (concave polygon decomposition)
  
React Integration:
  - Custom hooks (provided in assets)
```

### Module Overview

```yaml
Core Modules:
  Engine:    # Physics simulation controller
  World:     # Container for all bodies
  Bodies:    # Factory for rigid bodies
  Body:      # Individual body manipulation
  Composite: # Groups of bodies
  Composites:# Pre-built patterns (stack, pyramid)
  Constraint:# Links between bodies
  Mouse:     # Mouse input handling
  MouseConstraint: # Drag interaction
  Events:    # Collision and engine events
  Vector:    # 2D vector math
  Vertices:  # Shape vertices manipulation
  Query:     # Spatial queries (raycast, region)
  Render:    # Debug renderer (dev only)
  Runner:    # Animation loop utility
```

---

## The Golden Rules

### Performance Commandments

```yaml
✅ DO:
  - Enable sleeping for static/inactive bodies
  - Use simple shapes (circles, rectangles) when possible
  - Limit total body count (< 200 for mobile, < 500 for desktop)
  - Use Composite for grouping related bodies
  - Clean up bodies when no longer needed
  - Use requestAnimationFrame for custom loops
  - Set bounds to prevent bodies falling infinitely

❌ NEVER:
  - Create bodies in animation loops without throttling
  - Use high vertex count for circles (maxSides > 25)
  - Forget to remove collision event listeners
  - Update body properties every frame unnecessarily
  - Ignore device pixel ratio in canvas rendering
  - Use Render in production (implement custom renderer)
```

---

## Rule Files Index

### Core Physics

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/engine-setup.md](./rules/engine-setup.md) | Engine initialization & configuration | Starting any physics scene |
| [rules/bodies-shapes.md](./rules/bodies-shapes.md) | Creating bodies and shapes | Adding physics objects |
| [rules/interaction-mouse.md](./rules/interaction-mouse.md) | Mouse/touch interaction | Draggable objects needed |
| [rules/collision-events.md](./rules/collision-events.md) | Collision detection & events | Reaction to collisions |
| [rules/constraints-joints.md](./rules/constraints-joints.md) | Springs, chains, joints | Connected body systems |

### Optimization & Integration

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/performance-optimization.md](./rules/performance-optimization.md) | Performance tuning | Optimization needed |
| [rules/react-integration.md](./rules/react-integration.md) | React + Matter.js patterns | Using React |

### Asset Library

```
rules/assets/
├── components/
│   ├── PhysicsScene.tsx      # Main physics container
│   ├── PhysicsBody.tsx       # Body wrapper component
│   ├── PhysicsStack.tsx      # Pre-built stack pattern
│   └── DraggableBody.tsx     # Interactive draggable
├── hooks/
│   ├── useMatter.ts          # Engine initialization hook
│   ├── usePhysicsBody.ts     # Body management hook
│   ├── useMouseConstraint.ts # Drag interaction hook
│   └── useCollision.ts       # Collision events hook
└── lib/
    └── matter.ts             # Module exports & types
```

---

## Quick Start Patterns

### Basic Scene Setup

```typescript
import Matter from 'matter-js'

const { Engine, Render, Runner, Bodies, Composite } = Matter

// Create engine
const engine = Engine.create()

// Create renderer (dev only)
const render = Render.create({
  element: container,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
    background: '#f0f0f0'
  }
})

// Add bodies
const box = Bodies.rectangle(400, 200, 80, 80)
const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true })

Composite.add(engine.world, [box, ground])

// Run
Runner.run(Runner.create(), engine)
Render.run(render)
```

### React Integration

```tsx
'use client'

import { useRef, useEffect } from 'react'
import { useMatter } from '@/hooks/useMatter'

export function PhysicsDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { engine, addBody } = useMatter(containerRef)
  
  useEffect(() => {
    if (!engine.current) return
    
    // Add interactive bodies
    addBody('rectangle', 400, 200, 80, 80, {
      restitution: 0.9,
      render: { fillStyle: '#ff6b6b' }
    })
  }, [engine])
  
  return <div ref={containerRef} className="w-full h-[600px]" />
}
```

---

## Integration with Other Skills

```
DEPENDS ON:
  - html5-semantic (Structure)
  - css3-modern (Styling foundations)
  - js-advanced (JavaScript patterns)

WORKS WITH:
  - gsap-animator (Sync physics with GSAP)
  - threejs-creative (2D physics overlay on 3D)
  - performance-guardian (Optimization)

ENABLES:
  - Interactive games
  - Physics-based UI
  - Particle systems
  - Award-winning playful experiences
```

---

## Version History

```yaml
v3.0.0 (2026):
  - Matter.js 0.19.0
  - React 18 custom hooks
  - TypeScript strict mode
  - Performance optimization patterns
  - Mobile touch support

v2.0.0 (2025):
  - Matter.js 0.18.0
  - Basic React integration
  - Common patterns
```

---

**Master physics. Create worlds that feel real.**
