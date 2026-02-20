---
name: animations-loop
description: Animation loop, useFrame, GSAP integration, and frame-rate independent animations.
version: 4.0.0
---

# Animations & Loop - Motion Architecture

> Smooth animations require proper timing and frame-rate independence.

---

## MUST

### 1. Use Delta Time for Frame-Rate Independence

**✅ CORRECT:**
```tsx
useFrame((state, delta) => {
  // ✅ Consistent speed regardless of frame rate
  mesh.rotation.y += delta * 2 // 2 radians per second
})
```

**❌ AVOID:**
```tsx
useFrame(() => {
  // ❌ Speed varies with frame rate
  mesh.rotation.y += 0.02
})
```

### 2. Mutate Refs in useFrame, Never setState

**✅ CORRECT:**
```tsx
const meshRef = useRef<Mesh>(null)

useFrame((state, delta) => {
  // ✅ Direct mutation - no re-render
  if (meshRef.current) {
    meshRef.current.rotation.y += delta
  }
})

return <mesh ref={meshRef} />
```

**❌ FORBIDDEN:**
```tsx
const [rotation, setRotation] = useState(0)

useFrame((state, delta) => {
  // ❌ Triggers React re-render every frame!
  setRotation(r => r + delta)
})

return <mesh rotation-y={rotation} />
```

### 3. Use `setAnimationLoop` for Clean Control

**✅ CORRECT:**
```tsx
// ✅ Clean start/stop control
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera)
})

// Stop when needed
renderer.setAnimationLoop(null)
```

---

## FORBIDDEN

### 1. Never Create Objects Inside useFrame

**❌ FORBIDDEN:**
```tsx
useFrame(() => {
  // ❌ Creates new Vector3 every frame = GC pressure
  mesh.position.copy(new Vector3(1, 2, 3))
})
```

**✅ CORRECT:**
```tsx
// ✅ Reuse vector
const targetPos = useMemo(() => new Vector3(1, 2, 3), [])

useFrame(() => {
  mesh.position.copy(targetPos)
})
```

### 2. Never Use setInterval for Animations

**❌ FORBIDDEN:**
```tsx
// ❌ Out of sync with render loop
setInterval(() => {
  mesh.rotation.y += 0.1
}, 16)
```

**✅ CORRECT:**
```tsx
// ✅ Synchronized with render
useFrame((state, delta) => {
  mesh.rotation.y += delta * 6
})
```

### 3. Never Forget to Stop Animation on Unmount

**❌ FORBIDDEN:**
```tsx
useEffect(() => {
  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  // ❌ No cleanup!
}, [])
```

**✅ CORRECT:**
```tsx
useEffect(() => {
  let animationId: number
  
  function animate() {
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
  
  // ✅ Cleanup
  return () => cancelAnimationFrame(animationId)
}, [])
```

---

## WHY

### Frame Rate Independence

| Device | FPS | Delta (ms) | Fixed Increment Issue |
|--------|-----|------------|----------------------|
| 60Hz | 60 | 16.67 | Normal speed |
| 120Hz | 120 | 8.33 | 2x speed! |
| 30Hz | 30 | 33.33 | 0.5x speed |

Using `delta` ensures consistent animation speed across all devices.

### Performance Comparison

| Approach | Cost | Use Case |
|----------|------|----------|
| useFrame + ref mutation | ⭐ Minimal | Most animations |
| useFrame + setState | ⭐⭐⭐⭐⭐ Expensive | Never use |
| GSAP + ref | ⭐⭐ Low | Complex timelines |
| Framer Motion | ⭐⭐⭐ Moderate | React-native feel |

---

## EXAMPLES

### Basic Rotation Animation

```tsx
function RotatingCube() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += delta * 0.5
    meshRef.current.rotation.y += delta
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
```

### Floating Animation

```tsx
function FloatingMesh() {
  const meshRef = useRef<Mesh>(null)
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    // Sine wave for smooth floating
    meshRef.current.position.y = 
      Math.sin(state.clock.elapsedTime * 2) * 0.3
    
    // Gentle rotation
    meshRef.current.rotation.y = 
      Math.sin(state.clock.elapsedTime * 0.5) * 0.1
  })
  
  return (
    <mesh ref={meshRef}>
      <sphereGeometry />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}
```

### GSAP Integration

```tsx
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function GSAPMesh() {
  const meshRef = useRef<Mesh>(null)
  
  useGSAP(() => {
    if (!meshRef.current) return
    
    // Rotation animation
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      duration: 4,
      repeat: -1,
      ease: 'none'
    })
    
    // Scale pulse
    gsap.to(meshRef.current.scale, {
      x: 1.2,
      y: 1.2,
      z: 1.2,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
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

### Scroll-Triggered Animation

```tsx
import { useScroll } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

function ScrollAnimatedMesh() {
  const meshRef = useRef<Mesh>(null)
  const scroll = useScroll()
  
  useFrame(() => {
    if (!meshRef.current) return
    
    // Rotate based on scroll position (0 to 1)
    meshRef.current.rotation.y = scroll.offset * Math.PI * 4
    
    // Move up as we scroll
    meshRef.current.position.y = scroll.offset * 5
  })
  
  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  )
}

// In parent component
import { ScrollControls } from '@react-three/drei'

<ScrollControls pages={3}>
  <ScrollAnimatedMesh />
</ScrollControls>
```

### Spring Physics Animation

```tsx
import { useSpring, animated } from '@react-spring/three'

function SpringMesh() {
  const [active, setActive] = useState(false)
  
  const { scale, color } = useSpring({
    scale: active ? 1.5 : 1,
    color: active ? 'hotpink' : 'royalblue',
    config: { mass: 1, tension: 170, friction: 26 }
  })
  
  return (
    <animated.mesh
      scale={scale}
      onClick={() => setActive(!active)}
    >
      <boxGeometry />
      <animated.meshStandardMaterial color={color} />
    </animated.mesh>
  )
}
```

### Staggered Animation

```tsx
function StaggeredCubes({ count = 10 }) {
  const groupRef = useRef<Group>(null)
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    groupRef.current.children.forEach((child, i) => {
      const offset = i * 0.1
      child.position.y = Math.sin(state.clock.elapsedTime + offset) * 0.5
      child.rotation.x = state.clock.elapsedTime + offset
    })
  })
  
  return (
    <group ref={groupRef}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[i * 1.5 - count * 0.75, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={`hsl(${i * 36}, 70%, 50%)`} />
        </mesh>
      ))}
    </group>
  )
}
```

---

## Related Assets

- [Animation Hooks](../assets/hooks/use-animation.ts)
- [GSAP Integration](../assets/utils/gsap-setup.ts)
- [Spring Configs](../assets/utils/spring-configs.ts)
