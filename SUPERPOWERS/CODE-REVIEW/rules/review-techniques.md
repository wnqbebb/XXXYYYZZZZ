---
name: review-techniques
description: Methodologies and techniques for conducting effective code reviews. Load when planning or conducting code reviews.
metadata:
  tags: review-techniques, code-review-process, feedback, collaboration
---

# Code Review Techniques

**How to review code effectively and efficiently.**

---

## Review Approaches

### 1. The Checklist Method

```
Systematically check each file against:
├─ Correctness checklist
├─ Performance checklist
├─ Security checklist
├─ Maintainability checklist
└─ Consistency checklist

Best for: Thorough reviews, complex changes
Time: 30-60 minutes per significant PR
```

### 2. The Tour Method

```
1. Read from top to bottom once
2. Understand the flow
3. Note questions/concerns
4. Second pass for details

Best for: Understanding new features
Time: 20-40 minutes
```

### 3. The Risk-Based Method

```
Prioritize by risk:
1. Security-sensitive code
2. Business-critical paths
3. Complex algorithms
4. New patterns/technologies
5. Boilerplate/trivial code (skim)

Best for: Large PRs, time-constrained reviews
```

---

## Review Order

```
Optimal review sequence:

1. TESTS (if present)
   └── Understand expected behavior
   
2. INTERFACES/TYPES
   └── Understand contracts
   
3. IMPLEMENTATION
   └── Review logic against tests
   
4. ERROR HANDLING
   └── Check edge cases
   
5. DOCUMENTATION
   └── Verify comments match code
```

---

## Time Management

```
REVIEW LIMITS:
├── Max 400 lines per review session
├── Max 60 minutes continuous review
├── Take breaks between files
└─→ Split large PRs into multiple reviews

SPEED GUIDELINES:
├── Trivial: 5 min (formatting, naming)
├── Small: 15 min (single component)
├── Medium: 30 min (feature)
└── Large: 60+ min (complex feature, split recommended)
```

---

## Writing Review Comments

### The SBI Model

```
Situation: "In the handleSubmit function..."
Behavior: "...the error is caught but not logged..."
Impact: "...making debugging difficult when users report issues."

Suggestion: "Consider logging the error to your monitoring service."
```

### Comment Prefixes

```
[nit]: Minor style preference
[question]: Need clarification
[suggestion]: Consider this alternative
[blocking]: Must fix before merge
[praise]: Good work, acknowledge it
```

---

## Handling Pushback

```
When author disagrees:

1. LISTEN: Understand their perspective
2. EXPLAIN: Clarify your reasoning with evidence
3. DISCUSS: Find common ground
4. ESCALATE: If impasse, involve tech lead
5. DOCUMENT: Record decision and rationale

NEVER:
- Make it personal
- Use authority to override
- Block without explanation
```

---

## Review Metrics

```
HEALTHY REVIEW CULTURE:
├── Review turnaround: < 24 hours
├── Comments per review: 3-10 (average)
├── Critical issues found: Rare (caught by CI/lint)
├── Knowledge sharing: High (explanatory comments)
└── Team satisfaction: High (constructive tone)

RED FLAGS:
├── No comments on large PRs (rubber stamping)
├── Hostile tone in comments
├── Review backlog > 3 days
└── Same issues repeated (no learning)
```
