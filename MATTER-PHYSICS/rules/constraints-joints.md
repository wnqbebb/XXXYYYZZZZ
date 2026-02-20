---
name: matter-constraints-joints
description: Constraints, springs, chains, and joints between bodies. Load when connecting physics bodies.
metadata:
  tags: matter, constraint, spring, joint, chain, rope, connection
---

# Constraints & Joints Rules

## MUST: Basic Constraint

```typescript
import Matter from 'matter-js'

const { Constraint, Bodies, Composite } = Matter

// Create two bodies
const bodyA = Bodies.circle(300, 300, 30)
const bodyB = Bodies.circle(400, 300, 30)

// Link them with a constraint
const constraint = Constraint.create({
  bodyA: bodyA,
  bodyB: bodyB,
  length: 100,           // Rest length (null = current distance)
  stiffness: 0.5,        // Spring stiffness (0-1)
  damping: 0.01,         // Damping factor (0-1)
  render: {
    visible: true,
    strokeStyle: '#4a90d9',
    lineWidth: 2
  }
})

Composite.add(engine.world, [bodyA, bodyB, constraint])
```

### WHY: Constraint Properties

```yaml
length:
  null: Uses current distance between bodies
  number: Fixed rest length
  
stiffness:
  0.0: No spring force (loose rope)
  0.2: Loose spring
  0.5: Normal spring
  0.8: Tight spring
  1.0: Rigid rod (no stretch)
  
damping:
  0.0: No damping (oscillates forever)
  0.01: Light damping
  0.1: Heavy damping (stops quickly)
```

---

## MUST: Point-to-Point Constraints

```typescript
// Constraint between specific points on bodies
const constraint = Constraint.create({
  bodyA: bodyA,
  pointA: { x: 0, y: -30 },    // Offset from bodyA center (top)
  bodyB: bodyB,
  pointB: { x: 0, y: 30 },     // Offset from bodyB center (bottom)
  length: 50,
  stiffness: 0.8
})

// Constraint from body to fixed world point
const pendulum = Constraint.create({
  bodyA: ball,
  pointA: { x: 0, y: -30 },
  pointB: { x: 400, y: 100 },  // Fixed world position
  length: 200,
  stiffness: 1                 // Rigid rod
})
```

---

## MUST: Chain Creation

```typescript
// Create a chain of connected bodies
function createChain(
  startX: number,
  startY: number,
  linkCount: number,
  linkSize: number
) {
  const bodies: Matter.Body[] = []
  const constraints: Matter.Constraint[] = []
  
  // Create chain links
  for (let i = 0; i < linkCount; i++) {
    const body = Bodies.rectangle(
      startX + i * linkSize * 1.5,
      startY,
      linkSize,
      linkSize / 3,
      {
        frictionAir: 0.05,     // Air resistance for stability
        render: { fillStyle: '#8e44ad' }
      }
    )
    bodies.push(body)
    
    // Link to previous body
    if (i > 0) {
      const constraint = Constraint.create({
        bodyA: bodies[i - 1],
        bodyB: body,
        length: linkSize * 0.8,
        stiffness: 0.8,
        render: { visible: false }
      })
      constraints.push(constraint)
    }
  }
  
  // Anchor first link
  const anchor = Constraint.create({
    bodyA: bodies[0],
    pointB: { x: startX, y: startY - 50 },
    length: 50,
    stiffness: 0.9
  })
  constraints.push(anchor)
  
  return { bodies, constraints }
}

// Usage
const chain = createChain(200, 100, 10, 40)
Composite.add(engine.world, [...chain.bodies, ...chain.constraints])
```

---

## MUST: Spring Behavior

```typescript
// Bouncy spring
const spring = Constraint.create({
  bodyA: anchor,
  bodyB: weight,
  length: 100,           // Rest length
  stiffness: 0.05,       // Low stiffness = bouncy
  damping: 0.01,         // Low damping = oscillates
  render: {
    type: 'spring',      // Visual spring (debug render)
    visible: true
  }
})

// Stiff rod (no bounce)
const rod = Constraint.create({
  bodyA: anchor,
  bodyB: platform,
  length: 150,
  stiffness: 1,          // Maximum stiffness
  damping: 0.1           // High damping
})
```

### WHY: Spring Tuning

```yaml
Bouncy Spring:
  stiffness: 0.01 - 0.1
  damping: 0.001 - 0.01
  Use: Trampolines, suspension, elastic

Normal Spring:
  stiffness: 0.2 - 0.5
  damping: 0.01 - 0.05
  Use: Connections, joints

Rigid Connection:
  stiffness: 0.8 - 1.0
  damping: 0.1 - 0.5
  Use: Structural beams, rods
```

---

## MUST: Bridge Pattern

