# Programación Funcional en JavaScript

## Principios Fundamentales

### Pure Functions

```typescript
// ❌ Función impura (side effects)
let total = 0;
function addToTotal(amount: number): void {
  total += amount; // Modifica estado externo
}

// ✅ Función pura
function add(a: number, b: number): number {
  return a + b; // Siempre mismo output para mismo input
}

// ❌ Función impura (dependencia externa)
function getDiscountedPrice(price: number): number {
  return price * (1 - getCurrentDiscount()); // Dependencia oculta
}

// ✅ Función pura (inyección explícita)
function getDiscountedPrice(
  price: number, 
  discountRate: number
): number {
  return price * (1 - discountRate);
}

// ❌ Función impura (I/O)
function getUser(id: string): User {
  return database.users.find(id); // Side effect
}

// ✅ Función pura (datos como input)
function findUser(users: User[], id: string): User | undefined {
  return users.find(u => u.id === id);
}
```

### Inmutabilidad

```typescript
// ❌ Mutación
function addItem(cart: Cart, item: Item): void {
  cart.items.push(item); // Mutación
}

// ✅ Inmutable
function addItem(cart: Cart, item: Item): Cart {
  return {
    ...cart,
    items: [...cart.items, item],
    total: cart.total + item.price
  };
}

// ❌ Mutación de array
const numbers = [1, 2, 3];
numbers.push(4);

// ✅ Nuevo array
const numbers = [1, 2, 3];
const newNumbers = [...numbers, 4];

// ❌ Mutación de objeto
const user = { name: 'John' };
user.age = 30;

// ✅ Nuevo objeto
const user = { name: 'John' };
const updatedUser = { ...user, age: 30 };

// Actualización anidada inmutable
const state = {
  user: {
    profile: {
      name: 'John',
      settings: { theme: 'dark' }
    }
  }
};

// ✅ Inmutable con spread
const newState = {
  ...state,
  user: {
    ...state.user,
    profile: {
      ...state.user.profile,
      settings: {
        ...state.user.profile.settings,
        theme: 'light'
      }
    }
  }
};

// O usar librería
import produce from 'immer';

const newState = produce(state, draft => {
  draft.user.profile.settings.theme = 'light';
});
```

---

## Higher-Order Functions

```typescript
// Functions that take functions as arguments or return functions

// map - transform
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(x => x * 2);

// filter - select
const evens = numbers.filter(x => x % 2 === 0);

// reduce - aggregate
const sum = numbers.reduce((acc, x) => acc + x, 0);

// Custom higher-order functions
function withLogging<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    console.log(`Calling ${fn.name} with`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  }) as T;
}

const add = withLogging((a: number, b: number) => a + b);

// Function composition
function compose<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x: T) => fns.reduceRight((v, f) => f(v), x);
}

function pipe<T>(...fns: Array<(x: T) => T>): (x: T) => T {
  return (x: T) => fns.reduce((v, f) => f(v), x);
}

// Usage
const slugify = pipe(
  (s: string) => s.toLowerCase(),
  (s: string) => s.trim(),
  (s: string) => s.replace(/\s+/g, '-'),
  (s: string) => s.replace(/[^a-z0-9-]/g, '')
);

slugify('Hello World!'); // 'hello-world'

// Partial application
function partial<T, U, V>(fn: (a: T, b: U) => V, a: T): (b: U) => V {
  return (b: U) => fn(a, b);
}

const add5 = partial((a: number, b: number) => a + b, 5);
add5(3); // 8

// Currying
function curry<T, U, V>(fn: (a: T, b: U) => V): (a: T) => (b: U) => V {
  return (a: T) => (b: U) => fn(a, b);
}

const curriedAdd = curry((a: number, b: number) => a + b);
const add10 = curriedAdd(10);
add10(5); // 15

// Memoization (caching pure functions)
function memoize<T, U>(fn: (x: T) => U): (x: T) => U {
  const cache = new Map<T, U>();
  return (x: T) => {
    if (!cache.has(x)) {
      cache.set(x, fn(x));
    }
    return cache.get(x)!;
  };
}

const fibonacci = memoize((n: number): number => {
  if (n < 2) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});
```

---

## Monads y Functors

