# HTML5 Semántico y Accesibilidad (ARIA)
## Guía Técnica Completa

**Fuentes:** MDN Web Docs, W3C WAI-ARIA Specification, WCAG 2.2 Guidelines, W3C ARIA Authoring Practices Guide (APG)

---

## 1. Roles ARIA Implícitos en Elementos Semánticos HTML5

### 1.1 Tabla de Equivalencias HTML5 ↔ ARIA

Los elementos semánticos HTML5 tienen roles ARIA implícitos que son automáticamente reconocidos por los navegadores modernos y expuestos a las tecnologías de asistencia.

| Elemento HTML5 | Rol ARIA Implícito | Descripción |
|----------------|-------------------|-------------|
| `<header>` (contexto `<body>`) | `banner` | Encabezado del sitio/Documento |
| `<footer>` (contexto `<body>`) | `contentinfo` | Pie de página del documento |
| `<main>` | `main` | Contenido principal del documento |
| `<nav>` | `navigation` | Enlaces de navegación |
| `<aside>` | `complementary` | Contenido relacionado tangencial |
| `<section>` + nombre accesible | `region` | Sección de contenido genérico |
| `<article>` | `article` | Contenido auto-contenido |
| `<search>` | `search` | Funcionalidad de búsqueda |
| `<form>` + nombre accesible | `form` | Colección de controles de formulario |
| `<button>` | `button` | Control interactivo clickable |
| `<a href>` | `link` | Hipervínculo |
| `<input type="checkbox">` | `checkbox` | Casilla de verificación |
| `<input type="radio">` | `radio` | Botón de opción |
| `<input type="text">` | `textbox` | Campo de texto editable |
| `<textarea>` | `textbox` | Área de texto multilínea |
| `<select>` | `combobox` o `listbox` | Lista desplegable |
| `<progress>` | `progressbar` | Indicador de progreso |
| `<meter>` | `meter` | Medidor escalar |
| `<ul>` / `<ol>` | `list` | Lista de elementos |
| `<li>` | `listitem` | Elemento de lista |
| `<table>` | `table` | Tabla de datos |
| `<figure>` | `figure` | Contenido auto-contenido con leyenda |
| `<figcaption>` | N/A (descripción) | Leyenda para figure |
| `<dialog>` | `dialog` | Ventana de diálogo/modal |
| `<details>` | N/A (widget nativo) | Widget de revelado de contenido |
| `<summary>` | `button` | Control de apertura/cierre de details |

### 1.2 Mapeo de Elementos de Sección (Landmarks)

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ejemplo de Roles Implícitos</title>
</head>
<body>
  <!-- Rol implícito: banner -->
  <header>
    <h1>Logo de la Empresa</h1>
    <!-- No necesita role="banner" -->
  </header>

  <!-- Rol implícito: navigation -->
  <nav>
    <!-- No necesita role="navigation" -->
    <ul>
      <li><a href="#inicio">Inicio</a></li>
      <li><a href="#servicios">Servicios</a></li>
      <li><a href="#contacto">Contacto</a></li>
    </ul>
  </nav>

  <!-- Rol implícito: search -->
  <search>
    <!-- No necesita role="search" -->
    <form action="/buscar">
      <label for="busqueda">Buscar:</label>
      <input type="search" id="busqueda" name="q">
      <button type="submit">Buscar</button>
    </form>
  </search>

  <!-- Rol implícito: main -->
  <main>
    <!-- No necesita role="main" -->
    <h2>Contenido Principal</h2>
    
    <!-- Rol implícito: article -->
    <article>
      <h3>Título del Artículo</h3>
      <p>Contenido del artículo...</p>
    </article>

    <!-- Rol implícito: region (con nombre accesible) -->
    <section aria-labelledby="seccion-1">
      <!-- Se convierte en región porque tiene nombre accesible -->
      <h2 id="seccion-1">Sección Anidada</h2>
      <p>Contenido...</p>
    </section>
  </main>

  <!-- Rol implícito: complementary -->
  <aside>
    <!-- No necesita role="complementary" -->
    <h3>Enlaces Relacionados</h3>
    <ul>
      <li><a href="#">Recurso 1</a></li>
      <li><a href="#">Recurso 2</a></li>
    </ul>
  </aside>

  <!-- Rol implícito: contentinfo -->
  <footer>
    <!-- No necesita role="contentinfo" -->
    <p>&copy; 2024 Empresa. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
```

### 1.3 Excepciones de Contexto

Algunos elementos cambian su rol implícito según el contexto:

```html
<!-- Footer dentro de article NO es contentinfo -->
<article>
  <h2>Título del Artículo</h2>
  <p>Contenido...</p>
  <footer>
    <!-- Sin rol landmark implícito -->
    <p>Publicado el 15 de enero de 2024</p>
  </footer>
</article>

<!-- Header dentro de section NO es banner -->
<section>
  <header>
    <!-- Sin rol banner implícito -->
    <h2>Sección Específica</h2>
  </header>
</section>

<!-- Section sin nombre accesible NO es region -->
<section>
  <!-- Sin rol region implícito (genérico) -->
  <h2>Sección Genérica</h2>
