---
name: splittype-typography
version: 1.0.0
description: SplitType text splitting mastery for award-winning typographic animations. Use when (1) Splitting text into lines/words/chars for animation, (2) Creating text reveal effects, (3) Implementing staggered character animations, (4) Building typewriter effects, (5) Combining with GSAP for advanced typography animations. MANDATORY for text animation experiences.
metadata:
  tags:
    - splittype
    - typography
    - text-animation
    - text-reveal
    - character-animation
    - word-animation
    - line-animation
    - gsap
    - javascript
    - animation
    - frontend
  author: Santiago Workflow Systems
  priority: high
  category: animation
  related:
    - gsap-animator
    - css3-modern
    - lenis-scroll
---

# SplitType Typography Master System

> **"Great typography is the foundation of great design. Animated typography creates unforgettable experiences."**

SplitType es una librería JavaScript ligera y potente que divide texto HTML en elementos individuales (líneas, palabras, caracteres) permitiendo animaciones tipográficas avanzadas. Inspirada en el plugin SplitText de GSAP, pero compatible con cualquier librería de animación.

---

## Cuándo Usar Esta Skill

### ✅ Activación Obligatoria

```yaml
USE CUANDO:
  - Animaciones de texto complejas
  - Efectos de revelado de texto
  - Animaciones escalonadas de caracteres
  - Efecto máquina de escribir
  - Texto que se anima por líneas/palabras/caracteres
  - Combinación con GSAP para animaciones tipográficas
  - Sitios tipo Awwwards con animaciones de texto

NO USE:
  - Animaciones simples de CSS (fade, slide)
  - Texto estático sin animación
  - Cuando prefers-reduced-motion esté activo
  - Sitios SSR-only sin hidratación de JS
```

---

## Índice de Reglas

| Regla | Descripción | Nivel |
|-------|-------------|-------|
| [rules/api-configuration.md](./rules/api-configuration.md) | API completa, opciones y métodos | Essential |
| [rules/gsap-animations.md](./rules/gsap-animations.md) | Patrones avanzados con GSAP | Advanced |
| [rules/css-animations.md](./rules/css-animations.md) | Animaciones puras con CSS | Intermediate |
| [rules/performance.md](./rules/performance.md) | Optimización y rendimiento | Critical |
| [rules/responsive-resize.md](./rules/responsive-resize.md) | Manejo de resize y responsive | Important |
| [rules/edge-cases.md](./rules/edge-cases.md) | Elementos anidados y casos especiales | Advanced |

---

## Assets de Código

```
rules/assets/
├── hooks/
│   ├── useSplitType.ts              # Hook base para React
│   ├── useTextAnimation.ts          # Hook con animaciones integradas
│   └── useSplitTextReveal.ts        # Hook para reveal effects
├── components/
│   ├── SplitText.tsx                # Componente base de texto dividido
│   ├── TextReveal.tsx               # Componente de revelado de texto
│   ├── CharacterStagger.tsx         # Animación escalonada de caracteres
│   ├── TypewriterEffect.tsx         # Efecto máquina de escribir
│   ├── WordReveal.tsx               # Revelado por palabras
│   └── LineReveal.tsx               # Revelado por líneas
├── utils/
│   ├── splittype-helpers.ts         # Helpers de SplitType
│   └── text-animations.ts           # Presets de animación
└── styles/
    └── base-styles.css              # Estilos CSS base recomendados
```

---

## Instalación Rápida

```bash
# NPM
npm install split-type

# Yarn
yarn add split-type

# PNPM
pnpm add split-type
```

### CDN

```html
<!-- Minified UMD bundle -->
<script src="https://unpkg.com/split-type"></script>
```

---

## Setup Básico

```typescript
import SplitType from 'split-type'

// Dividir texto en líneas, palabras y caracteres (default)
const text = new SplitType('#target')
// o
const text = SplitType.create('#target')

// Acceder a los elementos divididos
text.lines   // HTMLElement[] | null - Array de elementos de línea
text.words   // HTMLElement[] | null - Array de elementos de palabra  
text.chars   // HTMLElement[] | null - Array de elementos de carácter

// Revertir al estado original
text.revert()
```

### CSS Requerido

```css
/* IMPORTANTE: Previene el desplazamiento de caracteres */
.target {
  font-kerning: none;
}

/* Si el elemento está en un flex container, definir width */
.flex-container .target {
  width: 100%;
}
```

---

## Reglas de Oro

```yaml
DEBE (MUST):
  - Aplicar font-kerning: none a elementos target
  - Definir width en elementos dentro de flex containers
  - Usar .revert() al finalizar animaciones o desmontar componentes
  - Especificar types explícitamente para control granular
  - Usar ResizeObserver para re-split en resize cuando se use absolute o lines

PROHIBIDO (FORBIDDEN):
  - Olvidar font-kerning: none (causa desplazamientos visuales)
  - No llamar revert() (causa memory leaks)
  - Split solo en caracteres sin words/lines (pierde saltos de línea)
  - Usar setTimeout para esperar al split (usar callbacks/promesas)
  - Ignorar prefers-reduced-motion

WHY:
  font-kerning: "Previene micro-desplazamientos al dividir/revertir"
  revert: "Limpia el DOM y libera memoria del data store interno"
  types: "Control granular evita procesamiento innecesario"
```

---

## Opciones de Configuración

| Opción | Tipo | Default | Descripción |
|--------|------|---------|-------------|
| `types` | `string` | `"lines, words, chars"` | Tipos de split: lines, words, chars |
| `absolute` | `boolean` | `false` | Usar posición absoluta para nodos |
| `tagName` | `string` | `"div"` | Tag HTML para elementos divididos |
| `lineClass` | `string` | `"line"` | Clase para elementos de línea |
| `wordClass` | `string` | `"word"` | Clase para elementos de palabra |
| `charClass` | `string` | `"char"` | Clase para elementos de carácter |
| `splitClass` | `string` | `null` | Clase para todos los elementos divididos |

---

## Integración con Otras Skills

```yaml
TRABAJA CON:
  gsap-animator:
    - SplitType + GSAP para animaciones avanzadas
    - ScrollTrigger para animaciones al scroll
    - Stagger para efectos escalonados
    
  lenis-scroll:
    - Sincronización con smooth scroll
    - Re-cálculo en cambios de scroll
    
  css3-modern:
    - Animaciones CSS puras
    - Transiciones y keyframes
    
  html5-semantic:
    - Estructura semántica del texto
    - Accesibilidad y screen readers
    
DEPENDS ON:
  - javascript-advanced (ES6+ features)
  - performance-guardian (optimización)
```

---

## Características Principales

- ✅ Divide texto en **líneas**, **palabras** y/o **caracteres**
- ✅ Nombres de clase personalizables
- ✅ Detecta saltos de línea naturales automáticamente
- ✅ Preserva saltos de línea explícitos (`<br>`)
- ✅ Preserva elementos HTML anidados (links, em, strong)
- ✅ Soporta símbolos Unicode y emojis
- ✅ Compatible con cualquier librería de animación
- ✅ TypeScript definitions incluidas

---

## Compatibilidad

| Navegador | Soporte |
|-----------|---------|
| Chrome | ✅ |
| Firefox | ✅ |
| Edge | ✅ |
| Safari | ✅ |
| Internet Explorer | ❌ (no soportado) |

---

## Recursos Oficiales

- **Repositorio GitHub**: https://github.com/lukePeavey/SplitType
- **NPM Package**: https://www.npmjs.com/package/split-type
- **Documentación**: https://github.com/lukePeavey/SplitType#readme

---

**Split text. Animate typography. Create magic.** ✨
