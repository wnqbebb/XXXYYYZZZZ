---
name: splittype-responsive-resize
description: Manejo de redimensionamiento, texto responsive y re-split en cambios de viewport con ResizeObserver.
tags: [splittype, responsive, resize, resizeobserver, viewport]
version: 1.0.0
---

# SplitType Responsive & Resize

Guía completa para manejar redimensionamiento y texto responsive con SplitType. El texto debe mantenerse perfecto en cualquier tamaño de pantalla.

---

## Comportamiento por Defecto

### Relative Position (default)

```typescript
const text = new SplitType('#target', { absolute: false })
```

- ✅ Texto se reajusta automáticamente al resize
- ✅ No requiere re-split
- ✅ Palabras y caracteres fluyen naturalmente
- ⚠️ Líneas pueden cambiar de posición

### Absolute Position

```typescript
const text = new SplitType('#target', { absolute: true })
```

- ❌ Texto NO se reajusta automáticamente
- ⚠️ Requiere ResizeObserver + re-split
- ✅ Mejor performance para animaciones
- ✅ Posiciones fijas para efectos complejos

### Split Lines

```typescript
const text = new SplitType('#target', { types: 'lines, words' })
```

- ❌ Líneas NO se recalculan automáticamente
- ⚠️ Requiere ResizeObserver + re-split
- ✅ Detecta saltos de línea naturales
- ✅ Ideal para animaciones por línea

---

## ResizeObserver Pattern

### Implementación Básica

```typescript
import SplitType from 'split-type'
import { debounce } from 'lodash'

const text = new SplitType('#target', {
  types: 'lines, words',
  absolute: true
})

const container = document.querySelector('.container')
let previousWidth = container.offsetWidth

const resizeObserver = new ResizeObserver(
  debounce(([entry]) => {
    const width = Math.floor(entry.contentRect.width)
    
    // Solo re-split si el ancho cambió
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

### Implementación Completa (React)

```typescript
'use client'
import { useEffect, useRef, useCallback } from 'react'
import SplitType from 'split-type'
import { debounce } from 'lodash'

