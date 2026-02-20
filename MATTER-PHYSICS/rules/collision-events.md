---
name: matter-collision-events
description: Collision detection and event handling. Load when reacting to object collisions.
metadata:
  tags: matter, collision, events, detection, impact, trigger
---

# Collision Events Rules

## MUST: Collision Event Types

```typescript
import Matter from 'matter-js'

// Collision started
Matter.Events.on(engine, 'collisionStart', (event) => {
  const pairs = event.pairs
  
  pairs.forEach((pair) => {
    const bodyA = pair.bodyA
    const bodyB = pair.bodyB
    
    console.log(`${bodyA.label} collided with ${bodyB.label}`)
  })
})

// Collision ongoing (every frame while touching)
Matter.Events.on(engine, 'collisionActive', (event) => {
  // Use for: friction effects, continuous damage
})

// Collision ended
Matter.Events.on(engine, 'collisionEnd', (event) => {
  // Use for: stop effects, reset states
})
```

### WHY: Event Timing

```yaml
collisionStart:
  Fires: Once when bodies first touch
  Use: Impact effects, sound triggers, scoring
  
collisionActive:
  Fires: Every frame while bodies overlap
  Use: Friction, continuous effects, sensors
  
collisionEnd:
  Fires: Once when bodies separate
  Use: Cleanup, state resets
```

---

## MUST: Collision Filtering

```typescript
// Check specific body types
Matter.Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    const { bodyA, bodyB } = pair
    
    // Check by label
    if (bodyA.label === 'player' && bodyB.label === 'coin') {
      collectCoin(bodyB)
    }
    
    // Check by plugin data
    if (bodyA.plugin?.type === 'enemy' && bodyB.plugin?.type === 'bullet') {
      destroyEnemy(bodyA)
    }
    
    // Check by collision filter
    if (bodyA.collisionFilter.category === 0x0004) {
      handleSpecialCollision(bodyA, bodyB)
    }
  })
})
```

---

## MUST: Impact Force Calculation

```typescript
Matter.Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    // Get collision impact force
    const force = pair.collision.normal
    const depth = pair.collision.depth
    
    // Calculate impact magnitude
    const bodyA = pair.bodyA
    const bodyB = pair.bodyB
    
    const velocityA = Matter.Vector.magnitude(bodyA.velocity)
    const velocityB = Matter.Vector.magnitude(bodyB.velocity)
    const impact = Math.abs(velocityA - velocityB)
    
    // Threshold for significant collision
    if (impact > 5) {
      playImpactSound(impact)
      spawnImpactParticles(pair.collision.supports[0])
      
      // Screen shake for heavy impacts
      if (impact > 10) {
        triggerScreenShake(impact)
      }
    }
  })
})
```

### WHY: Impact Thresholds

```yaml
Impact Magnitude Guidelines:
  0-2:   Light touch (ignore)
  2-5:   Gentle bump (subtle sound)
  5-10:  Medium impact (sound + particles)
  10-20: Heavy impact (shake, big sound)
  20+:   Critical (explosion, damage)
```

---

## MUST: Sensor Bodies (Triggers)

```typescript
// Create sensor (detects collision without physical response)
const triggerZone = Matter.Bodies.rectangle(400, 300, 200, 200, {
  isSensor: true,        // No physical collision
  isStatic: true,
  label: 'goal-zone',
  render: {
    fillStyle: 'rgba(0, 255, 0, 0.2)',
    visible: true
  }
})

// Detect entry
Matter.Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    const sensor = pair.bodyA.isSensor ? pair.bodyA : 
                   pair.bodyB.isSensor ? pair.bodyB : null
    const other = pair.bodyA.isSensor ? pair.bodyB : pair.bodyA
    
    if (sensor && sensor.label === 'goal-zone') {
      console.log('Player entered goal!')
      onGoalReached(other)
    }
  })
})
```

### WHY: Sensors

