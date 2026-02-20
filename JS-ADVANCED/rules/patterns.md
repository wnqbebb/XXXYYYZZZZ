---
name: patterns
description: Design patterns and code architecture patterns for JavaScript
tags: [patterns, architecture, oop, functional]
version: 1.0.0
---

# Patrones de Diseño JavaScript

## 1. CREATIONAL PATTERNS

### Module Pattern
- **MUST**: Usar ES6 modules con import/export
- **MUST**: Encapsular lógica privada con closures
- **FORBIDDEN**: Variables globales
- **WHY**: Mantiene el namespace limpio y permite tree-shaking

```typescript
// ✅ CORRECTO
export const createCounter = () => {
  let count = 0; // Privado por closure
  
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
};

// ❌ INCORRECTO
let globalCount = 0; // Expuesto globalmente
export function increment() { globalCount++; }
```

### Singleton Pattern
- **MUST**: Implementar con ES6 modules (ya son singletons)
- **FORBIDDEN**: Implementaciones complejas de Singleton innecesarias
- **WHY**: Los módulos ES6 se evalúan una sola vez, son singletons nativos

```typescript
// ✅ CORRECTO - Módulo ES6 ya es singleton
// config.ts
export const config = {
  apiUrl: process.env.API_URL,
  timeout: 5000,
  retries: 3
};

// Uso en múltiples archivos
import { config } from './config'; // Misma instancia siempre

// ❌ INCORRECTO - Implementación manual innecesaria
class ConfigSingleton {
  private static instance: ConfigSingleton;
  
  private constructor() {}
  
  static getInstance(): ConfigSingleton {
    if (!ConfigSingleton.instance) {
      ConfigSingleton.instance = new ConfigSingleton();
    }
    return ConfigSingleton.instance;
  }
}
```

### Factory Pattern
- **MUST**: Usar cuando necesitas crear objetos sin especificar la clase exacta
- **MUST**: Definir interfaces comunes para todos los productos
- **WHY**: Permite agregar nuevos tipos sin modificar código existente (Open/Closed Principle)

```typescript
// ✅ CORRECTO
interface Notification {
  send(message: string, recipient: string): void;
}

class EmailNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Email to ${recipient}: ${message}`);
  }
}

class SMSNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`SMS to ${recipient}: ${message}`);
  }
}

class PushNotification implements Notification {
  send(message: string, recipient: string): void {
    console.log(`Push to ${recipient}: ${message}`);
  }
}

type NotificationType = 'email' | 'sms' | 'push';

export const createNotification = (type: NotificationType): Notification => {
  const factories: Record<NotificationType, () => Notification> = {
    email: () => new EmailNotification(),
    sms: () => new SMSNotification(),
    push: () => new PushNotification()
  };
  
  const factory = factories[type];
  if (!factory) throw new Error(`Unknown type: ${type}`);
  
  return factory();
};

// Uso
const notifier = createNotification('email');
notifier.send('Hello', 'user@example.com');

// ❌ INCORRECTO - Condicionales dispersos por el código
function sendNotification(type: string, message: string, recipient: string) {
  if (type === 'email') {
    // lógica específica de email
  } else if (type === 'sms') {
    // lógica específica de sms
  } else if (type === 'push') {
    // lógica específica de push
  }
}
```

### Builder Pattern
- **MUST**: Usar para objetos complejos con muchos parámetros opcionales
- **MUST**: Proveer métodos encadenables (fluent interface)
- **MUST**: Validar el objeto al final con build()
- **WHY**: Mejor legibilidad, evita constructores con múltiples parámetros

```typescript
// ✅ CORRECTO
interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

class UserProfileBuilder {
  private profile: Partial<UserProfile> = {};
  
  withId(id: string): this {
    this.profile.id = id;
    return this;
  }
  
  withEmail(email: string): this {
    this.profile.email = email;
    return this;
  }
  
  withName(firstName: string, lastName: string): this {
    this.profile.firstName = firstName;
    this.profile.lastName = lastName;
    return this;
  }
  
  withAvatar(avatar: string): this {
    this.profile.avatar = avatar;
    return this;
  }
  
  withPreferences(theme: 'light' | 'dark', notifications: boolean): this {
    this.profile.preferences = { theme, notifications };
    return this;
  }
  
  build(): UserProfile {
    if (!this.profile.id || !this.profile.email) {
      throw new Error('ID and email are required');
    }
    return this.profile as UserProfile;
  }
}

// Uso fluido y legible
const user = new UserProfileBuilder()
  .withId('123')
  .withEmail('john@example.com')
  .withName('John', 'Doe')
  .withPreferences('dark', true)
  .build();

// ❌ INCORRECTO - Constructor con múltiples parámetros opcionales
class UserProfileBad {
  constructor(
    id: string,
    email: string,
    firstName?: string,
    lastName?: string,
    avatar?: string,
    preferences?: object,
    // ... más parámetros
  ) {}
}

// Llamada confusa - qué es cada parámetro?
const userBad = new UserProfileBad('123', 'john@example.com', 'John', 'Doe', undefined, { theme: 'dark' });
```

---

## 2. STRUCTURAL PATTERNS

### Adapter Pattern
- **MUST**: Usar para compatibilidad entre interfaces incompatibles
- **MUST**: Mantener la interfaz esperada por el cliente
- **WHY**: Permite integrar código legacy sin modificarlo, facilita integración de APIs de terceros

```typescript
// ✅ CORRECTO
// Interfaz esperada por nuestra aplicación
interface PaymentProcessor {
  processPayment(amount: number, currency: string): Promise<string>;
  refund(transactionId: string): Promise<void>;
}

