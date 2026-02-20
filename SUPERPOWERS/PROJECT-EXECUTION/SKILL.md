---
name: project-execution
description: Systematic project implementation and task management. Use (1) After DESIGN.md is approved, (2) Breaking work into manageable chunks, (3) Tracking progress, (4) Executing multi-step plans. MANDATORY for implementation phase.
metadata:
  tags: project-management, execution, task-tracking, implementation, planning
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: critical
---

# Project Execution Master System

**Design is cheap. Execution is everything.**

---

## The Execution Doctrine

### Core Principles

1. **Plans are Nothing, Planning is Everything** - The act of planning creates shared understanding
2. **One Task at a Time** - Multitasking is a lie; deep focus wins
3. **Done Means Delivered** - Working code in production, not "almost done"
4. **Transparency is Trust** - Regular updates prevent surprises
5. **Quality Gates are Non-Negotiable** - No shortcuts past review, test, validation

---

## Prerequisites

### Before Execution Starts

```
MUST HAVE:
├── DESIGN.md approved and documented
├── Technical stack decided
├── Development environment ready
├── Repository initialized (git-workflow)
└── Team aligned on approach

WITHOUT THESE → Go back to brainstorming-design
```

---

## The Execution Framework

### Step 1: Plan Decomposition

Load [rules/planning.md](./rules/planning.md) for detailed planning techniques.

**Break DESIGN.md into tasks**:

```markdown
# IMPLEMENTATION PLAN: [Project Name]

## Phase 1: Foundation (Est: 2 hours)
### Task 1.1: Project Setup
- [ ] Initialize Next.js with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Setup folder structure
- [ ] Install dependencies
- [ ] Configure ESLint/Prettier
**Output**: Running dev server
**Commit**: "chore: Initial project setup"

### Task 1.2: Core Layout
- [ ] Create root layout component
- [ ] Setup global styles
- [ ] Create navigation component
- [ ] Add footer component
**Output**: Basic page structure visible
**Commit**: "feat(layout): Add core layout components"

## Phase 2: Features (Est: 4 hours)
### Task 2.1: Hero Section
- [ ] Build Hero component
- [ ] Add GSAP animations (gsap-animator)
- [ ] Implement responsive design
- [ ] Add content from DESIGN.md
**Output**: Animated hero section
**Commit**: "feat(hero): Add animated hero section"

### Task 2.2: Feature Section
- [ ] Create feature cards
- [ ] Add icons and content
- [ ] Implement scroll animations
**Output**: Features section complete
**Commit**: "feat(features): Add features section"

## Phase 3: Polish (Est: 2 hours)
### Task 3.1: Performance
- [ ] Optimize images
- [ ] Add lazy loading
- [ ] Check bundle size

### Task 3.2: QA
- [ ] Cross-browser testing
- [ ] Mobile testing
- [ ] Accessibility audit

### Task 3.3: Deploy
- [ ] Build for production
- [ ] Deploy to Vercel
- [ ] Verify live site
**Commit**: "chore: Production build"
```

**Task Sizing Rule**: Each task ≤ 30 minutes. If bigger → split.

---

### Step 2: Sequential Execution

**One task at a time. No skipping.**

```
For EACH task:

1. ANNOUNCE
   "Ejecutando Task X.Y: [Description]"
   
2. IMPLEMENT
   ├── Follow relevant technical skills
   ├── Write code following code-review standards
   └── Apply tdd-workflow where applicable
   
3. VERIFY
   ├── Run the code
   ├── Check against acceptance criteria
   ├── code-review self-check
   └── No console errors
   
4. COMMIT
   ├── Stage changes: git add .
   ├── Commit: git commit -m "type(scope): Description"
   └── Push if needed: git push origin branch
   
5. UPDATE PLAN
   ├── Mark task complete: - [x] Task name
   └── Report progress to user
   
6. ANNOUNCE COMPLETION
   "Task X.Y complete. [X]% del proyecto terminado.
   Siguiente: Task X.Z"
```

---

### Step 3: Quality Gates

**After EVERY task**:

