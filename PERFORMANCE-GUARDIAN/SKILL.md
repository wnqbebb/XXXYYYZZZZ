---
name: performance-guardian
description: Performance optimization for Core Web Vitals and award-winning web experiences. Use when (1) Optimizing LCP/INP/CLS metrics, (2) Reducing bundle size, (3) Implementing image optimization, (4) Code splitting and lazy loading, (5) Font optimization strategies, (6) Pre-deployment performance audit. MANDATORY before any production deployment.
metadata:
  tags:
    - performance
    - core-web-vitals
    - optimization
    - lighthouse
    - speed
    - lcp
    - inp
    - cls
    - nextjs
    - bundle-analysis
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
  category: performance
  related:
    - gsap-animator
    - lenis-scroll
    - nextjs-architect
    - html5-semantic
---

# Performance Guardian Master System

> **"Every millisecond counts. 60fps or nothing."**

El Performance Guardian es el sistema de optimización integral para garantizar que cada proyecto cumpla con los estándares más exigentes de Core Web Vitals y ofrezca experiencias de usuario premium. Esta skill debe activarse MANDATORIAMENTE antes de cualquier despliegue a producción.

---

## Cuándo Usar Esta Skill

### ✅ Activación Obligatoria

```yaml
USE CUANDO:
  - Pre-deployment audit requerido
  - Optimización de Core Web Vitals (LCP, INP, CLS)
  - Análisis y reducción de bundle size
  - Optimización de imágenes y assets
  - Estrategias de carga de fuentes
  - Code splitting y lazy loading
  - Métricas de Lighthouse < 90
  - Reportes de PageSpeed Insights
  - Cualquier sitio AWWWARDS-level

NO USE:
  - Proyectos de desarrollo/experimentación
  - MVPs temporales sin requisitos de performance
  - Cuando el tiempo de entrega sea crítico (con compensación posterior)
```

---

## Core Web Vitals Targets 2025

```yaml
METRICS:
  LCP (Largest Contentful Paint):
    target: < 2.5s
    good: < 2.5s
    needs_improvement: 2.5s - 4.0s
    poor: > 4.0s
    
  INP (Interaction to Next Paint):
    target: < 200ms
    good: < 200ms
    needs_improvement: 200ms - 500ms
    poor: > 500ms
    
  CLS (Cumulative Layout Shift):
    target: < 0.1
    good: < 0.1
    needs_improvement: 0.1 - 0.25
    poor: > 0.25
    
  FCP (First Contentful Paint):
    target: < 1.8s
    
  TTFB (Time to First Byte):
    target: < 600ms
    
  TBT (Total Blocking Time):
    target: < 200ms
```

---

## Índice de Reglas Atómicas

### Core Web Vitals

| Regla | Descripción | Prioridad |
|-------|-------------|-----------|
| [rules/core-web-vitals.md](./rules/core-web-vitals.md) | Fundamentos y métricas de CWV | Critical |
| [rules/lcp-optimization.md](./rules/lcp-optimization.md) | Optimización de Largest Contentful Paint | Critical |
| [rules/inp-optimization.md](./rules/inp-optimization.md) | Optimización de Interaction to Next Paint | Critical |
| [rules/cls-optimization.md](./rules/cls-optimization.md) | Optimización de Cumulative Layout Shift | Critical |

### Assets Optimization

| Regla | Descripción | Prioridad |
|-------|-------------|-----------|
| [rules/image-optimization.md](./rules/image-optimization.md) | Optimización de imágenes con Next.js | Critical |
| [rules/font-optimization.md](./rules/font-optimization.md) | Estrategias de carga de fuentes | High |
| [rules/script-optimization.md](./rules/script-optimization.md) | Optimización de scripts externos | High |

### Bundle & Code

| Regla | Descripción | Prioridad |
|-------|-------------|-----------|
| [rules/bundle-optimization.md](./rules/bundle-optimization.md) | Análisis y reducción de bundle | Critical |
| [rules/code-splitting.md](./rules/code-splitting.md) | Code splitting y lazy loading | High |
| [rules/caching-strategies.md](./rules/caching-strategies.md) | Estrategias de cacheo | High |

### React & Next.js Specific

| Regla | Descripción | Prioridad |
|-------|-------------|-----------|
| [rules/nextjs-performance.md](./rules/nextjs-performance.md) | Optimizaciones específicas de Next.js | Critical |
| [rules/react-patterns.md](./rules/react-patterns.md) | Patrones de React performantes | High |

---

## Assets de Código

