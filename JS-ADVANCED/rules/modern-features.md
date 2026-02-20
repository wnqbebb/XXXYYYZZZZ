# Modern JavaScript Features (ES2020-ES2024)

## Metadatos

- **Nombre**: Modern JavaScript Features
- **Descripción**: Guía completa de características modernas de JavaScript desde ES2020 hasta ES2024, incluyendo TypeScript 5.x. Define cuándo usar cada feature, cuándo evitarla, y los anti-patrones del pasado que reemplazan.

---

## ES2020

### BigInt

#### MUST
- Usar cuando necesites representar enteros mayores a `Number.MAX_SAFE_INTEGER` (2^53 - 1)
- Usar para operaciones matemáticas precisas con números grandes
- Usar en aplicaciones financieras, criptográficas o científicas con grandes números enteros

#### FORBIDDEN
- NO usar para operaciones con decimales (BigInt solo soporta enteros)
- NO mezclar BigInt con Number en operaciones aritméticas directas
- NO usar JSON.stringify() directamente (lanza error)
- NO usar en operaciones donde el rendimiento sea crítico y los números quepan en Number

#### WHY
- Elimina la limitación de precisión de 53 bits de los números JavaScript
- Representa enteros arbitrariamente grandes sin pérdida de precisión
- Crítico para aplicaciones que manejan IDs de bases de datos distribuidas, timestamps nanosegundos, o criptografía

#### ✅ Código Correcto
```javascript
// Creación de BigInt
const huge = 9007199254740991n;
const huge2 = BigInt("9007199254740991999999999999");

// Operaciones matemáticas
const sum = 9007199254740991n + 1n; // Preciso
const product = huge * 2n;

// Comparaciones (funcionan entre BigInt y Number)
0n === 0n;        // true
0n == 0;          // true
0n === 0;         // false (tipos diferentes)

// División entera truncada
5n / 2n;          // 2n (no 2.5n)

// Uso típico: IDs de Twitter, timestamps
const tweetId = 12345678901234567890n;
const preciseTime = 1683123456789012345n;
```

#### ❌ Anti-patrón del Pasado
```javascript
// Pérdida de precisión con números grandes
const maxSafe = Number.MAX_SAFE_INTEGER; // 9007199254740991
console.log(maxSafe + 1); // 9007199254740992
console.log(maxSafe + 2); // 9007199254740992 - ¡PERDIDA DE PRECISIÓN!

// Soluciones "hacky" del pasado
const bigNumber = "9007199254740991999999999999";
// Convertir a string y manipular manualmente... 😱
```

---

### Dynamic Import

#### MUST
- Usar para code-splitting y lazy loading de módulos
- Usar cuando un módulo solo se necesite bajo ciertas condiciones
- Usar para cargar módulos opcionales que pueden no estar disponibles
- Usar en aplicaciones grandes para mejorar el tiempo de carga inicial

#### FORBIDDEN
- NO usar para módulos que siempre se necesitan (usar import estático)
- NO usar en el path de renderizado crítico sin precarga adecuada
- NO abusar del dynamic import creando demasiados chunks pequeños
- NO usar sin manejo de errores adecuado (el módulo puede fallar al cargar)

#### WHY
- Reduce el bundle size inicial
- Mejora el Time to Interactive (TTI)
- Permite cargar funcionalidad bajo demanda
- Soporte nativo para código asíncrono

#### ✅ Código Correcto
```javascript
// Lazy loading de componentes
async function loadChart() {
  const { Chart } = await import('./chart-library.js');
  const chart = new Chart(data);
  chart.render();
}

// Carga condicional según feature detection
if (supportsWebGL()) {
  const { WebGLRenderer } = await import('./webgl-renderer.js');
  renderer = new WebGLRenderer();
} else {
  const { CanvasRenderer } = await import('./canvas-renderer.js');
  renderer = new CanvasRenderer();
}

// Carga con manejo de errores
try {
  const heavyModule = await import('./heavy-calculation.js');
  heavyModule.process(data);
} catch (error) {
  console.error('Failed to load module:', error);
  // Fallback
}

// Import nombrado dinámico
const { foo, bar } = await import('./module.js');

// Import del módulo por defecto
const module = await import('./module.js');
const defaultExport = module.default;
```

#### ❌ Anti-patrón del Pasado
```javascript
// Import estático innecesario que agranda el bundle
import { HeavyChart } from './chart-library.js'; // Siempre cargado

// Solución anterior: require() condicional (solo Node.js)
let heavyModule;
if (condition) {
  heavyModule = require('./heavy-module'); // No funciona en ESM
}

// Script tags dinámicos con callbacks complejos
function loadScript(url, callback) {
  const script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}
```

---

### Nullish Coalescing (??)

#### MUST
- Usar cuando quieras usar un valor por defecto SOLO cuando el valor sea `null` o `undefined`
- Usar para configuraciones donde `false`, `0`, o `""` sean valores válidos
- Usar para encadenar valores por defecto de forma clara

#### FORBIDDEN
- NO usar cuando `0`, `false`, o `""` deban ser tratados como "no valor" (usar `||`)
- NO mezclar con `&&` u `||` sin paréntesis explícitos (precedencia diferente)
- NO usar para valores que puedan ser intencionalmente falsy

#### WHY
- Distinción clara entre "no existe" (nullish) y "falsy"
- Evita bugs sutiles donde `0` o `""` son valores válidos
- Comportamiento más predecible que `||`

#### ✅ Código Correcto
```javascript
// Configuración con valores falsy válidos
const config = {
  timeout: 0,      // 0 es válido, no usar default
  retries: false,  // false es válido
  name: ""         // String vacío es válido
};

const timeout = config.timeout ?? 5000;     // 0 (no el default)
const retries = config.retries ?? 3;        // false (no el default)
const name = config.name ?? "unnamed";      // "" (no el default)

// Encadenamiento de defaults
const value = userInput ?? cachedValue ?? defaultValue ?? fallbackValue;

// Funciones con parámetros opcionales
function createUser(name, age) {
  const finalAge = age ?? 18; // 0 es válido como edad
  return { name, age: finalAge };
}

// React: Props con valores falsy válidos
function Component({ count = 0, label = "" }) {
  // count podría ser 0 intencionalmente
  const displayCount = count ?? "N/A";
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Bug clásico con ||
const timeout = config.timeout || 5000;
// Si timeout es 0, se usa 5000 (¡BUG!)

// Solución verbosa del pasado
const timeout = config.timeout !== undefined && config.timeout !== null 
  ? config.timeout 
  : 5000;

// O peor aún
const timeout = config.timeout != null ? config.timeout : 5000;
```

