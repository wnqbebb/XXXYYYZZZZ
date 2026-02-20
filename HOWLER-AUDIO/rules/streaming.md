---
name: streaming
description: Streaming vs Preload - Estrategias de carga para diferentes tipos de audio
---

# Regla: Streaming vs Preload

## Metadatos
- **Nombre:** streaming
- **Descripción:** Streaming vs Preload - Estrategias de carga para diferentes tipos de audio
- **Versión:** 3.0.0

---

## Directrices Críticas

### MUST (Obligatorio)
1. SIEMPRE usar `html5: true` para archivos > 5MB o streaming en vivo
2. SIEMPRE usar `preload: false` para audio bajo demanda
3. SIEMPRE usar Web Audio (default) para efectos de sonido cortos
4. SIEMPRE considerar el tipo de contenido antes de elegir estrategia

### FORBIDDEN (Prohibido)
1. NUNCA usar Web Audio para archivos grandes (consumo excesivo de memoria)
2. NUNCA usar streaming para efectos de sonido que necesitan latencia baja
3. NUNCA olvidar que HTML5 Audio tiene limitaciones (rate, posición exacta)

### WHY (Justificación)
- Web Audio carga TODO el archivo en memoria (buffers)
- HTML5 Audio permite streaming (reproduce mientras carga)
- Efectos de sonido necesitan respuesta inmediata (preload)
- Música larga no necesita estar completamente en memoria

---

## Comparativa

| Característica | Web Audio (Preload) | HTML5 Audio (Streaming) |
|----------------|---------------------|-------------------------|
| Modo default | ✅ Sí | Fallback |
| Archivos grandes | ❌ No recomendado | ✅ Recomendado |
| Memoria | Alta | Baja |
| Latencia | Baja | Alta |
| Rate control | ✅ Completo | ⚠️ Limitado |
| Seek preciso | ✅ Sí | ⚠️ Limitado |
| Audio 3D | ✅ Sí | ❌ No |
| Streaming en vivo | ❌ No | ✅ Sí |

---

## Estrategias por Tipo

### Efectos de Sonido (< 1MB)
```javascript
const sfx = new Howl({
  src: ['sfx.webm', 'sfx.mp3'],
  // html5: false (default) - Web Audio
  // preload: true (default)
});
```

### Música de Fondo (1-5MB)
```javascript
const music = new Howl({
  src: ['music.mp3'],
  html5: true,      // Streaming
  preload: 'metadata'  // Solo metadatos inicialmente
});
```

### Archivos Grandes (> 5MB)
```javascript
const longAudio = new Howl({
  src: ['podcast.mp3'],
  html5: true,      // Obligatorio
  preload: false    // Cargar bajo demanda
});

// Cargar cuando se necesite
longAudio.load();
longAudio.play();
```

### Radio/Streaming en Vivo
```javascript
const radio = new Howl({
  src: ['http://stream.radio.com/live.mp3'],
  html5: true,      // Obligatorio
  preload: false    // No tiene sentido precargar
});
```

---

## Opciones de Preload

| Valor | Comportamiento |
|-------|----------------|
| `true` | Precarga completa (default) |
| `false` | No precargar, usar `load()` manual |
| `'metadata'` | Solo duración y metadatos (HTML5) |

```javascript
// Precarga completa
const sound1 = new Howl({
  src: ['sound.mp3'],
  preload: true
});

// Sin precarga
const sound2 = new Howl({
  src: ['sound.mp3'],
  preload: false
});

// Solo metadatos
const sound3 = new Howl({
  src: ['sound.mp3'],
  html5: true,
  preload: 'metadata'
});
```

---

## Ejemplos

### ✅ Correcto
```javascript
// Efectos: Web Audio para baja latencia
const laser = new Howl({
  src: ['laser.webm', 'laser.mp3']
  // Web Audio default
});

// Música: HTML5 para streaming
const bgm = new Howl({
  src: ['bgm.mp3'],
  html5: true,
  loop: true
});
```

### ❌ Incorrecto
```javascript
// Mal: Web Audio para archivo grande
const podcast = new Howl({
  src: ['podcast-1hour.mp3']  // 50MB en memoria!
});

// Mal: HTML5 para efectos de sonido
const jump = new Howl({
  src: ['jump.mp3'],
  html5: true  // Alta latencia, no necesario
});
```

---

## Referencias
- [Código: MusicPlayer.tsx](./assets/MusicPlayer.tsx)
