---
name: html5-semantico-accesibilidad
description: HTML5 semántico y accesibilidad (a11y) para sitios web inclusivos. Use cuando (1) Construyendo estructura de página, (2) Implementando navegación por teclado, (3) Creando formularios accesibles, (4) Aplicando patrones ARIA, (5) Cumpliendo WCAG 2.2. MANDATORY para todos los proyectos.
metadata:
  tags: [html5, accesibilidad, a11y, semantico, wcag, aria, inclusivo, wai-aria, wcag2.2]
  author: Santiago Workflow Systems
  version: 4.0.0
  last_updated: "2024-10"
  priority: critical
  category: foundation
  standards:
    - WCAG 2.2 (W3C Recommendation)
    - ARIA 1.2 (W3C Recommendation)
    - HTML Living Standard
    - EN 301 549 (European standard)
    - Section 508 (US standard)
---

# HTML5 Semántico y Accesibilidad Master System

**La web para todos. Sin excepciones.**

La accesibilidad web (a11y) no es una característica opcional—es un requisito fundamental y un derecho humano. Esta skill proporciona las herramientas, patrones y componentes para crear experiencias web verdaderamente inclusivas que funcionen para todos los usuarios, independientemente de sus capacidades o tecnología asistiva.

---

## 📋 Índice de Contenidos

