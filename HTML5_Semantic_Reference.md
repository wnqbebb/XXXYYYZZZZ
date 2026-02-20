# Guía Completa de HTML5 Semántico
## Documento de Referencia para Reglas de Habilidad

**Fuentes consultadas:**
- MDN Web Docs (developer.mozilla.org)
- W3C HTML5 Specification
- WHATWG HTML Living Standard
- WAI-ARIA Guidelines

**Fecha de investigación:** 18 de febrero de 2026

---

## 1. INTRODUCCIÓN AL HTML5 SEMÁNTICO

### 1.1 ¿Qué es HTML5 Semántico?

El HTML semántico utiliza elementos que describen su propósito tanto al navegador como al desarrollador. A diferencia de elementos no semánticos como `<div>` y `<span>` que no indican nada sobre su contenido, los elementos semánticos como `<article>`, `<nav>`, o `<header>` definen claramente qué tipo de contenido contienen.

### 1.2 Beneficios del HTML Semántico

| Beneficio | Descripción |
|-----------|-------------|
| **SEO Mejorado** | Los motores de búsqueda entienden mejor la estructura y jerarquía del contenido |
| **Accesibilidad** | Los lectores de pantalla navegan eficientemente por landmarks y estructura |
| **Mantenibilidad** | El código es más legible y fácil de mantener |
| **Interoperabilidad** | Mejor compatibilidad con diferentes tecnologías y dispositivos |
| **Compatibilidad futura** | Código estándar que funciona con tecnologías emergentes |

### 1.3 Tipos de Contenido en HTML5

Según W3C y WHATWG, los elementos se clasifican en:

- **Metadata content**: `<base>`, `<link>`, `<meta>`, `<noscript>`, `<script>`, `<style>`, `<template>`, `<title>`
- **Flow content**: La mayoría de elementos usados en el body
- **Sectioning content**: `<article>`, `<aside>`, `<nav>`, `<section>`
- **Heading content**: `<h1>` - `<h6>`
- **Phrasing content**: Texto y elementos a nivel de párrafo
- **Embedded content**: `<audio>`, `<canvas>`, `<embed>`, `<iframe>`, `<img>`, `<math>`, `<object>`, `<svg>`, `<video>`
- **Interactive content**: Elementos diseñados para interacción del usuario

---

## 2. ELEMENTOS SEMÁNTICOS HTML5 - REFERENCIA COMPLETA

### 2.1 Elementos de Estructura Principal (Landmarks)

#### `<header>` - Encabezado

**Propósito:** Representa contenido introductorio, típicamente un grupo de ayudas introductorias o de navegación.

**Cuándo usar:**
- Encabezado global del sitio (logo, nombre, navegación principal)
- Encabezado de secciones (`<article>`, `<section>`)
- Puede contener: títulos, logos, formularios de búsqueda, información de autor

**Cuándo NO usar:**
- No anidar dentro de `<footer>`, `<address>` o otro `<header>`
- No usar únicamente para estilos (usar CSS)

**Ejemplo correcto:**
```html
<!-- Encabezado de página -->
<header>
  <h1>Mi Sitio Web</h1>
  <nav>
    <ul>
      <li><a href="/">Inicio</a></li>
      <li><a href="/about">Acerca</a></li>
    </ul>
  </nav>
</header>

<!-- Encabezado de artículo -->
<article>
  <header>
    <h2>Título del Artículo</h2>
    <time datetime="2026-02-18">18 de febrero, 2026</time>
  </header>
  <p>Contenido del artículo...</p>
</article>
```

**Rol ARIA implícito:** 
- `banner` (si es descendiente directo de `<body>`)
- `generic` (si está anidado en sectioning content)

---

#### `<nav>` - Navegación

**Propósito:** Representa una sección de la página cuyo propósito es proporcionar enlaces de navegación.

**Cuándo usar:**
- Navegación principal del sitio
- Tabla de contenidos
- Breadcrumbs (migas de pan)
- Enlaces de paginación

**Cuándo NO usar:**
- NO todos los enlaces deben estar en `<nav>`
- NO usar para enlaces secundarios del footer (términos de servicio, copyright)
- NO usar para enlaces sociales (salvo que sean la navegación principal)

**Ejemplo correcto:**
```html
<!-- Navegación principal -->
<nav aria-label="Navegación principal">
  <ul>
    <li><a href="/">Inicio</a></li>
    <li><a href="/productos">Productos</a></li>
    <li><a href="/servicios">Servicios</a></li>
  </ul>
</nav>

<!-- Breadcrumbs -->
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Inicio</a></li>
    <li><a href="/productos">Productos</a></li>
    <li aria-current="page">Producto Actual</li>
  </ol>
</nav>
```

