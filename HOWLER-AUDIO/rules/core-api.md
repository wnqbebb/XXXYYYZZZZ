---
name: core-api
description: API Core de Howler.js - Clase Howl, objeto Howler global, métodos de control, eventos y callbacks
---

# Regla: API Core de Howler.js

## Metadatos
- **Nombre:** core-api
- **Descripción:** API Core de Howler.js - Clase Howl, objeto Howler global, métodos de control, eventos y callbacks
- **Versión:** 3.0.0

---

## Directrices Críticas

### MUST (Obligatorio)
1. SIEMPRE usar el orden correcto de formatos: ['webm', 'mp3'] - WebM primero, MP3 como fallback
2. SIEMPRE capturar el ID retornado por `play()` para controlar instancias individuales
3. SIEMPRE usar `onload` o `once('load')` antes de acceder a `duration()`
4. SIEMPRE manejar `onplayerror` para desbloqueo en móviles
5. SIEMPRE llamar `unload()` cuando un sonido ya no se necesita

### FORBIDDEN (Prohibido)
1. NUNCA usar `autoplay: true` sin manejo de errores (bloqueado en móviles)
2. NUNCA asumir que `duration()` está disponible inmediatamente
3. NUNCA crear múltiples Howls para el mismo archivo de audio
4. NUNCA usar `setTimeout` para sincronización de audio (usar eventos)
5. NUNCA modificar `Howler.ctx` directamente sin conocimiento de Web Audio

### WHY (Justificación)
- WebM ofrece mejor compresión que MP3, pero IE necesita MP3
- Cada llamada a `play()` retorna un ID único necesario para control individual
- La duración solo está disponible después de cargar los metadatos
- Los navegadores móviles bloquean audio hasta interacción del usuario
- Web Audio API mantiene buffers en memoria; unload libera recursos

---

## API Clase Howl

### Constructor
```javascript
const sound = new Howl({
  src: ['sound.webm', 'sound.mp3'],  // REQUERIDO
  volume: 1.0,                       // 0.0 a 1.0
  html5: false,                      // Forzar HTML5 Audio
  loop: false,
  preload: true,                     // true, false, 'metadata'
  autoplay: false,
  mute: false,
  sprite: {},
  rate: 1.0,                         // 0.5 a 4.0
  pool: 5,
  format: [],
  onload: function() {},
  onloaderror: function(id, error) {},
  onplayerror: function(id, error) {},
  onplay: function(id) {},
  onend: function(id) {},
  onpause: function(id) {},
  onstop: function(id) {},
  onmute: function(id) {},
  onvolume: function(id) {},
  onrate: function(id) {},
  onseek: function(id) {},
  onfade: function(id) {},
  onunlock: function() {}
});
```

### Métodos de Control
| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `play([sprite/id])` | Reproduce audio | `const id = sound.play()` |
| `pause([id])` | Pausa reproducción | `sound.pause(id)` |
| `stop([id])` | Detiene y resetea | `sound.stop(id)` |
| `mute([muted], [id])` | Silencia/desilencia | `sound.mute(true, id)` |
| `volume([vol], [id])` | Obtiene/establece volumen | `sound.volume(0.5, id)` |
| `fade(from, to, duration, [id])` | Fade entre volúmenes | `sound.fade(1, 0, 1000, id)` |
| `rate([rate], [id])` | Velocidad reproducción | `sound.rate(1.5, id)` |
| `seek([seek], [id])` | Posición en segundos | `sound.seek(30, id)` |
| `loop([loop], [id])` | Activa/desactiva loop | `sound.loop(true, id)` |

### Métodos de Estado
| Método | Retorna | Descripción |
|--------|---------|-------------|
| `state()` | 'unloaded' \| 'loading' \| 'loaded' | Estado de carga |
| `playing([id])` | boolean | Si está reproduciendo |
| `duration([id])` | number | Duración en segundos |

### Métodos de Gestión
| Método | Descripción |
|--------|-------------|
| `load()` | Carga manual (si preload: false) |
| `unload()` | Descarga y destruye |
| `on(event, fn, [id])` | Registra evento |
| `once(event, fn, [id])` | Evento de una sola vez |
| `off(event, [fn], [id])` | Elimina eventos |

---

## API Global Howler

### Propiedades
| Propiedad | Tipo | Descripción |
|-----------|------|-------------|
| `usingWebAudio` | boolean | Si usa Web Audio API |
| `noAudio` | boolean | Si no hay soporte de audio |
| `autoUnlock` | boolean | Desbloqueo automático (default: true) |
| `html5PoolSize` | number | Tamaño pool HTML5 (default: 10) |
| `autoSuspend` | boolean | Suspensión automática (default: true) |
| `ctx` | AudioContext | Contexto Web Audio |
| `masterGain` | GainNode | Nodo ganancia maestra |

### Métodos
| Método | Descripción | Ejemplo |
|--------|-------------|---------|
| `mute(muted)` | Silencia todo | `Howler.mute(true)` |
| `volume([vol])` | Volumen global | `Howler.volume(0.5)` |
| `stop()` | Detiene todos | `Howler.stop()` |
| `codecs(ext)` | Verifica codec | `Howler.codecs('mp3')` |
| `unload()` | Descarga todo | `Howler.unload()` |

---

## Eventos Disponibles

| Evento | Parámetros | Cuándo se dispara |
|--------|------------|-------------------|
| `load` | `()` | Audio cargado exitosamente |
| `loaderror` | `(id, error)` | Error al cargar |
| `playerror` | `(id, error)` | Error al reproducir |
| `play` | `(id)` | Comenzó reproducción |
| `end` | `(id)` | Terminó (incluye loops) |
| `pause` | `(id)` | Fue pausado |
| `stop` | `(id)` | Fue detenido |
| `mute` | `(id)` | Cambió estado de mute |
| `volume` | `(id)` | Cambió volumen |
| `rate` | `(id)` | Cambió velocidad |
| `seek` | `(id)` | Cambió posición |
| `fade` | `(id)` | Completó fade |
| `unlock` | `()` | Audio desbloqueado |

---

## Ejemplos

### ✅ Correcto
```javascript
const sound = new Howl({
  src: ['audio.webm', 'audio.mp3'],
  onload: function() {
    console.log('Cargado, duración:', sound.duration());
  },
  onplayerror: function(id, error) {
    sound.once('unlock', function() {
      sound.play();
    });
  }
});

const id = sound.play();
sound.volume(0.5, id);
```

### ❌ Incorrecto
```javascript
// Mal: No maneja errores
const sound = new Howl({
  src: ['audio.mp3'],  // Solo MP3, sin WebM
  autoplay: true       // Fallará en móviles
});

console.log(sound.duration()); // 0 - aún no cargado

sound.play();
sound.pause();  // Pausa TODAS las instancias, no solo la última
```

---

## Referencias
- [Código: useHowler.ts](./assets/useHowler.ts)
- [Código: AudioManager.ts](./assets/AudioManager.ts)
