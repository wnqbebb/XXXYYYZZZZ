---
name: particle-shaders
description: Particle systems with shaders - GPU particles, instancing, and compute shaders.
version: 4.0.0
---

# Particle Shaders

> Create stunning particle effects with GPU acceleration.

---

## MUST

### 1. Use InstancedMesh for GPU Particles

**✅ CORRECT:**
```tsx
const particleCount = 10000
const mesh = new THREE.InstancedMesh(geometry, material, particleCount)
```

### 2. Animate Particles in Vertex Shader

**✅ CORRECT:**
```glsl
uniform float uTime;
attribute vec3 aVelocity;
attribute float aLife;

void main() {
  vec3 newPosition = position + aVelocity * uTime;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 3. Use Compute Shaders for WebGPU

**✅ CORRECT:**
```typescript
import { wgslFn, storage, uniform } from 'three/tsl'

const computeParticles = wgslFn(`
  fn computeParticles(particles: ptr<storage, array<vec3<f32>>, read_write>, 
                      time: f32) -> void {
    let index = globalId.x;
    particles[index].y += sin(time + f32(index)) * 0.01;
  }
`)
```

---

## FORBIDDEN

### 1. Never Animate Particles on CPU

**❌ FORBIDDEN:**
```tsx
// ❌ CPU animation - slow!
for (let i = 0; i < particleCount; i++) {
  particles[i].position.y += Math.sin(time + i) * 0.01
}
```

**✅ CORRECT:**
```glsl
// ✅ GPU animation - fast!
void main() {
  vec3 newPosition = position;
  newPosition.y += sin(uTime + float(gl_InstanceID)) * 0.01;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

---

## WHY

### CPU vs GPU Particles

| Method | Max Particles | Performance |
|--------|---------------|-------------|
| CPU | ~1,000 | Poor |
| GPU (Instanced) | ~100,000 | Good |
| GPU (Compute) | ~1,000,000 | Excellent |

---

## EXAMPLES

### Basic GPU Particles

```glsl
// Vertex shader
uniform float uTime;
attribute vec3 aOffset;
attribute float aScale;
attribute float aSpeed;

varying float vAlpha;

void main() {
  vec3 pos = position * aScale;
  pos += aOffset;
  
  // Animate
  pos.y += mod(uTime * aSpeed, 10.0);
  
  // Fade out near top
  vAlpha = 1.0 - smoothstep(8.0, 10.0, pos.y);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

```glsl
// Fragment shader
varying float vAlpha;

void main() {
  // Circular particle
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  if (dist > 0.5) discard;
  
  // Soft edge
  float alpha = (0.5 - dist) * 2.0 * vAlpha;
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
```

### Fire Particles

```glsl
// Fragment shader - fire effect
uniform float uTime;
varying float vLife;
varying float vHeat;

void main() {
  vec2 center = gl_PointCoord - 0.5;
  float dist = length(center);
  if (dist > 0.5) discard;
  
  // Fire colors
  vec3 color1 = vec3(1.0, 0.8, 0.0); // Yellow
  vec3 color2 = vec3(1.0, 0.2, 0.0); // Red
  vec3 color3 = vec3(0.2, 0.0, 0.0); // Dark
  
  float t = vLife;
  vec3 color = mix(color1, color2, t);
  color = mix(color, color3, t * t);
  
  float alpha = (0.5 - dist) * 2.0 * (1.0 - t);
  
  gl_FragColor = vec4(color, alpha);
}
```

---

## Related Assets

- [Particle Vertex Shader](../assets/shaders/particle-vertex.glsl)
- [Particle Fragment Shader](../assets/shaders/particle-fragment.glsl)
