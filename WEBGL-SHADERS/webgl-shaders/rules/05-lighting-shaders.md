---
name: lighting-shaders
description: Lighting calculations in shaders - diffuse, specular, ambient, and PBR.
version: 4.0.0
---

# Lighting in Shaders

> Implement lighting models from scratch for complete control.

---

## MUST

### 1. Calculate Diffuse Lighting

**✅ CORRECT:**
```glsl
vec3 lightDir = normalize(uLightPosition - vPosition);
float diff = max(dot(vNormal, lightDir), 0.0);
vec3 diffuse = diff * uLightColor;
```

### 2. Calculate Specular Lighting

**✅ CORRECT:**
```glsl
vec3 viewDir = normalize(uCameraPosition - vPosition);
vec3 reflectDir = reflect(-lightDir, vNormal);
float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
vec3 specular = spec * uLightColor;
```

### 3. Normalize Vectors

**✅ CORRECT:**
```glsl
vec3 normal = normalize(vNormal);
vec3 lightDir = normalize(uLightPosition - vPosition);
```

---

## FORBIDDEN

### 1. Never Forget to Normalize

**❌ FORBIDDEN:**
```glsl
// ❌ Not normalized - incorrect lighting
float diff = max(dot(vNormal, lightDir), 0.0);
```

**✅ CORRECT:**
```glsl
// ✅ Normalized - correct lighting
vec3 normal = normalize(vNormal);
vec3 lightDir = normalize(uLightPosition - vPosition);
float diff = max(dot(normal, lightDir), 0.0);
```

### 2. Never Calculate Per-Fragment What Can Be Per-Vertex

**❌ FORBIDDEN:**
```glsl
// Fragment shader - expensive
vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
```

**✅ CORRECT:**
```glsl
// Vertex shader - pass via varying
varying vec3 vWorldPosition;

void main() {
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  // ...
}
```

---

## WHY

### Lighting Components

| Component | Formula | Description |
|-----------|---------|-------------|
| Ambient | `Ka * Ia` | Base illumination |
| Diffuse | `Kd * Id * max(N·L, 0)` | Directional reflection |
| Specular | `Ks * Is * pow(max(R·V, 0), shininess)` | Highlight |

---

## EXAMPLES

### Phong Lighting Model

```glsl
// Vertex shader
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment shader
precision mediump float;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;
uniform vec3 uAmbientColor;
uniform vec3 uDiffuseColor;
uniform vec3 uSpecularColor;
uniform float uShininess;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Normalize vectors
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightPosition - vPosition);
  vec3 viewDir = normalize(-vPosition);
  vec3 reflectDir = reflect(-lightDir, normal);
  
  // Ambient
  vec3 ambient = uAmbientColor * uDiffuseColor;
  
  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0);
  vec3 diffuse = uLightColor * (diff * uDiffuseColor);
  
  // Specular
  float spec = pow(max(dot(viewDir, reflectDir), 0.0), uShininess);
  vec3 specular = uLightColor * (spec * uSpecularColor);
  
  vec3 result = ambient + diffuse + specular;
  gl_FragColor = vec4(result, 1.0);
}
```

### Blinn-Phong (Better Specular)

```glsl
// Fragment shader - Blinn-Phong
void main() {
  vec3 normal = normalize(vNormal);
  vec3 lightDir = normalize(uLightPosition - vPosition);
  vec3 viewDir = normalize(-vPosition);
  
  // Halfway vector (Blinn-Phong)
  vec3 halfwayDir = normalize(lightDir + viewDir);
  
  // Diffuse
  float diff = max(dot(normal, lightDir), 0.0);
  
  // Specular (Blinn-Phong)
  float spec = pow(max(dot(normal, halfwayDir), 0.0), uShininess);
  
  vec3 result = uAmbientColor + 
                diff * uDiffuseColor + 
                spec * uSpecularColor;
  
  gl_FragColor = vec4(result, 1.0);
}
```

### Multiple Lights

```glsl
#define MAX_LIGHTS 4

uniform vec3 uLightPositions[MAX_LIGHTS];
uniform vec3 uLightColors[MAX_LIGHTS];
uniform int uNumLights;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 result = uAmbientColor;
  
  for (int i = 0; i < MAX_LIGHTS; i++) {
    if (i >= uNumLights) break;
    
    vec3 lightDir = normalize(uLightPositions[i] - vPosition);
    float diff = max(dot(normal, lightDir), 0.0);
    
    result += diff * uLightColors[i] * uDiffuseColor;
  }
  
  gl_FragColor = vec4(result, 1.0);
}
```

---

## Related Assets

- [Phong Lighting Shader](../assets/shaders/phong-lighting.glsl)
- [Blinn-Phong Shader](../assets/shaders/blinn-phong.glsl)
