---
name: validation-methods
description: Stakeholder alignment, design critique, and approval workflows. Load during Phase 5 of brainstorming-design to validate designs and get stakeholder buy-in.
metadata:
  tags: validation, stakeholder-management, design-critique, usability-testing, approval-workflow
---

# Validation & Stakeholder Alignment

**Ensuring the right product gets built through systematic validation.**

---

## The Validation Pyramid

```
                    STRATEGIC VALIDATION
               (Business alignment, market fit)
                          ↑
                    DESIGN VALIDATION
               (Usability, aesthetics, flows)
                          ↑
                  TECHNICAL VALIDATION
               (Feasibility, performance, security)
                          ↑
                    USER VALIDATION
               (Desirability, comprehension, satisfaction)
```

---

## Stakeholder Management

### Stakeholder Mapping

```
Power/Interest Grid:

HIGH POWER │  Manage Closely    │  Keep Satisfied
           │  (Key decisions)   │  (Regular updates)
           │                    │
           │  ● CEO             │  ● Investors
           │  ● Product Lead    │  ● Department Heads
           │  ● Tech Lead       │
           ├────────────────────┼────────────────────┤
           │  Keep Informed     │  Monitor
           │  (Periodic sync)   │  (Minimal effort)
           │                    │
           │  ● End Users       │  ● General Public
           │  ● Support Team    │  ● Competitors
           │  ● Marketing       │
LOW POWER  └────────────────────┴────────────────────┘
           LOW INTEREST              HIGH INTEREST
```

### RACI Matrix

```
| Activity | Product | Design | Dev | Stakeholder | Legal |
|----------|---------|--------|-----|-------------|-------|
| Define requirements | A | C | C | R | I |
| Create wireframes | I | R | C | C | - |
| Technical review | C | C | R | I | - |
| Content approval | A | C | I | R | C |
| Final sign-off | A | R | C | R | I |

R = Responsible (does the work)
A = Accountable (signs off)
C = Consulted (provides input)
I = Informed (kept updated)
```

---

## Design Critique Framework

### The 4-Step Critique Process

```
Step 1: PRESENT (5 min)
Presenter explains:
├── What problem this solves
├── Who it's for
├── Constraints considered
└── Specific feedback needed

Step 2: REACT (5 min)
Observers share initial reactions:
├── "I noticed..."
├── "I'm confused by..."
├── "I like..."
└── "I wonder..."
(NO solutions yet - just observations)

Step 3: ANALYZE (10 min)
Discuss against criteria:
├── Does it solve the user problem?
├── Is it consistent with brand/system?
├── Is it technically feasible?
├── Are there accessibility issues?
└── What are trade-offs?

Step 4: DECIDE (5 min)
Document outcomes:
├── Changes to make
├── Experiments to run
├── Follow-up questions
└── Next steps
```

### Critique Guidelines

**DO**:
```
✓ Critique the work, not the person
✓ Ask clarifying questions
✓ Reference principles/goals
✓ Offer specific, actionable feedback
✓ Consider constraints
✓ Acknowledge what works

Examples:
- "How does this handle the error state we discussed?"
- "The hierarchy here really guides the eye well"
- "This pattern differs from our design system - should we update the system or use the established pattern?"
```

**DON'T**:
```
✗ Give prescriptive solutions ("Make it blue")
✗ Share opinions without reasoning
✗ Focus on personal taste
✗ Bring up new requirements
✗ Critique without context

Instead of:
- "I don't like this color"

Say:
- "This color doesn't meet contrast requirements for accessibility"
- "The brand guidelines specify a different palette for this use case"
```

---

## Usability Testing

### Test Planning

```markdown
# Usability Test Plan

## Objectives
What do we want to learn?
- Can users complete core tasks?
- Do they understand the value proposition?
- Where do they get confused?

## Methodology
- **Type**: Moderated remote
- **Participants**: 5 users (target demographic)
- **Duration**: 30 minutes each
- **Tools**: Zoom, Figma prototype, Lookback

## Tasks
1. **First impression** (2 min)
   - Show homepage for 5 seconds
   - Ask: What is this? Who is it for?

2. **Core task** (10 min)
   - "You want to [task]. Walk me through how you'd do that."
   - Observe without helping

3. **Comprehension check** (5 min)
   - "What do you think [feature] does?"
   - "Why would you use [feature]?"

## Success Metrics
- Task completion rate: Target 80%+
- Time on task: Baseline vs. design
- Error rate: Count of mistakes
- SUS score: Target 70+

## Schedule
| Date | Participant | Time | Note |
|------|-------------|------|------|
| 10/1 | User 1 | 10am | recruited via UserTesting |
| 10/1 | User 2 | 11am | recruited via UserTesting |
...
```

### Conducting Tests

**Script Template**:
```
Introduction (2 min):
"Thanks for joining. This is a test of the design, not you. 
There are no wrong answers. Please think aloud as you work.
I'll be taking notes but won't provide help."

Context Setting:
"Imagine you're [scenario]. You're looking at [product]."

Task Presentation:
"Your task is to [specific goal]. Walk me through what you'd do."

Probing Questions:
- "What are you thinking right now?"
- "What did you expect to happen?"
- "What would you do next?"
- "Is this what you expected?"

Wrap-up:
- "On a scale of 1-5, how easy was that task?"
- "What one thing would you change?"
- "Any other feedback?"
```

### Analysis Framework

**The Rainbow Spreadsheet**:
```
| Participant | Task 1 | Task 2 | Task 3 | Post-test |
|-------------|--------|--------|--------|-----------|
| User 1      | ✓      | ✗      | ✓      | 4/5       |
| User 2      | ✓      | ~      | ✓      | 3/5       |
| User 3      | ✗      | ✗      | ~      | 2/5       |

Legend: ✓ Success | ~ Partial | ✗ Failure

Pattern Analysis:
├── 3/5 failed Task 2 → Major issue
├── 5/5 succeeded Task 1 → Working well
└── Confusion on pricing page → Redesign needed
```

