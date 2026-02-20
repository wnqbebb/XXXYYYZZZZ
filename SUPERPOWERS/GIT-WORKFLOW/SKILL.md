---
name: git-workflow
description: Professional Git version control and collaboration workflow. Use (1) When starting new projects, (2) Before/after every code change, (3) When collaborating, (4) Preparing for deploy, (5) Resolving conflicts. MANDATORY for all version control operations.
metadata:
  tags: git, version-control, collaboration, branching, commits, workflow
  author: Santiago Workflow Systems
  version: 2.0.0
  priority: critical
---

# Git Workflow Master System

**Your code's time machine and collaboration backbone.**

---

## The Git Doctrine

### Core Principles

1. **Commits Tell Stories** - Each commit is a chapter in your project's history
2. **Branches Isolate Risk** - Separate concerns, merge when ready
3. **History is Immutable** - Once shared, never rewrite public history
4. **Small is Beautiful** - Frequent, focused commits beat monolithic changes
5. **Communication Through Commits** - Your future teammates (and self) will read these

---

## When to Use Git

### Mandatory Operations

```
MUST use Git when:
├── Starting ANY new project
├── Before any code changes (create branch)
├── After completing any logical unit of work (commit)
├── Before switching contexts (stash/commit)
├── Before deploying (tag/version)
├── When collaborating (pull/push/merge)
└── When something breaks (bisect/blame)

Git is NOT optional. Version control is a professional requirement.
```

---

## Repository Setup

### New Project Initialization

Load [rules/setup.md](./rules/setup.md) for complete setup procedures.

```bash
# 1. Initialize repository
git init

# 2. Create comprehensive .gitignore BEFORE first commit
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
.next/
dist/
build/
out/

# Environment files
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Testing
coverage/
.nyc_output/

# Misc
.cache/
temp/
tmp/
EOF

# 3. Stage and commit
git add .gitignore
git commit -m "chore: Initial commit with gitignore"

# 4. Add project files
git add .
git commit -m "chore: Project setup"
```

### Connecting to Remote

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/username/repo.git
git branch -M main
git push -u origin main

# Verify connection
git remote -v
```

---

## Branching Strategy

### The Branch Model

```
main                    Production-ready code
  ↑
develop                 Integration branch (optional)
  ↑
feature/login           Feature branches
feature/checkout
  ↑
hotfix/payment-bug      Emergency fixes
```

### Branch Naming Conventions

```
TYPE/DESCRIPTION

Types:
├── feature/   - New functionality
├── fix/       - Bug fixes
├── refactor/  - Code restructuring
├── docs/      - Documentation only
├── test/      - Test additions/changes
├── chore/     - Maintenance tasks
└── hotfix/    - Production emergency fixes

Examples:
├── feature/user-authentication
├── fix/memory-leak-in-dashboard
├── refactor/extract-payment-service
├── docs/api-endpoint-descriptions
└── hotfix/critical-security-patch
```

### Branch Lifecycle

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/hero-section

# 2. Work and commit regularly
# ... make changes ...
git add .
git commit -m "feat(hero): Add parallax scroll effect"

# ... more changes ...
git add .
git commit -m "feat(hero): Implement mobile responsive layout"

# 3. Keep branch updated
git checkout main
git pull origin main
git checkout feature/hero-section
git rebase main  # or: git merge main

# 4. Push branch
git push origin feature/hero-section

# 5. Create Pull Request (on GitHub/GitLab)

# 6. After PR approved, merge
git checkout main
git merge --no-ff feature/hero-section
git push origin main

# 7. Delete branch
git branch -d feature/hero-section
git push origin --delete feature/hero-section
```

---

## Commit Standards

### Conventional Commits

```
type(scope): subject

[optional body]

[optional footer(s)]
```

**Types**:
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting (no code change)
refactor: Code restructuring
perf:     Performance improvement
test:     Adding/updating tests
chore:    Build/config/tooling changes
ci:       CI/CD changes
revert:   Revert previous commit
```

**Examples**:
```bash
# Good commits
feat(auth): Add OAuth2 login with Google
fix(api): Handle null response from payment gateway
docs(readme): Update installation instructions
refactor(utils): Extract date formatting to helper
style(landing): Fix indentation in Hero component
test(checkout): Add tests for coupon validation
chore(deps): Update TypeScript to 5.3.0

# Bad commits (avoid)
update stuff
code changes
fix
WIP
asdf
```

### Commit Message Quality

```
SUBJECT LINE (max 50 chars):
✓ Imperative mood ("Add feature" not "Added feature")
✓ No period at end
✓ Describes what and why, not how
✓ Specific, not vague

