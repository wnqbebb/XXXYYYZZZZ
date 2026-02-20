---
name: splittype-performance
description: Optimización y mejores prácticas de rendimiento para animaciones con SplitType. Garantiza 60fps en todas las animaciones.
tags: [splittype, performance, optimization, 60fps, gpu]
version: 1.0.0
---

# SplitType Performance Optimization

Guía definitiva para garantizar 60fps en animaciones tipográficas con SplitType. Rendimiento es crítico para experiencias premiadas.

---

## Métricas de Performance

### Target: 60fps

- **16.67ms** por frame (1000ms / 60)
- **10ms** de JavaScript por frame (deja 6ms para browser)
- **0** layout thrashing
- **0** forced synchronous layout

### Lighthouse Scores Target

```yaml
Performance: 90+
First Contentful Paint: < 1.8s
Largest Contentful Paint: < 2.5s
Total Blocking Time: < 200ms
Cumulative Layout Shift: < 0.1
```

---

## Optimizaciones Críticas

### 1. GPU Acceleration

```css
/* Forzar composición GPU */
.split-text .char {
  transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}
```

```typescript
// GSAP: force3D
import { gsap } from 'gsap'

gsap.to(text.chars, {
  y: -50,
  force3D: true, // Fuerza capa GPU
  duration: 0.5
})
```

### 2. will-change Strategy

```css
/* ANTES de la animación */
.split-text .char {
  will-change: transform, opacity;
}

/* DESPUÉS de la animación */
.split-text.animation-complete .char {
  will-change: auto;
}
```

```typescript
// GSAP: Automático con willChange
const tl = gsap.timeline({
  onComplete: () => {
    gsap.set(text.chars, { willChange: 'auto' })
  }
})

tl.set(text.chars, { willChange: 'transform, opacity' })
tl.to(text.chars, { y: -50, stagger: 0.02 })
```

### 3. Containment

```css
/* Aislar el área de animación */
.split-text-container {
  contain: layout style paint;
  /* o */
  contain: strict;
}

/* Containment por elemento */
.split-text .char {
  contain: layout style;
}
```

### 4. Content Visibility

```css
/* Para texto fuera de viewport */
.split-text-section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```

---

## Memory Management

### Cleanup Correcto

```typescript
// ❌ MAL - Memory leak
useEffect(() => {
  const text = new SplitType('#target')
  gsap.from(text.chars, { y: 50, opacity: 0 })
}, []) // Sin cleanup

// ✅ BIEN - Cleanup completo
useEffect(() => {
  const text = new SplitType('#target')
  
  const ctx = gsap.context(() => {
    gsap.from(text.chars, { y: 50, opacity: 0 })
  })
  
  return () => {
    ctx.revert()  // Kill GSAP tweens
    text.revert() // Restore DOM
  }
}, [])
```

### Data Store Cleanup

```typescript
// SplitType almacena datos internos
// revert() limpia automáticamente

text.revert() // Limpia todo

// O limpiar todo el data store
SplitType.clearData()
```

---

## Bundle Optimization

### Tree Shaking

```typescript
// ✅ Import específico (si la librería lo soporta)
import SplitType from 'split-type'

// ✅ Dynamic import para código dividido
const initSplitType = async () => {
  const { default: SplitType } = await import('split-type')
  return new SplitType('#target')
}
```

### Lazy Loading

```typescript
// Cargar SplitType solo cuando sea necesario
const SplitTextComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100px' }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // Cargar y ejecutar solo cuando es visible
    import('split-type').then(({ default: SplitType }) => {
      const text = new SplitType(containerRef.current, {
        types: 'words, chars'
      })
      
      // Animar...
    })
  }, [isVisible])

  return <div ref={containerRef}>Texto a animar</div>
}
```

---

## Render Optimization

### RAF Throttling

```typescript
// ❌ MAL - RAF sin throttle
const animate = () => {
  updateAnimation()
  requestAnimationFrame(animate)
}
requestAnimationFrame(animate)

// ✅ BIEN - GSAP ticker (optimizado)
import { gsap } from 'gsap'

gsap.ticker.add(updateAnimation)

// Remover cuando no se necesite
gsap.ticker.remove(updateAnimation)
```

### Debounce Resize

```typescript
import { debounce } from 'lodash'

const text = new SplitType('#target', { absolute: true })

const resizeObserver = new ResizeObserver(
  debounce(([entry]) => {
    text.split()
  }, 100) // Máximo 10 veces por segundo
)
```

---

## Profiling

### Chrome DevTools

```typescript
// Marcar inicio/fin de animación
performance.mark('animation-start')

// Animación...

performance.mark('animation-end')
performance.measure('animation', 'animation-start', 'animation-end')

// Ver en DevTools > Performance > Timings
```

### FPS Meter

```typescript
// Monitor de FPS simple
let lastTime = performance.now()
let frames = 0

const measureFPS = () => {
  const now = performance.now()
  frames++
  
  if (now - lastTime >= 1000) {
    console.log(`FPS: ${frames}`)
    frames = 0
    lastTime = now
  }
  
  requestAnimationFrame(measureFPS)
}

measureFPS()
```