// API de Stripe (interfaz incompatible)
interface StripeAPI {
  createCharge(params: { amount: number; currency: string }): Promise<{ id: string }>;
  createRefund(chargeId: string): Promise<void>;
}

// API de PayPal (interfaz diferente)
interface PayPalAPI {
  executePayment(amount: number, currencyCode: string): Promise<{ transactionId: string }>;
  reverseTransaction(transactionId: string): Promise<void>;
}

// Adapter para Stripe
class StripeAdapter implements PaymentProcessor {
  constructor(private stripe: StripeAPI) {}
  
  async processPayment(amount: number, currency: string): Promise<string> {
    const result = await this.stripe.createCharge({ amount, currency });
    return result.id;
  }
  
  async refund(transactionId: string): Promise<void> {
    await this.stripe.createRefund(transactionId);
  }
}

// Adapter para PayPal
class PayPalAdapter implements PaymentProcessor {
  constructor(private paypal: PayPalAPI) {}
  
  async processPayment(amount: number, currency: string): Promise<string> {
    const result = await this.paypal.executePayment(amount, currency);
    return result.transactionId;
  }
  
  async refund(transactionId: string): Promise<void> {
    await this.paypal.reverseTransaction(transactionId);
  }
}

// Cliente usa la interfaz común
class CheckoutService {
  constructor(private paymentProcessor: PaymentProcessor) {}
  
  async checkout(cart: Cart): Promise<void> {
    const transactionId = await this.paymentProcessor.processPayment(
      cart.total,
      cart.currency
    );
    // ...
  }
}

// ❌ INCORRECTO - Condicionales para manejar diferentes APIs
class BadCheckoutService {
  constructor(
    private stripe?: StripeAPI,
    private paypal?: PayPalAPI
  ) {}
  
  async checkout(cart: Cart, provider: 'stripe' | 'paypal'): Promise<void> {
    if (provider === 'stripe' && this.stripe) {
      await this.stripe.createCharge({ amount: cart.total, currency: cart.currency });
    } else if (provider === 'paypal' && this.paypal) {
      await this.paypal.executePayment(cart.total, cart.currency);
    }
  }
}
```

### Decorator Pattern
- **MUST**: Usar para añadir comportamiento dinámicamente
- **MUST**: Preferir composition sobre inheritance
- **MUST**: Mantener la misma interfaz que el objeto original
- **WHY**: Más flexible que la herencia, permite combinar comportamientos

```typescript
// ✅ CORRECTO
interface DataSource {
  read(): string;
  write(data: string): void;
}

// Componente base
class FileDataSource implements DataSource {
  constructor(private filename: string) {}
  
  read(): string {
    // Leer del archivo
    return fs.readFileSync(this.filename, 'utf-8');
  }
  
  write(data: string): void {
    fs.writeFileSync(this.filename, data);
  }
}

// Decorator base
abstract class DataSourceDecorator implements DataSource {
  constructor(protected wrappee: DataSource) {}
  
  read(): string {
    return this.wrappee.read();
  }
  
  write(data: string): void {
    this.wrappee.write(data);
  }
}

// Decorador concreto: compresión
class CompressionDecorator extends DataSourceDecorator {
  read(): string {
    const compressed = this.wrappee.read();
    return this.decompress(compressed);
  }
  
  write(data: string): void {
    const compressed = this.compress(data);
    this.wrappee.write(compressed);
  }
  
  private compress(data: string): string {
    return zlib.deflateSync(data).toString('base64');
  }
  
  private decompress(data: string): string {
    return zlib.inflateSync(Buffer.from(data, 'base64')).toString();
  }
}

// Decorador concreto: encriptación
class EncryptionDecorator extends DataSourceDecorator {
  read(): string {
    const encrypted = this.wrappee.read();
    return this.decrypt(encrypted);
  }
  
  write(data: string): void {
    const encrypted = this.encrypt(data);
    this.wrappee.write(encrypted);
  }
  
  private encrypt(data: string): string {
    // Lógica de encriptación
    return crypto.encrypt(data);
  }
  
  private decrypt(data: string): string {
    return crypto.decrypt(data);
  }
}

// Uso flexible - podemos combinar decoradores
const source = new EncryptionDecorator(
  new CompressionDecorator(
    new FileDataSource('data.txt')
  )
);

// Escribe: comprime → encripta → guarda
// Lee: lee → desencripta → descomprime
source.write('Sensitive data');
const data = source.read();

// ❌ INCORRECTO - Herencia múltiple y explosión de clases
class EncryptedFileDataSource extends FileDataSource {
  // ... duplica lógica
}

class CompressedFileDataSource extends FileDataSource {
  // ... duplica lógica
}

class EncryptedCompressedFileDataSource extends FileDataSource {
  // ... duplica lógica otra vez
}
```

### Proxy Pattern
- **MUST**: Usar Proxy nativo de ES6 para interceptar operaciones
- **MUST**: Mantener la misma interfaz que el objeto real
- **FORBIDDEN**: Reimplementar Proxy manualmente
- **WHY**: Control de acceso, caching, lazy loading, validación transparente

```typescript
// ✅ CORRECTO
interface UserService {
  getUser(id: string): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
}

class UserServiceImpl implements UserService {
  async getUser(id: string): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
  
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// Proxy de Caching
function createCachingProxy<T extends object>(
  target: T,
  ttlMs: number
): T {
  const cache = new Map<string, { value: unknown; timestamp: number }>();
  
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop as keyof T];
      
      if (typeof value !== 'function') return value;
      
