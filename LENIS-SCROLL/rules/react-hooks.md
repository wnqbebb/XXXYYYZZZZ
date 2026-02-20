---
name: lenis-react-hooks
description: Hooks personalizados de React para acceder y controlar Lenis. Proporcionan API limpia para componentes hijos.
---

# React Hooks - API Reactiva para Lenis

## Directrices Críticas

### MUST (Obligatorio)
- [ ] Crear Context Provider para compartir la instancia de Lenis
- [ ] Usar `useLenis()` hook para acceder a la instancia desde cualquier componente
- [ ] Crear `useScroll()` hook para suscribirse a eventos de scroll
- [ ] Implementar `useLenisCallback()` para ejecutar código en eventos específicos
- [ ] Usar refs para almacenar la instancia y prevenir re-renders innecesarios
- [ ] Proveer método `scrollTo` accesible desde el contexto
- [ ] Implementar `lenis.scrollTo(target, options)` con offset para headers fijos

### FORBIDDEN (Prohibido)
- [ ] Acceder directamente a `window.lenis` o variables globales
- [ ] Crear nueva instancia de Lenis en cada componente que necesite scroll
- [ ] Usar `useState` para almacenar la instancia de Lenis (causa re-renders en loop)
- [ ] Llamar `scrollTo` sin verificar que Lenis esté inicializado
- [ ] Suscribirse a eventos de scroll sin cleanup adecuado
- [ ] Usar scroll nativo del navegador (`window.scrollTo`, `element.scrollIntoView`)

### WHY (Justificación Técnica)
React funciona con un modelo de flujo de datos unidireccional donde el estado debe ser explícito y trackeable. Lenis modifica el scroll de forma imperativa, fuera del ciclo de vida de React. Sin un Context Provider, cada componente que necesite controlar el scroll tendría que recibir la instancia de Lenis via props drilling, creando acoplamiento innecesario. Usar `useRef` en lugar de `useState` para la instancia es crucial porque Lenis no es un valor que deba renderizarse - es un controlador imperativo. Almacenarlo en state causaría un re-render cada vez que Lenis actualiza su posición interna, creando un loop infinito. Los hooks personalizados encapsulan la lógica de suscripción y cleanup, asegurando que los listeners se registren y eliminen correctamente cuando los componentes se montan y desmontan, previniendo memory leaks.

## Ejemplos

### ✅ Correcto - Context Provider Completo
```typescript
// context/LenisContext.tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Tipos
interface LenisContextType {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: ScrollToOptions) => void
}

interface ScrollToOptions {
  offset?: number
  duration?: number
  immediate?: boolean
  easing?: (t: number) => number
}

// Context
const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
})

// Hook para usar el contexto
export const useLenis = () => useContext(LenisContext)

// Provider
interface LenisProviderProps {
  children: ReactNode
  options?: ConstructorParameters<typeof Lenis>[0]
}

export function LenisProvider({ children, options }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
      ...options,
    })

    lenisRef.current = lenis

    // Integración con GSAP
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      gsap.ticker.remove(lenis.raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [options])

  // Método scrollTo expuesto
  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: ScrollToOptions) => {
      const lenis = lenisRef.current
      if (!lenis) return

      lenis.scrollTo(target, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
        immediate: options?.immediate ?? false,
        easing: options?.easing,
      })
    },
    []
  )

  return (
    <LenisContext.Provider value={{ lenis: lenisRef.current, scrollTo }}>
      {children}
    </LenisContext.Provider>
  )
}
```

### ✅ Correcto - Hook useLenis Callback
```typescript
// hooks/useLenisCallback.ts
'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useLenis } from '@/context/LenisContext'

type LenisEvent = 'scroll' | 'virtual-scroll'

interface ScrollData {
  scroll: number
  limit: number
  velocity: number
  direction: number
  progress: number
}

export function useLenisCallback(
  callback: (lenis: Lenis, data: ScrollData) => void,
  events: LenisEvent[] = ['scroll'],
  deps: React.DependencyList = []
) {
  const { lenis } = useLenis()
  const callbackRef = useRef(callback)

  // Actualizar ref del callback sin causar re-subscripción
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!lenis) return

    const handler = (data: ScrollData) => {
      callbackRef.current(lenis, data)
    }

    events.forEach((event) => {
      lenis.on(event, handler)
    })

    return () => {
      events.forEach((event) => {
        lenis.off(event, handler)
      })
    }
  }, [lenis, events.join(','), ...deps])
}

// Uso del hook
function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useLenisCallback(
    (_, data) => {
      setProgress(data.progress)
    },
    ['scroll'],
    [setProgress]
  )

  return (
    <div className="fixed top-0 left-0 h-1 bg-blue-500" style={{ width: `${progress * 100}%` }} />
  )
}
```

