---
name: splittype-css-animations
description: Técnicas de animación puramente con CSS utilizando SplitType, sin dependencias de librerías de animación.
tags: [splittype, css, animation, keyframes, transitions]
version: 1.0.0
---

# SplitType + CSS Animations

Animaciones tipográficas usando solo CSS con SplitType. Ideal para proyectos ligeros o cuando se prefiere evitar librerías de animación.

---

## Ventajas de CSS Puro

- ✅ Sin JavaScript de animación (menor bundle size)
- ✅ GPU-accelerated por defecto
- ✅ Funcionan con `prefers-reduced-motion`
- ✅ Fáciles de mantener para animaciones simples
- ✅ No requieren cleanup de event listeners

---

## CSS Base Requerido

```css
/* === BASE STYLES === */

/* Previene desplazamientos */
.split-text {
  font-kerning: none;
}

/* Elementos divididos */
.split-text .line,
.split-text .word,
.split-text .char {
  display: inline-block;
  will-change: transform, opacity;
}

/* GPU acceleration */
.split-text .char {
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  transform: translateZ(0);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .split-text .char,
  .split-text .word,
  .split-text .line {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Animaciones con Keyframes

### 1. Fade Up (Fade + Translate Y)

```css
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Aplicar a caracteres */
.split-text .char {
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
}

/* Stagger con animation-delay */
.split-text .char:nth-child(1) { animation-delay: 0s; }
.split-text .char:nth-child(2) { animation-delay: 0.05s; }
.split-text .char:nth-child(3) { animation-delay: 0.1s; }
.split-text .char:nth-child(4) { animation-delay: 0.15s; }
/* ... */
```

**Stagger dinámico con CSS variables:**

```css
.split-text .char {
  --char-index: 0;
  opacity: 0;
  animation: fadeUp 0.6s ease forwards;
  animation-delay: calc(var(--char-index) * 0.05s);
}
```

```typescript
// TypeScript: Asignar índices
const text = new SplitType('#target', { types: 'chars' })
text.chars.forEach((char, i) => {
  char.style.setProperty('--char-index', String(i))
})
```

---

### 2. Scale In (Entrada con Escala)

```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.split-text .word {
  opacity: 0;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: calc(var(--word-index) * 0.1s);
}
```

---

### 3. Rotate In (Entrada con Rotación)

```css
@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotateX(-90deg);
  }
  to {
    opacity: 1;
    transform: rotateX(0);
  }
}

.split-text .char {
  opacity: 0;
  transform-origin: center bottom;
  animation: rotateIn 0.8s ease forwards;
  animation-delay: calc(var(--char-index) * 0.03s);
}
```

---

### 4. Typewriter Effect (Máquina de Escribir)

```css
@keyframes typewriter {
  from { opacity: 0; }
  to { opacity: 1; }
}