      return async (...args: unknown[]) => {
        const key = `${String(prop)}_${JSON.stringify(args)}`;
        const cached = cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < ttlMs) {
          return cached.value;
        }
        
        const result = await value.apply(obj, args);
        cache.set(key, { value: result, timestamp: Date.now() });
        return result;
      };
    }
  });
}

// Proxy de Validación
function createValidationProxy<T extends object>(
  target: T,
  validators: Record<string, (args: unknown[]) => void>
): T {
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop as keyof T];
      
      if (typeof value !== 'function') return value;
      
      return (...args: unknown[]) => {
        const validator = validators[String(prop)];
        if (validator) {
          validator(args);
        }
        return value.apply(obj, args);
      };
    }
  });
}

// Uso combinado
const userService = createValidationProxy(
  createCachingProxy(new UserServiceImpl(), 60000),
  {
    getUser: ([id]) => {
      if (!id || typeof id !== 'string') {
        throw new Error('ID must be a non-empty string');
      }
    },
    updateUser: ([id, data]) => {
      if (!id) throw new Error('ID is required');
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Update data is required');
      }
    }
  }
);

// ❌ INCORRECTO - Reimplementación manual del proxy
class BadUserServiceProxy implements UserService {
  private service: UserServiceImpl;
  private cache = new Map();
  
  constructor() {
    this.service = new UserServiceImpl();
  }
  
  async getUser(id: string): Promise<User> {
    // Verificar cache manualmente
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    const user = await this.service.getUser(id);
    this.cache.set(id, user);
    return user;
  }
  
  async updateUser(id: string, data: Partial<User>): Promise<User> {
    // Lógica duplicada por cada método
    return this.service.updateUser(id, data);
  }
}
```

### Facade Pattern
- **MUST**: Proveer interfaz simplificada a subsistemas complejos
- **MUST**: No ocultar funcionalidad avanzada cuando sea necesaria
- **WHY**: Reduce complejidad, mejora legibilidad, facilita el uso de APIs complejas

```typescript
// ✅ CORRECTO
// Subsistema complejo: Múltiples servicios
class AuthenticationService {
  async login(credentials: Credentials): Promise<AuthToken> { /* ... */ }
  async logout(): Promise<void> { /* ... */ }
  async refreshToken(): Promise<AuthToken> { /* ... */ }
}

class UserProfileService {
  async getProfile(): Promise<UserProfile> { /* ... */ }
  async updateProfile(data: Partial<UserProfile>): Promise<void> { /* ... */ }
}

class NotificationService {
  async subscribe(topic: string): Promise<void> { /* ... */ }
  async unsubscribe(topic: string): Promise<void> { /* ... */ }
}

class AnalyticsService {
  trackEvent(event: string, properties?: Record<string, unknown>): void { /* ... */ }
}

// Facade: Interfaz simplificada
class AppFacade {
  constructor(
    private auth: AuthenticationService,
    private profile: UserProfileService,
    private notifications: NotificationService,
    private analytics: AnalyticsService
  ) {}
  
  async initializeApp(credentials: Credentials): Promise<void> {
    // Simplifica la secuencia compleja de inicialización
    const token = await this.auth.login(credentials);
    await this.profile.getProfile();
    await this.notifications.subscribe('general');
    this.analytics.trackEvent('app_initialized');
  }
  
  async shutdownApp(): Promise<void> {
    await this.notifications.unsubscribe('general');
    await this.auth.logout();
    this.analytics.trackEvent('app_shutdown');
  }
  
  // Acceso directo a subsistemas cuando se necesita funcionalidad avanzada
  getAuthService(): AuthenticationService {
    return this.auth;
  }
  
  getProfileService(): UserProfileService {
    return this.profile;
  }
}

// Uso simple
const app = new AppFacade(
  new AuthenticationService(),
  new UserProfileService(),
  new NotificationService(),
  new AnalyticsService()
);

await app.initializeApp(credentials);

// ❌ INCORRECTO - Código cliente manejando toda la complejidad
async function badInitialize(credentials: Credentials) {
  const auth = new AuthenticationService();
  const profile = new UserProfileService();
  const notifications = new NotificationService();
  const analytics = new AnalyticsService();
  
  const token = await auth.login(credentials);
  await profile.getProfile();
  await notifications.subscribe('general');
  analytics.trackEvent('app_initialized');
  // ... repetido en múltiples lugares
}
```

---

## 3. BEHAVIORAL PATTERNS

### Observer Pattern
- **MUST**: Implementar con EventTarget o custom Observable
- **MUST**: Permitir unsubscribe para evitar memory leaks
- **MUST**: Manejar errores en notificaciones sin romper otros observers
- **WHY**: Desacoplamiento entre productores y consumidores de eventos

```typescript
// ✅ CORRECTO - Implementación tipo RxJS con unsubscribe
interface Observer<T> {
  next: (value: T) => void;
  error?: (err: Error) => void;
  complete?: () => void;
}

interface Subscription {
  unsubscribe(): void;
}

class Observable<T> {
  private observers = new Set<Observer<T>>();
  private isCompleted = false;
  
  subscribe(observer: Observer<T>): Subscription {
    if (this.isCompleted && observer.complete) {
      observer.complete();
      return { unsubscribe: () => {} };
    }
    
    this.observers.add(observer);
    
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }
  
  protected emit(value: T): void {
    if (this.isCompleted) return;
    
    this.observers.forEach(observer => {
      try {
        observer.next(value);
      } catch (err) {
        if (observer.error) {
          observer.error(err as Error);
        }
      }
    });
  }
  
