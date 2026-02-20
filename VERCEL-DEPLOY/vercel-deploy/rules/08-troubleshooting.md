---
name: troubleshooting
description: Common issues, debugging, and solutions for Vercel deployments.
version: 4.0.0
---

# Troubleshooting - Debug & Fix

> Common issues and their solutions.

---

## Common Issues

### Build Failures

**Error:** `Build command failed`

**Solutions:**
```bash
# 1. Test build locally
npm run build

# 2. Check build command in vercel.json
{
  "buildCommand": "next build"
}

# 3. Clear cache and redeploy
vercel --force
```

### Environment Variables Not Found

**Error:** `process.env.X is undefined`

**Solutions:**
```bash
# 1. Verify env var is set
vercel env ls

# 2. Pull to local
vercel env pull .env.local

# 3. Check spelling and environment
vercel env add MY_VAR production
```

### Function Timeout

**Error:** `FUNCTION_INVOCATION_TIMEOUT`

**Solutions:**
```typescript
// Increase maxDuration
export const maxDuration = 300 // 5 minutes

// Or optimize function
export const runtime = 'edge' // Faster cold starts
```

### 404 on Dynamic Routes

**Error:** `404 Not Found`

**Solutions:**
```typescript
// Check generateStaticParams for App Router
export async function generateStaticParams() {
  const posts = await fetchPosts()
  return posts.map((post) => ({
    slug: post.slug
  }))
}
```

---

## Debugging

### View Logs

```bash
# View deployment logs
vercel logs [deployment-url]

# Follow logs
vercel logs --follow

# Raw output
vercel logs --output raw
```

### Inspect Deployment

```bash
# Get deployment info
vercel inspect [deployment-url]
```

### Rollback

```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

---

## Performance Issues

### Slow Cold Starts

**Solution:**
```typescript
// Use Edge Runtime
export const runtime = 'edge'

// Or increase memory
export const memory = 1024
```

### Large Bundle Size

**Solution:**
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Use dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

---

## Related Assets

- [Troubleshooting Guide](../assets/templates/troubleshooting.md)
