---
name: maintainability
description: Code structure, readability, and maintainability patterns. Load during Pillar 4 of code-review to ensure code is maintainable.
metadata:
  tags: maintainability, clean-code, refactoring, code-structure, readability
---

# Maintainability Standards

**Code is read 10x more than it is written. Write for the reader.**

---

## Naming Conventions

### Variables

```typescript
// WRONG: Unclear names
const d = new Date()
const x = calculate(a, b)
const data = fetchData()

// CORRECT: Descriptive names
const currentDate = new Date()
const totalPrice = calculateOrderTotal(itemPrice, taxRate)
const userProfile = fetchUserProfile(userId)

// Boolean naming
isActive, hasPermission, canEdit, shouldRetry

// Collection naming
users (not userList), activeOrders (not orderData)
```

### Functions

```typescript
// WRONG: Vague function name
function process(data) { }

// CORRECT: Verb + object + context
function validateUserEmail(email: string): boolean { }
function formatCurrency(amount: number, currency: string): string { }
function calculateCartTotal(items: CartItem[]): number { }
```

---

## Function Design

### Single Responsibility

```typescript
// WRONG: Multiple responsibilities
function handleUser(user) {
  validateUser(user)
  saveToDatabase(user)
  sendWelcomeEmail(user)
  updateAnalytics(user)
}

// CORRECT: Split by responsibility
async function registerUser(userData: UserInput): Promise<User> {
  const validatedUser = validateUser(userData)
  const user = await userRepository.save(validatedUser)
  await notificationService.sendWelcomeEmail(user)
  analytics.track('user_registered', { userId: user.id })
  return user
}
```

### Function Size

```
TARGET: Functions under 50 lines
IDEAL: Functions under 20 lines
EXCEPTION: Switch statements, configuration objects

When to split:
├── Nested conditionals (>2 levels)
├── Multiple return paths
├── Comments explaining sections
└── Reusable logic blocks
```

---

## Code Organization

### File Structure

```
src/
├── components/        # React components
│   ├── ui/           # Reusable UI components
│   └── features/     # Feature-specific components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── services/         # API/external services
├── types/            # TypeScript types
├── constants/        # App constants
└── styles/           # Global styles
```

### Import Organization

```typescript
// 1. External dependencies
import React from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Internal absolute imports
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

// 3. Internal relative imports
import { UserCard } from './UserCard'
import { styles } from './styles.module.css'

// 4. Types
import type { User } from '@/types'
```

---

## Comments

### When to Comment

```typescript
// GOOD: Explain WHY, not WHAT
// Using debounce because search API has rate limiting
const debouncedSearch = debounce(search, 300)

// GOOD: Document complex algorithms
// Using Fisher-Yates shuffle for unbiased randomization
function shuffleArray<T>(array: T[]): T[] {
  // ...implementation
}

// GOOD: TODO with context
// TODO: Add pagination when dataset exceeds 1000 items
// See: https://github.com/org/project/issues/123

// BAD: Obvious comment
// Increment counter
counter++
```

---

## Maintainability Checklist

- [ ] Variable names are descriptive
- [ ] Functions do one thing
- [ ] Functions are under 50 lines
- [ ] No magic numbers/strings
- [ ] Complex logic is explained
- [ ] File structure is logical
- [ ] Imports are organized
- [ ] Comments explain why, not what
- [ ] No duplicated code
- [ ] Error handling is consistent
