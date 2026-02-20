---
name: matter-performance-optimization
description: Performance optimization for Matter.js physics. Load when optimizing physics scenes.
metadata:
  tags: matter, performance, optimization, sleeping, culling, fps
---

# Performance Optimization Rules

## MUST: Enable Sleeping

```typescript
const engine = Engine.create({
  enableSleeping: true  // CRITICAL for performance
})

// Or enable after creation
engine.enableSleeping = true

// Configure sleep threshold per body
const body = Bodies.rectangle(400, 300, 80, 80, {
  sleepThreshold: 60     // Sleep after 60ms of inactivity
})

// Manually control sleeping
Matter.Sleeping.set(body, true)   // Force sleep
Matter.Sleeping.set(body, false)  // Wake up
```

### WHY: Sleeping Saves CPU

```yaml
Sleeping Bodies:
  - Skip physics calculations
  - Don't collide (except as static)
  - Wake on collision or force
  - Automatic with enableSleeping
  
Sleep Threshold:
  30ms:  Aggressive (saves more CPU, may miss subtle movement)
  60ms:  Balanced (default, recommended)
  120ms: Conservative (smoother, less savings)
```

---

## MUST: Body Count Limits

```typescript
// Monitor body count
const bodyCount = Composite.allBodies(engine.world).length

// Set limits based on device
const MAX_BODIES = window.matchMedia('(pointer: coarse)').matches 
  ? 100   // Mobile
  : 300   // Desktop

// Cleanup excess bodies
if (bodyCount > MAX_BODIES) {
  const bodies = Composite.allBodies(engine.world)
    .filter(b => !b.isStatic)
    .sort((a, b) => a.position.y - b.position.y) // Keep lowest
    
  const toRemove = bodies.slice(0, bodies.length - MAX_BODIES)
  Composite.remove(engine.world, toRemove)
}
```

### WHY: Body Count Matters

```yaml
Recommended Limits:
  Mobile:   50-100 dynamic bodies
  Desktop:  200-500 dynamic bodies
  High-end: 500-1000 dynamic bodies
  
Static bodies have minimal impact
Sensor bodies count as dynamic
Constraints add CPU overhead
```

---

## MUST: Efficient Shapes

```typescript
// GOOD: Simple shapes
const box = Bodies.rectangle(x, y, 80, 80)
const circle = Bodies.circle(x, y, 40, {}, 12) // Low sides

// AVOID: Complex shapes
const complex = Bodies.fromVertices(x, y, manyVertices) // Expensive

// GOOD: Compound bodies for complex shapes
const part1 = Bodies.rectangle(x - 20, y, 40, 80)
const part2 = Bodies.rectangle(x + 20, y, 40, 80)
const compound = Body.create({
  parts: [part1, part2]
})
```

### WHY: Shape Complexity

```yaml
Performance Ranking (fastest to slowest):
  1. Circle (12-25 sides)
  2. Rectangle
  3. Polygon (low vertex count)
  4. Compound bodies
  5. Concave polygons (with decomposition)
  
FORBIDDEN:
  Circles with > 50 sides
  Polygons with > 20 vertices
  Many concave shapes
```

---

## MUST: Spatial Culling

```typescript
// Remove bodies that fall off-screen
const bounds = {
  min: { x: -500, y: -1000 },
  max: { x: 2000, y: 1500 }
}

Matter.Events.on(engine, 'beforeUpdate', () => {
  const bodies = Composite.allBodies(engine.world)
  
  bodies.forEach(body => {
    if (body.isStatic) return
    
    const pos = body.position
    if (
      pos.x < bounds.min.x ||
      pos.x > bounds.max.x ||
      pos.y < bounds.min.y ||
      pos.y > bounds.max.y
    ) {
      Composite.remove(engine.world, body)
    }
  })
})
```

---

## MUST: Throttled Spawning

```typescript
// Prevent spawn spam
let lastSpawnTime = 0
const SPAWN_INTERVAL = 100 // ms

function spawnBody() {
  const now = Date.now()
  if (now - lastSpawnTime < SPAWN_INTERVAL) return
  
  lastSpawnTime = now
  
  const body = Bodies.circle(x, y, 20)
  Composite.add(engine.world, body)
}

// Or use accumulator pattern
let spawnAccumulator = 0

Matter.Events.on(engine, 'beforeUpdate', (event) => {
  spawnAccumulator += event.timestamp
  
  if (spawnAccumulator > SPAWN_INTERVAL) {
    spawnBody()
    spawnAccumulator = 0
  }
})
```