---

### Optional Chaining (?.)

#### MUST
- Usar para acceder a propiedades anidadas que pueden no existir
- Usar para llamar métodos que pueden no estar definidos
- Usar para acceder a elementos de arrays que pueden ser undefined
- Usar en combinación con nullish coalescing para valores por defecto

#### FORBIDDEN
- NO usar en asignaciones (el lado izquierdo no puede ser optional)
- NO usar excesivamente en lugares donde la estructura es garantizada
- NO usar para ocultar errores de diseño donde la propiedad DEBE existir
- NO abusar creando cadenas excesivamente largas (reconsidera el diseño)

#### WHY
- Elimina código defensivo repetitivo
- Previene errores de "cannot read property of undefined"
- Hace el código más legible y expresivo
- Short-circuit evaluation eficiente

#### ✅ Código Correcto
```javascript
// Acceso a propiedades anidadas
const userCity = user?.address?.city ?? "Unknown";

// Llamada a métodos opcionales
const result = myObject?.customMethod?.();

// Acceso a array opcional
const firstItem = array?.[0];

// Encadenamiento con expresiones
const value = user?.getProfile?.()?.settings?.theme;

// Combinación con nullish coalescing
const street = user?.address?.street ?? "No street provided";

// Short-circuit en múltiples niveles
const companyName = user?.company?.department?.manager?.name;

// Borrado opcional (ES2021+)
delete user?.profile?.temporaryData;

// React: Acceso seguro a props anidadas
function UserProfile({ user }) {
  return (
    <div>
      <h1>{user?.name ?? "Anonymous"}</h1>
      <p>{user?.contact?.email}</p>
    </div>
  );
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Código defensivo verboso y propenso a errores
const userCity = user && user.address && user.address.city;

// Solución aún más verbosa
let userCity;
if (user && user.address && user.address.city) {
  userCity = user.address.city;
} else {
  userCity = "Unknown";
}

// Con try-catch (muy costoso)
try {
  userCity = user.address.city;
} catch (e) {
  userCity = "Unknown";
}

// Lodash (dependencia externa innecesaria)
const userCity = _.get(user, 'address.city', 'Unknown');
```

---

### Promise.allSettled

#### MUST
- Usar cuando necesites esperar TODAS las promesas sin importar si fallan
- Usar para operaciones batch donde cada resultado individual importa
- Usar para evitar que un error cancele todo el batch de operaciones
- Usar para reportar el estado completo de múltiples operaciones

#### FORBIDDEN
- NO usar cuando un error deba detener todo el flujo (usar `Promise.all`)
- NO usar cuando solo necesites los valores exitosos
- NO ignorar los errores - siempre procesar el array de resultados

#### WHY
- Nunca rechaza - siempre resuelve con todos los resultados
- Permite manejar éxitos y fallos individualmente
- Evita que un error único invalide todo el trabajo
- Proporciona información completa del estado

#### ✅ Código Correcto
```javascript
// Batch de operaciones donde cada una es independiente
const urls = ['url1', 'url2', 'url3', 'url4'];
const results = await Promise.allSettled(urls.map(url => fetch(url)));

// Procesar resultados individualmente
results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`✅ ${urls[index]}: Success`);
    processData(result.value);
  } else {
    console.error(`❌ ${urls[index]}: ${result.reason}`);
    logError(result.reason);
  }
});

// Separar éxitos y fallos
const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);

const failed = results
  .filter(r => r.status === 'rejected')
  .map(r => r.reason);

// TypeScript: Tipado correcto
interface Result<T> {
  status: 'fulfilled' | 'rejected';
  value?: T;
  reason?: Error;
}

// Helper para extraer valores
function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === 'fulfilled';
}

const values = results.filter(isFulfilled).map(r => r.value);
```

#### ❌ Anti-patrón del Pasado
```javascript
// Promise.all falla completamente si una promesa rechaza
try {
  const results = await Promise.all(promises);
  // Si una falla, nunca llegamos aquí
} catch (error) {
  // Solo sabemos del primer error, perdemos los otros resultados
}

// Solución manual extremadamente verbosa
async function allSettledManual(promises) {
  const results = [];
  for (const promise of promises) {
    try {
      const value = await promise;
      results.push({ status: 'fulfilled', value });
    } catch (reason) {
      results.push({ status: 'rejected', reason });
    }
  }
  return results;
}
```

---

### globalThis

#### MUST
- Usar para acceder al objeto global de forma universal (browser, Node.js, Web Workers)
- Usar en librerías que deben funcionar en múltiples entornos
- Usar para polyfills que necesitan acceder al objeto global
- Usar para detectar features de forma segura

#### FORBIDDEN
- NO usar cuando window/self/global sean específicos del entorno conocido
- NO usar para crear variables globales (patrón anti)
- NO usar para detectar el entorno (usar feature detection)

#### WHY
- Solución universal que funciona en todos los entornos JavaScript
- Elimina la necesidad de código condicional por entorno
- Estándar ECMAScript, no específico de plataforma

#### ✅ Código Correcto
```javascript
// Polyfill seguro
if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

// Feature detection universal
if (globalThis.indexedDB) {
  // Usar IndexedDB
}

// Acceso al objeto global para librerías
const root = globalThis;

// Configuración global de librería
if (!globalThis.myLibraryConfig) {
  globalThis.myLibraryConfig = { version: '1.0.0' };
}

// Web Workers
// En Worker: self es el global
// Con globalThis: funciona igual en Window y Worker
const globalObject = globalThis;
```

