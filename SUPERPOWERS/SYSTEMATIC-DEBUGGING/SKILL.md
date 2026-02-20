---
name: systematic-debugging
description: Methodical debugging workflow for root cause analysis. Use (1) When code throws errors, (2) Features don't work as expected, (3) Bugs reported, (4) Unexpected behavior. MANDATORY for problem-solving.
metadata:
  tags: debugging, troubleshooting, root-cause-analysis, problem-solving
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: critical
---

# Systematic Debugging Master System

**Fix the cause, not the symptom.**

---

## The Debugging Doctrine

### Core Principles

1. **Never Guess** - Hypothesize, test, verify
2. **Reproduce First** - If you can't make it fail, you can't fix it
3. **Divide and Conquer** - Binary search to isolate
4. **Change One Thing** - Controlled experiments only
5. **Document Everything** - Today's fix is tomorrow's knowledge

---

## The 5-Phase Debugging Process

### Phase 1: Reproduction

Load [rules/reproduction.md](./rules/reproduction.md) for reproduction techniques.

**Goal**: Make the bug happen consistently.

```
REPRODUCTION CHECKLIST:
├─ What exact action triggers it?
├─ Is it 100% reproducible or intermittent?
├─ What environment? (dev/staging/prod)
├─ What error message (exact text)?
├─ When did it START failing?
├─ What changed around that time?
└─ Can I make it happen on demand?

REPRODUCTION DOCUMENTATION:
1. Steps to reproduce (numbered)
2. Expected behavior
3. Actual behavior
4. Environment details
5. Screenshots/recordings if visual
```

---

### Phase 2: Isolation

**Goal**: Find the smallest code section causing the bug.

**Technique: Binary Search**

```typescript
// Comment out half the code
// If bug disappears → bug is in commented section
// If bug persists → bug is in remaining section
// Repeat until isolated

// Example:
function processOrder(order) {
  // validateOrder(order)      // COMMENTED - test
  // calculateTax(order)       // COMMENTED - test
  // applyDiscount(order)      // COMMENTED - test
  saveToDatabase(order)        // Keep - test
  // sendConfirmation(order)   // COMMENTED - test
}
```

**Isolation Checkpoints**:
```
Check in order:
1. Input data is what expected?
   console.log('Input:', JSON.stringify(input, null, 2))

2. Function receives correct parameters?
   console.log('Params:', arg1, arg2)

3. Variable values correct at each step?
   console.log('Step 1: value =', value)

4. External dependencies work?
   Test API calls independently
   Mock external services

5. Return value is correct?
   console.log('Return:', result)
```

---

### Phase 3: Analysis

**Goal**: Understand WHY it fails.

**The 5 Whys**:
```
Error: "Cannot read property 'name' of undefined"

Why? → user is undefined
Why? → getUser returned null
Why? → API returned 404
Why? → User ID doesn't exist
Why? → Form submitted with wrong ID

ROOT CAUSE: Form validation missing
```

**Analysis Questions**:
```
├─ What assumption did I make that's wrong?
├─ What value differs from expected?
├─ Did I misunderstand documentation?
├─ Is there a race condition?
├─ Side effect somewhere unexpected?
├─ Type mismatch?
└─ Timing issue?
```

**Debugging Tools**:
```typescript
// Basic logging
console.log('DEBUG: value =', value, 'type =', typeof value)
console.log('DEBUG: state =', JSON.stringify(state, null, 2))

// Stack trace
console.trace('DEBUG: called from')

// Timing
console.time('operation')
// ... code ...
console.timeEnd('operation')

// React DevTools
// - Components tab: Check props/state
// - Profiler: Find unnecessary renders

// Browser DevTools
// - Sources: Set breakpoints
// - Network: Inspect requests
// - Performance: Profile execution
```

---

### Phase 4: Fix & Verify

**Goal**: Fix root cause, not symptoms.

**The Fix Process**:
```
1. HYPOTHESIZE
   "The bug occurs because [root cause]"
   
2. IMPLEMENT
   Make the minimal change to fix
   
3. VERIFY REPRODUCTION
   Run reproduction steps
   Should PASS now
   
4. VERIFY FULL TEST SUITE
   npm test
   All tests should pass
   
5. VERIFY EDGE CASES
   Test related scenarios
   Test boundary conditions
```

