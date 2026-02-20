---
name: discovery
description: Strategic discovery and requirements extraction techniques. Load during Phase 1 of brainstorming-design when gathering initial project requirements from stakeholders.
metadata:
  tags: discovery, requirements, stakeholder-interviews, socratic-method
---

# Discovery & Requirements Extraction

**Extracting the real problem from vague requests through systematic interrogation.**

---

## The Socratic Discovery Framework

### The 5 Layers of Understanding

Every project exists at the intersection of Business, User, Context, Constraint, and Success. You MUST explore all five.

---

## Layer 1: Business Intent

**Goal**: Understand why this project exists from a business perspective.

### Critical Questions

```
1. OUTCOME: "What business outcome justifies this investment?"
   ├─ Revenue increase?
   ├─ Cost reduction?
   ├─ Risk mitigation?
   └─ Strategic positioning?

2. STAKES: "What happens if this project fails?"
   ├─ Financial loss amount?
   ├─ Reputation damage?
   ├─ Competitive disadvantage?
   └─ Opportunity cost?

3. AUTHORITY: "Who has final decision authority?"
   ├─ Who can approve budget increases?
   ├─ Who can extend timelines?
   ├─ Who resolves disagreements?
   └─ Who signs off on completion?

4. SUCCESS: "How will we measure success in 6 months?"
   ├─ Quantitative metrics?
   ├─ Qualitative indicators?
   ├─ Leading vs lagging indicators?
   └─ Measurement methodology?
```

### Business Model Canvas (Quick Version)

For startups/new ventures, map:

```
Value Proposition: [What unique value do we provide?]
Customer Segments: [Who are we serving?]
Revenue Streams: [How do we make money?]
Cost Structure: [What are the main costs?]
Key Metrics: [What numbers indicate health?]
```

---

## Layer 2: User Reality

**Goal**: Understand who will actually use this and what they need.

### The Jobs-To-Be-Done Framework

Users don't buy products, they hire them to do jobs.

```
Job Statement Template:
"When I [situation], I want to [motivation], 
so I can [expected outcome]"

Example:
"When I'm commuting on the train, I want to quickly find 
podcasts that match my interests, so I can use my 
time productively and learn something new."
```

### User Interview Protocol

**Preparation**:
- Identify 3-5 representative users
- Prepare open-ended questions
- Record if possible (with permission)

**The 5 Whys Technique**:
```
User: "I need a dashboard"
Why? "To see my data"
Why? "To understand my performance"
Why? "To know if I'm on track"
Why? "To avoid surprises in my review"
Why? "To keep my job and get promoted"

Real Need: Job security through performance visibility
```

### User Segmentation Matrix

```
                    POWER USERS    CASUAL USERS    ADMIN
Frequency           Daily          Weekly          Monthly
Technical Skill     High           Medium          Low
Feature Usage       80%            40%             20%
Support Needs       Low            Medium          High
Revenue Impact      $$$            $$              $
```

---

## Layer 3: Usage Context

**Goal**: Understand where, when, and how the product will be used.

### Environmental Analysis

```
DEVICE CONTEXT:
├─ Primary device (desktop/mobile/tablet)?
├─ Screen sizes to support?
├─ Input methods (mouse/touch/keyboard/voice)?
└─ Technical limitations (old browsers, slow connections)?

PHYSICAL CONTEXT:
├─ Where is the user? (office/home/transit/public space)
├─ What distractions exist?
├─ How much time do they have?
└─ What's their emotional state?

SOCIAL CONTEXT:
├─ Using alone or with others?
├─ Public visibility of screen?
├─ Privacy concerns?
└─ Collaboration needs?
```

### Context Scenarios

Document 3-5 specific scenarios:

```
Scenario 1: "The Rush Hour Commuter"
- Time: 8:30 AM on crowded subway
- Device: Phone with one hand
- Connection: Spotty 4G
- Goal: Complete task in < 2 minutes
- Friction: Loud environment, standing, distracted

Scenario 2: "The Office Professional"
- Time: 2:00 PM at desk
- Device: Large desktop monitor
- Connection: Stable high-speed
- Goal: Deep work, complex tasks
- Friction: Meetings interrupting, multitasking
```

---

## Layer 4: Constraints & Limitations

**Goal**: Identify hard boundaries that shape the solution.

### Constraint Categories