#### ❌ Anti-patrón del Pasado
```javascript
// Código condicional por entorno (frágil)
const globalObj = typeof window !== 'undefined' 
  ? window 
  : typeof global !== 'undefined' 
    ? global 
    : typeof self !== 'undefined' 
      ? self 
      : this;

// Módulo específico de entorno
// polyfill-browser.js
window.myFeature = () => {};

// polyfill-node.js
global.myFeature = () => {};

// Web Workers: self no es window
// self es el global, pero typeof window === 'undefined'
```

---

## ES2021

### Numeric Separators

#### MUST
- Usar para mejorar la legibilidad de números grandes
- Usar para separar grupos de dígitos significativos
- Usar para números binarios, octales y hexadecimales largos
- Usar para constantes que representen valores con significado (masks, flags)

#### FORBIDDEN
- NO usar al inicio o final del número
- NO usar dos separadores consecutivos
- NO usar después del punto decimal en la parte fraccionaria
- NO usar en parte exponencial

#### WHY
- Mejora dramáticamente la legibilidad de números grandes
- Reduce errores al copiar/escribir valores numéricos
- Facilita la comparación visual de valores

#### ✅ Código Correcto
```javascript
// Miles
const population = 8_000_000_000;  // 8 mil millones
const salary = 75_000;             // 75 mil

// Binarios (agrupados por bytes)
const permissions = 0b1101_0100_1111_0000;
const mask = 0b1111_0000;

// Hexadecimales (agrupados por palabras)
const color = 0xFF_66_33;          // RGB
const memoryAddress = 0xABCD_EF00;

// Octales
const fileMode = 0o755;
const fileModeLong = 0o000_111_101_101;

// Decimales grandes
const creditCard = 4532_1234_5678_9012n; // Con BigInt
const nanoseconds = 1_000_000_000n;

// Números decimales
const pi = 3.141_592_653_589;
```

#### ❌ Anti-patrón del Pasado
```javascript
// Números difíciles de leer
const population = 8000000000;  // ¿Cuántos ceros?
const permissions = 0b1101010011110000; // Difícil de parsear
const color = 0xFF6633;         // ¿Qué byte es qué?

// Comentarios como workaround
const population = 8000000000; // 8,000,000,000

// Strings (pérdida de tipo numérico)
const creditCard = "4532-1234-5678-9012"; // Luego hay que parsear
```

---

### Promise.any

#### MUST
- Usar cuando necesites la PRIMERA promesa que se resuelva exitosamente
- Usar para implementar "race" con fallbacks (ej: múltiples CDNs)
- Usar cuando cualquiera de varias fuentes sea suficiente
- Usar con timeout patterns

#### FORBIDDEN
- NO usar cuando necesites todas las respuestas (usar `Promise.all`)
- NO usar cuando el orden importe (usar `Promise.all` con procesamiento ordenado)
- NO usar sin manejar AggregateError (cuando todas fallan)

#### WHY
- Obtén el primer resultado exitoso rápidamente
- Implementa resiliencia con múltiples proveedores
- Más útil que `Promise.race` para operaciones donde solo importa el éxito

#### ✅ Código Correcto
```javascript
// Fallback a múltiples CDNs
const cdnUrls = [
  'https://cdn1.example.com/lib.js',
  'https://cdn2.example.com/lib.js',
  'https://cdn3.example.com/lib.js'
];

try {
  const response = await Promise.any(
    cdnUrls.map(url => fetch(url))
  );
  const library = await response.text();
} catch (error) {
  // AggregateError: todas las promesas fallaron
  console.error('All CDNs failed:', error.errors);
}

// Timeout pattern
const fetchWithTimeout = (url, timeout) => {
  return Promise.any([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};

// Múltiples fuentes de datos
const user = await Promise.any([
  fetchFromCache(userId),
  fetchFromDatabase(userId),
  fetchFromBackup(userId)
]);

// Procesar AggregateError
try {
  const result = await Promise.any(promises);
} catch (aggregateError) {
  for (const individualError of aggregateError.errors) {
    console.error('Failed:', individualError.message);
  }
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Promise.race incluye rechazos
const result = await Promise.race(promises);
// Si la primera en completarse es un rechazo, falla todo

// Implementación manual compleja
async function firstSuccess(promises) {
  const errors = [];
  let completed = 0;
  
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise)
        .then(resolve)
        .catch(error => {
          errors.push(error);
          completed++;
          if (completed === promises.length) {
            reject(new AggregateError(errors));
          }
        });
    });
  });
}
```

---

### Logical Assignment Operators

#### MUST
- Usar `||=` para asignar solo si el valor es falsy
- Usar `&&=` para asignar solo si el valor es truthy
- Usar `??=` para asignar solo si el valor es nullish
- Usar para inicialización lazy de propiedades y cachés

#### FORBIDDEN
- NO usar `||=` cuando `0`, `false` o `""` sean valores válidos (usar `??=`)
- NO usar para side effects complejos (mantener claridad)
- NO usar en expresiones complejas que reduzcan legibilidad

#### WHY
- Sintaxis concisa y expresiva
- Elimina repetición de la variable
- Comportamiento consistente con los operadores lógicos

#### ✅ Código Correcto
```javascript
// ||= (OR assignment)
// Asigna si el valor es falsy
function createUser(config) {
  config.name ||= "Anonymous";      // Solo si name es falsy
  config.active ||= true;           // Solo si active es falsy
  return config;
}

// Inicialización lazy
class DataProcessor {
  get expensiveData() {
    return this._data ||= this.computeExpensiveData();
  }
}

// &&= (AND assignment)
// Asigna si el valor es truthy
user.permissions &&= user.permissions.filter(p => p.isValid);

// Solo actualiza si ya existe
obj.value &&= transform(obj.value);

// ??= (Nullish assignment)
// Asigna solo si es null o undefined (mejor para defaults)
function configure(options) {
  options.timeout ??= 5000;         // 0 es válido, no se sobreescribe
  options.retries ??= 3;            // false es válido
  options.name ??= "default";       // "" es válido
  return options;
}

// Caché simple
const cache = {};
function getData(key) {
  return cache[key] ??= fetchData(key);
}

// API key con fallback
const config = {
  apiKey: process.env.API_KEY ??= loadFromFile()
};
```

