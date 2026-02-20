---
name: lenis-scroll-methods
description: Métodos de navegación scrollTo, anchor links, y navegación programática. Incluye manejo de offset y headers fijos.
---

# Scroll Methods - Navegación Programática

## Directrices Críticas

### MUST (Obligatorio)
- [ ] Usar siempre `lenis.scrollTo()` en lugar de `window.scrollTo()` o `element.scrollIntoView()`
- [ ] Implementar `offset` negativo para compensar headers fijos (típicamente -60 a -100px)
- [ ] Validar que el target exista antes de hacer scroll: `document.querySelector(target)`
- [ ] Usar `immediate: true` solo para casos de emergencia (salto instantáneo)
- [ ] Implementar `onComplete` callback para acciones post-scroll
- [ ] Manejar hash links (`#section`) interceptando el evento click
- [ ] Usar `duration` proporcional a la distancia: scrolls largos = duración mayor
- [ ] Implementar scroll progress indicator para navegación de página larga

### FORBIDDEN (Prohibido)
- [ ] Usar `window.scrollTo`, `window.scrollBy`, o `element.scrollIntoView()` nativos
- [ ] Hacer scroll sin offset cuando hay header fijo (el contenido queda oculto)
- [ ] Ignorar el evento `popstate` para navegación con botón atrás/adelante
- [ ] Llamar `scrollTo` con selectores que pueden no existir
- [ ] Hacer scroll a elementos dentro de contenedores con `overflow: hidden`
- [ ] Usar `immediate: true` para navegación regular (rompe la experiencia smooth)
- [ ] Olvidar cancelar el comportamiento nativo del navegador en anchor links

### WHY (Justificación Técnica)
El scroll nativo del navegador (`window.scrollTo`) opera directamente sobre el viewport, ignorando completamente la interpolación suave de Lenis. Esto crea una experiencia disonante donde algunos scrolls son suaves y otros son instantáneos y bruscos. Además, como Lenis mantiene su propio estado de scroll virtual, usar scroll nativo desincroniza la posición interna de Lenis con la posición real del viewport, causando comportamientos erráticos en animaciones GSAP que dependen del scroll. El `offset` es crítico para headers fijos porque sin él, el elemento destino quedaría posicionado detrás del header, invisible para el usuario. La validación del target previene errores de runtime cuando se navega a hashes inexistentes o se eliminan secciones dinámicamente. El manejo de `popstate` es necesario porque el navegador restaura automáticamente la posición de scroll al usar el botón atrás/adelante, operación que bypassa a Lenis y puede dejar la página en una posición incorrecta.

## Ejemplos

### ✅ Correcto - scrollTo Básico
```typescript
// lib/scroll.ts
import Lenis from 'lenis'

interface ScrollOptions {
  offset?: number
  duration?: number
  immediate?: boolean
  easing?: (t: number) => number
  onComplete?: () => void
}

export function scrollTo(
  lenis: Lenis,
  target: string | number | HTMLElement,
  options: ScrollOptions = {}
) {
  const {
    offset = -80, // Offset por header fijo
    duration = 1.5,
    immediate = false,
    easing,
    onComplete,
  } = options

  // Validar target si es string
  if (typeof target === 'string') {
    const element = document.querySelector(target)
    if (!element) {
      console.warn(`Scroll target not found: ${target}`)
      return
    }
  }

  lenis.scrollTo(target, {
    offset,
    duration,
    immediate,
    easing,
    onComplete,
  })
}
```

### ✅ Correcto - Manejo de Anchor Links
```typescript
// components/AnchorNavigation.tsx
'use client'

import { useEffect } from 'react'
import { useLenis } from '@/context/LenisContext'

export function AnchorNavigation() {
  const { lenis } = useLenis()

  useEffect(() => {
    if (!lenis) return

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      
      if (!anchor) return
      
      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      // Prevenir comportamiento nativo
      e.preventDefault()

      // Validar que el elemento exista
      const element = document.querySelector(href)
      if (!element) {
        console.warn(`Anchor target not found: ${href}`)
        return
      }

      // Scroll suave con offset
      lenis.scrollTo(href, {
        offset: -80, // Ajustar según altura del header
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      // Actualizar URL sin recargar
      window.history.pushState(null, '', href)
    }

    // Delegación de eventos
    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [lenis])

  return null
}
```

