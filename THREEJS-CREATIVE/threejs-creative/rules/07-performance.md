---
name: performance
description: Performance optimization, WebGPU, instancing, LOD, draw call reduction, memory management.
version: 4.0.0
---

# Performance - Optimization Mastery

> Performance is not an afterthought. Build it in from the start.

---

## MUST

### 1. Target Under 100 Draw Calls

**✅ CORRECT:**
```tsx
// Monitor draw calls
setInterval(() => {
  console.log('Draw calls:', renderer.info.render.calls)
}, 1000)
```

### 2. Use InstancedMesh for Repeated Objects

**✅ CORRECT:**
```tsx
// 1 draw call for 1000 objects
const mesh = new InstancedMesh(geometry, material, 1000)
```

### 3. Implement LOD (Level of Detail)

**✅ CORRECT:**
```tsx
import { Detailed } from '@react-three/drei'

<Detailed distances={[0, 50, 100]}>
  <HighPolyModel />   {/* Distance 0-50 */}
  <MediumPolyModel /> {/* Distance 50-100 */}
  <LowPolyModel />    {/* Distance 100+ */}
</Detailed>
```

### 4. Compress Assets with Draco and KTX2

**✅ CORRECT:**
```bash
# Draco for geometry
gltf-transform draco model.glb compressed.glb

# KTX2 for textures
gltf-transform uastc model.glb optimized.glb

# Full pipeline
gltf-transform optimize model.glb output.glb \
  --texture-compress ktx2 \
  --compress draco
```

### 5. Dispose Resources on Unmount

**✅ CORRECT:**
```tsx
useEffect(() => {
  return () => {
    geometry.dispose()
    material.dispose()
    texture.dispose()
    renderer.dispose()
  }
}, [])
```

---

## FORBIDDEN

### 1. Never Render at Full Resolution on Mobile

**❌ FORBIDDEN:**
```tsx
// ❌ 3x DPR on mobile = slideshow
<Canvas dpr={window.devicePixelRatio} />
```

**✅ CORRECT:**
```tsx
// ✅ Cap DPR for performance
const dpr = Math.min(
  isMobile ? 1.5 : 2,
  window.devicePixelRatio
)
<Canvas dpr={dpr} />
```

### 2. Never Forget Frustum Culling

**❌ FORBIDDEN:**
```tsx
// ❌ Objects behind camera still render
mesh.frustumCulled = false
```

**✅ CORRECT:**
```tsx
// ✅ Let Three.js cull invisible objects (default)
mesh.frustumCulled = true
```

### 3. Never Create New Materials Per Mesh

**❌ FORBIDDEN:**
```tsx
// ❌ 1000 materials = 1000 shader compilations
meshes.forEach(() => {
  const material = new MeshStandardMaterial({ color: 'red' })
})
```

**✅ CORRECT:**
```tsx
// ✅ 1 material shared = 1 shader compilation
const material = new MeshStandardMaterial({ color: 'red' })
meshes.forEach(mesh => {
  mesh.material = material
})
```

---

## WHY

### Draw Call Impact

| Draw Calls | Performance |
|------------|-------------|
| < 50 | Excellent |
| 50-100 | Good |
| 100-300 | Acceptable |
| 300-500 | Poor |
| > 500 | Slideshow |

### Memory Management

```tsx
// Always dispose:
geometry.dispose()     // Vertex buffers
material.dispose()     // Shader programs
texture.dispose()      // GPU textures
renderTarget.dispose() // Framebuffers

// For GLTF ImageBitmap textures:
texture.source.data.close?.()
texture.dispose()
```

---

## EXAMPLES

### Performance Monitor

```tsx
import { Perf } from 'r3f-perf'

<Canvas>
  <Perf 
    position="top-left"
    minimal
    matrixUpdate
    deepAnalyze
  />
  <Scene />
</Canvas>
```

### stats-gl Integration

```tsx
import Stats from 'stats-gl'

const stats = new Stats({
  trackGPU: true,
  trackHz: true
})
document.body.appendChild(stats.dom)

function animate() {
  stats.begin()
  renderer.render(scene, camera)
  stats.end()
  requestAnimationFrame(animate)
}
```

### Object Pooling

```tsx
class ObjectPool<T> {
  private pool: T[] = []
  private active: Set<T> = new Set()
  
  constructor(
    private factory: () => T,
    private reset: (obj: T) => void,
    initialSize = 20
  ) {
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory())
    }
  }
  
  acquire(): T {
    const obj = this.pool.pop() || this.factory()
    this.active.add(obj)
    return obj
  }
  
  release(obj: T): void {
    if (this.active.has(obj)) {
      this.reset(obj)
      this.active.delete(obj)
      this.pool.push(obj)
    }
  }
}

// Usage
const bulletPool = new ObjectPool(
  () => new Mesh(bulletGeometry, bulletMaterial),
  (bullet) => bullet.position.set(0, 0, 0),
  50
)
```

### BatchedMesh (Three.js r156+)

```tsx
import { BatchedMesh } from 'three'

// Combine multiple geometries into one draw call
const batchedMesh = new BatchedMesh(
  maxGeometryCount,
  maxVertexCount,
  maxIndexCount,
  material
)

// Add geometries
const geometryId1 = batchedMesh.addGeometry(geometry1)
const geometryId2 = batchedMesh.addGeometry(geometry2)

// Add instances
const instanceId1 = batchedMesh.addInstance(geometryId1)
const instanceId2 = batchedMesh.addInstance(geometryId2)
```

### Texture Atlas

```tsx
// Combine multiple textures into one atlas
const atlasTexture = textureLoader.load('/atlas.png')

// Update UVs to sample from atlas
const uvs = geometry.attributes.uv.array
for (let i = 0; i < uvs.length; i += 2) {
  uvs[i] = uvs[i] * 0.5 + atlasOffsetX
  uvs[i + 1] = uvs[i + 1] * 0.5 + atlasOffsetY
}
```

---

## Related Assets

- [Performance Monitor](../assets/components/perf-monitor.tsx)
- [Object Pool](../assets/utils/object-pool.ts)
- [LOD Component](../assets/components/lod-wrapper.tsx)