</section>
```

---

## 2. HTML5 Nativo vs ARIA: Cuándo Usar Cada Uno

### 2.1 Las 5 Reglas de Oro del Uso de ARIA (W3C)

#### Regla 1: Prioriza HTML Nativo
> *"Si puedes usar un elemento HTML nativo o atributo con la semántica y comportamiento que necesitas ya incorporados, en lugar de reutilizar un elemento y agregar ARIA, hazlo."*

**✅ CORRECTO - HTML Nativo:**
```html
<!-- Button nativo: accesible por defecto -->
<button type="button" onclick="submitForm()">
  Enviar Formulario
</button>

<!-- Input nativo con label -->
<label for="email">Correo Electrónico:</label>
<input type="email" id="email" name="email" required>

<!-- Details/Summary nativo -->
<details>
  <summary>Más Información</summary>
  <p>Contenido expandible...</p>
</details>
```

**❌ INCORRECTO - ARIA Innecesario:**
```html
<!-- NO hagas esto - reimplementas un botón -->
<div role="button" tabindex="0" onclick="submitForm()">
  Enviar Formulario
</div>
<!-- Falta: manejo de teclado (Enter/Espacio), estados, etc. -->
```

#### Regla 2: No Cambies Semántica Nativa
> *"No cambies la semántica nativa, a menos que realmente tengas que hacerlo."*

**❌ INCORRECTO:**
```html
<!-- NO: h2 como tab cambia la semántica del heading -->
<h2 role="tab">Pestaña 1</h2>
```

**✅ CORRECTO:**
```html
<!-- SÍ: Envuelve el heading en el tab -->
<div role="tab">
  <h2>Pestaña 1</h2>
</div>
```

#### Regla 3: Controles Interactivos = Accesibles por Teclado
> *"Todos los controles ARIA interactivos deben ser utilizables con el teclado."*

```javascript
// Ejemplo: Implementación completa de un botón ARIA
class AriaButton {
  constructor(element) {
    this.element = element;
    this.element.setAttribute('role', 'button');
    this.element.setAttribute('tabindex', '0');
    
    // Eventos de teclado obligatorios
    this.element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.element.click();
      }
    });
  }
}
```

#### Regla 4: No Ocultes Elementos Focusables
> *"No uses role='presentation' o aria-hidden='true' en elementos focusables."*

**❌ INCORRECTO:**
```html
<!-- Elemento focusable pero oculto para AT -->
<button aria-hidden="true">Acción</button>
<!-- El usuario puede enfocar "nada" -->
```

**✅ CORRECTO:**
```html
<!-- Si debe estar oculto, quitar del tab order -->
<button tabindex="-1" aria-hidden="true">Acción</button>

<!-- O usar display:none (remueve del árbol de accesibilidad) -->
<button style="display:none">Acción</button>
```

#### Regla 5: Nombres Accesibles para Elementos Interactivos
> *"Todos los elementos interactivos deben tener un nombre accesible."*

```html
<!-- ✅ Métodos para proporcionar nombre accesible -->

<!-- 1. Contenido de texto -->
<button>Guardar Cambios</button>

<!-- 2. Atributo aria-label -->
<button aria-label="Cerrar diálogo">×</button>

<!-- 3. aria-labelledby -->
<h3 id="titulo-form">Registro de Usuario</h3>
<form aria-labelledby="titulo-form">
  <!-- ... -->
</form>

<!-- 4. Atributo alt en imágenes enlaces -->
<a href="/perfil">
  <img src="avatar.jpg" alt="Perfil de Juan">
</a>
```

### 2.2 Matriz de Decisión: HTML vs ARIA

| Escenario | Solución | Ejemplo |
|-----------|----------|---------|
| Elemento existe en HTML5 | Usar HTML nativo | `<button>`, `<nav>`, `<main>` |
| Elemento no existe en HTML5 | Usar ARIA | `role="tabpanel"`, `role="tree"` |
| Soporte de accesibilidad insuficiente | Complementar con ARIA | `<input type="date"` + mejoras |
| Restricciones de diseño | ARIA con cuidado | Botón custom con `role="button"` |
| Widget complejo no nativo | ARIA + JavaScript | Tabs, acordeones, árboles |

### 2.3 Casos de Uso ARIA Justificados

```html
<!-- ✅ ARIA JUSTIFICADO: Tabs personalizadas -->
<div class="tabs">
  <div role="tablist" aria-label="Navegación de secciones">
    <button role="tab" 
            aria-selected="true" 
            aria-controls="panel-1"
            id="tab-1">
      Descripción
    </button>
    <button role="tab" 
            aria-selected="false" 
            aria-controls="panel-2"
            id="tab-2"
            tabindex="-1">
      Especificaciones
    </button>
  </div>
  
  <div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
    <p>Contenido de descripción...</p>
  </div>
  <div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
    <p>Contenido de especificaciones...</p>
  </div>
</div>

<!-- ✅ ARIA JUSTIFICADO: Alertas dinámicas -->
<div role="alert" aria-live="assertive">
  <!-- Contenido inyectado dinámicamente -->
</div>

<!-- ✅ ARIA JUSTIFICADO: Árbol de navegación -->
<ul role="tree" aria-label="Estructura de carpetas">
  <li role="treeitem" aria-expanded="true">
    <span>Documentos</span>
    <ul role="group">
      <li role="treeitem">Archivo 1.pdf</li>
      <li role="treeitem">Archivo 2.pdf</li>
    </ul>
  </li>
