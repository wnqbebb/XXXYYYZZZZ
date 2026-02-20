---
name: lenis-core-setup
description: Configuración inicial y setup básico de Lenis Smooth Scroll. Cargar primero antes de cualquier otra integración.
---

# Core Setup - Configuración Base de Lenis

## Directrices Críticas

### MUST (Obligatorio)
- [ ] Instalar `lenis` v1.x (última versión estable)
- [ ] Crear componente `SmoothScroll` cliente con `'use client'`
- [ ] Inicializar Lenis dentro de `useEffect` con cleanup adecuado
- [ ] Configurar `duration` entre 1.0 y 1.5 para experiencia premium
- [ ] Usar la easing function recomendada: `(t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`
- [ ] Habilitar `smoothWheel: true` para scroll suave con mouse
- [ ] Configurar `touchMultiplier: 2` para mejor experiencia táctil
- [ ] Llamar `lenis.destroy()` en el cleanup del useEffect

### FORBIDDEN (Prohibido)
- [ ] Inicializar Lenis fuera de useEffect o en el render inicial
- [ ] Usar `smoothWheel: false` - anula el propósito de Lenis
- [ ] Configurar `duration` menor a 0.8 (se siente instantáneo) o mayor a 2.0 (se siente laggy)
- [ ] Olvidar el cleanup que cause memory leaks al navegar
- [ ] Crear múltiples instancias de Lenis simultáneas
- [ ] Usar `window.scrollTo` nativo sin pasar por Lenis

### WHY (Justificación Técnica)
Lenis funciona interceptando el scroll nativo del navegador y aplicando una interpolación suave mediante requestAnimationFrame. La configuración del duration y easing determina la "masa" virtual del scroll - valores muy bajos eliminan la sensación de suavidad, valores muy altos crean una sensación de "pegajosidad" que frustra al usuario. La función de easing exponencial proporciona una desaceleración natural que simula la física de un objeto con inercia. El cleanup es crítico porque Lenis modifica el comportamiento global del scroll y mantiene listeners que pueden causar fugas de memoria si no se destruyen correctamente al desmontar el componente.

## Ejemplos

### ✅ Correcto
```typescript
// components/SmoothScroll.tsx
'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollProps {
  children: ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Inicializar Lenis con configuración óptima
    const lenis = new Lenis({
      duration: 1.2,                           // Suavidad óptima
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing exponencial
      orientation: 'vertical',                 // Scroll vertical
      gestureOrientation: 'vertical',          // Gestos verticales
      smoothWheel: true,                       // Scroll suave con rueda
      wheelMultiplier: 1,                      // Velocidad normal
      touchMultiplier: 2,                      // Scroll más rápido en touch
      infinite: false,                         // No scroll infinito
      autoResize: true,                        // Auto-resize en cambios
    })

    lenisRef.current = lenis

    // RAF loop interno de Lenis
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Cleanup completo
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
```

### ✅ Configuración con Context (Patrón Avanzado)
```typescript
// context/SmoothScrollContext.tsx
'use client'

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'

interface SmoothScrollContextType {
  lenis: Lenis | null
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({ lenis: null })

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <SmoothScrollContext.Provider value={{ lenis: lenisRef.current }}>
      {children}
    </SmoothScrollContext.Provider>
  )
}

export const useSmoothScroll = () => useContext(SmoothScrollContext)
```

### ❌ Incorrecto (Anti-patrón)
```typescript
// MAL: Inicialización fuera de useEffect
'use client'

import Lenis from 'lenis'

// ❌ ERROR: Se crea en cada render y en servidor
const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
})

export function SmoothScroll({ children }) {
  // ❌ ERROR: No hay cleanup, memory leak garantizado
  useEffect(() => {
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  return <>{children}</>
}
```

### ❌ Incorrecto (Múltiples Instancias)
```typescript
// MAL: Creando múltiples instancias
export function Page() {
  // ❌ ERROR: Nueva instancia en cada render
  const lenis = new Lenis({ duration: 1.2 })
  
  useEffect(() => {
    // Esto crea múltiples loops de RAF
    requestAnimationFrame((time) => lenis.raf(time))
  }, [])
  
  return <div>Page</div>
}
```

## Referencias
- [Documentación oficial Lenis](https://github.com/studio-freight/lenis)
- [Lenis + React Ejemplos](https://github.com/studio-freight/lenis/tree/main/packages/react)
- [Easing Functions Reference](https://easings.net/)
