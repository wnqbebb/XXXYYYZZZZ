# Estructura de Documento HTML5 Semántico

## Referencias Oficiales

- [HTML Living Standard - Sections](https://html.spec.whatwg.org/multipage/sections.html)
- [MDN - HTML5 Semantic Elements](https://developer.mozilla.org/en-US/docs/Glossary/Semantics#semantic_elements)
- [ARIA in HTML](https://www.w3.org/TR/html-aria/)

---

## Estructura Básica de Documento

### Template HTML5 Accesible Completo

```html
<!DOCTYPE html>
<html lang="es" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título Descriptivo de la Página | Nombre del Sitio</title>
  <meta name="description" content="Descripción concisa del contenido de la página.">
  
  <!-- Prevenir zoom blockage en móviles (WCAG 1.4.4, 1.4.10) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  
  <!-- Tema de color para navegadores -->
  <meta name="theme-color" content="#005fcc">
  
  <!-- Favicon accesible -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
</head>
<body>
  <!-- Skip Link para navegación rápida (WCAG 2.4.1) -->
  <a href="#main-content" class="skip-link">
    Saltar al contenido principal
  </a>
  
  <!-- Landmark: Banner -->
  <header>
    <a href="/" aria-label="Inicio - Nombre del Sitio">
      <img src="/logo.svg" alt="Nombre del Sitio">
    </a>
    
    <!-- Landmark: Search -->
    <search>
      <form role="search" action="/buscar">
        <label for="search-input" class="visually-hidden">
          Buscar en el sitio
        </label>
        <input 
          type="search" 
          id="search-input"
          name="q"
          placeholder="Buscar..."
          autocomplete="search"
        >
        <button type="submit">Buscar</button>
      </form>
    </search>
  </header>
  
  <!-- Landmark: Navigation -->
  <nav aria-label="Navegación principal">
    <ul>
      <li><a href="/" aria-current="page">Inicio</a></li>
      <li><a href="/servicios">Servicios</a></li>
      <li><a href="/nosotros">Nosotros</a></li>
      <li><a href="/contacto">Contacto</a></li>
    </ul>
  </nav>
  
  <!-- Breadcrumb (WCAG 2.4.8) -->
  <nav aria-label="Breadcrumb">
    <ol>
      <li><a href="/">Inicio</a></li>
      <li><a href="/categoria">Categoría</a></li>
      <li><a href="/categoria/subcategoria" aria-current="page">Página Actual</a></li>
    </ol>
  </nav>
  
  <!-- Landmark: Main -->
  <main id="main-content">
    <h1>Título Principal de la Página</h1>
    
    <!-- Contenido principal -->
  </main>
  
  <!-- Landmark: Complementary -->
  <aside aria-label="Barra lateral">
    <section aria-labelledby="noticias-titulo">
      <h2 id="noticias-titulo">Noticias Relacionadas</h2>
      <!-- Contenido -->
    </section>
  </aside>
  
  <!-- Landmark: Contentinfo -->
  <footer>
    <nav aria-label="Navegación de pie de página">
      <ul>
        <li><a href="/privacidad">Política de Privacidad</a></li>
        <li><a href="/accesibilidad">Declaración de Accesibilidad</a></li>
      </ul>
    </nav>
    <p>&copy; 2024 Nombre del Sitio. Todos los derechos reservados.</p>
  </footer>
</body>
</html>
```

---

## Landmarks HTML5 y Roles ARIA Implícitos

### Mapeo de Elementos a Roles

| Elemento HTML5 | Rol ARIA Implícito | Uso Correcto |
|----------------|-------------------|--------------|
| `<header>` (body) | `banner` | Encabezado del sitio |
| `<footer>` (body) | `contentinfo` | Pie del sitio |
| `<main>` | `main` | Contenido principal único |
| `<nav>` | `navigation` | Enlaces de navegación |
| `<aside>` | `complementary` | Contenido tangencial |
| `<section>` + nombre | `region` | Sección con título |
| `<article>` | `article` | Contenido autocontenido |
| `<search>` | `search` | Funcionalidad de búsqueda |
| `<form>` + nombre | `form` | Colección de controles |

### Jerarquía de Landmarks

```html
<body>
  <!-- Nivel superior -->
  <header><!-- banner --></header>
  <nav><!-- navigation principal --></nav>
  <search><!-- search --></search>
  
  <main>
    <!-- main - único por página -->
    
    <!-- Landmarks pueden anidarse -->
    <nav aria-label="Navegación secundaria">
      <!-- navigation anidado -->
    </nav>
    
    <section aria-labelledby="seccion-1">
      <!-- region con nombre accesible -->
      <h2 id="seccion-1">Título de Sección</h2>
    </section>
    
    <article>
      <!-- article autocontenido -->
      <header><!-- header del artículo (NO banner) --></header>
    </article>
  </main>
  
  <aside><!-- complementary --></aside>
  <footer><!-- contentinfo --></footer>
</body>
```

---

## Encabezados (Headings)

### Jerarquía de Encabezados

```html
<!-- ✅ CORRECTO: Jerarquía lógica -->
<h1>Título Principal de la Página</h1>
  <h2>Sección 1</h2>
    <h3>Subsección 1.1</h3>
    <h3>Subsección 1.2</h3>
  <h2>Sección 2</h2>
    <h3>Subsección 2.1</h3>
      <h4>Sub-subsección 2.1.1</h4>

<!-- ❌ INCORRECTO: Saltos de nivel -->
<h1>Título</h1>
<h3>Sección (salto de h1 a h3)</h3>

<!-- ❌ INCORRECTO: Múltiples h1 -->
<h1>Título del Sitio</h1>
<h1>Título de la Página</h1>
```

### Patrón de Encabezados para Componentes

```html
<!-- Artículo con encabezados semánticos -->
<article aria-labelledby="article-title">
  <header>
    <h2 id="article-title">Título del Artículo</h2>
    <p>Publicado el <time datetime="2024-01-15">15 de enero de 2024</time></p>
  </header>
  
  <h3>Introducción</h3>
  <p>Contenido...</p>
  
  <h3>Desarrollo</h3>
  <p>Contenido...</p>
  
  <h4>Punto importante</h4>
  <p>Contenido...</p>
  
  <footer>
    <h3>Etiquetas</h3>
    <ul>
      <li><a href="/tag/html">HTML</a></li>
      <li><a href="/tag/accesibilidad">Accesibilidad</a></li>
    </ul>
  </footer>
</article>
```

---

## Skip Links (Saltar Navegación)

### Implementación CSS

```css
/* Skip Link - WCAG 2.4.1 Bypass Blocks */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 10000;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

/* Múltiples skip links */
.skip-links {
  position: absolute;
  top: -100%;
  left: 0;
  z-index: 10000;
}

.skip-links:focus-within {
  top: 0;
}
```

### Múltiples Skip Links

```html
<div class="skip-links">
  <a href="#main-content">Saltar al contenido principal</a>
  <a href="#main-nav">Saltar a navegación</a>
  <a href="#search">Saltar a búsqueda</a>
</div>
```

---

## Secciones y Artículos

### Diferencia entre Section y Article

```html
<!-- Article: Contenido autocontenido, reusable, independiente -->
<article>
  <h2>Título de Noticia</h2>
  <p>Contenido de la noticia...</p>
  <footer>
    <p>Autor: Juan Pérez</p>
  </footer>
</article>

<!-- Section: Grupo temático de contenido relacionado -->
<section aria-labelledby="servicios-titulo">
  <h2 id="servicios-titulo">Nuestros Servicios</h2>
  <p>Descripción de servicios...</p>
  
  <!-- Artículos dentro de sección -->
  <article>
    <h3>Servicio 1</h3>
    <p>Descripción...</p>
  </article>
  
  <article>
    <h3>Servicio 2</h3>
    <p>Descripción...</p>
  </article>
</section>
```

---

## Breadcrumbs (Migas de Pan)

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li>
      <a href="/">Inicio</a>
      <span aria-hidden="true">/</span>
    </li>
    <li>
      <a href="/productos">Productos</a>
      <span aria-hidden="true">/</span>
    </li>
    <li>
      <a href="/productos/electronica">Electrónica</a>
      <span aria-hidden="true">/</span>
    </li>
    <li>
      <a href="/productos/electronica/laptops" aria-current="page">
        Laptops
      </a>
    </li>
  </ol>
</nav>
```

```css
/* Estilos de Breadcrumb */
nav[aria-label="Breadcrumb"] ol {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.5rem;
}

nav[aria-label="Breadcrumb"] li:not(:last-child)::after {
  content: "/";
  margin-left: 0.5rem;
  color: #666;
}

nav[aria-label="Breadcrumb"] [aria-current="page"] {
  color: inherit;
  text-decoration: none;
  font-weight: bold;
}
```

---

## Figure y Figcaption

```html
<!-- Imagen con descripción corta -->
<figure>
  <img src="grafico-ventas.jpg" 
       alt="Gráfico de barras mostrando aumento de ventas del 25% en 2024">
  <figcaption>
    Figura 1: Crecimiento trimestral de ventas
  </figcaption>
</figure>

<!-- Imagen compleja con descripción larga -->
<figure role="group" aria-labelledby="fig-caption">
  <img src="diagrama-flujo.png" 
       alt="Diagrama de flujo del proceso de registro">
  <figcaption id="fig-caption">
    <details>
      <summary>Descripción detallada del diagrama</summary>
      <ol>
        <li>Usuario ingresa correo electrónico</li>
        <li>Sistema envía enlace de verificación</li>
        <li>Usuario confirma correo</li>
        <li>Completar perfil</li>
        <li>Acceso concedido</li>
      </ol>
    </details>
  </figcaption>
</figure>
```

---

## Details y Summary (Acordeón Nativo)

```html
<!-- Acordeón nativo accesible -->
<details>
  <summary>¿Qué es HTML5 semántico?</summary>
  <p>HTML5 semántico utiliza elementos que describen claramente 
     su significado tanto para el navegador como para el desarrollador.</p>
</details>

<details>
  <summary>¿Por qué es importante la accesibilidad?</summary>
  <p>La accesibilidad web es un derecho humano fundamental. 
     Asegura que todas las personas puedan acceder a la información.</p>
</details>

<!-- Múltiples details como grupo -->
<div class="faq-group">
  <details name="faq">
    <summary>Pregunta 1</summary>
    <p>Respuesta 1...</p>
  </details>
  <details name="faq">
    <summary>Pregunta 2</summary>
    <p>Respuesta 2...</p>
  </details>
</div>
```

---

## Dialog (Modal Nativo)

```html
<!-- Botón para abrir -->
<button type="button" onclick="document.getElementById('modal').showModal()">
  Abrir Modal
</button>

<!-- Modal nativo HTML5 -->
<dialog id="modal" aria-labelledby="modal-title" aria-describedby="modal-desc">
  <h2 id="modal-title">Título del Modal</h2>
  <p id="modal-desc">Descripción del contenido del modal.</p>
  
  <form method="dialog">
    <button type="submit" value="confirm">Confirmar</button>
    <button type="submit" value="cancel">Cancelar</button>
  </form>
</dialog>
```

```javascript
const dialog = document.getElementById('modal');

// Manejar cierre
dialog.addEventListener('close', () => {
  console.log('Modal cerrado con:', dialog.returnValue);
});

// Cerrar con Escape
dialog.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    dialog.close();
  }
});
```

---

## Lista de Verificación de Estructura

```yaml
CHECKLIST_ESTRUCTURA:
  Documento:
    - [ ] lang attribute en <html>
    - [ ] title descriptivo y único
    - [ ] viewport permite zoom (sin user-scalable=no)
    - [ ] Skip link presente
  
  Landmarks:
    - [ ] main único y presente
    - [ ] Todos los elementos visibles en landmarks
    - [ ] Landmarks múltiples etiquetados (aria-label)
    - [ ] Navegación anidada etiquetada
  
  Encabezados:
    - [ ] Un h1 por página
    - [ ] Jerarquía lógica sin saltos
    - [ ] Encabezados describen contenido
  
  Navegación:
    - [ ] aria-current para página actual
    - [ ] Breadcrumb si hay navegación profunda
    - [ ] Enlaces descriptivos (no "click aquí")
```
