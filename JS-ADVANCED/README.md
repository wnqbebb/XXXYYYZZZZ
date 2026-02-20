# JS-ADVANCED - Skill Completa

## 🎯 Descripción

JavaScript avanzado con patrones de diseño, arquitectura escalable, programación funcional, async patterns y optimización de performance.

## 📁 Estructura

```
JS-ADVANCED/
├── SKILL.md                    # Skill principal
├── README.md                   # Este archivo
│
├── rules/                      # Reglas especializadas
│   ├── patterns.md             # Design Patterns
│   ├── architecture.md         # Arquitectura (SOLID, Clean, Hexagonal, CQRS)
│   ├── functional.md           # Programación funcional
│   ├── async.md                # Patrones asíncronos
│   ├── web-workers.md          # Web Workers y Multithreading
│   ├── performance.md          # Optimización y memory management
│   ├── modern-features.md      # ES2020-ES2024 features
│   ├── error-handling.md       # Manejo de errores profesional
│   └── testing-patterns.md     # Patrones de testing
│
└── rules/assets/               # Utilidades de código
    ├── EventUtils.ts           # Debounce, throttle, event delegation
    ├── AsyncUtils.ts           # Retry, timeout, parallel execution
    ├── Memoization.ts          # Caché de funciones
    ├── ObjectPool.ts           # Object pooling para performance
    ├── Observable.ts           # Implementación de Observer pattern
    └── CircuitBreaker.ts       # Circuit breaker para resiliencia
```

## 🚀 Cómo Usar

### 1. Importar utilidades

```typescript
import { debounce, throttle } from './rules/assets/EventUtils';
import { withRetry, withTimeout } from './rules/assets/AsyncUtils';
import { memoize, LRUCache } from './rules/assets/Memoization';
import { ObjectPool } from './rules/assets/ObjectPool';
import { Observable, Subject } from './rules/assets/Observable';
import { CircuitBreaker } from './rules/assets/CircuitBreaker';
```

### 2. Aplicar patrones arquitectónicos

```typescript
// Clean Architecture
import { OrderService } from './rules/architecture.md';

// CQRS
import { CommandBus, QueryBus } from './rules/architecture.md';

// Programación funcional
import { Maybe, Result } from './rules/functional.md';
```

## 📋 Checklist

```yaml
ANTES DE MERGE:
  Código:
    - [ ] Sigue principios SOLID
    - [ ] Complejidad cognitiva < 15
    - [ ] Sin memory leaks
    - [ ] Manejo de errores completo
  
  Async:
    - [ ] Race conditions prevenidos
    - [ ] Cancelación implementada (AbortController)
    - [ ] Timeouts configurados
  
  Performance:
    - [ ] No hay allocations en hot paths
    - [ ] Debounce/throttle donde aplique
    - [ ] Lazy loading implementado
  
  Testing:
    - [ ] Unit tests > 80% coverage
    - [ ] Integration tests para flows críticos
    - [ ] Error scenarios testeados
```

## 📚 Referencias

- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [JavaScript: The Good Parts](https://archive.org/details/javascriptgoodpa00croc)
- [Eloquent JavaScript](https://eloquentjavascript.net/)
- [MDN JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

> "Code is poetry. Performance is discipline."