  protected complete(): void {
    this.isCompleted = true;
    this.observers.forEach(observer => {
      observer.complete?.();
    });
    this.observers.clear();
  }
}

// Uso concreto
class DataStore extends Observable<{ type: string; data: unknown }> {
  private state: Record<string, unknown> = {};
  
  setState(key: string, value: unknown): void {
    this.state[key] = value;
    this.emit({ type: 'state:change', data: { key, value } });
  }
  
  getState(key: string): unknown {
    return this.state[key];
  }
}

const store = new DataStore();

// Suscripción con cleanup
const subscription = store.subscribe({
  next: (event) => {
    console.log('State changed:', event);
  },
  error: (err) => {
    console.error('Error in observer:', err);
  }
});

// Cleanup para evitar memory leaks
window.addEventListener('beforeunload', () => {
  subscription.unsubscribe();
});

// ✅ CORRECTO - Usando EventTarget nativo
class CustomEventEmitter extends EventTarget {
  emit(eventName: string, detail?: unknown): void {
    this.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
  
  on(eventName: string, handler: (event: CustomEvent) => void): () => void {
    this.addEventListener(eventName, handler as EventListener);
    return () => this.removeEventListener(eventName, handler as EventListener);
  }
}

const emitter = new CustomEventEmitter();
const unsubscribe = emitter.on('user:login', (e) => {
  console.log('User logged in:', e.detail);
});

// ❌ INCORRECTO - Sin manejo de unsubscribe
class BadEventEmitter {
  private listeners: Function[] = [];
  
  on(fn: Function): void {
    this.listeners.push(fn);
  }
  
  emit(data: unknown): void {
    this.listeners.forEach(fn => fn(data));
  }
  // No hay forma de remover listeners → memory leak
}
```

### Strategy Pattern
- **MUST**: Usar para algoritmos intercambiables
- **MUST**: Definir interfaz común para todas las estrategias
- **FORBIDDEN**: Condicionales complejos para seleccionar algoritmos
- **WHY**: Evita condicionales complejos, facilita testing, permite extensibilidad

```typescript
// ✅ CORRECTO
interface SortStrategy<T> {
  sort(data: T[]): T[];
  getName(): string;
}

class QuickSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    if (data.length <= 1) return data;
    const pivot = data[Math.floor(data.length / 2)];
    const left = data.filter(x => x < pivot);
    const right = data.filter(x => x > pivot);
    const middle = data.filter(x => x === pivot);
    return [...this.sort(left), ...middle, ...this.sort(right)];
  }
  
  getName(): string {
    return 'QuickSort';
  }
}

class MergeSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    if (data.length <= 1) return data;
    const mid = Math.floor(data.length / 2);
    const left = this.sort(data.slice(0, mid));
    const right = this.sort(data.slice(mid));
    return this.merge(left, right);
  }
  
  private merge(left: T[], right: T[]): T[] {
    const result: T[] = [];
    while (left.length && right.length) {
      result.push(left[0] <= right[0] ? left.shift()! : right.shift()!);
    }
    return [...result, ...left, ...right];
  }
  
  getName(): string {
    return 'MergeSort';
  }
}

class HeapSortStrategy<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    // Implementación de heapsort
    const heap = [...data];
    this.buildHeap(heap);
    const sorted: T[] = [];
    for (let i = heap.length - 1; i > 0; i--) {
      [heap[0], heap[i]] = [heap[i], heap[0]];
      sorted.unshift(heap.pop()!);
      this.heapify(heap, 0);
    }
    return sorted;
  }
  
  private buildHeap(arr: T[]): void {
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      this.heapify(arr, i);
    }
  }
  
  private heapify(arr: T[], i: number): void {
    // Implementación heapify
  }
  
  getName(): string {
    return 'HeapSort';
  }
}

// Contexto que usa estrategias
class Sorter<T> {
  private strategy: SortStrategy<T>;
  
  constructor(strategy: SortStrategy<T>) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }
  
  sort(data: T[]): T[] {
    console.log(`Sorting with ${this.strategy.getName()}`);
    return this.strategy.sort(data);
  }
}

// Uso flexible
const sorter = new Sorter(new QuickSortStrategy<number>());
let result = sorter.sort([3, 1, 4, 1, 5]);

// Cambio de estrategia en runtime
sorter.setStrategy(new MergeSortStrategy<number>());
result = sorter.sort([3, 1, 4, 1, 5]);

// ❌ INCORRECTO - Condicionales complejos
function badSort<T>(data: T[], algorithm: 'quick' | 'merge' | 'heap'): T[] {
  if (algorithm === 'quick') {
    // Implementación de quicksort
  } else if (algorithm === 'merge') {
    // Implementación de mergesort
  } else if (algorithm === 'heap') {
    // Implementación de heapsort
  }
  return data;
}
```

### Command Pattern
- **MUST**: Encapsular solicitudes como objetos
- **MUST**: Proveer métodos execute() y opcionalmente undo()
- **WHY**: Permite deshacer operaciones, encolar comandos, logging, operaciones batch

```typescript
// ✅ CORRECTO
interface Command {
  execute(): void;
  undo(): void;
  getDescription(): string;
}

// Receptor
class TextEditor {
  private content = '';
  private selection = { start: 0, end: 0 };
  
  getContent(): string {
    return this.content;
  }
  
  insert(text: string, position: number): void {
    this.content = this.content.slice(0, position) + text + this.content.slice(position);
  }
  
  delete(start: number, length: number): string {
    const deleted = this.content.slice(start, start + length);
    this.content = this.content.slice(0, start) + this.content.slice(start + length);
    return deleted;
  }
  
