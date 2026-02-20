---
name: architecture-planning
description: Information architecture and technical design patterns. Load during Phase 3 of brainstorming-design to structure the solution technically and logically.
metadata:
  tags: architecture, information-architecture, sitemap, tech-stack, system-design
---

# Architecture & System Planning

**Designing the skeleton that supports the experience.**

---

## Information Architecture (IA)

### The IA Pyramid

```
                    STRATEGY
               (Business goals, user needs)
                        ↑
                   SCOPE
            (Features, content, functionality)
                        ↑
                 STRUCTURE
           (Navigation, organization, flows)
                        ↑
                 SKELETON
            (Wireframes, layout, interaction)
                        ↑
                 SURFACE
            (Visual design, typography, color)
```

### Sitemap Development

**Hierarchical Structure**:
```
Website Sitemap
│
├── Home
│   ├── Hero Section
│   ├── Features Overview
│   ├── Social Proof
│   └── CTA Section
│
├── Product/Services
│   ├── Category A
│   │   ├── Product A1
│   │   └── Product A2
│   ├── Category B
│   └── Comparison Tool
│
├── About
│   ├── Our Story
│   ├── Team
│   └── Values/Mission
│
├── Resources
│   ├── Blog
│   │   ├── Category 1
│   │   └── Category 2
│   ├── Guides
│   └── FAQ
│
└── Contact/Support
    ├── Contact Form
    ├── Live Chat
    └── Help Center
```

### Card Sorting Method

For complex IA decisions:

```
1. PREPARATION
   - List all content items (cards)
   - Recruit representative users (5-10)
   - Set up sorting tool (OptimalSort, Miro)

2. OPEN SORT (Users create categories)
   - Give users cards
   - Ask them to group logically
   - Have them name each group
   - Document patterns

3. CLOSED SORT (Users fit into existing categories)
   - Provide category names
   - Users sort cards into them
   - Identify misfit items
   - Validate IA structure

4. ANALYSIS
   - Look for consistent groupings
   - Identify outliers
   - Merge/similar categories
   - Document final structure
```

---

## Navigation Design

### Navigation Patterns

**Global Navigation** (Always visible):
```
Horizontal Top Nav:
[Logo] [Home] [Products ▼] [About] [Resources ▼] [Contact] [CTA Button]

Vertical Side Nav:
[Logo]
[Dashboard]
[Projects]
[Team    ]
[Settings]
[Help    ]
```

**Local Navigation** (Context-specific):
```
Breadcrumbs:
Home > Products > Software > Pro Plan

Section Tabs:
[Overview] [Features] [Pricing] [Reviews] [FAQ]

In-Page Navigation:
┌─────────────────┬──────────────────┐
│ On this page:   │ Content...       │
│ • Section 1     │                  │
│ • Section 2     │                  │
│ • Section 3     │                  │
└─────────────────┴──────────────────┘
```

### Navigation Best Practices

```
DO:
✓ Keep primary nav items to 5-7 maximum
✓ Use clear, familiar labels (not jargon)
✓ Highlight current location
✓ Provide search for large sites
✓ Mobile: Hamburger menu + bottom nav
✓ Include clear CTAs

DON'T:
✗ Hide login/signup in dropdowns
✗ Use icons without labels (unless universally understood)
✗ Have more than 2 levels of dropdown
✗ Use "click here" or "learn more" as labels
✗ Change navigation order between pages
```

---

## User Flows

### Flow Mapping

**Task Flow Example - E-commerce Purchase**:
```
[Browse Products] 
      ↓
[View Product Details]
      ↓
[Add to Cart] ───→ [Continue Shopping] ──┐
      ↓                                    │
[View Cart] ←─────────────────────────────┘
      ↓
[Checkout]
  ├─ [Login/Register] → [Fill Details]
  ├─ [Shipping Info]
  ├─ [Payment Info]
  └─ [Review Order]
      ↓
[Confirmation]
      ↓
[Email Receipt]
```

### Decision Points

Map alternative paths:
```
[User arrives at checkout]
         ↓
    [Logged in?]
    ┌────┴────┐
    Yes      No
    ↓         ↓
[Skip to  [Login?]
 checkout] ┌────┴────┐
           Yes      No
           ↓         ↓
    [Login form] [Guest checkout]
           │         │
           └────┬────┘
                ↓
        [Shipping info]
```

### Flow Optimization

**Minimize Steps**:
```
Before: Browse → Product → Cart → Login → Shipping → Payment → Review → Confirm (8 steps)
After:  Browse → Product → Cart → Checkout (with express options) → Confirm (5 steps)
```

**Progress Indicators**:
```
Step 1 of 4 ────○────○────○
Account Info   Shipping  Payment  Review
```

---

## Content Architecture

### Content Inventory

```markdown
# Content Inventory - [Project]

## Page: Homepage
| Element | Type | Source | Status | Priority |
|---------|------|--------|--------|----------|
| Hero headline | Copy | Client | Draft | P0 |
| Hero image | Visual | Stock | Need | P0 |
| Feature 1 icon | Icon | Library | Ready | P0 |
| Testimonial 1 | Copy | Client | Draft | P1 |

## Page: About
| Element | Type | Source | Status | Priority |
|---------|------|--------|--------|----------|
| Team photos | Visual | Shoot | Scheduled | P1 |
| Company history | Copy | Client | Draft | P1 |
| Values list | Copy | Client | Approved | P0 |
```

