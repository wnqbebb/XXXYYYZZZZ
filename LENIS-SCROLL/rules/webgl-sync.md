# Sincronización WebGL/Three.js + Lenis

## Setup Básico

```typescript
import * as THREE from 'three';
import Lenis from 'lenis';

// ✅ Setup Lenis optimizado para WebGL
const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
  syncTouch: true, // Importante para touch
  autoRaf: false,  // Controlaremos el loop nosotros
});

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ✅ Loop unificado
function animate(time: number) {
  // Actualizar Lenis
  lenis.raf(time);
  
  // Actualizar cámara basada en scroll
  updateCamera(lenis.scroll);
  
  // Render
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

---

## Cámara sincronizada con Scroll

### Parallax de Cámara

```typescript
// ✅ Cámara que se mueve con scroll
camera.position.z = 5;

lenis.on('scroll', ({ scroll, progress }) => {
  // Mover cámara en Y basado en scroll
  camera.position.y = -scroll * 0.01;
  
  // Rotación sutil basada en progreso
  camera.rotation.x = progress * 0.1;
});
```

### Cámara con Smooth Follow

```typescript
// ✅ Cámara con suavizado
let targetY = 0;
let currentY = 0;

lenis.on('scroll', ({ scroll }) => {
  targetY = scroll * 0.01;
});

function animate() {
  // Suavizar posición de cámara
  currentY += (targetY - currentY) * 0.05;
  camera.position.y = currentY;
  
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
```

---

## Objetos 3D con Scroll

### Mesh Scroll Animation

```typescript
// ✅ Mesh que rota con scroll
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

lenis.on('scroll', ({ progress, velocity }) => {
  // Rotación basada en progreso
  cube.rotation.x = progress * Math.PI * 2;
  cube.rotation.y = progress * Math.PI;
  
  // Scale basado en velocidad
  const scale = 1 + Math.abs(velocity) * 0.001;
  cube.scale.setScalar(scale);
});
```

### Instanced Mesh Scroll

```typescript
// ✅ Instanced mesh con posiciones basadas en scroll
const count = 100;
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const mesh = new THREE.InstancedMesh(geometry, material, count);
scene.add(mesh);

const dummy = new THREE.Object3D();

lenis.on('scroll', ({ scroll }) => {
  for (let i = 0; i < count; i++) {
    const x = (i % 10) - 5;
    const y = Math.floor(i / 10) - 5 + scroll * 0.01;
    const z = 0;
    
    dummy.position.set(x, y, z);
    dummy.rotation.set(scroll * 0.01, 0, 0);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
});
```

---

## Shaders + Scroll

### Uniform de Scroll

```typescript
// ✅ Shader con uniform de scroll
const vertexShader = `
  uniform float uScroll;
  uniform float uVelocity;
  
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Distorsión basada en scroll
    pos.z += sin(pos.x * 10.0 + uScroll) * 0.1 * uVelocity;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  
  void main() {
    gl_FragColor = vec4(vUv, 1.0, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uScroll: { value: 0 },
    uVelocity: { value: 0 },
  },
});

lenis.on('scroll', ({ scroll, velocity }) => {
  material.uniforms.uScroll.value = scroll * 0.01;
  material.uniforms.uVelocity.value = Math.abs(velocity) * 0.01;
});
```

### Distorsión de Vertex

```typescript
// ✅ Distorsión de malla basada en velocidad
const distortionShader = {
  uniforms: {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVelocity: { value: 0 },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    uniform float uVelocity;
    
    varying vec2 vUv;
    varying float vDistortion;
    
    void main() {
      vUv = uv;
      
      vec3 pos = position;
      
      // Ondas basadas en scroll y tiempo
      float wave = sin(pos.x * 5.0 + uScroll * 0.1 + uTime) * 0.1;
      float distortion = wave * uVelocity * 0.01;
      
      pos.z += distortion;
      vDistortion = distortion;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying float vDistortion;
    
    void main() {
      vec3 color = vec3(0.5 + vDistortion * 5.0, 0.5, 0.5);
      gl_FragColor = vec4(color, 1.0);
    }
  `,
};
```

---

## Scroll-based WebGL Sections

### Secciones con Canvas

```typescript
// ✅ Canvas por sección
class WebGLSection {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private scrollProgress = 0;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
    });
    
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();
  }

  updateScroll(progress: number) {
    this.scrollProgress = progress;
    // Actualizar objetos basado en progreso
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// Uso con Lenis
const sections = document.querySelectorAll('.webgl-section');
const webglSections = Array.from(sections).map((section) => 
  new WebGLSection(section as HTMLElement)
);

lenis.on('scroll', ({ scroll }) => {
  webglSections.forEach((section, i) => {
    const rect = sections[i].getBoundingClientRect();
    const progress = -rect.top / rect.height;
    section.updateScroll(progress);
    section.render();
  });
});
```

---

## Partículas con Scroll

### Sistema de Partículas

```typescript
// ✅ Partículas que reaccionan a scroll
class ParticleSystem {
  private particles: THREE.Points;
  private positions: Float32Array;
  private originalPositions: Float32Array;
  private velocities: Float32Array;
  private count: number;

  constructor(count: number) {
    this.count = count;
    const geometry = new THREE.BufferGeometry();
    
    this.positions = new Float32Array(count * 3);
    this.originalPositions = new Float32Array(count * 3);
    this.velocities = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 10;
      
      this.positions[i * 3] = x;
      this.positions[i * 3 + 1] = y;
      this.positions[i * 3 + 2] = z;
      
      this.originalPositions[i * 3] = x;
      this.originalPositions[i * 3 + 1] = y;
      this.originalPositions[i * 3 + 2] = z;
      
      this.velocities[i * 3] = 0;
      this.velocities[i * 3 + 1] = 0;
      this.velocities[i * 3 + 2] = 0;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    
    this.particles = new THREE.Points(geometry, material);
  }

  update(scroll: number, velocity: number) {
    const positions = this.particles.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < this.count; i++) {
      const i3 = i * 3;
      
      // Aplicar fuerza basada en scroll
      this.velocities[i3 + 1] += velocity * 0.001;
      
      // Damping
      this.velocities[i3] *= 0.95;
      this.velocities[i3 + 1] *= 0.95;
      this.velocities[i3 + 2] *= 0.95;
      
      // Actualizar posición
      positions[i3] = this.originalPositions[i3] + this.velocities[i3];
      positions[i3 + 1] = this.originalPositions[i3 + 1] + this.velocities[i3 + 1] - scroll * 0.01;
      positions[i3 + 2] = this.originalPositions[i3 + 2] + this.velocities[i3 + 2];
    }
    
    this.particles.geometry.attributes.position.needsUpdate = true;
  }

  getMesh() {
    return this.particles;
  }
}

