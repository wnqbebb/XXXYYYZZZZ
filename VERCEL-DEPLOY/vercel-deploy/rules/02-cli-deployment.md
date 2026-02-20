---
name: cli-deployment
description: Vercel CLI commands, deployment workflows, and automation scripts.
version: 4.0.0
---

# CLI Deployment - Command Line Mastery

> Deploy from your terminal with full control over the deployment process.

---

## MUST

### 1. Link Project Before First Deploy

**✅ CORRECT:**
```bash
# Navigate to project directory
cd my-project

# Link to Vercel project
vercel link

# Deploy
vercel
```

### 2. Use Prebuilt for Local Builds

**✅ CORRECT:**
```bash
# Build locally
vercel build

# Deploy prebuilt files only
vercel deploy --prebuilt

# Production deploy with prebuilt
vercel build --prod && vercel deploy --prebuilt --prod
```

### 3. Add Deploy Scripts to package.json

**✅ CORRECT:**
```json
{
  "scripts": {
    "deploy": "vercel build --prod && vercel deploy --prebuilt --prod",
    "deploy:preview": "vercel build && vercel deploy --prebuilt",
    "deploy:raw": "vercel --prod"
  }
}
```

---

## FORBIDDEN

### 1. Never Deploy Without Testing Build Locally

**❌ FORBIDDEN:**
```bash
# ❌ Deploy without local verification
vercel --prod
```

**✅ CORRECT:**
```bash
# ✅ Test build locally first
npm run build
vercel --prod
```

### 2. Never Share Token in Code

**❌ FORBIDDEN:**
```bash
# ❌ Token in script
vercel --token abc123 --prod
```

**✅ CORRECT:**
```bash
# ✅ Use environment variable
export VERCEL_TOKEN=$(cat .vercel-token)
vercel --token $VERCEL_TOKEN --prod
```

---

## WHY

### Deployment Flow

```
Local Build → .vercel/output → Upload → Deploy
```

### Prebuilt vs Remote Build

| Method | Source Code | Build Location | Use Case |
|--------|-------------|----------------|----------|
| `vercel` | Uploaded | Vercel servers | Quick deploy |
| `vercel build && vercel deploy --prebuilt` | Not uploaded | Local | Private code |

---

## CLI Commands Reference

### Authentication
```bash
vercel login              # Login to Vercel
vercel logout             # Logout
vercel whoami             # Show current user
```

### Project Management
```bash
vercel link               # Link directory to project
vercel init               # Initialize new project
vercel list               # List deployments
vercel inspect <url>      # Inspect deployment
```

### Deployment
```bash
vercel                    # Deploy to preview
vercel --prod             # Deploy to production
vercel --yes              # Skip confirmation
vercel --force            # Force new build
vercel --no-wait          # Don't wait for completion
```

### Environment Variables
```bash
vercel env add <name> [environment]     # Add env var
vercel env ls                           # List env vars
vercel env rm <name> [environment]      # Remove env var
vercel env pull [filename]              # Pull to local file
```

### Domains
```bash
vercel domains add <domain>             # Add domain
vercel domains ls                       # List domains
vercel domains rm <domain>              # Remove domain
vercel domains inspect <domain>         # Inspect domain
```

### DNS
```bash
vercel dns add <domain> <name> <type> <value>   # Add DNS record
vercel dns ls <domain>                          # List DNS records
vercel dns rm <record-id>                       # Remove DNS record
```

### Logs
```bash
vercel logs [deployment-url]            # View logs
vercel logs --follow                    # Follow logs
vercel logs --output raw                # Raw output
```

### Other
```bash
vercel rollback [deployment-url]        # Rollback deployment
vercel promote [deployment-url]         # Promote to production
vercel redeploy [deployment-url]        # Redeploy
vercel dev                              # Start dev server
vercel build                            # Build locally
```

---

## EXAMPLES

### Complete Deployment Workflow

```bash
#!/bin/bash
# deploy.sh - Production deployment script

set -e

echo "🚀 Starting deployment..."

# Verify environment
if [ -z "$VERCEL_TOKEN" ]; then
  echo "❌ VERCEL_TOKEN not set"
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build
echo "🔨 Building..."
vercel build --prod --token=$VERCEL_TOKEN

# Deploy
echo "🚀 Deploying..."
vercel deploy --prebuilt --prod --token=$VERCEL_TOKEN

echo "✅ Deployment complete!"
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ github.ref == 'refs/heads/main' && '--prod' || '' }}
```

### Preview Deployment for PRs

```yaml
# .github/workflows/preview.yml
name: Preview Deployment

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy Preview
        uses: vercel/action-deploy@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
      
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🚀 Preview deployed: ${process.env.VERCEL_URL}`
            })
```

### Multi-Environment Deploy

```bash
#!/bin/bash
# deploy-env.sh

ENV=$1

if [ -z "$ENV" ]; then
  echo "Usage: ./deploy-env.sh [development|staging|production]"
  exit 1
fi

case $ENV in
  development)
    vercel
    ;;
  staging)
    vercel --target=staging
    ;;
  production)
    vercel --prod
    ;;
  *)
    echo "Unknown environment: $ENV"
    exit 1
    ;;
esac
```

---

## Related Assets

- [Deploy Script](../assets/scripts/deploy.sh)
- [GitHub Actions Workflow](../assets/templates/github-actions.yml)
- [GitLab CI Config](../assets/templates/gitlab-ci.yml)
