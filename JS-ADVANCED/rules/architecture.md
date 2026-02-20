# Arquitectura de Aplicaciones JavaScript

## Principios SOLID en JavaScript

### Single Responsibility Principle (SRP)

```typescript
// ❌ ANTES: Una clase hace todo
class UserManager {
  async createUser(data: UserData) {
    // Validación
    if (!data.email.includes('@')) throw new Error('Invalid email');
    
    // Database
    const user = await db.users.insert(data);
    
    // Email
    await sendEmail(user.email, 'Welcome!');
    
    // Analytics
    await analytics.track('user_created', { userId: user.id });
    
    return user;
  }
}

// ✅ DESPUÉS: Responsabilidades separadas
class UserValidator {
  validate(data: UserData): ValidationResult {
    const errors: string[] = [];
    if (!data.email.includes('@')) errors.push('Invalid email');
    if (data.password.length < 8) errors.push('Password too short');
    return { isValid: errors.length === 0, errors };
  }
}

class UserRepository {
  async create(data: UserData): Promise<User> {
    return db.users.insert(data);
  }
}

class EmailService {
  async sendWelcome(email: string): Promise<void> {
    await sendEmail(email, 'Welcome!');
  }
}

class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: EmailService,
    private analytics: AnalyticsService
  ) {}
  
  async createUser(data: UserData): Promise<Result<User>> {
    const validation = this.validator.validate(data);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }
    
    const user = await this.repository.create(data);
    await this.emailService.sendWelcome(user.email);
    await this.analytics.track('user_created', { userId: user.id });
    
    return { success: true, data: user };
  }
}
```

### Open/Closed Principle (OCP)

```typescript
// ❌ ANTES: Modificar para agregar features
class PaymentProcessor {
  async process(type: string, amount: number) {
    if (type === 'stripe') {
      // Stripe logic
    } else if (type === 'paypal') {
      // PayPal logic
    } else if (type === 'crypto') {
      // New crypto logic - modifiqué la clase
    }
  }
}

// ✅ DESPUÉS: Extender sin modificar
interface PaymentStrategy {
  process(amount: number): Promise<Transaction>;
  refund(transactionId: string): Promise<void>;
}

class StripeStrategy implements PaymentStrategy {
  async process(amount: number) { /* ... */ }
  async refund(transactionId: string) { /* ... */ }
}

class PayPalStrategy implements PaymentStrategy {
  async process(amount: number) { /* ... */ }
  async refund(transactionId: string) { /* ... */ }
}

// Nueva estrategia sin modificar código existente
class CryptoStrategy implements PaymentStrategy {
  async process(amount: number) { /* ... */ }
  async refund(transactionId: string) { /* ... */ }
}

class PaymentProcessor {
  private strategies = new Map<string, PaymentStrategy>();
  
  register(method: string, strategy: PaymentStrategy) {
    this.strategies.set(method, strategy);
  }
  
  async process(method: string, amount: number) {
    const strategy = this.strategies.get(method);
    if (!strategy) throw new Error(`Unknown method: ${method}`);
    return strategy.process(amount);
  }
}
```

### Liskov Substitution Principle (LSP)

```typescript
// ❌ ANTES: Subclase que rompe comportamiento
class Rectangle {
  constructor(public width: number, public height: number) {}
  
  setWidth(width: number) { this.width = width; }
  setHeight(height: number) { this.height = height; }
  
  getArea() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(width: number) {
    this.width = width;
    this.height = width; // Sorpresa!
  }
  
  setHeight(height: number) {
    this.width = height; // Sorpresa!
    this.height = height;
  }
}

// ✅ DESPUÉS: Composición sobre herencia
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  getArea() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(private side: number) {}
  getArea() { return this.side * this.side; }
}

function printArea(shape: Shape) {
  console.log(shape.getArea()); // Siempre funciona
}
```

### Interface Segregation Principle (ISP)

