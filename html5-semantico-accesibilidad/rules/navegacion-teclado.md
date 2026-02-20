# Navegación por Teclado

## Referencias Oficiales

- [WCAG 2.1 - Keyboard Accessible](https://www.w3.org/TR/WCAG22/#keyboard-accessible)
- [WCAG 2.4.7 - Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible)
- [WCAG 2.4.11 - Focus Not Obscured (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum)
- [WCAG 2.4.13 - Focus Appearance (WCAG 2.2)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance)

---

## Fundamentos de Navegación por Teclado

### Orden de Tabulación

El orden de tabulación debe seguir el flujo visual de la página (de arriba a abajo, izquierda a derecha).

```html
<!-- ✅ CORRECTO: Orden lógico -->
<form>
  <label for="nombre">Nombre:</label>
  <input type="text" id="nombre">
  
  <label for="email">Email:</label>
  <input type="email" id="email">
  
  <button type="submit">Enviar</button>
</form>

<!-- ❌ INCORRECTO: Orden alterado con tabindex -->
<form>
  <input type="text" tabindex="3">
  <input type="email" tabindex="1">
  <button tabindex="2">Enviar</button>
</form>
```

### Tabindex

```html
<!-- tabindex="0" - Incluye en orden de tabulación natural -->
<div tabindex="0" onclick="doSomething()">
  Elemento enfocable
</div>

<!-- tabindex="-1" - Programáticamente enfocable -->
<div tabindex="-1" id="error-summary">
  Se enfoca con JavaScript, no con Tab
</div>

<!-- ❌ EVITAR: tabindex > 0 -->
<input tabindex="5"> <!-- Altera el orden natural -->
```

---

## Indicadores de Foco (WCAG 2.4.7, 2.4.13)

### CSS para Foco Visible (WCAG 2.2)

```css
/* 
  WCAG 2.4.13 (AAA) requiere:
  - Área mínima del indicador: 2px * perímetro del componente
  - Contraste del indicador: 3:1 contra el fondo
  - Contraste del indicador: 3:1 contra el componente no enfocado
*/

/* Reset - NO eliminar outline sin reemplazo */
/* ❌ NO HAGAS ESTO: */
*:focus {
  outline: none;
}

/* ✅ CORRECTO: Estilos de foco visibles */
/* Opción 1: Outline estándar */
*:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}

/* Opción 2: Background change */
button:focus-visible,
a:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
  background-color: #e6f2ff;
}

/* Opción 3: Box shadow */
input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px #005fcc, 0 0 0 5px white;
}

/* Opción 4: Border */
.custom-button:focus-visible {
  outline: none;
  border: 3px solid #005fcc;
  box-shadow: inset 0 0 0 2px white;
}
```

### Focus Visible vs Focus

```css
/* :focus - Aplica a cualquier elemento enfocado */
input:focus {
  outline: 2px solid blue;
}

/* :focus-visible - Solo cuando el usuario navega con teclado */
button:focus-visible {
  outline: 2px solid blue;
}

/* :focus-within - Cuando algún descendiente está enfocado */
.dropdown:focus-within .dropdown-menu {
  display: block;
}
```

---

## Foco No Obscurecido (WCAG 2.4.11)

### scroll-margin para Foco Visible

```css
/* Asegurar que el foco no quede oculto por elementos sticky/fixed */
:focus-visible {
  scroll-margin-top: 80px; /* Altura del header sticky */
  scroll-margin-bottom: 40px; /* Altura del footer fixed */
}

/* Para elementos en el borde */
.sticky-header :focus-visible {
  scroll-margin-top: 100px;
}
```

### Evitar Overlap con Modales

```css
/* Cuando un modal está abierto, asegurar foco visible */
.modal-open [role="dialog"] :focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 4px;
}

/* Asegurar que el foco no quede detrás del backdrop */
.modal-overlay [role="dialog"] {
  z-index: 1001;
}

.modal-overlay::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}
```

---

## Manejo de Eventos de Teclado

### Teclas Comunes

| Tecla | Función |
|-------|---------|
| Tab | Mover al siguiente elemento enfocable |
| Shift + Tab | Mover al elemento enfocable anterior |
| Enter | Activar botones, enlaces, enviar formularios |
| Espacio | Activar botones, checkboxes, toggles |
| Escape | Cerrar modales, menús, cancelar acciones |
| Flechas | Navegación en componentes (tabs, menús, selects) |
| Home/End | Ir al inicio/fin de listas |
| Page Up/Down | Scroll o navegación en componentes |

### Implementación JavaScript

```javascript
class KeyboardNavigation {
  constructor() {
    this.init();
  }
  
  init() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  
  handleKeydown(e) {
    // Detectar si el usuario está navegando con teclado
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
      document.body.classList.remove('using-mouse');
    }
  }
}

// Detectar mouse vs teclado
document.addEventListener('mousedown', () => {
  document.body.classList.add('using-mouse');
  document.body.classList.remove('using-keyboard');
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('using-keyboard');
    document.body.classList.remove('using-mouse');
  }
});
```

```css
/* Mostrar foco solo cuando se usa teclado */
.using-mouse *:focus {
  outline: none;
}

.using-keyboard *:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}
```

---

## Focus Trap (Trampa de Foco)

Para modales y componentes que requieren foco contenido.

```javascript
class FocusTrap {
  constructor(element) {
    this.element = element;
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.firstFocusable = null;
    this.lastFocusable = null;
    
    this.updateFocusableElements();
    this.bindEvents();
  }
  
  updateFocusableElements() {
    const focusable = [...this.element.querySelectorAll(this.focusableElements)]
      .filter(el => el.offsetParent !== null); // Solo visibles
    
    this.firstFocusable = focusable[0];
    this.lastFocusable = focusable[focusable.length - 1];
  }
  
  bindEvents() {
    this.element.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      this.updateFocusableElements();
      
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === this.firstFocusable) {
          e.preventDefault();
          this.lastFocusable.focus();
        }
      } else {
        // Tab
        if (document.activeElement === this.lastFocusable) {
          e.preventDefault();
          this.firstFocusable.focus();
        }
      }
    });
  }
}

// Uso
const modal = document.querySelector('[role="dialog"]');
const focusTrap = new FocusTrap(modal);
```

---

## Skip Links

### Implementación Completa

```html
<!-- Skip Links múltiples -->
<div class="skip-links">
  <a href="#main-content" class="skip-link">
    Saltar al contenido principal
  </a>
  <a href="#main-nav" class="skip-link">
    Saltar a navegación
  </a>
  <a href="#search" class="skip-link">
    Saltar a búsqueda
  </a>
</div>
```

```css
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10000;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 12px 24px;
  text-decoration: none;
  font-weight: bold;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}
```

---

## Gestos y Alternativas (WCAG 2.5.1, 2.5.7)

```javascript
// Componente con gestos y alternativas de teclado
class SwipeableComponent {
  constructor(element) {
    this.element = element;
    this.startX = 0;
    this.startY = 0;
    
    // Gestos táctiles
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Alternativas de teclado
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
    
    // Botones de control
    this.addControlButtons();
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }
  
  handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX;
    const diffX = this.startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        this.next();
      } else {
        this.previous();
      }
    }
  }
  
  handleKeydown(e) {
    switch(e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.previous();
        break;
      case 'Home':
        e.preventDefault();
        this.first();
        break;
      case 'End':
        e.preventDefault();
        this.last();
        break;
    }
  }
  
  addControlButtons() {
    // Alternativa al gesto de arrastre (WCAG 2.5.7)
    const controls = document.createElement('div');
    controls.className = 'swipe-controls';
    controls.innerHTML = `
      <button type="button" aria-label="Anterior" onclick="this.previous()">←</button>
      <button type="button" aria-label="Siguiente" onclick="this.next()">→</button>
    `;
    this.element.appendChild(controls);
  }
}
```

---

## Lista de Verificación

```yaml
CHECKLIST_TECLADO:
  Navegación:
    - [ ] Todos los elementos interactivos son alcanzables con Tab
    - [ ] Orden de tabulación lógico (2.4.3)
    - [ ] No hay trampas de teclado (2.1.2)
    - [ ] Atajos configurables o desactivables (2.1.4)
  
  Foco:
    - [ ] Indicador de foco visible (2.4.7)
    - [ ] Indicador de foco con suficiente contraste (2.4.13 AAA)
    - [ ] Foco no queda oculto por contenido (2.4.11)
    - [ ] scroll-margin para elementos sticky
  
  Interacción:
    - [ ] Enter activa botones y enlaces
    - [ ] Espacio activa botones, checkboxes
    - [ ] Escape cierra modales y menús
    - [ ] Flechas navegan dentro de componentes
    - [ ] Alternativas a gestos de arrastre (2.5.7)
  
  Focus Management:
    - [ ] Foco se mueve a contenido dinámico
    - [ ] Foco se restaura al cerrar modales
    - [ ] Focus trap en modales
    - [ ] Skip links presentes
```