```typescript
// Functor - mapeable container
interface Functor<T> {
  map<U>(fn: (value: T) => U): Functor<U>;
}

// Maybe Monad - maneja null/undefined
class Maybe<T> {
  private constructor(private value: T | null) {}
  
  static just<T>(value: T): Maybe<T> {
    return new Maybe(value);
  }
  
  static nothing<T>(): Maybe<T> {
    return new Maybe<T>(null);
  }
  
  static of<T>(value: T | null): Maybe<T> {
    return value === null || value === undefined 
      ? Maybe.nothing() 
      : Maybe.just(value);
  }
  
  map<U>(fn: (value: T) => U): Maybe<U> {
    return this.value === null 
      ? Maybe.nothing() 
      : Maybe.just(fn(this.value));
  }
  
  flatMap<U>(fn: (value: T) => Maybe<U>): Maybe<U> {
    return this.value === null 
      ? Maybe.nothing() 
      : fn(this.value);
  }
  
  filter(predicate: (value: T) => boolean): Maybe<T> {
    if (this.value === null) return this;
    return predicate(this.value) ? this : Maybe.nothing();
  }
  
  getOrElse(defaultValue: T): T {
    return this.value === null ? defaultValue : this.value;
  }
  
  isNothing(): boolean {
    return this.value === null;
  }
  
  isJust(): boolean {
    return this.value !== null;
  }
}

// Usage
interface User {
  name: string;
  address?: {
    city?: string;
  };
}

function getCity(user: User | null): string {
  return Maybe.of(user)
    .map(u => u.address)
    .map(a => a?.city)
    .getOrElse('Unknown');
}

// Result Monad - maneja errores sin excepciones
class Result<T, E = Error> {
  private constructor(
    private ok: boolean,
    private value: T | null,
    private error: E | null
  ) {}
  
  static ok<T, E>(value: T): Result<T, E> {
    return new Result(true, value, null);
  }
  
  static fail<T, E>(error: E): Result<T, E> {
    return new Result(false, null, error);
  }
  
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (!this.ok) return Result.fail(this.error!);
    return Result.ok(fn(this.value!));
  }
  
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (!this.ok) return Result.fail(this.error!);
    return fn(this.value!);
  }
  
  mapError<F>(fn: (error: E) => F): Result<T, F> {
    if (this.ok) return Result.ok(this.value!);
    return Result.fail(fn(this.error!));
  }
  
  match<U>(onOk: (value: T) => U, onFail: (error: E) => U): U {
    return this.ok ? onOk(this.value!) : onFail(this.error!);
  }
  
  getOrElse(defaultValue: T): T {
    return this.ok ? this.value! : defaultValue;
  }
  
  isOk(): boolean { return this.ok; }
  isFail(): boolean { return !this.ok; }
}

// Usage
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Result.fail('Division by zero');
  return Result.ok(a / b);
}

function sqrt(x: number): Result<number, string> {
  if (x < 0) return Result.fail('Negative number');
  return Result.ok(Math.sqrt(x));
}

const result = divide(10, 2)
  .flatMap(x => divide(x, 2))
  .flatMap(sqrt);

result.match(
  value => console.log('Result:', value),
  error => console.log('Error:', error)
);

// IO Monad - encapsula side effects
class IO<T> {
  constructor(private effect: () => T) {}
  
  static of<T>(value: T): IO<T> {
    return new IO(() => value);
  }
  
  map<U>(fn: (value: T) => U): IO<U> {
    return new IO(() => fn(this.effect()));
  }
  
  flatMap<U>(fn: (value: T) => IO<U>): IO<U> {
    return new IO(() => fn(this.effect()).run());
  }
  
  run(): T {
    return this.effect();
  }
}

// Usage
const readFile = (path: string): IO<string> => 
  new IO(() => fs.readFileSync(path, 'utf-8'));

const writeFile = (path: string, content: string): IO<void> =>
  new IO(() => fs.writeFileSync(path, content));

const program = readFile('input.txt')
  .map(content => content.toUpperCase())
  .flatMap(upper => writeFile('output.txt', upper));

// No side effects hasta aquí
program.run(); // Ahora se ejecutan
```

---

## Lenses y Optics

