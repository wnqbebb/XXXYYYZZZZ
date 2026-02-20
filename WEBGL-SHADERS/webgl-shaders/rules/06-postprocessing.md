---
name: postprocessing
description: Post-processing effects - bloom, blur, chromatic aberration, and custom effects.
version: 4.0.0
---

# Post-Processing Effects

> Create stunning visual effects with full-screen shaders.

---

## MUST

### 1. Use EffectComposer Properly

**✅ CORRECT:**
```tsx
import { EffectComposer, RenderPass, UnrealBloomPass } from 'three/examples/jsm/postprocessing/EffectComposer.js'

const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85))
```

### 2. Render Through Composer

**✅ CORRECT:**
```tsx
// ❌ Don't use renderer directly
// renderer.render(scene, camera)

// ✅ Use composer
composer.render()
```

### 3. Handle Resize

**✅ CORRECT:**
```tsx
window.addEventListener('resize', () => {
  composer.setSize(window.innerWidth, window.innerHeight)
})
```

---

## FORBIDDEN

### 1. Never Forget to Update Composer Size

**❌ FORBIDDEN:**
```tsx
// ❌ No resize handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  // Forgot composer!
})
```

**✅ CORRECT:**
```tsx
// ✅ Resize both
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
})
```

---

## WHY

### Post-Processing Pipeline

```
Scene → RenderPass → EffectPass → EffectPass → Output
```

### Common Effects

| Effect | Description |
|--------|-------------|
| Bloom | Glow around bright areas |
| Blur | Gaussian/depth of field |
| Chromatic Aberration | Color separation |
| Vignette | Dark corners |
| Noise | Film grain |
| Tone Mapping | HDR to LDR |

---

## EXAMPLES

### Custom Post-Processing Shader

```glsl
// Vertex shader (fullscreen quad)
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

```glsl
// Fragment shader - chromatic aberration
uniform sampler2D tDiffuse;
uniform float uAmount;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  vec4 color;
  color.r = texture2D(tDiffuse, uv + vec2(uAmount, 0.0)).r;
  color.g = texture2D(tDiffuse, uv).g;
  color.b = texture2D(tDiffuse, uv - vec2(uAmount, 0.0)).b;
  color.a = 1.0;
  
  gl_FragColor = color;
}
```

### R3F Post-Processing

```tsx
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={1.5} luminanceThreshold={0.9} />
      <ChromaticAberration offset={[0.002, 0.002]} />
    </EffectComposer>
  )
}
```

### Custom Effect Pass

```typescript
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'

const customShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      uv.x += sin(uv.y * 10.0 + uTime) * 0.01;
      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `
}

const customPass = new ShaderPass(customShader)
composer.addPass(customPass)
```

---

## Related Assets

- [Chromatic Aberration Shader](../assets/shaders/chromatic-aberration.glsl)
- [Vignette Shader](../assets/shaders/vignette.glsl)
