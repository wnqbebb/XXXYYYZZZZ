---
name: "Next.js Architecture Expert"
description: "Arquitectura avanzada de aplicaciones Next.js 15+ con App Router. Especialista en Server Components, Server Actions, patrones de datos, caching, autenticación y optimización de rendimiento."
tags:
  - nextjs
  - react
  - app-router
  - server-components
  - server-actions
  - full-stack
  - ssr
  - static-site-generation
  - performance
version: "1.0.0"
author: "Claude Code"
---

# Next.js Architecture Expert

## Propósito

Esta habilidad proporciona conocimiento experto para construir aplicaciones Next.js 15+ robustas, escalables y de alto rendimiento utilizando el App Router. Cubre desde los fundamentos de la arquitectura hasta patrones avanzados de datos, autenticación y optimización.

## Alcance

- **Server Components vs Client Components**: Cuándo y cómo usar cada uno
- **Data Fetching**: Patrones modernos de obtención de datos con caching
- **Server Actions**: Mutaciones server-side con formularios
- **Routing**: Convenciones de App Router, rutas dinámicas, paralelas e interceptadas
- **Caching**: Estrategias de cacheo a nivel de fetch, route y revalidate
- **Autenticación**: Middleware, protección de rutas y sesiones
- **Error Handling**: Error boundaries, not-found y loading states
- **Performance**: Optimización de imágenes, fuentes, scripts y lazy loading

## Índice de Reglas

| Regla | Descripción | Archivo |
|-------|-------------|---------|
| Server Components | Fundamentos y mejores prácticas de Server Components | [rules/server-components.md](./rules/server-components.md) |
| Client Components | Uso correcto de Client Components y directivas | [rules/client-components.md](./rules/client-components.md) |
| Data Fetching | Patrones de obtención de datos y caching | [rules/data-fetching.md](./rules/data-fetching.md) |
| Server Actions | Mutaciones, formularios y revalidación | [rules/server-actions.md](./rules/server-actions.md) |
| Routing | Convenciones de App Router y rutas avanzadas | [rules/routing.md](./rules/routing.md) |
| Caching | Estrategias de cacheo y revalidación | [rules/caching.md](./rules/caching.md) |
| Authentication | Middleware, protección de rutas y sesiones | [rules/authentication.md](./rules/authentication.md) |
| Error Handling | Error boundaries y estados de error | [rules/error-handling.md](./rules/error-handling.md) |
| Performance | Optimización de rendimiento | [rules/performance.md](./rules/performance.md) |

## Assets Disponibles

La carpeta `rules/assets/` contiene componentes y utilidades listos para usar:

- `auth-middleware.ts` - Middleware de autenticación con protección de rutas
- `error-boundary.tsx` - Error boundary reutilizable
- `loading-skeleton.tsx` - Skeleton loader genérico
- `data-fetcher.ts` - Utilidades para data fetching con revalidación
- `server-action-wrapper.ts` - Wrapper para Server Actions con manejo de errores

## Principios Fundamentales

1. **Server-First**: Por defecto, todo es Server Component. Usar `'use client'` solo cuando sea necesario.
2. **Data Colocation**: Obtener datos lo más cerca posible de donde se usan.
3. **Progressive Enhancement**: Las aplicaciones deben funcionar sin JavaScript, mejorar con él.
4. **Explicit over Implicit**: Ser explícito sobre estrategias de cacheo y comportamiento.

## Referencias Oficiales

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Documentation](https://nextjs.org/docs/app)
- [Next.js 15 Blog](https://nextjs.org/blog/next-15)
