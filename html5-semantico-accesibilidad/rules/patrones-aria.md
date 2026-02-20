# Patrones ARIA (ARIA Authoring Practices)

## Referencias Oficiales

- [WAI-ARIA Authoring Practices 1.2](https://www.w3.org/WAI/ARIA/apg/)
- [ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)

---

## Las 5 Reglas de Oro de ARIA

1. **Usa HTML nativo siempre que sea posible** - No repliques elementos nativos con ARIA
2. **No cambies la semántica nativa** - A menos que sea absolutamente necesario
3. **Los controles ARIA deben funcionar con teclado** - Todos los widgets interactivos
4. **No ocultes elementos focusables** - No uses `aria-hidden="true"` en elementos focusables
5. **Proporciona nombres accesibles** - Todos los elementos interactivos deben tener nombre

---

## Tabs (Pestañas)

### Estructura ARIA

```html
<div class="tabs">
  <div role="tablist" aria-label="Información del producto">
    <button 
      role="tab" 
      id="tab-descripcion"
      aria-selected="true"
      aria-controls="panel-descripcion"
      tabindex="0"
    >
      Descripción
    </button>
    <button 
      role="tab" 
      id="tab-especificaciones"
      aria-selected="false"
      aria-controls="panel-especificaciones"
      tabindex="-1"
    >
      Especificaciones
    </button>
    <button 
      role="tab" 
      id="tab-opiniones"
      aria-selected="false"
      aria-controls="panel-opiniones"
      tabindex="-1"
    >
      Opiniones
    </button>
  </div>
  
  <div 
    role="tabpanel" 
    id="panel-descripcion"
    aria-labelledby="tab-descripcion"
  >
    <h2>Descripción del Producto</h2>
    <p>Contenido de la descripción...</p>
  </div>
  
  <div 
    role="tabpanel" 
    id="panel-especificaciones"
    aria-labelledby="tab-especificaciones"
    hidden
  >
    <h2>Especificaciones Técnicas</h2>
    <p>Contenido de especificaciones...</p>
  </div>
  
  <div 
    role="tabpanel" 
    id="panel-opiniones"
    aria-labelledby="tab-opiniones"
    hidden
  >
    <h2>Opiniones de Clientes</h2>
    <p>Contenido de opiniones...</p>
  </div>
</div>
```

### JavaScript para Tabs

```javascript
class AccessibleTabs {
  constructor(container) {
    this.container = container;
    this.tablist = container.querySelector('[role="tablist"]');
    this.tabs = [...container.querySelectorAll('[role="tab"]')];
    this.panels = [...container.querySelectorAll('[role="tabpanel"]')];
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.tabs.forEach((tab, index) => {
      // Click
      tab.addEventListener('click', () => this.selectTab(index));
      
      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        switch(e.key) {
          case 'ArrowRight':
            e.preventDefault();
            this.focusTab((index + 1) % this.tabs.length);
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.focusTab((index - 1 + this.tabs.length) % this.tabs.length);
            break;
          case 'Home':
            e.preventDefault();
            this.focusTab(0);
            break;
          case 'End':
            e.preventDefault();
            this.focusTab(this.tabs.length - 1);
            break;
        }
      });
    });
  }
  
  focusTab(index) {
    this.tabs[index].focus();
    this.selectTab(index);
  }
  
  selectTab(index) {
    this.tabs.forEach((tab, i) => {
      const isSelected = i === index;
      tab.setAttribute('aria-selected', isSelected);
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');
    });
    
    this.panels.forEach((panel, i) => {
      panel.hidden = i !== index;
    });
  }
}

// Uso
document.querySelectorAll('.tabs').forEach(tabs => {
  new AccessibleTabs(tabs);
});
```

---

## Acordeón

### Estructura ARIA

```html
<div class="accordion">
  <div class="accordion-item">
    <h3>
      <button 
        type="button"
        class="accordion-trigger"
        aria-expanded="false"
        aria-controls="accordion-panel-1"
        id="accordion-header-1"
      >
        <span class="accordion-title">¿Qué es la accesibilidad web?</span>
        <span class="accordion-icon" aria-hidden="true">▼</span>
      </button>
    </h3>
    <div 
      id="accordion-panel-1"
      role="region"
      aria-labelledby="accordion-header-1"
      class="accordion-panel"
      hidden
    >
      <p>La accesibilidad web es la práctica de hacer que los sitios web 
         sean utilizables por todas las personas...</p>
    </div>
  </div>
  
  <div class="accordion-item">
    <h3>
      <button 
        type="button"
        class="accordion-trigger"
        aria-expanded="false"
        aria-controls="accordion-panel-2"
        id="accordion-header-2"
      >
        <span class="accordion-title">¿Por qué es importante?</span>
        <span class="accordion-icon" aria-hidden="true">▼</span>
      </button>
    </h3>
    <div 
      id="accordion-panel-2"
      role="region"
      aria-labelledby="accordion-header-2"
      class="accordion-panel"
      hidden
    >
      <p>La accesibilidad web es importante porque...</p>
    </div>
  </div>
</div>
```

### JavaScript para Acordeón

```javascript
class AccessibleAccordion {
  constructor(container, options = {}) {
    this.container = container;
    this.triggers = [...container.querySelectorAll('.accordion-trigger')];
    this.allowMultiple = options.allowMultiple ?? true;
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', () => this.toggle(trigger));
    });
  }
  
  toggle(trigger) {
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    
    if (!this.allowMultiple && !isExpanded) {
      // Cerrar otros paneles si no se permiten múltiples abiertos
      this.triggers.forEach(t => {
        if (t !== trigger) {
          t.setAttribute('aria-expanded', 'false');
          document.getElementById(t.getAttribute('aria-controls')).hidden = true;
        }
      });
    }
    
    trigger.setAttribute('aria-expanded', !isExpanded);
    panel.hidden = isExpanded;
  }
}
```

---

## Modal/Dialog

### Estructura ARIA

```html
<!-- Botón para abrir -->
<button type="button" onclick="openModal()">
  Abrir Modal
</button>

<!-- Overlay -->
<div 
  class="modal-overlay"
  id="modal-overlay"
  hidden
  onclick="closeModalIfOverlay(event)"
>
  <!-- Dialog -->
  <div 
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
    class="modal"
  >
    <div role="document">
      <header class="modal-header">
        <h2 id="modal-title">Confirmar Acción</h2>
        <button 
          type="button"
          onclick="closeModal()"
          aria-label="Cerrar modal"
          class="modal-close"
        >
          ✕
        </button>
      </header>
      
      <div class="modal-body">
        <p id="modal-description">
          ¿Estás seguro de que deseas eliminar este elemento? 
          Esta acción no se puede deshacer.
        </p>
      </div>
      
      <footer class="modal-footer">
        <button type="button" onclick="closeModal()">
          Cancelar
        </button>
        <button type="button" onclick="confirmAction()">
          Confirmar
        </button>
      </footer>
    </div>
  </div>
</div>
```

### JavaScript para Modal Accesible

```javascript
class AccessibleModal {
  constructor(modalId) {
    this.overlay = document.getElementById(modalId);
    this.modal = this.overlay.querySelector('[role="dialog"]');
    this.closeButton = this.modal.querySelector('.modal-close');
    this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.previousFocus = null;
    
    this.bindEvents();
  }
  
  bindEvents() {
    // Cerrar con Escape
    this.overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
      // Trap focus
      if (e.key === 'Tab') {
        this.trapFocus(e);
      }
    });
    
    // Cerrar con click en overlay
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.close();
      }
    });
  }
  
  open() {
    this.previousFocus = document.activeElement;
    this.overlay.hidden = false;
    
    // Configurar focus trap
    const focusable = [...this.modal.querySelectorAll(this.focusableElements)];
    this.firstFocusable = focusable[0];
    this.lastFocusable = focusable[focusable.length - 1];
    
    // Enfocar el primer elemento o el título
    if (this.firstFocusable) {
      this.firstFocusable.focus();
    }
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.overlay.hidden = true;
    document.body.style.overflow = '';
    
    // Restaurar foco
    if (this.previousFocus) {
      this.previousFocus.focus();
    }
  }
  
  trapFocus(e) {
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault();
        this.lastFocusable.focus();
      }
    } else {
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault();
        this.firstFocusable.focus();
      }
    }
  }
}

// Uso
const modal = new AccessibleModal('modal-overlay');
```

---

## Menú Desplegable (Dropdown)

### Estructura ARIA

```html
<div class="dropdown">
  <button 
    type="button"
    id="menu-button"
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="menu-list"
  >
    Opciones de Usuario
    <span aria-hidden="true">▼</span>
  </button>
  
  <ul 
    id="menu-list"
    role="menu"
    aria-labelledby="menu-button"
    hidden
  >
    <li role="none">
      <button role="menuitem" onclick="viewProfile()">
        Ver Perfil
      </button>
    </li>
    <li role="none">
      <button role="menuitem" onclick="openSettings()">
        Configuración
      </button>
    </li>
    <li role="separator" aria-orientation="horizontal"></li>
    <li role="none">
      <button role="menuitem" onclick="logout()">
        Cerrar Sesión
      </button>
    </li>
  </ul>
</div>
```

---

## Tree View (Árbol)

### Estructura ARIA

```html
<ul role="tree" aria-label="Estructura de carpetas">
  <li role="treeitem" aria-expanded="true" aria-selected="false">
    <span>Documentos</span>
    <ul role="group">
      <li role="treeitem" aria-selected="false">
        <span>Trabajo</span>
        <ul role="group">
          <li role="treeitem" aria-selected="false">Proyecto A.pdf</li>
          <li role="treeitem" aria-selected="false">Proyecto B.docx</li>
        </ul>
      </li>
      <li role="treeitem" aria-expanded="false" aria-selected="false">
        <span>Personal</span>
        <ul role="group" hidden>
          <li role="treeitem" aria-selected="false">Fotos</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

---

## Tooltip

### Estructura ARIA

```html
<button 
  type="button"
  aria-describedby="tooltip-1"
  class="tooltip-trigger"
>
  Guardar
</button>
<div 
  id="tooltip-1"
  role="tooltip"
  class="tooltip"
>
  Guarda los cambios realizados (Ctrl+S)
</div>
```

### CSS para Tooltip

```css
.tooltip {
  position: absolute;
  background: #333;
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s;
}

.tooltip-trigger:hover + .tooltip,
.tooltip-trigger:focus + .tooltip {
  opacity: 1;
  visibility: visible;
}
```

---

## Toggle Button (Botón de Alternancia)

```html
<button 
  type="button"
  aria-pressed="false"
  aria-label="Activar modo oscuro"
  onclick="toggleTheme(this)"
>
  <span aria-hidden="true">🌙</span>
  Modo Oscuro
</button>

<script>
function toggleTheme(button) {
  const isPressed = button.getAttribute('aria-pressed') === 'true';
  button.setAttribute('aria-pressed', !isPressed);
  
  // Cambiar tema
  document.body.classList.toggle('dark-mode', !isPressed);
}
</script>
```

---

## Progress Bar

```html
<!-- Progress nativo -->
<label for="upload-progress">Subiendo archivo:</label>
<progress 
  id="upload-progress"
  value="70" 
  max="100"
  aria-valuenow="70"
  aria-valuemin="0"
  aria-valuemax="100"
>
  70%
</progress>

<!-- Custom progress bar -->
<div 
  role="progressbar"
  aria-valuenow="70"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Progreso de carga"
  class="progress-bar"
>
  <div class="progress-fill" style="width: 70%;"></div>
  <span class="visually-hidden">70% completado</span>
</div>
```

---

## Lista de Verificación de Patrones

```yaml
CHECKLIST_PATRONES_ARIA:
  Tabs:
    - [ ] role="tablist" en contenedor
    - [ ] role="tab" en botones
    - [ ] role="tabpanel" en paneles
    - [ ] aria-selected actualizado
    - [ ] aria-controls en tabs
    - [ ] aria-labelledby en panels
    - [ ] tabindex="-1" en tabs no seleccionados
    - [ ] Navegación con flechas implementada
  
  Acordeón:
    - [ ] aria-expanded en triggers
    - [ ] role="region" en paneles (opcional pero recomendado)
    - [ ] aria-controls en triggers
    - [ ] aria-labelledby en paneles
  
  Modal:
    - [ ] role="dialog"
    - [ ] aria-modal="true"
    - [ ] aria-labelledby para título
    - [ ] aria-describedby para descripción
    - [ ] Focus trap implementado
    - [ ] Escape cierra modal
    - [ ] Foco retorna al trigger
  
  General:
    - [ ] Nombres accesibles para todos los controles
    - [ ] Estados actualizados dinámicamente
    - [ ] Navegación completa por teclado
    - [ ] No hay elementos focusables ocultos
```