1. [Cuándo Usar Esta Skill](#cuándo-usar-esta-skill)
2. [Fundamentos de Accesibilidad](#fundamentos-de-accesibilidad)
3. [WCAG 2.2 - Novedades](#wcag-22---novedades)
4. [Archivos de Reglas](#archivos-de-reglas)
5. [Componentes de Biblioteca](#componentes-de-biblioteca)
6. [Reglas de Oro](#reglas-de-oro)
7. [Integración con Otras Skills](#integración-con-otras-skills)

---

## Cuándo Usar Esta Skill

### Activación Obligatoria

```yaml
USE CUANDO:
  - Construyendo CUALQUIER interfaz web
  - Implementando formularios
  - Creando navegación
  - Desarrollando componentes interactivos
  - Optimizando para SEO (accesibilidad mejora SEO)
  - Cumpliendo regulaciones (ADA, EN 301 549, Section 508)
  - Atendiendo audiencias diversas
  - Creando videos con Remotion

NO USE:
  - Nunca ignore la accesibilidad
  - No asuma que "nadie usa lector de pantalla"
  - No postergue para "más adelante"
```

### Audiencias que Beneficia

| Discapacidad | Tecnología Asistiva | Criterios WCAG Relevantes |
|--------------|---------------------|---------------------------|
| Visual | Screen readers, magnificadores | 1.1, 1.2, 1.3, 1.4, 2.4 |
| Auditiva | Subtítulos, transcripciones | 1.2, 1.4 |
| Motora | Teclado, switch devices | 2.1, 2.4, 2.5 |
| Cognitiva | Lectores, simplificación | 2.2, 3.1, 3.2, 3.3 |
| Fotosensibilidad | - | 2.3 |

---

## Fundamentos de Accesibilidad

### Los Cuatro Principios de WCAG (POUR)

```
┌─────────────────────────────────────────────────────────┐
│  PERCEPTIBLE (Perceivable)                              │
│  La información debe ser presentada de forma que los    │
│  usuarios puedan percibirla.                            │
│  • Alternativas textuales (1.1)                         │
│  • Medios temporales (1.2)                              │
│  • Adaptabilidad (1.3)                                  │
│  • Distinguibilidad (1.4)                               │
├─────────────────────────────────────────────────────────┤
│  OPERABLE (Operable)                                    │
│  Los componentes deben ser operables por todos.         │
│  • Accesible por teclado (2.1)                          │
│  • Tiempo suficiente (2.2)                              │
│  • Convulsiones (2.3)                                   │
│  • Navegable (2.4)                                      │
│  • Modalidades de entrada (2.5)                         │
├─────────────────────────────────────────────────────────┤
│  COMPRENSIBLE (Understandable)                          │
│  La información debe ser comprensible.                  │
│  • Legible (3.1)                                        │
│  • Predecible (3.2)                                     │
│  • Asistencia entrada (3.3)                             │
├─────────────────────────────────────────────────────────┤
│  ROBUSTO (Robust)                                       │
│  El contenido debe funcionar con tecnología asistiva.   │
│  • Compatible (4.1)                                     │
└─────────────────────────────────────────────────────────┘
```

---

## WCAG 2.2 - Novedades

WCAG 2.2 (Octubre 2023) incluye 9 nuevos criterios de éxito:

### Nuevos Criterios en WCAG 2.2

| Criterio | Nivel | Descripción | Implementación |
|----------|-------|-------------|----------------|
| 2.4.11 Focus Not Obscured (Minimum) | AA | El foco no debe quedar oculto | `scroll-margin`, z-index |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Foco completamente visible | Posicionamiento sticky/fixed |
| 2.4.13 Focus Appearance | AAA | Indicador de foco visible | `outline`, `:focus-visible` |
| 2.5.7 Dragging Movements | AA | Alternativas al arrastre | Botones de control |
| 2.5.8 Target Size (Minimum) | AA | Tamaño mínimo de objetivo | 24x24px mínimo |
| 3.2.6 Consistent Help | A | Ayuda consistente | Posición fija de ayuda |
| 3.3.7 Redundant Entry | A | No repetir entradas | Autocompletado, memoria |
| 3.3.8 Accessible Authentication (Minimum) | AA | Autenticación accesible | Alternativas a CAPTCHA |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Autenticación sin cognitivos | Sin reconocimiento de objetos |

### Criterio Eliminado
- **4.1.1 Parsing** - Obsoleto en WCAG 2.2 (los navegadores modernos manejan el parsing automáticamente)

```yaml
REQUISITOS_WCAG_2.2:
  Nivel_A:
    - 3.2.6 Consistent Help
    - 3.3.7 Redundant Entry
    - 3.3.8 Accessible Authentication (Minimum)
  
  Nivel_AA:
    - 2.4.11 Focus Not Obscured (Minimum)
    - 2.5.7 Dragging Movements
    - 2.5.8 Target Size (Minimum)
  
  Nivel_AAA:
    - 2.4.12 Focus Not Obscured (Enhanced)
    - 2.4.13 Focus Appearance
    - 3.3.9 Accessible Authentication (Enhanced)
```

---

## Archivos de Reglas

### Estructura y Navegación

| Archivo | Propósito | Cuándo Cargar |
|---------|-----------|---------------|
| [rules/estructura-documento.md](./rules/estructura-documento.md) | Estructura HTML5 semántica | Creando layouts |
| [rules/navegacion-teclado.md](./rules/navegacion-teclado.md) | Navegación sin mouse | Interactividad |
| [rules/landmarks-aria.md](./rules/landmarks-aria.md) | Regiones y landmarks | Accesibilidad avanzada |

### Formularios y Contenido

| Archivo | Propósito | Cuándo Cargar |
|---------|-----------|---------------|
| [rules/formularios-accesibles.md](./rules/formularios-accesibles.md) | Formularios WCAG 2.2 compliant | Inputs |
| [rules/imagenes-media.md](./rules/imagenes-media.md) | Texto alternativo y media | Contenido visual |
| [rules/tablas-datos.md](./rules/tablas-datos.md) | Tablas semánticas | Datos tabulares |

### ARIA y Componentes

| Archivo | Propósito | Cuándo Cargar |
|---------|-----------|---------------|
| [rules/patrones-aria.md](./rules/patrones-aria.md) | Patrones ARIA 1.2 comunes | Componentes custom |
| [rules/roles-estados.md](./rules/roles-estados.md) | Roles y atributos ARIA | Widgets complejos |
| [rules/live-regions.md](./rules/live-regions.md) | Regiones dinámicas | Actualizaciones en vivo |

### Testing y Validación

| Archivo | Propósito | Cuándo Cargar |
|---------|-----------|---------------|
| [rules/testing-accesibilidad.md](./rules/testing-accesibilidad.md) | Testing y herramientas | QA |
| [rules/wcag-checklist.md](./rules/wcag-checklist.md) | Checklist completo WCAG 2.2 | Auditoría |

### Remotion y Video

| Archivo | Propósito | Cuándo Cargar |
|---------|-----------|---------------|
| [rules/remotion-accesible.md](./rules/remotion-accesible.md) | Videos accesibles con Remotion | Proyectos Remotion |

---

## Componentes de Biblioteca

### React Components

```
rules/componentes/
├── SkipLink.tsx              # Enlace para saltar navegación
├── VisuallyHidden.tsx        # Texto solo para lectores de pantalla
├── FocusTrap.tsx             # Trampa de foco para modales
├── Announce.tsx              # Anuncios para lectores de pantalla
├── AccessibleModal.tsx       # Modal accesible completo
├── AccessibleTabs.tsx        # Tabs con ARIA 1.2
├── AccessibleAccordion.tsx   # Acordeón accesible
├── AccessibleTooltip.tsx     # Tooltip accesible
├── AccessibleDropdown.tsx    # Menú desplegable
├── AccessibleToast.tsx       # Notificaciones toast
└── LiveRegion.tsx            # Región viva dinámica
```

### Custom Hooks

```
rules/hooks/
├── useFocusManager.ts        # Gestión de foco
├── useAnnouncer.ts           # Anunciador de cambios
├── useReducedMotion.ts       # Detectar preferencia de movimiento
├── useKeyboardNavigation.ts  # Navegación por teclado
├── useFocusTrap.ts           # Trap de foco
├── useA11yId.ts              # Generador de IDs accesibles
└── useAccessibleForm.ts      # Validación accesible de formularios
```

### Utilidades

```
rules/utilidades/
├── focus-utils.ts            # Utilidades de foco
├── aria-utils.ts             # Helpers de ARIA
├── a11y-testing.ts           # Utilidades de testing
├── keyboard-utils.ts         # Mapeo de teclas
└── announcements.ts          # Sistema de anuncios
```

### Estilos CSS

```
rules/estilos/
├── a11y-base.css             # Estilos base accesibles
├── a11y-components.css       # Componentes accesibles
├── focus-styles.css          # Estilos de foco WCAG 2.2
├── reduced-motion.css        # Preferencias de movimiento
└── print-accessible.css      # Estilos de impresión accesibles
```

---

## Reglas de Oro

### ✅ DEBE (Must)

```yaml
DEBE:
  html_semantico:
    - Usar elementos semánticos HTML5 nativos
    - Usar landmarks correctamente (header, nav, main, aside, footer)
    - Mantener jerarquía de encabezados lógica (h1 → h2 → h3)
    - Usar listas para contenido de lista (ul, ol, dl)
  
  texto_alternativo:
    - Proveer alt descriptivo para imágenes informativas
    - Usar alt vacío (alt="") para imágenes decorativas
    - Proveer transcripciones para audio/video
    - Usar captions para video
  
  teclado:
    - Asegurar navegación completa por teclado (Tab, Shift+Tab)
    - Orden de foco lógico (2.4.3)
    - Indicador de foco visible (2.4.7, 2.4.13 WCAG 2.2)
    - No atrapar el foco (2.1.2)
    - Atajos de teclado configurables (2.1.4)
  
  formularios:
    - Asociar etiquetas con controles (label + for/id)
    - Usar fieldset/legend para grupos
    - Proveer mensajes de error claros (3.3.1, 3.3.3)
    - Usar aria-describedby para ayuda adicional
    - Autocompletado cuando aplique (1.3.5)
    - No repetir entradas (3.3.7 WCAG 2.2)
  
  visual:
    - Mantener contraste 4.5:1 mínimo (texto normal)
    - Mantener contraste 3:1 (texto grande/UI components)
    - No usar solo color para transmitir información (1.4.1)
    - Permitir zoom hasta 200% sin pérdida (1.4.4, 1.4.10)
    - Tamaño de objetivo mínimo 24x24px (2.5.8 WCAG 2.2)
    - Foco no oculto por contenido (2.4.11 WCAG 2.2)
  
  movimiento:
    - Respetar prefers-reduced-motion
    - No autoplay de video/audio sin control
    - No parpadear más de 3 veces por segundo (2.3.1)
  
  aria:
    - Usar roles solo cuando no hay elemento nativo
    - Proveer nombres accesibles para elementos interactivos
    - Actualizar estados aria-* dinámicamente
    - Usar regiones vivas para actualizaciones importantes
```

### ❌ PROHIBIDO (Must Not)

```yaml
PROHIBIDO:
  - Eliminar outline de foco sin reemplazo visible
  - Usar solo color para transmitir información
  - Crear controles no alcanzables por teclado
  - Tener encabezados desordenados (h1 → h3 sin h2)
  - Usar divs clicables en lugar de botones/links
  - Usar tablas para layout
  - Usar placeholder como única etiqueta
  - Redundancia ARIA innecesaria (role="button" en <button>)
  - aria-hidden="true" en elementos focusables
  - Saltos de foco inesperados
  - Bloquear zoom en móviles (user-scalable=no)
  - Autoplay de audio/video sin control de pausa
  - Requerir arrastre sin alternativa (2.5.7 WCAG 2.2)
  - CAPTCHA sin alternativa accesible (3.3.8 WCAG 2.2)
```

---

## Integración con Otras Skills

```yaml
DEPENDE DE:
  - Ninguna (skill fundamental)

TRABAJA CON:
  css3-modern: 
    - Estilos de accesibilidad
    - Custom properties para contraste
    - Media queries prefers-reduced-motion
  
  tailwind-master:
    - Utilidades a11y (sr-only, focus:)
    - Plugins de accesibilidad
    - Configuración de colores accesibles
  
  js-advanced:
    - Comportamiento accesible
    - Manejo de eventos de teclado
    - Focus management
  
  react-hooks:
    - Hooks de accesibilidad
    - Context para anuncios
    - Refs para foco
  
  remotion:
    - Videos accesibles
    - Subtítulos/captions
    - Transcripciones

HABILITA:
  - SEO técnico
  - Cumplimiento legal (ADA, EN 301 549)
  - Usabilidad universal
  - Market reach expandido
```

---

## Referencias Oficiales

### Especificaciones W3C

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) - Web Content Accessibility Guidelines 2.2
- [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/) - Accessible Rich Internet Applications 1.2
- [ARIA in HTML](https://www.w3.org/TR/html-aria/) - Guía de uso de ARIA en HTML
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Patrones de autoría ARIA
- [HTML Living Standard](https://html.spec.whatwg.org/) - Especificación HTML

### Recursos Adicionales

- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)

---

## Licencias y Cumplimiento

Esta skill está diseñada para cumplir con:

- **WCAG 2.2 Nivel AA** (recomendado)
- **WCAG 2.2 Nivel AAA** (cuando sea posible)
- **EN 301 549** (Estándar Europeo)
- **Section 508** (Estándar US)
- **ADA** (Americans with Disabilities Act)

---

**Accesibilidad no es un feature. Es un derecho humano.** ♿

*"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."* — Tim Berners-Lee
