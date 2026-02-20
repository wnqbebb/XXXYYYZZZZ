---
name: vercel-deploy
description: |
  Vercel deployment and configuration mastery. Use for (1) Deploying Next.js/React apps, 
  (2) Configuring custom domains, (3) Environment variables management, (4) CI/CD setup, 
  (5) Serverless Functions, (6) Edge Middleware. MANDATORY for deployment.
metadata:
  tags: 
    - vercel
    - deployment
    - hosting
    - cicd
    - serverless
    - edge
    - nextjs
  author: Santiago Workflow Systems
  version: 4.0.0
  priority: critical
  last_updated: 2025-02-19
---

# Vercel Deploy Master System

**Ship fast. Ship confidently. Edge-ready.**

> 🚀 **Vercel Functions** (formerly Edge Functions + Middleware) unified in 2025 with Fluid Compute and Active CPU Pricing.

---

## Quick Start

### CLI Installation
```bash
# Install Vercel CLI globally
npm i -g vercel

# Or use npx (recommended)
npx vercel
```

### Authentication
```bash
# Login to Vercel
vercel login

# Verify login
vercel whoami
```

### Deploy
```bash
# Deploy to preview (development)
vercel

# Deploy to production
vercel --prod

# Deploy with prebuilt (local build)
vercel build && vercel deploy --prebuilt --prod
```

### Git Integration (Recommended)
```
1. Push code to GitHub/GitLab/Bitbucket
2. Import project in Vercel Dashboard
3. Configure build settings
4. Auto-deploy on every push
```

---

## Architecture Overview

```
vercel-deploy/
├── SKILL.md                    # This file - Master Manifest
├── rules/
│   ├── 01-vercel-json.md       # Configuration file
│   ├── 02-cli-deployment.md    # CLI commands & workflows
│   ├── 03-git-integration.md   # Git-based deployments
│   ├── 04-serverless-functions.md # Vercel Functions
│   ├── 05-edge-middleware.md   # Routing Middleware
│   ├── 06-environment-variables.md # Env vars management
│   ├── 07-custom-domains.md    # Domains & SSL
│   ├── 08-troubleshooting.md   # Common issues
│   └── assets/
│       ├── configs/            # vercel.json templates
│       ├── scripts/            # Deploy scripts
│       └── templates/          # Project templates
└── references/
    ├── official-docs.md        # Links to official docs
    └── migration-guides.md     # Migration guides
```

---

## Rule Index

| Rule | Topic | Priority |
|------|-------|----------|
| [01-vercel-json](rules/01-vercel-json.md) | Configuration file | CRITICAL |
| [02-cli-deployment](rules/02-cli-deployment.md) | CLI commands | CRITICAL |
| [03-git-integration](rules/03-git-integration.md) | Git workflows | HIGH |
| [04-serverless-functions](rules/04-serverless-functions.md) | Vercel Functions | HIGH |
| [05-edge-middleware](rules/05-edge-middleware.md) | Routing Middleware | HIGH |
| [06-environment-variables](rules/06-environment-variables.md) | Environment vars | HIGH |
| [07-custom-domains](rules/07-custom-domains.md) | Domains & SSL | MEDIUM |
| [08-troubleshooting](rules/08-troubleshooting.md) | Debug & fix | MEDIUM |

---

## Deployment Methods

| Method | Use Case | Auto-Deploy |
|--------|----------|-------------|
| **Git** | Production apps | ✅ Yes |
| **CLI** | Quick tests, prototypes | ❌ Manual |
| **Deploy Hooks** | External triggers | ✅ Via HTTP |
| **REST API** | Custom workflows | ✅ Programmatic |

---

## Vercel Functions (2025 Unified)

### Runtime Types

| Runtime | Use Case | Cold Start | Max Duration |
|---------|----------|------------|--------------|
| **Edge** | Fast, global, lightweight | ~9x faster | 25s to respond, 300s stream |
| **Node.js** | Full Node.js API access | Standard | 10s (Hobby), 300s (Pro+) |

### Configuration
```typescript
// app/api/example/route.ts
export const runtime = 'edge' // or 'nodejs'
export const preferredRegion = ['iad1', 'cdg1']
export const maxDuration = 30 // seconds
```

### Fluid Compute (New 2025)
- Pay only for **active CPU cycles**
- Not charged for I/O wait time
- Perfect for AI inference and streaming APIs

---

## Environment Variables

```bash
# Add environment variable
vercel env add DATABASE_URL production

# Pull to local
vercel env pull .env.local

# List all
vercel env ls

# Remove
vercel env rm DATABASE_URL production
```

---

## Pre-flight Checklist

### Before First Deploy
- [ ] Vercel CLI installed and logged in
- [ ] Project linked (`vercel link`)
- [ ] Build passes locally (`npm run build`)
- [ ] Environment variables configured
- [ ] `.vercelignore` configured

### For Production
- [ ] Custom domain connected
- [ ] HTTPS enabled (automatic)
- [ ] Analytics enabled
- [ ] Speed Insights active
- [ ] Environment variables for production set
- [ ] Preview deployments tested

### For Enterprise
- [ ] Team access configured
- [ ] SAML SSO enabled
- [ ] Audit logs reviewed
- [ ] DDoS protection enabled

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)
- [Vercel Functions](https://vercel.com/docs/functions)
- [Vercel REST API](https://vercel.com/docs/rest-api)

---

*Last updated: 2025-02-19 | Version 4.0.0*