</ul>
```

---

## 3. Landmark Regions e Implementación Semántica

### 3.1 Tipos de Landmarks ARIA

| LandMark | Propósito | Elemento HTML5 |
|----------|-----------|----------------|
| `banner` | Encabezado del sitio | `<header>` (contexto body) |
| `navigation` | Grupos de enlaces de navegación | `<nav>` |
| `main` | Contenido principal único | `<main>` |
| `complementary` | Contenido secundario relacionado | `<aside>` |
| `contentinfo` | Pie de página del sitio | `<footer>` (contexto body) |
| `search` | Funcionalidad de búsqueda | `<search>` |
| `form` | Sección de formulario | `<form>` (con nombre) |
| `region` | Sección genérica importante | `<section>` (con nombre) |

### 3.2 Principios de Diseño de Landmarks

#### Paso 1: Incluir TODO el Contenido Percibible

```html
<!-- ✅ CORRECTO: Todo el contenido está en landmarks -->
<body>
  <header><!-- banner --></header>
  <nav><!-- navigation --></nav>
  <main><!-- main --></main>
  <aside><!-- complementary --></aside>
  <footer><!-- contentinfo --></footer>
</body>
```

```html
<!-- ❌ INCORRECTO: Contenido fuera de landmarks -->
<body>
  <header></header>
  <main></main>
  <footer></footer>
  <!-- Este contenido es "invisible" para navegación por landmarks -->
  <div class="cookies-banner">
    Usamos cookies...
  </div>
</body>
```

#### Paso 2: Jerarquía y Anidamiento

```html
<!-- ✅ Landmarks principales a nivel superior -->
<body>
  <header><!-- banner: nivel superior --></header>
  
  <nav><!-- navigation: nivel superior --></nav>
  
  <main>
    <!-- main: nivel superior -->
    
    <!-- Landmarks pueden anidarse -->
    <nav aria-label="Navegación secundaria">
      <!-- navigation anidado -->
    </nav>
    
    <section aria-labelledby="seccion-1">
      <!-- region anidada -->
      <h2 id="seccion-1">Sección Anidada</h2>
    </section>
  </main>
  
  <aside><!-- complementary: nivel superior --></aside>
  <footer><!-- contentinfo: nivel superior --></footer>
</body>
```

#### Paso 3: Etiquetar Landmarks Múltiples

```html
<!-- ✅ Múltiples landmarks del mismo tipo con etiquetas únicas -->
<body>
  <nav aria-label="Navegación principal">
    <ul><!-- enlaces principales --></ul>
  </nav>
  
  <main>
    <article>
      <nav aria-label="Navegación del artículo">
        <!-- enlaces del artículo -->
      </nav>
    </article>
  </main>
  
  <nav aria-label="Navegación de pie de página">
    <ul><!-- enlaces footer --></ul>
  </nav>
</body>
```

### 3.3 Implementación Completa de Landmarks

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ejemplo Completo de Landmarks</title>
</head>
<body>
  <!-- Skip Link para navegación rápida -->
  <a href="#main-content" class="skip-link">
    Saltar al contenido principal
  </a>

  <!-- LANDMARK: banner -->
  <header>
    <div class="logo">
      <img src="logo.png" alt="Nombre de la Empresa">
    </div>
    
    <!-- LANDMARK: search -->
    <search>
      <form action="/buscar" role="search">
        <label for="busqueda-global">Buscar en el sitio:</label>
        <input type="search" id="busqueda-global" name="q">
        <button type="submit">Buscar</button>
      </form>
    </search>
  </header>

  <!-- LANDMARK: navigation (principal) -->
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="/" aria-current="page">Inicio</a></li>
      <li><a href="/productos">Productos</a></li>
      <li><a href="/servicios">Servicios</a></li>
      <li><a href="/nosotros">Nosotros</a></li>
      <li><a href="/contacto">Contacto</a></li>
    </ul>
  </nav>

  <!-- LANDMARK: main -->
  <main id="main-content">
    <h1>Título de la Página</h1>
    
    <!-- LANDMARK: region (section con nombre) -->
    <section aria-labelledby="destacados-titulo">
      <h2 id="destacados-titulo">Contenido Destacado</h2>
      <p>Texto descriptivo...</p>
    </section>

    <!-- LANDMARK: article -->
    <article aria-labelledby="articulo-titulo">
      <header>
        <h2 id="articulo-titulo">Título del Artículo</h2>
        <p>Publicado el <time datetime="2024-01-15">15 de enero de 2024</time></p>
      </header>
      
      <p>Contenido del artículo...</p>
      
      <!-- LANDMARK: navigation (dentro de article) -->
      <nav aria-label="Navegación del artículo">
        <p>Artículos relacionados:</p>
        <ul>
          <li><a href="/articulo-1">Artículo relacionado 1</a></li>
          <li><a href="/articulo-2">Artículo relacionado 2</a></li>
        </ul>
      </nav>
      
      <footer>
        <p>Etiquetas: <a href="/tag/accesibilidad">Accesibilidad</a></p>
      </footer>
    </article>

    <!-- LANDMARK: form (con nombre) -->
    <form aria-labelledby="suscripcion-titulo">
      <h2 id="suscripcion-titulo">Suscríbete a nuestro boletín</h2>
      
      <label for="email-suscripcion">Correo electrónico:</label>
      <input type="email" id="email-suscripcion" name="email" required>
      
      <button type="submit">Suscribirse</button>
    </form>
  </main>

  <!-- LANDMARK: complementary -->
  <aside aria-label="Barra lateral">
    <section aria-labelledby="noticias-titulo">
      <h3 id="noticias-titulo">Últimas Noticias</h3>
      <ul>
        <li><a href="/noticia-1">Noticia importante 1</a></li>
        <li><a href="/noticia-2">Noticia importante 2</a></li>
      </ul>
    </section>

    <section aria-labelledby="recursos-titulo">
      <h3 id="recursos-titulo">Recursos</h3>
      <ul>
        <li><a href="/guia">Guía de accesibilidad</a></li>
        <li><a href="/tutoriales">Tutoriales</a></li>
      </ul>
    </section>
  </aside>

  <!-- LANDMARK: contentinfo -->
  <footer>
    <nav aria-label="Navegación de pie de página">
      <ul>
        <li><a href="/privacidad">Política de Privacidad</a></li>
        <li><a href="/accesibilidad">Declaración de Accesibilidad</a></li>
        <li><a href="/mapa">Mapa del Sitio</a></li>
      </ul>
    </nav>
    <p>&copy; 2024 Empresa. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
```