**Rol ARIA implícito:** `navigation`

**Mejores prácticas:**
- Usar `aria-label` cuando hay múltiples elementos `<nav>`
- Considerar si los enlaces son "navegación principal" para skip links

---

#### `<main>` - Contenido Principal

**Propósito:** Representa el contenido dominante del `<body>` del documento.

**Cuándo usar:**
- Contenido único y específico de la página
- Excluye contenido repetido: headers, footers, navegación, sidebars

**Cuándo NO usar:**
- NO más de un `<main>` por página (a menos que los demás tengan `hidden`)
- NO anotar dentro de `<article>`, `<aside>`, `<footer>`, `<header>`, `<nav>`

**Ejemplo correcto:**
```html
<body>
  <a href="#main-content">Saltar al contenido principal</a>
  
  <header>
    <h1>Mi Sitio</h1>
    <nav><!-- Navegación --></nav>
  </header>
  
  <main id="main-content">
    <h1>Título de la Página</h1>
    <article>
      <h2>Artículo Principal</h2>
      <p>Contenido...</p>
    </article>
  </main>
  
  <footer><!-- Footer --></footer>
</body>
```

**Rol ARIA implícito:** `main`

**Nota importante:** El elemento `<main>` no contribuye al outline del documento.

---

#### `<footer>` - Pie de página

**Propósito:** Representa un pie de página para su ancestro sectioning content o sectioning root más cercano.

**Cuándo usar:**
- Información de autoría
- Derechos de autor
- Enlaces relacionados
- Información de contacto
- Sitemap

**Cuándo NO usar:**
- NO usar como único contenedor de información de contacto (usar `<address>`)
- NO anidar dentro de `<address>`, `<header>` u otro `<footer>`

**Ejemplo correcto:**
```html
<!-- Footer de página -->
<footer>
  <p>&copy; 2026 Mi Empresa. Todos los derechos reservados.</p>
  <address>
    Contacto: <a href="mailto:info@ejemplo.com">info@ejemplo.com</a>
  </address>
</footer>

<!-- Footer de artículo -->
<article>
  <h2>Artículo</h2>
  <p>Contenido...</p>
  <footer>
    <p>Publicado el <time datetime="2026-02-18">18 feb 2026</time></p>
    <p>Autor: Juan Pérez</p>
  </footer>
</article>
```

**Rol ARIA implícito:** 
- `contentinfo` (si es descendiente directo de `<body>`)
- `generic` (si está anidado)

---

### 2.2 Elementos de Contenido de Sección

#### `<article>` - Artículo

**Propósito:** Representa una composición auto-contenida en un documento, que está destinada a ser distribuida o reutilizada de forma independiente.

**Cuándo usar:**
- Posts de foro
- Artículos de revista/periódico
- Entradas de blog
- Tarjetas de producto
- Comentarios de usuario
- Widgets interactivos

**Cuándo NO usar:**
- NO usar para agrupar contenido relacionado temáticamente (usar `<section>`)
- NO usar solo para estilos

**Ejemplo correcto:**
```html
<main>
  <article>
    <header>
      <h1>Guía de HTML5 Semántico</h1>
      <p>Por <a href="/autor/maria">María García</a></p>
    </header>
    
    <section>
      <h2>Introducción</h2>
      <p>El HTML semántico...</p>
    </section>
    
    <section>
      <h2>Beneficios</h2>
      <p>Los beneficios incluyen...</p>
    </section>
    
    <footer>
      <p>Publicado el <time datetime="2026-02-18">18 feb 2026</time></p>
      <section>
        <h3>Comentarios</h3>
        <article><!-- Comentario 1 --></article>
        <article><!-- Comentario 2 --></article>
      </section>
    </footer>
  </article>
</main>
```

**Rol ARIA implícito:** `article`

---

#### `<section>` - Sección

**Propósito:** Representa una sección genérica standalone de un documento, que no tiene un elemento semántico más específico para representarla.

**Cuándo usar:**
- Capítulos de un libro
- Secciones numeradas de una tesis
- Diferentes pestañas en una interfaz de pestañas
- Agrupación temática de contenido relacionado

**Cuándo NO usar:**
- NO usar como contenedor de estilo genérico (usar `<div>`)
- NO usar si `<article>`, `<aside>` o `<nav>` son más apropiados
- NO usar sin un encabezado (h1-h6) en la mayoría de casos

**Ejemplo correcto:**
```html
<main>
  <h1>Desarrollo Web</h1>
  
  <section>
    <h2>Frontend</h2>
    <p>HTML, CSS y JavaScript...</p>
  </section>
  
  <section>
    <h2>Backend</h2>
    <p>Node.js, Python, PHP...</p>
  </section>
  
  <section>
    <h2>Bases de Datos</h2>
    <p>SQL y NoSQL...</p>
  </section>
</main>
```

