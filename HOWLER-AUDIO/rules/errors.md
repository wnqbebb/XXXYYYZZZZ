---
name: errors
description: Errores comunes, anti-patrones y cómo evitarlos
---

# Regla: Errores Comunes

## Metadatos
- **Nombre:** errors
- **Descripción:** Errores comunes, anti-patrones y cómo evitarlos
- **Versión:** 3.0.0

---

## Error #1: Autoplay sin Manejo de Error

### ❌ Incorrecto
```javascript
const sound = new Howl({
  src: ['sound.mp3'],
  autoplay: true  // Fallará en móviles!
});
```

### ✅ Correcto
```javascript
const sound = new Howl({
  src: ['sound.mp3'],
  onplayerror: function(id, error) {
    sound.once('unlock', function() {
      sound.play();
    });
  }
});

// Reproducir después de interacción
document.getElementById('playBtn').addEventListener('click', () => {
  sound.play();
});
```

---

## Error #2: Orden Incorrecto de Formatos

### ❌ Incorrecto
```javascript
const sound = new Howl({
  src: ['sound.mp3', 'sound.webm']  // MP3 primero = peor calidad
});
```

### ✅ Correcto
```javascript
const sound = new Howl({
  src: ['sound.webm', 'sound.mp3']  // WebM primero, MP3 fallback
});
```

---

## Error #3: Web Audio para Archivos Grandes

### ❌ Incorrecto
```javascript
const music = new Howl({
  src: ['long-track.mp3']  // 10MB+ en memoria!
});
```

### ✅ Correcto
```javascript
const music = new Howl({
  src: ['long-track.mp3'],
  html5: true  // Streaming, bajo uso de memoria
});
```

---

## Error #4: No Verificar Carga

### ❌ Incorrecto
```javascript
const sound = new Howl({ src: ['sound.mp3'] });
console.log(sound.duration());  // 0 - no cargado aún
```

### ✅ Correcto
```javascript
const sound = new Howl({
  src: ['sound.mp3'],
  onload: function() {
    console.log('Duración:', sound.duration());
  }
});

// O
sound.once('load', function() {
  console.log('Duración:', sound.duration());
});
```

---

## Error #5: Control sin ID

### ❌ Incorrecto
```javascript
const id1 = sound.play();
const id2 = sound.play();
sound.pause();  // Pausa AMBOS
```

### ✅ Correcto
```javascript
const id1 = sound.play();
const id2 = sound.play();
sound.pause(id1);  // Solo pausa id1
sound.rate(1.5, id2);  // Solo afecta id2
```

---

## Error #6: Crear Múltiples Instancias

### ❌ Incorrecto
```javascript
function playLaser() {
  const laser = new Howl({ src: ['laser.mp3'] });  // Nueva instancia!
  laser.play();
}
```

### ✅ Correcto
```javascript
const laser = new Howl({ src: ['laser.mp3'] });

function playLaser() {
  laser.play();  // Reutiliza instancia
}
```

---

## Error #7: Memory Leaks

### ❌ Incorrecto
```javascript
function changeLevel() {
  level1Music = new Howl({ src: ['level1.mp3'] });
  // ... más tarde
  level2Music = new Howl({ src: ['level2.mp3'] });
  // level1Music sigue en memoria!
}
```

### ✅ Correcto
```javascript
function changeLevel() {
  if (level1Music) {
    level1Music.unload();  // Liberar memoria
  }
  level2Music = new Howl({ src: ['level2.mp3'] });
}
```

---

## Error #8: setTimeout para Sincronización

### ❌ Incorrecto
```javascript
sound.play();
setTimeout(() => {
  sound.pause();  // Puede no estar sincronizado
}, 1000);
```

### ✅ Correcto
```javascript
sound.play();
sound.once('play', function() {
  // Audio realmente comenzó
});

// O usar duración conocida
setTimeout(() => {
  sound.pause();
}, sound.duration() * 1000);
```

---

## Error #9: Ignorar Errores de Carga

### ❌ Incorrecto
```javascript
const sound = new Howl({
  src: ['sound.mp3']
  // Sin manejo de error
});
```

### ✅ Correcto
```javascript
const sound = new Howl({
  src: ['sound.webm', 'sound.mp3'],
  onloaderror: function(id, error) {
    console.error('Error cargando:', error);
    // Intentar fallback o mostrar error al usuario
  },
  onplayerror: function(id, error) {
    console.error('Error reproduciendo:', error);
    sound.once('unlock', function() {
      sound.play();
    });
  }
});
```

---

## Códigos de Error

| Código | Significado |
|--------|-------------|
| 1 | Fetching abortado |
| 2 | Error de red |
| 3 | Error de decodificación |
| 4 | Recurso no adecuado |

---

## Checklist Anti-Errores

- [ ] Manejar `onplayerror` para móviles
- [ ] Orden correcto de formatos (WebM primero)
- [ ] Verificar carga antes de usar propiedades
- [ ] Usar IDs para control individual
- [ ] Reutilizar instancias de Howl
- [ ] Llamar `unload()` para cleanup
- [ ] Manejar errores de carga y reproducción
- [ ] Usar eventos, no setTimeout