---

## MUST: Update Throttling

```typescript
// Run physics at lower rate for distant objects
const PHYSICS_FPS = 60
const UPDATE_INTERVAL = 1000 / PHYSICS_FPS

let lastUpdate = 0

function gameLoop(time: number) {
  requestAnimationFrame(gameLoop)
  
  // Throttle physics updates
  if (time - lastUpdate < UPDATE_INTERVAL) return
  
  const delta = time - lastUpdate
  lastUpdate = time
  
  // Update physics
  Engine.update(engine, delta)
  
  // Render
  render()
}
```

---

## MUST: Collision Filter Optimization

```typescript
// Reduce collision pairs with categories
// Instead of checking all pairs:

// Use categories to prevent unnecessary checks
const player = Bodies.circle(400, 300, 30, {
  collisionFilter: {
    category: 0x0002,
    mask: 0x0005  // Only check against category 1 and 4
  }
})

// Bullets don't collide with each other
const bullet = Bodies.circle(x, y, 5, {
  collisionFilter: {
    group: -1,     // Negative = never collide with same group
    category: 0x0004,
    mask: 0x0003   // Only hit player and default
  }
})
```

---

## MUST: Event Cleanup

```typescript
// Always remove listeners when done
const collisionHandler = (event: Matter.IEventCollision<Matter.Engine>) => {
  // Handle collision
}

// Add listener
Matter.Events.on(engine, 'collisionStart', collisionHandler)

// Remove listener (on cleanup)
Matter.Events.off(engine, 'collisionStart', collisionHandler)

// Or remove all listeners for an event
Matter.Events.off(engine, 'collisionStart')
```

---

## MUST: Object Pooling

```typescript
// Reuse bodies instead of creating/destroying
class BodyPool {
  private pool: Matter.Body[] = []
  private active: Set<Matter.Body> = new Set()
  
  get(x: number, y: number): Matter.Body {
    let body = this.pool.pop()
    
    if (!body) {
      // Create new if pool empty
      body = Bodies.circle(x, y, 20)
    } else {
      // Reset existing body
      Matter.Body.setPosition(body, { x, y })
      Matter.Body.setVelocity(body, { x: 0, y: 0 })
      Matter.Body.setAngularVelocity(body, 0)
      Matter.Body.setAngle(body, 0)
      body.plugin = {}
    }
    
    this.active.add(body)
    return body
  }
  
  release(body: Matter.Body) {
    if (this.active.has(body)) {
      this.active.delete(body)
      this.pool.push(body)
    }
  }
  
  clear() {
    this.active.clear()
    this.pool = []
  }
}

// Usage
const pool = new BodyPool()

// Spawn
const body = pool.get(400, 100)
Composite.add(engine.world, body)

// Despawn
Composite.remove(engine.world, body)
pool.release(body)
```

---

## FORBIDDEN: Performance Killers

```yaml
FORBIDDEN:
  Creating bodies in render loop:
    WRONG: requestAnimationFrame(() => createBody())
    RIGHT: Throttled creation, object pooling
    
  setState in collision handlers:
    WRONG: React setState on every collision
    RIGHT: Batch updates, use refs
    
  Too many constraints:
    WRONG: 100+ constraints
    RIGHT: < 50 constraints, merge where possible
    
  High velocity bodies:
    WRONG: Velocities > 50
    RIGHT: Cap velocities, use CCD (continuous collision)
    
  Deep nesting in Composite:
    WRONG: Composite > Composite > Composite > Body
    RIGHT: Flat structure when possible
```

---

## MUST: Mobile Optimization

```typescript
// Detect mobile
const isMobile = window.matchMedia('(pointer: coarse)').matches

// Adjust settings
const settings = {
  bodyLimit: isMobile ? 50 : 200,
  positionIterations: isMobile ? 4 : 6,
  velocityIterations: isMobile ? 2 : 4,
  constraintIterations: isMobile ? 1 : 2
}

// Apply to engine
engine.positionIterations = settings.positionIterations
engine.velocityIterations = settings.velocityIterations
engine.constraintIterations = settings.constraintIterations

// Reduce render quality on mobile
const render = Render.create({
  options: {
    pixelRatio: isMobile ? 1 : window.devicePixelRatio,
    wireframes: false,
    showAngleIndicator: false,
    showCollisions: false,
    showVelocity: false
  }
})
```

---

**Optimized. 60fps. Physics smooth.**