```typescript
function createBridge(
  startX: number,
  startY: number,
  segments: number,
  segmentWidth: number
) {
  const bridgeGroup = Matter.Body.nextGroup(true)
  const bodies: Matter.Body[] = []
  const constraints: Matter.Constraint[] = []
  
  // Create bridge planks
  for (let i = 0; i < segments; i++) {
    const plank = Bodies.rectangle(
      startX + i * segmentWidth,
      startY,
      segmentWidth * 0.9,
      20,
      {
        collisionFilter: { group: bridgeGroup },
        friction: 0.8,
        render: { fillStyle: '#d35400' }
      }
    )
    bodies.push(plank)
    
    // Connect to previous plank
    if (i > 0) {
      const constraint = Constraint.create({
        bodyA: bodies[i - 1],
        bodyB: plank,
        length: segmentWidth * 0.1,
        stiffness: 0.9
      })
      constraints.push(constraint)
    }
  }
  
  // Anchor ends
  const leftAnchor = Constraint.create({
    bodyA: bodies[0],
    pointB: { x: startX - segmentWidth / 2, y: startY },
    stiffness: 0.5
  })
  
  const rightAnchor = Constraint.create({
    bodyA: bodies[bodies.length - 1],
    pointB: { 
      x: startX + (segments - 0.5) * segmentWidth, 
      y: startY 
    },
    stiffness: 0.5
  })
  
  constraints.push(leftAnchor, rightAnchor)
  
  return { bodies, constraints }
}
```

---

## MUST: Ragdoll Pattern

```typescript
function createRagdoll(x: number, y: number, scale: number) {
  const head = Bodies.circle(x, y - 70 * scale, 25 * scale, {
    render: { fillStyle: '#f1c40f' }
  })
  
  const chest = Bodies.rectangle(x, y, 50 * scale, 60 * scale, {
    render: { fillStyle: '#e74c3c' }
  })
  
  const leftArm = Bodies.rectangle(x - 45 * scale, y - 10 * scale, 15 * scale, 50 * scale)
  const rightArm = Bodies.rectangle(x + 45 * scale, y - 10 * scale, 15 * scale, 50 * scale)
  
  const leftLeg = Bodies.rectangle(x - 15 * scale, y + 70 * scale, 15 * scale, 60 * scale)
  const rightLeg = Bodies.rectangle(x + 15 * scale, y + 70 * scale, 15 * scale, 60 * scale)
  
  // Create constraints (joints)
  const neck = Constraint.create({
    bodyA: head,
    bodyB: chest,
    pointA: { x: 0, y: 25 * scale },
    pointB: { x: 0, y: -30 * scale },
    stiffness: 0.5,
    length: 0
  })
  
  const leftShoulder = Constraint.create({
    bodyA: chest,
    bodyB: leftArm,
    pointA: { x: -25 * scale, y: -20 * scale },
    pointB: { x: 0, y: -25 * scale },
    stiffness: 0.5
  })
  
  const rightShoulder = Constraint.create({
    bodyA: chest,
    bodyB: rightArm,
    pointA: { x: 25 * scale, y: -20 * scale },
    pointB: { x: 0, y: -25 * scale },
    stiffness: 0.5
  })
  
  const leftHip = Constraint.create({
    bodyA: chest,
    bodyB: leftLeg,
    pointA: { x: -15 * scale, y: 30 * scale },
    pointB: { x: 0, y: -30 * scale },
    stiffness: 0.5
  })
  
  const rightHip = Constraint.create({
    bodyA: chest,
    bodyB: rightLeg,
    pointA: { x: 15 * scale, y: 30 * scale },
    pointB: { x: 0, y: -30 * scale },
    stiffness: 0.5
  })
  
  return {
    bodies: [head, chest, leftArm, rightArm, leftLeg, rightLeg],
    constraints: [neck, leftShoulder, rightShoulder, leftHip, rightHip]
  }
}
```

---

## MUST: Constraint Breaking

```typescript
// Break constraint under high force
let constraint = Constraint.create({
  bodyA: bodyA,
  bodyB: bodyB,
  stiffness: 0.5,
  plugin: {
    maxForce: 0.1  // Custom property
  }
})

// Check force each update
Matter.Events.on(engine, 'beforeUpdate', () => {
  if (!constraint) return
  
  // Calculate tension (simplified)
  const bodyA = constraint.bodyA!
  const bodyB = constraint.bodyB!
  const force = Matter.Vector.magnitude(
    Matter.Vector.sub(bodyA.velocity, bodyB.velocity)
  )
  
  if (force > constraint.plugin.maxForce) {
    // Break the constraint
    Composite.remove(engine.world, constraint)
    constraint = null
    
    // Spawn break effect
    spawnBreakEffect(bodyA.position)
  }
})
```

---

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Circular constraints:
    WRONG: A -> B -> C -> A (unstable)
    RIGHT: Linear chains or tree structures
    
  Zero length with zero stiffness:
    WRONG: length: 0, stiffness: 0
    WHY: Undefined behavior
    
  Too many constraints:
    WRONG: > 100 constraints
    WHY: Performance degradation
    RIGHT: Use fewer, stiffer constraints
    
  Ignoring constraint mass ratio:
    WRONG: Heavy body + light body + stiff constraint
    WHY: Numerical instability
    RIGHT: Similar masses or adjust stiffness
```

---

**Bodies connected. Springs bouncing. Physics unified.**