**Rol ARIA implícito:** 
- `region` (si el elemento tiene un nombre accesible)
- `generic` (si no tiene nombre accesible)

---

#### `<aside>` - Contenido Tangencial

**Propósito:** Representa una porción del documento cuyo contenido está solo indirectamente relacionado con el contenido principal.

**Cuándo usar:**
- Sidebars
- Call-out boxes
- Publicidad
- Biografía del autor
- Enlaces relacionados
- Glosarios

**Cuándo NO usar:**
- NO usar para texto entre paréntesis (es parte del flujo principal)
- NO usar si el contenido es directamente relacionado (usar `<section>`)

**Ejemplo correcto:**
```html
<article>
  <h1>Historia de la Web</h1>
  <p>La World Wide Web fue creada por Tim Berners-Lee...</p>
  
  <aside>
    <h2>Tim Berners-Lee</h2>
    <p>Científico de la computación británico, conocido como el inventor de la Web...</p>
  </aside>
  
  <p>El primer sitio web fue publicado en 1991...</p>
</article>
```

**Rol ARIA implícito:** `complementary`

---

### 2.3 Elementos de Figura y Media

#### `<figure>` - Figura

**Propósito:** Representa contenido auto-contenido, frecuentemente con una leyenda (`<figcaption>`).

**Cuándo usar:**
- Imágenes con leyendas
- Diagramas
- Fotos
- Listados de código
- Poemas
- Citas
- Tablas
- Contenido que puede moverse sin afectar el flujo principal

**Cuándo NO usar:**
- NO usar para cada imagen (solo si es referenciada/importante)
- NO usar para logos (generalmente)
- NO usar para imágenes puramente decorativas

**Ejemplo correcto:**
```html
<!-- Imagen con leyenda -->
<figure>
  <img src="elefante.jpg" alt="Elefante africano en sabana">
  <figcaption>Un elefante africano en su hábitat natural</figcaption>
</figure>

<!-- Código con leyenda -->
<figure>
  <figcaption>Obtener información del navegador con <code>navigator</code></figcaption>
  <pre><code>function getInfo() {
  return navigator.userAgent;
}</code></pre>
</figure>

<!-- Cita con atribución -->
<figure>
  <blockquote>
    <p>El conocimiento es poder.</p>
  </blockquote>
  <figcaption>— Francis Bacon</figcaption>
</figure>
```

**Rol ARIA implícito:** `figure`

---

#### `<figcaption>` - Leyenda de Figura

**Propósito:** Representa una leyenda o título describiendo el resto del contenido de su elemento `<figure>` padre.

**Restricciones:**
- Debe ser primer o último hijo de `<figure>`
- Un `<figure>` puede tener solo un `<figcaption>`

**Ejemplo correcto:**
```html
<figure>
  <img src="grafica.png" alt="Gráfica de ventas">
  <figcaption>Figura 1: Crecimiento de ventas trimestral</figcaption>
</figure>
```

---

### 2.4 Elementos de Texto Semántico

#### `<time>` - Tiempo/Fecha

**Propósito:** Representa un período específico en el tiempo.

**Atributos:**
- `datetime`: Fecha/hora en formato machine-readable

**Formatos válidos para datetime:**
- Fecha: `YYYY-MM-DD` (ej: `2026-02-18`)
- Tiempo: `HH:MM` o `HH:MM:SS` (ej: `14:30:00`)
- Fecha y hora: `YYYY-MM-DDTHH:MM:SS` (ej: `2026-02-18T14:30:00`)
- Duración: `PT2H30M` (2 horas 30 minutos)
- Mes: `YYYY-MM`
- Semana: `YYYY-WNN`

**Ejemplo correcto:**
```html
<p>
  El concierto será el 
  <time datetime="2026-07-15">15 de julio de 2026</time>
  a las 
  <time datetime="20:00">20:00</time>.
</p>

<p>
  Duración: 
  <time datetime="PT2H30M">2 horas y 30 minutos</time>
</p>

<p>
  Publicado: 
  <time datetime="2026-02-18T08:30:00-05:00">
    18 de febrero a las 8:30 AM EST
  </time>
</p>
```

**Rol ARIA implícito:** `time`

---

#### `<mark>` - Marcado/Resaltado

**Propósito:** Representa texto marcado o resaltado para referencia o notación, debido a la relevancia del pasaje marcado en el contexto.

**Cuándo usar:**
- Resaltar resultados de búsqueda
- Indicar texto de especial interés en una cita
- Destacar contenido relevante para la actividad actual del usuario

