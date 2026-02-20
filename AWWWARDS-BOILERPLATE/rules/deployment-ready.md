---
name: deployment-ready
description: Production deployment checklist and configuration. Load before deploying.
metadata:
  tags: deployment, production, vercel, checklist
---

# Deployment Ready Rules

## MUST: Pre-deployment Checklist

```yaml
Build Verification:
  - [ ] npm run build completes without errors
  - [ ] npm run lint shows no errors
  - [ ] TypeScript compilation succeeds
  - [ ] All environment variables set
  - [ ] No console.log statements (use logger)

Performance Verification:
  - [ ] Lighthouse score > 90 on all metrics
  - [ ] LCP < 1.2s on mobile
  - [ ] CLS < 0.05
  - [ ] Images optimized
  - [ ] Fonts preloaded

SEO Verification:
  - [ ] Meta tags present on all pages
  - [ ] Open Graph images configured
  - [ ] robots.txt configured
  - [ ] sitemap.xml generated
  - [ ] Canonical URLs set
```

## MUST: Environment Variables

```bash
# .env.local (development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# .env.production (production)
NEXT_PUBLIC_SITE_URL=https://yoursite.com
NEXT_PUBLIC_API_URL=https://yoursite.com/api

# Private (server-only)
RESEND_API_KEY=re_xxxxxxxx
DATABASE_URL=postgresql://...
```

### WHY: Environment Variables

```yaml
NEXT_PUBLIC_:
  - Exposed to browser
  - Use for public API URLs
  - Use for public keys

Server-only (no prefix):
  - Private API keys
  - Database credentials
  - Secrets
```

## MUST: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (development)
vercel

# Deploy (production)
vercel --prod
```

## MUST: Post-deployment Verification

```bash
# Test critical paths
curl -I https://yoursite.com

# Check performance
# Run Lighthouse CI
npx lighthouse-ci https://yoursite.com

# Check security headers
curl -I https://yoursite.com | grep -E "(X-Frame|X-Content|Referrer)"
```

## Common Deployment Errors

### Error: "Build failed"

```bash
# CAUSE: TypeScript errors
# FIX:
npm run type-check

# CAUSE: Missing environment variables
# FIX: Add to Vercel dashboard
vercel env add VARIABLE_NAME
```

### Error: "Images not loading"

```bash
# CAUSE: next/image domains not configured
# FIX: Add to next.config.ts
images: {
  remotePatterns: [
    { hostname: 'your-cdn.com' }
  ]
}
```

### Error: "404 on dynamic routes"

```bash
# CAUSE: generateStaticParams missing
# FIX: Add to dynamic pages
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}
```

---

**Deployment complete. Site is live! 🚀**
