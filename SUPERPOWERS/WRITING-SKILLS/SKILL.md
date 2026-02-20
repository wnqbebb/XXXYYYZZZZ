---
name: writing-skills
description: Create effective skills for the Kimi skills system. Use (1) When creating new skills, (2) Formalizing reusable patterns, (3) Extracting expertise, (4) User says "crea una skill". MANDATORY for skill creation.
metadata:
  tags: skill-creation, documentation, knowledge-management, workflows
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: high
---

# Writing Skills Master System

**Document once, execute perfectly forever.**

---

## The Skill Doctrine

### Core Principles

1. **Skills are Executable Knowledge** - They should run like programs
2. **Trigger Precisely** - Fire at the right moment, not randomly
3. **Be Concise** - Every word should earn its place
4. **Show, Don't Tell** - Code examples > explanations
5. **Iterate Based on Results** - Test skills in real projects

---

## When to Create a Skill

### Create Skill When

```
CREATE when:
├── Pattern repeats 3+ times
├── Complex workflow needs standardization
├── Domain knowledge should be preserved
├── Team needs consistent approach
├── Error-prone task needs guardrails
└── User explicitly requests ("crea skill para X")
```

### Don't Create Skill When

```
SKIP when:
├── One-time task
├── Simple enough to explain inline
├── Too specific to one project
├── Would overlap existing skill
└── Not enough expertise to formalize
```

---

## Skill Structure

### Directory Layout

```
skill-name/
├── SKILL.md              # Required: Main instruction file
├── rules/                # Optional: Detailed rule files
│   ├── specific-topic.md
│   └── assets/           # Code examples, templates
├── references/           # Optional: Extended documentation
│   └── advanced-guide.md
└── README.md             # Optional: Human overview
```

### SKILL.md Structure

```markdown
---
name: skill-name
description: Clear trigger. Use when (1) condition, (2) condition.
metadata:
  tags: tag1, tag2, tag3
  author: Name
  version: 1.0.0
  priority: critical|high|medium|low
---

# Skill Title

Brief description (one paragraph).

## When to Use

Specific triggers if not in frontmatter.

## Core Principles

1. Principle one
2. Principle two

## Main Instructions

### Section 1

Specific instructions:
- Step one
- Step two with `code`

### Section 2

More instructions.

## Rule Files

| File | Purpose |
|------|---------|
| [file.md](./rules/file.md) | Description |

## Anti-Patterns

❌ Don't do this
✅ Do this instead

## Checklist

- [ ] Item one
- [ ] Item two
```

---

## Writing Guidelines

### Frontmatter

```yaml
---
name: descriptive-name        # kebab-case, unique
description:                  # Under 200 chars
  Clear trigger description.  
  Use when (1) condition, (2) condition, (3) condition.
metadata:
  tags: tag1, tag2, tag3      # Searchable keywords
  author: Your Name           # Maintainers
  version: 1.0.0             # Semantic versioning
  priority: critical          # How essential
---
```

### Body Content

**Concise is Key**:
```markdown
❌ Verbose:
## Testing
Testing is a very important part of software development.
It ensures your code works correctly. There are many types
of tests including unit tests, integration tests...

✅ Concise:
## Testing
Write tests first. Run: `npm test`
```

**Imperative Mood**:
```markdown
❌ Suggestive:
You should consider using...
It is recommended to...

✅ Directive:
Use...
Run...
Verify...
Apply...
```

**Code Examples > Explanations**:
```markdown
❌ Explanation:
To calculate total, multiply price by quantity
and then add tax by multiplying by tax rate.

✅ Code:
const total = price * quantity * (1 + taxRate)
```

---

## Rule Files

### When to Split

```
Create rule file when:
├── Topic is complex (>500 lines in main)
├── Multiple distinct sub-topics
├── Reference material needed
└── Code examples are extensive

Structure:
rules/
├── topic-one.md
├── topic-two.md
└── assets/
    ├── example-code.tsx
    └── template.json
```

### Rule File Format

```markdown
---
name: rule-name
description: When this rule applies.
metadata:
  tags: relevant, tags
---

# Rule Title

## Section

Specific guidance:
1. Step one
2. Step two

## Examples

```typescript
// Good example
const good = true

// Bad example
const bad = false
```

## Checklist

- [ ] Item
```

---

## Skill Categories

### Workflow Skills (Superpowers)

Process-based, mandatory checkpoints.

Examples:
- brainstorming-design
- code-review
- systematic-debugging
- git-workflow

Characteristics:
├── Define process steps
├── Include quality gates
├── Mandatory checkpoints
└── High priority

### Domain Skills (Technical)

Knowledge about specific tools/libraries.

Examples:
- gsap-animator
- nextjs-architect
- tailwind-master

Characteristics:
├── Tool-specific knowledge
├── Best practices
├── Common patterns
└── Code examples

### Utility Skills

Helper for common tasks.

Examples:
- resend-forms
- seo-technical
- image-optimizer

Characteristics:
├── Narrow scope
├── Clear input/output
├── Reusable patterns
└── Low priority

---

## Testing Skills

### Before Declaring "Done"

```
1. CREATE TEST PROJECT
   └── New directory, minimal setup
   
2. REFERENCE SKILL IN PROMPT
   └── "Using [skill-name], do X"
   
3. VERIFY TRIGGER
   └── Does it activate correctly?
   
4. VERIFY INSTRUCTIONS
   └── Are they clear and actionable?
   
5. ITERATE
   └── Fix issues, test again
```

---

## Common Mistakes

❌ Including README, CHANGELOG  
❌ Duplicating info in SKILL.md and references/  
❌ Writing for humans instead of Kimi  
❌ Too many triggers (fires too often)  
❌ Too few triggers (never fires)  
❌ Forgetting frontmatter  
❌ Vague description  
❌ No code examples  

---

## Quality Checklist

- [ ] Frontmatter with name and description
- [ ] Description includes "Use when"
- [ ] Under 500 lines (or split)
- [ ] Imperative mood throughout
- [ ] Code examples provided
- [ ] No auxiliary files
- [ ] Tested in real project
- [ ] Anti-patterns documented
- [ ] Checklist at end

---

## Example: Complete Skill

```markdown
---
name: image-optimizer
description: Optimize images for web. Use when (1) Adding images, 
(2) Production preparation, (3) Format conversion, (4) Resizing.
metadata:
  tags: images, optimization, performance
  version: 1.0.0
---

# Image Optimizer

Optimize images for fast web delivery.

## Automatic Checks

1. Check current image size
2. If >500KB → compress
3. Convert to WebP with fallback
4. Generate srcset sizes

## Commands

```bash
# Convert to WebP
cwebp input.jpg -o output.webp -q 85

# Resize
convert input.jpg -resize 1200x output.jpg
```

## Implementation

```typescript
import Image from 'next/image'

<Image
  src="/image.webp"
  width={1200}
  height={800}
  alt="Description"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Targets

- Format: WebP (JPG fallback)
- Max dimension: 1920px
- Quality: 80-85%
- Size: <500KB

## Checklist

- [ ] Converted to WebP
- [ ] Fallback provided
- [ ] Responsive sizes
- [ ] Alt text added
```

---

**Write skills that execute. Document knowledge that scales.**