**Cuándo NO usar:**
- NO usar para resaltado sintáctico de código (usar `<span>` con CSS)
- NO confundir con `<strong>` (importancia) o `<em>` (énfasis)

**Ejemplo correcto:**
```html
<!-- Resultados de búsqueda -->
<p>
  Resultados para "HTML5":
  El <mark>HTML5</mark> introduce elementos semánticos que 
  mejoran la accesibilidad y <mark>HTML5</mark> es compatible 
  con todos los navegadores modernos.
</p>

<!-- Texto destacado en cita -->
<blockquote>
  La accesibilidad web es esencial. 
  <mark>Todos los usuarios deben poder acceder a la información</mark> 
  independientemente de sus capacidades.
</blockquote>
```

**Nota de accesibilidad:** La mayoría de los lectores de pantalla no anuncian `<mark>` por defecto. Para hacerlo accesible:
```css
mark::before {
  content: " [inicio de resaltado] ";
}
mark::after {
  content: " [fin de resaltado] ";
}
```

---

#### `<details>` y `<summary>` - Widget de Divulgación

**Propósito:** Crean un widget de divulgación donde la información es visible solo cuando el widget está en estado "abierto".

**Uso:**
- Preguntas frecuentes (FAQ)
- Contenido colapsable
- Información adicional opcional

**Ejemplo correcto:**
```html
<details>
  <summary>¿Qué es HTML5 semántico?</summary>
  <p>
    HTML5 semántico utiliza elementos que describen su significado,
    como <code>&lt;article&gt;</code>, <code>&lt;nav&gt;</code>, 
    y <code>&lt;header&gt;</code>.
  </p>
</details>

<details open>
  <summary>Política de Privacidad (abierto por defecto)</summary>
  <p>Contenido de la política...</p>
</details>
```

---

#### `<address>` - Información de Contacto

**Propósito:** Indica que el HTML encerrado proporciona información de contacto para una persona, personas u organización.

**Cuándo usar:**
- Información de contacto del autor de un artículo
- Información de contacto de la página/empresa

**Cuándo NO usar:**
- NO usar para direcciones físicas arbitrarias (a menos que sean de contacto)
- NO usar para direcciones de email/telefono sin contexto de contacto

**Ejemplo correcto:**
```html
<article>
  <h1>Artículo de Juan</h1>
  <address>
    Por <a href="https://twitter.com/juan">Juan Pérez</a><br>
    Email: <a href="mailto:juan@ejemplo.com">juan@ejemplo.com</a>
  </address>
</article>

<footer>
  <address>
    Mi Empresa S.A.<br>
    Calle Principal 123<br>
    Ciudad, País<br>
    Tel: <a href="tel:+1234567890">+1 234 567 890</a>
  </address>
</footer>
```

---

### 2.5 Elementos de Encabezado

#### `<h1>` - `<h6>` - Encabezados

**Propósito:** Representan seis niveles de encabezados de sección. `<h1>` es el nivel más alto, `<h6>` el más bajo.

**Reglas críticas:**
- Una página debe tener exactamente UN `<h1>` (título principal)
- No saltar niveles (no ir de `<h1>` a `<h3>` sin `<h2>`)
- Los encabezados definen el outline del documento

**Ejemplo correcto:**
```html
<body>
  <h1>Título Principal de la Página</h1>
  
  <section>
    <h2>Sección 1</h2>
    <p>Contenido...</p>
    
    <h3>Subsección 1.1</h3>
    <p>Contenido...</p>
    
    <h3>Subsección 1.2</h3>
    <p>Contenido...</p>
  </section>
  
  <section>
    <h2>Sección 2</h2>
    <p>Contenido...</p>
  </section>
</body>
```

**Rol ARIA implícito:** `heading` (con `aria-level` correspondiente)

---

#### `<hgroup>` - Grupo de Encabezados (Obsoleto/Desalentado)

**Estado:** HTML5.2 lo hizo obsoleto. No recomendado para uso.

**Alternativa:**
```html
<!-- No recomendado -->
<hgroup>
  <h1>Título principal</h1>
  <h2>Subtítulo</h2>
</hgroup>

<!-- Recomendado -->
<header>
  <h1>Título principal</h1>
  <p>Subtítulo</p>
</header>
```

---

## 3. ESTRUCTURA JERÁRQUICA CORRECTA

