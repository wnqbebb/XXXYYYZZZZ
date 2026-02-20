---
name: lighting
description: Lights, Shadows, Environment maps, and baked lighting strategies.
version: 4.0.0
---

# Lighting - Illumination Architecture

> Lighting sets the mood and realism. Do it efficiently or pay the performance price.

---

## MUST

### 1. Limit Active Lights to 3 or Fewer

**✅ CORRECT:**
```tsx
// ✅ Maximum 3 lights for good performance
<Canvas>
  <ambientLight intensity={0.5} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
  <pointLight position={[-10, -10, -10]} intensity={0.5} />
</Canvas>
```

### 2. Use Environment Maps for Ambient Light

**✅ CORRECT:**
```tsx
import { Environment } from '@react-three/drei'

<Environment
  files="/hdris/studio.hdr"
  ground={{ height: 50, radius: 150 }}
/>

// Or use presets
<Environment preset="city" />
<Environment preset="sunset" />
<Environment preset="dawn" />
<Environment preset="night" />
<Environment preset="warehouse" />
<Environment preset="forest" />
<Environment preset="apartment" />
```

### 3. Bake Lighting for Static Scenes

**✅ CORRECT:**
```tsx
// Use @react-three/lightmap for runtime baking
import { Lightmap } from '@react-three/lightmap'

<Lightmap>
  <StaticScene />
</Lightmap>
```

### 4. Configure Shadow Maps Properly

**✅ CORRECT:**
```tsx
<Canvas
  shadows
  gl={{ shadowMap: { type: PCFSoftShadowMap } }}
>
  <directionalLight
    castShadow
    shadow-mapSize={[2048, 2048]} // Desktop: 2048, Mobile: 1024
    shadow-camera-near={0.1}
    shadow-camera-far={50}
    shadow-camera-left={-10}
    shadow-camera-right={10}
    shadow-camera-top={10}
    shadow-camera-bottom={-10}
    shadow-bias={-0.001}
  />
</Canvas>
```

---

## FORBIDDEN

### 1. Never Use PointLight Shadows Without Caution

**❌ FORBIDDEN:**
```tsx
// ❌ PointLight shadows = 6 renders per light!
<pointLight castShadow intensity={1} />
// 10 objects × 6 faces × 2 lights = 120 extra draw calls
```

**✅ CORRECT:**
```tsx
// ✅ Use DirectionalLight or SpotLight for shadows
<directionalLight castShadow intensity={1} />
// OR fake shadows with a transparent plane
```

### 2. Never Use Default Shadow Map Size

**❌ FORBIDDEN:**
```tsx
// ❌ 512x512 = pixelated shadows
<directionalLight castShadow />
```

**✅ CORRECT:**
```tsx
// ✅ Appropriate size for quality
<directionalLight
  castShadow
  shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
/>
```

### 3. Never Forget Shadow Bias

**❌ FORBIDDEN:**
```tsx
// ❌ Shadow acne (striped artifacts)
<directionalLight castShadow />
```

**✅ CORRECT:**
```tsx
// ✅ Proper bias prevents artifacts
<directionalLight
  castShadow
  shadow-bias={-0.0005}
/>
```

---

## WHY

### Light Performance Cost

| Light Type | Cost | Shadows Cost |
|------------|------|--------------|
| Ambient | Free | N/A |
| Hemisphere | Very Low | N/A |
| Directional | Low | 1 render |
| Spot | Medium | 1 render |
| Point | High | 6 renders! |
| RectArea | High | N/A |

### Shadow Map Sizes

| Size | Memory | Quality | Use Case |
|------|--------|---------|----------|
| 512 | 1MB | Low | Mobile, distant |
| 1024 | 4MB | Medium | Mobile primary |
| 2048 | 16MB | High | Desktop |
| 4096 | 64MB | Ultra | Close-ups only |

---

## EXAMPLES

### Complete Lighting Setup

```tsx
function Lighting() {
  return (
    <>
      {/* Ambient base */}
      <ambientLight intensity={0.3} />
      
      {/* Main directional (sun) */}
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0005}
      />
      
      {/* Fill light */}
      <directionalLight
        position={[-10, 10, -5]}
        intensity={0.5}
        color="#aaccff"
      />
      
      {/* Rim light */}
      <spotLight
        position={[0, 10, -10]}
        angle={Math.PI / 6}
        penumbra={1}
        intensity={0.5}
        color="#ffaa88"
      />
      
      {/* Environment */}
      <Environment preset="city" />
    </>
  )
}
```

### Contact Shadows (Fake but Fast)

```tsx
import { ContactShadows } from '@react-three/drei'

<ContactShadows
  position={[0, -1.4, 0]}
  opacity={0.75}
  scale={10}
  blur={2.5}
  far={4}
/>
```

### Soft Shadows

```tsx
import { SoftShadows } from '@react-three/drei'

<SoftShadows
  size={25}
  samples={10}
  focus={0.5}
/>
```

### Cascaded Shadow Maps (CSM) for Large Scenes

```tsx
import { CSM } from 'three/addons/csm/CSM.js'

const csm = new CSM({
  maxFar: camera.far,
  cascades: isMobile ? 2 : 4,
  shadowMapSize: 2048,
  lightDirection: new Vector3(1, -1, 1).normalize(),
  camera: camera,
  parent: scene
})

// Update each frame
csm.update()

// Cleanup
csm.dispose()
```

### Lightformer for Custom Lighting

```tsx
import { Lightformer, Environment } from '@react-three/drei'

<Environment>
  {/* Studio key light */}
  <Lightformer
    form="ring"
    intensity={10}
    position={[10, 10, 5]}
    scale={5}
    target={[0, 0, 0]}
  />
  
  {/* Fill panel */}
  <Lightformer
    form="rect"
    intensity={5}
    position={[-10, 5, 5]}
    scale={[10, 5]}
    color="#aaccff"
  />
  
  {/* Ground bounce */}
  <Lightformer
    form="plane"
    intensity={2}
    position={[0, -5, 0]}
    scale={20}
    rotation={[-Math.PI / 2, 0, 0]}
  />
</Environment>
```

### Baked Lighting with Lightmap

```tsx
import { Lightmap } from '@react-three/lightmap'
import { useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'

function BakedScene() {
  const lightmap = useLoader(TextureLoader, '/baked/lightmap.png')
  
  return (
    <Lightmap>
      <mesh>
        <geometry />
        <meshStandardMaterial
          map={albedo}
          lightMap={lightmap}
          lightMapIntensity={1}
        />
      </mesh>
    </Lightmap>
  )
}
```

---

## Related Assets

- [Lighting Setup Component](../assets/components/lighting.tsx)
- [Environment Presets](../assets/utils/environments.ts)
- [Shadow Config](../assets/utils/shadows.ts)
