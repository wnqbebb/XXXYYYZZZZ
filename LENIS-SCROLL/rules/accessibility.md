# Accesibilidad y Preferencias

## prefers-reduced-motion

### MUST: Implementar Reducir Movimiento

```typescript
// ✅ Verificar preferencia del usuario
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Opción 1: Desactivar Lenis completamente
if (prefersReducedMotion) {
  // No inicializar Lenis, usar scroll nativo
} else {
  const lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
  });
}

// Opción 2: Reducir suavizado
const lenis = new Lenis({
  lerp: prefersReducedMotion ? 1 : 0.1, // 1 = sin suavizado
  smoothWheel: !prefersReducedMotion,
  syncTouch: !prefersReducedMotion,
});
```

### React Hook

```typescript
// ✅ Hook para detectar prefers-reduced-motion
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Uso
function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <LenisProvider
      options={{
        lerp: prefersReducedMotion ? 1 : 0.1,
        smoothWheel: !prefersReducedMotion,
      }}
    >
      <Content />
    </LenisProvider>
  );
}
```

---

## Skip Links

### Navegación por Teclado

```typescript
// ✅ Skip links compatibles con Lenis
function handleSkipLink(e: Event) {
  e.preventDefault();
  const target = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
  if (!target) return;
  
  const element = document.querySelector(target);
  if (!element) return;
  
  // Usar Lenis para scroll suave
  lenis.scrollTo(element, {
    offset: -80, // Offset para header fijo
    duration: prefersReducedMotion ? 0 : 1,
  });
  
  // Enfocar el elemento para accesibilidad
  (element as HTMLElement).focus({ preventScroll: true });
}

// HTML
// <a href="#main-content" class="skip-link" onclick="handleSkipLink(event)">
//   Saltar al contenido principal
// </a>
```

### Focus Management

```typescript
// ✅ Mantener focus visible durante scroll
lenis.on('scroll', () => {
  const focusedElement = document.activeElement;
  if (focusedElement && focusedElement.tagName !== 'BODY') {
    // Asegurar que el elemento enfocado sea visible
    focusedElement.scrollIntoView({ block: 'nearest' });
  }
});
```

---

## Keyboard Navigation

### Scroll con Teclado

```typescript
// ✅ Navegación por teclado accesible
document.addEventListener('keydown', (e) => {
  const scrollAmount = window.innerHeight * 0.8;
  
  switch (e.key) {
    case 'PageDown':
      e.preventDefault();
      lenis.scrollTo(lenis.scroll + scrollAmount, { duration: 0.5 });
      break;
    case 'PageUp':
      e.preventDefault();
      lenis.scrollTo(lenis.scroll - scrollAmount, { duration: 0.5 });
      break;
    case 'Home':
      e.preventDefault();
      lenis.scrollTo(0, { duration: prefersReducedMotion ? 0 : 0.5 });
      break;
    case 'End':
      e.preventDefault();
      lenis.scrollTo(lenis.limit, { duration: prefersReducedMotion ? 0 : 0.5 });
      break;
  }
});
```

### Tab Navigation

```typescript
// ✅ Preservar comportamiento de tab
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    // Dejar que el comportamiento nativo maneje el focus
    // Lenis no debe interferir
    setTimeout(() => {
      const focused = document.activeElement;
      if (focused && isInViewport(focused)) {
        // Elemento ya visible, no hacer nada
      } else if (focused) {
        // Scroll al elemento enfocado
        focused.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }, 0);
  }
});
```

---

## Screen Readers

### Anuncios de Scroll

```typescript
// ✅ Anunciar cambios de sección a screen readers
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'sr-only';
document.body.appendChild(liveRegion);

// Anunciar sección actual
let currentSection = '';

lenis.on('scroll', () => {
  const sections = document.querySelectorAll('section[id]');
  
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
      const sectionName = section.getAttribute('aria-label') || section.id;
      
      if (sectionName !== currentSection) {
        currentSection = sectionName;
        liveRegion.textContent = `Sección: ${sectionName}`;
      }
    }
  });
});
```

### ARIA Labels

```html
<!-- ✅ Estructura accesible -->
<main id="main-content" tabindex="-1">
  <section id="hero" aria-label="Inicio">
    <!-- Contenido -->
  </section>
  
  <section id="about" aria-label="Sobre nosotros">
    <!-- Contenido -->
  </section>
  
  <nav aria-label="Navegación de página">
    <button onclick="scrollToSection('hero')" aria-current="page">
      Inicio
    </button>
    <button onclick="scrollToSection('about')">
      Sobre nosotros
    </button>
  </nav>
</main>
```

---

## High Contrast Mode

```css
/* ✅ Respetar high contrast mode */
@media (prefers-contrast: more) {
  .lenis-scroll-indicator {
    border: 2px solid currentColor;
  }
  
  .parallax-element {
    /* Desactivar efectos visuales complejos */
    transform: none !important;
  }
}
```

---

## Color Scheme

```css
/* ✅ Respetar preferencia de color */
@media (prefers-color-scheme: dark) {
  .scroll-progress-bar {
    background: #fff;
  }
}

@media (prefers-color-scheme: light) {
  .scroll-progress-bar {
    background: #000;
  }
}
```

---

## Checklist de Accesibilidad

```yaml
A11Y_CHECKLIST:
  Motion:
    - [ ] prefers-reduced-motion detectado
    - [ ] Lenis desactivado o reducido si aplica
    - [ ] Animaciones GSAP respetan preferencia
    - [ ] No hay autoplay de scroll
  
  Keyboard:
    - [ ] Skip links funcionan
    - [ ] Navegación por teclado preservada
    - [ ] Focus visible durante scroll
    - [ ] Tab navigation funciona
  
  Screen Readers:
    - [ ] ARIA labels en secciones
    - [ ] Live region para cambios de sección
    - [ ] No hay contenido invisible a screen readers
    - [ ] Anuncios no intrusivos
  
  Visual:
    - [ ] High contrast mode respetado
    - [ ] Color scheme respetado
    - [ ] Texto legible durante scroll
    - [ ] No hay parpadeos o flashes
```