### 3.1 Estructura de Documento Típica

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título de la Página - Sitio Web</title>
</head>
<body>
  <!-- Skip link para accesibilidad -->
  <a href="#main-content" class="skip-link">Saltar al contenido principal</a>
  
  <header>
    <h1>Nombre del Sitio</h1>
    <nav aria-label="Navegación principal">
      <!-- Menú de navegación -->
    </nav>
  </header>
  
  <main id="main-content">
    <article>
      <header>
        <h1>Título del Artículo</h1>
        <time datetime="2026-02-18">18 de febrero, 2026</time>
      </header>
      
      <section>
        <h2>Sección 1</h2>
        <p>Contenido...</p>
      </section>
      
      <section>
        <h2>Sección 2</h2>
        <p>Contenido...</p>
        
        <aside>
          <h3>Información relacionada</h3>
          <p>Contenido tangencial...</p>
        </aside>
      </section>
      
      <footer>
        <p>Autor: Nombre del Autor</p>
        <address>
          <a href="mailto:autor@ejemplo.com">autor@ejemplo.com</a>
        </address>
      </footer>
    </article>
  </main>
  
  <aside aria-label="Contenido relacionado">
    <!-- Sidebar con contenido complementario -->
  </aside>
  
  <footer>
    <p>&copy; 2026 Nombre del Sitio</p>
    <nav aria-label="Enlaces legales">
      <!-- Enlaces a términos, privacidad, etc. -->
    </nav>
  </footer>
</body>
</html>
```

### 3.2 Reglas de Anidamiento

| Elemento Padre | Hijos Permitidos | Restricciones |
|----------------|------------------|---------------|
| `<article>` | Flow content | No descendiente de `<address>` |
| `<aside>` | Flow content | No descendiente de `<address>` |
| `<footer>` | Flow content (excepto `<footer>`, `<header>`) | No descendiente de `<address>`, `<header>`, `<footer>` |
| `<header>` | Flow content (excepto `<footer>`, `<header>`) | No descendiente de `<address>`, `<footer>`, `<header>` |
| `<main>` | Flow content | Solo uno por página, no anidado en sectioning elements |
| `<nav>` | Flow content | - |
| `<section>` | Flow content | No descendiente de `<address>` |
| `<figure>` | `<figcaption>` + flow content, o flow content + `<figcaption>` | Máximo un `<figcaption>` |

### 3.3 Article vs Section

| `<article>` | `<section>` |
|-------------|-------------|
| Contenido auto-contenido e independiente | Agrupación temática de contenido relacionado |
| Puede existir por sí solo (syndication) | Parte de un todo mayor |
| Ejemplos: post, artículo, comentario, producto | Ejemplos: capítulo, sección de características |

**Nota:** Pueden anidarse mutuamente según el contexto.

---

## 4. ROLES ARIA IMPLÍCITOS

### 4.1 Mapeo de Elementos a Roles ARIA

| Elemento HTML | Rol ARIA Implícito | Notas |
|---------------|-------------------|-------|
| `<article>` | `article` | - |
| `<aside>` | `complementary` | - |
| `<body>` | `document` | - |
| `<button>` | `button` | - |
| `<datalist>` | `listbox` | - |
| `<details>` | `group` | - |
| `<dialog>` | `dialog` | - |
| `<figure>` | `figure` | - |
| `<footer>` (body) | `contentinfo` | Genérico si está anidado |
| `<form>` | `form` | Solo si tiene nombre accesible |
| `<h1>`-`<h6>` | `heading` | Con `aria-level` correspondiente |
| `<header>` (body) | `banner` | Genérico si está anidado |
| `<hr>` | `separator` | - |
| `<img>` (con alt) | `img` | - |
| `<input>` (checkbox) | `checkbox` | - |
| `<input>` (radio) | `radio` | - |
| `<input>` (text) | `textbox` | - |
| `<li>` (en lista) | `listitem` | - |
| `<main>` | `main` | - |
| `<mark>` | None | - |
| `<nav>` | `navigation` | - |
| `<ol>` | `list` | - |
| `<output>` | `status` | - |
| `<progress>` | `progressbar` | - |
| `<section>` | `region` | Solo si tiene nombre accesible |
| `<search>` | `search` | - |
| `<select>` | `combobox` | - |
| `<summary>` | `button` | - |
| `<table>` | `table` | - |
| `<textarea>` | `textbox` | - |
| `<time>` | `time` | - |
| `<ul>` | `list` | - |

### 4.2 Landmark Roles Importantes

Los landmarks permiten a los usuarios de tecnologías asistivas navegar rápidamente a secciones importantes:

- `banner`: `<header>` (global)
- `navigation`: `<nav>`
- `main`: `<main>`
- `complementary`: `<aside>`
- `contentinfo`: `<footer>` (global)
- `search`: `<search>` (o `<form role="search">`)
- `region`: `<section>` (con nombre accesible)

---

## 5. MEJORES PRÁCTICAS PARA SEO

### 5.1 Optimización On-Page

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Título Descriptivo y Único | Marca</title>
  <meta name="description" content="Descripción concisa de 150-160 caracteres">
  <meta name="keywords" content="html5, semántico, accesibilidad">
  
  <!-- Open Graph para redes sociales -->
  <meta property="og:title" content="Título de la página">
  <meta property="og:description" content="Descripción para redes">
  <meta property="og:image" content="https://ejemplo.com/imagen.jpg">
  
  <!-- Datos estructurados -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Título del Artículo",
    "author": {
      "@type": "Person",
      "name": "Autor"
    },
    "datePublished": "2026-02-18",
    "publisher": {
      "@type": "Organization",
      "name": "Publicador"
    }
  }
  </script>
</head>
<body>
  <!-- Contenido semánticamente estructurado -->
</body>
</html>
```

