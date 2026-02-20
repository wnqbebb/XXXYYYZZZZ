---
name: postprocessing
description: Post-processing effects, Bloom, Depth of Field, Tone Mapping with pmndrs/postprocessing.
version: 4.0.0
---

# Post-Processing - Visual Effects

> Enhance your scenes with post-processing effects. Use wisely—each effect adds cost.

---

## MUST

### 1. Use pmndrs/postprocessing Over Three.js Default

**✅ CORRECT:**
```tsx
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom 
    intensity={0.5}
    luminanceThreshold={0.9}
    luminanceSmoothing={0.3}
  />
  <Vignette eskil={false} offset={0.1} darkness={0.5} />
</EffectComposer>
```

### 2. Configure Renderer for Post-Processing

**✅ CORRECT:**
```tsx
<Canvas
  gl={{
    powerPreference: 'high-performance',
    antialias: false,      // AA handled by post-processing
    stencil: false,
    depth: false
  }}
>
  <EffectComposer multisampling={8}>
    {/* Effects */}
  </EffectComposer>
</Canvas>
```

### 3. Apply Tone Mapping at Pipeline End

**✅ CORRECT:**
```tsx
import { ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

<EffectComposer>
  {/* Other effects */}
  <Bloom />
  
  {/* Tone mapping LAST */}
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
</EffectComposer>
```

---

## FORBIDDEN

### 1. Never Enable Native AA with Post-Processing

**❌ FORBIDDEN:**
```tsx
// ❌ Double AA = wasted performance
<Canvas gl={{ antialias: true }}>
  <EffectComposer>
    <SMAA /> {/* Also does AA! */}
  </EffectComposer>
</Canvas>
```

**✅ CORRECT:**
```tsx
// ✅ Let post-processing handle AA
<Canvas gl={{ antialias: false }}>
  <EffectComposer multisampling={8}>
    <SMAA />
  </EffectComposer>
</Canvas>
```

### 2. Never Add Effects Without Purpose

**❌ FORBIDDEN:**
```tsx
// ❌ Adding all effects = performance killer
<EffectComposer>
  <Bloom />
  <DepthOfField />
  <Noise />
  <Vignette />
  <ChromaticAberration />
  <DotScreen />
  <Pixelation />
  {/* ... */}
</EffectComposer>
```

**✅ CORRECT:**
```tsx
// ✅ Only effects that serve the design
<EffectComposer>
  <Bloom intensity={0.5} /> {/* Glow on bright areas */}
  <ToneMapping />
</EffectComposer>
```

---

## WHY

### Effect Performance Cost

| Effect | Cost | Use Case |
|--------|------|----------|
| Tone Mapping | ⭐ Low | Always use |
| Bloom | ⭐⭐ Moderate | Glow effects |
| SMAA/FXAA | ⭐⭐ Moderate | Anti-aliasing |
| Depth of Field | ⭐⭐⭐ High | Cinematic focus |
| SSAO | ⭐⭐⭐⭐ Very High | Ambient occlusion |
| Motion Blur | ⭐⭐⭐⭐ Very High | Speed effect |

### Effect Order Matters

Correct order:
1. Render scene
2. SSAO/AO effects
3. Bloom/Glow
4. Color correction
5. Tone mapping (LAST)
6. SMAA/FXAA (if needed)

---

## EXAMPLES

### Complete Post-Processing Setup

```tsx
import { 
  EffectComposer, 
  Bloom, 
  DepthOfField,
  ToneMapping,
  Vignette,
  Noise
} from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

function Effects() {
  return (
    <EffectComposer
      multisampling={8}
      disableNormalPass={false}
    >
      {/* Depth of field */}
      <DepthOfField
        focusDistance={0}
        focalLength={0.02}
        bokehScale={2}
        height={480}
      />
      
      {/* Bloom for glow */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.9}
        luminanceSmoothing={0.3}
        mipmapBlur
      />
      
      {/* Subtle noise for film grain */}
      <Noise opacity={0.02} />
      
      {/* Vignette for focus */}
      <Vignette
        eskil={false}
        offset={0.1}
        darkness={0.5}
      />
      
      {/* Tone mapping (ALWAYS LAST) */}
      <ToneMapping
        mode={ToneMappingMode.ACES_FILMIC}
      />
    </EffectComposer>
  )
}
```

### Selective Bloom

```tsx
import { Bloom, EffectComposer, Selection, Select } from '@react-three/postprocessing'

function SelectiveBloomScene() {
  return (
    <>
      <Selection>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5}
            intensity={0.5}
            mipmapBlur
          />
        </EffectComposer>
        
        {/* This mesh will bloom */}
        <Select enabled>
          <mesh position={[0, 0, 0]}>
            <sphereGeometry />
            <meshStandardMaterial 
              color="white" 
              emissive="hotpink"
              emissiveIntensity={2}
            />
          </mesh>
        </Select>
        
        {/* This mesh won't bloom */}
        <mesh position={[2, 0, 0]}>
          <boxGeometry />
          <meshStandardMaterial color="gray" />
        </mesh>
      </Selection>
    </>
  )
}
```

### God Rays Effect

```tsx
import { GodRays } from '@react-three/postprocessing'

function GodRaysEffect() {
  const sunRef = useRef<Mesh>(null)
  
  return (
    <>
      <mesh ref={sunRef} position={[10, 10, -10]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>
      
      {sunRef.current && (
        <EffectComposer>
          <GodRays
            sun={sunRef.current}
            samples={60}
            density={0.96}
            decay={0.98}
            weight={0.3}
            exposure={0.6}
            clampMax={1}
          />
        </EffectComposer>
      )}
    </>
  )
}
```

### Chromatic Aberration

```tsx
import { ChromaticAberration } from '@react-three/postprocessing'
import { Uniform } from 'three'

function ChromaticEffect() {
  return (
    <EffectComposer>
      <ChromaticAberration
        offset={[0.002, 0.002]}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  )
}
```

---

## Related Assets

- [Effects Preset](../assets/components/effects-preset.tsx)
- [Bloom Config](../assets/utils/bloom-configs.ts)
