---
name: code-review
description: Professional code quality assurance and review system. Use (1) BEFORE every commit, (2) After completing any file/component, (3) When user asks "revisa esto", (4) Between implementation tasks, (5) Before marking work complete. MANDATORY quality gate for all code output.
metadata:
  tags: code-review, quality-assurance, best-practices, refactoring, code-quality
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: critical
---

# Code Review Master System

**Quality is not an act, it is a habit. Every line of code is a reflection of your craft.**

---

## The Code Review Doctrine

### Core Principles

1. **Code is Communication** - You write code once, it's read hundreds of times
2. **Bugs are Cheaper Earlier** - Catching issues in review vs production: 100x cost difference
3. **Consistency Breeds Confidence** - Predictable patterns reduce cognitive load
4. **Simplicity is Sophistication** - The best code is the code you don't write
5. **Review is Teaching** - Every review is a knowledge transfer opportunity

### The Reviewer's Mindset

```
You are not looking for:
❌ "How I would have written it"
❌ "Personal style preferences"
❌ "Perfect code" (it doesn't exist)

You are looking for:
✓ Does it work correctly?
✓ Is it maintainable?
✓ Is it secure?
✓ Does it follow agreed patterns?
✓ Would a new team member understand it?
```

---

## When to Review

### Mandatory Checkpoints

```
ALWAYS review before:
├── Every git commit
├── Completing any file or component
├── User asks "revisa esto" or "qué tal se ve"
├── Moving to next task in plan
├── Marking work as "done"
└── Any code handoff to user

Review trigger phrases:
- "Mira esto"
- "Revisa el código"
- "Qué opinas"
- "Está listo"
- "Terminé la función"
```

---

## The 5-Pillar Review Framework

### Pillar 1: Correctness

Load [rules/correctness.md](./rules/correctness.md) for detailed correctness checks.

**Critical Questions**:
```
LOGIC:
├─ Does it handle all edge cases?
├─ Are there off-by-one errors?
├─ Is the algorithm correct?
├─ Does it handle null/undefined properly?
└─ Are there race conditions?

TYPES:
├─ Are TypeScript types accurate?
├─ Are there any implicit any types?
├─ Are union types exhaustive?
└─ Are generic constraints appropriate?

ERRORS:
├─ Are errors handled gracefully?
├─ Are error messages actionable?
├─ Is there proper cleanup on failure?
└─ Are promises properly awaited/catched?
```

### Pillar 2: Performance

Load [rules/performance.md](./rules/performance.md) for optimization patterns.

**Performance Checklist**:
```
RENDER PERFORMANCE:
├─ Are React components memoized when needed?
├─ Are expensive calculations cached?
├─ Are lists virtualized for large datasets?
├─ Are images optimized and lazy-loaded?
└─ Is code-splitting used appropriately?

RUNTIME PERFORMANCE:
├─ Are there unnecessary re-renders?
├─ Are event listeners debounced/throttled?
├─ Are animations using transform/opacity only?
├─ Are large dependencies tree-shakeable?
└─ Is there memory leak potential?

NETWORK PERFORMANCE:
├─ Are API calls batched?
├─ Is caching strategy appropriate?
├─ Are payloads minimized?
└─ Is pagination/infinite scroll implemented?
```

### Pillar 3: Security

Load [rules/security.md](./rules/security.md) for security best practices.

**Security Review Checklist**:
```
INPUT HANDLING:
├─ Is all user input validated?
├─ Is SQL/NoSQL injection prevented?
├─ Is XSS prevention in place?
├─ Are file uploads restricted?
└─ Is output properly escaped?

AUTHENTICATION:
├─ Are routes properly protected?
├─ Are JWTs stored securely?
├─ Is session management correct?
└─ Are permissions checked server-side?

DATA PROTECTION:
├─ Is sensitive data encrypted?
├─ Are API keys in environment variables?
├─ Is PII handled according to GDPR/CCPA?
└─ Are logs free of sensitive data?
```

### Pillar 4: Maintainability

Load [rules/maintainability.md](./rules/maintainability.md) for code structure patterns.

**Maintainability Standards**:
```
READABILITY:
├─ Are variable names descriptive?
├─ Do functions do one thing?
├─ Is the code self-documenting?
├─ Are complex algorithms explained?
└─ Is the file structure logical?

TESTABILITY:
├─ Is logic separated from UI?
├─ Are dependencies injectable?
├─ Are side effects isolated?
├─ Is there test coverage?
└─ Are test descriptions clear?

FLEXIBILITY:
├─ Are magic numbers extracted to constants?
├─ Is configuration externalized?
├─ Are hardcoded values parameterized?
├─ Is the code DRY (but not too DRY)?
└─ Are abstractions at the right level?
```

### Pillar 5: Consistency

Load [rules/consistency.md](./rules/consistency.md) for style and pattern alignment.

