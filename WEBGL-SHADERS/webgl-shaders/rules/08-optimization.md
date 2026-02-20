---
name: optimization
description: Shader performance optimization - precision, branching, and best practices.
version: 4.0.0
---

# Shader Optimization

> Write shaders that run fast on all devices.

---

## MUST

### 1. Use Appropriate Precision

**✅ CORRECT:**
```glsl
// Mobile: use mediump
precision mediump float;

// Desktop: can use highp
#ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
#else
  precision mediump float;
#endif
```

### 2. Move Calculations to Vertex Shader

**✅ CORRECT:**
```glsl
// Vertex shader
varying vec3 vLightDir;

void main() {
  vLightDir = normalize(uLightPosition - (modelMatrix * vec4(position, 1.0)).xyz);
  // ...
}

// Fragment shader
varying vec3 vLightDir;

void main() {
  float diff = max(dot(vNormal, vLightDir), 0.0);
  // ...
}
```

### 3. Use Branchless Code

**✅ CORRECT:**
```glsl
// Branchless conditional
float t = step(0.5, value);
vec3 color = mix(colorB, colorA, t);

// Instead of
vec3 color;
if (value > 0.5) {
  color = colorA;
} else {
  color = colorB;
}
```

---

## FORBIDDEN

### 1. Never Use Dynamic Loops

**❌ FORBIDDEN:**
```glsl
// ❌ Dynamic loop bounds
uniform int uCount;
for (int i = 0; i < uCount; i++) { ... }
```

**✅ CORRECT:**
```glsl
// ✅ Fixed loop bounds
for (int i = 0; i < 10; i++) {
  if (i >= uCount) break;
  // ...
}
```

### 2. Never Use Many Varyings

**❌ FORBIDDEN:**
```glsl
// ❌ Too many varyings
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec4 vColor;
varying float vDepth;
```

**✅ CORRECT:**
```glsl
// ✅ Pack data
varying vec4 vData1; // xyz = position, w = depth
varying vec4 vData2; // xy = uv, zw = packed normal
```

---

## WHY

### Performance Killers

| Issue | Impact |
|-------|--------|
| Branching | GPU divergence |
| Dynamic loops | Can't unroll |
| Too many varyings | Bandwidth |
| High precision | 2x slower on mobile |
| Per-fragment calculations | Fragment bound |

---

## Optimization Checklist

- [ ] Use `mediump` on mobile
- [ ] Move calculations to vertex shader
- [ ] Replace conditionals with `mix()`/`step()`
- [ ] Use fixed-size loops
- [ ] Pack varyings
- [ ] Profile with `renderer.info`

---

## Related Assets

- [Optimized Shader Template](../assets/shaders/optimized-template.glsl)