export function useResponsiveSplitType(
  options: {
    types?: string
    absolute?: boolean
    debounceMs?: number
  } = {}
) {
  const {
    types = 'words, chars',
    absolute = false,
    debounceMs = 100
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const previousWidthRef = useRef<number>(0)

  const initSplitType = useCallback(() => {
    if (!containerRef.current) return

    // Cleanup anterior
    if (textRef.current) {
      textRef.current.revert()
    }

    // Crear nueva instancia
    textRef.current = new SplitType(containerRef.current, {
      types,
      absolute
    })

    previousWidthRef.current = containerRef.current.offsetWidth

    return textRef.current
  }, [types, absolute])

  useEffect(() => {
    // Solo necesita ResizeObserver si absolute=true o types incluye 'lines'
    const needsObserver = absolute || types.includes('lines')
    
    if (!needsObserver) {
      initSplitType()
      return
    }

    const container = containerRef.current
    if (!container) return

    // Crear ResizeObserver
    resizeObserverRef.current = new ResizeObserver(
      debounce(([entry]) => {
        const width = Math.floor(entry.contentRect.width)
        
        if (previousWidthRef.current !== width && textRef.current) {
          textRef.current.split()
          previousWidthRef.current = width
        }
      }, debounceMs)
    )

    resizeObserverRef.current.observe(container)
    initSplitType()

    return () => {
      resizeObserverRef.current?.disconnect()
      textRef.current?.revert()
    }
  }, [initSplitType, absolute, types, debounceMs])

  return { containerRef, textRef }
}
```

---

## Breakpoints y Media Queries

### CSS para Diferentes Breakpoints

```css
/* Mobile First */
.split-text {
  font-size: 2rem;
}

/* Tablet */
@media (min-width: 768px) {
  .split-text {
    font-size: 3rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .split-text {
    font-size: 4rem;
  }
}

/* Large Desktop */
@media (min-width: 1440px) {
  .split-text {
    font-size: 5rem;
  }
}
```

### Re-split en Breakpoints

```typescript
const useBreakpointSplitType = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const breakpoints = {
      mobile: 0,
      tablet: 768,
      desktop: 1024,
      large: 1440
    }

    let currentBreakpoint = 'mobile'

    const handleResize = () => {
      const width = window.innerWidth
      let newBreakpoint = 'mobile'

      if (width >= breakpoints.large) newBreakpoint = 'large'
      else if (width >= breakpoints.desktop) newBreakpoint = 'desktop'
      else if (width >= breakpoints.tablet) newBreakpoint = 'tablet'

      // Re-split solo si cambió el breakpoint
      if (newBreakpoint !== currentBreakpoint) {
        currentBreakpoint = newBreakpoint
        textRef.current?.split()
      }
    }

    // Inicializar
    textRef.current = new SplitType(container, {
      types: 'lines, words',
      absolute: true
    })

    window.addEventListener('resize', debounce(handleResize, 150))

    return () => {
      window.removeEventListener('resize', handleResize)
      textRef.current?.revert()
    }
  }, [])

  return containerRef
}
```

---

## Fluid Typography

### clamp() para Texto Fluido

```css
.split-text {
  /* Tamaño fluido entre mobile y desktop */
  font-size: clamp(2rem, 5vw + 1rem, 5rem);
  
  /* Line-height fluido */
  line-height: clamp(1.2, 1.5vw + 1rem, 1.5);
}
```

### Re-split en Cambios de Font Size

```typescript
const useFluidSplitType = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Observer para cambios de estilo computado
    const observer = new ResizeObserver(
      debounce(() => {
        // Re-split cuando cambie el tamaño
        textRef.current?.split()
      }, 100)
    )

    textRef.current = new SplitType(container, {
      types: 'lines, words, chars'
    })

    observer.observe(container)

    return () => {
      observer.disconnect()
      textRef.current?.revert()
    }
  }, [])

  return containerRef
}
```

---

## Container Queries

### CSS Container Queries

```css
/* Definir contenedor */
.text-container {
  container-type: inline-size;
  container-name: text;
}

/* Estilos basados en contenedor */
@container text (min-width: 400px) {
  .split-text {
    font-size: 3rem;
  }
}

@container text (min-width: 700px) {
  .split-text {
    font-size: 4rem;
  }
}
```

### Container Query + SplitType

```typescript
const useContainerSplitType = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ResizeObserver detecta cambios de contenedor
    const observer = new ResizeObserver(
      debounce(([entry]) => {
        const width = entry.contentRect.width
        
        // Re-split en cambios significativos
        textRef.current?.split()
      }, 100)
    )

    textRef.current = new SplitType(container)
    observer.observe(container)

    return () => {
      observer.disconnect()
      textRef.current?.revert()
    }
  }, [])

  return containerRef
}
```

---

## Orientación del Dispositivo

### Manejo de Cambio de Orientación

```typescript
const useOrientationSplitType = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    textRef.current = new SplitType(container, {
      types: 'lines, words',
      absolute: true
    })

    const handleOrientationChange = () => {
      // Esperar a que termine la transición de orientación
      setTimeout(() => {
        textRef.current?.split()
      }, 300)
    }

    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      textRef.current?.revert()
    }
  }, [])

  return containerRef
}
```

---

## Directrices Críticas

### MUST

```yaml
MUST:
  - Usar ResizeObserver con debounce:
      code: |
        new ResizeObserver(
          debounce(([entry]) => {
            const width = Math.floor(entry.contentRect.width)
            if (previousWidth !== width) {
              text.split()
              previousWidth = width
            }
          }, 100)
        )
      why: "Evita re-split excesivo durante resize continuo"
      
  - Solo re-split cuando sea necesario:
      code: |
        // No necesita observer
        const text = new SplitType('#target', { absolute: false })
        
        // Necesita observer
        const text = new SplitType('#target', { 
          absolute: true,
          types: 'lines' 
        })
      why: "Relative position se reajusta automáticamente"
      
  - Guardar referencia al ancho anterior:
      code: |
        let previousWidth = container.offsetWidth
        
        resizeObserver = new ResizeObserver(([entry]) => {
          const width = Math.floor(entry.contentRect.width)
          if (previousWidth !== width) {
            text.split()
            previousWidth = width
          }
        })
      why: "Evita re-split innecesario"
      
  - Cleanup completo:
      code: |
        return () => {
          resizeObserver.disconnect()
          text.revert()
        }
      why: "Previene memory leaks"