BODY (when needed, wrap at 72 chars):
✓ Explain motivation for change
✓ Contrast with previous behavior
✓ Reference issues/tickets

FOOTER (for breaking changes):
✓ BREAKING CHANGE: description
✓ Closes #123
```

---

## Daily Workflow

### Start of Day

```bash
# Update main branch
git checkout main
git pull origin main

# Check status of current work
git status

# Review what changed recently
git log --oneline -10
```

### During Work

```bash
# Check what's changed
git status

# Review changes before staging
git diff

# Stage specific files
git add src/components/Hero.tsx

# Stage all changes
git add .

# Commit with message
git commit -m "feat(hero): Add responsive navigation"

# Check recent commits
git log --oneline -5
```

### End of Day

```bash
# Ensure all work is committed
git status  # Should be clean

# Push to remote
git push origin feature/branch-name

# Or if not ready, note progress
git log --oneline -3 > progress.txt
```

---

## Advanced Operations

### Undoing Changes

Load [rules/undoing.md](./rules/undoing.md) for complete recovery procedures.

```bash
# Unstage file (before commit)
git restore --staged filename

# Discard local changes
git restore filename

# Amend last commit (if not pushed)
git commit --amend -m "New message"
git commit --amend --no-edit  # Keep message, add changes

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert pushed commit (creates new commit)
git revert <commit-hash>
```

### Stashing

```bash
# Stash current changes
git stash push -m "Work in progress on hero"

# List stashes
git stash list

# Apply stash (keeps in stash list)
git stash apply stash@{0}

# Pop stash (applies and removes)
git stash pop

# Drop stash
git stash drop stash@{0}

# Apply stash to new branch
git stash branch new-branch-name stash@{0}
```

### Resolving Conflicts

```bash
# When merge conflict occurs:
# 1. See conflicting files
git status

# 2. Open files and resolve conflicts
# Look for <<<<<<< HEAD, =======, >>>>>>> branch

# 3. Mark as resolved
git add resolved-file

# 4. Complete merge
git commit -m "Merge branch 'feature/x' into main"

# Or abort merge
git merge --abort
```

---

## Collaboration

### Pull Request Workflow

```
1. PUSH BRANCH
git push origin feature/description

2. CREATE PR (via GitHub/GitLab UI)
- Fill description template
- Link related issues
- Add reviewers
- Add labels

3. CODE REVIEW
- Address feedback
- Push updates
- Re-request review

4. MERGE
- Squash if many small commits
- Rebase if clean history preferred
- Merge commit if preserving branch history

5. CLEAN UP
git checkout main
git pull origin main
git branch -d feature/description
git push origin --delete feature/description
```

### Syncing with Team

```bash
# Fetch all branches
git fetch origin

# See what's new
git log main..origin/main --oneline

# Pull changes
git pull origin main

# Or rebase your work on latest
git pull --rebase origin main
```

---

## Deployment Workflow

### Version Tagging

```bash
# Semantic versioning: MAJOR.MINOR.PATCH
# MAJOR: Breaking changes
# MINOR: New features (backward compatible)
# PATCH: Bug fixes

# Create annotated tag
git tag -a v1.2.0 -m "Release version 1.2.0"

# Push tags
git push origin v1.2.0
# or
git push origin --tags

# List tags
git tag -l

# Checkout specific version
git checkout v1.2.0
```

### Pre-Deploy Checklist

```bash
# 1. Ensure clean working directory
git status  # Should show "nothing to commit"

# 2. Verify on correct branch
git branch  # Should show * main

# 3. Pull latest
git pull origin main

# 4. Run tests
npm test

# 5. Build
npm run build

# 6. Tag release
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0

# 7. Deploy
vercel --prod
```

---

## Rule Files Index

| File | Purpose | When to Load |
|------|---------|--------------|
| [setup.md](./rules/setup.md) | Repository initialization | New projects |
| [undoing.md](./rules/undoing.md) | Recovery operations | Mistakes happen |
| [branching.md](./rules/branching.md) | Advanced branching | Complex workflows |
| [history.md](./rules/history.md) | History inspection | Debugging, auditing |

---

## Git Checklist

- [ ] .gitignore configured before first commit
- [ ] Commit messages follow conventional format
- [ ] Branches named with type/description pattern
- [ ] Commits are small and focused
- [ ] Feature branches kept up to date with main
- [ ] No secrets in repository
- [ ] Clean working directory before deploy
- [ ] Tags used for releases
- [ ] Pull requests used for code review
- [ ] Branches cleaned up after merge

---

## Remember

**Git is your safety net, your collaboration tool, and your project's history. Use it deliberately and consistently.**
