---
name: webgl-shaders
description: |
  Custom WebGL shaders for advanced effects. Use for (1) Distortion effects, (2) Liquid animations, 
  (3) Advanced materials, (4) Custom rendering, (5) Post-processing. MANDATORY for shader effects.
metadata:
  tags: 
    - webgl
    - shaders
    - glsl
    - tsl
    - three-shader-language
    - fragment-shader
    - vertex-shader
    - webgpu
  author: Santiago Workflow Systems
  version: 4.0.0
  priority: high
  last_updated: 2025-02-19
---

# WebGL Shaders Master System

**Pixel-perfect control. Unlimited creativity. TSL-ready.**

> 🚀 **TSL (Three Shader Language)** is the future—write once, run on WebGPU or WebGL.

---

## Quick Start

### GLSL Shaders (WebGL)
```tsx
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    vec3 color = vec3(0.5 + 0.5 * cos(uTime + vUv.xyx + vec3(0, 2, 4)));
    gl_FragColor = vec4(color, 1.0);
  }
`

const MyMaterial = shaderMaterial(
  { uTime: 0 },
  vertexShader,
  fragmentShader
)
```

### TSL Shaders (WebGPU/WebGL)
```tsx
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { color, positionLocal, sin, time, mix } from 'three/tsl'

const material = new MeshStandardNodeMaterial()
material.colorNode = color(1, 0, 0).mul(sin(time).mul(0.5).add(0.5))
```

---

## Architecture Overview

```
webgl-shaders/
├── SKILL.md                    # This file - Master Manifest
├── rules/
│   ├── 01-glsl-basics.md       # GLSL fundamentals
│   ├── 02-tsl-language.md      # Three Shader Language
│   ├── 03-uniforms-attributes.md # Data passing
│   ├── 04-textures-sampling.md # Texture operations
│   ├── 05-lighting-shaders.md  # Lighting calculations
│   ├── 06-postprocessing.md    # Post-processing effects
│   ├── 07-particle-shaders.md  # Particle systems
│   ├── 08-optimization.md      # Performance optimization
│   └── assets/
│       ├── shaders/            # GLSL/TSL shader files
│       ├── components/         # React components
│       ├── hooks/              # Custom hooks
│       ├── materials/          # Custom materials
│       └── utils/              # Utilities
└── references/
    ├── official-docs.md        # Links to docs
    └── migration-guides.md     # GLSL to TSL
```

---

## Rule Index

| Rule | Topic | Priority |
|------|-------|----------|
| [01-glsl-basics](rules/01-glsl-basics.md) | GLSL fundamentals | CRITICAL |
| [02-tsl-language](rules/02-tsl-language.md) | Three Shader Language | CRITICAL |
| [03-uniforms-attributes](rules/03-uniforms-attributes.md) | Data passing | HIGH |
| [04-textures-sampling](rules/04-textures-sampling.md) | Textures | HIGH |
| [05-lighting-shaders](rules/05-lighting-shaders.md) | Lighting | HIGH |
| [06-postprocessing](rules/06-postprocessing.md) | Post-processing | MEDIUM |
| [07-particle-shaders](rules/07-particle-shaders.md) | Particles | MEDIUM |
| [08-optimization](rules/08-optimization.md) | Performance | CRITICAL |

---

## GLSL vs TSL

| Feature | GLSL | TSL |
|---------|------|-----|
| Runtime | WebGL only | WebGPU + WebGL |
| Syntax | C-like | JavaScript/TypeScript |
| Compilation | Manual | Automatic |
| Cross-platform | ❌ No | ✅ Yes |
| Learning curve | Steep | Gentle |

---

## Performance Golden Rules

### ✅ DO
- Use `mediump` precision on mobile
- Move calculations to vertex shader when possible
- Use `mix()` and `step()` instead of conditionals
- Pack data into RGBA channels
- Prefer fixed-size loops

### ❌ NEVER
- Branch inside tight loops
- Use dynamic loop bounds
- Calculate per-fragment what could be per-vertex
- Ignore precision qualifiers

---

## Pre-flight Checklist

- [ ] Shaders compile without errors
- [ ] Uniforms updated every frame (if animated)
- [ ] Performance tested on mobile
- [ ] Fallback for unsupported features
- [ ] Cleanup on unmount

---

## Resources

- [Three.js Shaders](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [TSL Wiki](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)
- [The Book of Shaders](https://thebookofshaders.com/)
- [GLSL Reference](https://www.khronos.org/files/opengles_shading_language.pdf)

---

*Last updated: 2025-02-19 | Version 4.0.0*
