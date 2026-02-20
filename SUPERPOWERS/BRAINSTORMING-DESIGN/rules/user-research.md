---
name: user-research
description: User persona creation and journey mapping techniques. Load during Phase 2 of brainstorming-design to create detailed user understanding artifacts.
metadata:
  tags: user-research, personas, journey-mapping, empathy-maps, jtbd
---

# User Research & Persona Development

**Transforming user data into actionable design intelligence.**

---

## The Persona Development Framework

### Primary vs Secondary Personas

**Primary Persona** (Design for this person):
- Represents 60-80% of user base
- Highest business value
- Most extreme needs
- Design decisions prioritize them

**Secondary Personas** (Accommodate these people):
- Represent 20-40% of user base
- Important but not primary
- Can be served with adaptations
- Design doesn't compromise for them

**Anti-Personas** (Explicitly not for these people):
- Who we're NOT designing for
- Prevents scope creep
- Clarifies positioning

---

## The Complete Persona Template

```markdown
# Persona: [Name] - [Role/Identity]

## Demographics
- **Name**: [Realistic name, not "User A"]
- **Age**: [Specific number]
- **Location**: [City/Region]
- **Occupation**: [Job title]
- **Income**: [Range]
- **Education**: [Level]
- **Tech Proficiency**: [Beginner/Intermediate/Advanced]

## Psychographics
- **Goals**: What are they trying to achieve?
- **Motivations**: Why do they want this?
- **Frustrations**: What's blocking them?
- **Fears**: What are they worried about?
- **Values**: What matters to them?

## Behavioral Traits
- **Daily Routine**: Typical day description
- **Device Usage**: Primary device, usage patterns
- **App Preferences**: Other tools they use
- **Decision Making**: Rational vs emotional
- **Learning Style**: Reading vs video vs hands-on

## Technical Context
- **Primary Device**: Phone/Tablet/Laptop/Desktop
- **Browser**: Chrome/Safari/Edge/etc.
- **Connection**: High-speed/Limited/Offline needs
- **Assistive Tech**: Screen reader/Voice control/etc.
- **Environment**: Office/Home/Transit/Multi-context

## Quote
"[Something they would actually say that summarizes their mindset]"

## Photo Reference
[Description of representative photo or actual image]

## User Story
"As [name], I want [goal], so that [benefit]"

## Scenarios
1. **Best Case**: Everything goes right
2. **Edge Case**: Unusual but important situation
3. **Error Case**: Something goes wrong
```

### Example Persona: E-commerce

```markdown
# Persona: Maria Rodriguez - Busy Working Mom

## Demographics
- **Name**: Maria Rodriguez
- **Age**: 34
- **Location**: Madrid, Spain
- **Occupation**: Marketing Manager
- **Income**: €45,000/year
- **Education**: Bachelor's Degree
- **Tech Proficiency**: Intermediate

## Psychographics
- **Goals**: Buy quality clothes for kids efficiently, stay within budget
- **Motivations**: Wants kids to look good without spending hours shopping
- **Frustrations**: Sizing inconsistencies, slow checkout, too many choices
- **Fears**: Buying wrong size, wasting money, missing return window
- **Values**: Quality, convenience, value for money

## Behavioral Traits
- **Daily Routine**: Checks phone during commute, shops during lunch break
- **Device Usage**: iPhone primarily, iPad for browsing
- **App Preferences**: Amazon, Zara, Instagram for inspiration
- **Decision Making**: Reads reviews, compares prices, decides quickly
- **Learning Style**: Visual - needs to see products on models

## Technical Context
- **Primary Device**: iPhone 14
- **Browser**: Safari
- **Connection**: 4G during commute, WiFi at home/office
- **Assistive Tech**: None
- **Environment**: Commuting, lunch breaks, evening on couch

## Quote
"I don't have time to browse 100 options. Show me the best 10 that fit my budget."

## User Story
"As Maria, I want to quickly find kids' clothes in the right size,
so that I can complete my shopping in under 15 minutes."

## Scenarios
1. **Best Case**: Finds perfect items, checkout in 3 clicks, free shipping
2. **Edge Case**: Item out of stock - needs similar alternatives
3. **Error Case**: Wrong size delivered - needs easy return process
```

---

## Empathy Mapping

Visualize what users think, feel, say, and do.

```
                    [User Name]
                      Photo
                       
        ┌───────────────┼───────────────┐
        │               │               │
   THINKS│             SEES            │
        │               │               │
  ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
  │"This is    │   │ Options   │   │"Can you   │
  │ too        │   │ everywhere│   │ help me   │
  │complicated"│   │ No clear  │   │ find..."  │
  │"I hope     │   │ guidance  │   │"Finally!  │
  │ this works"│   │ Competitor│   │ Got it"   │
  └───────────┘   │ ads       │   └───────────┘
                  └───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
      DOES│            FEELS           │
        │               │               │
  ┌─────┴─────┐   ┌─────┴─────┐   ┌─────┴─────┐
  │ Clicks    │   │ Frustrated│   │ Pain      │
  │ randomly  │   │ Confused  │   │ Annoyed   │
  │ Abandons  │   │ Anxious   │   │ Relieved  │
  │ Asks for  │   │ Hopeful   │   │ Satisfied │
  │ help      │   │           │   │           │
  └───────────┘   └───────────┘   └───────────┘
```

---

## Journey Mapping

Document the user's end-to-end experience.

