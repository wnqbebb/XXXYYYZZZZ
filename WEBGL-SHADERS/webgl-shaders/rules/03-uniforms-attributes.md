---
name: uniforms-attributes
description: Passing data to shaders - uniforms, attributes, and varyings.
version: 4.0.0
---

# Uniforms, Attributes & Varyings

> Understanding data flow between JavaScript and shaders is essential.

---

## MUST

### 1. Use Uniforms for Per-Draw Data

**✅ CORRECT:**
```glsl
uniform float uTime;
uniform vec3 uColor;
uniform mat4 uModelMatrix;
```

### 2. Use Attributes for Per-Vertex Data

**✅ CORRECT:**
```glsl
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
```

### 3. Use Varyings to Pass Data to Fragment Shader

**✅ CORRECT:**
```glsl
// Vertex shader
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment shader
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  gl_FragColor = vec4(vNormal * 0.5 + 0.5, 1.0);
}
```

---

## FORBIDDEN

### 1. Never Modify Uniforms in Shader

**❌ FORBIDDEN:**
```glsl
uniform float uTime;

void main() {
  uTime = 0.0; // ❌ Cannot modify uniform!
}
```

### 2. Never Use Attributes in Fragment Shader

**❌ FORBIDDEN:**
```glsl
// Fragment shader
attribute vec2 uv; // ❌ Attributes only in vertex shader!

void main() {
  gl_FragColor = vec4(uv, 0.0, 1.0);
}
```

**✅ CORRECT:**
```glsl
// Vertex shader
attribute vec2 uv;
varying vec2 vUv;

void main() {
  vUv = uv; // ✅ Pass via varying
  // ...
}

// Fragment shader
varying vec2 vUv; // ✅ Use varying

void main() {
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
```

---

## WHY

### Data Type Comparison

| Type | Scope | Updated By | Use Case |
|------|-------|------------|----------|
| `attribute` | Per-vertex | JavaScript | Position, UV, normal |
| `uniform` | Per-draw | JavaScript | Time, color, matrices |
| `varying` | Per-pixel | Vertex shader | Interpolated data |

---

## EXAMPLES

### R3F ShaderMaterial with Uniforms

```tsx
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'

const MyShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color(1, 0, 0),
    uTexture: null
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    
    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      float wave = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
      gl_FragColor = vec4(uColor * wave, 1.0) * texColor;
    }
  `
)

extend({ MyShaderMaterial })

function ShaderMesh() {
  const materialRef = useRef<typeof MyShaderMaterial>(null)
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime
    }
  })
  
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <myShaderMaterial ref={materialRef} uTexture={myTexture} />
    </mesh>
  )
}
```

### Custom Attributes

```tsx
import { useMemo } from 'react'
import * as THREE from 'three'

function CustomAttributeMesh() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(2, 2, 32, 32)
    
    // Add custom attribute
    const count = geo.attributes.position.count
    const randoms = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random()
    }
    
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))
    
    return geo
  }, [])
  
  const vertexShader = `
    attribute float aRandom;
    varying float vRandom;
    
    void main() {
      vRandom = aRandom;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  
  const fragmentShader = `
    varying float vRandom;
    
    void main() {
      gl_FragColor = vec4(vec3(vRandom), 1.0);
    }
  `
  
  return (
    <mesh geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}
```

---

## Related Assets

- [Uniforms Example](../assets/shaders/uniforms.glsl)
- [Custom Attributes Example](../assets/shaders/custom-attributes.glsl)