### Long Tasks

```typescript
// Detectar tareas largas que bloquean
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.duration > 50) {
      console.warn('Long task detected:', entry.duration)
    }
  }
})

observer.observe({ entryTypes: ['longtask'] })
```

---

## Directrices Críticas

### MUST

```yaml
MUST:
  - Animar solo transform y opacity:
      code: |
        // ✅ BIEN - Composición GPU
        gsap.to(el, { x: 100, y: 50, scale: 1.5, opacity: 0.5 })
        
        // ❌ MAL - Layout thrashing
        gsap.to(el, { width: 100, height: 50, top: 100, left: 50 })
      why: "Solo transform/opacity no causan layout/paint"
      
  - Usar will-change estratégicamente:
      code: |
        // Antes
        gsap.set(chars, { willChange: 'transform, opacity' })
        
        // Animar...
        
        // Después
        gsap.set(chars, { willChange: 'auto' })
      why: "will-change consume memoria GPU, liberar después"
      
  - Implementar cleanup completo:
      code: |
        return () => {
          ctx.revert()  // GSAP
          text.revert() // SplitType
          resizeObserver.disconnect()
        }
      why: "Memory leaks causan degradación de performance"
      
  - Usar ResizeObserver con debounce:
      code: |
        new ResizeObserver(
          debounce(([entry]) => {
            text.split()
          }, 100)
        )
      why: "Evita re-split excesivo durante resize continuo"
      
  - Lazy load SplitType:
      code: |
        const { default: SplitType } = await import('split-type')
      why: "Reduce bundle size inicial, carga bajo demanda"
```

### FORBIDDEN

```yaml
FORBIDDEN:
  - setState en onUpdate:
      wrong: |
        gsap.to(el, {
          onUpdate: () => setState({ progress: gsap.progress() })
        })
      right: |
        // Usar ref o variable local
        const progressRef = useRef(0)
        gsap.to(el, {
          onUpdate: () => { progressRef.current = gsap.progress() }
        })
      why: "setState en cada frame causa re-render masivo"
      
  - Crear tweens en mousemove:
      wrong: |
        el.addEventListener('mousemove', (e) => {
          gsap.to(target, { x: e.clientX })
        })
      right: |
        const quickX = gsap.quickTo(target, 'x')
        el.addEventListener('mousemove', (e) => {
          quickX(e.clientX)
        })
      why: "Crear tweens en cada frame causa memory leak"
      
  - Animar filter: blur() continuo:
      wrong: |
        gsap.to(el, {
          filter: 'blur(10px)',
          repeat: -1,
          yoyo: true
        })
      right: |
        // Usar opacity o scale
        gsap.to(el, { opacity: 0.5, repeat: -1, yoyo: true })
      why: "Blur es extremadamente costoso en GPU"
      
  - Olvidar contain:
      wrong: |
        .container { /* sin contain */ }
      right: |
        .container { contain: layout style paint; }
      why: "Contain aísla el área de animación del resto del DOM"
```

### WHY

```yaml
WHY:
  transform-opacity: |
    Estas propiedades disparan solo composición (GPU),
    sin layout ni paint. Son las únicas que garantizan 60fps.
    
  will-change: |
    Indica al navegador que prepare la capa para animación,
    pero consume memoria GPU significativa. Debe removerse
    después de la animación.
    
  contain: |
    Aísla el área de animación del resto del DOM,
    permitiendo al navegador optimizar renders y
    evitar cálculos innecesarios.
    
  cleanup: |
    SplitType y GSAP almacenan referencias y datos.
    Sin cleanup, el garbage collector no puede liberar
    memoria, causando memory leaks.
    
  lazy-loading: |
    Cargar código bajo demanda reduce el bundle inicial,
    mejorando Time to Interactive (TTI) y
    Largest Contentful Paint (LCP).
```

---

## Checklist de Performance

### Antes de deploy

- [ ] Animar solo `transform` y `opacity`
- [ ] `will-change` agregado antes y removido después
- [ ] Cleanup implementado en todos los efectos
- [ ] `ResizeObserver` con debounce
- [ ] Lazy loading para código no crítico
- [ ] `prefers-reduced-motion` implementado
- [ ] Lighthouse Performance > 90
- [ ] No hay layout thrashing en DevTools
- [ ] FPS consistente a 60 en Performance tab

### Testing

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# WebPageTest
# https://www.webpagetest.org/

# Chrome DevTools Performance
# 1. Open DevTools > Performance
# 2. Click Record
# 3. Trigger animations
# 4. Stop recording
# 5. Analyze frames
```

---

## Performance Budget

```yaml
SplitType:
  Bundle Size: ~3KB gzipped
  Parse Time: < 5ms
  Split Time: < 10ms para 1000 caracteres
  
GSAP (opcional):
  Bundle Size: ~25KB gzipped
  Parse Time: < 10ms
  
Total Animation Budget:
  JavaScript: < 50KB
  First Paint: < 1.5s
  Time to Interactive: < 3.5s
```