**Severity Ratings**:
```
CRITICAL (Fix immediately):
- User cannot complete core task
- User is blocked/frustrated
- Legal/compliance issue

HIGH (Fix before launch):
- User takes 2x expected time
- User makes multiple errors
- User expresses confusion

MEDIUM (Fix post-launch):
- Minor inefficiency
- Preference issue
- Missing nice-to-have

LOW (Consider for future):
- Suggestion for improvement
- Edge case issue
```

---

## A/B Testing

### Test Design

```
Hypothesis Format:
"We believe that [change] will result in [outcome],
as measured by [metric], because [reasoning]."

Example:
"We believe that simplifying the checkout form 
from 5 steps to 1 page will result in increased 
conversions, as measured by checkout completion rate, 
because it reduces friction and cognitive load."
```

**Test Types**:
```
A/B Test (Two variants):
├── Variant A: Current design (control)
├── Variant B: New design (treatment)
└── Split: 50/50 traffic

Multivariate (Multiple variables):
├── Test headline AND image simultaneously
├── Requires more traffic
└── Shows interaction effects

Bandit (Continuous optimization):
├── Auto-allocates traffic to winner
├── Good for ongoing optimization
└── Requires substantial traffic
```

### Statistical Rigor

```
Sample Size Calculation:
- Baseline conversion: 2%
- Minimum detectable effect: 20% relative (2% → 2.4%)
- Statistical power: 80%
- Significance level: 95%
- Result: ~12,000 visitors per variant

Duration:
├── Minimum 1 full business cycle (7 days)
├── Account for day-of-week effects
├── Run until significance reached
└── Don't peek at results early

Stopping Rules:
├── Reach sample size
├── Reach statistical significance
├── Test runs 4 weeks (maximum)
└── External factors invalidate test
```

---

## Design Review Checkpoints

### Pre-Development Review

```
Review Board: Product, Design, Tech Lead, QA

Agenda:
1. Problem statement confirmation (5 min)
2. Design walkthrough (15 min)
3. Technical feasibility check (10 min)
4. Scope clarification (5 min)
5. Timeline/buffer review (5 min)

Checklist:
- [ ] Design matches approved concept
- [ ] All states accounted for (empty, error, loading, success)
- [ ] Responsive behavior defined
- [ ] Accessibility requirements met
- [ ] Copy is final and approved
- [ ] Assets are ready (images, icons)
- [ ] Analytics events defined
- [ ] Edge cases considered

Output: Development can begin
```

### Pre-Launch Review

```
Final QA Checklist:
- [ ] All designs implemented correctly
- [ ] Responsive on all breakpoints
- [ ] Cross-browser tested
- [ ] Performance budget met
- [ ] Accessibility audit passed
- [ ] Analytics tracking working
- [ ] Error handling tested
- [ ] Security review complete
- [ ] Content finalized
- [ ] SEO metadata added

Sign-offs Required:
├── Product Manager
├── Design Lead
├── Tech Lead
├── QA Lead
└── Legal/Compliance (if applicable)
```

---

## Approval Workflows

### Design Sign-off Process

```
Stage 1: Concept Approval
├── Present: Problem + Concept sketches
├── Reviewers: Product + Stakeholder
├── Output: Approved direction
└── Time: 1-2 days

Stage 2: Detailed Design Approval
├── Present: High-fidelity mockups
├── Reviewers: Product + Tech + Stakeholder
├── Output: Approved designs
└── Time: 2-3 days

Stage 3: Pre-dev Review
├── Present: Final designs + specs
├── Reviewers: Full team
├── Output: Dev handoff approved
└── Time: 1 day

Stage 4: Post-dev Review
├── Present: Staging environment
├── Reviewers: Design + Product + QA
├── Output: Launch approval
└── Time: 2-3 days
```

### Feedback Consolidation

```
Feedback Tracker:
| ID | Source | Comment | Severity | Status | Notes |
|----|--------|---------|----------|--------|-------|
| 01 | CEO | Hero too busy | High | In progress | Testing simplified version |
| 02 | Tech | Animation heavy | Med | Deferred | Post-launch optimization |
| 03 | User | Confused by CTA | Critical | Fixed | Changed to clearer label |

Status Options:
- New
- Under review
- Accepted
- Rejected (with reason)
- In progress
- Complete
```

---

## Documentation Standards

### Design Decision Log

```markdown
# Decision Log

## 2024-01-15: Navigation Structure
**Decision**: Use horizontal top nav on desktop, bottom sheet on mobile

**Context**: User testing showed confusion with hamburger menu

**Alternatives Considered**:
- Sticky sidebar (rejected: takes too much space on mobile)
- Hamburger menu (rejected: low discoverability)
- Tab bar (rejected: doesn't scale to many items)

**Trade-offs**: 
- Pro: High discoverability, scalable
- Con: Takes vertical space, different patterns per device

**Stakeholders**: Product (approved), Design (approved), Dev (approved)

**Reversible**: Yes, can A/B test alternatives post-launch
```

---

## Validation Checklist

- [ ] All stakeholders identified and mapped
- [ ] RACI matrix created and shared
- [ ] Design critique conducted with diverse perspectives
- [ ] Usability testing completed with target users
- [ ] Critical issues from testing are addressed
- [ ] Statistical significance reached for A/B tests
- [ ] Pre-development review completed
- [ ] Pre-launch QA passed
- [ ] All required sign-offs obtained
- [ ] Decision log updated with key choices
