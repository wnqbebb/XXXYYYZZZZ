# LENIS-SCROLL - Skill Completa

## 🎯 Descripción

Lenis es la librería de smooth scroll más performante y ligera del mercado. Diseñada por Darkroom Engineering, proporciona scroll suave buttery con sincronización perfecta para animaciones GSAP, WebGL y efectos parallax.

**"Get smooth or die trying"** — Studio Freight

## 📁 Estructura Completa

```
LENIS-SCROLL/
├── SKILL.md                              # Skill principal - punto de entrada
├── README.md                             # Este archivo
│
├── rules/                                # Reglas especializadas
│   ├── setup-configuration.md            # Setup y configuración
│   ├── gsap-integration.md               # Integración GSAP ScrollTrigger
│   ├── react-integration.md              # Hooks y componentes React
│   ├── scroll-animations.md              # Animaciones basadas en scroll
│   ├── webgl-sync.md                     # Sincronización WebGL/Three.js
│   ├── performance.md                    # Optimización y performance
│   └── accessibility.md                  # Accesibilidad y preferencias
│
└── rules/assets/                         # Código listo para usar
    ├── hooks/
    │   ├── useLenis.ts                   # Hook base
    │   └── useLenisScroll.ts             # Hook con valores de scroll
    ├── components/
    │   ├── LenisProvider.tsx             # Provider React
    │   └── SmoothScroll.tsx              # Componente wrapper
    ├── utils/
    │   └── lenis-config.ts               # Presets de configuración
    └── integrations/
        └── gsap-integration.ts           # Integración GSAP
```

## 🚀 Instalación

```bash
npm install lenis
# o
yarn add lenis
# o
pnpm add lenis
```

### CSS Requerido

```css
html.lenis, html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}
```

## 📋 Setup Rápido

### Básico

```typescript
import Lenis from 'lenis';

const lenis = new Lenis({
  autoRaf: true,
});

lenis.on('scroll', (e) => {
  console.log(e.scroll, e.velocity, e.progress);
});
```

### Con GSAP

```typescript
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ autoRaf: false });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### Con React

```tsx
import { LenisProvider } from './rules/assets/components/LenisProvider';

function App() {
  return (
    <LenisProvider options={{ lerp: 0.1, smoothWheel: true }}>
      <YourApp />
    </LenisProvider>
  );
}
```

## 🎨 Presets de Configuración

| Preset | Uso | Lerp | Características |
|--------|-----|------|-----------------|
| `smooth` | Experiencias premium | 0.08 | Más suave, más lento |
| `responsive` | Sitios rápidos | 0.15 | Más responsive |
| `horizontal` | Scroll horizontal | 0.1 | Orientación horizontal |
| `webgl` | Sync WebGL | 0.1 | syncTouch habilitado |

```typescript
import { createLenis } from './rules/assets/utils/lenis-config';

const lenis = createLenis('smooth');
// o
const lenis = createLenis('webgl', { lerp: 0.05 });
```

## ⚡ Reglas de Oro

```yaml
DEBE:
  - Usar autoRaf: true para mayoría de casos
  - Sincronizar con GSAP ScrollTrigger cuando se use GSAP
  - Implementar prefers-reduced-motion
  - Usar data-lenis-prevent para elementos sin smooth scroll
  - Llamar lenis.destroy() en cleanup
  - Usar lerp O duration, no ambos

PROHIBIDO:
  - Usar setTimeout para delays de scroll
  - No destruir instancias en componentes desmontados
  - Ignorar prefers-reduced-motion
  - Usar scroll nativo y Lenis simultáneamente sin sync
  - Modificar scroll sin usar métodos de Lenis
```

## 🔗 Integraciones

| Tecnología | Regla | Asset |
|------------|-------|-------|
| GSAP | `gsap-integration.md` | `gsap-integration.ts` |
| React | `react-integration.md` | `LenisProvider.tsx` |
| Three.js | `webgl-sync.md` | - |
| CSS | `setup-configuration.md` | - |

## 📚 Referencias Oficiales

- [Lenis Documentation](https://lenis.darkroom.engineering/)
- [GitHub Repository](https://github.com/darkroomengineering/lenis)
- [Lenis Manifesto](https://lenis.darkroom.engineering/manifesto)

---

**Smooth scroll done right.** ✨
