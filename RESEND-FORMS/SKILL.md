---
name: RESEND-FORMS
description: Expert guide for integrating Resend email API with React forms in Next.js applications using TypeScript, React Email templates, and best practices.
tags:
  - resend
  - email
  - forms
  - react
  - nextjs
  - typescript
  - react-email
  - api-routes
version: "1.0.0"
---

# RESEND-FORMS: Email API Integration for React Forms

> **Mission**: Enable developers to build robust, type-safe email sending functionality integrated with React forms using Resend API, React Email templates, and Next.js App Router.

## Overview

This skill provides comprehensive guidance for:
- Setting up Resend API in Next.js applications
- Creating type-safe API routes for email handling
- Building responsive email templates with React Email
- Implementing form validation and error handling
- Managing email deliverability and best practices

## Index of Rules

| Rule | Description | File |
|------|-------------|------|
| **API Routes** | Next.js App Router API routes for sending emails | [rules/api-routes.md](./rules/api-routes.md) |
| **React Email Templates** | Creating email templates with React Email components | [rules/react-email-templates.md](./rules/react-email-templates.md) |
| **Form Handling** | Frontend form integration with validation | [rules/form-handling.md](./rules/form-handling.md) |
| **Error Handling** | Comprehensive error handling and logging | [rules/error-handling.md](./rules/error-handling.md) |

## Quick Start

```bash
# Install dependencies
npm install resend @react-email/components @react-email/render
npm install -D @types/react @types/react-dom
```

## Environment Setup

```bash
# .env.local
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=your-email@example.com
```

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Form    │────▶│  Next.js API    │────▶│   Resend API    │
│   (Frontend)    │     │   Route         │     │   (Email)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Validation     │     │  React Email    │     │  Delivered      │
│  (Zod/Yup)      │     │  Template       │     │  Email          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## When to Use This Skill

- **Contact Forms**: Send contact form submissions to your inbox
- **Notification Emails**: User notifications, alerts, and updates
- **Transactional Emails**: Welcome emails, password resets, confirmations
- **Marketing Emails**: Newsletters and promotional content (with appropriate handling)

## Key Dependencies

| Package | Purpose | Version |
|---------|---------|---------|
| `resend` | Email API SDK | ^3.x |
| `@react-email/components` | Email components | ^0.x |
| `@react-email/render` | Email rendering | ^0.x |

## Related Skills

- [React Forms](../REACT-FORMS/) - Form handling and validation
- [Next.js API](../NEXTJS-API/) - API route patterns
- [TypeScript](../TYPESCRIPT/) - Type safety patterns

---

*Last updated: 2026-02-18*