### ✅ Correcto - Scroll Progress con Lenis
```typescript
// components/ScrollProgress.tsx
'use client'

import { useEffect, useState } from 'react'
import { useLenis } from '@/context/LenisContext'

export function ScrollProgress() {
  const { lenis } = useLenis()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!lenis) return

    const handleScroll = (e: { progress: number }) => {
      setProgress(e.progress)
    }

    lenis.on('scroll', handleScroll)
    return () => lenis.off('scroll', handleScroll)
  }, [lenis])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
      <div
        className="h-full bg-blue-500 transition-none"
        style={{ 
          width: `${progress * 100}%`,
          willChange: 'width',
          transform: 'translateZ(0)'
        }}
      />
    </div>
  )
}
```

### ✅ Correcto - Botón "Volver Arriba"
```typescript
// components/ScrollToTop.tsx
'use client'

import { useEffect, useState } from 'react'
import { useLenis } from '@/context/LenisContext'

export function ScrollToTop() {
  const { lenis } = useLenis()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!lenis) return

    const handleScroll = (e: { scroll: number }) => {
      setIsVisible(e.scroll > 500)
    }

    lenis.on('scroll', handleScroll)
    return () => lenis.off('scroll', handleScroll)
  }, [lenis])

  const scrollToTop = () => {
    lenis?.scrollTo(0, {
      duration: 2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-50"
      aria-label="Volver arriba"
    >
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    </button>
  )
}
```

### ✅ Correcto - Navegación de Página con Popstate
```typescript
// hooks/useScrollRestoration.ts
'use client'

import { useEffect } from 'react'
import { useLenis } from '@/context/LenisContext'

export function useScrollRestoration() {
  const { lenis } = useLenis()

  useEffect(() => {
    if (!lenis) return

    // Manejar navegación con botón atrás/adelante
    const handlePopState = () => {
      const hash = window.location.hash
      
      if (hash) {
        // Scroll a anchor si existe hash
        setTimeout(() => {
          lenis.scrollTo(hash, {
            offset: -80,
            duration: 1,
          })
        }, 100)
      } else {
        // Scroll al inicio
        lenis.scrollTo(0, { immediate: true })
      }
    }

    window.addEventListener('popstate', handlePopState)

    // Manejar carga inicial con hash
    if (window.location.hash) {
      setTimeout(() => {
        lenis.scrollTo(window.location.hash, {
          offset: -80,
          duration: 1,
        })
      }, 100)
    }

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [lenis])
}
```

### ✅ Correcto - Scroll a Elemento Dinámico
```typescript
// components/DynamicScroll.tsx
'use client'

import { useCallback } from 'react'
import { useLenis } from '@/context/LenisContext'

export function DynamicScroll() {
  const { lenis } = useLenis()

  const scrollToElement = useCallback(
    (elementId: string, onArrive?: () => void) => {
      if (!lenis) return

      const element = document.getElementById(elementId)
      if (!element) {
        console.warn(`Element ${elementId} not found`)
        return
      }

      // Calcular duración basada en distancia
      const rect = element.getBoundingClientRect()
      const distance = Math.abs(rect.top)
      const duration = Math.min(Math.max(distance / 500, 0.5), 2)

      lenis.scrollTo(element, {
        offset: -80,
        duration,
        onComplete: onArrive,
      })
    },
    [lenis]
  )

  return (
    <div>
      <button onClick={() => scrollToElement('section-a')}>
        Ir a Sección A
      </button>
      <button onClick={() => scrollToElement('section-b', () => console.log('Llegó!'))}>
        Ir a Sección B (con callback)
      </button>
    </div>
  )
}
```

### ❌ Incorrecto (Scroll Nativo)
```typescript
// MAL: Usando scroll nativo
'use client'

import { useLenis } from '@/context/LenisContext'

export function WrongNavigation() {
  const { lenis } = useLenis()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // ❌ ERROR: Usando scroll nativo - rompe la experiencia smooth
    window.scrollTo({
      top: document.getElementById('target')?.offsetTop || 0,
      behavior: 'smooth', // ❌ Esto no usa Lenis
    })

    // ❌ ERROR: scrollIntoView también es nativo
    document.getElementById('target')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return <button onClick={handleClick}>Scroll</button>
}
```

### ❌ Incorrecto (Sin Offset)
```typescript
// MAL: Sin compensar header fijo
'use client'

import { useLenis } from '@/context/LenisContext'

export function WrongAnchor() {
  const { lenis } = useLenis()

  const scrollToSection = () => {
    // ❌ ERROR: Sin offset, el contenido queda debajo del header
    lenis?.scrollTo('#section', {
      duration: 1.5,
      // offset: -80, // ❌ FALTANTE
    })
  }

  return <button onClick={scrollToSection}>Ir a Sección</button>
}
```

## Referencias
- [Lenis scrollTo Method](https://github.com/studio-freight/lenis#scrollto)
- [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [Element.scrollIntoView](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)
