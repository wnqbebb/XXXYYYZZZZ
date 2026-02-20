---
name: environment-variables
description: Environment variables management across local, preview, and production environments.
version: 4.0.0
---

# Environment Variables - Secure Configuration

> Manage secrets and configuration across environments securely.

---

## MUST

### 1. Use CLI for Environment Variables

**✅ CORRECT:**
```bash
# Add environment variable
vercel env add DATABASE_URL production

# Pull to local
vercel env pull .env.local
```

### 2. Never Commit .env Files

**✅ CORRECT:**
```bash
# Add to .gitignore
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
```

### 3. Use Different Values Per Environment

**✅ CORRECT:**
```bash
# Production
vercel env add DATABASE_URL production

# Preview (all non-production)
vercel env add DATABASE_URL preview

# Development
vercel env add DATABASE_URL development
```

---

## FORBIDDEN

### 1. Never Hardcode Secrets

**❌ FORBIDDEN:**
```typescript
const API_KEY = 'sk-abc123xyz'
```

**✅ CORRECT:**
```typescript
const API_KEY = process.env.API_KEY
```

### 2. Never Expose Secrets to Client

**❌ FORBIDDEN:**
```typescript
// ❌ Exposed to browser
export const config = {
  apiKey: process.env.SECRET_API_KEY
}
```

**✅ CORRECT:**
```typescript
// ✅ Server-side only
export async function GET() {
  const apiKey = process.env.SECRET_API_KEY
  // Use on server only
}
```

---

## WHY

### Environment Types

| Environment | Description |
|-------------|-------------|
| Production | Live site (main branch) |
| Preview | PR previews, staging |
| Development | Local development |

### Variable Naming

| Prefix | Scope |
|--------|-------|
| `NEXT_PUBLIC_` | Client & Server |
| (no prefix) | Server only |

---

## EXAMPLES

### Environment Setup

```bash
# 1. Add production variable
vercel env add DATABASE_URL production
# Enter value: postgres://...

# 2. Add preview variable
vercel env add DATABASE_URL preview
# Enter value: postgres://staging...

# 3. Pull to local
vercel env pull .env.local
```

### .env.example

```bash
# .env.example - Template for team
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
OPENAI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Using in Code

```typescript
// Server-side (safe)
const dbUrl = process.env.DATABASE_URL

// Client-side (must use NEXT_PUBLIC_)
const apiUrl = process.env.NEXT_PUBLIC_API_URL
```

### TypeScript Types

```typescript
// types/env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string
    NEXTAUTH_SECRET: string
    NEXTAUTH_URL: string
    NEXT_PUBLIC_API_URL: string
  }
}
```

---

## Related Assets

- [.env.example Template](../assets/templates/env.example)
- [env.d.ts Template](../assets/templates/env.d.ts)
