# HTML5 Semántico y Accesibilidad - Skill Completa

## 🎯 Descripción

Esta skill proporciona todo lo necesario para crear sitios web accesibles y semánticos, cumpliendo con:

- **WCAG 2.2** (W3C Recommendation)
- **ARIA 1.2** (W3C Recommendation)
- **EN 301 549** (Estándar Europeo)
- **Section 508** (Estándar US)

## 📁 Estructura de Archivos

```
html5-semantico-accesibilidad/
├── SKILL.md                          # Skill principal - punto de entrada
├── README.md                         # Este archivo
├── DOCUMENTO_TECNICO.md              # Documentación técnica completa
├── EJEMPLOS_PRACTICOS.html           # Ejemplos HTML interactivos
│
├── rules/                            # Reglas especializadas
│   ├── estructura-documento.md       # Estructura HTML5 semántica
│   ├── navegacion-teclado.md         # Navegación por teclado
│   ├── formularios-accesibles.md     # Formularios WCAG 2.2
│   ├── patrones-aria.md              # Patrones ARIA comunes
│   ├── landmarks-aria.md             # Landmarks y regiones
│   ├── testing-accesibilidad.md      # Testing y validación
│   ├── remotion-accesible.md         # Videos accesibles con Remotion
│   │
│   ├── componentes/                  # Componentes React accesibles
│   │   ├── SkipLink.tsx
│   │   ├── VisuallyHidden.tsx
│   │   ├── AccessibleModal.tsx
│   │   ├── AccessibleTabs.tsx
│   │   └── Announce.tsx
│   │
│   ├── hooks/                        # Custom Hooks
│   │   ├── useFocusManager.ts
│   │   ├── useReducedMotion.ts
│   │   └── useAnnouncer.ts
│   │
│   ├── utilidades/                   # Utilidades JavaScript/TypeScript
│   │   ├── focus-utils.ts
│   │   └── aria-utils.ts
│   │
│   └── estilos/                      # CSS accesible
│       └── a11y-base.css
```

## 🚀 Cómo Usar

### 1. Leer el SKILL.md Principal

El archivo `SKILL.md` es el punto de entrada. Contiene:
- Cuándo usar esta skill
- Principios fundamentales de accesibilidad (POUR)
- Novedades de WCAG 2.2
- Reglas de oro (DOs y DON'Ts)

### 2. Consultar Reglas Específicas

Según el contexto de tu proyecto:

| Si necesitas... | Consulta |
|----------------|----------|
| Estructura semántica | `rules/estructura-documento.md` |
| Formularios | `rules/formularios-accesibles.md` |
| Navegación teclado | `rules/navegacion-teclado.md` |
| Componentes ARIA | `rules/patrones-aria.md` |
| Testing | `rules/testing-accesibilidad.md` |
| Remotion | `rules/remotion-accesible.md` |

### 3. Usar Componentes y Hooks

```tsx
// Importar componentes
import { AccessibleModal } from './rules/componentes/AccessibleModal';
import { SkipLink } from './rules/componentes/SkipLink';

// Importar hooks
import { useReducedMotion } from './rules/hooks/useReducedMotion';
import { useFocusManager } from './rules/hooks/useFocusManager';
```

### 4. Incluir Estilos Base

```css
/* En tu CSS global */
@import './rules/estilos/a11y-base.css';
```

## 📋 Checklist Rápido

```yaml
ANTES DE LANZAR:
  Estructura:
    - [ ] HTML semántico correcto
    - [ ] Un solo <main> por página
    - [ ] Jerarquía de headings lógica
    - [ ] Landmarks implementados
  
  Teclado:
    - [ ] Navegación completa con Tab
    - [ ] Skip link funcional
    - [ ] Foco visible en todos elementos
    - [ ] No hay trampas de teclado
  
  Formularios:
    - [ ] Labels asociados a inputs
    - [ ] Mensajes de error claros
    - [ ] Validación accesible
  
  Contenido:
    - [ ] Alt text en imágenes
    - [ ] Textos de enlaces descriptivos
    - [ ] Idioma del documento definido
  
  Testing:
    - [ ] axe-devTools sin violaciones
    - [ ] Lighthouse accesibilidad 100%
    - [ ] Navegación con screen reader
```

## 🧪 Testing

### Herramientas Recomendadas

1. **Automáticas:**
   - axe DevTools (extensión de navegador)
   - Lighthouse (Chrome DevTools)
   - Pa11y (CLI)

2. **Screen Readers:**
   - NVDA (Windows)
   - VoiceOver (macOS)
   - JAWS (Windows)

3. **Manuales:**
   - Navegación solo con teclado
   - Zoom al 200% y 400%
   - Desactivar CSS

### Comandos de Screen Readers

| Acción | NVDA | VoiceOver |
|--------|------|-----------|
| Siguiente landmark | `D` | `VO+U` → Landmarks |
| Siguiente heading | `H` | `VO+Cmd+H` |
| Siguiente formulario | `F` | `VO+U` → Form Controls |
| Lista de elementos | `Insert+F7` | `VO+U` |
| Modo foco/forms | `Insert+Space` | `VO+Space` |

## 📚 Referencias Oficiales

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## 🆕 Novedades WCAG 2.2

Esta skill incluye los 9 nuevos criterios de WCAG 2.2 (2023):

| Criterio | Nivel | Descripción |
|----------|-------|-------------|
| 2.4.11 Focus Not Obscured | AA | Foco no queda oculto |
| 2.4.12 Focus Not Obscured (Enhanced) | AAA | Foco completamente visible |
| 2.4.13 Focus Appearance | AAA | Indicador de foco visible |
| 2.5.7 Dragging Movements | AA | Alternativas al arrastre |
| 2.5.8 Target Size (Minimum) | AA | Tamaño mínimo 24x24px |
| 3.2.6 Consistent Help | A | Ayuda consistente |
| 3.3.7 Redundant Entry | A | No repetir entradas |
| 3.3.8 Accessible Authentication | AA | Auth sin cognitivos |
| 3.3.9 Accessible Authentication (Enhanced) | AAA | Auth alternativas |

## 🤝 Contribuir

Esta skill sigue las mejores prácticas de:
- W3C Web Accessibility Initiative (WAI)
- ARIA Authoring Practices Guide
- HTML Living Standard

## 📄 Licencia

Esta skill es libre de usar en cualquier proyecto.

---

**Accesibilidad no es un feature. Es un derecho humano.** ♿