#### ❌ Anti-patrón del Pasado
```javascript
// Verbosión clásica
function createUser(config) {
  config.name = config.name || "Anonymous";
  config.active = config.active || true;
  return config;
}

// Inicialización lazy verbosa
get expensiveData() {
  if (!this._data) {
    this._data = this.computeExpensiveData();
  }
  return this._data;
}

// Nullish check manual
options.timeout = options.timeout !== undefined ? options.timeout : 5000;
```

---

### String.prototype.replaceAll

#### MUST
- Usar para reemplazar TODAS las ocurrencias de un string
- Usar cuando el patrón es un string literal (no regex)
- Usar para mayor claridad sobre intención
- Usar para evitar escapes de regex innecesarios

#### FORBIDDEN
- NO usar con expresiones regulares (usar `replace` con flag global)
- NO usar cuando solo necesites reemplazar la primera ocurrencia (usar `replace`)
- NO usar para reemplazos complejos que requieran función de callback

#### WHY
- Claridad de intención: "quiero reemplazar todo"
- Evita bugs por olvidar el flag global en regex
- No requiere escapar caracteres especiales de regex

#### ✅ Código Correcto
```javascript
// Reemplazo simple de todas las ocurrencias
const sanitized = userInput.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

// Limpiar espacios múltiples
const cleanText = text.replaceAll('  ', ' ');

// Formateo de templates
const template = "Hello {name}, welcome to {place}";
const message = template
  .replaceAll('{name}', user.name)
  .replaceAll('{place}', company.name);

// Escapar caracteres especiales sin regex
const escaped = filename.replaceAll('.', '_');

// Normalizar saltos de línea
const normalized = content.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

// Reemplazar múltiples strings
const clean = text
  .replaceAll('foo', 'bar')
  .replaceAll('baz', 'qux');
```

#### ❌ Anti-patrón del Pasado
```javascript
// Regex con flag global (propenso a errores)
const sanitized = userInput.replace(/</g, '&lt;');
// Si olvidas 'g', solo reemplaza la primera

// Escapes complejos necesarios
const escaped = filename.replace(/\./g, '_');
// El punto en regex significa "cualquier caracter"

// Split + Join (hack feo)
const result = text.split('foo').join('bar');

// Bucle manual
let result = text;
while (result.includes('foo')) {
  result = result.replace('foo', 'bar');
}
```

---

## ES2022

### Class Fields y Private Methods

#### MUST
- Usar campos públicos para propiedades que deben existir en la instancia
- Usar campos privados (`#`) para encapsulación real
- Usar métodos privados para lógica interna de la clase
- Usar static fields/methods para utilidades de clase
- Usar static blocks para inicialización compleja de statics

#### FORBIDDEN
- NO usar campos privados para propiedades que necesiten ser accesibles externamente
- NO intentar acceder a campos privados desde fuera de la clase (no funciona)
- NO usar `_prefijo` como "privado" (solo convención, no encapsulación real)
- NO usar campos privados en objetos literales (no soportado)

#### WHY
- Encapsulación real a nivel de lenguaje (no convención)
- No accesible ni siquiera con reflection
- Syntax más limpia que closures
- Static blocks permiten inicialización compleja

#### ✅ Código Correcto
```javascript
// Campos públicos
class User {
  name = "Anonymous";           // Inicialización inline
  createdAt = new Date();
  
  constructor(name) {
    if (name) this.name = name;
  }
}

// Campos privados (#)
class BankAccount {
  #balance = 0;                 // Privado real
  #transactions = [];
  
  deposit(amount) {
    this.#balance += amount;
    this.#transactions.push({ type: 'deposit', amount });
  }
  
  get balance() {
    return this.#balance;
  }
  
  #validate() {                 // Método privado
    return this.#balance >= 0;
  }
}

// Statics
class Config {
  static DEFAULT_TIMEOUT = 5000;
  static instances = 0;
  
  static {
    // Static initialization block
    this.instances = parseInt(localStorage.getItem('instances') || '0');
  }
  
  static increment() {
    this.instances++;
    localStorage.setItem('instances', this.instances);
  }
}

// Private accessors
class Temperature {
  #celsius = 0;
  
  get #fahrenheit() {
    return this.#celsius * 9/5 + 32;
  }
  
  set #fahrenheit(value) {
    this.#celsius = (value - 32) * 5/9;
  }
  
  get celsius() { return this.#celsius; }
  get fahrenheit() { return this.#fahrenheit; }
}

// Private static
class Singleton {
  static #instance;
  
  static getInstance() {
    return this.#instance ??= new Singleton();
  }
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// "Privado" por convención (no es privado real)
class BankAccount {
  constructor() {
    this._balance = 0;        // Puede accederse externamente
    this._transactions = [];
  }
}

// Encapsulación con closures (verbose)
function createBankAccount() {
  let balance = 0;            // Privado por closure
  let transactions = [];
  
  return {
    deposit(amount) {
      balance += amount;
      transactions.push({ type: 'deposit', amount });
    },
    getBalance() {
      return balance;
    }
  };
}

// WeakMap para privacidad (complejo)
const _balance = new WeakMap();
class BankAccount {
  constructor() {
    _balance.set(this, 0);
  }
  deposit(amount) {
    _balance.set(this, _balance.get(this) + amount);
  }
}
```

---

### Array.prototype.at()

#### MUST
- Usar para acceder a elementos desde el final del array
- Usar para acceso indexado más legible que bracket notation
- Usar en cadenas de método donde bracket notation es difícil
- Usar para consistencia con String.at()

#### FORBIDDEN
- NO usar para acceso simple al principio (bracket notation es más corto)
- NO usar cuando el índice es calculado y puede ser fuera de rango sin manejo
- NO usar en hot paths donde el micro-performance sea crítico (mínima diferencia)

#### WHY
- Acceso negativo intuitivo: `arr.at(-1)` vs `arr[arr.length - 1]`
- Método encadenable en pipelines
- Consistente con String.at()
- Más expresivo para "último elemento"