### 5.2 Jerarquía de Encabezados para SEO

✅ **Correcto:**
```html
<h1>Guía Completa de HTML5 Semántico</h1>
<section>
  <h2>Beneficios del HTML Semántico</h2>
  <h3>Mejora en SEO</h3>
  <h3>Accesibilidad Mejorada</h3>
</section>
<section>
  <h2>Elementos Principales</h2>
  <h3>header y footer</h3>
  <h3>article y section</h3>
</section>
```

❌ **Incorrecto:**
```html
<h1>Guía de HTML5</h1>
<h3>Beneficios</h3>  <!-- Salta h2 -->
<h2>Elementos</h2>
<h5>Header</h5>     <!-- Salta h3 y h4 -->
```

### 5.3 Microdatos y Schema.org

```html
<article itemscope itemtype="https://schema.org/Article">
  <header>
    <h1 itemprop="headline">Título del Artículo</h1>
    <p>
      Por <span itemprop="author" itemscope itemtype="https://schema.org/Person">
        <span itemprop="name">Autor</span>
      </span>
      · <time itemprop="datePublished" datetime="2026-02-18">18 feb 2026</time>
    </p>
  </header>
  <div itemprop="articleBody">
    <p>Contenido del artículo...</p>
  </div>
</article>
```

---

## 6. ERRORES COMUNES Y ANTI-PATRONES

### 6.1 Div Soup (Sopa de Divs)

❌ **Anti-patrón:**
```html
<div class="header">
  <div class="nav">
    <div class="menu-item"><a href="/">Home</a></div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">Título</div>
  </div>
</div>
<div class="footer">Copyright</div>
```

✅ **Correcto:**
```html
<header>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>Título</h1>
  </article>
</main>
<footer>Copyright</footer>
```

### 6.2 Uso Incorrecto de `<section>` como Wrapper

❌ **Anti-patrón:**
```html
<section id="wrapper">
  <header>...</header>
  <section id="main">...</section>
  <footer>...</footer>
</section>
```

✅ **Correcto:**
```html
<body>
  <header>...</header>
  <main>...</main>
  <footer>...</footer>
</body>
```

### 6.3 `<figure>` Abusado

❌ **Anti-patrón:**
```html
<!-- No es una figura referenciada -->
<figure>
  <img src="logo.png" alt="Logo">
</figure>

<!-- Imagen decorativa -->
<figure>
  <img src="fondo.jpg" alt="">
</figure>
```

✅ **Correcto:**
```html
<!-- Imagen referenciada con leyenda -->
<figure>
  <img src="diagrama.png" alt="Diagrama de arquitectura">
  <figcaption>Figura 1: Arquitectura del sistema</figcaption>
</figure>

<!-- Logo simple -->
<img src="logo.png" alt="Nombre de la Empresa">
```

### 6.4 Jerarquía de Encabezados Incorrecta

❌ **Anti-patrón:**
```html
<h1>Título</h1>
<h3>Subtítulo</h3>  <!-- Salta h2 -->
<h2>Sección</h2>
<h5>Subsección</h5> <!-- Salta h3 y h4 -->
```

✅ **Correcto:**
```html
<h1>Título</h1>
<h2>Subtítulo</h2>
<h2>Sección</h2>
<h3>Subsección</h3>
```

### 6.5 Múltiples `<main>` o `<h1>`

❌ **Anti-patrón:**
```html
<main>...</main>
<main>...</main>  <!-- ¡ERROR! Solo uno permitido -->

<h1>Título 1</h1>
<h1>Título 2</h1>  <!-- ¡ERROR! Solo uno por página -->
```

### 6.6 Navegación Excesiva

❌ **Anti-patrón:**
```html
<nav><!-- Links principales --></nav>
<nav><!-- Pagination --></nav>
<nav><!-- Footer links --></nav>
<nav><!-- Social links --></nav>
```