```typescript
// Lens - composable getter/setter
interface Lens<S, A> {
  get: (s: S) => A;
  set: (a: A) => (s: S) => S;
}

function lens<S, A>(
  getter: (s: S) => A,
  setter: (a: A) => (s: S) => S
): Lens<S, A> {
  return { get: getter, set: setter };
}

// Compose lenses
function composeLens<S, A, B>(
  outer: Lens<S, A>,
  inner: Lens<A, B>
): Lens<S, B> {
  return {
    get: (s: S) => inner.get(outer.get(s)),
    set: (b: B) => (s: S) => outer.set(inner.set(b)(outer.get(s)))(s)
  };
}

// Usage
interface Address {
  street: string;
  city: string;
  zip: string;
}

interface User {
  name: string;
  address: Address;
}

// Create lenses
const addressLens = lens<User, Address>(
  user => user.address,
  address => user => ({ ...user, address })
);

const cityLens = lens<Address, string>(
  addr => addr.city,
  city => addr => ({ ...addr, city })
);

// Compose for nested access
const userCityLens = composeLens(addressLens, cityLens);

const user: User = {
  name: 'John',
  address: { street: '123 Main', city: 'NYC', zip: '10001' }
};

// Get
userCityLens.get(user); // 'NYC'

// Set (immutable)
const updated = userCityLens.set('LA')(user);
// { name: 'John', address: { street: '123 Main', city: 'LA', zip: '10001' } }

// Modify
const uppercaseCity = (s: string) => s.toUpperCase();
const modified = userCityLens.set(
  uppercaseCity(userCityLens.get(user))
)(user);

// Helper: modify function
function modify<S, A>(lens: Lens<S, A>, fn: (a: A) => A): (s: S) => S {
  return s => lens.set(fn(lens.get(s)))(s);
}

const upperCity = modify(userCityLens, s => s.toUpperCase());
upperCity(user); // NYC -> NYC (ya estaba así, pero ilustra el patrón)
```

---

## Functional Error Handling

```typescript
// Railway-Oriented Programming
type AsyncResult<T, E> = Promise<Result<T, E>>;

// Compose functions that return Results
function bind<T, U, E>(
  f: (x: T) => Result<U, E>
): (result: Result<T, E>) => Result<U, E> {
  return result => result.flatMap(f);
}

function map<T, U, E>(
  f: (x: T) => U
): (result: Result<T, E>) => Result<U, E> {
  return result => result.map(f);
}

function lift<T, U, E>(f: (x: T) => U): (x: T) => Result<U, E> {
  return x => Result.ok(f(x));
}

// Validation pipeline
type ValidationResult<T> = Result<T, string[]>;

function validateNotEmpty(field: string): (value: string) => ValidationResult<string> {
  return value => 
    value.trim().length > 0 
      ? Result.ok(value) 
      : Result.fail([`${field} cannot be empty`]);
}

function validateMinLength(min: number): (value: string) => ValidationResult<string> {
  return value =>
    value.length >= min
      ? Result.ok(value)
      : Result.fail([`Minimum length is ${min}`]);
}

function validateEmail(value: string): ValidationResult<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value)
    ? Result.ok(value)
    : Result.fail(['Invalid email format']);
}

// Accumulate errors
function validateUser(data: { name: string; email: string }): ValidationResult<{ name: string; email: string }> {
  const nameResult = validateNotEmpty('Name')(data.name)
    .flatMap(validateMinLength(2));
  
  const emailResult = validateNotEmpty('Email')(data.email)
    .flatMap(validateEmail);
  
  if (nameResult.isOk() && emailResult.isOk()) {
    return Result.ok({
      name: nameResult.getOrElse(''),
      email: emailResult.getOrElse('')
    });
  }
  
  const errors = [
    ...(nameResult.isFail() ? nameResult.match(() => [], e => e) : []),
    ...(emailResult.isFail() ? emailResult.match(() => [], e => e) : [])
  ];
  
  return Result.fail(errors);
}

// Using
validateUser({ name: 'J', email: 'invalid' })
  .match(
    user => console.log('Valid:', user),
    errors => console.log('Errors:', errors)
  );
```

---

## Transducers

```typescript
// Composable and efficient data transformations
type Transducer<A, B> = <R>(reducer: (r: R, a: B) => R) => (r: R, a: A) => R;

// Basic transducers
function map<A, B>(fn: (a: A) => B): Transducer<A, B> {
  return reducer => (result, input) => reducer(result, fn(input));
}

function filter<A>(predicate: (a: A) => boolean): Transducer<A, A> {
  return reducer => (result, input) => 
    predicate(input) ? reducer(result, input) : result;
}

function take<A>(n: number): Transducer<A, A> {
  return reducer => {
    let count = 0;
    return (result, input) => {
      if (count >= n) return result;
      count++;
      return reducer(result, input);
    };
  };
}

function compose<A, B, C>(
  t1: Transducer<A, B>,
  t2: Transducer<B, C>
): Transducer<A, C> {
  return reducer => t1(t2(reducer));
}

// Usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Traditional - crea arrays intermedios
const result = numbers
  .map(x => x * 2)
  .filter(x => x > 10)
  .slice(0, 3);

// Transducer - una sola iteración
const transducer = compose(
  map((x: number) => x * 2),
  filter((x: number) => x > 10),
  take(3)
);

const push = (arr: number[], x: number) => [...arr, x];
const result = numbers.reduce(transducer(push), []);

// Transduce into sum (no array allocation)
const sum = (a: number, b: number) => a + b;
const total = numbers.reduce(transducer(sum), 0);
```
