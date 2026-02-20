---
name: splittype-api-configuration
description: Referencia completa de la API de SplitType, opciones de configuración, métodos y propiedades.
tags: [splittype, api, configuration, reference]
version: 1.0.0
---

# SplitType API & Configuration

Referencia completa de la API de SplitType. Guía definitiva para configurar y utilizar todas las capacidades de la librería.

---

## Constructor

### `new SplitType(target, options)`

Crea una nueva instancia de SplitType que divide el texto del elemento objetivo.

```typescript
import SplitType from 'split-type'

// Selector string
const text1 = new SplitType('#my-text')

// Elemento único
const element = document.getElementById('my-text')
const text2 = new SplitType(element)

// Múltiples elementos
const elements = document.querySelectorAll('.text-elements')
const text3 = new SplitType(elements)

// Usando el método estático create (sin 'new')
const text4 = SplitType.create('#my-text', { types: 'words, chars' })
```

#### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `target` | `string \| HTMLElement \| ArrayLike<HTMLElement> \| Array<HTMLElement>` | Elemento(s) objetivo a dividir |
| `options` | `Partial<SplitTypeOptions>` | Opciones de configuración (opcional) |

---

## Opciones de Configuración

### `types` (string | string[])

Define qué tipos de división aplicar.

**Valores posibles:**
- `"lines"` - Divide solo en líneas
- `"words"` - Divide solo en palabras
- `"chars"` - Divide solo en caracteres
- `"lines, words, chars"` (default) - Divide en todos los tipos
- `"words, chars"` - Divide en palabras y caracteres

```typescript
// Dividir en líneas, palabras y caracteres (default)
const text1 = new SplitType('#target')

// Dividir solo en palabras y caracteres
const text2 = new SplitType('#target', { types: 'words, chars' })

// Dividir solo en líneas
const text3 = new SplitType('#target', { types: 'lines' })

// Usando array
const text4 = new SplitType('#target', { types: ['words', 'chars'] })
```

> ⚠️ **IMPORTANTE**: No dividir solo en caracteres (`types: 'chars'`) porque se pierden los saltos de línea naturales. Siempre incluir `words` o `lines`.

---

### `absolute` (boolean)

Define si los elementos divididos usan posición absoluta.

```typescript
// Posición relativa (default)
const text1 = new SplitType('#target')

// Posición absoluta
const text2 = new SplitType('#target', { absolute: true })
```

| Modo | Descripción | Use Case |
|------|-------------|----------|
| `false` (default) | `display: inline-block; position: relative` | Mayoría de casos, reflow automático |
| `true` | `position: absolute` | Mejor performance para ciertas animaciones |

> ⚠️ **Cuando `absolute: true` o `types` incluye `"lines"`, el texto NO se reajusta automáticamente al resize. Se requiere ResizeObserver.

---

### `tagName` (string)

Define el tag HTML para los elementos divididos.

```typescript
// Usar span en lugar de div (default: "div")
const text = new SplitType('#target', { tagName: 'span' })
```

**Default:** `"div"`

---

### Clases CSS Personalizadas

#### `lineClass` (string)
Clase para elementos de línea. **Default:** `"line"`

#### `wordClass` (string)
Clase para elementos de palabra. **Default:** `"word"`

#### `charClass` (string)
Clase para elementos de carácter. **Default:** `"char"`

#### `splitClass` (string)
Clase adicional para TODOS los elementos divididos. **Default:** `null`

```typescript
const text = new SplitType('#target', {
  lineClass: 'text-line',
  wordClass: 'text-word',
  charClass: 'text-char',
  splitClass: 'split-element'
})
```

**Resultado HTML:**
```html
<div class="text-line split-element" style="display: block;">
  <div class="text-word split-element" style="display: inline-block;">
    <div class="text-char split-element" style="display: inline-block;">H</div>
    <div class="text-char split-element" style="display: inline-block;">e</div>
    <div class="text-char split-element" style="display: inline-block;">l</div>
    <div class="text-char split-element" style="display: inline-block;">l</div>
    <div class="text-char split-element" style="display: inline-block;">o</div>
  </div>
</div>
```

---

## Propiedades de Instancia

### `lines`
Array de elementos de línea divididos.

```typescript
const text = new SplitType('#target')
console.log(text.lines) // HTMLElement[] | null
```

### `words`
Array de elementos de palabra divididos.

```typescript
const text = new SplitType('#target')
console.log(text.words) // HTMLElement[] | null
```

### `chars`
Array de elementos de carácter divididos.

```typescript
const text = new SplitType('#target')
console.log(text.chars) // HTMLElement[] | null
```

### `isSplit`
Indica si los elementos objetivo están actualmente divididos.

```typescript
const text = new SplitType('#target')
console.log(text.isSplit) // boolean
```

### `settings`
Obtiene la configuración actual de la instancia.

```typescript
const text = new SplitType('#target', { types: 'words' })
console.log(text.settings) // { types: 'words', absolute: false, ... }
```

---

## Métodos de Instancia

### `split(options?)`

Re-divide el texto con nuevas opciones. Útil después de resize o para cambiar configuración.

```typescript
const text = new SplitType('#target')

// Re-dividir con diferentes opciones
text.split({ types: 'chars' })

// Re-dividir con las mismas opciones (útil después de resize)
text.split()
```

---

### `revert()`

Restaura los elementos a su contenido HTML original y limpia el data store interno.

```typescript
const text = new SplitType('#target')

// ... usar para animaciones ...

// Limpiar y restaurar
text.revert()
```

> ✅ **SIEMPRE llamar revert()** al finalizar animaciones o antes de desmontar componentes.

---

