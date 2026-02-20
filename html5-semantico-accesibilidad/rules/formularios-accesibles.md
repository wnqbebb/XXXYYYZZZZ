# Formularios Accesibles

## Referencias Oficiales

- [WCAG 2.2 - Input Assistance (3.3)](https://www.w3.org/TR/WCAG22/#input-assistance)
- [ARIA 1.2 - Form Properties](https://www.w3.org/TR/wai-aria-1.2/#aria-required)
- [MDN - Form Accessibility](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form)
- [HTML5 Autocomplete](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute)

---

## Fundamentos de Formularios Accesibles

### Asociación Label-Input

```html
<!-- ✅ MÉTODO 1: for + id (Recomendado) -->
<label for="email">Correo electrónico:</label>
<input type="email" id="email" name="email" required>

<!-- ✅ MÉTODO 2: Label implícito -->
<label>
  Correo electrónico:
  <input type="email" name="email" required>
</label>

<!-- ✅ MÉTODO 3: aria-labelledby -->
<span id="email-label">Correo electrónico:</span>
<input type="email" aria-labelledby="email-label" name="email">

<!-- ✅ MÉTODO 4: aria-label (cuando no hay label visible) -->
<input type="email" aria-label="Correo electrónico" name="email">

<!-- ❌ INCORRECTO: Input sin label asociado -->
<label>Correo electrónico:</label>
<input type="email" name="email">

<!-- ❌ INCORRECTO: Solo placeholder -->
<input type="email" placeholder="Correo electrónico">
```

---

## Agrupación de Campos

### Fieldset y Legend

```html
<fieldset>
  <legend>Información de Contacto</legend>
  
  <div class="form-group">
    <label for="nombre">Nombre:</label>
    <input type="text" id="nombre" name="nombre" autocomplete="name">
  </div>
  
  <div class="form-group">
    <label for="telefono">Teléfono:</label>
    <input type="tel" id="telefono" name="telefono" autocomplete="tel">
  </div>
</fieldset>

<fieldset>
  <legend>Método de envío</legend>
  
  <div class="radio-group">
    <input type="radio" id="envio-1" name="envio" value="estandar">
    <label for="envio-1">Estándar (5-7 días)</label>
  </div>
  
  <div class="radio-group">
    <input type="radio" id="envio-2" name="envio" value="express">
    <label for="envio-2">Express (1-2 días)</label>
  </div>
</fieldset>
```

---

## Validación y Errores

### Mensajes de Error Accesibles (WCAG 3.3.1, 3.3.3)

```html
<div class="form-group">
  <label for="email">
    Correo electrónico 
    <span aria-label="requerido">*</span>
  </label>
  
  <input 
    type="email" 
    id="email"
    name="email"
    required
    aria-required="true"
    aria-invalid="false"
    aria-describedby="email-help email-error"
    autocomplete="email"
  >
  
  <div id="email-help" class="help-text">
    Usaremos tu correo para enviarte confirmaciones.
  </div>
  
  <div 
    id="email-error" 
    class="error-message"
    role="alert"
    aria-live="assertive"
    hidden
  >
    Por favor, introduce un correo electrónico válido.
  </div>
</div>
```

```javascript
// Validación accesible
function validateEmail(input) {
  const errorElement = document.getElementById('email-error');
  const isValid = input.validity.valid;
  
  // Actualizar estado ARIA
  input.setAttribute('aria-invalid', !isValid);
  
  if (!isValid) {
    errorElement.hidden = false;
    // Anunciar error a screen readers
    errorElement.textContent = getErrorMessage(input);
  } else {
    errorElement.hidden = true;
  }
}
```

### Resumen de Errores (WCAG 3.3.1)

```html
<!-- Alerta de errores al inicio del formulario -->
<div 
  id="form-errors" 
  role="alert" 
  aria-live="assertive"
  tabindex="-1"
  class="error-summary"
  hidden
>
  <h2>Hay errores en el formulario</h2>
  <ul>
    <li><a href="#email">Correo electrónico: formato inválido</a></li>
    <li><a href="#password">Contraseña: requiere al menos 8 caracteres</a></li>
  </ul>
</div>

<script>
// Enfocar errores al enviar
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    const errorSummary = document.getElementById('form-errors');
    errorSummary.hidden = false;
    errorSummary.focus();
  }
});
</script>
```

---

## Autocomplete y Autofill (WCAG 1.3.5)

### Valores de Autocomplete

```html
<!-- Datos personales -->
<input type="text" autocomplete="name" placeholder="Nombre completo">
<input type="text" autocomplete="given-name" placeholder="Nombre">
<input type="text" autocomplete="family-name" placeholder="Apellido">

<!-- Contacto -->
<input type="email" autocomplete="email" placeholder="Correo">
<input type="tel" autocomplete="tel" placeholder="Teléfono">

<!-- Dirección -->
<input type="text" autocomplete="street-address" placeholder="Calle">
<input type="text" autocomplete="address-line1" placeholder="Línea 1">
<input type="text" autocomplete="address-line2" placeholder="Línea 2">
<input type="text" autocomplete="address-level2" placeholder="Ciudad">
<input type="text" autocomplete="address-level1" placeholder="Estado/Provincia">
<input type="text" autocomplete="postal-code" placeholder="Código postal">
<input type="text" autocomplete="country" placeholder="País">

<!-- Información de pago -->
<input type="text" autocomplete="cc-name" placeholder="Nombre en tarjeta">
<input type="text" autocomplete="cc-number" placeholder="Número de tarjeta">
<input type="text" autocomplete="cc-exp" placeholder="MM/AA">
<input type="text" autocomplete="cc-csc" placeholder="CVV">

<!-- Información de trabajo -->
<input type="text" autocomplete="organization" placeholder="Empresa">
<input type="text" autocomplete="organization-title" placeholder="Cargo">

<!-- Usuario/contraseña -->
<input type="text" autocomplete="username" placeholder="Usuario">
<input type="password" autocomplete="new-password" placeholder="Nueva contraseña">
<input type="password" autocomplete="current-password" placeholder="Contraseña actual">
```

---

## Inputs Específicos

### Input de Contraseña Accesible

```html
<div class="form-group">
  <label for="password">Contraseña:</label>
  
  <div class="password-input-wrapper">
    <input 
      type="password" 
      id="password"
      name="password"
      aria-describedby="password-requirements password-strength"
      aria-invalid="false"
      minlength="8"
      required
    >
    
    <button 
      type="button"
      aria-label="Mostrar contraseña"
      aria-pressed="false"
      onclick="togglePasswordVisibility(this)"
    >
      <span aria-hidden="true">👁️</span>
    </button>
  </div>
  
  <ul id="password-requirements" class="requirements-list">
    <li id="req-length">Mínimo 8 caracteres</li>
    <li id="req-upper">Al menos una mayúscula</li>
    <li id="req-number">Al menos un número</li>
  </ul>
  
  <div id="password-strength" role="status" aria-live="polite" class="sr-only">
    Fortaleza de contraseña
  </div>
</div>

<script>
function togglePasswordVisibility(button) {
  const input = document.getElementById('password');
  const isPressed = button.getAttribute('aria-pressed') === 'true';
  
  input.type = isPressed ? 'password' : 'text';
  button.setAttribute('aria-pressed', !isPressed);
  button.setAttribute('aria-label', 
    isPressed ? 'Mostrar contraseña' : 'Ocultar contraseña'
  );
}
</script>
```

### Input de Búsqueda

```html
<search>
  <form role="search" action="/buscar">
    <label for="search-input">Buscar productos:</label>
    <input 
      type="search" 
      id="search-input"
      name="q"
      placeholder="¿Qué estás buscando?"
      autocomplete="off"
      aria-describedby="search-hint"
    >
    <button type="submit">
      <span aria-hidden="true">🔍</span>
      <span class="visually-hidden">Buscar</span>
    </button>
    <p id="search-hint" class="hint">Presiona Enter para buscar</p>
  </form>
</search>
```

### Input de Fecha

```html
<div class="form-group">
  <label for="fecha-nacimiento">Fecha de nacimiento:</label>
  <input 
    type="date" 
    id="fecha-nacimiento"
    name="fecha-nacimiento"
    min="1900-01-01"
    max="2024-12-31"
    aria-describedby="fecha-ayuda"
  >
  <span id="fecha-ayuda" class="help-text">Formato: DD/MM/AAAA</span>
</div>

<!-- Alternativa para mayor soporte -->
<div class="form-group date-inputs">
  <fieldset>
    <legend>Fecha de nacimiento:</legend>
    
    <label for="dia">Día:</label>
    <input type="number" id="dia" min="1" max="31" aria-label="Día">
    
    <label for="mes">Mes:</label>
    <input type="number" id="mes" min="1" max="12" aria-label="Mes">
    
    <label for="anio">Año:</label>
    <input type="number" id="anio" min="1900" max="2024" aria-label="Año">
  </fieldset>
</div>
```

---

## Select y Optgroup

```html
<label for="pais">País:</label>
<select id="pais" name="pais">
  <option value="">Selecciona un país</option>
  
  <optgroup label="América del Norte">
    <option value="ca">Canadá</option>
    <option value="us">Estados Unidos</option>
    <option value="mx">México</option>
  </optgroup>
  
  <optgroup label="Europa">
    <option value="es">España</option>
    <option value="fr">Francia</option>
    <option value="de">Alemania</option>
  </optgroup>
  
  <optgroup label="Asia">
    <option value="jp">Japón</option>
    <option value="cn">China</option>
  </optgroup>
</select>

<!-- Select múltiple -->
<label for="idiomas">Idiomas que hablas:</label>
<select id="idiomas" name="idiomas" multiple size="4">
  <option value="es">Español</option>
  <option value="en">Inglés</option>
  <option value="fr">Francés</option>
  <option value="de">Alemán</option>
</select>
```

---

## Checkbox y Radio

```html
<!-- Checkbox simple -->
<div class="checkbox-wrapper">
  <input type="checkbox" id="terminos" name="terminos" required>
  <label for="terminos">
    Acepto los <a href="/terminos">términos y condiciones</a>
  </label>
</div>

<!-- Checkbox como switch/toggle -->
<div class="toggle-wrapper">
  <input 
    type="checkbox" 
    id="notificaciones" 
    name="notificaciones"
    role="switch"
    aria-checked="false"
  >
  <label for="notificaciones">Activar notificaciones</label>
</div>

<!-- Grupo de checkboxes -->
<fieldset>
  <legend>Intereses (selecciona todos los que apliquen):</legend>
  
  <div class="checkbox-group">
    <input type="checkbox" id="interes-1" name="intereses" value="tecnologia">
    <label for="interes-1">Tecnología</label>
  </div>
  
  <div class="checkbox-group">
    <input type="checkbox" id="interes-2" name="intereses" value="deportes">
    <label for="interes-2">Deportes</label>
  </div>
  
  <div class="checkbox-group">
    <input type="checkbox" id="interes-3" name="intereses" value="musica">
    <label for="interes-3">Música</label>
  </div>
</fieldset>

<!-- Grupo de radio -->
<fieldset>
  <legend>Tamaño de camiseta:</legend>
  
  <div class="radio-group">
    <input type="radio" id="size-s" name="talla" value="s" checked>
    <label for="size-s">Pequeña (S)</label>
  </div>
  
  <div class="radio-group">
    <input type="radio" id="size-m" name="talla" value="m">
    <label for="size-m">Mediana (M)</label>
  </div>
  
  <div class="radio-group">
    <input type="radio" id="size-l" name="talla" value="l">
    <label for="size-l">Grande (L)</label>
  </div>
</fieldset>
```

---

## WCAG 2.2 - Nuevos Requisitos

### 3.3.7 Redundant Entry (Nivel A)

```html
<!-- Evitar pedir información ya proporcionada -->
<!-- ✅ BIEN: Recordar información entre pasos -->
<form>
  <!-- Paso 1: Información personal -->
  <fieldset>
    <legend>Información de envío</legend>
    <label for="nombre-envio">Nombre:</label>
    <input type="text" id="nombre-envio" name="nombre-envio" autocomplete="name">
    
    <label for="direccion-envio">Dirección:</label>
    <input type="text" id="direccion-envio" name="direccion-envio" autocomplete="street-address">
  </fieldset>
  
  <!-- Paso 2: Información de facturación -->
  <fieldset>
    <legend>Información de facturación</legend>
    
    <!-- Checkbox para usar la misma dirección -->
    <div class="checkbox-wrapper">
      <input type="checkbox" id="misma-direccion" name="misma-direccion" checked>
      <label for="misma-direccion">
        Usar la misma dirección de envío para facturación
      </label>
    </div>
    
    <!-- Campos de facturación (ocultos si se selecciona arriba) -->
    <div id="facturacion-fields" hidden>
      <label for="nombre-factura">Nombre:</label>
      <input type="text" id="nombre-factura" name="nombre-factura">
    </div>
  </fieldset>
</form>
```

### 3.3.8 Accessible Authentication (Nivel AA)

```html
<!-- Alternativas a CAPTCHA cognitivos -->
<div class="captcha-alternatives">
  <!-- Opción 1: Email de verificación -->
  <button type="button" onclick="sendEmailCode()">
    Enviar código por correo
  </button>
  
  <!-- Opción 2: SMS -->
  <button type="button" onclick="sendSMSCode()">
    Enviar código por SMS
  </button>
  
  <!-- Opción 3: Pregunta personal -->
  <fieldset>
    <legend>Verificación de seguridad</legend>
    <p>¿Cuál es el nombre de tu primera mascota?</p>
    <label for="respuesta-seguridad" class="visually-hidden">
      Respuesta de seguridad
    </label>
    <input type="text" id="respuesta-seguridad" autocomplete="off">
  </fieldset>
  
  <!-- Opción 4: WebAuthn/FIDO2 -->
  <button type="button" onclick="useWebAuthn()">
    Usar llave de seguridad física
  </button>
</div>
```

---

## Estilos CSS para Formularios

```css
/* Estructura base */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

/* Inputs base */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="tel"],
input[type="number"],
input[type="search"],
input[type="date"],
input[type="url"],
select,
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  line-height: 1.5;
}

/* Focus visible (WCAG 2.4.7, 2.4.13) */
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
  border-color: #005fcc;
}

/* Estados de validación */
input[aria-invalid="true"] {
  border-color: #d32f2f;
  background-color: #fff5f5;
}

input[aria-invalid="false"] {
  border-color: #388e3c;
}

/* Mensajes de error */
.error-message {
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.error-message::before {
  content: "⚠ ";
}

/* Texto de ayuda */
.help-text {
  color: #666;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Required indicator */
[aria-label="requerido"],
.required {
  color: #d32f2f;
}

/* Fieldset y Legend */
fieldset {
  border: 2px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
}

legend {
  font-weight: bold;
  padding: 0 0.5rem;
}

/* Checkbox y Radio personalizados */
.checkbox-wrapper,
.radio-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.checkbox-wrapper input,
.radio-wrapper input {
  width: auto;
  margin-top: 0.25rem;
}

.checkbox-wrapper label,
.radio-wrapper label {
  margin-bottom: 0;
  font-weight: normal;
}

/* Focus visible para checkboxes/radios */
input[type="checkbox"]:focus-visible,
input[type="radio"]:focus-visible {
  outline: 3px solid #005fcc;
  outline-offset: 2px;
}

/* Tamaño mínimo de objetivo (WCAG 2.5.8) */
input[type="checkbox"],
input[type="radio"] {
  min-width: 24px;
  min-height: 24px;
}

/* Resumen de errores */
.error-summary {
  background: #fff5f5;
  border: 2px solid #d32f2f;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.error-summary h2 {
  color: #d32f2f;
  margin-top: 0;
}

.error-summary a {
  color: #d32f2f;
}

/* Deshabilitado */
input:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Placeholder con suficiente contraste */
::placeholder {
  color: #757575;
  opacity: 1;
}
```

---

## Lista de Verificación

```yaml
CHECKLIST_FORMULARIOS:
  Estructura:
    - [ ] Cada input tiene label asociado
    - [ ] Fieldset/legend para grupos relacionados
    - [ ] autocomplete cuando aplique
    - [ ] Agrupación lógica de campos
  
  Validación:
    - [ ] Mensajes de error claros
    - [ ] aria-invalid actualizado
    - [ ] aria-describedby para errores/ayuda
    - [ ] Resumen de errores al inicio
    - [ ] Enfoque automático a primer error
  
  Teclado:
    - [ ] Orden de tabulación lógico
    - [ ] Focus visible en todos los elementos
    - [ ] No hay trampas de teclado
  
  WCAG 2.2:
    - [ ] 3.3.7 Redundant Entry - evitar repeticiones
    - [ ] 3.3.8 Auth accesible - alternativas a CAPTCHA
```
