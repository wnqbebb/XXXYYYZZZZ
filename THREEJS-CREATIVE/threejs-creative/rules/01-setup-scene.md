---
name: setup-scene
description: Scene, Camera, and Renderer configuration. WebGPU setup with automatic WebGL fallback.
version: 4.0.0
---

# Setup Scene - Foundation Architecture

> Proper scene setup is the foundation of every 3D experience. Get this right first.

---

## MUST

### 1. Use WebGPU Renderer for New Projects

**✅ CORRECT:**
```tsx
import { WebGPURenderer } from 'three/webgpu'

const renderer = new WebGPURenderer({
  antialias: true,
  powerPreference: 'high-performance',
  alpha: true
})
await renderer.init() // Automatic WebGL 2 fallback
```

### 2. Configure Responsive Pixel Ratio (DPR)

**✅ CORRECT:**
```tsx
// Limit DPR for performance
const getDpr = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const maxDpr = isMobile ? 1.5 : 2
  return Math.min(maxDpr, window.devicePixelRatio)
}

<Canvas dpr={getDpr()} />

// Or with dynamic adjustment
<Canvas dpr={[1, 2]} /> // R3F handles this automatically
```

### 3. Set Up Scene Graph Properly

**✅ CORRECT:**
```tsx
import { Scene, PerspectiveCamera, WebGPURenderer } from 'three'

// Scene
const scene = new Scene()
scene.background = new Color(0x000000)

// Camera
const camera = new PerspectiveCamera(
  45,           // FOV
  width / height, // Aspect ratio
  0.1,          // Near plane
  1000          // Far plane
)
camera.position.set(0, 0, 5)

// Renderer
const renderer = new WebGPURenderer({ antialias: true })
renderer.setSize(width, height)
renderer.setPixelRatio(getDpr())
```

### 4. Use R3F Canvas for React Projects

**✅ CORRECT:**
```tsx
import { Canvas } from '@react-three/fiber'

export function App() {
  return (
    <Canvas
      // Camera setup
      camera={{ 
        position: [0, 0, 5], 
        fov: 45,
        near: 0.1,
        far: 1000 
      }}
      
      // WebGL/WebGPU config
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true
      }}
      
      // Pixel ratio
      dpr={[1, 2]}
      
      // Frame loop
      frameloop="always" // or "demand" for static scenes
    >
      <Scene />
    </Canvas>
  )
}
```

---

## FORBIDDEN

### 1. Never Create Renderer Without Size

**❌ FORBIDDEN:**
```tsx
const renderer = new WebGPURenderer()
// Missing setSize!
```

**✅ CORRECT:**
```tsx
const renderer = new WebGPURenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```

### 2. Never Use Full DPR on Mobile

**❌ FORBIDDEN:**
```tsx
// ❌ 3x DPR on mobile = performance killer
renderer.setPixelRatio(window.devicePixelRatio)
```

**✅ CORRECT:**
```tsx
// ✅ Cap at 1.5 for mobile
const dpr = Math.min(
  isMobile ? 1.5 : 2,
  window.devicePixelRatio
)
renderer.setPixelRatio(dpr)
```

### 3. Never Forget Resize Handler

**❌ FORBIDDEN:**
```tsx
// ❌ No resize handling
function animate() {
  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
```

**✅ CORRECT:**
```tsx
// ✅ Proper resize handling
window.addEventListener('resize', onWindowResize)

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
```

---

## WHY

### WebGPU Benefits

- **2-10x performance** in draw-call-heavy scenes
- **Compute shaders** for particles, physics, GPU culling
- **TSL (Three Shader Language)** - write once, run everywhere
- **Automatic fallback** to WebGL 2

### DPR (Device Pixel Ratio)

| Device | Typical DPR | Recommended Max |
|--------|-------------|-----------------|
| Desktop | 1-2 | 2 |
| Mobile | 2-3 | 1.5 |
| High-end mobile | 3+ | 1.5-2 |

Higher DPR = sharper image but exponentially more pixels to render.

---

## EXAMPLES

### Complete Scene Setup (Vanilla)

