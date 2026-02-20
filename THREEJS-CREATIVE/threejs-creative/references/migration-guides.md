# Migration Guides

## WebGL to WebGPU Migration

### Quick Start

```tsx
// Before (WebGL)
import { WebGLRenderer } from 'three'

const renderer = new WebGLRenderer({ antialias: true })
```

```tsx
// After (WebGPU)
import { WebGPURenderer } from 'three/webgpu'

const renderer = new WebGPURenderer({ antialias: true })
await renderer.init() // Required!
```

### Key Differences

| Feature | WebGL | WebGPU |
|---------|-------|--------|
| Import | `three` | `three/webgpu` |
| Initialization | Synchronous | Async (`await init()`) |
| Shaders | GLSL | TSL (Three Shader Language) |
| Compute | Limited | Full support |
| Performance | Baseline | 2-10x faster |
| Fallback | None | Automatic WebGL 2 |

### Shader Migration

```tsx
// Before (GLSL)
const material = new ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    void main() {
      gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
  `
})
```

```tsx
// After (TSL)
import { vec2, vec4, uv, positionLocal } from 'three/tsl'

const material = new MeshBasicNodeMaterial()
material.colorNode = vec4(uv(), 0.0, 1.0)
```

### R3F with WebGPU

```tsx
import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'

<Canvas
  gl={(canvas) => {
    const renderer = new WebGPURenderer({ canvas })
    renderer.init()
    return renderer
  }}
>
  <Scene />
</Canvas>
```

### Common Issues

#### Issue: `init()` not called
**Error:** WebGPU renderer not initialized
**Solution:** Always await `renderer.init()`

#### Issue: Shader compilation errors
**Error:** TSL syntax different from GLSL
**Solution:** Use TSL functions from `three/tsl`

#### Issue: Features not supported
**Error:** WebGPU feature not available
**Solution:** Check feature support before using

```tsx
const adapter = await navigator.gpu?.requestAdapter()
if (!adapter) {
  // Fall back to WebGL
}
```

## Three.js Version Upgrades

### r160 to r179 Changes

- WebGPU renderer is production-ready
- TSL (Three Shader Language) improvements
- BatchedMesh enhancements
- New TRAA implementation
- USDZExporter improvements

### Breaking Changes

Check the [release notes](https://github.com/mrdoob/three.js/releases) for each version.

### Update Command

```bash
npm install three@latest
npm install @types/three@latest --save-dev
```
