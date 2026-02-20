---
name: html5-forms
description: Semantic form structure and accessibility. Load when creating forms.
metadata:
  tags: html5, forms, accessibility, inputs
---

# Forms Rules

## MUST: Label Association

```html
<!-- Explicit association (RECOMMENDED) -->
<label for="email">Correo electrónico</label>
<input type="email" id="email" name="email">

<!-- Implicit association -->
<label>
  Correo electrónico
  <input type="email" name="email">
</label>
```

## MUST: Fieldset and Legend

```html
<fieldset>
  <legend>Información de Contacto</legend>
  
  <label for="name">Nombre</label>
  <input type="text" id="name" name="name">
  
  <label for="email">Email</label>
  <input type="email" id="email" name="email">
</fieldset>

<fieldset>
  <legend>Preferencias</legend>
  
  <label>
    <input type="checkbox" name="newsletter">
    Suscribirse al newsletter
  </label>
</fieldset>
```

## MUST: Required Fields

```html
<label for="phone">
  Teléfono
  <span aria-label="required">*</span>
</label>
<input 
  type="tel" 
  id="phone" 
  name="phone"
  required
  aria-required="true"
  aria-describedby="phone-error"
>
<span id="phone-error" role="alert"></span>
```

## MUST: Input Types

```html
<!-- Use specific types for better UX -->
<input type="email" placeholder="user@example.com">
<input type="tel" placeholder="+34 123 456 789">
<input type="url" placeholder="https://example.com">
<input type="number" min="0" max="100" step="1">
<input type="date">
<input type="time">
<input type="search" placeholder="Buscar...">
```

## MUST: Error Messages

```html
<label for="password">Contraseña</label>
<input 
  type="password" 
  id="password"
  aria-invalid="true"
  aria-describedby="password-error password-hint"
>
<span id="password-hint">Mínimo 8 caracteres</span>
<span id="password-error" role="alert">
  La contraseña es demasiado corta
</span>
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Inputs without labels:
    WRONG: <input placeholder="Email">
    RIGHT: <label for="email">Email</label><input id="email">
    
  Placeholder as label:
    WRONG: <input placeholder="Your name">
    RIGHT: <label>Name</label><input placeholder="John Doe">
    
  Clickable divs instead of buttons:
    WRONG: <div onclick="submit()">Submit</div>
    RIGHT: <button type="submit">Submit</button>
```

---

**Forms mastered. Accessible inputs guaranteed.**
