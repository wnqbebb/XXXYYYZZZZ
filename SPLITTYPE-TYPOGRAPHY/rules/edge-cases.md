---
name: splittype-edge-cases
description: Elementos anidados, fuentes personalizadas, emojis, RTL y casos especiales complejos con SplitType.
tags: [splittype, edge-cases, nested-elements, emoji, rtl, fonts]
version: 1.0.0
---

# SplitType Edge Cases

Guía para manejar casos especiales y complejos con SplitType: elementos anidados, fuentes personalizadas, emojis, texto RTL y más.

---

## Elementos Anidados

### Preservación de HTML

SplitType v0.3+ preserva elementos HTML anidados dentro del texto.

```html
<!-- Input -->
<p id="target">
  Hello <em>beautiful</em> <strong>world</strong>
</p>
```

```typescript
const text = new SplitType('#target', { types: 'words, chars' })
```

```html
<!-- Output -->
<p id="target">
  <div class="word">
    <div class="char">H</div>
    <div class="char">e</div>
    <div class="char">l</div>
    <div class="char">l</div>
    <div class="char">o</div>
  </div>
  <em>
    <div class="word">
      <div class="char">b</div>
      <div class="char">e</div>
      <div class="char">a</div>
      <div class="char">u</div>
      <div class="char">t</div>
      <div class="char">i</div>
      <div class="char">f</div>
      <div class="char">u</div>
      <div class="char">l</div>
    </div>
  </em>
  <strong>
    <div class="word">
      <div class="char">w</div>
      <div class="char">o</div>
      <div class="char">r</div>
      <div class="char">l</div>
      <div class="char">d</div>
    </div>
  </strong>
</p>
```

### Limitación: Split Lines + Nested Elements

> ⚠️ **NO compatible**: Cuando `types` incluye `"lines"`, los elementos anidados que se rompen en múltiples líneas causan saltos de línea inesperados.

```typescript
// ❌ EVITAR
const text = new SplitType('#target', { 
  types: 'lines, words, chars' // Con elementos anidados
})

// ✅ USAR
const text = new SplitType('#target', { 
  types: 'words, chars' // Sin lines
})
```

### Solución para Links y Botones

```html
<!-- Input con links -->
<p id="cta">
  Click <a href="/contact">here</a> to contact us
</p>
```

```typescript
// Usar words, chars (sin lines)
const text = new SplitType('#cta', { types: 'words, chars' })

// El link se mantiene funcional
text.words.forEach(word => {
  const link = word.querySelector('a')
  if (link) {
    // El link está preservado dentro del word
    link.addEventListener('click', handleClick)
  }
})
```

---

## Emojis y Unicode

### Soporte de Emojis

SplitType soporta emojis y símbolos Unicode correctamente.

```html
<p id="emoji-text">Hello 👋 World 🌍</p>
```

```typescript
const text = new SplitType('#emoji-text', { types: 'chars' })

// text.chars incluye los emojis como caracteres individuales
// ['H', 'e', 'l', 'l', 'o', ' ', '👋', ' ', 'W', 'o', 'r', 'l', 'd', ' ', '🌍']
```

### Emojis Compuestos

```html
<p id="complex-emoji">Family: 👨‍👩‍👧‍👦 Flag: 🇺🇸</p>
```

```typescript
const text = new SplitType('#complex-emoji', { types: 'chars' })

// Los emojis compuestos (ZWJ sequences) se mantienen juntos
// donde sea posible según el navegador
```

### Animación de Emojis

```typescript
const text = new SplitType('#emoji-text', { types: 'chars' })

// Animar solo los emojis
text.chars.forEach(char => {
  if (/\p{Emoji}/u.test(char.textContent || '')) {
    gsap.to(char, {
      scale: 1.5,
      rotation: 360,
      duration: 0.5,
      repeat: -1,
      yoyo: true
    })
  }
})
```

---

## Fuentes Personalizadas

### Web Fonts