```typescript
// ❌ ANTES: Interfaz monolítica
interface Machine {
  print(document: Document): void;
  scan(): Image;
  fax(document: Document): void;
  staple(): void;
}

// Una impresora simple debe implementar todo
class SimplePrinter implements Machine {
  print() { /* ok */ }
  scan() { throw new Error('No scan'); }
  fax() { throw new Error('No fax'); }
  staple() { throw new Error('No staple'); }
}

// ✅ DESPUÉS: Interfaces pequeñas y específicas
interface Printer {
  print(document: Document): void;
}

interface Scanner {
  scan(): Image;
}

interface Fax {
  fax(document: Document): void;
}

class SimplePrinter implements Printer {
  print() { /* solo lo que necesita */ }
}

class MultiFunctionMachine implements Printer, Scanner, Fax {
  print() { /* ... */ }
  scan() { /* ... */ }
  fax() { /* ... */ }
}
```

### Dependency Inversion Principle (DIP)

```typescript
// ❌ ANTES: Dependencia directa de implementación
class OrderService {
  private database = new PostgreSQLDatabase();
  private emailer = new SendGridEmailer();
  
  async createOrder(order: Order) {
    await this.database.save(order);
    await this.emailer.send(order.customerEmail, 'Order created');
  }
}

// ✅ DESPUÉS: Depender de abstracciones
interface Database {
  save(entity: unknown): Promise<void>;
  find(id: string): Promise<unknown>;
}

interface EmailService {
  send(to: string, message: string): Promise<void>;
}

class OrderService {
  constructor(
    private database: Database,
    private emailService: EmailService
  ) {}
  
  async createOrder(order: Order) {
    await this.database.save(order);
    await this.emailService.send(order.customerEmail, 'Order created');
  }
}

// Inyección de dependencias
const orderService = new OrderService(
  new PostgreSQLDatabase(),
  new SendGridEmailer()
);
```

---

## Clean Architecture / Ports & Adapters

```typescript
// Domain Layer (Core Business Logic)
// Sin dependencias externas

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

interface PasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}

interface TokenService {
  generate(userId: string): Promise<string>;
  verify(token: string): Promise<string>; // returns userId
}

// Use Cases (Application Layer)
class RegisterUserUseCase {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenService: TokenService
  ) {}
  
  async execute(input: RegisterInput): Promise<AuthResult> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      return { success: false, error: 'Email already registered' };
    }
    
    const hashedPassword = await this.passwordHasher.hash(input.password);
    const user: User = {
      id: generateId(),
      email: input.email,
      name: input.name
    };
    
    await this.userRepo.save(user);
    const token = await this.tokenService.generate(user.id);
    
    return { success: true, user, token };
  }
}

class LoginUseCase {
  constructor(
    private userRepo: UserRepository,
    private passwordHasher: PasswordHasher,
    private tokenService: TokenService
  ) {}
  
  async execute(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const valid = await this.passwordHasher.verify(input.password, user.passwordHash);
    if (!valid) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const token = await this.tokenService.generate(user.id);
    return { success: true, user, token };
  }
}

// Infrastructure Layer (Adapters)
class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}
  
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
  
  async save(user: User): Promise<void> {
    await this.prisma.user.create({ data: user });
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}

class BcryptPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }
  
  async verify(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

class JWTTokenService implements TokenService {
  constructor(private secret: string, private expiresIn: string) {}
  
  async generate(userId: string): Promise<string> {
    return jwt.sign({ userId }, this.secret, { expiresIn: this.expiresIn });
  }
  
  async verify(token: string): Promise<string> {
    const payload = jwt.verify(token, this.secret) as { userId: string };
    return payload.userId;
  }
}

// Presentation Layer (Controllers)
class AuthController {
  constructor(
    private registerUseCase: RegisterUserUseCase,
    private loginUseCase: LoginUseCase
  ) {}
  
  async register(req: Request, res: Response) {
    const result = await this.registerUseCase.execute(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }
    return res.status(201).json({ user: result.user, token: result.token });
  }
  
  async login(req: Request, res: Response) {
    const result = await this.loginUseCase.execute(req.body);
    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }
    return res.json({ user: result.user, token: result.token });
  }
}
```

