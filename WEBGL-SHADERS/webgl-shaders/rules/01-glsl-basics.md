---
name: glsl-basics
description: GLSL fundamentals - vertex shaders, fragment shaders, data types, and built-in functions.
version: 4.0.0
---

# GLSL Basics - Shader Fundamentals

> Understanding GLSL is essential for custom WebGL effects.

---

## MUST

### 1. Understand Shader Pipeline

**✅ CORRECT:**
```
Vertex Data → Vertex Shader → Rasterization → Fragment Shader → Output
```

### 2. Use Precision Qualifiers

**✅ CORRECT:**
```glsl
// Vertex shader (default highp)
precision highp float;

// Fragment shader (use mediump on mobile)
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
```

### 3. Pass Data with Varyings

**✅ CORRECT:**
```glsl
// Vertex shader
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment shader
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
}
```

---

## FORBIDDEN

### 1. Never Use Undefined Precision

**❌ FORBIDDEN:**
```glsl
// ❌ No precision specified
float value = 1.0;
```

**✅ CORRECT:**
```glsl
// ✅ Always specify precision
precision mediump float;
float value = 1.0;
```

### 2. Never Forget to Declare Varyings in Both Shaders

**❌ FORBIDDEN:**
```glsl
// Vertex shader
varying vec2 vUv;

// Fragment shader
// ❌ Missing varying declaration!
void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
```

**✅ CORRECT:**
```glsl
// Fragment shader
varying vec2 vUv; // ✅ Must declare!

void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
```

---

## WHY

### Shader Types

| Shader | Runs On | Output |
|--------|---------|--------|
| Vertex | Each vertex | `gl_Position` |
| Fragment | Each pixel | `gl_FragColor` |

### Precision Types

| Precision | Range | Use Case |
|-----------|-------|----------|
| `lowp` | -2 to 2 | Colors, simple values |
| `mediump` | -2^14 to 2^14 | Most calculations |
| `highp` | -2^62 to 2^62 | Positions, depth |

---

## EXAMPLES

### Basic Vertex Shader

```glsl
// Basic vertex shader
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

### Basic Fragment Shader

```glsl
precision mediump float;

uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  vec3 color = uColor * (0.5 + 0.5 * sin(uTime + vUv.x * 3.14159));
  gl_FragColor = vec4(color, 1.0);
}
```

### Wave Distortion

```glsl
// Vertex shader with wave distortion
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  
  vec3 newPosition = position;
  float elevation = sin(position.x * uFrequency + uTime) * uAmplitude;
  elevation += sin(position.y * uFrequency * 0.5 + uTime) * uAmplitude;
  
  newPosition.z += elevation;
  vElevation = elevation;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

```glsl
// Fragment shader for wave coloring
precision mediump float;

uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;

varying float vElevation;

void main() {
  float mixStrength = (vElevation + 1.0) * 0.5;
  vec3 color = mix(uDepthColor, uSurfaceColor, mixStrength);
  gl_FragColor = vec4(color, 1.0);
}
```

---

## Data Types

| Type | Description | Example |
|------|-------------|---------|
| `float` | Single precision | `1.0` |
| `vec2` | 2D vector | `vec2(1.0, 2.0)` |
| `vec3` | 3D vector | `vec3(1.0, 2.0, 3.0)` |
| `vec4` | 4D vector | `vec4(1.0, 2.0, 3.0, 1.0)` |
| `mat2` | 2x2 matrix | `mat2(1.0)` |
| `mat3` | 3x3 matrix | `mat3(1.0)` |
| `mat4` | 4x4 matrix | `mat4(1.0)` |
| `sampler2D` | 2D texture | `uniform sampler2D uTexture` |

---

## Built-in Functions

| Function | Description | Example |
|----------|-------------|---------|
| `sin(x)` | Sine | `sin(time)` |
| `cos(x)` | Cosine | `cos(time)` |
| `tan(x)` | Tangent | `tan(uv.x)` |
| `pow(x, y)` | Power | `pow(color, vec3(2.2))` |
| `sqrt(x)` | Square root | `sqrt(distance)` |
| `abs(x)` | Absolute | `abs(value)` |
| `min(x, y)` | Minimum | `min(a, b)` |
| `max(x, y)` | Maximum | `max(a, b)` |
| `clamp(x, min, max)` | Clamp | `clamp(value, 0.0, 1.0)` |
| `mix(a, b, t)` | Linear interpolate | `mix(colorA, colorB, t)` |
| `step(edge, x)` | Step function | `step(0.5, uv.x)` |
| `smoothstep(e0, e1, x)` | Smooth step | `smoothstep(0.0, 1.0, t)` |
| `length(v)` | Vector length | `length(position)` |
| `distance(p1, p2)` | Distance | `distance(a, b)` |
| `dot(a, b)` | Dot product | `dot(normal, light)` |
| `cross(a, b)` | Cross product | `cross(a, b)` |
| `normalize(v)` | Normalize | `normalize(normal)` |
| `reflect(I, N)` | Reflection | `reflect(view, normal)` |
| `refract(I, N, eta)` | Refraction | `refract(view, normal, 1.5)` |

---

## Related Assets

- [Basic Vertex Shader](../assets/shaders/basic-vertex.glsl)
- [Basic Fragment Shader](../assets/shaders/basic-fragment.glsl)
- [Wave Shader](../assets/shaders/wave.glsl)
