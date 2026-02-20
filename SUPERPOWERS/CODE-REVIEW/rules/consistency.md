---
name: consistency
description: Code style, patterns, and consistency enforcement. Load during Pillar 5 of code-review to ensure consistency across codebase.
metadata:
  tags: consistency, style-guide, linting, formatting, patterns
---

# Consistency Standards

**Consistency reduces cognitive load and accelerates development.**

---

## Project Conventions

### Style Enforcement

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['warn', { allow: ['error'] }],
  }
}

// prettier.config.js
module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  tabWidth: 2,
  printWidth: 100,
}
```

### Pattern Consistency

```typescript
// Choose one pattern and stick to it

// Option A: Type inference
const user = await getUser(id)  // Type inferred

// Option B: Explicit types  
const user: User = await getUser(id)

// CONSISTENCY: Use one approach throughout
```

---

## Framework Patterns

### React Conventions

```typescript
// Component structure
interface Props {
  title: string
  onClick?: () => void
}

export function Button({ title, onClick }: Props) {
  // Component body
}

// Hook order (always same)
function Component() {
  // 1. State
  const [count, setCount] = useState(0)
  
  // 2. Context
  const theme = useTheme()
  
  // 3. Custom hooks
  const data = useFetch('/api/data')
  
  // 4. Derived state (useMemo)
  const doubled = useMemo(() => count * 2, [count])
  
  // 5. Effects (last)
  useEffect(() => {
    // side effects
  }, [])
  
  // 6. Handlers
  const handleClick = () => setCount(c => c + 1)
  
  // 7. Render
  return <button onClick={handleClick}>{title}</button>
}
```

---

## Consistency Checklist

- [ ] ESLint passes without warnings
- [ ] Prettier formatting applied
- [ ] Naming conventions followed
- [ ] Import order consistent
- [ ] Same patterns as rest of codebase
- [ ] Framework conventions respected
- [ ] File naming follows convention
- [ ] Error handling patterns match
