# Howler.js - Documentación Completa

> **Versión documentada:** v2.2.3 (última estable: v2.2.4)  
> **Fuente:** https://howlerjs.com y https://github.com/goldfire/howler.js  
> **Licencia:** MIT

---

## 📋 Tabla de Contenidos

1. [Visión General](#1-visión-general)
2. [Formatos de Audio Soportados](#2-formatos-de-audio-soportados)
3. [Instalación y Configuración](#3-instalación-y-configuración)
4. [API Completa - Clase Howl](#4-api-completa---clase-howl)
5. [API Global - Objeto Howler](#5-api-global---objeto-howler)
6. [Eventos Disponibles](#6-eventos-disponibles)
7. [Sprites de Audio](#7-sprites-de-audio)
8. [Streaming vs Preload](#8-streaming-vs-preload)
9. [Mobile y HTML5 Audio](#9-mobile-y-html5-audio)
10. [Web Audio API vs HTML5 Audio](#10-web-audio-api-vs-html5-audio)
11. [Audio Espacial (Plugin Spatial)](#11-audio-espacial-plugin-spatial)
12. [Mejores Prácticas](#12-mejores-prácticas)
13. [Errores Comunes](#13-errores-comunes)

---

## 1. Visión General

### ¿Qué es Howler.js?

Howler.js es una biblioteca de audio moderna para JavaScript que simplifica el trabajo con audio en la web. Proporciona una API unificada que funciona de manera consistente en todos los navegadores y plataformas.

### Características Principales

| Característica | Descripción |
|----------------|-------------|
| **API Simplificada** | Una sola API consistente para todas las necesidades de audio |
| **Audio Sprites** | Definición y control fácil de segmentos de audio |
| **Audio Espacial** | Panning estéreo simple o audio 3D avanzado para juegos |
| **Soporte Completo de Codecs** | MP3, MPEG, OPUS, OGG, OGA, WAV, AAC, CAF, M4A, MP4, WEBA, WEBM, DOLBY, FLAC |
| **Fallback Automático** | Web Audio API por defecto, HTML5 Audio como fallback |
| **Control Completo** | play, pause, stop, volume, rate, seek, loop, fade |
| **Cache Automático** | Sonidos cargados se cachean automáticamente para mejor rendimiento |
| **Arquitectura Modular** | Usa solo lo que necesitas |
| **Cero Dependencias** | 100% JavaScript puro, solo 7KB gzipped |

### Casos de Uso

- **Reproductores de música** - Con controles completos de reproducción
- **Videojuegos** - Efectos de sonido, música de fondo, audio posicional 3D
- **Aplicaciones de radio** - Streaming de audio en vivo
- **Experiencias interactivas** - Sonidos activados por usuario
- **Notificaciones** - Alertas y sonidos de feedback
- **Facebook Instant Games** - Soporte oficial integrado

### Compatibilidad de Navegadores

- Google Chrome 7.0+
- Internet Explorer 9.0+
- Firefox 4.0+
- Safari 5.1.4+
- Mobile Safari 6.0+ (requiere interacción del usuario)
- Opera 12.0+
- Microsoft Edge

---

## 2. Formatos de Audio Soportados

### Codecs Soportados

Howler.js soporta todos los formatos de audio compatibles con navegadores:

| Formato | Extensión | Descripción |
|---------|-----------|-------------|
| MP3 | `.mp3` | Formato más compatible, requerido para IE |
| MPEG | `.mpeg` | Stream MPEG |
| Opus | `.opus` | Codec de alta calidad |
| OGG | `.ogg` | Formato abierto |
| OGA | `.oga` | OGG Audio |
| WAV | `.wav` | Audio sin comprimir |
| AAC | `.aac` | Advanced Audio Coding |
| CAF | `.caf` | Core Audio Format (Apple) |
| M4A | `.m4a` | MPEG-4 Audio |
| M4B | `.m4b` | Audiobooks MPEG-4 |
| MP4 | `.mp4` | Contenedor MPEG-4 |
| WEBA | `.weba` | WebM Audio |
| WEBM | `.webm` | Formato WebM |
| DOLBY | `.mp4` | Dolby Audio (Edge/Safari) |
| FLAC | `.flac` | Free Lossless Audio Codec |

### Verificar Soporte de Codecs

```javascript
// Verificar si un codec específico es soportado
if (Howler.codecs('mp3')) {
  console.log('MP3 es soportado');
}

if (Howler.codecs('ogg')) {
  console.log('OGG es soportado');
}
```

### Recomendaciones de Formatos

Para **cobertura completa de navegadores**, se recomienda usar al menos dos formatos:

```javascript
// MEJOR OPCIÓN: WebM + MP3
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});
```

- **WebM** ofrece la mejor combinación de compresión y calidad
- **MP3** es necesario como fallback para Internet Explorer
- **Importante:** Howler selecciona el primer formato compatible del array, así que ordena de preferencia (WebM primero, MP3 segundo)

### WebM Seekable en Firefox

Para que los archivos WebM sean "seekable" (permitan buscar/adelantar) en Firefox, deben codificarse con el elemento `cues`:

```bash
ffmpeg -i sound1.wav -dash 1 sound1.webm
```

### Dolby Audio

Para reproducir Dolby Audio (soportado en Edge y Safari):

```javascript
var dolbySound = new Howl({
  src: ['sound.mp4', 'sound.webm', 'sound.mp3'],
  format: ['dolby', 'webm', 'mp3']  // ¡Debes especificar el formato!
});
```

---

## 3. Instalación y Configuración

### Métodos de Instalación

```bash
# Clonar repositorio
git clone https://github.com/goldfire/howler.js.git

# NPM
npm install howler

# Yarn
yarn add howler

# Bower
bower install howler
```

### CDN

```html
<!-- cdnjs -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>

<!-- jsDelivr -->
<script src="https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.min.js"></script>
```

### Archivos de Distribución

| Archivo | Descripción |
|---------|-------------|
| `howler.js` | Bundle completo (core + spatial) |
| `howler.core.js` | Solo funcionalidad core (sin audio espacial) |
| `howler.spatial.js` | Plugin de audio espacial (requiere howler.core) |

### Uso Básico

**En el navegador:**
```html
<script src="/path/to/howler.js"></script>
<script>
  var sound = new Howl({
    src: ['sound.webm', 'sound.mp3']
  });
</script>
```

**Como módulo ES6:**
```javascript
import { Howl, Howler } from 'howler';

const sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

sound.play();

// Cambiar volumen global
Howler.volume(0.5);
```

**CommonJS:**
```javascript
const { Howl, Howler } = require('howler');
```

---

## 4. API Completa - Clase Howl

### Constructor

```javascript
var sound = new Howl(options);
```

### Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `src` | `Array/String` | `[]` | **REQUERIDO.** URLs de los archivos de audio en orden de preferencia |
| `volume` | `Number` | `1.0` | Volumen del audio (0.0 a 1.0) |
| `html5` | `Boolean` | `false` | Forzar uso de HTML5 Audio |
| `loop` | `Boolean` | `false` | Reproducir en bucle |
| `preload` | `Boolean/String` | `true` | Pre-cargar automáticamente (`true`, `false`, o `'metadata'`) |
| `autoplay` | `Boolean` | `false` | Reproducir automáticamente al cargar |
| `mute` | `Boolean` | `false` | Cargar el audio silenciado |
| `sprite` | `Object` | `{}` | Definición de sprites de audio |
| `rate` | `Number` | `1.0` | Velocidad de reproducción (0.5 a 4.0) |
| `pool` | `Number` | `5` | Tamaño del pool de sonidos inactivos |
| `format` | `Array` | `[]` | Formatos explícitos para archivos sin extensión |
| `xhr` | `Object` | `null` | Configuración de XHR para Web Audio |

### Opciones de Audio Espacial (Spatial)

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `orientation` | `Array` | `[1, 0, 0]` | Dirección del origen de audio en espacio 3D |
| `stereo` | `Number` | `null` | Valor de panning estéreo (-1.0 a 1.0) |
| `pos` | `Array` | `null` | Posición 3D espacial del audio |
| `pannerAttr` | `Object` | `{}` | Atributos del nodo panner |

### Callbacks/Eventos (Opciones)

| Callback | Parámetros | Descripción |
|----------|------------|-------------|
| `onload` | `()` | Se dispara cuando el audio carga |
| `onloaderror` | `(id, error)` | Error al cargar |
| `onplayerror` | `(id, error)` | Error al reproducir |
| `onplay` | `(id)` | Cuando comienza la reproducción |
| `onend` | `(id)` | Cuando termina (incluyendo cada loop) |
| `onpause` | `(id)` | Cuando se pausa |
| `onstop` | `(id)` | Cuando se detiene |
| `onmute` | `(id)` | Cuando se silencia/desilencia |
| `onvolume` | `(id)` | Cuando cambia el volumen |
| `onrate` | `(id)` | Cuando cambia la velocidad |
| `onseek` | `(id)` | Cuando se busca una posición |
| `onfade` | `(id)` | Cuando termina un fade |
| `onunlock` | `()` | Cuando se desbloquea el audio |

### Métodos de Control de Reproducción

#### `play([sprite/id])`
Comienza la reproducción. **No es chainable.**

```javascript
// Reproducir todo el archivo
var id = sound.play();

// Reproducir un sprite específico
sound.play('laser');

// Reanudar un sonido pausado
sound.play(id);
```

**Retorna:** `Number` - ID único del sonido

---

#### `pause([id])`
Pausa la reproducción, guardando la posición actual.

```javascript
// Pausar todo
sound.pause();

// Pausar un sonido específico
sound.pause(id);
```

---

#### `stop([id])`
Detiene la reproducción y resetea `seek` a 0.

```javascript
// Detener todo
sound.stop();

// Detener un sonido específico
sound.stop(id);
```

---

#### `mute([muted], [id])`
Silencia el audio sin pausar.

```javascript
// Obtener estado de mute
var isMuted = sound.mute();

// Silenciar todo
sound.mute(true);

// Desilenciar un sonido específico
sound.mute(false, id);
```

---

#### `volume([volume], [id])`
Obtiene/establece el volumen.

```javascript
// Obtener volumen
var vol = sound.volume();

// Establecer volumen global del grupo (0.0 a 1.0)
sound.volume(0.5);

// Establecer volumen de un sonido específico
sound.volume(0.8, id);
```

---

#### `fade(from, to, duration, [id])`
Realiza un fade entre dos volúmenes.

```javascript
// Fade out de 1.0 a 0.0 en 1 segundo
sound.fade(1.0, 0.0, 1000);

// Fade in de 0.0 a 1.0 en 2 segundos para un sonido específico
sound.fade(0.0, 1.0, 2000, id);
```

---

#### `rate([rate], [id])`
Obtiene/establece la velocidad de reproducción.

```javascript
// Obtener rate actual
var currentRate = sound.rate();

// Mitad de velocidad (0.5 a 4.0)
sound.rate(0.5);

// Doble velocidad para un sonido
sound.rate(2.0, id);
```

---

#### `seek([seek], [id])`
Obtiene/establece la posición de reproducción (en segundos).

```javascript
// Obtener posición actual
var pos = sound.seek();

// Ir a 30 segundos
sound.seek(30);

// Buscar en un sonido específico
sound.seek(15, id);
```

---

#### `loop([loop], [id])`
Obtiene/establece el bucle de reproducción.

```javascript
// Obtener estado de loop
var isLooping = sound.loop();

// Activar loop para todo
sound.loop(true);

// Desactivar loop para un sonido
sound.loop(false, id);
```

---

### Métodos de Estado

#### `state()`
Verifica el estado de carga.

```javascript
var state = sound.state();
// Posibles valores: 'unloaded', 'loading', 'loaded'
```

---

#### `playing([id])`
Verifica si un sonido está reproduciéndose.

```javascript
// ¿Algún sonido del grupo está reproduciéndose?
var isPlaying = sound.playing();

// ¿Este sonido específico está reproduciéndose?
var isPlayingId = sound.playing(id);
```

---

#### `duration([id])`
Obtiene la duración del audio en segundos.

```javascript
// Duración total (requiere que se haya cargado)
var duration = sound.duration();

// Duración de un sprite
var spriteDuration = sound.duration(id);
```

---

### Métodos de Gestión

#### `load()`
Carga manualmente el audio (si `preload: false`).

```javascript
var sound = new Howl({
  src: ['sound.mp3'],
  preload: false
});

// Cargar más tarde
sound.load();
```

---

#### `unload()`
Descarga y destruye el objeto Howl.

```javascript
sound.unload();
```

---

### Métodos de Eventos

#### `on(event, function, [id])`
Registra un listener de evento.

```javascript
// Escuchar evento de carga
sound.on('load', function() {
  console.log('Audio cargado!');
});

// Escuchar fin de reproducción para un sonido específico
sound.on('end', function() {
  console.log('Terminó!');
}, id);
```

**Eventos disponibles:** `load`, `loaderror`, `playerror`, `play`, `end`, `pause`, `stop`, `mute`, `volume`, `rate`, `seek`, `fade`, `unlock`

---

#### `once(event, function, [id])`
Similar a `on`, pero se ejecuta solo una vez.

```javascript
sound.once('load', function() {
  console.log('Esto solo se ejecuta una vez');
});
```

---

#### `off(event, [function], [id])`
Elimina listeners de eventos.

```javascript
// Eliminar todos los listeners de un evento
sound.off('end');

// Eliminar un listener específico
sound.off('end', myCallback);

// Eliminar todos los eventos
sound.off();
```

---

## 5. API Global - Objeto Howler

### Propiedades Globales (Opciones)

| Propiedad | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `usingWebAudio` | `Boolean` | - | `true` si Web Audio API está disponible (solo lectura) |
| `noAudio` | `Boolean` | - | `true` si no hay soporte de audio (solo lectura) |
| `autoUnlock` | `Boolean` | `true` | Intenta desbloquear audio automáticamente en móviles |
| `html5PoolSize` | `Number` | `10` | Tamaño del pool de nodos HTML5 Audio |
| `autoSuspend` | `Boolean` | `true` | Suspende AudioContext después de 30s de inactividad |
| `ctx` | `AudioContext` | - | Expone el AudioContext (Web Audio Only) |
| `masterGain` | `GainNode` | - | Expone el nodo de ganancia maestra (Web Audio Only) |

### Métodos Globales

#### `Howler.mute(muted)`
Silencia/Desilencia todos los sonidos.

```javascript
Howler.mute(true);   // Silenciar todo
Howler.mute(false);  // Desilenciar todo
```

---

#### `Howler.volume([volume])`
Obtiene/establece el volumen global.

```javascript
// Obtener volumen global
var globalVol = Howler.volume();

// Establecer volumen global (afecta a todos los Howls)
Howler.volume(0.5);
```

---

#### `Howler.stop()`
Detiene todos los sonidos de todos los Howls.

```javascript
Howler.stop();
```

---

#### `Howler.codecs(ext)`
Verifica soporte de codec.

```javascript
if (Howler.codecs('mp3')) {
  console.log('MP3 soportado');
}
```

**Parámetros:** `mp3`, `mpeg`, `opus`, `ogg`, `oga`, `wav`, `aac`, `caf`, `m4a`, `m4b`, `mp4`, `weba`, `webm`, `dolby`, `flac`

---

#### `Howler.unload()`
Descarga y destruye TODOS los Howls.

```javascript
Howler.unload();
```

---

## 6. Eventos Disponibles

### Eventos del Core

| Evento | Parámetros | Descripción | Cuándo se dispara |
|--------|------------|-------------|-------------------|
| `load` | `()` | Audio cargado exitosamente | Después de cargar |
| `loaderror` | `(id, error)` | Error de carga | Falla al cargar |
| `playerror` | `(id, error)` | Error de reproducción | Falla al reproducir |
| `play` | `(id)` | Comenzó a reproducirse | Inicio de reproducción |
| `end` | `(id)` | Terminó de reproducirse | Fin de audio/loop |
| `pause` | `(id)` | Fue pausado | Al pausar |
| `stop` | `(id)` | Fue detenido | Al detener |
| `mute` | `(id)` | Mute cambió | Al silenciar/desilenciar |
| `volume` | `(id)` | Volumen cambió | Al cambiar volumen |
| `rate` | `(id)` | Rate cambió | Al cambiar velocidad |
| `seek` | `(id)` | Posición cambió | Al buscar |
| `fade` | `(id)` | Fade completado | Al terminar fade |
| `unlock` | `()` | Audio desbloqueado | Desbloqueo móvil |

### Códigos de Error de Carga

Según la especificación HTML5:

| Código | Significado |
|--------|-------------|
| `1` | El proceso de fetching fue abortado |
| `2` | Error de red después de establecer el recurso |
| `3` | Error de decodificación del recurso |
| `4` | El recurso no es adecuado |

### Ejemplos de Eventos

```javascript
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});

// Evento único (se elimina después de ejecutarse)
sound.once('load', function() {
  sound.play();
});

// Escuchar múltiples veces
sound.on('end', function() {
  console.log('¡Sonido terminado!');
});

// Manejar errores de reproducción
sound.on('playerror', function(id, error) {
  console.log('Error al reproducir:', error);
});

// Remover listener
sound.off('end');
```

---

## 7. Sprites de Audio

Los **Audio Sprites** permiten definir segmentos específicos de un archivo de audio para reproducción independiente.

### Definición de Sprites

```javascript
var sound = new Howl({
  src: ['sounds.webm', 'sounds.mp3'],
  sprite: {
    // nombre: [offset_ms, duration_ms, (loop)]
    blast: [0, 3000],           // Comienza en 0ms, dura 3 segundos
    laser: [4000, 1000],        // Comienza en 4s, dura 1 segundo
    winner: [6000, 5000],       // Comienza en 6s, dura 5 segundos
    bgm: [12000, 30000, true]   // Comienza en 12s, dura 30s, en loop
  }
});
```

### Reproducción de Sprites

```javascript
// Reproducir sprite específico
sound.play('laser');
sound.play('blast');

// Obtener duración de un sprite
var laserDuration = sound.duration('laser'); // 1000ms
```

### Generación de Sprites

Herramienta recomendada: [audiosprite](https://github.com/tonistiigi/audiosprite)

```bash
npm install -g audiosprite
audiosprite *.mp3 -o sounds
```

### Beneficios de los Sprites

1. **Menos requests HTTP** - Un solo archivo vs múltiples archivos
2. **Menor uso de memoria** - Un buffer de audio compartido
3. **Sincronización perfecta** - No hay latencia entre sonidos
4. **Mejor para juegos** - Efectos de sonido precisos

---

## 8. Streaming vs Preload

### Preload (Default: `true`)

```javascript
// Precarga completa (Web Audio)
var sound = new Howl({
  src: ['sound.mp3'],
  preload: true  // o simplemente omitir
});
```

**Características:**
- Descarga el archivo completo antes de reproducir
- Necesario para Web Audio API
- Permite reproducción inmediata
- Mayor uso de memoria
- No adecuado para archivos grandes

---

### Precarga de Metadata (HTML5)

```javascript
var sound = new Howl({
  src: ['sound.mp3'],
  html5: true,
  preload: 'metadata'  // Solo carga metadatos
});
```

**Características:**
- Solo obtiene duración y metadatos
- Ahorra ancho de banda
- Útil cuando necesitas la duración sin descargar todo

---

### Streaming (HTML5 Audio)

```javascript
// Audio en streaming
var sound = new Howl({
  src: ['stream.mp3'],
  html5: true,  // ¡Obligatorio para streaming!
  preload: false  // Opcional: no precargar
});

sound.play();
```

**Características:**
- Comienza a reproducir antes de descargar todo
- Ideal para archivos grandes o radio en vivo
- Menor uso de memoria
- No permite manipulación avanzada (rate, posición exacta)
- Usa HTML5 Audio en lugar de Web Audio

### Cuándo Usar Cada Uno

| Escenario | Recomendación |
|-----------|---------------|
| Efectos de sonido cortos | Preload + Web Audio |
| Música de fondo larga | HTML5 (streaming) |
| Radio en vivo | HTML5 + `html5: true` |
| Archivos > 5MB | HTML5 (streaming) |
| Juegos con muchos SFX | Audio Sprites + Web Audio |
| Necesitas rate/seek preciso | Web Audio |

---

## 9. Mobile y HTML5 Audio

### Desbloqueo de Audio en Mobile

En iOS, Android y Chrome/Safari de escritorio, el audio está **bloqueado hasta la primera interacción del usuario**.

#### Comportamiento por Defecto

Howler.js intenta desbloquear automáticamente el audio en el primer evento `touchend`:

```javascript
// Desactivar desbloqueo automático (si lo necesitas)
Howler.autoUnlock = false;
```

#### Manejo Manual del Desbloqueo

```javascript
var sound = new Howl({
  src: ['sound.mp3'],
  onplayerror: function(id, error) {
    // Esperar al evento unlock
    sound.once('unlock', function() {
      sound.play();
    });
  }
});

// Intentar reproducir (fallará en móvil hasta interacción)
sound.play();
```

### Pool de HTML5 Audio

Cada objeto HTML5 Audio debe desbloquearse individualmente. Howler mantiene un pool global:

```javascript
// Tamaño del pool (default: 10)
Howler.html5PoolSize = 20;
```

### Consideraciones Mobile

1. **Siempre requiere interacción del usuario** para iniciar audio
2. **No uses `autoplay`** en móviles (será bloqueado)
3. **Volumen del sistema** controla el audio (no se puede cambiar por JS)
4. **Modo silencioso** silencia el audio del navegador
5. **AudioContext se suspende** cuando la app está en segundo plano

### Suspend/Resume Automático

```javascript
// Desactivar suspensión automática
Howler.autoSuspend = false;
```

Por defecto, Web Audio se suspende después de 30 segundos de inactividad para ahorrar batería.

---

## 10. Web Audio API vs HTML5 Audio

### Comparación

| Característica | Web Audio API | HTML5 Audio |
|----------------|---------------|-------------|
| **Modo default** | ✅ Sí | Fallback |
| **Streaming** | ❌ No | ✅ Sí |
| **Rate control** | ✅ Sí | ⚠️ Limitado |
| **Seek preciso** | ✅ Sí | ⚠️ Limitado |
| **Audio 3D** | ✅ Sí | ❌ No |
| **Filtros** | ✅ Sí | ❌ No |
| **Memoria** | Más alta | Más baja |
| **Archivos grandes** | ❌ No recomendado | ✅ Recomendado |
| **Latencia** | Baja | Alta |
| **IE9+** | ❌ No | ✅ Sí |

### Forzar HTML5 Audio

```javascript
var sound = new Howl({
  src: ['sound.mp3'],
  html5: true  // Forzar HTML5 Audio
});
```

### Detectar Qué Se Está Usando

```javascript
if (Howler.usingWebAudio) {
  console.log('Usando Web Audio API');
} else if (!Howler.noAudio) {
  console.log('Usando HTML5 Audio');
} else {
  console.log('Sin soporte de audio');
}
```

### Acceso al AudioContext (Web Audio)

```javascript
// Obtener el AudioContext
var ctx = Howler.ctx;

// Obtener el nodo de ganancia maestra
var masterGain = Howler.masterGain;

// Usar para plugins o procesamiento avanzado
```

---

## 11. Audio Espacial (Plugin Spatial)

El plugin de audio espacial agrega capacidades 3D y estéreo a Howler.js.

### Opciones del Spatial

```javascript
var sound = new Howl({
  src: ['sound.mp3'],
  
  // Orientación del origen de audio [x, y, z]
  orientation: [1, 0, 0],
  
  // Panning estéreo (-1.0 = izquierda, 1.0 = derecha)
  stereo: 0.0,
  
  // Posición 3D del audio [x, y, z]
  pos: [0, 0, 0],
  
  // Atributos del panner
  pannerAttr: {
    coneInnerAngle: 360,
    coneOuterAngle: 360,
    coneOuterGain: 0,
    distanceModel: 'inverse',  // 'linear', 'inverse', 'exponential'
    maxDistance: 10000,
    refDistance: 1,
    rolloffFactor: 1,
    panningModel: 'HRTF'  // 'HRTF' o 'equalpower'
  },
  
  // Callbacks
  onstereo: function(id) { console.log('Stereo cambiado'); },
  onpos: function(id) { console.log('Posición cambiada'); },
  onorientation: function(id) { console.log('Orientación cambiada'); }
});
```

### Métodos de Audio Espacial

#### `stereo(pan, [id])`
Panning estéreo simple.

```javascript
// Pan completo a la izquierda
sound.stereo(-1.0);

// Centro
sound.stereo(0);

// Pan completo a la derecha
sound.stereo(1.0);
```

---

#### `pos(x, y, z, [id])`
Posición 3D del origen de audio.

```javascript
// Posicionar en espacio 3D
sound.pos(10, 5, -5);

// Obtener posición actual
var pos = sound.pos();
console.log(pos); // [10, 5, -5]
```

---

#### `orientation(x, y, z, [id])`
Orientación del origen de audio (hacia dónde "mira").

```javascript
// La fuente apunta hacia el frente
sound.orientation(1, 0, 0);

// La fuente apunta hacia arriba
sound.orientation(0, 1, 0);
```

---

#### `pannerAttr(o, [id])`
Atributos del panner node.

```javascript
sound.pannerAttr({
  coneInnerAngle: 60,      // Ángulo interno del cono
  coneOuterAngle: 120,     // Ángulo externo del cono
  coneOuterGain: 0.3,      // Volumen fuera del cono
  distanceModel: 'exponential',
  maxDistance: 1000,
  refDistance: 10,
  rolloffFactor: 2,
  panningModel: 'HRTF'
});
```

### Métodos Globales de Audio Espacial

#### `Howler.stereo(pan)`
Panning estéreo global.

```javascript
Howler.stereo(-0.5);  // Todo el audio desplazado a la izquierda
```

---

#### `Howler.pos(x, y, z)`
Posición del listener en 3D.

```javascript
// Actualizar posición del "oyente" (cámara del juego)
function updateListenerPosition(x, y, z) {
  Howler.pos(x, y, z);
}
```

---

#### `Howler.orientation(x, y, z, xUp, yUp, zUp)`
Orientación del listener.

```javascript
// Vector frontal y vector arriba
Howler.orientation(0, 0, -1, 0, 1, 0);
```

### Ejemplo: Audio 3D para Juegos

```javascript
// Sonido de un enemigo
var enemySound = new Howl({
  src: ['enemy.mp3'],
  loop: true,
  volume: 0.8,
  pos: [50, 0, 30],  // Posición del enemigo
  pannerAttr: {
    coneInnerAngle: 360,
    distanceModel: 'inverse',
    maxDistance: 500,
    refDistance: 5,
    rolloffFactor: 1
  }
});

// Actualizar posición del jugador (listener)
function updatePlayerPosition(x, y, z) {
  Howler.pos(x, y, z);
}

// Actualizar orientación del jugador
function updatePlayerRotation(frontX, frontY, frontZ) {
  Howler.orientation(frontX, frontY, frontZ, 0, 1, 0);
}

// Mover el enemigo
function moveEnemy(x, y, z) {
  enemySound.pos(x, y, z);
}

enemySound.play();
```

---

## 12. Mejores Prácticas

### Performance

#### 1. Usa Audio Sprites para Efectos de Sonido

```javascript
// ❌ Malo: Múltiples requests
var laser = new Howl({ src: ['laser.mp3'] });
var explosion = new Howl({ src: ['explosion.mp3'] });
var powerup = new Howl({ src: ['powerup.mp3'] });

// ✅ Bueno: Un solo archivo con sprites
var sfx = new Howl({
  src: ['sfx.webm', 'sfx.mp3'],
  sprite: {
    laser: [0, 500],
    explosion: [500, 1500],
    powerup: [2000, 800]
  }
});
```

#### 2. Pool Size Apropiado

```javascript
// Ajustar según necesidad
var sound = new Howl({
  src: ['sound.mp3'],
  pool: 10  // Default: 5
});
```

#### 3. Unload cuando no se necesite

```javascript
// Liberar memoria
sound.unload();

// O descargar todo
Howler.unload();
```

### Precarga Estratégica

```javascript
// Precargar efectos importantes al inicio
var essentialSfx = new Howl({
  src: ['essential.webm', 'essential.mp3'],
  preload: true
});

// Cargar música bajo demanda
var music = new Howl({
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

### Gestión de Memoria

```javascript
// Monitorear número de Howls activos
var activeSounds = [];

function createManagedSound(options) {
  var sound = new Howl(options);
  activeSounds.push(sound);
  
  // Auto-cleanup al terminar
  sound.on('end', function() {
    if (!sound.loop()) {
      var index = activeSounds.indexOf(sound);
      if (index > -1) {
        activeSounds.splice(index, 1);
        sound.unload();
      }
    }
  });
  
  return sound;
}

// Cleanup global
function cleanupAllSounds() {
  Howler.unload();
  activeSounds = [];
}
```

### Fade Suave

```javascript
// Fade in al comenzar
function playWithFade(sound) {
  sound.volume(0);
  sound.play();
  sound.fade(0, 1, 500);
}

// Fade out al terminar
function stopWithFade(sound, id) {
  sound.fade(1, 0, 500, id);
  sound.once('fade', function() {
    sound.stop(id);
  }, id);
}
```

### Crossfade entre Pistas

```javascript
function crossfade(fromSound, toSound, duration) {
  fromSound.fade(1, 0, duration);
  toSound.volume(0);
  toSound.play();
  toSound.fade(0, 1, duration);
}
```

### Manejo de Errores Robusto

```javascript
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3'],
  
  onloaderror: function(id, error) {
    console.error('Error cargando audio:', error);
    // Intentar con fallback
    loadFallbackAudio();
  },
  
  onplayerror: function(id, error) {
    console.error('Error reproduciendo:', error);
    // Esperar unlock en móviles
    sound.once('unlock', function() {
      sound.play();
    });
  }
});
```

---

## 13. Errores Comunes

### ❌ NO hagas esto:

#### 1. Autoplay sin manejo de error

```javascript
// ❌ Malo: No funcionará en móviles
var sound = new Howl({
  src: ['sound.mp3'],
  autoplay: true
});

// ✅ Bueno: Manejar error de reproducción
var sound = new Howl({
  src: ['sound.mp3'],
  onplayerror: function(id, error) {
    sound.once('unlock', function() {
      sound.play();
    });
  }
});

// Reproducir después de interacción del usuario
document.getElementById('playBtn').addEventListener('click', function() {
  sound.play();
});
```

#### 2. Múltiples formatos en orden incorrecto

```javascript
// ❌ Malo: MP3 se cargará primero aunque WebM es mejor
var sound = new Howl({
  src: ['sound.mp3', 'sound.webm']
});

// ✅ Bueno: WebM primero, MP3 como fallback
var sound = new Howl({
  src: ['sound.webm', 'sound.mp3']
});
```

#### 3. Usar Web Audio para archivos grandes

```javascript
// ❌ Malo: Consumirá mucha memoria
var music = new Howl({
  src: ['long-music-track.mp3']  // 10MB+
});

// ✅ Bueno: Usar HTML5 para streaming
var music = new Howl({
  src: ['long-music-track.mp3'],
  html5: true
});
```

#### 4. No verificar soporte de codecs

```javascript
// ❌ Malo: Asumir que MP3 funciona
var sound = new Howl({
  src: ['sound.mp3']
});

// ✅ Bueno: Verificar y proporcionar alternativas
var formats = ['webm', 'mp3'].filter(function(ext) {
  return Howler.codecs(ext);
});

var sound = new Howl({
  src: formats.map(function(ext) { return 'sound.' + ext; })
});
```

#### 5. Olvidar el ID al controlar sonidos individuales

```javascript
// ❌ Malo: Afecta a todos los sonidos del grupo
var id1 = sound.play();
var id2 = sound.play();
sound.pause();  // Pausa AMBOS

// ✅ Bueno: Controlar individualmente
var id1 = sound.play();
var id2 = sound.play();
sound.pause(id1);  // Solo pausa id1
sound.rate(1.5, id2);  // Solo afecta a id2
```

#### 6. No manejar eventos de carga

```javascript
// ❌ Malo: La duración es 0 antes de cargar
var sound = new Howl({ src: ['sound.mp3'] });
console.log(sound.duration());  // 0

// ✅ Bueno: Esperar al evento load
var sound = new Howl({
  src: ['sound.mp3'],
  onload: function() {
    console.log('Duración:', sound.duration());
  }
});

// O con once
sound.once('load', function() {
  console.log('Duración:', sound.duration());
});
```

#### 7. Crear múltiples instancias del mismo sonido

```javascript
// ❌ Malo: Múltiples instancias consumen memoria
function playLaser() {
  var laser = new Howl({ src: ['laser.mp3'] });
  laser.play();
}

// ✅ Bueno: Reutilizar la instancia
var laser = new Howl({ src: ['laser.mp3'] });
function playLaser() {
  laser.play();
}
```

#### 8. Ignorar memory leaks

```javascript
// ❌ Malo: Nunca descargar
function changeLevel() {
  level1Music = new Howl({ src: ['level1.mp3'] });
  level2Music = new Howl({ src: ['level2.mp3'] });
}

// ✅ Bueno: Limpiar antes de cargar nuevo
function changeLevel() {
  if (level1Music) {
    level1Music.unload();
  }
  level2Music = new Howl({ src: ['level2.mp3'] });
}
```

---

## Ejemplos Completos

### Reproductor de Música Básico

```javascript
var music = new Howl({
  src: ['music.webm', 'music.mp3'],
  html5: true,
  loop: true,
  volume: 0.5,
  onend: function() {
    console.log('Loop completado');
  }
});

// Controles
function togglePlay() {
  if (music.playing()) {
    music.pause();
  } else {
    music.play();
  }
}

function setVolume(val) {
  music.volume(val);
}

function seekTo(percent) {
  var duration = music.duration();
  music.seek(duration * percent);
}
```

### Sistema de Efectos de Sonido para Juegos

```javascript
var GameAudio = {
  sfx: null,
  bgm: null,
  
  init: function() {
    this.sfx = new Howl({
      src: ['sfx.webm', 'sfx.mp3'],
      sprite: {
        jump: [0, 500],
        coin: [500, 800],
        die: [1500, 1200],
        win: [3000, 2000]
      }
    });
    
    this.bgm = new Howl({
      src: ['bgm.mp3'],
      html5: true,
      loop: true,
      volume: 0.3
    });
  },
  
  playSfx: function(name) {
    this.sfx.play(name);
  },
  
  playBgm: function() {
    this.bgm.play();
  },
  
  stopBgm: function() {
    this.bgm.stop();
  },
  
  setBgmVolume: function(vol) {
    this.bgm.volume(vol);
  },
  
  setSfxVolume: function(vol) {
    this.sfx.volume(vol);
  }
};

// Uso
GameAudio.init();
GameAudio.playSfx('jump');
GameAudio.playBgm();
```

### Audio Posicional 3D

```javascript
// Configurar sistema de audio 3D
var worldAudio = {
  playerPos: [0, 0, 0],
  playerDir: [0, 0, -1],
  
  sounds: {},
  
  init: function() {
    // Actualizar listener cada frame
    this.updateListener();
  },
  
  addSound: function(id, src, pos) {
    this.sounds[id] = new Howl({
      src: src,
      loop: true,
      pos: pos,
      pannerAttr: {
        distanceModel: 'inverse',
        maxDistance: 100,
        refDistance: 5,
        rolloffFactor: 1
      }
    });
    this.sounds[id].play();
  },
  
  updatePlayer: function(x, y, z, dx, dy, dz) {
    this.playerPos = [x, y, z];
    this.playerDir = [dx, dy, dz];
    
    Howler.pos(x, y, z);
    Howler.orientation(dx, dy, dz, 0, 1, 0);
  },
  
  moveSound: function(id, x, y, z) {
    if (this.sounds[id]) {
      this.sounds[id].pos(x, y, z);
    }
  }
};

// Uso en juego
worldAudio.init();
worldAudio.addSound('enemy1', ['enemy.mp3'], [10, 0, 10]);
worldAudio.addSound('fire', ['fire.mp3'], [-5, 0, 8]);

// En el loop del juego
function gameLoop() {
  worldAudio.updatePlayer(
    player.x, player.y, player.z,
    player.dirX, player.dirY, player.dirZ
  );
}
```

---

## Recursos Adicionales

- **Sitio oficial:** https://howlerjs.com
- **GitHub:** https://github.com/goldfire/howler.js
- **Demos en vivo:** https://howlerjs.com/#player
- **npm:** https://www.npmjs.com/package/howler
- **Problemas/Issues:** https://github.com/goldfire/howler.js/issues

---

*Documentación generada el 18 de febrero de 2026 basada en Howler.js v2.2.3/2.2.4*
