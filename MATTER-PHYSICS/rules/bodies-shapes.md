---
name: matter-bodies-shapes
description: Creating and configuring physics bodies and shapes. Load when adding objects to physics world.
metadata:
  tags: matter, bodies, shapes, rectangle, circle, polygon, static, dynamic
---

# Bodies & Shapes Rules

## MUST: Body Factory Methods

```typescript
import Matter from 'matter-js'

const { Bodies } = Matter

// Rectangle
const box = Bodies.rectangle(x, y, width, height, options)

// Circle
const ball = Bodies.circle(x, y, radius, options)

// Regular Polygon
const hexagon = Bodies.polygon(x, y, sides, radius, options)

// From Vertices (requires poly-decomp for concave)
const custom = Bodies.fromVertices(x, y, vertexSets, options)
```

---

## MUST: Body Properties

### Essential Properties

```typescript
const body = Bodies.rectangle(400, 300, 80, 80, {
  // Physics properties
  density: 0.001,        // Mass per unit area (default: 0.001)
  friction: 0.5,         // Surface friction 0-1 (default: 0.5)
  frictionAir: 0.01,     // Air resistance 0-1 (default: 0.01)
  frictionStatic: 0.5,   // Static friction 0-1 (default: 0.5)
  restitution: 0.2,      // Bounciness 0-1 (default: 0.2)
  
  // Behavior
  isStatic: false,       // true = immovable (default: false)
  isSensor: false,       // true = detects collision without response
  
  // Sleeping
  sleepThreshold: 60,    // Time (ms) before sleeping (default: 60)
  
  // Rendering (debug only)
  render: {
    fillStyle: '#ff6b6b',
    strokeStyle: '#000000',
    lineWidth: 1,
    visible: true
  },
  
  // Custom data
  label: 'player',
  plugin: {              // Custom properties
    score: 100,
    type: 'enemy'
  }
})
```

### WHY: Property Values

```yaml
restitution (bounciness):
  0.0: No bounce (sandbag)
  0.2: Low bounce (wood)
  0.5: Medium bounce (rubber)
  0.8: High bounce (bouncy ball)
  1.0: Perfect bounce (no energy loss)

friction:
  0.0: Ice (no friction)
  0.5: Normal surface
  1.0: Rough surface (stops quickly)

frictionAir:
  0.0: No air resistance (space)
  0.01: Normal atmosphere
  0.1: Thick atmosphere/water

density:
  0.001: Light (feather)
  0.01: Normal
  0.1: Heavy (metal)
```

---

## MUST: Static Bodies

```typescript
// Ground - immovable
const ground = Bodies.rectangle(400, 580, 800, 40, {
  isStatic: true,
  render: { fillStyle: '#2d3436' }
})

// Walls
const wall = Bodies.rectangle(10, 300, 20, 600, {
  isStatic: true,
  friction: 0,
  restitution: 0.5
})
```

### WHY: Static Bodies

```yaml
isStatic: true
  - Zero mass (infinite)
  - Immovable by forces/collisions
  - Can still be moved manually (Body.setPosition)
  - Use for: ground, walls, platforms, obstacles
  - Performance: More efficient than heavy dynamic bodies
```

---

## MUST: Circle Optimization

```typescript
// Default: 25 sides (good balance)
const circle = Bodies.circle(400, 300, 50)

// Custom max sides (lower = better performance)
const lowPolyCircle = Bodies.circle(400, 300, 50, {}, 12)

// High quality (slower)
const smoothCircle = Bodies.circle(400, 300, 50, {}, 50)
```

### WHY: Circle Sides Matter

```yaml
MUST: Use appropriate side count
  Small circles (< 30px): 8-12 sides
  Medium circles (30-100px): 12-25 sides (default)
  Large circles (> 100px): 25-50 sides
  
FORBIDDEN:
  Using > 50 sides for any circle
  WHY: Severe performance impact
```

---

## MUST: Custom Shapes (Vertices)

