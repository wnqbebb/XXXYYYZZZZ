# Testing de Accesibilidad

## Referencias

- [WCAG-EM Overview](https://www.w3.org/WAI/test-evaluate/conformance/)
- [ACT Rules](https://www.w3.org/WAI/standards-guidelines/act/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)

---

## Checklist de Testing Manual

### Navegación por Teclado

```yaml
TECLADO:
  - [ ] Navegación completa con Tab y Shift+Tab
  - [ ] Orden de tabulación lógico
  - [ ] Indicador de foco visible en todos los elementos
  - [ ] No hay trampas de teclado
  - [ ] Skip links funcionan correctamente
  - [ ] Modales cierran con Escape
  - [ ] Foco se mantiene en modales (focus trap)
  - [ ] Foco retorna al trigger al cerrar modales
  - [ ] Menús desplegables navegables con flechas
  - [ ] Tabs navegables con flechas izquierda/derecha
  - [ ] Atajos de teclado funcionan (si existen)
```

### Screen Readers

```yaml
SCREEN_READERS:
  NVDA (Windows):
    - [ ] Landmarks navegables con D
    - [ ] Encabezados navegables con H
    - [ ] Formularios navegables con F
    - [ ] Tablas navegables con T
    - [ ] Botones navegables con B
    - [ ] Links navegables con K
    - [ ] Listas navegables con L
    - [ ] Anuncios de estado (aria-live)
    - [ ] Modales anuncian su apertura
    - [ ] Errores de formulario anunciados
  
  VoiceOver (macOS):
    - [ ] Rotor muestra todos los landmarks
    - [ ] Rotor muestra todos los encabezados
    - [ ] Rotor muestra todos los links
    - [ ] Rotor muestra todos los formularios
    - [ ] Controles anunciados correctamente
    - [ ] Estados anunciados (expandido, seleccionado, etc.)
  
  JAWS (Windows):
    - [ ] Modos de navegación funcionan
    - [ ] Virtual cursor navega todo el contenido
    - [ ] Form mode para inputs
```

### Zoom y Responsive

```yaml
ZOOM_RESPONSIVE:
  - [ ] Funciona al 200% zoom
  - [ ] Funciona al 400% zoom (mobile)
  - [ ] No hay pérdida de información
  - [ ] No hay scroll horizontal innecesario
  - [ ] Controles aún usables
  - [ ] Texto no se superpone
```

### Contraste y Visual

```yaml
CONTRASTE:
  - [ ] Texto normal: 4.5:1 mínimo
  - [ ] Texto grande: 3:1 mínimo
  - [ ] Componentes UI: 3:1 mínimo
  - [ ] Gráficos: 3:1 mínimo
  - [ ] Foco visible: 3:1 mínimo
  - [ ] No se usa solo color para información
```

---

## Herramientas Automatizadas

### axe-core

```bash
# Instalación
npm install @axe-core/react @axe-core/cli
```

```typescript
// Integración con React
import React from 'react';
import ReactDOM from 'react-dom';
import axe from '@axe-core/react';

if (process.env.NODE_ENV !== 'production') {
  axe(React, ReactDOM, 1000);
}
```

```javascript
// Test con Jest
import { run } from 'axe-core';

test('página sin violaciones de accesibilidad', async () => {
  const results = await run(document);
  expect(results.violations).toHaveLength(0);
});
```

### Lighthouse

```bash
# CLI
lighthouse https://example.com --only-categories=accessibility

# Thresholds recomendados
# - Accesibilidad: 100
# - SEO: 90+
# - Best Practices: 90+
```

### Pa11y

```bash
# Instalación
npm install -g pa11y

# Uso
pa11y https://example.com
pa11y --standard WCAG2AA https://example.com

# Ignorar ciertos warnings
pa11y --ignore "warning;notice" https://example.com
```

### WAVE

```bash
# Extensión de navegador
# https://wave.webaim.org/extension/

# API
npm install wave-client
```

---

## Testing con Playwright

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});

// tests/a11y.spec.ts
import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Accesibilidad', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await injectAxe(page);
  });

  test('página principal sin violaciones críticas', async ({ page }) => {
    await checkA11y(page, {
      axeOptions: {
        runOnly: {
          type: 'tag',
          values: ['wcag2aa', 'wcag2a'],
        },
      },
    });
  });

  test('navegación por teclado funciona', async ({ page }) => {
    // Tab al primer enlace
    await page.keyboard.press('Tab');
    const firstLink = page.locator(':focus');
    await expect(firstLink).toBeVisible();
    
    // Navegar por menú
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
    }
    
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('skip link visible al enfocar', async ({ page }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeVisible();
  });

  test('modal trap focus', async ({ page }) => {
    // Abrir modal
    await page.click('button[data-testid="open-modal"]');
    
    // Tab varias veces
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
    }
    
    // Verificar que el foco sigue en el modal
    const modal = page.locator('[role="dialog"]');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeWithin(modal);
  });
});
```

---

## Testing con Cypress

```javascript
// cypress/support/commands.js
import 'cypress-axe';