**Fix Quality**:
```typescript
// ❌ SYMPTOM FIX (hides the bug)
try { 
  riskyOperation() 
} catch(e) { 
  // Silently ignore
}

// ✅ ROOT CAUSE FIX
if (!isValid(data)) { 
  throw new ValidationError('Invalid data provided')
}
riskyOperation(data)
```

---

### Phase 5: Prevention

**Goal**: Ensure bug never returns.

```
PREVENTION MEASURES:
1. ADD TEST
   Write test that would have caught this bug
   
2. ADD VALIDATION
   Validate inputs earlier
   Add type guards
   
3. ADD DOCUMENTATION
   Comment why this check exists
   Update troubleshooting guide
   
4. ADD MONITORING
   Log if condition occurs
   Alert if pattern detected
   
5. UPDATE PROCESS
   Code review checklist
   Static analysis rules
```

---

## Common Bug Patterns

### React Bugs

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "X is not defined" | Missing import, typo | Check imports, spelling |
| "Cannot read property of undefined" | Null access | Optional chaining `?.` |
| Infinite re-renders | setState in render/useEffect | Fix deps, move state |
| State not updating | Mutating state directly | Use spread `[...]` |
| Effect runs too much | Missing/wrong deps | Fix dependency array |
| "Too many re-renders" | setState in render | Move to event handler |

### JavaScript Bugs

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| NaN | Math with string | `Number()`, `parseInt()` |
| undefined | Missing return | Add return statement |
| [object Object] | Concat object to string | Template literals |
| 1 + 1 = 11 | String concatenation | `parseInt()`, `Number()` |
| async returns undefined | Not awaited | Add `await` |
| Array methods fail | Not an array | Check `Array.isArray()` |

### CSS/Tailwind Bugs

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Styles not applying | Class typo | Check spelling |
| Layout broken | Missing container | Add wrapper |
| Animation not working | Wrong units | Use `transform` |
| Z-index ignored | No position | Add `relative`/`absolute` |
| Flex item won't shrink | `flex-shrink: 0` | Add `shrink-0` or `min-w-0` |

---

## Advanced Techniques

### Git Bisect

```bash
# Find commit that introduced bug
git bisect start
git bisect bad  # Current version has bug
git bisect good v1.0.0  # Old version was fine

# Git checks out middle commit
# Test and mark:
git bisect good  # or: git bisect bad

# Repeat until found
# Git will identify first bad commit
git bisect reset
```

### Rubber Duck Debugging

```
Explain the problem out loud:
"I'm trying to [goal]. The error is [error].
I've checked [list]. I think [hypothesis].
Wait... that doesn't make sense because [realization].
OH! The problem is [root cause]!"
```

---

## Debugging Log Template

```markdown
## Bug Report: [Brief description]

**Symptom**: [What happened]
**Environment**: [Dev/Staging/Prod]
**First Seen**: [Date/Commit]

**Reproduction Steps**:
1. [Step 1]
2. [Step 2]

**Root Cause**: [Why it happened]
**Fix**: [What changed]
**Prevention**: [How to avoid]

**Related**: [Links to issues, PRs]
```

---

## Rule Files Index

| File | Purpose | When to Load |
|------|---------|--------------|
| [reproduction.md](./rules/reproduction.md) | Creating reproductions | Phase 1 |
| [isolation.md](./rules/isolation.md) | Code isolation techniques | Phase 2 |
| [tools.md](./rules/tools.md) | Debugging tools | Phase 3 |

---

## Anti-Patterns

❌ Changing random things hoping it works  
❌ Fixing symptom without understanding cause  
❌ Not testing after "fix"  
❌ Not documenting the fix  
❌ Assuming "just a glitch"  
❌ Debugging without reproduction  
❌ Not using version control during debug  

---

## Debugging Checklist

- [ ] Bug is reproducible
- [ ] Smallest reproduction case identified
- [ ] Root cause understood
- [ ] Fix addresses root cause, not symptom
- [ ] Fix verified with reproduction
- [ ] Full test suite passes
- [ ] Edge cases tested
- [ ] Prevention measures added
- [ ] Documentation updated
- [ ] Bug log created

---

**Debug with method. Fix with confidence. Prevent with wisdom.**
