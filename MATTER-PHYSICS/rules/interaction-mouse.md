---
name: matter-interaction-mouse
description: Mouse and touch interaction with physics bodies. Load when implementing drag and drop.
metadata:
  tags: matter, mouse, interaction, drag, drop, touch, constraint
---

# Mouse Interaction Rules

## MUST: Mouse Constraint Setup

```typescript
import Matter from 'matter-js'

const { Mouse, MouseConstraint } = Matter

// Create mouse
const mouse = Mouse.create(canvasElement)

// Create mouse constraint (drag behavior)
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,        // Spring stiffness (0-1)
    render: {
      visible: true,       // Show constraint line
      strokeStyle: '#90EE90',
      lineWidth: 2
    }
  }
})

// Add to world
Composite.add(engine.world, mouseConstraint)

// Keep mouse in sync with render
render.mouse = mouse
```

### WHY: Mouse Constraint

```yaml
MouseConstraint:
  - Creates invisible spring between mouse and clicked body
  - Allows dragging physics bodies naturally
  - Respects body properties (mass, friction)
  - Automatically handles touch on mobile
  
constraint.stiffness:
  0.1: Loose, laggy drag (heavy feel)
  0.2: Normal drag (recommended)
  0.5: Tight, responsive drag
  1.0: Rigid, instant follow
```

---

## MUST: Touch Support

```typescript
// Mouse automatically handles touch, but optimize for mobile
const mouse = Mouse.create(canvasElement)

// Increase touch tolerance for mobile
mouse.pixelRatio = window.devicePixelRatio

// Prevent default touch behaviors
mouse.element.removeEventListener('mousewheel', mouse.mousewheel)
mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
```

### WHY: Mobile Optimization

```yaml
MUST: Handle mobile touch properly
  - MouseConstraint automatically supports touch
  - Use larger bodies for touch (min 40px)
  - Prevent page scroll when interacting
  - Test on actual devices
```

---

## MUST: Drag Events

```typescript
// Start dragging
Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
  const body = event.body
  console.log('Started dragging:', body.label)
  
  // Disable sleep while dragging
  if (body) {
    Matter.Sleeping.set(body, false)
  }
})

// End dragging
Matter.Events.on(mouseConstraint, 'enddrag', (event) => {
  const body = event.body
  console.log('Stopped dragging:', body.label)
  
  // Add impulse on release for "throw" effect
  if (body) {
    const velocity = body.velocity
    Matter.Body.setVelocity(body, {
      x: velocity.x * 2,
      y: velocity.y * 2
    })
  }
})
```

---

## MUST: Click/Interaction Detection

```typescript
// Detect clicks without dragging
let isDragging = false
let dragThreshold = 5
let startPosition = { x: 0, y: 0 }

Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
  isDragging = false
  startPosition = { ...mouse.position }
})

Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
  const dx = mouse.position.x - startPosition.x
  const dy = mouse.position.y - startPosition.y
  
  if (Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
    isDragging = true
  }
})

Matter.Events.on(mouseConstraint, 'enddrag', (event) => {
  if (!isDragging && event.body) {
    // It was a click, not a drag
    handleBodyClick(event.body)
  }
})

function handleBodyClick(body: Matter.Body) {
  console.log('Clicked:', body.label)
  // Trigger action: explode, change color, etc.
}
```

---

## MUST: Hover Effects

```typescript
import Matter from 'matter-js'

const { Query } = Matter

// Track hovered body
let hoveredBody: Matter.Body | null = null

// Check hover on mouse move
Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
  const mousePosition = mouse.position
  
  // Query bodies at mouse position
  const bodies = Composite.allBodies(engine.world)
  const found = Query.point(bodies, mousePosition)
  
  if (found.length > 0) {
    const body = found[0]
    
    if (hoveredBody !== body) {
      // Mouse enter
      hoveredBody = body
      onBodyHoverStart(body)
    }
  } else {
    if (hoveredBody) {
      // Mouse leave
      onBodyHoverEnd(hoveredBody)
      hoveredBody = null
    }
  }
})

function onBodyHoverStart(body: Matter.Body) {
  // Visual feedback
  body.render.fillStyle = '#ff6b6b'
  document.body.style.cursor = 'pointer'
}

function onBodyHoverEnd(body: Matter.Body) {
  body.render.fillStyle = body.plugin?.originalColor || '#4ecdc4'
  document.body.style.cursor = 'default'
}
```

---

## MUST: Restrict Drag to Specific Bodies

```typescript
// Only allow dragging certain bodies
const draggableBodies = new Set(['player', 'item', 'box'])

Matter.Events.on(mouseConstraint, 'startdrag', (event) => {
  const body = event.body
  
  if (body && !draggableBodies.has(body.label)) {
    // Cancel drag by disabling constraint
    mouseConstraint.constraint.bodyA = null
    mouseConstraint.constraint.bodyB = null
  }
})

// Alternative: Use collision filter
draggableBody.collisionFilter = {
  group: 0,
  category: 0x0002,  // Draggable category
  mask: 0xFFFFFFFF   // Collide with everything
}

staticBody.collisionFilter = {
  group: 0,
  category: 0x0001,  // Default category
  mask: 0x0001       // Only collide with default
}
```

### WHY: Collision Filters

```yaml
collisionFilter:
  group: 
    Positive: Always collide with same group
    Negative: Never collide with same group
    0: Use category/mask
    
  category: Bitmask of body type (0x0001, 0x0002, etc.)
  mask: Bitmask of categories this body collides with
  
Example:
  Player: category=0x0002, mask=0x0005 (collides with default 0x0001 + enemy 0x0004)
  Enemy:  category=0x0004, mask=0x0002 (collides with player only)
```

---

## MUST: Custom Cursor States

```typescript
// Update cursor based on interaction
Matter.Events.on(mouseConstraint, 'mousemove', (event) => {
  const bodies = Query.point(Composite.allBodies(engine.world), mouse.position)
  const isOverBody = bodies.length > 0
  const isDragging = mouseConstraint.body !== null
  
  if (isDragging) {
    document.body.style.cursor = 'grabbing'
  } else if (isOverBody) {
    document.body.style.cursor = 'grab'
  } else {
    document.body.style.cursor = 'default'
  }
})
```

---

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Ignoring touch devices:
    WRONG: Mouse only implementation
    RIGHT: Test and optimize for touch
    
  Tiny touch targets:
    WRONG: Bodies smaller than 30px on mobile
    RIGHT: Minimum 40px touch targets
    
  Blocking all pointer events:
    WRONG: canvas { pointer-events: none }
    RIGHT: Allow pointer events on canvas
    
  Forgetting to remove listeners:
    WRONG: Add events without cleanup
    RIGHT: Remove listeners on component unmount
```

---

**Interaction enabled. Drag, drop, and play.**