### Content Modeling

**Structured Content Types**:
```
Blog Post:
├── Title (Text, required)
├── Slug (Text, auto-generated)
├── Author (Reference → Author)
├── Publish Date (Date)
├── Category (Reference → Category)
├── Tags (Array of Text)
├── Featured Image (Image)
├── Excerpt (Text, max 160 chars)
├── Body (Rich Text)
└── SEO (Group):
    ├── Meta Title
    ├── Meta Description
    └── Open Graph Image

Product:
├── Name (Text)
├── SKU (Text, unique)
├── Price (Number)
├── Images (Array of Images)
├── Description (Rich Text)
├── Specifications (Key-Value pairs)
├── Variants (Array):
│   ├── Size
│   ├── Color
│   └── Stock
└── Categories (References)
```

---

## Technical Architecture

### Frontend Architecture

**Monolith vs Micro-frontend**:
```
Monolith:
┌─────────────────────────────────────┐
│          Next.js App                │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│  │Page1│ │Page2│ │Page3│ │Page4│   │
│  └─────┘ └─────┘ └─────┘ └─────┘   │
│  Shared components library          │
└─────────────────────────────────────┘

Micro-frontends:
┌─────────────────────────────────────┐
│        Shell Application            │
│  ┌─────────┬─────────┬─────────┐   │
│  │ App 1   │ App 2   │ App 3   │   │
│  │ (Team A)│ (Team B)│ (Team C)│   │
│  │ React   │ Vue     │ Svelte  │   │
│  └─────────┴─────────┴─────────┘   │
└─────────────────────────────────────┘
```

### Data Flow Patterns

**Client-Side Rendering (CSR)**:
```
User → Browser → JS Bundle → API Calls → Render
Pros: Interactive, dynamic
Cons: Slower initial load, SEO challenges
```

**Server-Side Rendering (SSR)**:
```
User → Browser → Server → API → HTML → Render
Pros: Fast first paint, SEO-friendly
Cons: Server load, hydration complexity
```

**Static Site Generation (SSG)**:
```
Build Time → API → Generate HTML → CDN → User
Pros: Fastest, CDN cacheable, secure
Cons: Stale content, build time
```

### API Architecture

**REST vs GraphQL**:
```
REST:
GET /users/123
GET /users/123/posts
GET /users/123/followers
(Multiple requests)

GraphQL:
query {
  user(id: 123) {
    name
    posts { title }
    followers { count }
  }
}
(Single request)
```

---

## Technical Stack Selection

### Decision Framework

```
Step 1: Define Requirements
├── Performance needs (load time, interactions)
├── Team expertise
├── Integration requirements
├── Scale expectations
└── Budget constraints

Step 2: Evaluate Options
| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Performance | ★★★★☆ | ★★★☆☆ | ★★★★★ |
| Learning Curve| Low | High | Medium |
| Community | Large | Small | Medium |
| Cost | Free | Paid | Freemium |

Step 3: Prototype & Validate
├── Build proof of concept
├── Test critical path
├── Measure performance
└── Get team feedback

Step 4: Document Decision
├── Why chosen
├── Trade-offs accepted
├── Migration path
└── Exit strategy
```

### Common Stack Combinations

**Marketing Site**:
- Framework: Next.js (SSG)
- Styling: Tailwind CSS
- CMS: Sanity/Contentful
- Hosting: Vercel
- Analytics: Plausible/Google

**SaaS Application**:
- Framework: Next.js (SSR/CSR hybrid)
- Database: PostgreSQL + Prisma
- Auth: Auth0/Clerk/NextAuth
- Payments: Stripe
- Hosting: Vercel/AWS

**E-commerce**:
- Platform: Shopify/Next.js + Stripe
- CMS: Shopify/Sanity
- Search: Algolia
- Reviews: Judge.me
- Hosting: Vercel/Shopify

---

## System Scalability

### Performance Budget

```
Metrics:
├── First Contentful Paint: < 1.5s
├── Largest Contentful Paint: < 2.5s
├── Time to Interactive: < 3.5s
├── Cumulative Layout Shift: < 0.1
├── Total Bundle Size: < 200KB (initial)
└── Lighthouse Score: > 90

Enforcement:
├── CI/CD checks
├── Lighthouse CI
├── Bundle analyzer
└── Performance monitoring
```

### Scalability Patterns

```
Database:
├── Read replicas for scale
├── Connection pooling
├── Caching layer (Redis)
└── CDN for static assets

Frontend:
├── Code splitting
├── Lazy loading
├── Image optimization
└── Service workers for offline
```

---

## Documentation Standards

### Architecture Decision Records (ADRs)

```markdown
# ADR 001: [Decision Title]

## Status
Proposed / Accepted / Deprecated / Superseded

## Context
What is the issue that we're seeing?

## Decision
What is the change that we're proposing?

## Consequences
What becomes easier or more difficult?

## Alternatives Considered
- Option A: Why rejected
- Option B: Why rejected
```

---

## Validation Checklist

- [ ] Sitemap is complete and logical
- [ ] Navigation has 5-7 primary items max
- [ ] All user flows are mapped with decision points
- [ ] Content inventory is complete
- [ ] Technical stack is justified with trade-offs
- [ ] Performance budgets are defined
- [ ] Architecture decisions are documented
- [ ] Scalability needs are addressed
