---
name: spatial-audio
description: Audio espacial 3D y panning estéreo para juegos y experiencias inmersivas
---

# Regla: Audio Espacial

## Metadatos
- **Nombre:** spatial-audio
- **Descripción:** Audio espacial 3D y panning estéreo para juegos y experiencias inmersivas
- **Versión:** 3.0.0

---

## Directrices Críticas

### MUST (Obligatorio)
1. SIEMPRE requerir `howler.spatial.js` para funcionalidad 3D
2. SIEMPRE actualizar posición del listener (cámara/jugador) cada frame
3. SIEMPRE usar Web Audio (no HTML5) para audio espacial
4. SIEMPRE configurar `pannerAttr` adecuadamente para el tipo de ambiente

### FORBIDDEN (Prohibido)
1. NUNCA usar audio espacial con `html5: true`
2. NUNCA olvidar actualizar la orientación del listener
3. NUNCA usar valores de distancia irreales (mantener escala consistente)

### WHY (Justificación)
- Audio espacial requiere Web Audio API (PannerNode)
- HTML5 Audio no soporta posicionamiento 3D
- La orientación afecta cómo se percibe la dirección del sonido
- Distancias inconsistentes rompen la inmersión

---

## Instalación

```html
<!-- Core + Spatial -->
<script src="howler.js"></script>

<!-- O separado -->
<script src="howler.core.js"></script>
<script src="howler.spatial.js"></script>
```

```javascript
// ES6
import { Howl, Howler } from 'howler';
```

---

## Panning Estéreo

### Simple
```javascript
const sound = new Howl({
  src: ['sound.mp3'],
  stereo: -0.5  // -1.0 (izquierda) a 1.0 (derecha)
});

// Cambiar en tiempo real
sound.stereo(0.8);
```

### Global
```javascript
Howler.stereo(-0.3);  // Todo el audio desplazado
```

---

## Audio 3D

### Posición del Sonido
```javascript
const enemySound = new Howl({
  src: ['enemy.mp3'],
  loop: true,
  pos: [10, 0, 5]  // x, y, z
});

// Mover sonido
enemySound.pos(15, 0, 8);
```

### Orientación del Sonido
```javascript
// Hacia dónde "mira" la fuente
enemySound.orientation(1, 0, 0);  // Vector dirección
```

### Atributos del Panner
```javascript
enemySound.pannerAttr({
  coneInnerAngle: 360,       // Ángulo interno del cono
  coneOuterAngle: 360,       // Ángulo externo del cono
  coneOuterGain: 0,          // Volumen fuera del cono
  distanceModel: 'inverse',  // 'linear', 'inverse', 'exponential'
  maxDistance: 10000,        // Distancia máxima audible
  refDistance: 1,            // Distancia de referencia
  rolloffFactor: 1           // Factor de atenuación
});
```

---

## Posición del Listener (Jugador/Cámara)

```javascript
// Actualizar cada frame del juego
function updateAudioListener(player) {
  // Posición del jugador
  Howler.pos(player.x, player.y, player.z);
  
  // Orientación (hacia dónde mira)
  Howler.orientation(
    player.forwardX, player.forwardY, player.forwardZ,  // Vector frontal
    0, 1, 0                                              // Vector arriba
  );
}
```

---

## Modelos de Distancia

| Modelo | Descripción | Uso |
|--------|-------------|-----|
| `linear` | Atenuación lineal | Ambientes pequeños |
| `inverse` | Atenuación inversa (realista) | Mundo abierto |
| `exponential` | Atenuación exponencial | Espacios cerrados |

---

## Ejemplo: Sistema 3D para Juegos

```javascript
const WorldAudio = {
  sounds: {},
  
  addSound(id, src, pos) {
    this.sounds[id] = new Howl({
      src,
      loop: true,
      pos,
      pannerAttr: {
        distanceModel: 'inverse',
        maxDistance: 100,
        refDistance: 5,
        rolloffFactor: 1
      }
    });
    this.sounds[id].play();
  },
  
  moveSound(id, x, y, z) {
    this.sounds[id]?.pos(x, y, z);
  },
  
  updatePlayer(x, y, z, dx, dy, dz) {
    Howler.pos(x, y, z);
    Howler.orientation(dx, dy, dz, 0, 1, 0);
  }
};

// Uso
WorldAudio.addSound('fire', ['fire.mp3'], [10, 0, 5]);
WorldAudio.updatePlayer(0, 0, 0, 0, 0, -1);
```

---

## Ejemplos

### ✅ Correcto
```javascript
const sound = new Howl({
  src: ['3d-sound.mp3'],
  pos: [10, 0, 5],
  pannerAttr: {
    distanceModel: 'inverse',
    maxDistance: 50
  }
});

// Actualizar listener cada frame
function gameLoop() {
  Howler.pos(player.x, player.y, player.z);
}
```

### ❌ Incorrecto
```javascript
const sound = new Howl({
  src: ['3d-sound.mp3'],
  html5: true,  // No funciona con audio 3D!
  pos: [10, 0, 5]
});
```

---

## Referencias
- [Código: SpatialAudio.ts](./assets/SpatialAudio.ts)
