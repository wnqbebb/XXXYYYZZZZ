---
name: geometries-materials
description: Geometries, Materials, and Textures. Optimization with Draco, KTX2 compression.
version: 4.0.0
---

# Geometries & Materials - 3D Assets

> Efficient geometry and material usage is critical for performance. Understand when to use each type.

---

## MUST

### 1. Dispose Geometries and Materials When Done

**✅ CORRECT:**
```tsx
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture?.dispose()
  }
}, [])
```

### 2. Use Compressed Textures (KTX2)

**✅ CORRECT:**
```bash
# Compress textures with gltf-transform
gltf-transform uastc model.glb optimized.glb
```

```tsx
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js'

const ktx2Loader = new KTX2Loader()
ktx2Loader.setTranscoderPath('/basis/')

const texture = await ktx2Loader.loadAsync('/texture.ktx2')
```

### 3. Share Materials Between Meshes

**✅ CORRECT:**
```tsx
// ✅ One material, many meshes
const sharedMaterial = new MeshStandardMaterial({ color: 'red' })

meshes.forEach(mesh => {
  mesh.material = sharedMaterial
})
```

**❌ AVOID:**
```tsx
// ❌ New material per mesh = performance killer
meshes.forEach(mesh => {
  mesh.material = new MeshStandardMaterial({ color: 'red' })
})
```

### 4. Use InstancedMesh for Repeated Objects

**✅ CORRECT:**
```tsx
import { InstancedMesh } from 'three'

const count = 1000
const mesh = new InstancedMesh(geometry, material, count)

const dummy = new Object3D()
for (let i = 0; i < count; i++) {
  dummy.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  )
  dummy.updateMatrix()
  mesh.setMatrixAt(i, dummy.matrix)
}

scene.add(mesh)
```

---

## FORBIDDEN

### 1. Never Load Unoptimized Models

**❌ FORBIDDEN:**
```bash
# ❌ 50MB+ GLB files
model.glb  # 52MB
```

**✅ CORRECT:**
```bash
# ✅ Compress with Draco
gltf-transform draco model.glb compressed.glb --method edgebreaker
# Result: ~2-5MB (90-95% reduction)
```

### 2. Never Use PNG/JPEG for Textures in Production

**❌ FORBIDDEN:**
```tsx
// ❌ PNG expands fully in GPU memory
const texture = new TextureLoader().load('/texture.png')
// 200KB PNG = 20MB+ VRAM
```

**✅ CORRECT:**
```bash
# ✅ KTX2 stays compressed on GPU
gltf-transform uastc model.glb optimized.glb
# ~10x memory reduction
```

### 3. Never Forget to Update Matrix After Changes

**❌ FORBIDDEN:**
```tsx
mesh.position.set(1, 2, 3)
// ❌ Missing updateMatrix()
instancedMesh.setMatrixAt(index, mesh.matrix)
```

**✅ CORRECT:**
```tsx
mesh.position.set(1, 2, 3)
mesh.updateMatrix() // ✅ Required!
instancedMesh.setMatrixAt(index, mesh.matrix)
instancedMesh.instanceMatrix.needsUpdate = true
```

---

## WHY

### Texture Compression Comparison

| Format | File Size | GPU Memory | Quality |
|--------|-----------|------------|---------|
| PNG | 200KB | 20MB | Lossless |
| JPEG | 100KB | 20MB | Lossy |
| KTX2/ETC1S | 150KB | 2MB | Good |
| KTX2/UASTC | 300KB | 2MB | Excellent |

### Material Performance

| Material | Cost | Use Case |
|----------|------|----------|
| MeshBasic | ⭐ | Unlit, UI, particles |
| MeshLambert | ⭐⭐ | Simple lighting, mobile |
| MeshPhong | ⭐⭐⭐ | Specular highlights |
| MeshStandard | ⭐⭐⭐⭐ | PBR, most common |
| MeshPhysical | ⭐⭐⭐⭐⭐ | Glass, clearcoat, transmission |

---

## EXAMPLES

