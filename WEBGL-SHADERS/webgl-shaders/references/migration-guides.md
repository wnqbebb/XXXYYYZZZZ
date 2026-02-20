# Migration Guides

## GLSL to TSL Migration

### Basic Shader

**GLSL:**
```glsl
// Vertex
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment
uniform float uTime;
varying vec2 vUv;
void main() {
  gl_FragColor = vec4(vUv, sin(uTime), 1.0);
}
```

**TSL:**
```typescript
import { color, uv, time, sin } from 'three/tsl'

const material = new MeshBasicNodeMaterial()
material.colorNode = color(uv().x, uv().y, sin(time), 1)
```

### Uniforms

**GLSL:**
```glsl
uniform vec3 uColor;
uniform float uSpeed;
```

**TSL:**
```typescript
const uColor = uniform(new THREE.Color(0xff0000))
const uSpeed = uniform(1.0)

// Update later
uColor.value.set(0x00ff00)
uSpeed.value = 2.0
```

### Position Displacement

**GLSL:**
```glsl
vec3 newPosition = position + normal * sin(time + position.y * 5.0) * 0.2;
gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
```

**TSL:**
```typescript
const displacement = sin(positionLocal.y.mul(5).add(time)).mul(0.2)
material.positionNode = positionLocal.add(normalLocal.mul(displacement))
```

## WebGL to WebGPU

### Renderer Setup

**WebGL:**
```typescript
const renderer = new THREE.WebGLRenderer()
```

**WebGPU:**
```typescript
import { WebGPURenderer } from 'three/webgpu'

const renderer = new WebGPURenderer()
await renderer.init()
```

### Material

**WebGL:**
```typescript
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms
})
```

**WebGPU:**
```typescript
const material = new MeshBasicNodeMaterial()
material.colorNode = /* TSL nodes */
```