  setSelection(start: number, end: number): void {
    this.selection = { start, end };
  }
  
  getSelection(): { start: number; end: number } {
    return { ...this.selection };
  }
}

// Comandos concretos
class InsertTextCommand implements Command {
  private previousContent?: string;
  
  constructor(
    private editor: TextEditor,
    private text: string,
    private position: number
  ) {}
  
  execute(): void {
    this.previousContent = this.editor.getContent();
    this.editor.insert(this.text, this.position);
  }
  
  undo(): void {
    if (this.previousContent !== undefined) {
      // Lógica para restaurar estado anterior
      const current = this.editor.getContent();
      const before = current.slice(0, this.position);
      const after = current.slice(this.position + this.text.length);
      // Restaurar requiere referencia al editor para modificarlo directamente
      // En una implementación real, tendríamos método setContent
    }
  }
  
  getDescription(): string {
    return `Insert "${this.text}" at position ${this.position}`;
  }
}

class DeleteTextCommand implements Command {
  private deletedText = '';
  
  constructor(
    private editor: TextEditor,
    private start: number,
    private length: number
  ) {}
  
  execute(): void {
    this.deletedText = this.editor.delete(this.start, this.length);
  }
  
  undo(): void {
    this.editor.insert(this.deletedText, this.start);
  }
  
  getDescription(): string {
    return `Delete ${this.length} characters at position ${this.start}`;
  }
}

// Invocador con historial para undo/redo
class CommandHistory {
  private history: Command[] = [];
  private currentIndex = -1;
  private maxSize = 100;
  
  execute(command: Command): void {
    // Remover comandos "redo" si existen
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    command.execute();
    this.history.push(command);
    this.currentIndex++;
    
    // Limitar tamaño del historial
    if (this.history.length > this.maxSize) {
      this.history.shift();
      this.currentIndex--;
    }
  }
  
  undo(): void {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }
  
  redo(): void {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
  
  getHistory(): string[] {
    return this.history.map(cmd => cmd.getDescription());
  }
}

// Uso
const editor = new TextEditor();
const history = new CommandHistory();

history.execute(new InsertTextCommand(editor, 'Hello', 0));
history.execute(new InsertTextCommand(editor, ' World', 5));
console.log(editor.getContent()); // "Hello World"

history.undo();
console.log(editor.getContent()); // "Hello"

history.redo();
console.log(editor.getContent()); // "Hello World"

// ❌ INCORRECTO - Lógica de negocio mezclada sin encapsulación
class BadTextEditor {
  private content = '';
  
  insert(text: string): void {
    this.content += text;
    // No hay forma de deshacer o registrar la operación
  }
  
  // No hay historial, no hay undo/redo
}
```

### Iterator Pattern
- **MUST**: Implementar interfaz Iterator para recorrer colecciones
- **MUST**: Mantener estado de iteración separado de la colección
- **WHY**: Permite múltiples iteraciones simultáneas, diferentes estrategias de recorrido

```typescript
// ✅ CORRECTO
interface Iterator<T> {
  next(): IteratorResult<T>;
  hasNext(): boolean;
  reset(): void;
}

interface IteratorResult<T> {
  value: T;
  done: boolean;
}

interface IterableCollection<T> {
  createIterator(): Iterator<T>;
  createReverseIterator(): Iterator<T>;
}

// Colección concreta
class BinaryTree<T> implements IterableCollection<T> {
  root: TreeNode<T> | null = null;
  
  createIterator(): Iterator<T> {
    return new InOrderIterator(this);
  }
  
  createReverseIterator(): Iterator<T> {
    return new ReverseInOrderIterator(this);
  }
  
  *[Symbol.iterator](): Generator<T> {
    yield* this.inOrderTraversal(this.root);
  }
  
  private *inOrderTraversal(node: TreeNode<T> | null): Generator<T> {
    if (node) {
      yield* this.inOrderTraversal(node.left);
      yield node.value;
      yield* this.inOrderTraversal(node.right);
    }
  }
}

interface TreeNode<T> {
  value: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;
}

// Iterador concreto: In-order
class InOrderIterator<T> implements Iterator<T> {
  private stack: TreeNode<T>[] = [];
  private current: TreeNode<T> | null;
  private root: TreeNode<T> | null;
  
  constructor(private tree: BinaryTree<T>) {
    this.root = tree.root;
    this.current = tree.root;
    this.pushLeft(this.current);
  }
  
  private pushLeft(node: TreeNode<T> | null): void {
    while (node) {
      this.stack.push(node);
      node = node.left;
    }
  }
  
  next(): IteratorResult<T> {
    if (this.stack.length === 0) {
      return { value: undefined as unknown as T, done: true };
    }
    
    const node = this.stack.pop()!;
    const value = node.value;
    
    if (node.right) {
      this.pushLeft(node.right);
    }
    
    return { value, done: false };
  }
  
  hasNext(): boolean {
    return this.stack.length > 0;
  }
  
  reset(): void {
    this.stack = [];
    this.current = this.root;
    this.pushLeft(this.current);
  }
}

// Iterador concreto: Reverse in-order
class ReverseInOrderIterator<T> implements Iterator<T> {
  private stack: TreeNode<T>[] = [];
  private root: TreeNode<T> | null;
  
  constructor(private tree: BinaryTree<T>) {
    this.root = tree.root;
    this.pushRight(this.root);
  }
  
  private pushRight(node: TreeNode<T> | null): void {
    while (node) {
      this.stack.push(node);
      node = node.right;
    }
  }
  
