---
name: threejs-creative
description: |
  Three.js for immersive 3D web experiences with WebGPU support. Use for (1) 3D hero sections, 
  (2) Interactive scenes, (3) WebGL/WebGPU effects, (4) Particle systems, (5) Procedural geometry. 
  MANDATORY for all 3D experiences.
metadata:
  tags: 
    - threejs
    - webgl
    - webgpu
    - 3d
    - creative
    - immersive
    - r3f
    - react-three-fiber
    - shaders
    - particles
  author: Santiago Workflow Systems
  version: 4.0.0
  priority: high
  last_updated: 2025-02-19
---

# Three.js Creative Master System

**3D experiences that captivate. Performance that delivers. WebGPU ready.**

> 🚀 **Three.js r179** with WebGPU renderer is production-ready since r171—zero-config imports with automatic WebGL 2 fallback.

---

## Quick Start

### Installation
```bash
# Core Three.js
npm install three
npm install -D @types/three

# React Three Fiber (R3F)
npm install @react-three/fiber @react-three/drei

# Post-processing
npm install @react-three/postprocessing postprocessing

# Physics (optional)
npm install @react-three/rapier

# glTF utilities
npm install gltfjsx @gltf-transform/cli
```

### Basic Scene (R3F)
```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

export function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <OrbitControls enableZoom={false} />
      <Environment preset="city" />
    </Canvas>
  )
}
```

### WebGPU Renderer (New)
```tsx
import { WebGPURenderer } from 'three/webgpu'

// Zero-config with automatic WebGL 2 fallback
const renderer = new WebGPURenderer({
  antialias: true,
  powerPreference: 'high-performance'
})
await renderer.init()
```

---

## Architecture Overview

```
threejs-creative/
├── SKILL.md                    # This file - Master Manifest
├── rules/
│   ├── 01-setup-scene.md       # Scene, Camera, Renderer setup
│   ├── 02-geometries-materials.md # Geometries, Materials, Textures
│   ├── 03-lighting.md          # Lights, Shadows, Environment
│   ├── 04-animations-loop.md   # Animation loop, useFrame
│   ├── 05-interactions.md      # Raycaster, Events, Hover
│   ├── 06-postprocessing.md    # Effects, Bloom, DOF
│   ├── 07-performance.md       # Optimization, Instancing, LOD
│   ├── 08-react-three-fiber.md # R3F patterns, Drei
│   └── assets/
│       ├── components/         # Reusable 3D components
│       ├── hooks/              # Custom R3F hooks
│       ├── utils/              # Helpers, loaders
│       ├── shaders/            # Custom shaders (GLSL/TSL)
│       └── scenes/             # Complete scene templates
└── references/
    ├── official-docs.md        # Links to official docs
    └── migration-guides.md     # WebGL to WebGPU
```

---

## Rule Index

| Rule | Topic | Priority |
|------|-------|----------|
| [01-setup-scene](rules/01-setup-scene.md) | Scene, Camera, Renderer | CRITICAL |
| [02-geometries-materials](rules/02-geometries-materials.md) | Geometries, Materials | CRITICAL |
| [03-lighting](rules/03-lighting.md) | Lights, Shadows, Environment | HIGH |
| [04-animations-loop](rules/04-animations-loop.md) | Animation loop, useFrame | HIGH |
| [05-interactions](rules/05-interactions.md) | Raycaster, Events | HIGH |
| [06-postprocessing](rules/06-postprocessing.md) | Effects, Bloom, DOF | MEDIUM |
| [07-performance](rules/07-performance.md) | Optimization, WebGPU | CRITICAL |
| [08-react-three-fiber](rules/08-react-three-fiber.md) | R3F patterns | HIGH |

---

## Performance Golden Rules

### ✅ DO
- Use **InstancedMesh** for repeated objects (1 draw call vs 1000)
- Implement **LOD** (Level of Detail) with Drei's `<Detailed />`
- Use **texture compression** (KTX2, Draco)
- **Dispose** geometries/materials on unmount
- Target **under 100 draw calls** per frame
- Use **WebGPU renderer** for new projects
- **Bake lighting** for static scenes

### ❌ NEVER
- Render at full resolution on mobile
- Load unoptimized textures (PNG/JPEG instead of KTX2)
- Forget cleanup on component unmount
- Animate thousands of individual meshes
- Create objects inside `useFrame`
- Ignore `renderer.info.render.calls`

---

## WebGPU vs WebGL

| Feature | WebGL | WebGPU |
|---------|-------|--------|
| Import | `three` | `three/webgpu` |
| Compute Shaders | ❌ Limited | ✅ Full support |
| Performance | Baseline | 2-10x faster |
| Fallback | - | Automatic WebGL 2 |
| TSL Support | Partial | Full |

```tsx
// WebGPU with automatic fallback
import { WebGPURenderer } from 'three/webgpu'

const renderer = new WebGPURenderer()
await renderer.init() // Falls back to WebGL 2 if needed
```

---

## Key Metrics to Monitor

```typescript
// Check every frame during development
setInterval(() => {
  console.log({
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    geometries: renderer.info.memory.geometries,
    textures: renderer.info.memory.textures,
  })
}, 1000)
```

**Targets:**
- Draw calls: < 100
- Triangles: < 500K
- Stable memory (not growing)

---

## Integration with GSAP

```tsx
import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export function AnimatedMesh() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useEffect(() => {
    if (!meshRef.current) return
    
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      duration: 4,
      repeat: -1,
      ease: 'none'
    })
  }, [])
  
  return (
    <mesh ref={meshRef}>
      <torusGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

---

## Pre-flight Checklist

### For New Projects
- [ ] Install `@react-three/fiber` and `@react-three/drei`
- [ ] Set up `dpr={[1, 2]}` for responsive pixel ratio
- [ ] Configure `powerPreference: 'high-performance'`
- [ ] Add `stats-gl` for performance monitoring
- [ ] Set up proper disposal in cleanup functions

### For Production
- [ ] Compress textures with KTX2
- [ ] Compress models with Draco
- [ ] Implement LOD for complex models
- [ ] Use InstancedMesh for repeated objects
- [ ] Test on mobile devices
- [ ] Verify < 100 draw calls
- [ ] Add loading states for assets

---

## Resources

- [Three.js Documentation](https://threejs.org/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Documentation](https://github.com/pmndrs/drei)
- [Three.js Journey](https://threejs-journey.com)
- [WebGPU Samples](https://webgpu.github.io/webgpu-samples)

---

*Last updated: 2025-02-19 | Version 4.0.0*
