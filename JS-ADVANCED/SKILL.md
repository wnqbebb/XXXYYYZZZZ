---
name: js-advanced
description: Advanced JavaScript patterns, performance optimization, and modern features. Use (1) Complex logic, (2) Performance optimization, (3) Async patterns, (4) Architecture decisions. MANDATORY for sophisticated applications.
metadata:
  tags:
    - javascript
    - performance
    - patterns
    - async
    - architecture
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: critical
---

# JS-ADVANCED

> **"Code is poetry. Performance is discipline."**

Esta habilidad representa el nivel más alto de dominio en JavaScript. Aquí no escribimos código que "simplemente funciona"; escribimos código que es elegante, performante, escalable y mantenible.

## Filosofía

- **Clarity over cleverness**: El código inteligente es el que otros pueden entender
- **Performance by design**: La optimización es una decisión arquitectónica, no un afterthought
- **Patterns over recipes**: Entendemos los principios, no memorizamos soluciones
- **Async is the default**: El JavaScript moderno es inherentemente asíncrono
- **Type safety matters**: Incluso sin TypeScript, pensamos en tipos

---

## Índice de Reglas

### Core Patterns

| Regla | Descripción | Nivel |
|-------|-------------|-------|
| [patterns.md](./rules/patterns.md) | Design patterns y arquitectura de código | Essential |
| [architecture.md](./rules/architecture.md) | Arquitectura de aplicaciones escalables | Advanced |
| [functional.md](./rules/functional.md) | Programación funcional | Intermediate |

### Async & Concurrency

| Regla | Descripción | Nivel |
|-------|-------------|-------|
| [async.md](./rules/async.md) | Patrones asíncronos avanzados | Essential |
| [web-workers.md](./rules/web-workers.md) | Web Workers y multithreading | Advanced |

### Performance & Optimization

| Regla | Descripción | Nivel |
|-------|-------------|-------|
| [performance.md](./rules/performance.md) | Optimización y memory management | Critical |
| [modern-features.md](./rules/modern-features.md) | ES2020-2024 features | Intermediate |

### Quality & Reliability

| Regla | Descripción | Nivel |
|-------|-------------|-------|
| [error-handling.md](./rules/error-handling.md) | Manejo de errores profesional | Essential |
| [testing-patterns.md](./rules/testing-patterns.md) | Patrones de testing | Intermediate |

---

## Assets de Código

Ubicados en [`./rules/assets/`](./rules/assets/):

### Utilities

| Archivo | Propósito | Dependencias |
|---------|-----------|--------------|
| `EventUtils.ts` | Debounce, throttle, event delegation | None |
| `AsyncUtils.ts` | Retry, timeout, parallel execution | None |
| `Memoization.ts` | Cache de resultados de funciones | WeakMap support |

### Performance Patterns

| Archivo | Propósito | Caso de Uso |
|---------|-----------|-------------|
| `ObjectPool.ts` | Reutilización de objetos | Games, animations, high-frequency objects |
| `LazyLoader.ts` | Carga lazy de módulos | Code splitting, route-based loading |
| `WorkerPool.ts` | Pool de Web Workers | CPU-intensive operations |

### Architecture Patterns

| Archivo | Propósito | Patrón |
|---------|-----------|--------|
| `Observable.ts` | Implementación de Observer | Pub/Sub, reactive programming |
| `CircuitBreaker.ts` | Patrón Circuit Breaker | Resiliencia en servicios externos |

---

## Cuándo Usar Esta Skill

### ✅ Usar JS-ADVANCED cuando:

- [ ] Implementas lógica de negocio compleja
- [ ] Optimizas critical paths de performance
- [ ] Diseñas arquitectura de aplicaciones
- [ ] Trabajas con operaciones asíncronas complejas
- [ ] Necesitas manejo de errores robusto
- [ ] Implementas patrones de diseño
- [ ] Usas Web Workers o multithreading

### ❌ No es necesaria cuando:

- Scripting simple de una sola función
- Prototipos rápidos desechables
- Configuración básica

---

