---
name: tsl-language
description: Three Shader Language (TSL) - write shaders in JavaScript/TypeScript, compile to WebGPU/WGSL or WebGL/GLSL.
version: 4.0.0
---

# TSL - Three Shader Language

> Write shaders once in JavaScript/TypeScript. Run everywhere—WebGPU or WebGL.

---

## MUST

### 1. Import from three/tsl

**✅ CORRECT:**
```typescript
import {
  uniform,
  positionLocal,
  normalLocal,
  time,
  sin,
  cos,
  mix,
  color,
  Fn
} from 'three/tsl'
```

### 2. Use Node Materials

**✅ CORRECT:**
```typescript
import { MeshStandardNodeMaterial } from 'three/webgpu'

const material = new MeshStandardNodeMaterial()
material.colorNode = color(1, 0, 0).mul(sin(time).mul(0.5).add(0.5))
```

### 3. Use uniform() for Dynamic Values

**✅ CORRECT:**
```typescript
const myColor = uniform(new THREE.Color(0xff0000))

// Update from JavaScript
myColor.value.set(0x00ff00)
```

---

## FORBIDDEN

### 1. Never Mix TSL with Regular Math

**❌ FORBIDDEN:**
```typescript
// ❌ This is CPU math, not GPU!
const result = mesh.position.y * 2.0
```

**✅ CORRECT:**
```typescript
// ✅ This creates a GPU node
const result = positionLocal.y.mul(2.0)
```

### 2. Never Forget TSL is Node-Based

**❌ FORBIDDEN:**
```typescript
// ❌ Expecting immediate value
const value = sin(time)
console.log(value) // Not a number!
```

**✅ CORRECT:**
```typescript
// ✅ Building a node graph
const value = sin(time) // This is a node, not a number
material.colorNode = value // Use in material
```

---

## WHY

### TSL vs GLSL

| Feature | TSL | GLSL |
|---------|-----|------|
| Language | JavaScript/TypeScript | C-like |
| Runtime | WebGPU + WebGL | WebGL only |
| Compilation | Automatic | Manual |
| Debugging | Easier | Harder |
| Portability | ✅ Cross-platform | ❌ WebGL only |

### How TSL Works

```
TSL Code → Node Graph → Compiler → WGSL (WebGPU) or GLSL (WebGL)
```

---

## EXAMPLES

### Basic TSL Shader

```typescript
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { color, time, sin } from 'three/tsl'

const material = new MeshStandardNodeMaterial()

// Animated color
material.colorNode = color(1, 0, 0).mul(sin(time).mul(0.5).add(0.5))
```

### Position Displacement

```typescript
import { positionLocal, normalLocal, time, sin, mul, add } from 'three/tsl'

const material = new MeshStandardNodeMaterial()

// Wave displacement
const displacement = sin(positionLocal.y.mul(5).add(time)).mul(0.2)
material.positionNode = positionLocal.add(normalLocal.mul(displacement))
```

### Custom Function with Fn

```typescript
import { Fn, float, vec3, positionLocal, time } from 'three/tsl'

// Define custom function
const noiseFunction = Fn(([pos, t]) => {
  const x = pos.x.add(t).sin()
  const y = pos.y.add(t.mul(0.5)).cos()
  const z = pos.z.add(t.mul(0.25)).sin()
  return vec3(x, y, z)
})

// Use in material
const material = new MeshStandardNodeMaterial()
material.colorNode = noiseFunction(positionLocal, time)
```

### Texture Sampling

```typescript
import { texture, uv } from 'three/tsl'

const myTexture = new THREE.TextureLoader().load('/texture.jpg')

const material = new MeshStandardNodeMaterial()
material.colorNode = texture(myTexture, uv())
```

### Conditional Logic

```typescript
import { mix, step, color } from 'three/tsl'

// Branchless conditional using step
const t = step(0.5, uv().x) // 0 if x < 0.5, 1 if x >= 0.5
const finalColor = mix(color(1, 0, 0), color(0, 0, 1), t)
```

### Uniforms

```typescript
import { uniform, color } from 'three/tsl'

// Create uniforms
const uColor1 = uniform(new THREE.Color(0x6366f1))
const uColor2 = uniform(new THREE.Color(0xec4899))
const uSpeed = uniform(1.0)

// Use in shader
const gradient = mix(uColor1, uColor2, sin(time.mul(uSpeed)).mul(0.5).add(0.5))

// Update from JavaScript later
uSpeed.value = 2.0
```

---

## TSL Functions Reference

### Math
| Function | Description |
|----------|-------------|
| `add(a, b)` | Addition |
| `sub(a, b)` | Subtraction |
| `mul(a, b)` | Multiplication |
| `div(a, b)` | Division |
| `sin(x)` | Sine |
| `cos(x)` | Cosine |
| `tan(x)` | Tangent |
| `pow(x, y)` | Power |
| `sqrt(x)` | Square root |
| `abs(x)` | Absolute |
| `min(a, b)` | Minimum |
| `max(a, b)` | Maximum |
| `clamp(x, min, max)` | Clamp |
| `mix(a, b, t)` | Linear interpolation |
| `step(edge, x)` | Step function |
| `smoothstep(e0, e1, x)` | Smooth step |

### Vectors
| Function | Description |
|----------|-------------|
| `vec2(x, y)` | 2D vector |
| `vec3(x, y, z)` | 3D vector |
| `vec4(x, y, z, w)` | 4D vector |
| `length(v)` | Vector length |
| `distance(a, b)` | Distance |
| `dot(a, b)` | Dot product |
| `cross(a, b)` | Cross product |
| `normalize(v)` | Normalize |

### Space
| Function | Description |
|----------|-------------|
| `positionLocal` | Local position |
| `positionWorld` | World position |
| `normalLocal` | Local normal |
| `normalWorld` | World normal |
| `uv()` | UV coordinates |
| `cameraPosition` | Camera position |
| `viewMatrix` | View matrix |
| `projectionMatrix` | Projection matrix |

### Time
| Function | Description |
|----------|-------------|
| `time` | Elapsed time |
| `deltaTime` | Frame delta time |
| `frameId` | Frame counter |

---

## Related Assets

- [TSL Gradient Material](../assets/materials/tsl-gradient.ts)
- [TSL Displacement Material](../assets/materials/tsl-displacement.ts)