---

## Hexagonal Architecture (Ports and Adapters)

```typescript
// Core Domain - Solo depende de sí mismo
// ports/incoming (driven) - Casos de uso
// ports/outgoing (driving) - Interfaces que necesita el dominio

// Domain
class Order {
  constructor(
    public readonly id: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public status: OrderStatus = 'pending'
  ) {}
  
  calculateTotal(): Money {
    return this.items.reduce(
      (sum, item) => sum.add(item.price.multiply(item.quantity)),
      Money.zero()
    );
  }
  
  confirm(): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending orders can be confirmed');
    }
    this.status = 'confirmed';
  }
}

// Incoming Port (Driven) - Lo que la app puede hacer
interface OrderService {
  createOrder(customerId: string, items: OrderItem[]): Promise<Order>;
  confirmOrder(orderId: string): Promise<Order>;
  getOrder(orderId: string): Promise<Order | null>;
}

// Outgoing Ports (Driving) - Lo que la app necesita
interface ForStoringOrders {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

interface ForInventory {
  checkAvailability(productId: string, quantity: number): Promise<boolean>;
  reserve(productId: string, quantity: number): Promise<void>;
}

interface ForPayment {
  charge(amount: Money, customerId: string): Promise<PaymentResult>;
}

// Core Service Implementation
class OrderServiceImpl implements OrderService {
  constructor(
    private orderStore: ForStoringOrders,
    private inventory: ForInventory,
    private payment: ForPayment
  ) {}
  
  async createOrder(customerId: string, items: OrderItem[]): Promise<Order> {
    // Check inventory
    for (const item of items) {
      const available = await this.inventory.checkAvailability(
        item.productId,
        item.quantity
      );
      if (!available) {
        throw new Error(`Product ${item.productId} not available`);
      }
    }
    
    // Reserve inventory
    for (const item of items) {
      await this.inventory.reserve(item.productId, item.quantity);
    }
    
    const order = new Order(generateId(), customerId, items);
    await this.orderStore.save(order);
    
    return order;
  }
  
  async confirmOrder(orderId: string): Promise<Order> {
    const order = await this.orderStore.findById(orderId);
    if (!order) throw new Error('Order not found');
    
    const total = order.calculateTotal();
    const payment = await this.payment.charge(total, order.customerId);
    
    if (!payment.success) {
      throw new Error(`Payment failed: ${payment.error}`);
    }
    
    order.confirm();
    await this.orderStore.save(order);
    
    return order;
  }
  
  async getOrder(orderId: string): Promise<Order | null> {
    return this.orderStore.findById(orderId);
  }
}

// Adapters - Implementaciones de los puertos
// Secondary Adapters (Infrastructure)
class PrismaOrderRepository implements ForStoringOrders {
  async save(order: Order): Promise<void> {
    await prisma.order.upsert({
      where: { id: order.id },
      update: { status: order.status },
      create: {
        id: order.id,
        customerId: order.customerId,
        items: order.items,
        status: order.status
      }
    });
  }
  
  async findById(id: string): Promise<Order | null> {
    const data = await prisma.order.findUnique({ where: { id } });
    return data ? this.toDomain(data) : null;
  }
  
  private toDomain(data: PrismaOrder): Order {
    return new Order(data.id, data.customerId, data.items, data.status);
  }
}

class HttpInventoryAdapter implements ForInventory {
  constructor(private baseUrl: string) {}
  
  async checkAvailability(productId: string, quantity: number): Promise<boolean> {
    const response = await fetch(
      `${this.baseUrl}/products/${productId}/availability?qty=${quantity}`
    );
    const data = await response.json();
    return data.available;
  }
  
  async reserve(productId: string, quantity: number): Promise<void> {
    await fetch(`${this.baseUrl}/products/${productId}/reserve`, {
      method: 'POST',
      body: JSON.stringify({ quantity })
    });
  }
}

class StripePaymentAdapter implements ForPayment {
  constructor(private stripe: Stripe) {}
  
  async charge(amount: Money, customerId: string): Promise<PaymentResult> {
    try {
      const payment = await this.stripe.paymentIntents.create({
        amount: amount.cents,
        currency: amount.currency,
        customer: customerId
      });
      return { success: true, transactionId: payment.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

// Primary Adapter (Driving) - API REST
class OrderController {
  constructor(private orderService: OrderService) {}
  
  async create(req: Request, res: Response) {
    try {
      const order = await this.orderService.createOrder(
        req.body.customerId,
        req.body.items
      );
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  async confirm(req: Request, res: Response) {
    try {
      const order = await this.orderService.confirmOrder(req.params.id);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

// Configuration / Composition Root
function createOrderController(): OrderController {
  const orderRepo = new PrismaOrderRepository();
  const inventory = new HttpInventoryAdapter(process.env.INVENTORY_URL!);
  const payment = new StripePaymentAdapter(new Stripe(process.env.STRIPE_KEY!));
  
  const orderService = new OrderServiceImpl(orderRepo, inventory, payment);
  
  return new OrderController(orderService);
}
```