#### ✅ Código Correcto
```javascript
// Último elemento
const last = array.at(-1);
// vs array[array.length - 1]

// Penúltimo
const secondLast = array.at(-2);

// En cadenas de métodos
const result = someArray
  .filter(x => x.active)
  .map(x => x.name)
  .at(-1);              // Último nombre activo

// Con string
const lastChar = "Hello".at(-1); // "o"

// Acceso dinámico desde el final
const nthFromEnd = (arr, n) => arr.at(-n);

// Comparaciones
const first = array.at(0);   // Equivalente a array[0]
const last = array.at(-1);   // Mucho mejor que array[array.length - 1]

// TypeScript con narrowing
const item = array.at(-1);
if (item) {  // TypeScript sabe que puede ser undefined
  process(item);
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Acceso al último verboso
const last = array[array.length - 1];

// Con slice (crea copia innecesaria)
const last = array.slice(-1)[0];

// Con destructuring (hack)
const [last] = [...array].reverse();

// Con pop (muta el array)
const last = [...array].pop();
```

---

### Object.hasOwn

#### MUST
- Usar para verificar si una propiedad es propia (no heredada)
- Usar como reemplazo de `Object.prototype.hasOwnProperty.call()`
- Usar para validaciones de seguridad en objetos
- Usar cuando el objeto pueda tener `hasOwnProperty` sobrescrito

#### FORBIDDEN
- NO usar para verificar propiedades heredadas (usar `in` operator)
- NO usar para verificar si un valor existe (usar `!== undefined` con cuidado)
- NO usar para arrays (usar `Array.prototype.includes` o `indexOf`)

#### WHY
- No requiere `call()` para evitar problemas con objetos que tienen `hasOwnProperty`
- Más seguro que el método del prototype
- Sintaxis más limpia y moderna

#### ✅ Código Correcto
```javascript
// Verificación segura de propiedad propia
const obj = { foo: 'bar' };
Object.hasOwn(obj, 'foo');        // true
Object.hasOwn(obj, 'toString');   // false (heredado)

// Seguro incluso con objetos problemáticos
const tricky = {
  hasOwnProperty: 'evil',
  realProp: 'value'
};
Object.hasOwn(tricky, 'realProp');     // true
Object.hasOwn(tricky, 'hasOwnProperty'); // true

// Object.prototype.hasOwnProperty.call(tricky, 'realProp'); 
// Esto funciona pero es más verboso

// Iteración segura de propiedades propias
for (const key in obj) {
  if (Object.hasOwn(obj, key)) {
    console.log(key, obj[key]);
  }
}

// TypeScript: narrowing
if (Object.hasOwn(data, 'requiredField')) {
  // TypeScript sabe que requiredField existe
  process(data.requiredField);
}

// Object.create(null) - objetos sin prototype
const dict = Object.create(null);
dict.key = 'value';
Object.hasOwn(dict, 'key');  // true
// dict.hasOwnProperty no existe
```

#### ❌ Anti-patrón del Pasado
```javascript
// Problema: objeto con hasOwnProperty sobrescrito
const obj = { hasOwnProperty: 'oops' };
obj.hasOwnProperty('key');  // TypeError: obj.hasOwnProperty is not a function

// Solución verbosa pero segura
Object.prototype.hasOwnProperty.call(obj, 'key');

// Otra forma segura pero menos clara
({}).hasOwnProperty.call(obj, 'key');

// in operator incluye propiedades heredadas
'hasOwnProperty' in obj;  // true (heredado de Object.prototype)
```

---

### Error Cause

#### MUST
- Usar para encadenar errores y preservar el contexto original
- Usar en librerías que envuelven errores de bajo nivel
- Usar para proporcionar información adicional sin perder el stack original
- Usar para debugging de errores en operaciones compuestas

#### FORBIDDEN
- NO usar cause para errores que no están relacionados con otro error
- NO perder información del error original al crear el nuevo
- NO usar solo para mensajes adicionales (usar el mensaje principal)

#### WHY
- Preserva el stack trace completo de la causa raíz
- Facilita el debugging de errores en capas de abstracción
- Estándar de la plataforma, soportado por herramientas de debugging
- Mejor que simplemente adjuntar el error como propiedad

#### ✅ Código Correcto
```javascript
// Encadenamiento de errores
class DatabaseError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'DatabaseError';
  }
}

async function query(sql) {
  try {
    return await db.execute(sql);
  } catch (originalError) {
    throw new DatabaseError(
      `Failed to execute query: ${sql}`,
      { cause: originalError }
    );
  }
}

// Catching y accediendo a la causa
try {
  await query('SELECT * FROM users');
} catch (error) {
  console.error('Error:', error.message);
  console.error('Caused by:', error.cause?.message);
  console.error('Original stack:', error.cause?.stack);
}

// Múltiples niveles de anidamiento
async function fetchUserData() {
  try {
    return await query('SELECT * FROM users WHERE id = ?', [id]);
  } catch (dbError) {
    throw new ApplicationError(
      'Could not retrieve user data',
      { cause: dbError }
    );
  }
}

// Custom error classes con cause
class ValidationError extends Error {
  constructor(message, { field, cause } = {}) {
    super(message, { cause });
    this.name = 'ValidationError';
    this.field = field;
  }
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Perder el error original
try {
  await db.execute(sql);
} catch (error) {
  throw new Error('Query failed'); // Se pierde el error original
}

// Adjuntar como propiedad (no estándar)
try {
  await db.execute(sql);
} catch (originalError) {
  const newError = new Error('Query failed');
  newError.originalError = originalError;
  throw newError;
}

// Mensaje concatenado (difícil de parsear)
try {
  await db.execute(sql);
} catch (error) {
  throw new Error(`Query failed: ${error.message}`);
}
```

---

## ES2023

### Array.findLast / findLastIndex

#### MUST
- Usar para encontrar el último elemento que cumple una condición
- Usar cuando necesites buscar desde el final sin mutar el array
- Usar para casos donde el orden inverso importa
- Usar como reemplazo de `reverse().find()` que no muta

#### FORBIDDEN
- NO usar cuando `find()` (desde el principio) sea suficiente
- NO usar para búsquedas simples donde un bucle inverso sea más claro
- NO usar en arrays extremadamente grandes sin considerar performance

#### WHY
- Más eficiente que `reverse().find()` (no crea copia)
- Intención clara: "quiero el último que cumple"
- No muta el array original
- findLastIndex permite obtener la posición

