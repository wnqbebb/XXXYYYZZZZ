---
name: splittype-gsap-animations
description: Patrones avanzados y mejores prácticas para combinar SplitType con GSAP para animaciones tipográficas de nivel profesional.
tags: [splittype, gsap, animation, text-animation, scrolltrigger]
version: 1.0.0
---

# SplitType + GSAP Animations

La combinación de SplitType con GSAP crea animaciones tipográficas de nivel profesional. Esta guía cubre los patrones avanzados para crear efectos que se ven en sitios premiados.

---

## Setup Inicial

### Registro de Plugins

```typescript
// lib/gsap.ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

### CSS Base Requerido

```css
/* Previene desplazamientos */
.split-text {
  font-kerning: none;
}

/* Ocultar elementos inicialmente para animaciones */
.split-text .char,
.split-text .word {
  will-change: transform, opacity;
}

/* Optimización para GPU */
.split-text .char {
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
}
```

---

## Patrones de Animación

### 1. Character Stagger (Escalón de Caracteres)

Efecto clásico donde cada carácter anima secuencialmente.

```typescript
import { gsap } from '@/lib/gsap'
import SplitType from 'split-type'

// Setup
const text = new SplitType('#title', { 
  types: 'words, chars',
  charClass: 'title-char'
})

// Animación
const tl = gsap.timeline()
tl.from(text.chars, {
  y: 100,
  opacity: 0,
  rotateX: -90,
  duration: 0.8,
  stagger: {
    each: 0.02,
    from: 'start' // 'start' | 'end' | 'center' | 'edges' | 'random'
  },
  ease: 'power3.out'
})
```

**Variantes de stagger:**

```typescript
// Desde el centro hacia afuera
stagger: { each: 0.02, from: 'center' }

// Desde los bordes hacia el centro
stagger: { each: 0.02, from: 'edges' }

// Orden aleatorio
stagger: { each: 0.02, from: 'random' }

// Con grid (para texto en múltiples líneas)
stagger: {
  amount: 0.5,
  grid: 'auto',
  from: 'center'
}
```

---

### 2. Word Reveal (Revelado por Palabras)

Cada palabra aparece como una unidad.

```typescript
const text = new SplitType('#headline', { types: 'words' })

gsap.from(text.words, {
  y: 50,
  opacity: 0,
  duration: 0.6,
  stagger: 0.1,
  ease: 'power2.out'
})
```

---

### 3. Line Mask Reveal (Máscara de Líneas)

Revelado con clip-path o overflow hidden.

```typescript
const text = new SplitType('#paragraph', { types: 'lines' })

// CSS necesario
// .line-wrapper { overflow: hidden; }

gsap.from(text.lines, {
  yPercent: 100,
  duration: 1,
  stagger: 0.1,
  ease: 'power4.out'
})
```

---

### 4. Typewriter Effect (Máquina de Escribir)

```typescript
const text = new SplitType('#typewriter', { types: 'chars' })

// Ocultar todos los caracteres inicialmente
gsap.set(text.chars, { opacity: 0 })

// Animar secuencialmente
gsap.to(text.chars, {
  opacity: 1,
  duration: 0.05,
  stagger: 0.05,
  ease: 'none'
})
```

**Con cursor parpadeante:**

```typescript
const tl = gsap.timeline()

// Revelar caracteres
tl.to(text.chars, {
  opacity: 1,
  duration: 0.05,
  stagger: 0.05,
  ease: 'none'
})

// Cursor parpadeante
const cursor = document.querySelector('.cursor')
tl.to(cursor, {
  opacity: 0,
  repeat: -1,
  yoyo: true,
  duration: 0.5
}, 0)
```

---

### 5. Wave Effect (Onda)

```typescript
const text = new SplitType('#wave-text', { types: 'chars' })

gsap.to(text.chars, {
  y: -20,
  duration: 0.5,
  stagger: {
    each: 0.05,
    repeat: -1,
    yoyo: true
  },
  ease: 'sine.inOut'
})
```

---

### 6. Elastic Bounce (Rebote Elástico)

```typescript
const text = new SplitType('#bounce-text', { types: 'words' })

gsap.from(text.words, {
  scale: 0,
  opacity: 0,
  duration: 1,
  stagger: 0.1,
  ease: 'elastic.out(1, 0.5)'
})
```

---

## ScrollTrigger Integration

### Text Reveal on Scroll

```typescript
const text = new SplitType('.reveal-text', { types: 'lines, words' })

// Ocultar inicialmente
gsap.set(text.words, { y: 50, opacity: 0 })

gsap.to(text.words, {
  scrollTrigger: {
    trigger: '.reveal-text',
    start: 'top 80%',
    end: 'top 50%',
    scrub: 1,
    toggleActions: 'play none none reverse'
  },
  y: 0,
  opacity: 1,
  stagger: 0.05,
  ease: 'power2.out'
})
```

### Scrub Text Animation

```typescript
const text = new SplitType('.scrub-text', { types: 'chars' })

gsap.from(text.chars, {
  scrollTrigger: {
    trigger: '.scrub-text',
    start: 'top bottom',
    end: 'bottom top',
    scrub: 0.5
  },
  opacity: 0.2,
  stagger: 0.01
})
```

### Pin + Text Animation

```typescript
const text = new SplitType('.pinned-text', { types: 'lines' })

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=200%',
    pin: true,
    scrub: 1
  }
})