---

## CQRS (Command Query Responsibility Segregation)

```typescript
// Commands - Modifican estado
interface Command<TInput, TResult> {
  execute(input: TInput): Promise<TResult>;
}

class CreateUserCommand implements Command<CreateUserInput, User> {
  constructor(
    private userRepo: UserWriteRepository,
    private eventBus: EventBus
  ) {}
  
  async execute(input: CreateUserInput): Promise<User> {
    const user = User.create(input);
    await this.userRepo.save(user);
    await this.eventBus.publish(new UserCreatedEvent(user));
    return user;
  }
}

class UpdateUserCommand implements Command<UpdateUserInput, User> {
  constructor(
    private userRepo: UserWriteRepository,
    private eventBus: EventBus
  ) {}
  
  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findById(input.id);
    if (!user) throw new Error('User not found');
    
    user.update(input);
    await this.userRepo.save(user);
    await this.eventBus.publish(new UserUpdatedEvent(user));
    return user;
  }
}

// Queries - Solo leen, no modifican
interface Query<TInput, TResult> {
  execute(input: TInput): Promise<TResult>;
}

class GetUserByIdQuery implements Query<string, UserDto | null> {
  constructor(private userRepo: UserReadRepository) {}
  
  async execute(id: string): Promise<UserDto | null> {
    return this.userRepo.findById(id);
  }
}

class SearchUsersQuery implements Query<SearchInput, PaginatedResult<UserDto>> {
  constructor(private userRepo: UserReadRepository) {}
  
  async execute(input: SearchInput): Promise<PaginatedResult<UserDto>> {
    return this.userRepo.search({
      query: input.query,
      page: input.page,
      limit: input.limit,
      sort: input.sort
    });
  }
}

// Modelos de lectura optimizados (pueden ser proyecciones)
interface UserDto {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  memberSince: string;
}

// Repositorios separados
interface UserWriteRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  delete(id: string): Promise<void>;
}

interface UserReadRepository {
  findById(id: string): Promise<UserDto | null>;
  search(params: SearchParams): Promise<PaginatedResult<UserDto>>;
  findByEmail(email: string): Promise<UserDto | null>;
}

// Implementación: Modelo de escritura (SQL normalizado)
class PrismaUserWriteRepository implements UserWriteRepository {
  // Tablas normalizadas, constraints, relaciones
}

// Implementación: Modelo de lectura (optimizado, puede ser NoSQL)
class ElasticUserReadRepository implements UserReadRepository {
  // Índices optimizados para búsqueda
  // Denormalizado para queries rápidas
}

// Mediator para coordinar
class CommandBus {
  private handlers = new Map<string, Command<unknown, unknown>>();
  
  register<TInput, TResult>(
    name: string,
    command: Command<TInput, TResult>
  ): void {
    this.handlers.set(name, command as Command<unknown, unknown>);
  }
  
  async execute<TInput, TResult>(name: string, input: TInput): Promise<TResult> {
    const handler = this.handlers.get(name);
    if (!handler) throw new Error(`Command ${name} not registered`);
    return handler.execute(input) as Promise<TResult>;
  }
}

// Uso
const commandBus = new CommandBus();
commandBus.register('createUser', new CreateUserCommand(writeRepo, eventBus));
commandBus.register('updateUser', new UpdateUserCommand(writeRepo, eventBus));

const queryBus = new QueryBus();
queryBus.register('getUser', new GetUserByIdQuery(readRepo));
queryBus.register('searchUsers', new SearchUsersQuery(readRepo));

// API
app.post('/users', async (req, res) => {
  const user = await commandBus.execute('createUser', req.body);
  res.json(user);
});

app.get('/users/search', async (req, res) => {
  const results = await queryBus.execute('searchUsers', req.query);
  res.json(results);
});
```

