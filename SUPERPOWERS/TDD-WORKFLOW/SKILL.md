---
name: tdd-workflow
description: Test-Driven Development workflow for reliable code. Use (1) For API routes/endpoints, (2) Utility functions, (3) Business logic, (4) Data transformation. MANDATORY for logic-heavy code.
metadata:
  tags: tdd, testing, unit-tests, test-driven-development, quality
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: high
---

# TDD Workflow Master System

**Red. Green. Refactor. Repeat.**

---

## The TDD Doctrine

### Core Principles

1. **Tests Define Behavior** - If it's not tested, it doesn't exist
2. **Fail First** - See it break, then make it work
3. **Minimal Implementation** - Write just enough to pass
4. **Refactor Confidently** - Tests are your safety net
5. **Fast Feedback** - Tests should run in seconds

---

## When to Use TDD

### Mandatory

```
MUST use TDD for:
├── API routes and endpoints
├── Utility/helper functions
├── Business logic and calculations
├── Data transformation functions
├── Validation functions
└── Any code with predictable inputs/outputs
```

### Skip TDD

```
SKIP TDD for:
├── Pure UI components (visual only)
├── CSS/Tailwind styling
├── Animation code
├── Static content
├── One-time scripts
└── Exploration/spike code
```

---

## The Red-Green-Refactor Cycle

### Phase 1: RED - Write Failing Test

Load [rules/writing-tests.md](./rules/writing-tests.md) for test patterns.

```typescript
// __tests__/calculateTotal.test.ts
import { calculateTotal } from '@/lib/calculateTotal'

describe('calculateTotal', () => {
  it('should sum items and apply tax', () => {
    // Arrange
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ]
    const taxRate = 0.21  // 21% VAT
    
    // Act
    const result = calculateTotal(items, taxRate)
    
    // Assert
    // 250 subtotal + 52.50 tax = 302.50
    expect(result).toBe(302.5)
  })
  
  it('should handle empty cart', () => {
    const result = calculateTotal([], 0.21)
    expect(result).toBe(0)
  })
  
  it('should throw on negative tax', () => {
    expect(() => calculateTotal([], -0.1))
      .toThrow('Tax rate must be between 0 and 1')
  })
  
  it('should throw on invalid items', () => {
    expect(() => calculateTotal(null, 0.21))
      .toThrow('Items must be an array')
  })
})
```

**Run test**: `npm test calculateTotal`  
**Verify**: Test FAILS (RED) ✓

---

### Phase 2: GREEN - Write Minimal Code

```typescript
// lib/calculateTotal.ts
export function calculateTotal(
  items: Array<{ price: number; quantity: number }>,
  taxRate: number
): number {
  if (taxRate < 0 || taxRate > 1) {
    throw new Error('Tax rate must be between 0 and 1')
  }
  
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array')
  }
  
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  
  return subtotal * (1 + taxRate)
}
```

**Run test**: `npm test calculateTotal`  
**Verify**: Test PASSES (GREEN) ✓

---

### Phase 3: REFACTOR - Clean Code

```typescript
// lib/calculateTotal.ts
interface CartItem {
  price: number
  quantity: number
}

export function calculateTotal(items: CartItem[], taxRate: number): number {
  validateTaxRate(taxRate)
  validateItems(items)
  
  const subtotal = calculateSubtotal(items)
  return applyTax(subtotal, taxRate)
}

function validateTaxRate(rate: number): void {
  if (rate < 0 || rate > 1) {
    throw new Error('Tax rate must be between 0 and 1')
  }
}

function validateItems(items: unknown): asserts items is CartItem[] {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array')
  }
}

function calculateSubtotal(items: CartItem[]): number {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
}

function applyTax(amount: number, taxRate: number): number {
  return amount * (1 + taxRate)
}
```

**Run test**: Verify still passes  
**Commit**: "refactor: Extract validation and calculation helpers"

---

## Testing Patterns

### API Route Testing

```typescript
// __tests__/api/contact.test.ts
import { POST } from '@/app/api/contact/route'

describe('POST /api/contact', () => {
  it('should send email on valid data', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'Hello!'
      })
    })
    
    const response = await POST(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })
  
  it('should reject invalid email', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John',
        email: 'invalid-email',
        message: 'Hello'
      })
    })
    
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
  
  it('should reject missing fields', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify({ name: 'John' })
    })
    
    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

### Async Testing

```typescript
describe('fetchUser', () => {
  it('should return user data', async () => {
    const user = await fetchUser('user-123')
    expect(user.id).toBe('user-123')
    expect(user.name).toBeDefined()
  })
  
  it('should throw on invalid ID', async () => {
    await expect(fetchUser('invalid'))
      .rejects
      .toThrow('User not found')
  })
  
  it('should handle network error', async () => {
    server.use(
      http.get('/api/user/*', () => {
        return new HttpResponse(null, { status: 500 })
      })
    )
    
    await expect(fetchUser('user-123'))
      .rejects
      .toThrow('Network error')
  })
})
```

### Mocking

```typescript
// Mock external service
jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true })
}))

// Mock fetch
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({ data: 'mocked' })
})

// Mock module with MSW
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/user/:id', ({ params }) => {
    return HttpResponse.json({ id: params.id, name: 'Test User' })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

---

## Test Structure

### AAA Pattern

```typescript
it('should do something', () => {
  // Arrange - Setup
  const input = { name: 'Test', value: 100 }
  
  // Act - Execute
  const result = processData(input)
  
  // Assert - Verify
  expect(result.processed).toBe(true)
  expect(result.value).toBe(100)
})
```

### Test Naming

```typescript
// Good: Descriptive, specific
it('should calculate total with 21% VAT')
it('should throw ValidationError when email is invalid')
it('should return null for non-existent user')

// Bad: Vague
it('works')
it('test 1')
it('handles stuff')
```

---

## Coverage Requirements

```
TARGETS:
├── Statements: 80%+
├── Branches: 75%
├── Functions: 80%+
├── Lines: 80%+
└── Critical paths: 100%

MUST COVER:
├── Happy path (normal input)
├── Edge cases (boundaries)
├── Error cases (invalid input)
├── Null/undefined handling
└── Async error handling
```

---

## Anti-Patterns

❌ Writing implementation before test  
❌ Writing multiple tests at once  
❌ Tests that don't fail first  
❌ Testing implementation details  
❌ Skipping refactor phase  
❌ Slow tests  
❌ Interdependent tests  

---

## Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test calculateTotal

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# Update snapshots
npm test -- --updateSnapshot
```

---

## TDD Checklist

- [ ] Test written first
- [ ] Test fails (RED)
- [ ] Minimal implementation (GREEN)
- [ ] Code refactored
- [ ] All tests pass
- [ ] Edge cases covered
- [ ] Error cases tested
- [ ] Coverage acceptable
- [ ] Committed with clear message

---

**Test first. Code with confidence. Refactor without fear.**