tl.from(text.lines, {
  y: 100,
  opacity: 0,
  stagger: 0.1
})
```

---

## Efectos Avanzados

### 3D Text Rotation

```typescript
const text = new SplitType('#text-3d', { types: 'chars' })

// CSS necesario
// .char { perspective: 1000px; transform-style: preserve-3d; }

gsap.from(text.chars, {
  rotateY: 90,
  opacity: 0,
  duration: 0.8,
  stagger: 0.03,
  ease: 'back.out(1.7)'
})
```

### Blur Reveal

```typescript
const text = new SplitType('#blur-text', { types: 'words' })

gsap.from(text.words, {
  filter: 'blur(10px)',
  opacity: 0,
  duration: 1,
  stagger: 0.1,
  ease: 'power2.out'
})
```

### Color Wave

```typescript
const text = new SplitType('#color-text', { types: 'chars' })
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']

text.chars.forEach((char, i) => {
  gsap.to(char, {
    color: colors[i % colors.length],
    duration: 0.5,
    delay: i * 0.05,
    repeat: -1,
    yoyo: true
  })
})
```

### Magnetic Characters

```typescript
const text = new SplitType('#magnetic', { types: 'chars' })

text.chars.forEach(char => {
  char.addEventListener('mousemove', (e) => {
    const rect = char.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    gsap.to(char, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    })
  })
  
  char.addEventListener('mouseleave', () => {
    gsap.to(char, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)'
    })
  })
})
```

---

## Directrices Críticas

### MUST

```yaml
MUST:
  - Usar gsap.context() para cleanup:
      code: |
        const ctx = gsap.context(() => {
          gsap.from(text.chars, { ... })
        }, containerRef)
        
        return () => {
          ctx.revert()
          text.revert()
        }
      
  - Agregar will-change antes de animar:
      code: |
        gsap.set(text.chars, { willChange: 'transform, opacity' })
        // ... animación ...
        gsap.set(text.chars, { willChange: 'auto' })
      
  - Usar force3D para GPU acceleration:
      code: |
        gsap.to(text.chars, {
          y: -50,
          force3D: true // Fuerza composición GPU
        })
      
  - Implementar prefers-reduced-motion:
      code: |
        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
        
        if (prefersReducedMotion) {
          gsap.set(text.chars, { opacity: 1, y: 0 })
        } else {
          gsap.from(text.chars, { opacity: 0, y: 50 })
        }
```

### FORBIDDEN

```yaml
FORBIDDEN:
  - Animate width/height/top/left:
      wrong: gsap.to(text.chars, { width: 100 })
      right: gsap.to(text.chars, { scaleX: 1.5 })
      why: "Causa layout thrashing, 60fps imposible"
      
  - Usar filter: blur() en animaciones continuas:
      wrong: gsap.to(text.chars, { filter: 'blur(10px)', repeat: -1 })
      right: "Usar blur solo en transiciones one-time"
      why: "Blur es extremadamente costoso en GPU"
      
  - Crear tweens en mousemove sin throttling:
      wrong: |
        element.addEventListener('mousemove', (e) => {
          gsap.to(text.chars, { x: e.clientX })
        })
      right: |
        // Usar quickTo o quickSetter
        const quickX = gsap.quickTo(text.chars, 'x')
        element.addEventListener('mousemove', (e) => {
          quickX(e.clientX)
        })
      why: "Crear tweens en cada frame causa memory leaks"
      
  - Olvidar kill() en unmount:
      why: "Tweens persisten causando errores y memory leaks"
```

### WHY

```yaml
WHY:
  gsap.context: |
    Proporciona scope automático para selectores y
    cleanup automático de tweens cuando se llama revert().
    
  will-change: |
    Indica al navegador que prepare la capa para animación,
    pero debe removerse después para liberar recursos GPU.
    
  force3D: |
    Fuerza la promoción a capa GPU, acelera transformaciones
    pero aumenta uso de memoria. Usar estratégicamente.
    
  prefers-reduced-motion: |
    Accesibilidad esencial. Algunos usuarios experimentan
    mareos o náuseas con animaciones de movimiento.
```

---

## Ejemplo Completo: Hero Text Animation

```typescript
'use client'
import { useRef, useLayoutEffect } from 'react'
import { gsap } from '@/lib/gsap'
import SplitType from 'split-type'

export function HeroText() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split text
      const title = new SplitType(titleRef.current, {
        types: 'words, chars',
        charClass: 'hero-char'
      })
      
      const subtitle = new SplitType(subtitleRef.current, {
        types: 'words'
      })

      // Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Title animation
      tl.from(title.chars, {
        y: 100,
        opacity: 0,
        rotateX: -90,
        duration: 0.8,
        stagger: 0.02
      })
      
      // Subtitle animation
      tl.from(subtitle.words, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05
      }, '-=0.4')

      // Cleanup function
      return () => {
        title.revert()
        subtitle.revert()
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef}>
      <h1 ref={titleRef} className="hero-title">
        Creative Developer
      </h1>
      <p ref={subtitleRef} className="hero-subtitle">
        Building digital experiences that matter
      </p>
    </div>
  )
}
```

---

## Recursos Adicionales

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Guide](https://greensock.com/scroll/)
- [SplitType GitHub](https://github.com/lukePeavey/SplitType)