---

## Event Sourcing

```typescript
interface DomainEvent {
  readonly type: string;
  readonly aggregateId: string;
  readonly timestamp: Date;
  readonly version: number;
  readonly payload: unknown;
}

class OrderCreatedEvent implements DomainEvent {
  readonly type = 'OrderCreated';
  
  constructor(
    readonly aggregateId: string,
    readonly timestamp: Date,
    readonly version: number,
    readonly payload: {
      customerId: string;
      items: OrderItem[];
      total: Money;
    }
  ) {}
}

class OrderConfirmedEvent implements DomainEvent {
  readonly type = 'OrderConfirmed';
  
  constructor(
    readonly aggregateId: string,
    readonly timestamp: Date,
    readonly version: number,
    readonly payload: {
      confirmedAt: Date;
      paymentId: string;
    }
  ) {}
}

class OrderShippedEvent implements DomainEvent {
  readonly type = 'OrderShipped';
  
  constructor(
    readonly aggregateId: string,
    readonly timestamp: Date,
    readonly version: number,
    readonly payload: {
      trackingNumber: string;
      shippedAt: Date;
    }
  ) {}
}

// Aggregate que se reconstruye desde eventos
class OrderAggregate {
  private events: DomainEvent[] = [];
  private version = 0;
  
  constructor(
    public readonly id: string,
    public status: 'pending' | 'confirmed' | 'shipped' | 'cancelled' = 'pending',
    public customerId?: string,
    public items: OrderItem[] = [],
    public total?: Money,
    public trackingNumber?: string
  ) {}
  
  // Factory method: reconstruir desde eventos
  static reconstitute(id: string, events: DomainEvent[]): OrderAggregate {
    const order = new OrderAggregate(id);
    for (const event of events) {
      order.apply(event);
    }
    return order;
  }
  
  // Crear nueva orden
  static create(customerId: string, items: OrderItem[]): OrderAggregate {
    const order = new OrderAggregate(generateId());
    const total = items.reduce(
      (sum, item) => sum.add(item.price.multiply(item.quantity)),
      Money.zero()
    );
    
    order.raiseEvent(new OrderCreatedEvent(
      order.id,
      new Date(),
      1,
      { customerId, items, total }
    ));
    
    return order;
  }
  
  confirm(paymentId: string): void {
    if (this.status !== 'pending') {
      throw new Error('Only pending orders can be confirmed');
    }
    
    this.raiseEvent(new OrderConfirmedEvent(
      this.id,
      new Date(),
      this.version + 1,
      { confirmedAt: new Date(), paymentId }
    ));
  }
  
  ship(trackingNumber: string): void {
    if (this.status !== 'confirmed') {
      throw new Error('Only confirmed orders can be shipped');
    }
    
    this.raiseEvent(new OrderShippedEvent(
      this.id,
      new Date(),
      this.version + 1,
      { trackingNumber, shippedAt: new Date() }
    ));
  }
  
  private raiseEvent(event: DomainEvent): void {
    this.apply(event);
    this.events.push(event);
    this.version = event.version;
  }
  
  private apply(event: DomainEvent): void {
    switch (event.type) {
      case 'OrderCreated':
        const created = event as OrderCreatedEvent;
        this.customerId = created.payload.customerId;
        this.items = created.payload.items;
        this.total = created.payload.total;
        this.status = 'pending';
        break;
        
      case 'OrderConfirmed':
        this.status = 'confirmed';
        break;
        
      case 'OrderShipped':
        const shipped = event as OrderShippedEvent;
        this.trackingNumber = shipped.payload.trackingNumber;
        this.status = 'shipped';
        break;
    }
  }
  
  getUncommittedEvents(): DomainEvent[] {
    return [...this.events];
  }
  
  commit(): void {
    this.events = [];
  }
}

// Event Store
interface EventStore {
  append(events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getAllEvents(since?: Date): Promise<DomainEvent[]>;
}

class PostgreSQLEventStore implements EventStore {
  constructor(private db: Knex) {}
  
  async append(events: DomainEvent[]): Promise<void> {
    const records = events.map(e => ({
      aggregate_id: e.aggregateId,
      type: e.type,
      version: e.version,
      payload: JSON.stringify(e.payload),
      timestamp: e.timestamp
    }));
    
    await this.db('events').insert(records);
  }
  
  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    const rows = await this.db('events')
      .where('aggregate_id', aggregateId)
      .orderBy('version', 'asc');
    
    return rows.map(this.toDomainEvent);
  }
  
  private toDomainEvent(row: any): DomainEvent {
    return {
      type: row.type,
      aggregateId: row.aggregate_id,
      version: row.version,
      timestamp: row.timestamp,
      payload: JSON.parse(row.payload)
    } as DomainEvent;
  }
}

// Repository
class OrderRepository {
  constructor(private eventStore: EventStore) {}
  
  async findById(id: string): Promise<OrderAggregate> {
    const events = await this.eventStore.getEvents(id);
    if (events.length === 0) return null;
    return OrderAggregate.reconstitute(id, events);
  }
  
  async save(order: OrderAggregate): Promise<void> {
    const uncommitted = order.getUncommittedEvents();
    if (uncommitted.length > 0) {
      await this.eventStore.append(uncommitted);
      order.commit();
    }
  }
}

// Projections (vistas de lectura)
interface OrderProjection {
  id: string;
  customerId: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

class OrderProjectionHandler {
  constructor(private readDb: Database) {}
  
  async handle(event: DomainEvent): Promise<void> {
    switch (event.type) {
      case 'OrderCreated':
        await this.handleOrderCreated(event as OrderCreatedEvent);
        break;
      case 'OrderConfirmed':
        await this.handleOrderConfirmed(event as OrderConfirmedEvent);
        break;
      case 'OrderShipped':
        await this.handleOrderShipped(event as OrderShippedEvent);
        break;
    }
  }
  
  private async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.readDb('order_projections').insert({
      id: event.aggregateId,
      customer_id: event.payload.customerId,
      status: 'pending',
      total: event.payload.total.amount,
      item_count: event.payload.items.length,
      created_at: event.timestamp,
      updated_at: event.timestamp
    });
  }
  
  private async handleOrderConfirmed(event: OrderConfirmedEvent): Promise<void> {
    await this.readDb('order_projections')
      .where('id', event.aggregateId)
      .update({
        status: 'confirmed',
        updated_at: event.timestamp
      });
  }
  
  private async handleOrderShipped(event: OrderShippedEvent): Promise<void> {
    await this.readDb('order_projections')
      .where('id', event.aggregateId)
      .update({
        status: 'shipped',
        tracking_number: event.payload.trackingNumber,
        updated_at: event.timestamp
      });
  }
}
```
