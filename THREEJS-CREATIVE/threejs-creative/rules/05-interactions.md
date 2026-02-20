---
name: interactions
description: Raycaster, mouse events, hover states, and click handlers in 3D space.
version: 4.0.0
---

# Interactions - 3D Event Handling

> Make your 3D scenes interactive with raycasting and event handling.

---

## MUST

### 1. Use R3F Event Handlers

**✅ CORRECT:**
```tsx
<mesh
  onClick={(e) => console.log('Clicked!', e.object)}
  onPointerOver={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
  }}
>
  <boxGeometry />
  <meshStandardMaterial color="orange" />
</mesh>
```

### 2. Stop Event Propagation

**✅ CORRECT:**
```tsx
<mesh
  onPointerOver={(e) => {
    e.stopPropagation() // ✅ Prevents bubbling to parent
    setHovered(true)
  }}
>
```

### 3. Use three-mesh-bvh for Fast Raycasting

**✅ CORRECT:**
```tsx
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'

// Build BVH for fast raycasting
mesh.geometry.boundsTree = new MeshBVH(mesh.geometry)
mesh.raycast = acceleratedRaycast
```

---

## FORBIDDEN

### 1. Never Raycast Against Complex Geometry Without BVH

**❌ FORBIDDEN:**
```tsx
// ❌ 80,000+ polygons without BVH = slow raycasting
const mesh = new Mesh(complexGeometry, material)
```

**✅ CORRECT:**
```tsx
// ✅ BVH enables 60fps raycasting against 80K+ polygons
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh'

mesh.geometry.boundsTree = new MeshBVH(mesh.geometry)
mesh.raycast = acceleratedRaycast
```

### 2. Never Forget to Reset Cursor

**❌ FORBIDDEN:**
```tsx
<mesh
  onPointerOver={() => document.body.style.cursor = 'pointer'}
  // ❌ No onPointerOut to reset!
/>
```

**✅ CORRECT:**
```tsx
<mesh
  onPointerOver={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
  }}
/>
```

---

## WHY

### Raycasting Performance

| Method | Polygons @ 60fps | Use Case |
|--------|------------------|----------|
| Default | ~10,000 | Simple scenes |
| MeshBVH | 80,000+ | Complex models |

### Event Types in R3F

| Event | Trigger |
|-------|---------|
| `onClick` | Pointer down + up on same object |
| `onPointerDown` | Pointer pressed |
| `onPointerUp` | Pointer released |
| `onPointerOver` | Pointer enters object |
| `onPointerOut` | Pointer leaves object |
| `onPointerMove` | Pointer moves over object |
| `onDoubleClick` | Double click |
| `onContextMenu` | Right click |

---

## EXAMPLES

### Hover Effect

```tsx
function HoverMesh() {
  const [hovered, setHovered] = useState(false)
  
  return (
    <mesh
      scale={hovered ? 1.2 : 1}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={(e) => {
        e.stopPropagation()
        setHovered(false)
        document.body.style.cursor = 'auto'
      }}
    >
      <boxGeometry />
      <meshStandardMaterial 
        color={hovered ? 'hotpink' : 'orange'} 
      />
    </mesh>
  )
}
```

### Click Handler with Animation

```tsx
import { useSpring, animated } from '@react-spring/three'

function ClickableMesh() {
  const [active, setActive] = useState(false)
  
  const { scale, color } = useSpring({
    scale: active ? 1.5 : 1,
    color: active ? '#ff6b6b' : '#4ecdc4',
    config: { tension: 300, friction: 10 }
  })
  
  return (
    <animated.mesh
      scale={scale}
      onClick={() => setActive(!active)}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'auto'}
    >
      <sphereGeometry />
      <animated.meshStandardMaterial color={color} />
    </animated.mesh>
  )
}
```

### Raycaster Hook

```tsx
import { useThree } from '@react-three/fiber'
import { Raycaster, Vector2 } from 'three'

function useRaycaster() {
  const { camera, scene } = useThree()
  const raycaster = useMemo(() => new Raycaster(), [])
  const mouse = useMemo(() => new Vector2(), [])
  
  const raycast = useCallback((clientX: number, clientY: number) => {
    mouse.x = (clientX / window.innerWidth) * 2 - 1
    mouse.y = -(clientY / window.innerHeight) * 2 + 1
    
    raycaster.setFromCamera(mouse, camera)
    return raycaster.intersectObjects(scene.children, true)
  }, [camera, scene, raycaster, mouse])
  
  return raycast
}

// Usage
function Component() {
  const raycast = useRaycaster()
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const intersects = raycast(e.clientX, e.clientY)
      if (intersects.length > 0) {
        console.log('Hit:', intersects[0].object)
      }
    }
    
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [raycast])
}
```

### Drag Controls

```tsx
import { useState, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

function DraggableMesh() {
  const meshRef = useRef<Mesh>(null)
  const [isDragging, setIsDragging] = useState(false)
  const { camera, gl } = useThree()
  
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsDragging(true)
    gl.domElement.setPointerCapture(e.pointerId)
  }
  
  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setIsDragging(false)
    gl.domElement.releasePointerCapture(e.pointerId)
  }
  
  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !meshRef.current) return
    
    e.stopPropagation()
    
    // Move on plane facing camera
    const planeNormal = new Vector3(0, 0, 1).applyQuaternion(camera.quaternion)
    const planeConstant = -meshRef.current.position.dot(planeNormal)
    const target = new Vector3()
    
    e.ray.intersectPlane(
      new Plane(planeNormal, planeConstant),
      target
    )
    
    if (target) {
      meshRef.current.position.copy(target)
    }
  }
  
  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <boxGeometry />
      <meshStandardMaterial 
        color={isDragging ? 'hotpink' : 'orange'}
      />
    </mesh>
  )
}
```

### Multiple Selectable Objects

```tsx
function SelectableObjects({ count = 10 }) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  
  const toggleSelection = (index: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }
  
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <mesh
          key={i}
          position={[i * 1.5 - count * 0.75, 0, 0]}
          onClick={(e) => {
            e.stopPropagation()
            toggleSelection(i)
          }}
          onPointerOver={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            document.body.style.cursor = 'auto'
          }}
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial
            color={selected.has(i) ? '#ff6b6b' : '#4ecdc4'}
            emissive={selected.has(i) ? '#ff0000' : '#000000'}
            emissiveIntensity={selected.has(i) ? 0.5 : 0}
          />
        </mesh>
      ))}
    </>
  )
}
```

---

## Related Assets

- [useRaycaster Hook](../assets/hooks/use-raycaster.ts)
- [Draggable Component](../assets/components/draggable.tsx)
- [Selectable Group](../assets/components/selectable-group.tsx)