✅ **Correcto:**
```html
<nav aria-label="Principal"><!-- Links principales --></nav>
<nav aria-label="Paginación"><!-- Pagination --></nav>
<footer>
  <!-- Footer links no necesitan nav -->
</footer>
```

### 6.7 Uso Incorrecto de `<br>` para Espaciado

❌ **Anti-patrón:**
```html
<p>Texto</p>
<br><br><br>
<p>Más texto</p>
```

✅ **Correcto:**
```html
<p>Texto</p>
<p>Más texto</p>
<!-- Usar CSS para espaciado: margin-bottom -->
```

### 6.8 Tablas para Layout

❌ **Anti-patrón:**
```html
<table>
  <tr>
    <td><div>Header</div></td>
  </tr>
  <tr>
    <td><div>Sidebar</div></td>
    <td><div>Main</div></td>
  </tr>
</table>
```

✅ **Correcto:**
```html
<header>Header</header>
<aside>Sidebar</aside>
<main>Main</main>
<!-- Usar CSS Grid o Flexbox para layout -->
```

### 6.9 Atributos Booleanos Incorrectos

❌ **Anti-patrón:**
```html
<input required="true">
<input required="false">  <!-- ¡Aún requerido! -->
<input required="1">
```

✅ **Correcto:**
```html
<input required>
<input>  <!-- No requerido (sin atributo) -->
```

### 6.10 Elementos Interactivos en Elementos Interactivos

❌ **Anti-patrón:**
```html
<a href="/">
  <button>Click</button>  <!-- ¡ERROR! -->
</a>

<button>
  <a href="/">Link</a>   <!-- ¡ERROR! -->
</button>
```

✅ **Correcto:**
```html
<a href="/">Click</a>
<button type="button">Click</button>
```

---

## 7. CASOS DE USO REALES

### 7.1 Página de Blog

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Blog de Tecnología</title>
</head>
<body>
  <header>
    <h1>Blog de Tecnología</h1>
    <nav aria-label="Navegación principal">
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/categorias">Categorías</a></li>
        <li><a href="/about">Acerca</a></li>
      </ul>
    </nav>
  </header>
  
  <main>
    <article>
      <header>
        <h1>Introducción a HTML5 Semántico</h1>
        <p>
          Por <a href="/autor/juan">Juan Pérez</a>
          · <time datetime="2026-02-18">18 de febrero, 2026</time>
        </p>
      </header>
      
      <section>
        <h2>¿Qué es HTML5 Semántico?</h2>
        <p>Contenido...</p>
        <figure>
          <img src="semantic.png" alt="Diagrama de elementos semánticos">
          <figcaption>Figura 1: Elementos semánticos HTML5</figcaption>
        </figure>
      </section>
      
      <section>
        <h2>Beneficios</h2>
        <ul>
          <li>Mejor SEO</li>
          <li>Mayor accesibilidad</li>
          <li>Código más mantenible</li>
        </ul>
      </section>
      
      <aside>
        <h3>Artículos Relacionados</h3>
        <ul>
          <li><a href="/articulo/css">CSS Moderno</a></li>
        </ul>
      </aside>
      
      <footer>
        <p>Etiquetas: <a href="/tag/html5">HTML5</a>, <a href="/tag/seo">SEO</a></p>
      </footer>
    </article>
    
    <section aria-label="Comentarios">
      <h2>Comentarios</h2>
      <article>
        <header>
          <h3>María comentó:</h3>
          <time datetime="2026-02-18T10:00">Hoy a las 10:00</time>
        </header>
        <p>Excelente artículo, gracias por compartir.</p>
      </article>
    </section>
  </main>
  
  <aside aria-label="Sidebar">
    <section>
      <h2>Sobre el Autor</h2>
      <p>Desarrollador web con 10 años de experiencia...</p>
    </section>
  </aside>
  
  <footer>
    <p>&copy; 2026 Blog de Tecnología</p>
  </footer>
</body>
</html>
```

### 7.2 Página de E-commerce (Producto)

```html
<main>
  <article>
    <header>
      <h1>Laptop Profesional X1</h1>
      <p>Marca: TechCorp</p>
    </header>
    
    <figure>
      <img src="laptop.jpg" alt="Laptop Profesional X1 - Vista frontal">
      <figcaption>Vista frontal del producto</figcaption>
    </figure>
    
    <section>
      <h2>Descripción</h2>
      <p>La Laptop Profesional X1 ofrece rendimiento excepcional...</p>
    </section>
    
    <section>
      <h2>Especificaciones</h2>
      <table>
        <tr>
          <th scope="row">Procesador</th>
          <td>Intel Core i7</td>
        </tr>
        <tr>
          <th scope="row">RAM</th>
          <td>16 GB</td>
        </tr>
      </table>
    </section>
    
    <aside>
      <h2>Productos Similares</h2>
      <!-- Lista de productos -->
    </aside>
    
    <footer>
      <button type="button">Agregar al carrito</button>
    </footer>
  </article>