.split-text .char {
  opacity: 0;
  animation: typewriter 0.1s steps(1) forwards;
  animation-delay: calc(var(--char-index) * 0.05s);
}
```

---

### 5. Wave Effect (Onda)

```css
@keyframes wave {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.split-text .char {
  animation: wave 1s ease-in-out infinite;
  animation-delay: calc(var(--char-index) * 0.05s);
}
```

---

### 6. Blur Reveal

```css
@keyframes blurReveal {
  from {
    filter: blur(10px);
    opacity: 0;
  }
  to {
    filter: blur(0);
    opacity: 1;
  }
}

.split-text .word {
  opacity: 0;
  animation: blurReveal 0.8s ease forwards;
  animation-delay: calc(var(--word-index) * 0.1s);
}
```

---

### 7. Clip Reveal (Máscara)

```css
@keyframes clipReveal {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.split-text .line {
  animation: clipReveal 1s ease forwards;
  animation-delay: calc(var(--line-index) * 0.2s);
}
```

---

## Animaciones con Transitions

### Hover Effects

```css
/* Hover por carácter */
.split-text .char {
  transition: transform 0.3s ease, color 0.3s ease;
  cursor: default;
}

.split-text .char:hover {
  transform: translateY(-10px) scale(1.2);
  color: #ff3366;
}

/* Hover por palabra */
.split-text .word {
  transition: transform 0.3s ease;
}

.split-text .word:hover {
  transform: scale(1.1);
}
```

### Focus States

```css
.split-text .char {
  transition: all 0.3s ease;
}

.split-text:focus .char {
  transform: translateY(-5px);
  text-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
```

---

## Scroll-Triggered Animations (CSS Only)

### Intersection Observer + CSS

```css
/* Estado inicial */
.split-text .char {
  opacity: 0;
  transform: translateY(50px);
  transition: opacity 0.6s ease, transform 0.6s ease;
  transition-delay: calc(var(--char-index) * 0.03s);
}

/* Estado animado (clase añadida por JS) */
.split-text.is-visible .char {
  opacity: 1;
  transform: translateY(0);
}
```

```typescript
// TypeScript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible')
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.split-text').forEach(el => {
  observer.observe(el)
})
```

---

## View Transitions API

```css
/* View Transitions API (navegadores modernos) */
::view-transition-old(text-char) {
  animation: fadeOut 0.3s ease;
}

::view-transition-new(text-char) {
  animation: fadeIn 0.3s ease;
}
```

```typescript
// TypeScript
document.startViewTransition(() => {
  // Actualizar contenido
  text.split()
})
```

---

## Directrices Críticas

### MUST

```yaml
MUST:
  - Usar will-change estratégicamente:
      css: |
        .split-text .char {
          will-change: transform, opacity;
        }
        
        /* Remover después de la animación */
        .split-text.animation-complete .char {
          will-change: auto;
        }
      
  - Implementar prefers-reduced-motion:
      css: |
        @media (prefers-reduced-motion: reduce) {
          .split-text * {
            animation: none !important;
            transition: none !important;
          }
        }
      
  - Usar CSS variables para stagger:
      css: |
        .char {
          animation-delay: calc(var(--index) * 0.05s);
        }
      
  - Transform y Opacity only:
      css: |
        /* BIEN */
        transform: translateY(50px);
        opacity: 0;
        
        /* MAL - causa layout thrashing */
        top: 50px;
        margin-top: 50px;
```

### FORBIDDEN

```yaml
FORBIDDEN:
  - Animar propiedades de layout:
      wrong: |
        width, height, top, left, margin, padding
      right: |
        transform: scale() para tamaño
        transform: translate() para posición
      why: "Causan layout thrashing, 60fps imposible"
      
  - Usar filter: blur() en loops:
      wrong: |
        animation: blur 1s infinite;
      right: |
        /* Usar solo en transiciones one-time */
        animation: blurReveal 0.5s forwards;
      why: "Blur es extremadamente costoso en GPU"
      
  - Olvidar animation-fill-mode:
      wrong: |
        animation: fadeUp 0.5s ease;
      right: |
        animation: fadeUp 0.5s ease forwards;
      why: "Sin forwards, el elemento vuelve a estado inicial"
      
  - Stagger manual excesivo:
      wrong: |
        .char:nth-child(1) { delay: 0.05s; }
        .char:nth-child(2) { delay: 0.1s; }
        /* ... 100 líneas */
      right: |
        .char {
          animation-delay: calc(var(--index) * 0.05s);
        }
```

### WHY

```yaml
WHY:
  will-change: |
    Indica al navegador que prepare la capa para animación,
    pero consume recursos GPU. Debe removerse después.
    
  transform-opacity-only: |
    Estas propiedades no disparan layout o paint,
    solo composición. Son las únicas que garantizan 60fps.
    
  css-variables: |
    Permiten stagger dinámico sin generar CSS excesivo.
    El índice se asigna desde JS, el delay se calcula en CSS.
    
  prefers-reduced-motion: |
    Algunos usuarios experimentan mareos o náuseas
    con animaciones. Es una media query de accesibilidad esencial.
```

---

## Ejemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .split-text {
      font-kerning: none;
      font-size: 3rem;
      font-weight: bold;
    }
    
    .split-text .char {
      display: inline-block;
      opacity: 0;
      transform: translateY(100px) rotateX(-90deg);
      transform-origin: center bottom;
      animation: charReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      animation-delay: calc(var(--char-index) * 0.03s);
    }
    
    @keyframes charReveal {
      to {
        opacity: 1;
        transform: translateY(0) rotateX(0);
      }
    }
    
    @media (prefers-reduced-motion: reduce) {
      .split-text .char {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  </style>
</head>
<body>
  <h1 class="split-text" id="title">Hello World</h1>
  
  <script type="module">
    import SplitType from 'https://unpkg.com/split-type'
    
    const text = new SplitType('#title', { types: 'chars' })
    
    // Asignar índices para stagger
    text.chars.forEach((char, i) => {
      char.style.setProperty('--char-index', i)
    })
  </script>
</body>
</html>
```

---

## Comparativa: CSS vs GSAP

| Característica | CSS | GSAP |
|----------------|-----|------|
| Bundle size | 0KB | ~25KB |
| Complejidad | Simple | Avanzada |
| Timeline control | Limitado | Completo |
| ScrollTrigger | No nativo | Sí |
| Easing | CSS easing | Custom easing |
| Stagger | CSS variables | Avanzado |
| Performance | Excelente | Excelente |

**Regla de oro:** Usar CSS para animaciones simples, GSAP para complejas o con scroll.