// Comando personalizado
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.injectAxe();
  cy.checkA11y(context, options, (violations) => {
    if (violations.length) {
      cy.task('log', `${violations.length} violación(es) encontradas`);
    }
  });
});

// cypress/e2e/a11y.cy.js
describe('Tests de Accesibilidad', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('página sin violaciones', () => {
    cy.checkA11y(null, {
      runOnly: {
        type: 'tag',
        values: ['wcag2aa'],
      },
    });
  });

  it('formulario sin violaciones', () => {
    cy.visit('/formulario');
    cy.checkA11y('form', {
      rules: {
        'label': { enabled: true },
        'aria-required-attr': { enabled: true },
      },
    });
  });

  it('navegación por teclado', () => {
    cy.get('body').tab(); // requiere cypress-plugin-tab
    cy.focused().should('have.class', 'skip-link');
    
    cy.focused().tab();
    cy.focused().should('have.attr', 'role', 'navigation');
  });
});
```

---

## Testing de Screen Readers

### NVDA (Windows)

```python
# nvda-test.py - Script de prueba básico
import time

# Instrucciones de prueba manual con NVDA:
# 1. Instalar NVDA desde nvaccess.org
# 2. Configurar modo de voz "Hablar todo" desactivado
# 3. Probar comandos:

COMANDOS_NVDA = {
    "Siguiente landmark": "d",
    "Anterior landmark": "shift+d",
    "Siguiente encabezado": "h",
    "Encabezado nivel 1": "1",
    "Lista de landmarks": "NVDA+f7",
    "Modo foco/forms": "NVDA+space",
    "Leer elemento enfocado": "NVDA+tab",
}

# Checklist NVDA
def nvda_checklist():
    return [
        "Landmarks anunciados correctamente",
        "Encabezados navegables con H",
        "Formularios en modo foco",
        "Botones anunciados como 'botón'",
        "Links anunciados como 'enlace'",
        "Estados expandido/colapsado anunciados",
        "Errores de formulario anunciados",
    ]
```

### VoiceOver (macOS)

```bash
# Activar VoiceOver
Cmd + F5

# Comandos esenciales
Ctrl + Option + U  # Rotor
Ctrl + Option + Flechas  # Navegar
Ctrl + Option + Space  # Activar
Ctrl + Option + Cmd + H  # Siguiente encabezado
Ctrl + Option + Cmd + L  # Siguiente link
```

---

## Testing de Contraste

### Herramientas

```javascript
// contrast-checker.js
function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function getLuminance(color) {
  const rgb = hexToRgb(color);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Tests
describe('Contraste de color', () => {
  it('debe cumplir WCAG AA (4.5:1)', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });
  
  it('debe cumplir WCAG AAA (7:1)', () => {
    expect(getContrastRatio('#000000', '#ffffff')).toBeGreaterThanOrEqual(7);
  });
});
```

---

## CI/CD Integration

```yaml
# .github/workflows/a11y.yml
name: Accesibilidad

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Start server
        run: npm start &
      
      - name: Run axe
        run: |
          npx wait-on http://localhost:3000
          npx @axe-core/cli http://localhost:3000 --exit
      
      - name: Run Pa11y
        run: |
          npm install -g pa11y
          pa11y http://localhost:3000 --standard WCAG2AA
      
      - name: Run tests
        run: npm run test:a11y
```

---

## Reporte de Issues

### Template

```markdown
## Issue de Accesibilidad

### Descripción
[Breve descripción del problema]

### Criterio WCAG Violado
- Criterio: [ej. 1.1.1 Non-text Content]
- Nivel: [A/AA/AAA]
- Impacto: [Crítico/Serio/Moderado/Menor]

### Pasos para Reproducir
1. [Paso 1]
2. [Paso 2]
3. [Paso 3]

### Comportamiento Esperado
[Lo que debería suceder]

### Comportamiento Actual
[Lo que sucede actualmente]

### Entorno
- Navegador: [ej. Chrome 120]
- Screen reader: [ej. NVDA 2023.3]
- Sistema operativo: [ej. Windows 11]

### Solución Propuesta
[Posible solución]

### Referencias
- [WCAG Understanding](link)
- [Técnica WAI-ARIA](link)
```