### 3.4 Navegación por Landmarks en Screen Readers

| Screen Reader | Comando de Landmarks |
|---------------|---------------------|
| NVDA | `D` (siguiente), `Shift+D` (anterior) |
| JAWS | `R` (siguiente), `Shift+R` (anterior) |
| VoiceOver | `VO+U` → Flechas para navegar landmarks |
| Narrator | `D` (siguiente), `Shift+D` (anterior) |
| TalkBack | Deslizar arriba/abajo → Landmarks |

---

## 4. Mejores Prácticas para Screen Readers

### 4.1 Textos Alternativos y Descripciones

```html
<!-- ✅ Imágenes informativas -->
<img src="grafico-ventas.jpg" 
     alt="Gráfico de barras mostrando aumento de ventas del 25% en 2024">

<!-- ✅ Imágenes decorativas (vacío) -->
<img src="decoracion.png" alt="">

<!-- ✅ Imágenes complejas con descripción larga -->
<figure role="group" aria-labelledby="fig1-caption">
  <img src="diagrama-flujo.png" 
       alt="Diagrama de flujo del proceso de registro">
  <figcaption id="fig1-caption">
    <details>
      <summary>Descripción detallada del diagrama</summary>
      <p>El diagrama comienza con el paso 1: Registro de usuario, 
         seguido por validación de email...</p>
    </details>
  </figcaption>
</figure>

<!-- ✅ Iconos con propósito funcional -->
<button type="button">
  <img src="icono-imprimir.png" alt="">
  Imprimir documento
</button>

<!-- O mejor aún -->
<button type="button" aria-label="Imprimir documento">
  <img src="icono-imprimir.png" alt="" aria-hidden="true">
</button>
```

### 4.2 Estados y Propiedades Dinámicas

```html
<!-- ✅ Estados de controles expandibles -->
<button aria-expanded="false" 
        aria-controls="menu-desplegable"
        id="boton-menu">
  Menú de Opciones
</button>
<ul id="menu-desplegable" role="menu" hidden aria-labelledby="boton-menu">
  <li role="menuitem"><a href="/opcion-1">Opción 1</a></li>
  <li role="menuitem"><a href="/opcion-2">Opción 2</a></li>
</ul>

<!-- ✅ Estados de selección -->
<div role="checkbox" 
     aria-checked="false" 
     tabindex="0"
     aria-labelledby="opcion-terminos">
  <span id="opcion-terminos">Acepto los términos y condiciones</span>
</div>

<!-- ✅ Estados de carga -->
<button type="submit" aria-describedby="cargando" disabled>
  <span aria-hidden="true" class="spinner"></span>
  Procesando...
</button>
<span id="cargando" class="visually-hidden">
  Por favor espere, estamos procesando su solicitud
</span>

<!-- ✅ Estados de progreso -->
<progress value="70" max="100" aria-label="Progreso de carga">
  70%
</progress>
```

### 4.3 Regiones Vivas (Live Regions)

```html
<!-- ✅ Alertas importantes -->
<div role="alert" aria-live="assertive" aria-atomic="true">
  <!-- Anunciado inmediatamente -->
</div>

<!-- ✅ Actualizaciones de estado -->
<div role="status" aria-live="polite" aria-atomic="true">
  <!-- Anunciado cuando el usuario esté libre -->
</div>

<!-- ✅ Contadores dinámicos -->
<div aria-live="polite" aria-atomic="true" class="carrito-contador">
  <span class="visually-hidden">Artículos en el carrito:</span>
  <span id="contador">3</span>
</div>

<!-- ✅ Mensajes de validación -->
<div id="error-email" role="alert" aria-live="assertive">
  <!-- Se inyecta dinámicamente cuando hay error -->
</div>

<input type="email" 
       aria-invalid="true" 
       aria-describedby="error-email"
       aria-errormessage="error-email">
```

### 4.4 Tablas de Datos Accesibles