</main>
```

### 7.3 Página de Documentación

```html
<header>
  <h1>Documentación API</h1>
</header>

<nav aria-label="Tabla de contenidos">
  <h2>Contenidos</h2>
  <ol>
    <li><a href="#introduccion">Introducción</a></li>
    <li><a href="#autenticacion">Autenticación</a></li>
    <li><a href="#endpoints">Endpoints</a></li>
  </ol>
</nav>

<main>
  <section id="introduccion">
    <h2>Introducción</h2>
    <p>Bienvenido a la documentación de nuestra API...</p>
  </section>
  
  <section id="autenticacion">
    <h2>Autenticación</h2>
    <p>Todas las peticiones requieren autenticación...</p>
    <figure>
      <pre><code>GET /api/v1/users
Authorization: Bearer {token}</code></pre>
      <figcaption>Ejemplo de petición autenticada</figcaption>
    </figure>
  </section>
  
  <section id="endpoints">
    <h2>Endpoints</h2>
    <details>
      <summary><code>GET /api/v1/users</code></summary>
      <p>Obtiene la lista de usuarios.</p>
      <h3>Parámetros</h3>
      <ul>
        <li><code>page</code>: Número de página</li>
      </ul>
    </details>
  </section>
</main>
```

---

## 8. CHECKLIST DE VALIDACIÓN

### 8.1 Estructura General
- [ ] Solo un `<main>` por página
- [ ] Solo un `<h1>` por página
- [ ] Jerarquía de encabezados lógica (sin saltos)
- [ ] Atributo `lang` en `<html>`
- [ ] Meta charset UTF-8
- [ ] Viewport meta tag

### 8.2 Elementos Semánticos
- [ ] `<header>` usado correctamente (no anidado en sí mismo)
- [ ] `<nav>` solo para navegación principal
- [ ] `<article>` para contenido standalone
- [ ] `<section>` con encabezado (generalmente)
- [ ] `<aside>` para contenido tangencial
- [ ] `<footer>` en contexto correcto

### 8.3 Accesibilidad
- [ ] Skip link al contenido principal
- [ ] Imágenes con alt text descriptivo
- [ ] Formularios con labels asociados
- [ ] Contraste de color suficiente
- [ ] Navegación por teclado funcional
- [ ] ARIA usado solo cuando es necesario

### 8.4 SEO
- [ ] Title tag único y descriptivo
- [ ] Meta description presente
- [ ] URLs descriptivas
- [ ] Datos estructurados (JSON-LD)
- [ ] Open Graph tags
- [ ] Canonical URLs

### 8.5 Validación
- [ ] HTML validado con W3C Validator
- [ ] Sin errores de anidamiento
- [ ] Atributos booleanos correctos
- [ ] Sin elementos obsoletos
- [ ] Lighthouse audit (SEO > 90)
- [ ] Lighthouse audit (Accessibility > 90)

---

## 9. HERRAMIENTAS RECOMENDADAS

### Validación y Testing
| Herramienta | Propósito | URL |
|-------------|-----------|-----|
| W3C Validator | Validación de HTML | validator.w3.org |
| HTML5 Outliner | Ver outline del documento | chrome extension |
| Lighthouse | Auditoría de calidad | DevTools de Chrome |
| axe DevTools | Testing de accesibilidad | deque.com/axe |
| WAVE | Evaluación de accesibilidad | wave.webaim.org |

### Referencias Oficiales
- MDN Web Docs: developer.mozilla.org
- HTML Living Standard: html.spec.whatwg.org
- W3C HTML5: www.w3.org/TR/html5/
- WAI-ARIA: www.w3.org/WAI/ARIA/

---

## 10. CONCLUSIÓN

El HTML5 semántico es fundamental para:
1. **Accesibilidad**: Permite que personas con discapacidades naveguen el contenido eficientemente
2. **SEO**: Ayuda a los motores de búsqueda a entender la estructura y jerarquía del contenido
3. **Mantenibilidad**: Hace el código más legible y fácil de mantener
4. **Compatibilidad**: Asegura que el contenido funcione en diferentes dispositivos y tecnologías

**Primera regla de ARIA**: Si puedes usar un elemento HTML nativo con la semántica y comportamiento que necesitas, hazlo en lugar de reutilizar un elemento y agregar ARIA.

---

*Documento generado para uso como referencia de habilidad HTML5 Semántico*
*Basado en especificaciones oficiales W3C, WHATWG y MDN Web Docs*