  next(): IteratorResult<T> {
    if (this.stack.length === 0) {
      return { value: undefined as unknown as T, done: true };
    }
    
    const node = this.stack.pop()!;
    const value = node.value;
    
    if (node.left) {
      this.pushRight(node.left);
    }
    
    return { value, done: false };
  }
  
  hasNext(): boolean {
    return this.stack.length > 0;
  }
  
  reset(): void {
    this.stack = [];
    this.pushRight(this.root);
  }
}

// Uso con múltiples iteradores simultáneos
const tree = new BinaryTree<number>();
tree.root = {
  value: 5,
  left: { value: 3, left: { value: 1, left: null, right: null }, right: { value: 4, left: null, right: null } },
  right: { value: 8, left: { value: 7, left: null, right: null }, right: { value: 9, left: null, right: null } }
};

const iter1 = tree.createIterator();
const iter2 = tree.createReverseIterator();

// Iteración simultánea en ambas direcciones
console.log(iter1.next().value); // 1 (ascendente)
console.log(iter2.next().value); // 9 (descendente)
console.log(iter1.next().value); // 3
console.log(iter2.next().value); // 8

// ❌ INCORRECTO - Sin patrón Iterator
class BadBinaryTree<T> {
  root: TreeNode<T> | null = null;
  
  // Solo permite una forma de recorrido, no hay múltiples iteraciones simultáneas
  traverseInOrder(): T[] {
    const result: T[] = [];
    const traverse = (node: TreeNode<T> | null) => {
      if (node) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }
}
```

---

## 4. MODERN PATTERNS

### Repository Pattern
- **MUST**: Abstraer acceso a datos
- **MUST**: Retornar objetos de dominio, no datos crudos
- **MUST**: Definir interfaces para facilitar testing con mocks
- **WHY**: Facilita testing, cambio de fuentes de datos, separación de concerns

```typescript
// ✅ CORRECTO
// Entidad de dominio
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  isActive: boolean;
}

// Interfaz del repositorio (contrato)
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(options: { page: number; limit: number }): Promise<User[]>;
  create(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

// Implementación concreta: PostgreSQL
class PostgresUserRepository implements UserRepository {
  constructor(private db: Knex) {}
  
  async findById(id: string): Promise<User | null> {
    const row = await this.db('users').where({ id }).first();
    return row ? this.toDomain(row) : null;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const row = await this.db('users').where({ email }).first();
    return row ? this.toDomain(row) : null;
  }
  
  async findAll(options: { page: number; limit: number }): Promise<User[]> {
    const rows = await this.db('users')
      .limit(options.limit)
      .offset((options.page - 1) * options.limit);
    return rows.map(row => this.toDomain(row));
  }
  
  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const [row] = await this.db('users')
      .insert({
        ...user,
        id: crypto.randomUUID(),
        created_at: new Date()
      })
      .returning('*');
    return this.toDomain(row);
  }
  
  async update(id: string, data: Partial<User>): Promise<User> {
    const [row] = await this.db('users')
      .where({ id })
      .update(data)
      .returning('*');
    return this.toDomain(row);
  }
  
  async delete(id: string): Promise<void> {
    await this.db('users').where({ id }).delete();
  }
  
  private toDomain(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      name: row.name as string,
      createdAt: new Date(row.created_at as string),
      isActive: row.is_active as boolean
    };
  }
}

// Implementación concreta: In-Memory (para testing)
class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  
  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }
  
  async findAll(options: { page: number; limit: number }): Promise<User[]> {
    const start = (options.page - 1) * options.limit;
    return this.users.slice(start, start + options.limit);
  }
  
  async create(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }
  
  async update(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }
  
  async delete(id: string): Promise<void> {
    this.users = this.users.filter(u => u.id !== id);
  }
  
  // Métodos adicionales para testing
  clear(): void {
    this.users = [];
  }
  
  seed(users: User[]): void {
    this.users = users;
  }
}

// Uso en servicio (depende de la interfaz, no de la implementación)
class UserService {
  constructor(private userRepo: UserRepository) {}
  
  async registerUser(email: string, name: string): Promise<User> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('Email already registered');
    }
    
    return this.userRepo.create({
      email,
      name,
      isActive: true
    });
  }
}

// Testing con implementación en memoria
const userService = new UserService(new InMemoryUserRepository());

// Producción con PostgreSQL
const prodService = new UserService(new PostgresUserRepository(db));

// ❌ INCORRECTO - Acceso directo a base de datos sin abstracción
class BadUserService {
  constructor(private db: Knex) {}
  
  async registerUser(email: string, name: string): Promise<void> {
    const existing = await this.db('users').where({ email }).first();
    if (existing) throw new Error('Email exists');
    
    await this.db('users').insert({ email, name, id: crypto.randomUUID() });
  }
}
```

### Service Pattern
- **MUST**: Encapsular lógica de negocio
- **MUST**: Depender de abstracciones (repositories, otras interfaces)
- **FORBIDDEN**: Lógica de negocio en componentes UI
- **WHY**: Separación de concerns, testabilidad, reutilización

```typescript
// ✅ CORRECTO
// Entity
interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  createdAt: Date;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