### ✅ Correcto - Hook useScrollProgress
```typescript
// hooks/useScrollProgress.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { useLenis } from '@/context/LenisContext'

interface ScrollProgressData {
  scroll: number
  limit: number
  velocity: number
  direction: number
  progress: number
}

export function useScrollProgress(): ScrollProgressData {
  const { lenis } = useLenis()
  const [data, setData] = useState<ScrollProgressData>({
    scroll: 0,
    limit: 0,
    velocity: 0,
    direction: 0,
    progress: 0,
  })
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!lenis) return

    const updateData = () => {
      setData({
        scroll: lenis.scroll,
        limit: lenis.limit,
        velocity: lenis.velocity,
        direction: lenis.direction,
        progress: lenis.progress,
      })
      rafIdRef.current = requestAnimationFrame(updateData)
    }

    rafIdRef.current = requestAnimationFrame(updateData)

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [lenis])

  return data
}

// Uso
function ParallaxSection() {
  const { scroll, velocity } = useScrollProgress()
  
  return (
    <div style={{ transform: `translateY(${scroll * 0.1}px)` }}>
      Content with parallax
    </div>
  )
}
```

### ✅ Correcto - Hook useLenisScrollTo
```typescript
// hooks/useLenisScrollTo.ts
'use client'

import { useCallback } from 'react'
import { useLenis } from '@/context/LenisContext'

interface ScrollToOptions {
  offset?: number
  duration?: number
  immediate?: boolean
  easing?: (t: number) => number
  onComplete?: () => void
}

export function useLenisScrollTo() {
  const { lenis } = useLenis()

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options: ScrollToOptions = {}) => {
      if (!lenis) {
        console.warn('Lenis not initialized')
        return
      }

      const {
        offset = -80, // Offset por header fijo
        duration = 1.5,
        immediate = false,
        easing,
        onComplete,
      } = options

      lenis.scrollTo(target, {
        offset,
        duration,
        immediate,
        easing,
        onComplete,
      })
    },
    [lenis]
  )

  return scrollTo
}

// Uso en componente
function Navigation() {
  const scrollTo = useLenisScrollTo()

  return (
    <nav>
      <button onClick={() => scrollTo('#section1')}>
        Sección 1
      </button>
      <button onClick={() => scrollTo('#section2', { duration: 2 })}>
        Sección 2 (lento)
      </button>
      <button onClick={() => scrollTo(0, { immediate: true })}>
        Ir arriba (instant)
      </button>
    </nav>
  )
}
```

### ❌ Incorrecto (State en lugar de Ref)
```typescript
// MAL: Usando useState para Lenis
'use client'

import { useState, useEffect } from 'react'
import Lenis from 'lenis'

export function WrongProvider({ children }) {
  // ❌ ERROR: useState causa re-render cada vez que Lenis actualiza
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    })

    setLenis(instance) // ❌ Causa re-render

    function raf(time: number) {
      instance.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      instance.destroy()
    }
  }, [])

  // ❌ Este componente re-renderiza constantemente
  return <>{children}</>
}
```

### ❌ Incorrecto (Acceso Global)
```typescript
// MAL: Variable global
import Lenis from 'lenis'

// ❌ ERROR: Variable global, no funciona con SSR
let lenis: Lenis | null = null

export function initLenis() {
  if (typeof window === 'undefined') return
  
  lenis = new Lenis({
    duration: 1.2,
  })

  return lenis
}

export function getLenis() {
  return lenis
}

// En componente
function SomeComponent() {
  const handleClick = () => {
    // ❌ ERROR: No reactivo, puede ser null
    getLenis()?.scrollTo('#target')
  }

  return <button onClick={handleClick}>Scroll</button>
}
```

## Referencias
- [React Context Documentation](https://react.dev/reference/react/createContext)
- [React useRef Hook](https://react.dev/reference/react/useRef)
- [Lenis Events API](https://github.com/studio-freight/lenis#instance-methods)
