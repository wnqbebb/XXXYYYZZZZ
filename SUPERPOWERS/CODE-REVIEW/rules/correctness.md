---
name: correctness
description: Logic verification, type safety, and error handling patterns. Load during Pillar 1 of code-review to verify code correctness and robustness.
metadata:
  tags: correctness, logic, types, error-handling, edge-cases, testing
---

# Correctness Verification

**Ensuring code works correctly in all scenarios.**

---

## Logic Verification

### The Logic Checklist

```
CONTROL FLOW:
├─ Are all code paths reachable?
├─ Are all branches tested?
├─ Are early returns used appropriately?
├─ Is nesting manageable (≤3 levels)?
└─ Are switch statements exhaustive?

EDGE CASES:
├─ Empty inputs ("", [], {}, null, undefined)
├─ Single item inputs
├─ Maximum size inputs
├─ Boundary values (0, -1, MAX_INT)
├─ Special characters and encoding
├─ Concurrent access scenarios
└─ Network failure scenarios

ALGORITHMS:
├─ Is the algorithm correct?
├─ What's the time complexity?
├─ What's the space complexity?
├─ Does it handle worst-case input?
└─ Is there a simpler approach?
```

### Common Logic Errors

**Off-by-One Errors**:
```typescript
// WRONG: Loop excludes last item
for (let i = 0; i < items.length - 1; i++)

// CORRECT: Loop includes all items
for (let i = 0; i < items.length; i++)

// BETTER: Use iterator
for (const item of items)
```

**Short-Circuit Gotchas**:
```typescript
// WRONG: 0 is falsy
if (count && count > 0)  // fails when count is 0

// CORRECT: Explicit null check
if (count !== null && count > 0)

// OR: Use nullish coalescing
if ((count ?? 0) > 0)
```

**Async/Await Pitfalls**:
```typescript
// WRONG: Missing await
async function getData() {
  const data = fetch('/api/data')  // Returns Promise, not data
  return data.json()  // TypeError
}

// CORRECT: Properly awaited
async function getData() {
  const response = await fetch('/api/data')
  return response.json()
}

// WRONG: Fire-and-forget error
async function saveData() {
  updateDatabase()  // Errors silently swallowed
}

// CORRECT: Handle or propagate
async function saveData() {
  await updateDatabase()  // Errors will bubble up
}
```

---

## Type Safety

### TypeScript Best Practices

```
STRICT MODE REQUIREMENTS:
├── "strict": true in tsconfig.json
├── No implicit any
├── Strict null checks
├── Strict function types
└── No unchecked indexed access
```

**Type Definition Patterns**:
```typescript
// PREFER: Interface for object shapes
interface User {
  id: string
  name: string
  email: string
}

// PREFER: Type for unions/tuples
type Status = 'idle' | 'loading' | 'success' | 'error'
type Point = [number, number]

// AVOID: any
function process(data: any)  // ❌

// PREFER: unknown with type guard
function process(data: unknown) {
  if (isValidData(data)) {
    // data is narrowed here
  }
}
```

**Exhaustive Type Checking**:
```typescript
// WRONG: Missing case handling
type Action = { type: 'increment' } | { type: 'decrement' }

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1
    // 'decrement' not handled!
  }
}

// CORRECT: Exhaustive switch with compile-time check
function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'increment': return state + 1
    case 'decrement': return state - 1
    default:
      // Compile error if any case missing
      const _exhaustive: never = action
      return _exhaustive
  }
}
```

**Null Safety**:
```typescript
// WRONG: Potential null access
function getName(user: User | null) {
  return user.name  // Runtime error if null
}

// CORRECT: Null check
function getName(user: User | null) {
  if (!user) return null
  return user.name
}

// CORRECT: Optional chaining
function getName(user: User | null) {
  return user?.name ?? 'Anonymous'
}

// WRONG: Type assertion without check
const input = document.getElementById('name') as HTMLInputElement
input.value  // Runtime error if element not found

// CORRECT: Runtime check with type guard
const input = document.getElementById('name')
if (input instanceof HTMLInputElement) {
  console.log(input.value)
}
```

---

## Error Handling

### Error Handling Patterns

**The Error Handling Spectrum**:
```
CRASH (Fail Fast) ←───────→ RECOVER (Graceful Degradation)

Use CRASH when:
├── Programming error (should never happen)
├── Required configuration missing
├── Critical invariant violated
└── Early development (fail fast to fix fast)

Use RECOVER when:
├── User input error
├── Network transient failure
├── Optional feature unavailable
└── Non-critical operation failed
```