// Repositories (dependencias)
interface OrderRepository {
  findById(id: string): Promise<Order | null>;
  create(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
}

interface ProductRepository {
  findById(id: string): Promise<{ id: string; price: number; stock: number } | null>;
  updateStock(id: string, quantity: number): Promise<void>;
}

interface NotificationService {
  notifyUser(userId: string, message: string): Promise<void>;
}

// Service con lógica de negocio encapsulada
class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private productRepo: ProductRepository,
    private notificationService: NotificationService
  ) {}
  
  async createOrder(userId: string, items: { productId: string; quantity: number }[]): Promise<Order> {
    // Validar stock y calcular total
    const orderItems: OrderItem[] = [];
    let total = 0;
    
    for (const item of items) {
      const product = await this.productRepo.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price
      });
      total += product.price * item.quantity;
    }
    
    // Crear orden
    const order: Order = {
      id: crypto.randomUUID(),
      userId,
      items: orderItems,
      status: 'pending',
      total,
      createdAt: new Date()
    };
    
    const createdOrder = await this.orderRepo.create(order);
    
    // Reservar stock
    for (const item of orderItems) {
      await this.productRepo.updateStock(item.productId, -item.quantity);
    }
    
    // Notificar
    await this.notificationService.notifyUser(userId, `Order ${order.id} created`);
    
    return createdOrder;
  }
  
  async cancelOrder(orderId: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    
    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new Error(`Cannot cancel order with status ${order.status}`);
    }
    
    // Restaurar stock
    for (const item of order.items) {
      await this.productRepo.updateStock(item.productId, item.quantity);
    }
    
    order.status = 'cancelled';
    await this.orderRepo.update(order);
    
    await this.notificationService.notifyUser(
      order.userId,
      `Order ${orderId} has been cancelled`
    );
  }
  
  async processPayment(orderId: string, paymentMethod: string): Promise<void> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'pending') throw new Error('Order is not pending');
    
    // Integración con servicio de pagos...
    // Lógica de negocio compleja
    
    order.status = 'confirmed';
    await this.orderRepo.update(order);
  }
}

// ❌ INCORRECTO - Lógica de negocio en componente React
function BadCheckoutComponent() {
  const [items, setItems] = useState([]);
  const db = useDatabase(); // Acceso directo a DB en UI
  
  const handleCheckout = async () => {
    // Lógica de negocio en el componente
    let total = 0;
    for (const item of items) {
      const product = await db.query('SELECT * FROM products WHERE id = ?', [item.id]);
      if (product.stock < item.quantity) {
        alert('No stock');
        return;
      }
      total += product.price * item.quantity;
    }
    
    const orderId = crypto.randomUUID();
    await db.query('INSERT INTO orders (id, total) VALUES (?, ?)', [orderId, total]);
    // ... más lógica mezclada
  };
  
  return <button onClick={handleCheckout}>Checkout</button>;
}
```

### Dependency Injection
- **MUST**: Inyectar dependencias, no crearlas internamente
- **MUST**: Depender de interfaces/abstracciones, no implementaciones concretas
- **MUST**: Usar containers para gestionar instancias
- **WHY**: Facilita testing, desacoplamiento, reemplazo de componentes

```typescript
// ✅ CORRECTO
// Token para identificar dependencias (Inversify-style)
interface InjectionToken<T> {
  symbol: symbol;
  defaultValue?: T;
}

function createToken<T>(name: string): InjectionToken<T> {
  return { symbol: Symbol(name) };
}

// Tokens
const TOKENS = {
  Database: createToken<Knex>('Database'),
  Logger: createToken<Logger>('Logger'),
  UserRepository: createToken<UserRepository>('UserRepository'),
  UserService: createToken<UserService>('UserService'),
  Cache: createToken<Cache>('Cache')
} as const;

// Simple DI Container
class Container {
  private registry = new Map<symbol, unknown>();
  private factories = new Map<symbol, (container: Container) => unknown>();
  
  register<T>(token: InjectionToken<T>, value: T): this {
    this.registry.set(token.symbol, value);
    return this;
  }
  
  registerFactory<T>(token: InjectionToken<T>, factory: (container: Container) => T): this {
    this.factories.set(token.symbol, factory);
    return this;
  }
  
  registerSingleton<T>(token: InjectionToken<T>, factory: (container: Container) => T): this {
    let instance: T | undefined;
    this.factories.set(token.symbol, (container) => {
      if (!instance) {
        instance = factory(container);
      }
      return instance;
    });
    return this;
  }
  
  resolve<T>(token: InjectionToken<T>): T {
    // Check registry first
    const registered = this.registry.get(token.symbol);
    if (registered !== undefined) {
      return registered as T;
    }
    
    // Check factory
    const factory = this.factories.get(token.symbol);
    if (factory) {
      return factory(this) as T;
    }
    
    throw new Error(`Dependency ${token.symbol.toString()} not registered`);
  }
}

// Configuración del container
function configureContainer(): Container {
  const container = new Container();
  
  // Registro de implementaciones
  container.register(TOKENS.Logger, createLogger());
  container.register(TOKENS.Database, knex(config.database));
  
  // Singletons
  container.registerSingleton(
    TOKENS.Cache,
    () => new RedisCache()
  );
  
  // Factories con dependencias
  container.registerFactory(
    TOKENS.UserRepository,
    (c) => new PostgresUserRepository(
      c.resolve(TOKENS.Database),
      c.resolve(TOKENS.Logger)
    )
  );
  
  container.registerFactory(
    TOKENS.UserService,
    (c) => new UserService(
      c.resolve(TOKENS.UserRepository),
      c.resolve(TOKENS.Cache),
      c.resolve(TOKENS.Logger)
    )
  );
  
  return container;
}

// Uso en aplicación
const container = configureContainer();
const userService = container.resolve(TOKENS.UserService);

// Constructor injection en las clases
class UserService {
  constructor(
    private userRepo: UserRepository,
    private cache: Cache,
    private logger: Logger
  ) {}
  