**Consistency Dimensions**:
```
PROJECT CONSISTENCY:
├─ Does it follow existing patterns?
├─ Are naming conventions followed?
├─ Is the file structure consistent?
├─ Are imports organized consistently?
└─ Are error handling patterns the same?

FRAMEWORK CONSISTENCY:
├─ Does it follow framework best practices?
├─ Are hooks rules followed (React)?
├─ Are lifecycle methods used correctly?
├─ Are framework-specific patterns applied?
└─ Is the meta-framework utilized fully?

TEAM CONSISTENCY:
├─ Does it match team conventions?
├─ Are lint rules passing?
├─ Are formatting rules followed?
├─ Are comment styles consistent?
└─ Are TODO/FIXME formats standard?
```

---

## Severity Classification

### Critical (Must Fix)

**Definition**: Issues that will cause production problems

```
Examples:
├── Security vulnerabilities
├── Data loss potential
├── Crash-causing bugs
├── Broken core functionality
├── Memory leaks
├── Race conditions
└── Incorrect business logic

Action: Fix immediately, re-review required
```

### High (Should Fix)

**Definition**: Issues that significantly impact quality

```
Examples:
├── Performance problems
├── Missing error handling
├── Poor accessibility
├── Complex code without tests
├── Significant technical debt
├── Breaking established patterns
└── Poor user experience

Action: Fix before merge, re-review recommended
```

### Medium (Consider Fixing)

**Definition**: Issues that are nice to address

```
Examples:
├── Minor performance improvements
├── Code could be clearer
├── Missing edge case handling
├── Minor naming improvements
├── Small refactoring opportunities
└── Documentation gaps

Action: Fix if time permits, or add TODO
```

### Low (Optional)

**Definition**: Nitpicks and preferences

```
Examples:
├── Whitespace/formatting
├── Comment wording
├── Optional syntax preferences
├── Alphabetical ordering
└── Personal style differences

Action: Author's discretion
```

---

## Review Process

### Step 1: Self-Review (Before showing anyone)

```
Check your own code first:

1. READ IT FRESH
   └── Open the file and read from top to bottom
   
2. RUN IT
   └── Does it work? Test all cases.
   
3. CHECK THE DIFF
   └── Review what you changed line by line
   
4. RUN LINTERS
   └── Fix all warnings and errors
   
5. ASK YOURSELF:
   ├── Would I understand this in 6 months?
   ├── Is this the simplest solution?
   ├── Did I leave any console.logs?
   ├── Are all TODOs intentional?
   └── Would I be proud of this code?
```

### Step 2: The Review

Load [rules/review-techniques.md](./rules/review-techniques.md) for review methodologies.

```
Review Order:
1. High-level overview (architecture, structure)
2. Test files (understand expected behavior)
3. Implementation details
4. Edge cases and error handling
5. Documentation and comments
```

### Step 3: Delivering Feedback

**The Feedback Template**:
```markdown
## Code Review: [filename]

### Summary
[One sentence overall assessment]

### Critical Issues
1. **[CRITICAL]** [Issue description]
   - Location: [line/file]
   - Problem: [Why it's wrong]
   - Solution: [How to fix]

### High Priority Issues
1. **[HIGH]** [Issue description]
   - [Details]

### Suggestions
1. **[MEDIUM]** [Suggestion]
2. **[LOW]** [Nitpick]

### What Works Well
- [Positive observation]
- [Positive observation]

### Next Steps
- [ ] Fix critical issues
- [ ] Consider high priority
- [ ] Re-review after changes
```

**Feedback Principles**:
```
DO:
✓ Explain WHY, not just WHAT
✓ Suggest specific solutions
✓ Ask questions rather than dictate
✓ Acknowledge what works
✓ Be kind and constructive
✓ Cite sources (docs, patterns)

DON'T:
✗ Use dismissive language
✗ Make it personal
✗ Block without explanation
✗ Nitpick without purpose
✗ Assume intent negatively
```

---

## Integration with Workflow

### Before Code Review
- [ ] Code compiles/builds successfully
- [ ] Tests pass
- [ ] Self-review completed
- [ ] Linter passes

### During Code Review
- [ ] All 5 pillars checked
- [ ] Severity assigned to each issue
- [ ] Feedback delivered constructively
- [ ] Learning opportunities highlighted

### After Code Review
- [ ] Issues addressed
- [ ] Re-review if critical changes
- [ ] Approved by reviewer
- [ ] Merged with clean history

---

## Rule Files Index

| File | Purpose | When to Load |
|------|---------|--------------|
| [correctness.md](./rules/correctness.md) | Logic, types, error handling | Pillar 1 review |
| [performance.md](./rules/performance.md) | Optimization patterns | Pillar 2 review |
| [security.md](./rules/security.md) | Security vulnerabilities | Pillar 3 review |
| [maintainability.md](./rules/maintainability.md) | Code structure | Pillar 4 review |
| [consistency.md](./rules/consistency.md) | Style and patterns | Pillar 5 review |
| [review-techniques.md](./rules/review-techniques.md) | Review methods | Conducting reviews |
| [language-specific/](./rules/language-specific/) | Language-specific rules | Framework-specific review |

---

## Remember

**Good code review is:**
- A conversation, not a verdict
- About the code, not the coder  
- Teaching opportunity
- Quality gate
- Team alignment tool

**Code review is not optional. It is a professional obligation.**