```css
/* Cargar fuente personalizada */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
}

.split-text {
  font-family: 'CustomFont', sans-serif;
  font-kerning: none; /* IMPORTANTE */
}
```

### Esperar Carga de Fuentes

```typescript
import SplitType from 'split-type'

document.fonts.ready.then(() => {
  // La fuente está cargada, ahora hacer split
  const text = new SplitType('#target', { types: 'lines, words' })
  
  // Animar...
})

// O con FontFaceObserver
import FontFaceObserver from 'fontfaceobserver'

const font = new FontFaceObserver('CustomFont')

font.load().then(() => {
  const text = new SplitType('#target')
  // ...
})
```

### Fuentes Variables

```css
.split-text {
  font-family: 'VariableFont', sans-serif;
  font-variation-settings: 'wght' 400, 'wdth' 100;
  font-kerning: none;
}
```

```typescript
// Animar propiedades de fuente variable
const text = new SplitType('#variable-text', { types: 'chars' })

gsap.to(text.chars, {
  fontVariationSettings: "'wght' 700, 'wdth' 150",
  duration: 1,
  stagger: 0.02
})
```

---

## Texto RTL (Right-to-Left)

### Soporte RTL

```html
<!-- Texto Árabe -->
<p id="arabic" dir="rtl">مرحبا بالعالم</p>

<!-- Texto Hebreo -->
<p id="hebrew" dir="rtl">שלום עולם</p>
```

```typescript
const text = new SplitType('#arabic', { types: 'chars' })

// Los caracteres se dividen correctamente
// respetando la dirección RTL
```

### Mixed Direction

```html
<p id="mixed" dir="auto">
  Hello مرحبا World
</p>
```

```typescript
const text = new SplitType('#mixed', { types: 'words, chars' })

// Cada segmento mantiene su dirección natural
```

---

## Saltos de Línea Explícitos

### `<br>` Tags

SplitType preserva los saltos de línea explícitos.

```html
<p id="explicit-breaks">
  Line 1<br>
  Line 2<br>
  Line 3
</p>
```

```typescript
const text = new SplitType('#explicit-breaks', { types: 'lines' })

// Detecta 3 líneas respetando los <br>
```

### Múltiples `<br>`

```html
<p id="multiple-breaks">
  Paragraph 1<br><br>
  Paragraph 2
</p>
```

```typescript
const text = new SplitType('#multiple-breaks', { types: 'lines' })

// Múltiples <br> crean líneas vacías
```

---

## Whitespace y Espacios

### Preservación de Espacios

```html
<p id="spaces">Word1   Word2    Word3</p>
```

```typescript
const text = new SplitType('#spaces', { types: 'words' })

// Los espacios múltiples se colapsan en uno
// (comportamiento HTML estándar)
```

### Preformatted Text

```html
<pre id="preformatted">
Line 1
Line 2
Line 3
</pre>
```

```typescript
const text = new SplitType('#preformatted', { types: 'lines' })

// Respeta los saltos de línea del <pre>
```

---

## Comentarios HTML

### Comentarios en el Texto

```html
<p id="with-comments">
  Hello <!-- this is a comment --> World
</p>
```

```typescript
const text = new SplitType('#with-comments')

// Los comentarios se preservan en el DOM
// pero no afectan el texto visible
```

---

## Caracteres Especiales

### HTML Entities

```html
<p id="entities">
  &lt;div&gt; &amp; &quot;quotes&quot;
</p>
```

```typescript
const text = new SplitType('#entities', { types: 'chars' })

// Las entidades se convierten a caracteres
// ['<', 'd', 'i', 'v', '>', ' ', '&', ' ', '"', ...]
```

### Zero-Width Characters

```html
<p id="zw-chars">
  Soft&shy;Hyphen Zero&#8203;Width
</p>
```

```typescript
const text = new SplitType('#zw-chars', { types: 'chars' })

// Los caracteres de ancho cero se manejan
// según el comportamiento del navegador
```

---

