---
name: nextjs-deployment
description: Production deployment configuration. Load when deploying to production.
metadata:
  tags: nextjs, deployment, production, vercel
---

# Production Deployment

## Environment Variables

```bash
# .env.local (development)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
DATABASE_URL=postgresql://...

# .env.production
NEXTAUTH_URL=https://yourdomain.com
```

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Docker deployment
  
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/webp', 'image/avif']
  },
  
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        }
      ]
    }
  ],
  
  redirects: async () => [
    {
      source: '/old-page',
      destination: '/new-page',
      permanent: true
    }
  ]
}

module.exports = nextConfig
```

## Build Optimization

```bash
# Analyze bundle
npm run build -- --analyze

# Check for errors
npm run lint
npm run type-check

# Production build
npm run build
```