#### ✅ Código Correcto
```javascript
// Encontrar último elemento par
const numbers = [1, 2, 3, 4, 5, 6];
const lastEven = numbers.findLast(n => n % 2 === 0);  // 6

// Encontrar último índice
const lastEvenIndex = numbers.findLastIndex(n => n % 2 === 0);  // 5

// Caso de uso: historial de navegación
const history = [
  { page: '/home', timestamp: 1 },
  { page: '/products', timestamp: 2 },
  { page: '/home', timestamp: 3 },
  { page: '/contact', timestamp: 4 }
];
const lastHomeVisit = history.findLast(h => h.page === '/home');

// Logs: último error
const logs = [
  { level: 'info', msg: 'started' },
  { level: 'error', msg: 'fail1' },
  { level: 'info', msg: 'recovered' },
  { level: 'error', msg: 'fail2' }
];
const lastError = logs.findLast(log => log.level === 'error');

// TypeScript: narrowing correcto
const found = array.findLast(item => item.id === targetId);
if (found) {  // TypeScript sabe que puede ser T | undefined
  process(found);
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Reverse muta el array (¡cuidado!)
const lastEven = [...numbers].reverse().find(n => n % 2 === 0);
// Necesitamos spread para no mutar original

// Bucle manual
let lastEven;
for (let i = numbers.length - 1; i >= 0; i--) {
  if (numbers[i] % 2 === 0) {
    lastEven = numbers[i];
    break;
  }
}

// Reduce (sobreingeniería)
const lastEven = numbers.reduce((acc, n) => 
  n % 2 === 0 ? n : acc, undefined
);
```

---

### Array.toSorted / toReversed / toSpliced / with

#### MUST
- Usar para operaciones inmutables en arrays
- Usar `toSorted()` para ordenar sin mutar el original
- Usar `toReversed()` para invertir sin mutar
- Usar `toSpliced()` para eliminar/insertar sin mutar
- Usar `with()` para reemplazar un elemento en un índice específico

#### FORBIDDEN
- NO usar cuando la mutación sea intencional y aceptable
- NO usar en código crítico de performance sin benchmarking
- NO usar `toSpliced()` con muchos elementos sin considerar memoria
- NO usar `with()` para actualizaciones múltiples (considerar otra estructura)

#### WHY
- Inmutabilidad por defecto (menos bugs)
- Facilita patrones funcionales
- Compatible con React/Redux sin spread operators complejos
- Más claro que crear copias manualmente

#### ✅ Código Correcto
```javascript
const original = [3, 1, 4, 1, 5];

// toSorted - ordenar sin mutar
const sorted = original.toSorted((a, b) => a - b);
// original: [3, 1, 4, 1, 5]
// sorted: [1, 1, 3, 4, 5]

// toReversed - invertir sin mutar
const reversed = original.toReversed();
// reversed: [5, 1, 4, 1, 3]

// toSpliced - eliminar/insertar sin mutar
const spliced = original.toSpliced(1, 2, 9, 9);
// Elimina 2 elementos desde índice 1, inserta 9, 9
// spliced: [3, 9, 9, 1, 5]

// with - reemplazar en índice específico
const replaced = original.with(2, 999);
// replaced: [3, 1, 999, 1, 5]

// React: actualizar estado inmutable
function updateItem(index, newValue) {
  setItems(prev => prev.with(index, newValue));
}

// Redux: reducer inmutable
function reducer(state, action) {
  switch (action.type) {
    case 'SORT_ITEMS':
      return { ...state, items: state.items.toSorted() };
    case 'REVERSE_ITEMS':
      return { ...state, items: state.items.toReversed() };
    default:
      return state;
  }
}

// Composición
const result = original
  .toSorted((a, b) => a - b)
  .toReversed()
  .with(0, 100);
```

#### ❌ Anti-patrón del Pasado
```javascript
// Mutación accidental (bug común)
const sorted = original.sort(); // ¡Muta original!

// Spread para inmutabilidad (verboso)
const sorted = [...original].sort((a, b) => a - b);
const reversed = [...original].reverse();
const spliced = [...original.slice(0, 1), ...[9, 9], ...original.slice(3)];
const replaced = original.map((item, i) => i === 2 ? 999 : item);

// Slice + métodos (confuso)
const reversed = original.slice().reverse();
```

---

### Hashbang Grammar

#### MUST
- Usar para scripts ejecutables de Node.js
- Usar `#!/usr/bin/env node` para portabilidad
- Usar al inicio del archivo, antes de cualquier otro código
- Usar para CLI tools publicados en npm

#### FORBIDDEN
- NO usar en archivos que no sean ejecutables
- NO usar en librerías importables (solo entry points)
- NO usar en archivos de configuración
- NO usar caracteres antes del hashbang

#### WHY
- Estándar ECMAScript para scripts ejecutables
- Portabilidad entre sistemas Unix-like
- Funciona en Node.js y deno sin comentario
- No requiere configuración externa

#### ✅ Código Correcto
```javascript
#!/usr/bin/env node
// cli-tool.js
import { program } from 'commander';

program
  .name('my-cli')
  .description('A CLI tool')
  .version('1.0.0');

program.parse();
```

```javascript
#!/usr/bin/env -S node --experimental-modules
// Con flags de Node.js
```

#### ❌ Anti-patrón del Pasado
```javascript
// Sin hashbang - requiere llamar explícitamente
// node cli-tool.js

// Usar shell wrapper
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")
node "$basedir/cli-tool.js" "$@"
```

---

## ES2024

### Object.groupBy / Map.groupBy

#### MUST
- Usar `Object.groupBy` para agrupar por categorías con keys string/symbol
- Usar `Map.groupBy` para keys de cualquier tipo (incluyendo objetos)
- Usar para reemplazar manual reduce() de agrupación
- Usar para categorización de datos

#### FORBIDDEN
- NO usar `Object.groupBy` cuando las keys no sean strings o symbols
- NO usar para agrupaciones donde el orden de keys importe (usar Map)
- NO usar en hot paths sin considerar que crea objetos/arrays
- NO usar cuando Map sea más apropiado (keys no string)