```html
<!-- ✅ Tabla simple con encabezados -->
<table>
  <caption>Precios de Productos</caption>
  <thead>
    <tr>
      <th scope="col">Producto</th>
      <th scope="col">Precio</th>
      <th scope="col">Disponibilidad</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Laptop Pro</th>
      <td>$1,299</td>
      <td>En stock</td>
    </tr>
  </tbody>
</table>

<!-- ✅ Tabla compleja con encabezados múltiples -->
<table>
  <caption>Ventas por Región y Trimestre</caption>
  <thead>
    <tr>
      <td></td>
      <th id="q1" scope="col">Q1</th>
      <th id="q2" scope="col">Q2</th>
      <th id="q3" scope="col">Q3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="norte" scope="row">Región Norte</th>
      <td headers="norte q1">$50,000</td>
      <td headers="norte q2">$55,000</td>
      <td headers="norte q3">$60,000</td>
    </tr>
  </tbody>
</table>
```

### 4.5 Formularios Accesibles

```html
<!-- ✅ Asociación explícita label-input -->
<label for="nombre">Nombre completo:</label>
<input type="text" id="nombre" name="nombre" required>

<!-- ✅ Label implícito -->
<label>
  Correo electrónico:
  <input type="email" name="email" required>
</label>

<!-- ✅ Grupos de campos relacionados -->
<fieldset>
  <legend>Información de Contacto</legend>
  
  <label for="telefono">Teléfono:</label>
  <input type="tel" id="telefono" name="telefono">
  
  <label for="direccion">Dirección:</label>
  <input type="text" id="direccion" name="direccion">
</fieldset>

<!-- ✅ Agrupación de opciones -->
<fieldset>
  <legend>Preferencias de notificación</legend>
  
  <input type="checkbox" id="notif-email" name="notificaciones" value="email">
  <label for="notif-email">Correo electrónico</label>
  
  <input type="checkbox" id="notif-sms" name="notificaciones" value="sms">
  <label for="notif-sms">SMS</label>
</fieldset>

<!-- ✅ Campos con descripción adicional -->
<label for="username">Nombre de usuario:</label>
<span id="username-help">Debe tener entre 4 y 20 caracteres</span>
<input type="text" 
       id="username" 
       name="username"
       aria-describedby="username-help"
       minlength="4"
       maxlength="20">

<!-- ✅ Validación accesible -->
<label for="password">Contraseña:</label>
<input type="password" 
       id="password" 
       name="password"
       aria-required="true"
       aria-invalid="false"
       aria-describedby="password-help"
       onblur="validarPassword()">
<div id="password-help" class="help-text">
  La contraseña debe tener al menos 8 caracteres
</div>
<div id="password-error" class="error" role="alert" hidden>
  La contraseña no cumple los requisitos mínimos
</div>
```

---

## 5. Errores Comunes de Accesibilidad en Markup Semántico

### 5.1 Redundancia ARIA Innecesaria

```html
<!-- ❌ INCORRECTO: Roles duplicados -->
<nav role="navigation">
  <!-- nav ya tiene rol implícito navigation -->
</nav>

<main role="main">
  <!-- main ya tiene rol implícito main -->
</main>

<button role="button">
  <!-- button ya tiene rol implícito button -->
</button>

<!-- ✅ CORRECTO: Sin redundancia -->
<nav><!-- navegación --></nav>
<main><!-- contenido principal --></main>
<button>Acción</button>
```

### 5.2 Landmarks Mal Anidados

```html
<!-- ❌ INCORRECTO: main dentro de otro landmark -->
<article>
  <main><!-- NO: main debe ser top-level --></main>
</article>

<!-- ❌ INCORRECTO: banner dentro de main -->
<main>
  <header><!-- Esto NO es banner en este contexto, pero es confuso --></header>
</main>

<!-- ✅ CORRECTO: Jerarquía apropiada -->
<header><!-- banner --></header>
<main><!-- main --></main>
<aside><!-- complementary --></aside>
<footer><!-- contentinfo --></footer>
```

### 5.3 Problemas con Headings

```html
<!-- ❌ INCORRECTO: Saltos de nivel -->
<h1>Título Principal</h1>
<h3>Subsección</h3> <!-- Salto de h1 a h3 -->

<!-- ❌ INCORRECTO: Múltiples h1 -->
<h1>Título del Sitio</h1>
<h1>Título de la Página</h1>

<!-- ❌ INCORRECTO: Headings vacíos o sin contenido -->
<h2></h2>

<!-- ✅ CORRECTO: Jerarquía lógica -->
<h1>Título Principal de la Página</h1>
  <h2>Sección 1</h2>
    <h3>Subsección 1.1</h3>
    <h3>Subsección 1.2</h3>
  <h2>Sección 2</h2>
    <h3>Subsección 2.1</h3>
```

### 5.4 Problemas con Enlaces y Botones