```

### FORBIDDEN

```yaml
FORBIDDEN:
  - Re-split en cada frame:
      wrong: |
        window.addEventListener('resize', () => {
          text.split() // Llamado en cada pixel de resize
        })
      right: |
        window.addEventListener('resize', 
          debounce(() => text.split(), 100)
        )
      why: "Causa layout thrashing y jank"
      
  - Usar ResizeObserver sin condición:
      wrong: |
        // Siempre crear observer
        new ResizeObserver(() => text.split())
      right: |
        // Solo cuando es necesario
        if (absolute || types.includes('lines')) {
          new ResizeObserver(() => text.split())
        }
      why: "Overhead innecesario para relative position"
      
  - Olvidar disconnect:
      wrong: |
        useEffect(() => {
          const observer = new ResizeObserver(...)
          // Sin cleanup
        }, [])
      right: |
        useEffect(() => {
          const observer = new ResizeObserver(...)
          return () => observer.disconnect()
        }, [])
      why: "Memory leak, observer sigue activo"
```

### WHY

```yaml
WHY:
  debounce: |
    Resize events se disparan continuamente durante el drag
    de la ventana. Debounce limita la frecuencia de re-split
    a un valor manejable (típicamente 100ms).
    
  width-check: |
    Comparar con el ancho anterior evita re-split cuando
    solo cambia el alto del contenedor, que no afecta
    el layout del texto.
    
  relative-vs-absolute: |
    Relative position usa inline-block, permitiendo que el
    navegador reajuste el texto naturalmente. Absolute position
    fija coordenadas que deben recalcularse manualmente.
    
  lines-split: |
    Al dividir en líneas, SplitType calcula posiciones basadas
    en el ancho actual. Si el ancho cambia, las posiciones
    de línea ya no son correctas.
```

---

## Ejemplo Completo: Componente Responsive

```typescript
'use client'
import { useEffect, useRef, useState } from 'react'
import SplitType from 'split-type'
import { debounce } from 'lodash'

interface ResponsiveSplitTextProps {
  children: string
  className?: string
  types?: string
  absolute?: boolean
}

export function ResponsiveSplitText({
  children,
  className = '',
  types = 'words, chars',
  absolute = false
}: ResponsiveSplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<SplitType | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const previousWidthRef = useRef<number>(0)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Determinar si necesita ResizeObserver
    const needsObserver = absolute || types.includes('lines')

    const init = () => {
      textRef.current = new SplitType(container, { types, absolute })
      previousWidthRef.current = container.offsetWidth
      setIsReady(true)
    }

    if (needsObserver) {
      resizeObserverRef.current = new ResizeObserver(
        debounce(([entry]) => {
          const width = Math.floor(entry.contentRect.width)
          
          if (previousWidthRef.current !== width && textRef.current) {
            textRef.current.split()
            previousWidthRef.current = width
          }
        }, 100)
      )

      resizeObserverRef.current.observe(container)
    }

    init()

    return () => {
      resizeObserverRef.current?.disconnect()
      textRef.current?.revert()
    }
  }, [children, types, absolute])

  return (
    <div
      ref={containerRef}
      className={`split-text ${className} ${isReady ? 'is-ready' : ''}`}
      style={{ fontKerning: 'none' }}
    >
      {children}
    </div>
  )
}
```

---

## Recursos

- [ResizeObserver MDN](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [clamp() CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