```
rules/assets/
├── components/
│   ├── OptimizedImage.tsx       # Componente de imagen optimizada
│   ├── FontLoader.tsx           # Carga optimizada de fuentes
│   ├── LazyComponent.tsx        # Wrapper para lazy loading
│   └── PerformanceMonitor.tsx   # Monitor de métricas en tiempo real
├── hooks/
│   ├── usePerformance.ts        # Hook para métricas de performance
│   ├── useLazyLoad.ts           # Hook para lazy loading
│   └── useIntersectionObserver.ts # Intersection Observer optimizado
├── utils/
│   ├── image-helpers.ts         # Helpers para optimización de imágenes
│   ├── bundle-analyzer.ts       # Configuración de análisis de bundle
│   └── web-vitals.ts            # Utilidades para Core Web Vitals
└── config/
    ├── next.config.performance.js # Configuración optimizada de Next.js
    └── webpack.optimization.js   # Overrides de Webpack para performance
```

---

## Quick Start Checklist

### Pre-Deployment Audit

```bash
# 1. Análisis de bundle
npm run analyze

# 2. Build de producción
npm run build

# 3. Lighthouse CI
npm run lighthouse

# 4. Web Vitals check
npm run vitals
```

### Métricas Rápidas

```typescript
// lib/web-vitals.ts
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';

export function reportWebVitals(onPerfEntry?: (metric: any) => void) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onINP(onPerfEntry);
    onLCP(onPerfEntry);
    onFCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
}
```

---

## Reglas de Oro

```yaml
DEBE:
  - Usar next/image para TODAS las imágenes
  - Implementar lazy loading para componentes pesados
  - Usar next/font para carga optimizada de fuentes
  - Analizar el bundle antes de cada deployment
  - Implementar code splitting por rutas
  - Usar will-change con precaución y cleanup
  - Optimizar LCP: preload hero image, critical CSS inline
  - Minimizar CLS: dimensiones fijas en imágenes/containers
  - Reducir INP: evitar trabajo pesado en main thread
  - Implementar preconnect y dns-prefetch para recursos externos

PROHIBIDO:
  - Usar img tags nativos sin optimización
  - Cargar fuentes de Google Fonts sin optimización
  - Importar librerías completas cuando solo se necesita una función
  - Animar propiedades que causen layout (width, height, top, left)
  - Usar setState en loops de animación o mousemove
  - Olvidar dimensiones en imágenes (causa CLS)
  - Bloquear el main thread con trabajo síncrono pesado
  - Cargar scripts de terceros sin async/defer/strategy
  - Ignorar prefers-reduced-motion
  - Desplegar sin verificar Core Web Vitals
```

---

## Integración con Otras Skills

```yaml
TRABAJA CON:
  gsap-animator:
    - will-change management
    - GPU acceleration
    - 60fps performance targets
    - Cleanup de animaciones
    
  lenis-scroll:
    - Smooth scroll performance
    - Sync con RAF loop
    - Optimización de event listeners
    
  nextjs-architect:
    - App Router optimization
    - Server Components por defecto
    - Edge runtime cuando aplique
    
  html5-semantic:
    - Estructura ligera y semántica
    - Reducción de DOM depth
    - Accesibilidad sin penalización de performance

DEPENDENCIAS RECOMENDADAS:
  - web-vitals: ^3.5.0
  - @next/bundle-analyzer: ^14.0.0
  - compression-webpack-plugin: ^11.0.0
  - critters: ^0.0.20 (critical CSS)
```

---

## Herramientas de Diagnóstico

```yaml
LAB TOOLS:
  - Lighthouse (Chrome DevTools)
  - PageSpeed Insights
  - WebPageTest
  - GTmetrix
  - Chrome DevTools Performance Panel

FIELD TOOLS:
  - Chrome UX Report (CrUX)
  - web-vitals JavaScript library
  - Vercel Analytics
  - Google Analytics 4 (Core Web Vitals report)

BUNDLE ANALYSIS:
  - @next/bundle-analyzer
  - webpack-bundle-analyzer
  - import-cost (VS Code extension)
  - bundlephobia.com
```

---

## Referencias Oficiales

- [Web Vitals - web.dev](https://web.dev/articles/vitals)
- [Optimize LCP](https://web.dev/articles/optimize-lcp)
- [Optimize INP](https://web.dev/articles/optimize-inp)
- [Optimize CLS](https://web.dev/articles/optimize-cls)
- [Next.js Optimizing](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Core Web Vitals - Google Search](https://developers.google.com/search/docs/appearance/core-web-vitals)

---

**Performance is a feature. Ship fast or ship nothing.** ⚡