```
TEMPORAL:
├─ Hard deadline (legal, event, seasonality)?
├─ Why that date specifically?
├─ What can be cut to meet deadline?
└─ What happens if we miss it?

FINANCIAL:
├─ Total budget ceiling?
├─ Is it committed or aspirational?
├─ Payment schedule?
└─ Budget for ongoing maintenance/iteration?

TECHNICAL:
├─ Existing systems to integrate with?
├─ Legacy data to migrate?
├─ Non-negotiable tech stack choices?
├─ Security/compliance requirements (GDPR, HIPAA, etc.)?
└─ Performance requirements (load times, concurrency)?

HUMAN:
├─ Team size and availability?
├─ Skills/experience gaps?
├─ Stakeholder availability for feedback?
└─ Change management needs?
```

### Constraint Documentation Template

```
| Constraint | Type | Flexibility | Impact on Design |
|------------|------|-------------|------------------|
| Must launch by Nov 15 | Hard | None | Cut features if needed |
| Budget $50k | Hard | 10% buffer | No custom illustrations |
| Must use existing CMS | Hard | None | Design around limitations |
| IE11 support | Soft | Can drop | Modern CSS features OK |
```

---

## Layer 5: Success Definition

**Goal**: Define measurable criteria for project completion.

### The Success Pyramid

```
                    BUSINESS OUTCOMES
                    (Revenue, Retention, Satisfaction)
                           ↑
                    USER BEHAVIORS
              (Adoption, Engagement, Completion Rates)
                           ↑
                    PRODUCT OUTPUTS
                (Features Delivered, Quality Metrics)
                           ↑
                    PROJECT DELIVERY
                   (On Time, On Budget, On Scope)
```

### SMART Success Metrics

```
❌ "Good user experience" (vague)
✅ "Task completion rate > 85% within 3 attempts" (specific)

❌ "Fast loading" (vague)
✅ "Lighthouse performance score > 90, First Contentful Paint < 1.5s" (measurable)

❌ "Increase sales" (vague)
✅ "Conversion rate increase from 2% to 4% within 90 days of launch" (specific)
```

### North Star Metric

Identify the ONE metric that best captures product success:

```
Examples by Product Type:
├─ SaaS: Monthly Recurring Revenue (MRR)
├─ Marketplace: Gross Merchandise Value (GMV)
├─ Social: Daily Active Users (DAU)
├─ E-commerce: Conversion Rate
├─ Content: Time on Site / Articles Read
└─ Tool: Tasks Completed per User
```

---

## Discovery Session Structure

### Pre-Session Preparation

```
Research before meeting:
1. Stakeholder LinkedIn/profiles - understand their background
2. Company website/social - understand their brand
3. Competitor landscape - know the alternatives
4. Industry trends - understand external factors
5. Previous projects - learn from history
```

### The Discovery Agenda (60 min)

```
0:00 - 0:05  | Introduction & Context Setting
             | "Today we're exploring [project]. There are no wrong answers,
             |  I want to understand your reality."

0:05 - 0:20  | Business Layer
             | Cover questions from Layer 1

0:20 - 0:35  | User & Context Layers
             | Cover questions from Layers 2-3

0:35 - 0:50  | Constraints & Success
             | Cover questions from Layers 4-5

0:50 - 0:55  | Synthesis Check
             | "Let me summarize what I heard..."

0:55 - 1:00  | Next Steps
             | "I'll document this and share for your review"
```

### Post-Session Deliverable

```markdown
# Discovery Summary - [Project Name]

## Key Findings

### Business Context
- [Summary]

### User Profile
- [Summary]

### Critical Constraints
- [List]

### Success Definition
- [Metrics]

## Open Questions
1. [Question] - Need answer from [Stakeholder]
2. ...

## Assumptions Made
1. [Assumption] - Verify with [Stakeholder]
2. ...
```

---

## Anti-Patterns in Discovery

❌ **Accepting the first request at face value**  
❌ **Leading questions** - "You want it fast, right?"  
❌ **Jumping to solutions** - "We could use React for that..."  
❌ **Ignoring non-verbal cues** - Nervousness, hesitation  
❌ **Not following up on vague answers** - "It's complicated" → why?  
❌ **Skipping the "why" behind deadlines/budgets**  
❌ **Talking more than listening** (You should listen 70% of the time)  

---

## Tools & Templates

See `assets/` directory for:
- Discovery_questionnaire.md - Full question bank
- User_interview_script.md - Interview protocol
- Stakeholder_matrix.xlsx - RACI template

---

## Validation Checklist

Before concluding discovery phase:

- [ ] Can articulate the business outcome in one sentence
- [ ] Can describe the primary user as a real person
- [ ] Know the top 3 user pain points
- [ ] Documented all hard constraints
- [ ] Success metrics are specific and measurable
- [ ] Stakeholder confirmed understanding is correct
- [ ] No critical unanswered questions remain