```html
<!-- ❌ INCORRECTO: Div como enlace -->
<div onclick="navegar()">Ir a página</div>

<!-- ❌ INCORRECTO: Enlace sin href -->
<a>Texto no clickable</a>

<!-- ❌ INCORRECTO: Enlace con href vacío para JavaScript -->
<a href="#" onclick="accion()">Acción</a>

<!-- ❌ INCORRECTO: Texto de enlace no descriptivo -->
<a href="/documento.pdf">Click aquí</a>
<a href="/pagina.html">Leer más</a>

<!-- ✅ CORRECTO: Enlaces semánticos -->
<a href="/pagina">Ir a página</a>
<button type="button" onclick="accion()">Realizar acción</button>
<a href="/documento.pdf">Descargar guía de accesibilidad (PDF, 2MB)</a>
<a href="/articulo">Leer más sobre HTML5 semántico</a>
```

### 5.5 Problemas con Listas

```html
<!-- ❌ INCORRECTO: Listas falsas con divs -->
<div class="list">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
</div>

<!-- ❌ INCORRECTO: Elementos li fuera de lista -->
<li>Item suelto</li>

<!-- ❌ INCORRECTO: Listas para layout -->
<ul>
  <li><div>Columna 1</div></li>
  <li><div>Columna 2</div></li>
</ul>

<!-- ✅ CORRECTO: Listas semánticas -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>

<ol>
  <li>Paso 1</li>
  <li>Paso 2</li>
</ol>
```

### 5.6 Problemas con Tablas

```html
<!-- ❌ INCORRECTO: Tabla para layout -->
<table>
  <tr>
    <td><nav><!-- menú --></nav></td>
    <td><main><!-- contenido --></main></td>
  </tr>
</table>

<!-- ❌ INCORRECTO: Tabla de datos sin encabezados -->
<table>
  <tr>
    <td>Nombre</td>
    <td>Edad</td>
  </tr>
  <tr>
    <td>Juan</td>
    <td>30</td>
  </tr>
</table>

<!-- ❌ INCORRECTO: Encabezados sin scope -->
<table>
  <tr>
    <th>Producto</th>
    <th>Precio</th>
  </tr>
</table>

<!-- ✅ CORRECTO: Tabla de datos accesible -->
<table>
  <caption>Lista de Productos</caption>
  <thead>
    <tr>
      <th scope="col">Producto</th>
      <th scope="col">Precio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Laptop</th>
      <td>$999</td>
    </tr>
  </tbody>
</table>
```

### 5.7 Problemas con Imágenes

```html
<!-- ❌ INCORRECTO: Alt descriptivo en imágenes decorativas -->
<img src="esquina.png" alt="Esquina decorativa azul">

<!-- ❌ INCORRECTO: Falta alt en imagen informativa -->
<img src="grafico.png">

<!-- ❌ INCORRECTO: Alt redundante -->
<img src="logo.png" alt="Imagen del logo">

<!-- ❌ INCORRECTO: Texto en imagen sin alternativa -->
<img src="banner-texto.png" alt="Banner">

<!-- ✅ CORRECTO: Imágenes accesibles -->
<img src="esquina.png" alt=""> <!-- Decorativa -->
<img src="grafico.png" alt="Ventas aumentaron 25% en Q4 2024"> <!-- Informativa -->
<img src="logo.png" alt="Nombre de la Empresa"> <!-- Logo -->
```

### 5.8 Problemas con Formularios

```html
<!-- ❌ INCORRECTO: Inputs sin labels -->
<input type="text" placeholder="Nombre">

<!-- ❌ INCORRECTO: Placeholder como única etiqueta -->
<label>
  <input type="email" placeholder="Correo electrónico">
</label>

<!-- ❌ INCORRECTO: Labels no asociados -->
<label>Nombre:</label>
<input type="text">

<!-- ❌ INCORRECTO: Fieldset sin legend -->
<fieldset>
  <p>Opciones de envío</p>
  <!-- opciones -->
</fieldset>

<!-- ✅ CORRECTO: Formularios accesibles -->
<label for="nombre">Nombre completo:</label>
<input type="text" id="nombre" name="nombre">

<fieldset>
  <legend>Método de envío</legend>
  <input type="radio" id="envio-estandar" name="envio" value="estandar">
  <label for="envio-estandar">Estándar (5-7 días)</label>
  
  <input type="radio" id="envio-express" name="envio" value="express">
  <label for="envio-express">Express (1-2 días)</label>
</fieldset>
```

### 5.9 Problemas con Modales/Diálogos

```html
<!-- ❌ INCORRECTO: Modal sin atributos ARIA -->
<div class="modal" style="display:block">
  <div class="modal-content">
    <h2>Título del Modal</h2>
    <p>Contenido...</p>
    <button>Cerrar</button>
  </div>
</div>

<!-- ✅ CORRECTO: Modal accesible -->
<div role="dialog" 
     aria-modal="true" 
     aria-labelledby="modal-titulo"
     aria-describedby="modal-descripcion"
     class="modal">
  <div class="modal-content" role="document">
    <h2 id="modal-titulo">Confirmar acción</h2>
    <p id="modal-descripcion">
      ¿Está seguro de que desea eliminar este elemento?
    </p>
    <button type="button" onclick="confirmar()">Sí, eliminar</button>
    <button type="button" onclick="cerrarModal()">Cancelar</button>
  </div>
</div>
```

---

## 6. Validación de Accesibilidad en HTML5

### 6.1 Herramientas de Validación Automática

#### W3C HTML Validator
```bash
# URL: https://validator.w3.org/
# Verifica sintaxis HTML y uso de ARIA
```

