# Migration Guides

## Edge Functions to Vercel Functions (2025)

Vercel unified Edge Functions and Edge Middleware into **Vercel Functions** in 2025.

### Before
```typescript
// Edge Function (old)
export const config = {
  runtime: 'edge'
}
```

### After
```typescript
// Vercel Function (new)
export const runtime = 'edge'
```

### Middleware Changes

| Before | After |
|--------|-------|
| Edge Middleware | Vercel Routing Middleware |
| Runs at edge | Runs before cache |

## Next.js Pages to App Router

### API Routes

**Pages Router:**
```typescript
// pages/api/hello.ts
export default function handler(req, res) {
  res.json({ message: 'Hello' })
}
```

**App Router:**
```typescript
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

## Vercel JSON v1 to v2

### Before
```json
{
  "version": 1
}
```

### After
```json
{
  "version": 2
}
```

## Environment Variables

### Before
```json
{
  "env": {
    "KEY": "value"
  }
}
```

### After
```bash
vercel env add KEY production
```
