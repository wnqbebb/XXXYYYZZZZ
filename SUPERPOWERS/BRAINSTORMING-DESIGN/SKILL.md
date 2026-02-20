---
name: brainstorming-design
description: Strategic design thinking and project planning workflow. Use when (1) Starting ANY new project or feature, (2) User says "quiero una web/app/sistema", (3) Planning architecture or structure, (4) Exploring design alternatives, (5) Validating ideas before implementation. MANDATORY checkpoint before writing code.
metadata:
  tags: design, planning, architecture, discovery, strategy, ux-research
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: critical
---

# Brainstorming & Design Master System

**The foundation of every successful project.**

This system transforms vague ideas into bulletproof implementation specifications through strategic discovery, user-centered research, and systematic validation.

---

## When to Activate

**MANDATORY TRIGGERS** - Must use when user says:
- "Quiero una web para..."
- "Necesito un sistema de..."
- "Crea una app que..."
- "Empecemos un proyecto de..."
- "Diseña una arquitectura para..."
- "Planifica esta feature..."

**DO NOT WRITE A SINGLE LINE OF CODE UNTIL DESIGN IS APPROVED.**

---

## The Design Doctrine

### Core Principles

1. **Problems First, Solutions Second** - Understand the pain before prescribing medicine
2. **Users Define Success** - If they can't use it, it doesn't matter how pretty it is
3. **Constraints Drive Creativity** - Budget, time, and tech limits are design parameters, not obstacles
4. **Validate Early, Validate Often** - Assumptions kill projects
5. **Document is Spec** - DESIGN.md IS the contract

---

## The 5-Phase Design Process

### Phase 1: Strategic Discovery

Load [rules/discovery.md](./rules/discovery.md) for complete interrogation framework.

**Objective**: Extract the real problem from vague requests.

**Key Questions** (from Socratic Method):

```
BUSINESS LAYER:
├─ What business outcome justifies this investment?
├─ What happens if this project fails?
├─ What success metric moves the needle?
└─ Who has final decision authority?

USER LAYER:
├─ Who exactly will use this? (demographics + psychographics)
├─ What job are they hiring this product to do?
├─ What alternatives do they currently use?
└─ What would make them switch?

CONTEXT LAYER:
├─ What device/context will they use this in?
├─ What's their technical sophistication?
├─ What distractions compete for their attention?
└─ What emotional state are they in when using this?

CONSTRAINT LAYER:
├─ What's the hard deadline and why?
├─ What's the real budget ceiling?
├─ What tech stack is non-negotiable?
└─ What legal/compliance requirements exist?
```

**Rule**: Ask minimum 5 questions before proposing anything.

---

### Phase 2: User Research Synthesis

Load [rules/user-research.md](./rules/user-research.md) for persona and journey mapping.

**Deliverables**:

1. **Primary Persona Document**
   - Name, photo, demographics
   - Goals and motivations
   - Pain points and frustrations
   - Technical profile
   - Quote that summarizes their mindset

2. **User Journey Map**
   - Current state (without our solution)
   - Touchpoints and emotions at each stage
   - Pain points (opportunities)
   - Ideal future state

3. **JTBD (Jobs-To-Be-Done) Statement**
   ```
   "When I [situation], I want to [motivation], 
   so I can [expected outcome]"
   ```

---

### Phase 3: Concept Architecture

Load [rules/architecture-planning.md](./rules/architecture-planning.md) for technical design patterns.

**Synthesize findings into**:

#### A. Problem Statement (1 sentence)
```
[Target User] needs a way to [User Need] 
because [Insight from discovery].
```

#### B. Solution Hypothesis
```
We believe that [solution] will achieve [outcome] 
for [user] because [reasoning].
```

#### C. Information Architecture
```
Sitemap Structure:
Home
├─ Section A (Priority: Critical)
│  ├─ Sub-section A1
│  └─ Sub-section A2
├─ Section B (Priority: High)
└─ Section C (Priority: Medium)
```

#### D. Feature Specification Matrix

| Feature | User Story | Priority | Complexity | Status |
|---------|-----------|----------|------------|--------|
| Auth | As a user, I want to login securely | P0 | Medium | Required |
| Dashboard | As a user, I want to see my stats | P1 | High | Required |
| Export | As a user, I want to export data | P2 | Low | Nice-to-have |

---

### Phase 4: Visual Strategy

Load [rules/visual-strategy.md](./rules/visual-strategy.md) for complete design system approach.

**Define**:

1. **Brand Attributes** (3-5 adjectives)
   - Example: "Professional, Approachable, Innovative, Trustworthy, Dynamic"

2. **Visual References** (minimum 5)
   - Direct competitor analysis
   - Cross-industry inspiration
   - What to emulate vs what to avoid

3. **Content Strategy**
   - Tone of voice
   - Key messaging hierarchy
   - Content requirements per section

4. **Technical Stack Recommendation**
   - Framework justification
   - Animation approach
   - CMS/Backend needs
   - Third-party integrations

---

### Phase 5: Validation & Documentation

