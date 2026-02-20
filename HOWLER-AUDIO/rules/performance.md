---
name: performance
description: Mejores prácticas de performance, gestión de memoria y optimización
---

# Regla: Performance

## Metadatos
- **Nombre:** performance
- **Descripción:** Mejores prácticas de performance, gestión de memoria y optimización
- **Versión:** 3.0.0

---

## Directrices Críticas

### MUST (Obligatorio)
1. SIEMPRE usar audio sprites para múltiples efectos de sonido
2. SIEMPRE llamar `unload()` cuando un sonido ya no se necesita
3. SIEMPRE ajustar `pool` según la cantidad de instancias simultáneas necesarias
4. SIEMPRE usar `html5: true` para archivos grandes (> 5MB)
5. SIEMPRE implementar fade suave para inicio/fin de audio

### FORBIDDEN (Prohibido)
1. NUNCA crear nuevos Howls en el loop del juego
2. NUNCA dejar sonidos cargados sin usar (memory leak)
3. NUNCA usar `setTimeout` para sincronización de audio
4. NUNCA cargar archivos de audio no optimizados

### WHY (Justificación)
- Web Audio mantiene buffers completos en memoria
- Cada Howl consume recursos del sistema
- Audio sprites reducen requests HTTP y uso de memoria
- Los fades evitan clicks/pops al iniciar/detener

---

## Audio Sprites

```javascript
// ✅ BUENO: Un solo archivo
const sfx = new Howl({
  src: ['sfx.webm', 'sfx.mp3'],
  sprite: {
    jump: [0, 400],
    coin: [500, 800],
    die: [1500, 1200]
  }
});

// ❌ MALO: Múltiples archivos
const jump = new Howl({ src: ['jump.mp3'] });
const coin = new Howl({ src: ['coin.mp3'] });
const die = new Howl({ src: ['die.mp3'] });
```

---

## Pool de Instancias

```javascript
// Ajustar según necesidad
const sound = new Howl({
  src: ['sound.mp3'],
  pool: 10  // Default: 5
});
```

---

## Gestión de Memoria

### Unload Individual
```javascript
const sound = new Howl({ src: ['level1.mp3'] });

// Cuando cambias de nivel
sound.unload();
```

### Unload Global
```javascript
// Descargar TODO el audio
Howler.unload();
```

### Auto-cleanup
```javascript
function createManagedSound(options) {
  const sound = new Howl(options);
  
  sound.on('end', function() {
    if (!sound.loop()) {
      sound.unload();
    }
  });
  
  return sound;
}
```

---

## Fade Suave

### Fade In
```javascript
function playWithFadeIn(sound) {
  sound.volume(0);
  sound.play();
  sound.fade(0, 1, 500);
}
```

### Fade Out
```javascript
function stopWithFadeOut(sound, id) {
  sound.fade(1, 0, 500, id);
  sound.once('fade', function() {
    sound.stop(id);
  }, id);
}
```

### Crossfade
```javascript
function crossfade(fromSound, toSound, duration) {
  fromSound.fade(1, 0, duration);
  toSound.volume(0);
  toSound.play();
  toSound.fade(0, 1, duration);
}
```

---

## Optimización de Formatos

### Conversión FFmpeg
```bash
# WebM óptimo para web
ffmpeg -i input.wav -dash 1 -b:a 128k output.webm

# MP3 fallback
ffmpeg -i input.wav -codec:a libmp3lame -q:a 2 output.mp3
```

### Tamaños Recomendados
| Tipo | Tamaño máximo | Formato |
|------|---------------|---------|
| SFX cortos | 100KB | WebM |
| SFX largos | 500KB | WebM |
| Música | 5MB | MP3 (streaming) |
| Ambiente | 2MB | WebM |

---

## Precarga Estratégica

```javascript
// Precargar lo esencial
const essentialSfx = new Howl({
  src: ['essential.webm', 'essential.mp3'],
  preload: true
});

// Cargar bajo demanda
const music = new Howl({
  src: ['music.mp3'],
  html5: true,
  preload: false
});

// Cargar cuando se necesite
function playMusic() {
  if (music.state() === 'unloaded') {
    music.load();
  }
  music.play();
}
```

---

## Checklist de Performance

- [ ] Audio sprites para SFX
- [ ] Pool apropiado configurado
- [ ] Unload cuando no se necesita
- [ ] Archivos optimizados (WebM + MP3)
- [ ] Streaming para archivos grandes
- [ ] Fade suave implementado
- [ ] Sin memory leaks
- [ ] Eventos en lugar de setTimeout

---

## Referencias
- [Código: AudioManager.ts](./assets/AudioManager.ts)