// Uso
const particles = new ParticleSystem(1000);
scene.add(particles.getMesh());

lenis.on('scroll', ({ scroll, velocity }) => {
  particles.update(scroll, velocity);
});
```

---

## Texturas con Scroll

### Video Texture Sync

```typescript
// ✅ Video sincronizado con scroll
const video = document.createElement('video');
video.src = '/video.mp4';
video.muted = true;
video.loop = true;

const videoTexture = new THREE.VideoTexture(video);
const material = new THREE.MeshBasicMaterial({ map: videoTexture });

// Controlar tiempo de video con scroll
lenis.on('scroll', ({ progress }) => {
  if (video.readyState >= 2) {
    video.currentTime = progress * video.duration;
  }
});
```

### Canvas Texture

```typescript
// ✅ Canvas 2D como textura
const canvas = document.createElement('canvas');
canvas.width = 512;
canvas.height = 512;
const ctx = canvas.getContext('2d')!;

const texture = new THREE.CanvasTexture(canvas);
const material = new THREE.MeshBasicMaterial({ map: texture });

// Dibujar basado en scroll
lenis.on('scroll', ({ scroll, velocity }) => {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, 512, 512);
  
  ctx.fillStyle = '#fff';
  ctx.font = '48px Arial';
  ctx.fillText(`Scroll: ${Math.round(scroll)}`, 50, 100);
  ctx.fillText(`Velocity: ${velocity.toFixed(2)}`, 50, 200);
  
  // Dibujar forma basada en scroll
  ctx.beginPath();
  ctx.arc(256, 400, 50 + Math.abs(velocity), 0, Math.PI * 2);
  ctx.fill();
  
  texture.needsUpdate = true;
});
```

---

## Performance

```yaml
WEBGL_PERFORMANCE:
  MUST:
    - [ ] Usar requestAnimationFrame unificado
    - [ ] Limitar draw calls
    - [ ] Usar InstancedMesh para objetos repetidos
    - [ ] Desactivar antialiasing si no es necesario
    - [ ] Usar texture compression
  
  OPTIMIZACIONES:
    - [ ] Frustum culling
    - [ ] LOD (Level of Detail)
    - [ ] Occlusion culling
    - [ ] Geometry instancing
    - [ ] Shader precision baja cuando sea posible
  
  LENIS_SPECIFIC:
    - [ ] syncTouch: true para mobile
    - [ ] lerp: 0.1 para balance suavidad/performance
    - [ ] No recalcular matrices en cada frame si no es necesario
```
