# Patrones de Testing

## Unit Testing

```typescript
// Test doubles
class MockUserRepository implements UserRepository {
  private users: User[] = [];
  private findByIdMock = jest.fn();
  private saveMock = jest.fn();

  findById(id: string): Promise<User | null> {
    return this.findByIdMock(id);
  }

  save(user: User): Promise<void> {
    return this.saveMock(user);
  }

  setFindByIdResult(result: User | null): void {
    this.findByIdMock.mockResolvedValue(result);
  }

  setSaveResult(error?: Error): void {
    if (error) {
      this.saveMock.mockRejectedValue(error);
    } else {
      this.saveMock.mockResolvedValue(undefined);
    }
  }

  assertFindByIdCalledWith(id: string): void {
    expect(this.findByIdMock).toHaveBeenCalledWith(id);
  }

  assertSaveCalledWith(user: User): void {
    expect(this.saveMock).toHaveBeenCalledWith(user);
  }
}

// Spy pattern
class SpyEmailService implements EmailService {
  sentEmails: Array<{ to: string; subject: string; body: string }> = [];

  async send(to: string, subject: string, body: string): Promise<void> {
    this.sentEmails.push({ to, subject, body });
  }

  wasEmailSentTo(email: string): boolean {
    return this.sentEmails.some(e => e.to === email);
  }

  getEmailsFor(recipient: string): typeof this.sentEmails {
    return this.sentEmails.filter(e => e.to === recipient);
  }
}

// Factory para fixtures
class UserFactory {
  static create(overrides: Partial<User> = {}): User {
    return {
      id: crypto.randomUUID(),
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date(),
      ...overrides
    };
  }

  static createMany(count: number, overrides: Partial<User> = {}): User[] {
    return Array.from({ length: count }, (_, i) => 
      this.create({ ...overrides, email: `user${i}@example.com` })
    );
  }
}

// Object Mother
class OrderMother {
  static aNewOrder(): Order {
    return {
      id: crypto.randomUUID(),
      status: 'pending',
      items: [],
      total: 0,
      createdAt: new Date()
    };
  }

  static withItems(...items: OrderItem[]): Order {
    const order = this.aNewOrder();
    order.items = items;
    order.total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return order;
  }

  static confirmed(): Order {
    return { ...this.aNewOrder(), status: 'confirmed' };
  }
}
```

---

## Integration Testing

```typescript
// Test container pattern
class TestDatabase {
  private container: PostgreSqlContainer;
  private connection: any;

  async start(): Promise<void> {
    this.container = await new PostgreSqlContainer()
      .withDatabase('test')
      .withUsername('test')
      .withPassword('test')
      .start();

    this.connection = await createConnection({
      url: this.container.getConnectionUri(),
      // ...
    });
  }

  async stop(): Promise<void> {
    await this.connection?.close();
    await this.container?.stop();
  }

  async clean(): Promise<void> {
    // Truncar todas las tablas
    await this.connection.query('TRUNCATE TABLE users, orders CASCADE');
  }

  async seed(data: TestData): Promise<void> {
    // Insertar datos de prueba
  }
}

// API Testing
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const handlers = [
  rest.get('/api/users/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        name: 'Mock User'
      })
    );
  }),

  rest.post('/api/orders', async (req, res, ctx) => {
    const body = await req.json();
    
    if (!body.items?.length) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Items required' })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: crypto.randomUUID(),
        ...body,
        status: 'created'
      })
    );
  })
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// E2E con Playwright
test.describe('User Registration Flow', () => {
  test('new user can complete registration', async ({ page }) => {
    // Arrange
    await page.goto('/register');
    
    // Act
    await page.fill('[name="email"]', 'newuser@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="confirmPassword"]', 'SecurePass123!');
    await page.click('button[type="submit"]');
    
    // Assert
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-message"]'))
      .toContainText('Welcome, newuser');
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/register');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[data-testid="email-error"]'))
      .toContainText('Email is required');
  });
});
```

---

## Property-Based Testing

```typescript
import { fc, test as propertyTest } from '@fast-check/vitest';

// Test de propiedades
propertyTest('sorting maintains all elements', [fc.array(fc.integer())], (arr) => {
  const sorted = [...arr].sort((a, b) => a - b);
  
  // Propiedad: mismo tamaño
  expect(sorted).toHaveLength(arr.length);
  
  // Propiedad: mismos elementos
  expect(sorted).toEqual(expect.arrayContaining(arr));
  
  // Propiedad: ordenado
  for (let i = 1; i < sorted.length; i++) {
    expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]);
  }
});

// Custom arbitraries
const UserArbitrary = fc.record({
  id: fc.uuid(),
  email: fc.emailAddress(),
  age: fc.integer({ min: 18, max: 120 }),
  name: fc.string({ minLength: 1, maxLength: 100 })
});

propertyTest('user validation accepts valid users', [UserArbitrary], (user) => {
  const result = validateUser(user);
  expect(result.isValid).toBe(true);
});
```