**Try/Catch Best Practices**:
```typescript
// WRONG: Empty catch
async function fetchData() {
  try {
    return await api.get('/data')
  } catch (e) {
    // Silently fails!
  }
}

// CORRECT: Handle or re-throw
async function fetchData() {
  try {
    return await api.get('/data')
  } catch (error) {
    if (error instanceof NetworkError) {
      // Retry or show user-friendly message
      throw new UserFacingError('Connection failed. Please try again.')
    }
    throw error  // Re-throw unexpected errors
  }
}

// CORRECT: Error boundaries (React)
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, info: ErrorInfo) {
    logErrorToService(error, info)
    this.setState({ hasError: true })
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

**Custom Error Classes**:
```typescript
// Define domain-specific errors
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public code: string
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with id ${id} not found`)
    this.name = 'NotFoundError'
  }
}

// Use for specific handling
app.get('/user/:id', async (req, res) => {
  try {
    const user = await getUser(req.params.id)
    res.json(user)
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message })
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ 
        error: error.message,
        field: error.field,
        code: error.code
      })
    }
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

---

## Testing for Correctness

### Test Structure

**The AAA Pattern**:
```typescript
describe('calculateTotal', () => {
  it('should apply discount correctly', () => {
    // ARRANGE: Set up test data
    const items = [
      { price: 100, quantity: 2 },
      { price: 50, quantity: 1 }
    ]
    const discount = 0.1
    
    // ACT: Execute the code under test
    const result = calculateTotal(items, discount)
    
    // ASSERT: Verify the outcome
    expect(result).toBe(225) // (250 * 0.9)
  })
})
```

**Test Coverage Requirements**:
```
MUST TEST:
├── Happy path (normal input)
├── Edge cases (boundaries)
├── Error cases (invalid input)
├── Null/undefined handling
├── Empty collections
└── Maximum size inputs

COVERAGE TARGETS:
├── Statements: 80%+
├── Branches: 75%+
├── Functions: 80%+
├── Lines: 80%+
└── Critical paths: 100%
```

**Parameterized Tests**:
```typescript
// Test multiple cases efficiently
describe('isValidEmail', () => {
  it.each([
    ['user@example.com', true],
    ['user.name@example.com', true],
    ['user@sub.example.com', true],
    ['invalid-email', false],
    ['@example.com', false],
    ['user@', false],
    ['', false],
    [null, false],
  ])('isValidEmail(%s) should return %s', (input, expected) => {
    expect(isValidEmail(input)).toBe(expected)
  })
})
```

---

## Edge Case Inventory

### Common Edge Cases by Type

**Strings**:
```typescript
// Empty and whitespace
''
'   '
'\n\t'

// Unicode
'你好世界'
'🎉 Party'
'ñáéíóú'

// Special characters
'<script>alert("xss")</script>'
"'; DROP TABLE users; --"
'NaN'
'Infinity'
```

**Numbers**:
```typescript
0
-0
1
-1
0.1 + 0.2  // 0.30000000000000004
Number.MAX_SAFE_INTEGER
Number.MIN_SAFE_INTEGER
Infinity
-Infinity
NaN
null  // coerces to 0 in numeric context
undefined  // coerces to NaN
```

**Arrays**:
```typescript
[]
[1]
[1, 2, 3]
Array(1000).fill(null)  // Large array
[undefined, null, 0, '', false]  // Falsy values
[[], []]  // Nested arrays
```

**Objects**:
```typescript
{}
{ key: undefined }
Object.create(null)  // Object without prototype
JSON.parse('{"__proto__": {"isAdmin": true}}')  // Prototype pollution
```

---

## Assertions and Invariants

### Defensive Programming

```typescript
// Runtime assertions
function divide(a: number, b: number): number {
  console.assert(b !== 0, 'Division by zero')
  console.assert(typeof a === 'number', 'a must be a number')
  console.assert(typeof b === 'number', 'b must be a number')
  
  return a / b
}

// Invariant checks
class BankAccount {
  private balance: number = 0
  
  withdraw(amount: number): void {
    const newBalance = this.balance - amount
    
    // Post-condition invariant
    if (newBalance < 0) {
      throw new Error('Insufficient funds')
    }
    
    this.balance = newBalance
    
    // Verify invariant holds
    console.assert(this.balance >= 0, 'Balance must be non-negative')
  }
}
```

---

## Correctness Checklist

- [ ] All code paths are reachable
- [ ] Edge cases are handled
- [ ] TypeScript types are accurate and strict
- [ ] No implicit any types
- [ ] Union types are handled exhaustively
- [ ] Null/undefined are checked before access
- [ ] Errors are caught and handled appropriately
- [ ] Tests cover happy path and edge cases
- [ ] No console.log left in production code
- [ ] Assertions verify critical invariants