### Journey Map Template

```
┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ STAGE   │ AWARENESS│CONSIDER │ DECISION │  USAGE   │ ADVOCACY │
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Actions │ Google   │ Compare  │ Purchase │ Setup    │ Review   │
│         │ Search   │ Options  │          │ Product  │ Refer    │
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Thoughts│"I need  │"Which is │"Is this  │"How do  │"Would my │
│         │ a..."    │ better?" │ secure?" │ I...?"   │ friends │
│         │          │          │          │          │ like it?"│
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│Emotional│ Curious  │ Anxious  │ Cautious │ Confident│ Proud    │
│ State   │ Hopeful  │ Overwhelmed Excited │ Capable  │ Enthusiastic
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│Pain     │ Too many │ Hidden   │ Checkout │ Confusing│ No easy  │
│ Points  │ options  │ costs    │ errors   │ interface│ way to   │
│         │          │          │          │          │ share    │
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│Opportuni│ Compare  │ Filter by│ Progress │ Onboarding│ Referral │
│ ties    │ tool     │ needs    │ indicator│ checklist │ rewards  │
└─────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### Touchpoint Inventory

List every interaction point:

```
Digital Touchpoints:
├─ Website (desktop/mobile)
├─ Mobile app
├─ Email communications
├─ Social media
├─ Ads (display/search/social)
└─ Help center/knowledge base

Physical Touchpoints (if applicable):
├─ Product packaging
├─ Physical locations
├─ Phone support
└─ Events/tradeshows

Human Touchpoints:
├─ Sales team
├─ Customer support
├─ Community forums
└─ Social mentions
```

---

## Jobs-To-Be-Done (JTBD) Framework

Understand the underlying job users are hiring your product to do.

### The JTBD Statement

```
When I [situation/context],
I want to [motivation/goal],
so I can [expected outcome].

Example:
"When I'm planning a dinner party for friends with different 
dietary restrictions, I want to find recipes that everyone 
can eat, so I can be a good host without spending hours 
researching alternatives."
```

### Functional vs Emotional Jobs

```
FUNCTIONAL (What they need to do):
- Get from A to B
- Store information
- Communicate with team
- Track progress

EMOTIONAL (How they want to feel):
- Feel competent
- Feel in control
- Feel smart
- Feel safe

SOCIAL (How they want to be perceived):
- Look professional
- Be seen as helpful
- Appear successful
- Be viewed as innovative
```

### Forces of Progress

Understand what drives and blocks change:

```
                PUSH (Current situation)
                "I'm frustrated with..."
                       ↓
    ANXIETIES                         ATTRACTIONS
    "What if it..."                   "I like that it..."
    - Doesn't work?                   - Saves time
    - Too expensive?                  - Easy to use
    - Too complicated?                - Better quality
    - Risk of change?                 - Good reviews
                       ↓
                PULL (Desired outcome)
                "I want to..."
                
    HABITS (Current behavior)
    "But I always..."
    - Work arounds they use
    - Current alternatives
    - Inertia to overcome
```

---

## User Research Methods

### Method 1: Interviews

**Structure**:
```
1. Introduction (2 min)
   - Build rapport
   - Set expectations
   - Get permission to record

2. Warm-up (5 min)
   - Background questions
   - Current situation
   - Context setting

3. Deep Dive (30 min)
   - Open-ended questions
   - Follow-up probes
   - "Tell me more about..."
   - "Why is that important?"

4. Wrap-up (3 min)
   - Anything we missed?
   - Questions for us?
   - Thank you & next steps
```

**Sample Questions**:
```
- "Walk me through the last time you..."
- "What's the most frustrating part of...?"
- "If you had a magic wand, what would you change?"
- "How do you currently handle...?"
- "What would make this a 'must-have' for you?"
```

### Method 2: Surveys

**Best for**: Validating hypotheses at scale

**Structure**:
```
1. Screener (3 questions) - Ensure right respondents
2. Demographics (3-5 questions) - Profile respondents
3. Main Questions (10-15 max) - Core research
4. Open-ended (2-3 questions) - Qualitative insights
```

### Method 3: Competitive Analysis

**Matrix**:
```
| Feature/Criteria | Our Product | Competitor A | Competitor B | Opportunity |
|------------------|-------------|--------------|--------------|-------------|
| Price            | $$          | $$$          | $            | Mid-market  |
| Ease of Use      | ★★★★☆       | ★★★☆☆        | ★★★★★        | Simplify    |
| Key Feature X    | ✓           | ✓            | ✗            | Differentiate|
```

---

## Synthesis & Documentation

### The Persona Wall

Create a visual display:
- Large persona posters
- Journey map timeline
- Key quotes highlighted
- Photo references
- Pain point indicators

### Research Repository

Maintain living documents:
```
/research
├── personas/
│   ├── primary.md
│   ├── secondary.md
│   └── anti-persona.md
├── journeys/
│   ├── current-state.md
│   └── future-state.md
├── interviews/
│   ├── participant-01.md
│   └── participant-02.md
└── insights/
    ├── key-findings.md
    └── opportunities.md
```

---

## Validation Checklist

- [ ] Primary persona is specific, not generic
- [ ] Persona has a name and photo
- [ ] Journey map covers all stages
- [ ] Pain points are validated with users
- [ ] JTBD statements capture real motivations
- [ ] Research includes both qualitative and quantitative data
- [ ] Findings are documented and accessible to team