### Loading GLTF/GLB Models

```tsx
import { useGLTF } from '@react-three/drei'

function Model({ url }) {
  const { scene } = useGLTF(url)
  
  return <primitive object={scene} />
}

// Preload for better UX
useGLTF.preload('/model.glb')
```

### With Draco Compression

```tsx
import { useGLTF } from '@react-three/drei'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

useGLTF.setDRACOLoader(dracoLoader)

function Model({ url }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} />
}
```

### Complete Material Setup

```tsx
import { 
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  SRGBColorSpace
} from 'three'

function createPBRMaterial() {
  const loader = new TextureLoader()
  
  // Load textures
  const albedo = loader.load('/textures/albedo.jpg')
  albedo.colorSpace = SRGBColorSpace
  
  const normal = loader.load('/textures/normal.jpg')
  const roughness = loader.load('/textures/roughness.jpg')
  const metalness = loader.load('/textures/metalness.jpg')
  
  // Configure wrapping
  albedo.wrapS = albedo.wrapT = RepeatWrapping
  normal.wrapS = normal.wrapT = RepeatWrapping
  
  // Create material
  const material = new MeshStandardMaterial({
    map: albedo,
    normalMap: normal,
    roughnessMap: roughness,
    metalnessMap: metalness,
    roughness: 0.5,
    metalness: 0.5,
  })
  
  return material
}
```

### R3F Material with Drei

```tsx
import { useTexture } from '@react-three/drei'

function TexturedMesh() {
  const textures = useTexture({
    map: '/textures/albedo.jpg',
    normalMap: '/textures/normal.jpg',
    roughnessMap: '/textures/roughness.jpg',
  })
  
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial {...textures} />
    </mesh>
  )
}

// Preload
useTexture.preload('/textures/albedo.jpg')
```

### InstancedMesh with Colors

```tsx
import { InstancedMesh, Color } from 'three'

function ColoredInstances({ count = 1000 }) {
  const meshRef = useRef<InstancedMesh>(null)
  const colors = useMemo(() => {
    return Array.from({ length: count }, () => 
      new Color().setHSL(Math.random(), 0.8, 0.5)
    )
  }, [count])
  
  useEffect(() => {
    if (!meshRef.current) return
    
    const dummy = new Object3D()
    
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      )
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
      meshRef.current.setColorAt(i, colors[i])
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
    meshRef.current.instanceColor.needsUpdate = true
  }, [count, colors])
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial />
    </instancedMesh>
  )
}
```

### Dynamic InstancedMesh Updates

```tsx
function AnimatedInstances({ count = 100 }) {
  const meshRef = useRef<InstancedMesh>(null)
  const dummy = useMemo(() => new Object3D(), [])
  
  useFrame((state) => {
    if (!meshRef.current) return
    
    const time = state.clock.elapsedTime
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + time * 0.5
      const radius = 3
      
      dummy.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle * 2) * 0.5,
        Math.sin(angle) * radius
      )
      dummy.rotation.set(
        time * 0.5,
        time * 0.3,
        0
      )
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="hotpink" />
    </instancedMesh>
  )
}
```

---

## Geometry Types Reference

| Geometry | Use Case | Performance |
|----------|----------|-------------|
| `BoxGeometry` | Cubes, walls, UI | ⭐ Fast |
| `SphereGeometry` | Balls, planets | ⭐⭐ Moderate |
| `PlaneGeometry` | Ground, UI panels | ⭐ Fast |
| `CylinderGeometry` | Columns, barrels | ⭐⭐ Moderate |
| `TorusGeometry` | Rings, tubes | ⭐⭐ Moderate |
| `ConeGeometry` | Trees, spikes | ⭐⭐ Moderate |
| `BufferGeometry` | Custom meshes | Depends on complexity |

---

## Related Assets

- [InstancedMesh Component](../assets/components/instanced-mesh.tsx)
- [GLTF Loader Hook](../assets/hooks/use-gltf-loader.ts)
- [Material Library](../assets/utils/materials.ts)