#### W3C CSS Validator
```bash
# URL: https://jigsaw.w3.org/css-validator/
# Verifica sintaxis CSS y media queries
```

#### WAVE (Web Accessibility Evaluation Tool)
```bash
# Extensión de navegador o URL: https://wave.webaim.org/
# Detecta: contrastes, alt text, estructura de headings, landmarks, etc.
```

#### axe DevTools
```javascript
// Extensión de navegador o librería de testing
// Ejemplo de uso programático:
const { axe } = require('@axe-core/webdriverjs');

describe('Accesibilidad', () => {
  it('debe cumplir con WCAG 2.1 AA', async () => {
    const results = await axe(driver).analyze();
    expect(results.violations).toHaveLength(0);
  });
});
```

#### Lighthouse (Chrome DevTools)
```bash
# En Chrome DevTools → Lighthouse → Accesibilidad
# Genera reporte con puntuación y recomendaciones
```

### 6.2 Checklist de Validación Manual

#### Estructura Semántica
- [ ] La página tiene exactamente un `<main>`
- [ ] Los landmarks (`header`, `nav`, `main`, `aside`, `footer`) están correctamente implementados
- [ ] La jerarquía de headings (`h1`→`h6`) es lógica sin saltos
- [ ] Todo el contenido está dentro de landmarks
- [ ] Hay un solo `h1` por página que describe el contenido

#### Navegación por Teclado
- [ ] Todos los elementos interactivos son alcanzables con `Tab`
- [ ] El orden de tabulación es lógico
- [ ] Existe un "Skip Link" visible al enfocar
- [ ] Los modales capturan el foco y lo devuelven al cerrar
- [ ] No hay trampas de foco (focus traps no intencionales)

#### Textos Alternativos
- [ ] Todas las imágenes informativas tienen `alt` descriptivo
- [ ] Las imágenes decorativas tienen `alt=""`
- [ ] Los iconos funcionales tienen texto alternativo
- [ ] Los gráficos complejos tienen descripción larga

#### Formularios
- [ ] Todos los inputs tienen `<label>` asociado
- [ ] Los grupos relacionados usan `<fieldset>` + `<legend>`
- [ ] Los mensajes de error están asociados con `aria-describedby`
- [ ] Los campos requeridos están indicados visual y programáticamente
- [ ] Las sugerencias de formato son accesibles

#### Contenido Dinámico
- [ ] Las actualizaciones importantes usan `role="alert"` o `role="status"`
- [ ] Los cambios de vista son anunciados
- [ ] Las notificaciones no interrumpen innecesariamente

#### Contraste y Diseño
- [ ] El contraste de texto es al menos 4.5:1
- [ ] El contraste de texto grande es al menos 3:1
- [ ] Los elementos interactivos tienen indicadores de foco visibles

### 6.3 Validación con Screen Readers

#### NVDA (Windows)
```bash
# Descarga: https://www.nvaccess.org/download/
# Comandos útiles:
# - Insert + F7: Modo de navegación por elementos
# - D: Siguiente landmark
# - H: Siguiente heading
# - F: Siguiente campo de formulario
# - T: Siguiente tabla
```

#### JAWS (Windows)
```bash
# Comandos útiles:
# - Insert + F3: Lista de elementos
# - R: Siguiente landmark
# - Insert + F6: Lista de headings
# - Insert + F5: Lista de formularios
```

#### VoiceOver (macOS)
```bash
# Activar: Cmd + F5
# Comandos útiles:
# - VO + U: Rotor (navegación por elementos)
# - VO + Cmd + L: Siguiente lista
# - VO + Cmd + H: Siguiente heading
```

### 6.4 Script de Validación Automatizada

