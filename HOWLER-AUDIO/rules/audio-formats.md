---
name: audio-formats
description: Formatos de audio soportados, codecs, recomendaciones y conversión
---

# Regla: Formatos de Audio

## Metadatos
- **Nombre:** audio-formats
- **Descripción:** Formatos de audio soportados, codecs, recomendaciones y conversión
- **Versión:** 3.0.0

---

## Directrices Críticas

### MUST (Obligatorio)
1. SIEMPRE proporcionar al menos DOS formatos: WebM primero, MP3 segundo
2. SIEMPRE usar la extensión correcta en los archivos src
3. SIEMPRE verificar soporte de codec con `Howler.codecs()` si hay dudas
4. SIEMPRE codificar WebM con cues para Firefox seekable

### FORBIDDEN (Prohibido)
1. NUNCA usar solo MP3 sin alternativa (menor calidad, mayor tamaño)
2. NUNCA usar formatos sin verificar compatibilidad del navegador
3. NUNCA omitir la extensión del archivo sin especificar `format`

### WHY (Justificación)
- WebM (Vorbis/Opus) ofrece mejor calidad a menor tamaño que MP3
- MP3 es necesario para Internet Explorer y algunos navegadores antiguos
- Firefox requiere cues en WebM para permitir seeking
- Cada navegador tiene soporte de codecs diferente

---

## Codecs Soportados

| Formato | Extensión | Compatibilidad | Uso recomendado |
|---------|-----------|----------------|-----------------|
| MP3 | .mp3 | Universal | Fallback obligatorio |
| WebM | .webm | Modernos | Primera opción |
| OGG | .ogg | Firefox, Chrome | Alternativa a WebM |
| WAV | .wav | Universal | Efectos cortos sin compresión |
| AAC/M4A | .m4a | Safari, IE | Alternativa Apple |
| Opus | .opus | Modernos | VoIP, streaming |
| FLAC | .flac | Chrome, Firefox | Audio sin pérdida |
| Dolby | .mp4 | Edge, Safari | Audio premium |

---

## Estrategia de Formatos

### Opción Recomendada (Mejor)
```javascript
const sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});
```

### Cobertura Completa
```javascript
const sound = new Howl({
  src: ['sound.webm', 'sound.ogg', 'sound.mp3']
});
```

### Audio Premium (Dolby)
```javascript
const dolbySound = new Howl({
  src: ['sound.mp4', 'sound.webm', 'sound.mp3'],
  format: ['dolby', 'webm', 'mp3']  // Especificar formato explícito
});
```

---

## Verificación de Codecs

```javascript
// Verificar antes de crear el Howl
const formats = ['webm', 'mp3'].filter(ext => Howler.codecs(ext));

const sound = new Howl({
  src: formats.map(ext => `sound.${ext}`)
});

// O verificación individual
if (Howler.codecs('ogg')) {
  console.log('OGG soportado');
}
```

---

## Conversión con FFmpeg

### WebM con cues (para Firefox seekable)
```bash
ffmpeg -i input.wav -dash 1 output.webm
```

### MP3 de alta calidad
```bash
ffmpeg -i input.wav -codec:a libmp3lame -q:a 2 output.mp3
```

### OGG Vorbis
```bash
ffmpeg -i input.wav -codec:a libvorbis -q:a 4 output.ogg
```

### WebM con Opus
```bash
ffmpeg -i input.wav -codec:a libopus -b:a 128k output.webm
```

---

## Comparación de Formatos

| Formato | Tamaño | Calidad | Seekable | Streaming |
|---------|--------|---------|----------|-----------|
| MP3 | Medio | Buena | ✅ | ✅ |
| WebM | Pequeño | Excelente | ✅* | ✅ |
| OGG | Pequeño | Excelente | ✅ | ✅ |
| WAV | Grande | Sin pérdida | ✅ | ❌ |

*Requiere cues para Firefox

---

## Ejemplos

### ✅ Correcto
```javascript
// Múltiples formatos en orden de preferencia
const sound = new Howl({
  src: ['audio.webm', 'audio.mp3']
});

// Verificación de soporte
const preferredFormats = ['webm', 'ogg', 'mp3'];
const supported = preferredFormats.filter(f => Howler.codecs(f));
```

### ❌ Incorrecto
```javascript
// Solo MP3
const sound = new Howl({
  src: ['audio.mp3']
});

// Orden incorrecto (MP3 se cargará primero)
const sound = new Howl({
  src: ['audio.mp3', 'audio.webm']
});
```