```typescript
import Matter from 'matter-js'

// Convex polygon (no decomposition needed)
const triangle = Bodies.fromVertices(400, 300, [
  { x: 0, y: -50 },
  { x: 50, y: 50 },
  { x: -50, y: 50 }
])

// Concave shape (requires poly-decomp)
// npm install poly-decomp
import decomp from 'poly-decomp'
Matter.Common.setDecomp(decomp)

const star = Bodies.fromVertices(400, 300, [
  { x: 0, y: -50 },
  { x: 14, y: -20 },
  { x: 47, y: -20 },
  { x: 23, y: 5 },
  { x: 29, y: 38 },
  { x: 0, y: 20 },
  { x: -29, y: 38 },
  { x: -23, y: 5 },
  { x: -47, y: -20 },
  { x: -14, y: -20 }
])
```

### WHY: Vertex Requirements

```yaml
MUST: Vertices must be:
  - Ordered (clockwise or counter-clockwise)
  - Non-intersecting (no self-intersections)
  - Convex OR have poly-decomp for concave
  
FORBIDDEN:
  Too many vertices (> 50 per body)
  WHY: Performance degradation
  
  Self-intersecting polygons
  WHY: Physics breaks
```

---

## MUST: Composite Patterns

### Stack

```typescript
import Matter from 'matter-js'

const { Composites } = Matter

// Create a stack of boxes
const stack = Composites.stack(
  100,      // start X
  100,      // start Y
  5,        // columns
  4,        // rows
  10,       // column gap
  10,       // row gap
  (x, y) => Bodies.rectangle(x, y, 40, 40)
)

Composite.add(engine.world, stack)
```

### Pyramid

```typescript
const pyramid = Composites.pyramid(
  200,      // start X
  300,      // start Y
  7,        // columns
  6,        // rows
  0,        // column gap
  0,        // row gap
  (x, y) => Bodies.rectangle(x, y, 40, 40)
)
```

### Newton's Cradle

```typescript
const cradle = Composites.newtonsCradle(
  300,      // start X
  100,      // start Y
  5,        // number of bodies
  30,       // size of each body
  200       // length of strings
)
```

### Car (Compound Body)

```typescript
const car = Composites.car(
  200,      // start X
  100,      // start Y
  100,      // width
  30,       // height
  30        // wheel size
)
```

---

## MUST: Body Manipulation

### Position & Rotation

```typescript
import Matter from 'matter-js'

const { Body } = Matter

// Set position (teleport)
Body.setPosition(body, { x: 400, y: 300 })

// Set rotation (radians)
Body.setAngle(body, Math.PI / 4) // 45 degrees

// Set velocity
Body.setVelocity(body, { x: 5, y: -10 })

// Set angular velocity
Body.setAngularVelocity(body, 0.1)

// Apply force
Body.applyForce(body, body.position, { x: 0.01, y: -0.02 })

// Scale body
Body.scale(body, 1.5, 1.5) // 150% size
```

### WHY: Force Application

```yaml
Body.applyForce(body, position, force):
  body: The body to apply force to
  position: World position where force is applied (usually body.position)
  force: Vector { x, y } - typically small values (0.001 - 0.1)
  
  NOTE: Force is applied immediately, affects velocity
  Use for: explosions, jumps, thrusters
```

---

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Setting position in update loop:
    WRONG: body.position.x += 5 (breaks physics)
    RIGHT: Body.setPosition(body, { x: newX, y: newY })
    
  Creating bodies with zero size:
    WRONG: Bodies.rectangle(x, y, 0, 0)
    RIGHT: Minimum size of 1x1 pixels
    
  Modifying vertices directly:
    WRONG: body.vertices[0].x = 100
    RIGHT: Body.setVertices (rarely needed)
    
  Forgetting to add to world:
    WRONG: const body = Bodies.rectangle(...) // never added
    RIGHT: Composite.add(engine.world, body)
```

---

**Bodies created. Shapes defined. Physics engaged.**