```javascript
/**
 * Script de validación de accesibilidad para consola del navegador
 * Ejecutar en: DevTools → Console
 */

(function validarAccesibilidad() {
  const issues = [];

  // 1. Verificar landmark main
  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    issues.push('❌ No hay elemento <main>');
  } else if (mains.length > 1) {
    issues.push('❌ Hay múltiples elementos <main>');
  } else {
    console.log('✅ Un elemento <main> presente');
  }

  // 2. Verificar heading h1
  const h1s = document.querySelectorAll('h1');
  if (h1s.length === 0) {
    issues.push('❌ No hay elemento <h1>');
  } else if (h1s.length > 1) {
    issues.push('⚠️ Hay múltiples elementos <h1>');
  } else {
    console.log('✅ Un elemento <h1> presente:', h1s[0].textContent.trim());
  }

  // 3. Verificar jerarquía de headings
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let prevLevel = 0;
  headings.forEach(h => {
    const level = parseInt(h.tagName[1]);
    if (level > prevLevel + 1) {
      issues.push(`❌ Salto de heading: h${prevLevel} → h${level}`);
    }
    prevLevel = level;
  });

  // 4. Verificar imágenes sin alt
  const imgsSinAlt = document.querySelectorAll('img:not([alt])');
  if (imgsSinAlt.length > 0) {
    issues.push(`❌ ${imgsSinAlt.length} imágenes sin atributo alt`);
    imgsSinAlt.forEach(img => console.log('  -', img.src));
  }

  // 5. Verificar labels en formularios
  const inputs = document.querySelectorAll('input, select, textarea');
  let inputsSinLabel = 0;
  inputs.forEach(input => {
    const id = input.id;
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledBy = input.getAttribute('aria-labelledby');
    const tieneLabel = id && document.querySelector(`label[for="${id}"]`);
    const estaLabelled = input.closest('label');
    
    if (!tieneLabel && !estaLabelled && !ariaLabel && !ariaLabelledBy) {
      inputsSinLabel++;
    }
  });
  if (inputsSinLabel > 0) {
    issues.push(`❌ ${inputsSinLabel} campos de formulario sin label`);
  }

  // 6. Verificar enlaces vacíos o genéricos
  const enlaces = document.querySelectorAll('a');
  let enlacesProblematicos = 0;
  const textosGenericos = ['click aquí', 'leer más', 'aquí', 'más', 'link'];
  enlaces.forEach(a => {
    const texto = a.textContent.trim().toLowerCase();
    if (!texto || textosGenericos.some(t => texto.includes(t))) {
      enlacesProblematicos++;
    }
  });
  if (enlacesProblematicos > 0) {
    issues.push(`⚠️ ${enlacesProblematicos} enlaces con texto genérico o vacío`);
  }

  // 7. Verificar lang del documento
  if (!document.documentElement.lang) {
    issues.push('❌ El elemento <html> no tiene atributo lang');
  }

  // 8. Verificar title del documento
  if (!document.title || document.title.trim() === '') {
    issues.push('❌ El documento no tiene título');
  }

  // 9. Verificar elementos interactivos sin nombre accesible
  const elementosInteractivos = document.querySelectorAll('button, [role="button"], [role="link"]');
  let sinNombreAccesible = 0;
  elementosInteractivos.forEach(el => {
    const nombre = el.textContent.trim() || 
                   el.getAttribute('aria-label') || 
                   el.getAttribute('aria-labelledby');
    if (!nombre) sinNombreAccesible++;
  });
  if (sinNombreAccesible > 0) {
    issues.push(`❌ ${sinNombreAccesible} elementos interactivos sin nombre accesible`);
  }

  // Reporte final
  console.log('\n=== REPORTE DE ACCESIBILIDAD ===\n');
  if (issues.length === 0) {
    console.log('🎉 No se encontraron problemas de accesibilidad obvios');
  } else {
    console.log(`Se encontraron ${issues.length} problemas:\n`);
    issues.forEach(issue => console.log(issue));
  }
  
  return {
    totalIssues: issues.length,
    issues: issues,
    summary: {
      landmarks: {
        main: mains.length,
        nav: document.querySelectorAll('nav').length,
        complementary: document.querySelectorAll('aside').length
      },
      headings: {
        total: headings.length,
        h1: h1s.length
      },
      images: {
        total: document.querySelectorAll('img').length,
        sinAlt: imgsSinAlt.length
      },
      formElements: {
        total: inputs.length,
        sinLabel: inputsSinLabel
      }
    }
  };
})();
```

### 6.5 Métricas de Cumplimiento WCAG 2.2

| Criterio | Nivel | Descripción | Técnica |
|----------|-------|-------------|---------|
| 1.1.1 Non-text Content | A | Alternativas textuales para contenido no textual | Alt text, aria-label |
| 1.3.1 Info and Relationships | A | Información y relaciones programáticamente determinables | Marcado semántico |
| 2.1.1 Keyboard | A | Funcionalidad disponible desde teclado | tabindex, manejo de eventos |
| 2.4.1 Bypass Blocks | A | Mecanismo para saltar bloques repetidos | Skip links |
| 2.4.3 Focus Order | A | Orden de foco secuencial significativo | DOM ordenado |
| 2.4.4 Link Purpose | A | Propósito de enlaces determinable | Texto descriptivo |
| 2.4.6 Headings and Labels | AA | Headings y labels describen propósito | Contenido descriptivo |
| 2.4.10 Section Headings | AAA | Secciones con headings | Estructura jerárquica |
| 3.3.2 Labels or Instructions | A | Labels o instrucciones para entrada de datos | Labels asociados |
| 4.1.2 Name, Role, Value | A | Nombre, rol y valor disponibles | Atributos ARIA |

---

## Apéndice: Recursos Oficiales

### Especificaciones W3C
- **WAI-ARIA 1.2**: https://www.w3.org/TR/wai-aria-1.2/
- **ARIA in HTML**: https://www.w3.org/TR/html-aria/
- **Using ARIA**: https://www.w3.org/TR/using-aria/
- **WCAG 2.2**: https://www.w3.org/WAI/WCAG22/

### Documentación MDN
- **ARIA**: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA
- **HTML Semántico**: https://developer.mozilla.org/en-US/docs/Glossary/Semantics
- **Roles ARIA**: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles

### Guías de Prácticas
- **ARIA Authoring Practices Guide**: https://www.w3.org/WAI/ARIA/apg/
- **WAI Tutorials**: https://www.w3.org/WAI/tutorials/

### Herramientas
- **HTML5 Accessibility**: https://html5accessibility.com/
- **WAVE**: https://wave.webaim.org/
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **Lighthouse**: Chrome DevTools integrado

---

**Versión:** 1.0  
**Última actualización:** 2024  
**Autor:** Documento técnico generado con información de MDN, W3C WAI-ARIA Spec y WCAG Guidelines