  async getUser(id: string): Promise<User | null> {
    this.logger.debug(`Fetching user ${id}`);
    
    const cached = await this.cache.get(`user:${id}`);
    if (cached) return JSON.parse(cached);
    
    const user = await this.userRepo.findById(id);
    if (user) {
      await this.cache.set(`user:${id}`, JSON.stringify(user), 300);
    }
    
    return user;
  }
}

// Testing con DI
function createTestContainer(): Container {
  const container = new Container();
  
  // Mocks para testing
  container.register(TOKENS.Logger, createMockLogger());
  container.register(TOKENS.UserRepository, new InMemoryUserRepository());
  container.register(TOKENS.Cache, new InMemoryCache());
  
  container.registerFactory(
    TOKENS.UserService,
    (c) => new UserService(
      c.resolve(TOKENS.UserRepository),
      c.resolve(TOKENS.Cache),
      c.resolve(TOKENS.Logger)
    )
  );
  
  return container;
}

// ❌ INCORRECTO - Dependencias hardcodeadas
class BadUserService {
  private db = knex(config.database); // Dependencia oculta
  private logger = createLogger(); // No se puede mockear
  
  async getUser(id: string): Promise<User | null> {
    this.logger.debug(`Fetching user ${id}`);
    const row = await this.db('users').where({ id }).first();
    return row ? this.toUser(row) : null;
  }
}
```

### Composition Pattern (Functional)
- **MUST**: Componer funciones pequeñas y puras
- **MUST**: Usar higher-order functions
- **FORBIDDEN**: Deep inheritance hierarchies
- **WHY**: Mayor flexibilidad, testabilidad, reusabilidad

```typescript
// ✅ CORRECTO
// Funciones pequeñas y reutilizables
type Validator<T> = (value: T) => { valid: boolean; error?: string };
type Transformer<T, R> = (value: T) => R;

// Validadores composables
const required = <T>(fieldName: string): Validator<T | null | undefined> => (value) => ({
  valid: value !== null && value !== undefined && value !== '',
  error: value ? undefined : `${fieldName} is required`
});

const minLength = (fieldName: string, min: number): Validator<string> => (value) => ({
  valid: value.length >= min,
  error: value.length >= min ? undefined : `${fieldName} must be at least ${min} characters`
});

const email = (): Validator<string> => (value) => ({
  valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  error: 'Invalid email format'
});

const range = (fieldName: string, min: number, max: number): Validator<number> => (value) => ({
  valid: value >= min && value <= max,
  error: `${fieldName} must be between ${min} and ${max}`
});

// Composición de validadores
const composeValidators = <T>(...validators: Validator<T>[]): Validator<T> => (value) => {
  for (const validator of validators) {
    const result = validator(value);
    if (!result.valid) return result;
  }
  return { valid: true };
};

// Uso
const validateUserInput = {
  name: composeValidators(
    required<string>('Name'),
    minLength('Name', 2)
  ),
  email: composeValidators(
    required<string>('Email'),
    email()
  ),
  age: composeValidators(
    required<number>('Age'),
    range('Age', 0, 150)
  )
};

// Higher-order functions para transformaciones
const pipe = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduce((acc, fn) => fn(acc), value);

const compose = <T>(...fns: Array<(arg: T) => T>) => (value: T): T =>
  fns.reduceRight((acc, fn) => fn(acc), value);

// Transformaciones de datos
const trim = (str: string): string => str.trim();
const toLowerCase = (str: string): string => str.toLowerCase();
const removeSpecialChars = (str: string): string => str.replace(/[^a-z0-9]/g, '');
const truncate = (maxLength: number) => (str: string): string =>
  str.length > maxLength ? str.slice(0, maxLength) + '...' : str;

// Pipeline de transformación
const sanitizeUsername = pipe(
  trim,
  toLowerCase,
  removeSpecialChars,
  truncate(20)
);

console.log(sanitizeUsername('  John_Doe@Example.COM  ')); // 'johndoeexamplecom'

// Composición de comportamientos (alternativa a herencia)
interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

type WithTimestamps = <T extends object>(obj: T) => T & Pick<Entity, 'createdAt' | 'updatedAt'>;
type WithAudit = <T extends object>(obj: T, userId: string) => T & { createdBy: string; updatedBy: string };
type WithSoftDelete = <T extends object>(obj: T) => T & { deletedAt: Date | null };

const withTimestamps: WithTimestamps = (obj) => ({
  ...obj,
  createdAt: new Date(),
  updatedAt: new Date()
});

const withAudit = <T extends object>(obj: T, userId: string) => ({
  ...obj,
  createdBy: userId,
  updatedBy: userId
});

const withSoftDelete = <T extends object>(obj: T) => ({
  ...obj,
  deletedAt: null
});

// Composición flexible
const createProduct = (data: { name: string; price: number }, userId: string) =>
  pipe(
    withTimestamps,
    (obj) => withAudit(obj, userId),
    withSoftDelete
  )(data);

const product = createProduct({ name: 'Laptop', price: 999 }, 'user-123');

// ❌ INCORRECTO - Deep inheritance hierarchy
class EntityBase {
  id: string;
  createdAt: Date;
}

class AuditableEntity extends EntityBase {
  createdBy: string;
  updatedBy: string;
}

class SoftDeletableEntity extends AuditableEntity {
  deletedAt: Date | null;
}

class Product extends SoftDeletableEntity {
  name: string;
  price: number;
}
// Problema: ¿Qué si quiero Product con timestamps pero sin audit?
```