#### WHY
- Elimina código de agrupación repetitivo
- Más legible que reduce manual
- Optimizado por el motor
- Map.groupBy permite keys de cualquier tipo

#### ✅ Código Correcto
```javascript
// Object.groupBy - keys son strings
const inventory = [
  { name: 'asparagus', type: 'vegetables', quantity: 9 },
  { name: 'bananas', type: 'fruit', quantity: 5 },
  { name: 'goat', type: 'meat', quantity: 23 },
  { name: 'cherries', type: 'fruit', quantity: 12 },
  { name: 'fish', type: 'meat', quantity: 22 }
];

const byType = Object.groupBy(inventory, ({ type }) => type);
// {
//   vegetables: [{ name: 'asparagus', ... }],
//   fruit: [{ name: 'bananas', ... }, { name: 'cherries', ... }],
//   meat: [{ name: 'goat', ... }, { name: 'fish', ... }]
// }

// Agrupación por condición
const inStock = Object.groupBy(
  inventory, 
  ({ quantity }) => quantity > 10 ? 'restock' : 'sufficient'
);

// Map.groupBy - keys pueden ser cualquier cosa
const people = [
  { name: 'Alice', manager: boss1 },
  { name: 'Bob', manager: boss1 },
  { name: 'Carol', manager: boss2 }
];

const byManager = Map.groupBy(people, ({ manager }) => manager);
// Map con boss1 -> [Alice, Bob], boss2 -> [Carol]

// Uso con Map result
for (const [manager, employees] of byManager) {
  console.log(`${manager.name} manages ${employees.length} people`);
}

// Anidación
const grouped = Object.groupBy(
  Object.groupBy(data, x => x.category),
  x => x.subcategory
);
```

#### ❌ Anti-patrón del Pasado
```javascript
// Reduce manual (verboso)
const byType = inventory.reduce((acc, item) => {
  const key = item.type;
  if (!acc[key]) acc[key] = [];
  acc[key].push(item);
  return acc;
}, {});

// For...of manual
const byType = {};
for (const item of inventory) {
  const key = item.type;
  if (!byType[key]) byType[key] = [];
  byType[key].push(item);
}

// Lodash (dependencia externa)
const byType = _.groupBy(inventory, 'type');
```

---

### Promise.withResolvers

#### MUST
- Usar cuando necesites resolver/rejectar una Promise desde fuera de su constructor
- Usar para exponer controles de Promise en APIs
- Usar para testing de código asíncrono
- Usar para sincronización compleja entre componentes

#### FORBIDDEN
- NO usar cuando new Promise() sea suficiente
- NO usar para evitar el patrón callback en APIs simples
- NO dejar Promises sin resolver/rejectar (memory leaks)

#### WHY
- Elimina necesidad de variables externas
- Más limpio que el patrón `let resolve, reject`
- Estandariza un patrón común
- Útil para arquitecturas de control

#### ✅ Código Correcto
```javascript
// Crear deferred promise
const { promise, resolve, reject } = Promise.withResolvers();

// API con control externo
class TaskQueue {
  constructor() {
    this.currentTask = null;
  }
  
  enqueue(task) {
    const { promise, resolve, reject } = Promise.withResolvers();
    
    this.queue.push({ task, resolve, reject });
    this.processQueue();
    
    return promise;
  }
  
  cancelAll() {
    this.queue.forEach(({ reject }) => 
      reject(new Error('Cancelled'))
    );
    this.queue = [];
  }
}

// Testing: control manual de tiempos
function createControlledPromise() {
  const controllers = Promise.withResolvers();
  return {
    promise: controllers.promise,
    resolve: controllers.resolve,
    reject: controllers.reject,
    isResolved: false
  };
}

// Synchronizer
function createSynchronizer() {
  const sync = Promise.withResolvers();
  return {
    wait: () => sync.promise,
    signal: () => sync.resolve(),
    reset: () => {
      const next = Promise.withResolvers();
      sync.resolve(next.promise);
      Object.assign(sync, next);
    }
  };
}

// Timeout wrapper
function withTimeout(promise, ms) {
  const { promise: timeoutPromise, resolve, reject } = Promise.withResolvers();
  
  const timeoutId = setTimeout(() => {
    reject(new Error(`Timeout after ${ms}ms`));
  }, ms);
  
  promise
    .finally(() => clearTimeout(timeoutId))
    .then(resolve, reject);
    
  return timeoutPromise;
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Variables externas (funciona pero menos limpio)
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

// Objeto contenedor manual
function createDeferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
```

---

### String.isWellFormed / toWellFormed

#### MUST
- Usar `isWellFormed()` para validar strings antes de operaciones Unicode
- Usar `toWellFormed()` para sanitizar strings con surrogates inválidos
- Usar antes de enviar datos a APIs que requieren UTF-16 válido
- Usar para limpiar input de usuario potencialmente corrupto

#### FORBIDDEN
- NO usar en strings que ya se sabe son válidos (overhead innecesario)
- NO usar toWellFormed() como única validación (puede alterar datos)
- NO ignorar el reemplazo con U+FFFD (entender las implicaciones)

#### WHY
- Previene errores en operaciones Unicode
- Sanitización estándar de strings corruptos
- Útil para interop con sistemas que requieren UTF-16 válido

#### ✅ Código Correcto
```javascript
// Validar string
const good = "Hello";
const bad = "Hello \uD800"; // Surrogate isolate inválido

good.isWellFormed();  // true
bad.isWellFormed();   // false

// Sanitizar
const sanitized = bad.toWellFormed();
// "Hello \uFFFD" (replacement character)

// Uso defensivo
function processText(input) {
  if (!input.isWellFormed()) {
    console.warn('Input contained invalid surrogates');
    input = input.toWellFormed();
  }
  return sendToAPI(input);
}

// Antes de operaciones Unicode
function safeEncode(str) {
  if (!str.isWellFormed()) {
    throw new Error('Invalid UTF-16 string');
  }
  return new TextEncoder().encode(str);
}

// Limpieza de datos de usuario
function sanitizeUserInput(input) {
  return input.toWellFormed();
}
```