## Métodos Estáticos

### `SplitType.create(target, options?)`

Crea una instancia sin usar `new`. Útil para encadenamiento o cuando se prefiere evitar `new`.

```typescript
const text = SplitType.create('#target', { types: 'words, chars' })
```

---

### `SplitType.revert(target)`

Revierte elementos sin necesidad de tener la referencia a la instancia.

```typescript
// Revertir por selector
SplitType.revert('#target')

// Revertir múltiples elementos
SplitType.revert('.text-elements')
```

---

### `SplitType.setDefaults(options)`

Establece valores por defecto globales para todas las instancias.

```typescript
SplitType.setDefaults({
  types: 'words, chars',
  absolute: false,
  tagName: 'span',
  lineClass: 'my-line',
  wordClass: 'my-word',
  charClass: 'my-char'
})

// Ahora todas las instancias usarán estos defaults
const text = new SplitType('#target') // Usa los defaults establecidos
```

---

### `SplitType.defaults`

Obtiene los valores por defecto actuales.

```typescript
console.log(SplitType.defaults)
// { types: 'lines, words, chars', absolute: false, ... }
```

---

## Directrices Críticas

### MUST (Acciones Obligatorias)

```yaml
MUST:
  - Aplicar font-kerning: none a elementos target:
      css: |
        .target {
          font-kerning: none;
        }
      
  - Definir width en flex containers:
      css: |
        .flex-container .target {
          width: 100%;
        }
      
  - Llamar revert() en cleanup:
      code: |
        useEffect(() => {
          const text = new SplitType('#target')
          return () => text.revert()
        }, [])
      
  - Usar ResizeObserver cuando absolute=true o types incluye lines:
      code: |
        const resizeObserver = new ResizeObserver(
          debounce(() => text.split(), 100)
        )
        resizeObserver.observe(container)
```

### FORBIDDEN (Errores Prohibidos)

```yaml
FORBIDDEN:
  - Olvidar font-kerning: none:
      why: "Causa micro-desplazamientos visibles al dividir/revertir"
      
  - Split solo en caracteres:
      wrong: new SplitType('#target', { types: 'chars' })
      right: new SplitType('#target', { types: 'words, chars' })
      why: "Pierde saltos de línea naturales, texto se convierte en una línea"
      
  - No llamar revert():
      why: "Memory leaks y elementos duplicados en el DOM"
      
  - Usar setTimeout para esperar split:
      wrong: setTimeout(() => animate(text.chars), 100)
      right: "El split es síncrono, usar directamente"
      why: "SplitType es síncrono, no requiere espera"
```

### WHY (Justificación Técnica)

```yaml
WHY:
  font-kerning: |
    El kerning ajusta el espacio entre caracteres específicos.
    Al dividir el texto, estos ajustes pueden causar
    micro-desplazamientos visibles. Desactivarlo garantiza
    consistencia visual.
    
  revert: |
    SplitType almacena datos internos y modifica el DOM.
    revert() limpia el data store y restaura el HTML original,
    previniendo memory leaks y acumulación de elementos.
    
  absolute-position: |
    Mejora performance en animaciones complejas al evitar
    recálculos de layout, pero requiere ResizeObserver para
    mantener posiciones correctas en resize.
```

---

## Ejemplos Completos

### Ejemplo Básico

```typescript
import SplitType from 'split-type'

// Setup
const text = new SplitType('#hero-title', {
  types: 'words, chars',
  charClass: 'hero-char'
})

// Animar caracteres (con GSAP)
gsap.from(text.chars, {
  y: 100,
  opacity: 0,
  duration: 0.8,
  stagger: 0.02,
  ease: 'power3.out'
})

// Cleanup
window.addEventListener('beforeunload', () => {
  text.revert()
})
```

### Ejemplo con ResizeObserver

```typescript
import SplitType from 'split-type'
import { debounce } from 'lodash'

const text = new SplitType('#responsive-text', {
  types: 'lines, words',
  absolute: true
})

const container = document.querySelector('.container')
let previousWidth = container.offsetWidth

const resizeObserver = new ResizeObserver(
  debounce(([entry]) => {
    const width = Math.floor(entry.contentRect.width)
    if (previousWidth !== width) {
      text.split()
      previousWidth = width
    }
  }, 100)
)

resizeObserver.observe(container)

// Cleanup
window.addEventListener('beforeunload', () => {
  resizeObserver.disconnect()
  text.revert()
})
```

---

## TypeScript Definitions

```typescript
declare module 'split-type' {
  type TypesValue = ['lines', 'words', 'chars']
  type TypesList = string | TypesValue[number][]

  type SplitTypeOptions = {
    absolute: boolean
    tagName: string
    lineClass: string
    wordClass: string
    charClass: string
    splitClass: string
    types: TypesList
    split: TypesList
  }

  type TargetElement =
    | string
    | HTMLElement
    | ArrayLike<HTMLElement>
    | Array<HTMLElement | ArrayLike<HTMLElement>>

  export default class SplitType {
    lines: HTMLElement[] | null
    words: HTMLElement[] | null
    chars: HTMLElement[] | null
    isSplit: boolean
    settings: SplitTypeOptions

    static defaults: Partial<SplitTypeOptions>
    static data: any
    static clearData(): void
    static setDefaults(options: Partial<SplitTypeOptions>): SplitTypeOptions
    static create(target: TargetElement, options?: Partial<SplitTypeOptions>): SplitType
    static revert(target: TargetElement): void

    constructor(target: TargetElement, options?: Partial<SplitTypeOptions>)
    split(options?: Partial<SplitTypeOptions>): void
    revert(): void
  }
}
```