```yaml
isSensor: true
  - Detects collisions without physical response
  - Objects pass through
  - Use for: trigger zones, checkpoints, powerups
  - Still fires collision events
```

---

## MUST: Spatial Queries

### Ray Casting

```typescript
import Matter from 'matter-js'

const { Query } = Matter

// Cast ray from point A to point B
const rayStart = { x: 100, y: 300 }
const rayEnd = { x: 700, y: 300 }

const bodies = Matter.Composite.allBodies(engine.world)
const collisions = Query.ray(bodies, rayStart, rayEnd)

collisions.forEach((collision) => {
  console.log('Ray hit:', collision.body.label)
  console.log('At point:', collision.point)
})
```

### Region Query

```typescript
// Find bodies in a region
const region = {
  min: { x: 200, y: 200 },
  max: { x: 400, y: 400 }
}

const bodiesInRegion = Query.region(
  Composite.allBodies(engine.world),
  region
)

// Find body at point
const point = { x: 350, y: 250 }
const bodiesAtPoint = Query.point(
  Composite.allBodies(engine.world),
  point
)
```

---

## MUST: Collision Categories

```typescript
// Define categories
const CATEGORY_DEFAULT = 0x0001
const CATEGORY_PLAYER = 0x0002
const CATEGORY_ENEMY = 0x0004
const CATEGORY_ITEM = 0x0008
const CATEGORY_WALL = 0x0010

// Player - collides with enemies, items, walls
const player = Matter.Bodies.circle(400, 300, 30, {
  collisionFilter: {
    category: CATEGORY_PLAYER,
    mask: CATEGORY_ENEMY | CATEGORY_ITEM | CATEGORY_WALL | CATEGORY_DEFAULT
  }
})

// Enemy - collides with player and walls only
const enemy = Matter.Bodies.rectangle(200, 200, 50, 50, {
  collisionFilter: {
    category: CATEGORY_ENEMY,
    mask: CATEGORY_PLAYER | CATEGORY_WALL
  }
})

// Item - collides with player only
const item = Matter.Bodies.circle(500, 200, 15, {
  collisionFilter: {
    category: CATEGORY_ITEM,
    mask: CATEGORY_PLAYER
  },
  isSensor: true  // Player can pass through
})

// Wall - collides with everything
const wall = Matter.Bodies.rectangle(400, 580, 800, 40, {
  isStatic: true,
  collisionFilter: {
    category: CATEGORY_WALL,
    mask: CATEGORY_DEFAULT | CATEGORY_PLAYER | CATEGORY_ENEMY | CATEGORY_ITEM
  }
})
```

---

## MUST: One-Time Collision Handling

```typescript
// Prevent multiple triggers for same collision
const processedCollisions = new Set<string>()

Matter.Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((pair) => {
    // Create unique collision ID
    const id = [pair.id, pair.bodyA.id, pair.bodyB.id].sort().join('-')
    
    if (processedCollisions.has(id)) return
    processedCollisions.add(id)
    
    // Handle collision
    handleCollision(pair.bodyA, pair.bodyB)
    
    // Clean up after collision ends
    Matter.Events.on(engine, 'collisionEnd', (endEvent) => {
      endEvent.pairs.forEach((endPair) => {
        const endId = [endPair.id, endPair.bodyA.id, endPair.bodyB.id]
          .sort()
          .join('-')
        processedCollisions.delete(endId)
      })
    })
  })
})
```

---

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Expensive operations in collisionActive:
    WRONG: Spawn particles every frame
    RIGHT: Use collisionStart for one-time effects
    
  Not checking both bodies:
    WRONG: Only check bodyA
    RIGHT: Check both bodyA and bodyB (order varies)
    
  Creating bodies in collision handler:
    WRONG: Create explosion bodies immediately
    RIGHT: Queue for next frame or use pool
    
  Ignoring collision depth:
    WRONG: Treat all collisions equally
    RIGHT: Scale effects by impact force
```

---

**Collisions detected. Events firing. Physics alive.**