```
MANDATORY CHECKS:
├── code-review skill applied
├── No TypeScript errors
├── No console errors/warnings
├── Visual check (if UI)
├── Responsive check (if applicable)
└── Git commit with proper message

BLOCKERS (must fix before continuing):
├── Broken functionality
├── Type errors
├── Failed tests
└── Blocked dependencies
```

---

### Step 4: Progress Tracking

**Regular Updates**:

```markdown
## PROGRESS UPDATE - [Timestamp]

**Overall**: X/Y tasks (Z%)
**Current**: Task [N] - [Description]
**Next**: Task [N+1] - [Description]
**ETA**: [Time estimate]

**Completed Today**:
- [x] Task X
- [x] Task Y

**Blockers**:
- [Description] → [Resolution plan]

**Decisions Needed**:
1. [Question] - [Options]
```

---

## Task Templates

### Component Task

```markdown
Task: Create [ComponentName]
**Files**:
- components/[ComponentName].tsx
- components/[ComponentName].test.tsx
- components/[ComponentName].module.css

**Steps**:
1. Create file structure
2. Define TypeScript interfaces
3. Implement component
4. Add to parent/screen
5. Verify visually
6. code-review
7. Commit: "feat([scope]): Add [ComponentName]"
```

### API Task

```markdown
Task: Create API [route-name]
**Files**:
- app/api/[route]/route.ts
- lib/validators.ts (if needed)
- __tests__/api/[route].test.ts

**Steps**:
1. Write test first (tdd-workflow)
2. Define request/response types
3. Implement handler
4. Add validation
5. Run tests
6. code-review
7. Commit: "feat(api): Add [route] endpoint"
```

### Section Task

```markdown
Task: Build [SectionName] section
**Files**:
- app/sections/[SectionName].tsx
- Add to app/page.tsx

**Steps**:
1. Create section component
2. Add content structure
3. Style with Tailwind
4. Add animations (gsap-animator)
5. Make responsive
6. Visual verification
7. code-review
8. Commit: "feat(section): Add [SectionName]"
```

---

## Handling Blockers

### Blocker Protocol

```
IF stuck > 10 minutes:

1. DOCUMENT
   "Bloqueo en Task X: [specific issue]"
   
2. ATTEMPT SOLUTIONS:
   ├── Use systematic-debugging skill
   ├── Check documentation
   ├── Search for similar issues
   └── Try minimal reproduction
   
3. IF still stuck:
   ├── Ask user for clarification
   ├── Present options with trade-offs
   └── Document decision
   
NEVER:
├── Guess and move on
├── Leave broken code
├── Skip without documenting
├── Work around without flagging
```

---

## Completion Criteria

### Project is DONE when:

```
- [ ] All tasks completed
- [ ] All code reviewed (code-review)
- [ ] DESIGN.md requirements met
- [ ] No console errors
- [ ] Responsive tested
- [ ] Accessibility checked
- [ ] Performance acceptable
- [ ] Deployed (if applicable)
- [ ] User approves final result
```

---

## Integration

### Before This
- brainstorming-design (DESIGN.md)

### During This
- code-review (after each task)
- git-workflow (commits)
- tdd-workflow (for logic)
- Specific technical skills

### After This
- Deployment
- Handoff documentation
- Knowledge transfer

---

## Rule Files Index

| File | Purpose | When to Load |
|------|---------|--------------|
| [planning.md](./rules/planning.md) | Plan creation techniques | Step 1 |
| [tracking.md](./rules/tracking.md) | Progress tracking methods | Step 4 |
| [blockers.md](./rules/blockers.md) | Blocker resolution | When stuck |

---

## Anti-Patterns

❌ Starting without approved DESIGN.md  
❌ Tasks > 30 minutes  
❌ Skipping code review  
❌ Multiple tasks per commit  
❌ Working ahead without finishing current  
❌ Not announcing progress  
❌ Hiding blockers  

---

## Execution Checklist

- [ ] DESIGN.md approved
- [ ] Implementation plan created
- [ ] Tasks are ≤30 minutes each
- [ ] One task executed at a time
- [ ] Quality gate passed after each task
- [ ] Regular progress updates
- [ ] Blockers documented and resolved
- [ ] All completion criteria met

---

**Execute with discipline. Deliver with pride.**
