---
name: lenis-scroll
description: Lenis smooth scroll library for buttery smooth scrolling experiences. Use when (1) Implementing smooth scroll, (2) Syncing with WebGL, (3) GSAP ScrollTrigger integration, (4) Parallax effects, (5) Custom scroll animations. MANDATORY for premium scroll experiences.
metadata:
  tags:
    - lenis
    - smooth-scroll
    - scroll
    - animation
    - gsap
    - parallax
    - webgl
  author: Santiago Workflow Systems
  version: 1.0.0
  priority: high
  category: interaction
  related:
    - gsap-animations
    - webgl-threejs
    - react-hooks
---

# LENIS-SCROLL Master System

> **"Get smooth or die trying"** — Studio Freight

Lenis es la librería de smooth scroll más performante y ligera del mercado. Diseñada por Darkroom Engineering, proporciona un control total sobre la experiencia de scroll con interpolación suave, sincronización perfecta con animaciones, y una API intuitiva.

---

## Cuándo Usar Esta Skill

### ✅ Activación Obligatoria

```yaml
USE CUANDO:
  - Scroll suave premium requerido
  - Sincronización con WebGL/Three.js
  - Integración con GSAP ScrollTrigger
  - Efectos parallax complejos
  - Animaciones basadas en scroll
  - Experiencias inmersivas
  - Scroll horizontal
  - Infinite scroll

NO USE:
  - Sitios simples sin animaciones
  - Cuando el scroll nativo sea suficiente
  - En dispositivos de muy bajo rendimiento
  - Cuando la accesibilidad sea prioridad absoluta (sin alternativa)
```

---

## Índice de Reglas

| Regla | Descripción | Nivel |
|-------|-------------|-------|
| [rules/setup-configuration.md](./rules/setup-configuration.md) | Setup inicial y configuración | Essential |
| [rules/gsap-integration.md](./rules/gsap-integration.md) | Integración con GSAP ScrollTrigger | Essential |
| [rules/react-integration.md](./rules/react-integration.md) | Hooks y componentes React | Essential |
| [rules/scroll-animations.md](./rules/scroll-animations.md) | Animaciones basadas en scroll | Advanced |
| [rules/webgl-sync.md](./rules/webgl-sync.md) | Sincronización con WebGL/Three.js | Advanced |
| [rules/performance.md](./rules/performance.md) | Optimización y performance | Critical |
| [rules/accessibility.md](./rules/accessibility.md) | Accesibilidad y preferencias | Important |

---

## Assets de Código

```
rules/assets/
├── hooks/
│   ├── useLenis.ts              # Hook base para React
│   ├── useLenisScroll.ts        # Hook con valores de scroll
│   └── useLenisSnap.ts          # Hook para snap points
├── components/
│   ├── LenisProvider.tsx        # Provider para React
│   ├── SmoothScroll.tsx         # Componente wrapper
│   └── ScrollVelocity.tsx       # Componente de velocidad
├── utils/
│   ├── lenis-config.ts          # Configuraciones predefinidas
│   ├── scroll-helpers.ts        # Helpers de scroll
│   └── velocity-tracker.ts      # Tracker de velocidad
└── integrations/
    ├── gsap-integration.ts      # Integración GSAP
    └── three-integration.ts     # Integración Three.js
```

---

## Instalación Rápida

```bash
npm install lenis
# o
yarn add lenis
# o
pnpm add lenis
```

### CSS Requerido

```css
/* Importar o agregar manualmente */
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```

---

## Setup Básico

```typescript
import Lenis from 'lenis';

// Setup básico con autoRaf
const lenis = new Lenis({
  autoRaf: true,
});

// Escuchar eventos de scroll
lenis.on('scroll', (e) => {
  console.log(e.scroll, e.limit, e.velocity, e.direction, e.progress);
});
```

---

## Reglas de Oro

```yaml
DEBE:
  - Usar autoRaf: true para la mayoría de casos
  - Sincronizar con GSAP ScrollTrigger cuando se use GSAP
  - Implementar prefers-reduced-motion
  - Usar data-lenis-prevent para elementos que no deben tener smooth scroll
  - Llamar a lenis.destroy() en cleanup
  - Usar lerp O duration, no ambos
  - Respetar overscroll-behavior en elementos

PROHIBIDO:
  - Usar setTimeout para delays de scroll
  - No destruir instancias en componentes desmontados
  - Ignorar prefers-reduced-motion
  - Usar scroll nativo y Lenis simultáneamente sin sincronización
  - Modificar scroll sin usar los métodos de Lenis
  - Olvidar importar el CSS de Lenis
```

---

## Integración con Otras Skills

```yaml
TRABAJA CON:
  gsap-animations:
    - ScrollTrigger.update en evento scroll
    - gsap.ticker para raf loop
    - lagSmoothing(0) para sincronización perfecta
  
  webgl-threejs:
    - Sincronización de cámara con scroll
    - Parallax basado en velocidad
    - Render loop unificado
  
  react-hooks:
    - useLenis hook
    - Context provider
    - Cleanup en useEffect
  
  html5-semantico-accesibilidad:
    - prefers-reduced-motion
    - Skip links compatibles
    - Focus management
```

---

## Referencias Oficiales

- [Lenis Documentation](https://lenis.darkroom.engineering/)
- [GitHub Repository](https://github.com/darkroomengineering/lenis)
- [Lenis Manifesto](https://lenis.darkroom.engineering/manifesto)
- [Showcase](https://lenis.darkroom.engineering/showcase)

---

**Smooth scroll done right.** ✨
