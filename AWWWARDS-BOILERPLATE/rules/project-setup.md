---
name: project-setup
description: Initial project creation and environment setup for Awwwards boilerplate. Load when starting a new project.
metadata:
  tags: setup, initialization, boilerplate, scaffolding
---

# Project Setup Rules

## MUST: Environment Requirements

```yaml
MUST HAVE:
  Node.js: ">= 18.17.0"
  npm: ">= 9.0.0" OR pnpm: ">= 8.0.0" OR yarn: ">= 1.22.0"
  Git: ">= 2.30.0"

VERIFY:
  node --version  # Should show v18.x or higher
  npm --version   # Should show 9.x or higher
```

## MUST: Create Next.js Project

### Command (Exact)

```bash
npx create-next-app@latest PROJECT_NAME \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias "@/*" \
  --use-npm
```

### WHY: These Flags

```yaml
--typescript:     
  MUST: Type safety for enterprise projects
  FORBIDDEN: JavaScript-only projects

--tailwind:       
  MUST: Utility-first styling standard
  FORBIDDEN: CSS-in-JS (Styled Components, Emotion)

--eslint:         
  MUST: Code quality enforcement
  WHY: Prevents common bugs

--app:            
  MUST: App Router for RSC
  FORBIDDEN: Pages Router (legacy)

--src-dir=false:  
  MUST: Flat structure (app/ at root)
  WHY: Simpler imports, standard convention

--import-alias:   
  MUST: "@/*" for clean imports
  WHY: Absolute imports prevent ../../../ hell
```

## MUST: Directory Navigation

```bash
# MUST: Enter project directory immediately
cd PROJECT_NAME

# MUST: Verify structure
ls -la
# Expected: app/ components/ lib/ public/ package.json
```

## MUST: Initialize Git

```bash
# MUST: Create .gitignore BEFORE first commit
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
.next/
out/
dist/
build/

# Environment
.env
.env.local
.env.*.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Misc
*.log
.cache/
temp/
tmp/
EOF

# MUST: Initial commit
git init
git add .
git commit -m "chore: Initial commit with Next.js boilerplate"
```

## MUST: Verify Installation

```bash
# MUST: Check all files exist
[ -f "package.json" ] && echo "✓ package.json"
[ -f "next.config.js" ] && echo "✓ next.config.js"
[ -f "tailwind.config.ts" ] && echo "✓ tailwind.config.ts"
[ -f "tsconfig.json" ] && echo "✓ tsconfig.json"
[ -d "app" ] && echo "✓ app/ directory"

# MUST: Verify dev server works
npm run dev
# Navigate to http://localhost:3000
# MUST see: Next.js default page
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  - Using create-react-app (outdated)
  - Using Next.js < 14 (missing features)
  - Using JavaScript instead of TypeScript
  - Using CSS modules over Tailwind
  - Using Pages Router over App Router
  - Skipping ESLint configuration
  - Using relative imports (../../../)

WHY:
  These choices prevent Awwwards-level quality
  and make maintenance impossible at scale.
```

## Common Errors

### Error: "npm ERR! code ENOENT"

```bash
# CAUSE: Node.js not installed or wrong version
# FIX:
nvm install 18
nvm use 18
```

### Error: "Port 3000 already in use"

```bash
# FIX: Kill process or use different port
npx kill-port 3000
# OR
npm run dev -- --port 3001
```

### Error: "Cannot find module '@/*'"

```bash
# CAUSE: tsconfig.json paths not configured
# FIX: Check tsconfig.json has:
"paths": {
  "@/*": ["./*"]
}
```

---

**After this setup completes, proceed to [dependencies.md](./dependencies.md)**
