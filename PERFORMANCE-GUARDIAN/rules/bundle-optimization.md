---
name: bundle-optimization
description: JavaScript bundle analysis and optimization. Reduce payload size for faster loads.
metadata:
  tags: bundle, webpack, analysis, code-splitting, tree-shaking, dependencies
---

# Bundle Optimization Rules

## MUST: Analyze Bundle Regularly

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // your config
});
```

```bash
# Run analysis
ANALYZE=true npm run build

# This opens browser with interactive bundle visualization
```

## MUST: Tree Shake Dependencies

```typescript
// BAD: Import entire library
import _ from 'lodash';
_.debounce(fn, 300);

// GOOD: Import only what you need
import debounce from 'lodash/debounce';
// or
import { debounce } from 'lodash-es';

// BAD: Import all icons
import * as Icons from 'lucide-react';

// GOOD: Import specific icons
import { Search, Menu, X } from 'lucide-react';

// BETTER: Use modular imports
import Search from 'lucide-react/dist/esm/icons/search';
```

## MUST: Check for Duplicate Dependencies

```bash
# Install duplicate checker
npm install --save-dev duplicate-package-checker-webpack-plugin

# next.config.js
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new DuplicatePackageCheckerPlugin());
    }
    return config;
  },
};
```

```bash
# Or use npm ls
npm ls lodash
npm ls react

# Check why a package is included
npm ls [package-name]

# Find duplicates
npm dedupe
```

## MUST: Optimize Import Cost

```typescript
// Use babel-plugin-import for component libraries
// .babelrc or babel.config.js
{
  "plugins": [
    ["import", {
      "libraryName": "lodash",
      "libraryDirectory": "",
      "camel2DashComponentName": false
    }]
  ]
}

// Use modular libraries
// Instead of: import moment from 'moment' (290KB)
// Use: import dayjs from 'dayjs' (6KB)

// Instead of: import uuid from 'uuid' (120KB)
// Use: crypto.randomUUID() (native)

// Instead of: import axios from 'axios' (50KB)
// Use: fetch API (native)
```

## MUST: Dynamic Imports for Heavy Components

```tsx
// components/HeavyChart.tsx - Large charting library
import { Chart } from 'heavy-charting-library'; // 200KB

// app/dashboard/page.tsx
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/HeavyChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,  // Disable SSR if library uses window
  }
);

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <HeavyChart data={data} />
    </main>
  );
}
```

## MUST: Lazy Load Routes (Automatic in Next.js)

```typescript
// Next.js App Router automatically code-splits by route
// Each route is a separate chunk

// Force preload critical routes
import Link from 'next/link';

function Navigation() {
  return (
    <nav>
      <Link href="/dashboard" prefetch>
        Dashboard
      </Link>
      <Link href="/settings">
        Settings  {/* Lazy loaded on hover/viewport */}
      </Link>
    </nav>
  );
}
```

## WHY: Bundle Size Budgets

```yaml
BUDGET_GUIDELINES:
  initial_js:
    target: < 200KB gzipped
    critical: < 100KB for first load
    
  total_js:
    target: < 500KB gzipped
    lazy_loaded: Can exceed for feature-specific code
    
  css:
    target: < 50KB gzipped
    critical: < 20KB inlined
    
  images:
    target: < 500KB total per page
    hero_image: < 200KB

MONITORING:
  - Set up CI checks for bundle size
  - Fail build if budget exceeded
  - Track trends over time
```

## FORBIDDEN: Bundle Bloat Patterns

```yaml
PROHIBITED:
  Importing entire libraries:
    WRONG: import * as Library from 'huge-lib'
    RIGHT: import { specificFunction } from 'huge-lib'
    
  Including dev dependencies in production:
    WRONG: Dependencies in dependencies instead of devDependencies
    RIGHT: Move to devDependencies
    
  Duplicating dependencies:
    WRONG: Multiple versions of React, lodash, etc.
    RIGHT: Use npm dedupe, resolve.alias in webpack
    
  Not code splitting:
    WRONG: Single 2MB bundle
    RIGHT: Code split by route and feature
    
  Including unused locales:
    WRONG: All moment.js locales (350KB)
    RIGHT: Webpack ignore plugin or date-fns

OPTIMIZATION_CHECKLIST:
  - [ ] Bundle analyzer run regularly
  - [ ] No duplicate dependencies
  - [ ] Tree-shaking enabled
  - [ ] Dynamic imports for heavy components
  - [ ] Route-based code splitting
  - [ ] Import only needed functions
  - [ ] Replace heavy libraries with lighter alternatives
  - [ ] Set bundle size budgets in CI
```

## MUST: Configure webpack Optimizations

```typescript
// next.config.js
module.exports = {
  webpack: (config, { isServer, dev }) => {
    // Optimize module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'lodash': 'lodash-es',
    };

    // Ignore moment.js locales (if using moment)
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      })
    );

    // Split chunks optimization
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          minChunks: 2,
          chunks: 'all',
          enforce: true,
        },
      },
    };

    return config;
  },
};
```

## MUST: Monitor Bundle in CI

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size

on: [pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      
      - name: Build and analyze
        run: |
          npm ci
          ANALYZE=true npm run build
          
      - name: Check bundle size
        run: |
          BUNDLE_SIZE=$(stat -c%s .next/static/chunks/main-*.js)
          MAX_SIZE=2097152  # 2MB
          if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
            echo "Bundle size $BUNDLE_SIZE exceeds limit $MAX_SIZE"
            exit 1
          fi
```

---

**Every KB matters. Your users pay for your bundle size.**
