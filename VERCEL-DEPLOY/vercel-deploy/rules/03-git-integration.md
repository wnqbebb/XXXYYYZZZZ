---
name: git-integration
description: Git-based deployments, branch previews, and CI/CD workflows.
version: 4.0.0
---

# Git Integration - Automated Deployments

> Connect your Git repository for automatic deployments on every push.

---

## MUST

### 1. Connect Git Repository in Dashboard

**✅ CORRECT:**
```
1. Go to Vercel Dashboard
2. Click "Add New Project"
3. Import Git Repository
4. Configure build settings
5. Deploy
```

### 2. Configure Branch Deployments

**✅ CORRECT:**
```
Dashboard → Project Settings → Git
├── Production Branch: main
├── Preview Branches: * (all branches)
└── Deploy Hooks: Enabled
```

### 3. Use Deploy Hooks for External Triggers

**✅ CORRECT:**
```bash
# Create deploy hook
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx
```

---

## FORBIDDEN

### 1. Never Push Sensitive Files

**❌ FORBIDDEN:**
```bash
# ❌ Commit env files
git add .env.local
git commit -m "add env"
```

**✅ CORRECT:**
```bash
# ✅ Add to .gitignore
echo ".env.local" >> .gitignore
git add .gitignore
```

### 2. Never Ignore Build Errors

**❌ FORBIDDEN:**
```bash
# ❌ Deploy with failing build
vercel --force
```

**✅ CORRECT:**
```bash
# ✅ Fix errors first
npm run build
# Then deploy
vercel --prod
```

---

## WHY

### Git Workflow Benefits

| Feature | Benefit |
|---------|---------|
| Auto-deploy | Push to deploy |
| Preview URLs | Test before merge |
| Branch isolation | Separate environments |
| Rollback | Revert to previous commit |

### Supported Providers

- GitHub
- GitLab
- Bitbucket

---

## EXAMPLES

### GitHub Integration Setup

```
1. Push code to GitHub
2. Vercel Dashboard → Add New Project
3. Select repository
4. Configure:
   - Framework Preset: Next.js
   - Build Command: next build
   - Output Directory: .next
5. Deploy
```

### Branch Strategy

```
main        → Production deployment
  ↓
develop     → Staging deployment
  ↓
feature/*   → Preview deployments
  ↓
hotfix/*    → Urgent preview deployments
```

### Preview Deployment Comment

```yaml
# .github/workflows/preview-comment.yml
name: Preview Comment

on:
  pull_request:
    types: [opened]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## 🚀 Preview Deployment
              
              A preview deployment will be created automatically when you push changes.
              
              ### Useful Links
              - [Vercel Dashboard](https://vercel.com/dashboard)
              - [Project Settings](https://vercel.com/dashboard/settings)
              `
            })
```

### Protected Branches

```
GitHub Settings → Branches → Add rule
├── Branch name pattern: main
├── Require pull request reviews: 1
├── Require status checks: ✅ Vercel
└── Include administrators: false
```

### Monorepo Configuration

```json
// vercel.json in apps/web
{
  "version": 2,
  "framework": "nextjs",
  "rootDirectory": "apps/web",
  "installCommand": "cd ../.. && npm ci",
  "buildCommand": "cd ../.. && npm run build --workspace=web"
}
```

### Skip Deployment

```bash
# Add [skip ci] or [skip vercel] to commit message
git commit -m "update readme [skip ci]"
```

---

## Related Assets

- [Branch Strategy Template](../assets/templates/branch-strategy.md)
- [GitHub Actions Collection](../assets/templates/github-actions/)
