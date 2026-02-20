---
name: react-three-fiber
description: React Three Fiber patterns, Drei utilities, hooks, and best practices.
version: 4.0.0
---

# React Three Fiber - React Integration

> Build 3D scenes with React's component model. Understand the rules to avoid performance pitfalls.

---

## MUST

### 1. Use `frameloop="demand"` for Static Scenes

**✅ CORRECT:**
```tsx
// ✅ Only render when needed
<Canvas frameloop="demand">
  <StaticScene />
</Canvas>

// Trigger re-render when needed
const invalidate = useThree(state => state.invalidate)
<button onClick={() => invalidate()}>Update</button>
```

### 2. Preload Assets

**✅ CORRECT:**
```tsx
// Preload models
useGLTF.preload('/model.glb')

// Preload textures
useTexture.preload('/texture.jpg')

// In component
const { scene } = useGLTF('/model.glb')
```

### 3. Wrap Expensive Components in React.memo

**✅ CORRECT:**
```tsx
const ExpensiveModel = React.memo(({ url }) => {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
})
```

### 4. Toggle Visibility Instead of Remounting

**✅ CORRECT:**
```tsx
// ✅ Visibility toggle (fast)
<Model visible={showModel} />

// ❌ Remounting (slow - recreates buffers)
{showModel && <Model />}
```

---

## FORBIDDEN

### 1. Never Create Objects in Render

**❌ FORBIDDEN:**
```tsx
function BadComponent() {
  // ❌ New geometry every render!
  const geometry = new BoxGeometry()
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial />
    </mesh>
  )
}
```

**✅ CORRECT:**
```tsx
function GoodComponent() {
  // ✅ Created once
  const geometry = useMemo(() => new BoxGeometry(), [])
  
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial />
    </mesh>
  )
}

// ✅ Or use JSX (R3F handles it)
function BestComponent() {
  return (
    <mesh>
      <boxGeometry /> {/* R3F creates once */}
      <meshStandardMaterial />
    </mesh>
  )
}
```

### 2. Never Use setState in useFrame

**❌ FORBIDDEN:**
```tsx
useFrame(() => {
  // ❌ Triggers re-render every frame!
  setRotation(r => r + 0.01)
})
```

**✅ CORRECT:**
```tsx
const meshRef = useRef<Mesh>(null)

useFrame((state, delta) => {
  // ✅ Direct mutation, no re-render
  meshRef.current.rotation.y += delta
})

return <mesh ref={meshRef} />
```

### 3. Never Forget Suspense for Async Assets

**❌ FORBIDDEN:**
```tsx
// ❌ No loading state
function Scene() {
  const { scene } = useGLTF('/model.glb') // Suspends!
  return <primitive object={scene} />
}
```

**✅ CORRECT:**
```tsx
// ✅ Proper loading state
function Scene() {
  return (
    <Suspense fallback={<Loader />}>
      <Model />
    </Suspense>
  )
}

function Model() {
  const { scene } = useGLTF('/model.glb')
  return <primitive object={scene} />
}
```

---

## WHY

### R3F vs Vanilla Three.js

| Feature | Vanilla | R3F |
|---------|---------|-----|
| Setup | Manual | Automatic |
| Resize handling | Manual | Automatic |
| Disposal | Manual | Automatic (mostly) |
| React integration | None | Native |
| Re-renders | N/A | Can be problematic |

### Drei Utilities

| Component | Purpose |
|-----------|---------|
| `<OrbitControls />` | Camera controls |
| `<Environment />` | HDRI lighting |
| `<ContactShadows />` | Fake ground shadows |
| `<Html />` | HTML in 3D |
| `<Text />` | 3D text |
| `<useGLTF />` | Model loading |
| `<useTexture />` | Texture loading |
| `<Stats />` | Performance stats |

---

## EXAMPLES

### Complete R3F Scene

```tsx
'use client'

import { Canvas } from '@react-three/fiber'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerspectiveCamera 
} from '@react-three/drei'
import { Suspense } from 'react'

export function App() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

function Scene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
      <OrbitControls enablePan={false} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1}
        castShadow
        shadow-mapSize={2048}
      />
      <Environment preset="city" />
      
      {/* Ground */}
      <ContactShadows
        position={[0, -1, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
      />
      
      {/* Objects */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  )
}
```

### Custom Hook

```tsx
import { useThree, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function useFollowCamera(target: React.RefObject<Object3D>, lerp = 0.1) {
  const { camera } = useThree()
  const currentPos = useRef(new Vector3())
  
  useFrame(() => {
    if (!target.current) return
    
    target.current.getWorldPosition(currentPos.current)
    camera.position.lerp(
      currentPos.current.clone().add(new Vector3(0, 5, 10)),
      lerp
    )
    camera.lookAt(currentPos.current)
  })
}

// Usage
function FollowCamera({ target }) {
  useFollowCamera(target)
  return null
}
```

### useThree Hook

```tsx
import { useThree } from '@react-three/fiber'

function SomeComponent() {
  const {
    gl,        // WebGLRenderer
    scene,     // Scene
    camera,    // Camera
    raycaster, // Raycaster
    size,      // Canvas size { width, height }
    viewport,  // Viewport { width, height, factor }
    clock,     // Clock
    invalidate // Trigger re-render
  } = useThree()
  
  // Use these values...
}
```

### Html Overlay

```tsx
import { Html } from '@react-three/drei'

function AnnotatedMesh() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
      
      <Html
        position={[0, 1, 0]}
        center
        distanceFactor={10}
        occlude
      >
        <div className="bg-white px-4 py-2 rounded shadow">
          <h3>Important Point</h3>
          <p>Description here</p>
        </div>
      </Html>
    </mesh>
  )
}
```

### Text in 3D

```tsx
import { Text } from '@react-three/drei'

function ThreeDText() {
  return (
    <Text
      position={[0, 0, 0]}
      fontSize={1}
      color="black"
      anchorX="center"
      anchorY="middle"
      font="/fonts/Inter-Bold.woff"
    >
      Hello 3D!
    </Text>
  )
}
```

---

## Related Assets

- [R3F Scene Template](../assets/scenes/r3f-template.tsx)
- [Custom Hooks](../assets/hooks/r3f-hooks.ts)
- [Drei Components](../assets/components/drei-wrappers.tsx)
