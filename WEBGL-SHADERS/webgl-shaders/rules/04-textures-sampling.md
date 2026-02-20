---
name: textures-sampling
description: Texture operations, sampling, UV manipulation, and texture atlases.
version: 4.0.0
---

# Textures & Sampling

> Master texture sampling for advanced visual effects.

---

## MUST

### 1. Use Proper Texture Coordinates

**✅ CORRECT:**
```glsl
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
  vec4 color = texture2D(uTexture, vUv);
  gl_FragColor = color;
}
```

### 2. Handle Texture Repeat/Clamp

**✅ CORRECT:**
```javascript
// JavaScript
const texture = new THREE.TextureLoader().load('/image.jpg')
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(2, 2)
```

### 3. Use Mipmaps for Performance

**✅ CORRECT:**
```javascript
const texture = new THREE.TextureLoader().load('/image.jpg')
texture.generateMipmaps = true
// Or for better quality
const texture = new THREE.TextureLoader().load('/image.jpg')
texture.minFilter = THREE.LinearMipMapLinearFilter
```

---

## FORBIDDEN

### 1. Never Sample Outside 0-1 Without Wrapping

**❌ FORBIDDEN:**
```glsl
// ❌ UVs outside 0-1 without wrapping
vec2 uv = vUv * 3.0; // Results in black
vec4 color = texture2D(uTexture, uv);
```

**✅ CORRECT:**
```javascript
// ✅ Enable repeat wrapping
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
```

### 2. Never Forget to Flip Y for Images

**❌ FORBIDDEN:**
```glsl
// ❌ Image appears upside down
vec4 color = texture2D(uTexture, vUv);
```

**✅ CORRECT:**
```javascript
// ✅ Flip Y in JavaScript
const texture = new THREE.TextureLoader().load('/image.jpg')
texture.flipY = true
```

---

## WHY

### Texture Wrapping Modes

| Mode | Behavior |
|------|----------|
| `ClampToEdgeWrapping` | Clamps to edge color |
| `RepeatWrapping` | Repeats texture |
| `MirroredRepeatWrapping` | Mirrors and repeats |

### Texture Filters

| Filter | Use Case |
|--------|----------|
| `NearestFilter` | Pixel art, crisp edges |
| `LinearFilter` | Smooth interpolation |
| `NearestMipMapNearestFilter` | Performance |
| `LinearMipMapLinearFilter` | Quality (best) |

---

## EXAMPLES

### Basic Texture Sampling

```glsl
uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  gl_FragColor = texColor;
}
```

### Distorted Texture

```glsl
uniform sampler2D uTexture;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  
  // Add wave distortion
  uv.x += sin(uv.y * 10.0 + uTime) * 0.02;
  uv.y += cos(uv.x * 10.0 + uTime) * 0.02;
  
  vec4 texColor = texture2D(uTexture, uv);
  gl_FragColor = texColor;
}
```

### Texture Atlas

```glsl
uniform sampler2D uAtlas;
uniform vec2 uTileSize;
uniform vec2 uTileOffset;
varying vec2 vUv;

void main() {
  // Calculate atlas UV
  vec2 atlasUV = vUv * uTileSize + uTileOffset;
  
  vec4 texColor = texture2D(uAtlas, atlasUV);
  gl_FragColor = texColor;
}
```

### Multiple Textures

```glsl
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uMix;
varying vec2 vUv;

void main() {
  vec4 tex1 = texture2D(uTexture1, vUv);
  vec4 tex2 = texture2D(uTexture2, vUv);
  
  gl_FragColor = mix(tex1, tex2, uMix);
}
```

### Normal Map

```glsl
uniform sampler2D uNormalMap;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Sample normal from map
  vec3 normal = texture2D(uNormalMap, vUv).rgb * 2.0 - 1.0;
  
  // Simple lighting
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diff = max(dot(normal, lightDir), 0.0);
  
  gl_FragColor = vec4(vec3(diff), 1.0);
}
```

---

## Related Assets

- [Texture Sampling Shader](../assets/shaders/texture-sampling.glsl)
- [Texture Atlas Shader](../assets/shaders/texture-atlas.glsl)
