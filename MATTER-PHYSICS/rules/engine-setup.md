---
name: matter-engine-setup
description: Matter.js engine initialization and configuration. Load when setting up any physics scene.
metadata:
  tags: matter, engine, world, runner, render, setup
---

# Engine Setup Rules

## MUST: Engine Creation

```typescript
import Matter from 'matter-js'

const { Engine, World } = Matter

// Create engine
const engine = Engine.create()

// Access the world
const world = engine.world
```

### WHY: Engine Configuration

```yaml
Engine.create(options):
  gravity:
    x: 0        # Horizontal gravity (0 for normal scenes)
    y: 1        # Vertical gravity (1 = Earth-like)
    scale: 0.001 # Gravity scale factor
  
  enableSleeping: true  # CRITICAL for performance
    MUST: Always enable for production
    WHY: Deactivates inactive bodies, saves CPU
```

### MUST: Configure Gravity

```typescript
// Zero gravity for space effects
engine.gravity.y = 0
engine.gravity.x = 0

// Moon gravity
engine.gravity.y = 0.5

// Sideways gravity
engine.gravity.x = 1
engine.gravity.y = 0
```

---

## MUST: Time Management

### Fixed Time Step (Recommended)

```typescript
const FIXED_TIME_STEP = 1000 / 60 // 60 FPS
let lastTime = 0

function update(time: number) {
  const delta = time - lastTime
  lastTime = time
  
  // Update engine with fixed time step
  Engine.update(engine, FIXED_TIME_STEP)
  
  requestAnimationFrame(update)
}
```

### Variable Time Step (Use with Caution)

```typescript
function update(time: number) {
  const delta = time - lastTime
  lastTime = time
  
  // Cap delta to prevent spiral of death
  const cappedDelta = Math.min(delta, 100)
  
  Engine.update(engine, cappedDelta)
  requestAnimationFrame(update)
}
```

### WHY: Time Step Matters

```yaml
Fixed Time Step:
  PROS: Consistent physics, reproducible results
  CONS: May jitter if render FPS differs
  USE: Games, precise simulations

Variable Time Step:
  PROS: Adapts to frame rate
  CONS: Physics inconsistency at low FPS
  USE: Visual effects, non-critical physics
```

---

## MUST: Debug Renderer (Development Only)

```typescript
import Matter from 'matter-js'

const { Render } = Matter

const render = Render.create({
  element: container,      // HTML element to attach canvas
  engine: engine,          // Physics engine
  options: {
    width: 800,            // Canvas width
    height: 600,           // Canvas height
    wireframes: false,     // false = filled shapes, true = outlines
    showAngleIndicator: false,
    showCollisions: false,
    showVelocity: false,
    showIds: false,
    showDebug: false,
    background: '#f0f0f0', // Background color
    pixelRatio: window.devicePixelRatio // Sharp rendering
  }
})

// Start rendering
Render.run(render)

// Stop rendering (cleanup)
Render.stop(render)
```

### FORBIDDEN: Render in Production

```yaml
FORBIDDEN:
  Using Matter.Render in production:
    WHY: Not optimized, limited styling options
    RIGHT: Implement custom renderer with canvas/SVG
    
  Ignoring pixel ratio:
    WRONG: No pixelRatio option
    RIGHT: options.pixelRatio = window.devicePixelRatio
```

---

## MUST: World Bounds

```typescript
const { Bodies, Composite } = Matter

// Create boundary walls
const width = 800
const height = 600
const wallThickness = 60

const ground = Bodies.rectangle(
  width / 2, 
  height + wallThickness / 2, 
  width + 200, 
  wallThickness, 
  { isStatic: true, label: 'ground' }
)

const leftWall = Bodies.rectangle(
  -wallThickness / 2, 
  height / 2, 
  wallThickness, 
  height * 2, 
  { isStatic: true, label: 'leftWall' }
)

const rightWall = Bodies.rectangle(
  width + wallThickness / 2, 
  height / 2, 
  wallThickness, 
  height * 2, 
  { isStatic: true, label: 'rightWall' }
)

Composite.add(engine.world, [ground, leftWall, rightWall])
```

### WHY: Bounds Prevent Memory Leaks

```yaml
MUST: Always set world bounds
  WHY: Bodies falling infinitely consume memory
  EXCEPTION: Intentional falling objects (destroy when off-screen)
```

---

## MUST: Cleanup on Destroy

```typescript
function cleanup() {
  // Stop runner
  Runner.stop(runner)
  
  // Stop renderer
  Render.stop(render)
  
  // Clear world
  Composite.clear(engine.world, false)
  
  // Clear engine
  Engine.clear(engine)
  
  // Remove canvas from DOM
  if (render.canvas) {
    render.canvas.remove()
  }
}
```

### WHY: Memory Management

```yaml
MUST: Always cleanup physics scenes
  Engine.clear(): Removes all bodies, constraints, events
  Composite.clear(): Removes bodies from world
  Runner.stop(): Stops update loop
  Render.stop(): Stops render loop
  
FORBIDDEN:
  Creating new engines without destroying old ones
  WHY: Memory leaks, performance degradation
```

---

## MUST: Runner Utility

```typescript
import Matter from 'matter-js'

const { Runner } = Matter

// Create runner
const runner = Runner.create()

// Start runner (calls Engine.update automatically)
Runner.run(runner, engine)

// Stop runner
Runner.stop(runner)
```

### WHY: Runner vs Manual Update

```yaml
Runner:
  PROS: Simple, handles timing automatically
  CONS: Less control over update loop
  USE: Prototyping, simple scenes

Manual Update:
  PROS: Full control, sync with render loop
  CONS: More code to maintain
  USE: Games, complex scenes, custom timing
```

---

**Engine configured. Physics world ready.**
