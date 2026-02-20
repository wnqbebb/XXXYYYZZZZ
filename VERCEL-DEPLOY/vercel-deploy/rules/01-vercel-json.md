---
name: vercel-json
description: vercel.json configuration file - static and programmatic (vercel.ts) configuration.
version: 4.0.0
---

# vercel.json - Configuration File

> The heart of Vercel project configuration. Define builds, routing, functions, and more.

---

## MUST

### 1. Use Schema for IDE Autocomplete

**✅ CORRECT:**
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2
}
```

### 2. Define Framework Explicitly

**✅ CORRECT:**
```json
{
  "version": 2,
  "framework": "nextjs"
}
```

**Available frameworks:** `nextjs`, `gatsby`, `hexo`, `preact`, `react`, `vue`, `nuxt`, `svelte`, `sveltekit`, `angular`, `ember`, `hugo`, `jekyll`, `eleventy`, `docusaurus`, `docusaurus-v2`, `ionic`, `ionic-react`, `ionic-angular`, `create-react-app`, `gridsome`, `umijs`, `sapper`, `sanity`, `storybook`, `brunch`, `middleman`, `zola`, `parcel`, `fasthtml`, `solidstart`, `solidstart-v1`, `dojo`, `dojo-v2`, `remix`, `react-router`, `react-router-v7`, `vite`, `vuepress`, `vuepress-v2`, `hexo`, `mkdocs`

### 3. Configure Functions with Proper Limits

**✅ CORRECT:**
```json
{
  "version": 2,
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    },
    "app/api/**/*.ts": {
      "memory": 512,
      "maxDuration": 10
    }
  }
}
```

---

## FORBIDDEN

### 1. Never Commit Sensitive Data

**❌ FORBIDDEN:**
```json
{
  "env": {
    "DATABASE_URL": "postgres://user:password@host/db"
  }
}
```

**✅ CORRECT:**
```bash
# Use CLI instead
vercel env add DATABASE_URL production
```

### 2. Never Use Version 1

**❌ FORBIDDEN:**
```json
{
  "version": 1
}
```

**✅ CORRECT:**
```json
{
  "version": 2
}
```

---

## WHY

### Configuration Priority

1. Dashboard settings (highest)
2. `vercel.json` / `vercel.ts`
3. Framework defaults (lowest)

### Static vs Programmatic

| File | Use Case |
|------|----------|
| `vercel.json` | Static configuration |
| `vercel.ts` | Dynamic config with env vars, API calls |

---

## EXAMPLES

### Complete vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "version": 2,
  "name": "my-app",
  
  "framework": "nextjs",
  
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm ci",
  "outputDirectory": ".next",
  
  "regions": ["iad1"],
  
  "functions": {
    "api/**/*.ts": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ],
  
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ],
  
  "cleanUrls": true,
  "trailingSlash": false
}
```

### Programmatic Configuration (vercel.ts)

```typescript
// vercel.ts
import { VercelConfig } from '@vercel/sdk'

const config: VercelConfig = {
  version: 2,
  framework: 'nextjs',
  
  // Dynamic region based on env
  regions: process.env.VERCEL_ENV === 'production' 
    ? ['iad1', 'cdg1'] 
    : ['iad1'],
  
  // Conditional functions config
  functions: {
    'api/**/*.ts': {
      memory: process.env.VERCEL_ENV === 'production' ? 1024 : 512,
      maxDuration: 30
    }
  },
  
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Environment',
          value: process.env.VERCEL_ENV || 'development'
        }
      ]
    }
  ]
}

export default config
```

### Next.js Specific

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next",
  "installCommand": "npm ci"
}
```

### Static Site (No Build)

```json
{
  "version": 2,
  "framework": null,
  "buildCommand": null,
  "outputDirectory": "."
}
```

### Monorepo Configuration

```json
{
  "version": 2,
  "framework": "nextjs",
  "buildCommand": "cd apps/web && next build",
  "rootDirectory": "apps/web",
  "installCommand": "npm ci"
}
```

---

## Configuration Reference

| Property | Type | Description |
|----------|------|-------------|
| `$schema` | string | Schema URL for IDE support |
| `version` | number | Always `2` |
| `name` | string | Project name |
| `framework` | string | Framework preset |
| `buildCommand` | string | Build command override |
| `installCommand` | string | Install command override |
| `devCommand` | string | Dev command override |
| `outputDirectory` | string | Build output directory |
| `regions` | string[] | Function regions |
| `functions` | object | Function configuration |
| `headers` | array | HTTP headers |
| `redirects` | array | URL redirects |
| `rewrites` | array | URL rewrites |
| `cleanUrls` | boolean | Remove `.html` extensions |
| `trailingSlash` | boolean | Add/remove trailing slashes |

---

## Related Assets

- [vercel.json Template](../assets/configs/vercel.json)
- [vercel.ts Template](../assets/configs/vercel.ts)
- [Next.js Config](../assets/configs/nextjs-vercel.json)