#### ❌ Anti-patrón del Pasado
```javascript
// Regex para detectar surrogates (incompleto)
const hasLoneSurrogate = /[\uD800-\uDFFF]/;
// No detecta específicamente pares inválidos

// Try-catch con encodeURIComponent
try {
  encodeURIComponent(str);
  return true;
} catch {
  return false;
}

// Manual replacement
function toWellFormedManual(str) {
  return str.replace(/[\uD800-\uDFFF]/g, '\uFFFD');
}
// No maneja correctamente surrogates de alta solos vs pares
```

---

## TypeScript 5.x Features

### Decorators Estándar (Stage 3)

#### MUST
- Usar para metadatos y anotaciones
- Usar para inyección de dependencias
- Usar para logging y profiling
- Usar para validación de parámetros
- Usar con `experimentalDecorators: false` en TS 5.x

#### FORBIDDEN
- NO mezclar decoradores legacy con estándar
- NO usar para lógica de negocio compleja
- NO usar donde la composición simple sea suficiente

#### WHY
- Estándar ECMAScript (no experimental)
- Mejor performance que legacy
- Metadata estándar (proposal en progreso)

#### ✅ Código Correcto
```typescript
// Decorador de clase
function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function(this: This, ...args: Args): Return {
    console.log(`Calling ${String(context.name)}`);
    return target.call(this, ...args);
  };
}

// Decorador de campo
function readonly<This, Value>(
  target: undefined,
  context: ClassFieldDecoratorContext<This, Value>
) {
  return function(this: This, value: Value): Value {
    Object.defineProperty(this, context.name, {
      value,
      writable: false,
      configurable: true
    });
    return value;
  };
}

// Uso
class User {
  @readonly id: string = crypto.randomUUID();
  
  @logged
  greet() {
    return `Hello, ${this.id}`;
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "experimentalDecorators": false,
    "target": "ES2022"
  }
}
```

---

### const Type Parameters

#### MUST
- Usar para inferencia más literal de tipos
- Usar en APIs donde la literalidad importa
- Usar para evitar `as const` en llamadas
- Usar en generic constraints

#### WHY
- Inferencia más precisa sin `as const`
- Mejor DX en APIs de configuración
- Evita widening innecesario

#### ✅ Código Correcto
```typescript
// Sin const: type inferido como string[]
function createArray<T>(items: readonly T[]): T[] {
  return [...items];
}
const arr1 = createArray(['a', 'b']); // string[]

// Con const: type inferido como literal
function createArrayConst<const T>(items: readonly T[]): T[] {
  return [...items];
}
const arr2 = createArrayConst(['a', 'b']); // ["a", "b"]

// Útil para rutas/configuraciones
type Route<T extends string> = { path: T };
function defineRoutes<const T extends string>(routes: Route<T>[]) {
  return routes;
}

const routes = defineRoutes([
  { path: '/home' },
  { path: '/about' }
]);
// T inferido como "/home" | "/about"
```

---

### satisfies Operator

#### MUST
- Usar para validar tipos sin cambiar el tipo inferido
- Usar para object literals con propiedades extra
- Usar para mantener literalidad mientras se valida
- Usar en configuraciones que necesiten inferencia precisa

#### WHY
- Validación de tipos sin widening
- Mejor que `as` (no fuerza el tipo)
- Mantiene autocompletado preciso

#### ✅ Código Correcto
```typescript
type Color = 'red' | 'green' | 'blue';
type RGB = [number, number, number];

const palette = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
} satisfies Record<Color, RGB>;

// palette.red es [number, number, number] (no RGB)
// Pero valida que todas las keys de Color existan

// vs as const (más restrictivo)
const paletteConst = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  blue: [0, 0, 255],
} as const satisfies Record<Color, RGB>;
// paletteConst.red es [255, 0, 0] (literal exacto)

// Error si falta una key
const badPalette = {
  red: [255, 0, 0],
  green: [0, 255, 0],
  // Error: falta 'blue'
} satisfies Record<Color, RGB>;
```

---

## Directrices de Aplicación

### Prioridad de Uso

| Contexto | Prioridad | Feature |
|----------|-----------|---------|
| Acceso seguro anidado | 🔴 Alta | Optional chaining |
| Valores por defecto | 🔴 Alta | Nullish coalescing |
| Encapsulación | 🔴 Alta | Private fields |
| Operaciones batch | 🟡 Media | Promise.allSettled |
| Inmutabilidad arrays | 🟡 Media | toSorted/toReversed |
| Agrupación datos | 🟡 Media | Object.groupBy |
| Números grandes | 🟢 Baja | BigInt |
| Separadores numéricos | 🟢 Baja | Numeric separators |

### Compatibilidad

```javascript
// Verificar soporte antes de usar features muy nuevas
if (typeof Array.prototype.toSorted === 'function') {
  // Usar método nativo
} else {
  // Fallback o polyfill
}

// O usar core-js para polyfills
import 'core-js/actual/array/to-sorted';
```

### Bundle Size

```javascript
// Considerar: features modernas pueden evitar librerías
// ❌ Antes
import _ from 'lodash';
const grouped = _.groupBy(items, 'category');

// ✅ Después (ES2024)
const grouped = Object.groupBy(items, ({ category }) => category);
```

---

## Checklist de Revisión

- [ ] ¿Se usa `??` en lugar de `||` para valores por defecto?
- [ ] ¿Se usa `?.` para acceso seguro a propiedades anidadas?
- [ ] ¿Se usa `#` para verdadera encapsulación en clases?
- [ ] ¿Se usan métodos inmutables (`toSorted`) en lugar de mutadores (`sort`)?
- [ ] ¿Se usa `Object.hasOwn` en lugar de `hasOwnProperty.call`?
- [ ] ¿Se usa `Promise.allSettled` para operaciones batch independientes?
- [ ] ¿Se evita el uso innecesario de librerías externas para features nativas?
- [ ] ¿Se usa `globalThis` para código universal?
- [ ] ¿Se usan separadores numéricos para números grandes?
- [ ] ¿Se usan campos privados en lugar de `_prefijo`?

---

## Referencias

- [TC39 Proposals](https://github.com/tc39/proposals)
- [MDN JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [TypeScript Release Notes](https://www.typescriptlang.org/docs/handbook/release-notes.html)
- [Can I Use](https://caniuse.com/)