```typescript
import { 
  Scene, 
  PerspectiveCamera, 
  WebGPURenderer,
  Color,
  AmbientLight,
  DirectionalLight
} from 'three'

class ThreeApp {
  scene: Scene
  camera: PerspectiveCamera
  renderer: WebGPURenderer
  
  constructor(container: HTMLElement) {
    // Scene
    this.scene = new Scene()
    this.scene.background = new Color(0x111111)
    
    // Camera
    this.camera = new PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 5)
    
    // Renderer
    this.renderer = new WebGPURenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    this.renderer.setSize(container.clientWidth, container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = PCFSoftShadowMap
    
    container.appendChild(this.renderer.domElement)
    
    // Lights
    const ambient = new AmbientLight(0xffffff, 0.5)
    this.scene.add(ambient)
    
    const directional = new DirectionalLight(0xffffff, 1)
    directional.position.set(5, 5, 5)
    directional.castShadow = true
    this.scene.add(directional)
    
    // Events
    window.addEventListener('resize', this.onResize)
    
    // Start loop
    this.animate()
  }
  
  onResize = () => {
    const container = this.renderer.domElement.parentElement!
    this.camera.aspect = container.clientWidth / container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(container.clientWidth, container.clientHeight)
  }
  
  animate = () => {
    requestAnimationFrame(this.animate)
    this.renderer.render(this.scene, this.camera)
  }
  
  dispose() {
    window.removeEventListener('resize', this.onResize)
    this.renderer.dispose()
  }
}
```

### R3F Complete Setup

```tsx
// components/Scene.tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  PerformanceMonitor 
} from '@react-three/drei'
import { useState } from 'react'

export function Scene() {
  const [dpr, setDpr] = useState(1.5)
  
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ 
        powerPreference: 'high-performance',
        antialias: true,
        alpha: true
      }}
      dpr={dpr}
    >
      <PerformanceMonitor
        onDecline={() => setDpr(1)}
        onIncline={() => setDpr(1.5)}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
      />
      
      <mesh castShadow receiveShadow>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      
      <OrbitControls enableZoom={false} />
      <Environment preset="city" />
    </Canvas>
  )
}
```

### Dynamic DPR with Performance Monitor

```tsx
import { PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'

function AdaptiveScene() {
  const [dpr, setDpr] = useState(1.5)
  const [effectsEnabled, setEffectsEnabled] = useState(true)
  
  return (
    <Canvas dpr={dpr}>
      <PerformanceMonitor
        bounds={() => [30, 60]} // FPS bounds
        flipflops={2} // Changes before fallback
        onDecline={() => {
          // Reduce quality when FPS drops
          setDpr(prev => Math.max(1, prev * 0.8))
          setEffectsEnabled(false)
        }}
        onIncline={() => {
          // Increase quality when FPS improves
          setDpr(prev => Math.min(2, prev * 1.1))
          setEffectsEnabled(true)
        }}
        onFallback={() => {
          // Last resort: disable expensive features
          console.warn('Performance fallback triggered')
        }}
      >
        {/* Scene content */}
      </PerformanceMonitor>
    </Canvas>
  )
}
```

### Multiple Viewports

```tsx
import { View } from '@react-three/drei'

function MultiView() {
  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="relative">
        <View className="absolute inset-0">
          <Camera position={[0, 0, 5]} />
          <SceneContent />
        </View>
      </div>
      <div className="relative">
        <View className="absolute inset-0">
          <Camera position={[5, 5, 5]} />
          <SceneContent />
        </View>
      </div>
    </div>
  )
}
```

---

## Camera Types

### PerspectiveCamera (Most Common)
```tsx
<PerspectiveCamera
  makeDefault
  position={[0, 0, 5]}
  fov={45}
  near={0.1}
  far={1000}
/>
```

### OrthographicCamera (2D/Isometric)
```tsx
<OrthographicCamera
  makeDefault
  position={[0, 0, 5]}
  zoom={1}
  near={0.1}
  far={1000}
/>
```

### Camera Controls
```tsx
import { 
  OrbitControls,      // Rotate/zoom/pan
  FlyControls,        // Flight simulator style
  FirstPersonControls, // FPS style
  TrackballControls   // Google Earth style
} from '@react-three/drei'

<OrbitControls
  enableZoom={true}
  enablePan={true}
  enableRotate={true}
  minDistance={2}
  maxDistance={10}
  minPolarAngle={0}
  maxPolarAngle={Math.PI / 2}
/>
```

---

## Related Assets

- [Base Scene Template](../assets/scenes/base-scene.tsx)
- [WebGPU Setup](../assets/scenes/webgpu-setup.ts)
- [Camera Controller](../assets/components/camera-controller.tsx)