Load [rules/validation-methods.md](./rules/validation-methods.md) for stakeholder alignment techniques.

**The DESIGN.md Contract**:

Create comprehensive specification document:

```markdown
# DESIGN.md - [Project Name]

## 1. Executive Summary
One paragraph describing what we're building and why.

## 2. User Definition
### Primary Persona
- Name, demographics, context
- Goals and pain points
- Technical profile

### Secondary Personas (if applicable)
...

## 3. Problem & Solution
### Problem Statement
[Clear articulation]

### Solution Hypothesis
[What we're building]

## 4. Success Criteria
- [ ] Metric 1: [Target]
- [ ] Metric 2: [Target]

## 5. Information Architecture
[Sitemap / Structure]

## 6. Features & Requirements
### P0 (Must Have)
1. [Feature]: [Description]
2. ...

### P1 (Should Have)
...

### P2 (Nice to Have)
...

## 7. Visual Direction
### Brand Attributes
- [List]

### References
- [Links with annotations]

### Technical Stack
- Frontend: [Framework]
- Styling: [Approach]
- Animations: [Library/Method]
- Backend: [Service]
- CMS: [Platform]

## 8. Content Requirements
### Pages/Sections
1. [Section Name]
   - Content: [What's needed]
   - Assets: [Images, copy, etc.]
   
## 9. Timeline & Milestones
- Phase 1: [Duration] - [Deliverable]
- Phase 2: [Duration] - [Deliverable]

## 10. Risks & Mitigation
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | High/Med/Low | High/Med/Low | [Strategy] |
```

---

## Validation Protocol

**Present DESIGN.md in chunks**:

```
"Aquí está la estrategia diseñada. REVISA cada sección:

[SECTION 1: Problema y Solución]
...

¿Alineado con tu visión? ¿Cambios necesarios?"
```

**Wait for explicit approval on each section before proceeding.**

---

## Anti-Patterns (NEVER DO)

❌ **Jumping to code after one sentence** - "Quiero una web" → starts coding  
❌ **Not asking follow-up questions** - Accepting surface-level requirements  
❌ **Skipping user research** - Designing for yourself, not the user  
❌ **Presenting full design without validation** - Wasting work on wrong assumptions  
❌ **Assuming tech stack** - Without justifying why it's the right choice  
❌ **Ignoring constraints** - Designing a Ferrari when they need a bicycle  
❌ **No success metrics** - Can't validate if you don't measure  

---

## Integration with Other Skills

**Before This**: None (this is the starting point)  
**After This**: 
- project-execution (to implement the DESIGN.md)
- Specific technical skills (gsap-animator, nextjs-architect, etc.)

**During This**:
- writing-skills (to document properly)
- git-workflow (to version control DESIGN.md)

---

## Quick Reference: The 5-Minute Checklist

Before concluding design phase, verify:

- [ ] Problem statement is crystal clear
- [ ] User persona is defined with real details
- [ ] At least 5 discovery questions were asked
- [ ] Visual references have been shared
- [ ] Technical stack is justified
- [ ] DESIGN.md is complete and approved
- [ ] Success metrics are defined and measurable
- [ ] Timeline is realistic with buffer

---

## Rule Files Index

Detailed implementations in `rules/` directory:

| File | Purpose | When to Load |
|------|---------|--------------|
| [discovery.md](./rules/discovery.md) | Deep interrogation techniques | Phase 1 - Extracting requirements |
| [user-research.md](./rules/user-research.md) | Persona & journey mapping | Phase 2 - Understanding users |
| [architecture-planning.md](./rules/architecture-planning.md) | Technical design patterns | Phase 3 - Structuring solution |
| [visual-strategy.md](./rules/visual-strategy.md) | Design system approach | Phase 4 - Defining aesthetics |
| [validation-methods.md](./rules/validation-methods.md) | Stakeholder alignment | Phase 5 - Getting approval |

---

## Examples

### Example 1: E-commerce Site

**User**: "Quiero una tienda online para mi marca de ropa"

**Wrong**:
```
"Aquí el código de tu tienda..." [starts coding immediately]
```

**Right**:
```
"Antes de construir, necesito entender tu negocio:

1. ¿Quién es tu cliente ideal? ¿Edad, estilo de vida, presupuesto?
2. ¿Cuántos productos tendrás al lanzamiento?
3. ¿Necesitas integración con algún sistema de inventario existente?
4. ¿Qué métodos de pago necesitas? (tarjeta, PayPal, transferencia, efectivo)
5. ¿Tienes fotos de producto profesionales o necesitamos planificar eso?
6. ¿Cuál es tu diferenciador vs Shein/Zara/otros competidores?
7. ¿Tienes fecha de lanzamiento específica? ¿Por qué esa fecha?"

[Then proceed through all 5 phases...]
```

---

## Command Reference

**Activate**: Triggered automatically on project initiation keywords  
**Output**: DESIGN.md file in project root  
**Completion Criteria**: User explicitly approves DESIGN.md  
**Next Step**: Load project-execution skill

---

**Remember: A week of coding can save an hour of design. Design first. Code second.**