## Checklist de Verificación de Calidad

### Antes de Commit

- [ ] **Complejidad Cognitiva**: ¿Las funciones son fáciles de entender?
- [ ] **Memory Leaks**: ¿Hay listeners sin cleanup? ¿Referencias circulares?
- [ ] **Race Conditions**: ¿Las operaciones async son determinísticas?
- [ ] **Error Boundaries**: ¿Todos los errores están manejados?
- [ ] **Performance Budget**: ¿El código cumple métricas de performance?

### Arquitectura

- [ ] **Separation of Concerns**: ¿Cada módulo tiene una responsabilidad clara?
- [ ] **Dependency Direction**: ¿Las dependencias apuntan hacia abstracciones?
- [ ] **Testability**: ¿El código es testeable sin mocks complejos?
- [ ] **Extensibility**: ¿Se pueden agregar features sin modificar código existente?

### Async Patterns

- [ ] **Cancellation**: ¿Las operaciones long-running pueden cancelarse?
- [ ] **Resource Management**: ¿Se liberan recursos en caso de error?
- [ ] **Backpressure**: ¿El sistema maneja sobrecarga de requests?
- [ ] **Composition**: ¿Los async flows son composables?

### Performance

- [ ] **Bundle Size**: ¿Se minimiza el código enviado al cliente?
- [ ] **Runtime Efficiency**: ¿Se evitan re-renders/recalculaciones innecesarias?
- [ ] **Memory Footprint**: ¿Se libera memoria no utilizada?
- [ ] **Loading Strategy**: ¿Se usa code splitting y lazy loading?

---

## Métricas de Excelencia

```
┌─────────────────────────────────────────────────────────┐
│  COMPLEJIDAD COGNITIVA                                  │
│  • Funciones: < 15                                      │
│  • Clases: < 10 métodos públicos                        │
│  • Módulos: < 300 líneas                                │
├─────────────────────────────────────────────────────────┤
│  COBERTURA DE TESTING                                   │
│  • Unit tests: > 80%                                    │
│  • Integration tests: Critical paths                    │
│  • Error scenarios: Todos los catch blocks              │
├─────────────────────────────────────────────────────────┤
│  PERFORMANCE                                            │
│  • First Input Delay: < 100ms                           │
│  • Time to Interactive: < 3.8s                          │
│  • Memory leaks: 0 en heap snapshots                    │
├─────────────────────────────────────────────────────────┤
│  CALIDAD DE CÓDIGO                                      │
│  • Zero any types (con TS)                              │
│  • Zero console.log en producción                       │
│  • 100% de errores manejados explícitamente             │
└─────────────────────────────────────────────────────────┘
```

---

## Dependencias Recomendadas

### Core (Siempre incluir pensamiento de estas)

- **Patrones**: Entender SOLID, GRASP, Design Patterns
- **Async**: Promise, async/await, AbortController
- **Types**: TypeScript o JSDoc para type safety

### Opcionales (Según necesidad)

- **Reactive**: RxJS para streams complejos
- **State**: Zustand, Redux Toolkit para state management
- **Testing**: Vitest, Playwright para testing

---

## Recursos Adicionales

### Lecturas Obligatorias

1. [JavaScript: The Good Parts](https://archive.org/details/javascriptgoodpa00croc) - Douglas Crockford
2. [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS) - Kyle Simpson
3. [Eloquent JavaScript](https://eloquentjavascript.net/) - Marijn Haverbeke

### Referencias Rápidas

- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [JavaScript Weekly](https://javascriptweekly.com/)
- [Web.dev Performance](https://web.dev/performance-scoring/)

---

## Versionado

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 3.0.0 | 2024 | ES2024 features, Web Workers patterns, modern architecture |
| 2.0.0 | 2023 | ESM modules, top-level await, performance budgets |
| 1.0.0 | 2022 | Fundamentos de patrones y async |

---

> **Nota**: Esta skill es **CRITICAL** para cualquier aplicación JavaScript no trivial. La ignorancia de estos patrones resulta en deuda técnica que se paga con intereses compuestos.