## Listas y Estructuras Complejas

### Listas (`<ul>`, `<ol>`)

```html
<ul id="list">
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>
```

```typescript
// SplitType funciona en cada elemento de lista
const items = document.querySelectorAll('#list li')
items.forEach(item => {
  const text = new SplitType(item, { types: 'words' })
  // Animar...
})
```

### Tablas

```html
<table id="table">
  <tr>
    <td>Cell 1</td>
    <td>Cell 2</td>
  </tr>
</table>
```

```typescript
const cells = document.querySelectorAll('#table td')
cells.forEach(cell => {
  const text = new SplitType(cell, { types: 'chars' })
  // Animar...
})
```

---

## Directrices Críticas

### MUST

```yaml
MUST:
  - Esperar carga de fuentes:
      code: |
        document.fonts.ready.then(() => {
          const text = new SplitType('#target')
        })
      why: "Las métricas de fuente afectan el cálculo de líneas"
      
  - Usar types correcto para elementos anidados:
      code: |
        // Con elementos anidados
        const text = new SplitType('#target', { 
          types: 'words, chars' // Sin 'lines'
        })
      why: "Lines + nested elements = saltos inesperados"
      
  - Manejar emojis como caracteres:
      code: |
        const text = new SplitType('#emoji-text', { 
          types: 'chars' 
        })
      why: "SplitType maneja Unicode correctamente"
      
  - Aplicar font-kerning: none:
      css: |
        .split-text {
          font-kerning: none;
        }
      why: "Previene desplazamientos con fuentes personalizadas"
```

### FORBIDDEN

```yaml
FORBIDDEN:
  - Split lines con elementos anidados:
      wrong: |
        <p>Hello <em>world</em></p>
        
        new SplitType('p', { types: 'lines, words' })
      right: |
        new SplitType('p', { types: 'words, chars' })
      why: "Causa saltos de línea inesperados"
      
  - Ignorar carga de fuentes:
      wrong: |
        // Fuente aún cargando
        const text = new SplitType('#target')
      right: |
        document.fonts.ready.then(() => {
          const text = new SplitType('#target')
        })
      why: "Métricas incorrectas = posiciones incorrectas"
      
  - Asumir comportamiento de emojis:
      wrong: |
        // Tratar emojis como texto normal
        char.textContent.length
      right: |
        // Usar segmentación Unicode
        Array.from(char.textContent).length
      why: "Los emojis pueden ser secuencias ZWJ"
```

### WHY

```yaml
WHY:
  nested-elements: |
    SplitType envuelve cada texto en elementos div.
    Con lines, los elementos anidados que cruzan
    líneas crean estructuras DOM inválidas.
    
  font-loading: |
    Las métricas de fuente (ancho de caracteres,
    altura de línea) afectan el cálculo de líneas.
    Fuente no cargada = métricas incorrectas.
    
  unicode-support: |
    SplitType usa APIs Unicode modernas para
    segmentar correctamente caracteres,
    incluyendo emojis y scripts complejos.
    
  rtl-support: |
    El navegador maneja la dirección del texto.
    SplitType preserva la estructura manteniendo
    el contexto de dirección de cada elemento.
```

---

## Debugging

### Inspeccionar Resultado

```typescript
const text = new SplitType('#target')

// Ver estructura generada
console.log('Lines:', text.lines)
console.log('Words:', text.words)
console.log('Chars:', text.chars)

// Ver HTML resultante
console.log('HTML:', document.getElementById('target').innerHTML)
```

### Verificar Métricas

```typescript
// Verificar si la fuente está cargada
console.log('Fonts ready:', document.fonts.status)

// Verificar dimensiones
const element = document.getElementById('target')
console.log('Width:', element.offsetWidth)
console.log('Height:', element.offsetHeight)
```

---

## Recursos

- [Unicode Segmentation](https://unicode.org/reports/tr29/)
- [Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Font_Loading_API)
- [RTL Best Practices](https://rtlstyling.com/)
