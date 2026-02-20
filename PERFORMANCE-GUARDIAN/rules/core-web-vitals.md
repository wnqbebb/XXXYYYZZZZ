---
name: core-web-vitals-fundamentals
description: Core Web Vitals fundamentals, metrics explanation, and measurement strategies. Load for any performance optimization task.
metadata:
  tags: core-web-vitals, lcp, inp, cls, metrics, measurement
---

# Core Web Vitals Fundamentals

## MUST: Understand the Three Pillars

```yaml
LOADING (LCP):
  metric: Largest Contentful Paint
  measures: Time to render largest visible element
  target: < 2.5 seconds
  affects: User perception of page speed

INTERACTIVITY (INP):
  metric: Interaction to Next Paint
  measures: Latency of all interactions during page lifecycle
  target: < 200 milliseconds
  affects: User responsiveness perception
  replaces: First Input Delay (FID) - deprecated 2024

VISUAL_STABILITY (CLS):
  metric: Cumulative Layout Shift
  measures: Unexpected layout shifts during load
  target: < 0.1
  affects: User frustration, mis-clicks
```

## MUST: Use web-vitals Library

```typescript
// lib/vitals.ts
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

// Report to analytics endpoint
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    entries: metric.entries,
    id: metric.id,
    navigationType: metric.navigationType,
  });

  // Use sendBeacon for reliability
  (navigator.sendBeacon && navigator.sendBeacon('/analytics/vitals', body)) ||
    fetch('/analytics/vitals', { body, method: 'POST', keepalive: true });
}

// Initialize tracking
export function initWebVitals() {
  onCLS(sendToAnalytics);
  onINP(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}
```

## MUST: Implement in Next.js App Router

```typescript
// app/layout.tsx
import { initWebVitals } from '@/lib/vitals';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

// app/_components/Vitals.tsx (Client Component)
'use client';

import { useEffect } from 'react';
import { initWebVitals } from '@/lib/vitals';

export function Vitals() {
  useEffect(() => {
    initWebVitals();
  }, []);

  return null;
}
```

## MUST: Understand Metric Ratings

```yaml
PERCENTILE_THRESHOLD: 75th
  # Core Web Vitals are evaluated at the 75th percentile
  # This means 75% of page loads must meet the threshold

LCP_RATINGS:
  good: <= 2500ms
  needs_improvement: 2500ms - 4000ms
  poor: > 4000ms

INP_RATINGS:
  good: <= 200ms
  needs_improvement: 200ms - 500ms
  poor: > 500ms

CLS_RATINGS:
  good: <= 0.1
  needs_improvement: 0.1 - 0.25
  poor: > 0.25
```

## MUST: Lab vs Field Data

```yaml
LAB_DATA (Synthetic):
  tools: Lighthouse, PageSpeed Insights, WebPageTest
  pros: Reproducible, controlled environment, debugging
  cons: May not reflect real user conditions
  use_for: Development, CI/CD gates, debugging

FIELD_DATA (Real User Monitoring - RUM):
  tools: CrUX, web-vitals library, analytics
  pros: Real user conditions, actual experiences
  cons: Variable conditions, harder to debug
  use_for: Production monitoring, business metrics

BOTH_NEEDED:
  - Lab for development and prevention
  - Field for real-world validation
```

## WHY: INP Replaced FID

```yaml
FID_LIMITATIONS:
  - Only measured first interaction
  - Didn't capture full interaction latency
  - Missed subsequent interactions

INP_ADVANTAGES:
  - Measures all interactions
  - Captures worst-case latency (percentile-based)
  - Reflects full page lifecycle
  - Better correlation with user satisfaction

INTERACTION_TYPES_TRACKED:
  - Mouse clicks
  - Touch taps
  - Keyboard interactions
  # Hover and scrolling are NOT included
```

## FORBIDDEN: Common Measurement Mistakes

```yaml
WRONG:
  Measuring only on page load:
    issue: CWV are lifecycle metrics, not load-only
    
  Using Date.now() for timing:
    issue: Not accurate for performance measurement
    fix: Use performance.now() or PerformanceObserver
    
  Sending metrics synchronously:
    issue: Blocks main thread
    fix: Use sendBeacon or requestIdleCallback
    
  Ignoring navigation type:
    issue: Cold vs warm loads differ significantly
    fix: Track navigationType in analytics

RIGHT:
  - Always use web-vitals library for accuracy
  - Report to analytics asynchronously
  - Track by navigation type (navigate, reload, back-forward)
  - Monitor 75th percentile, not averages
```

---

**Measure what matters. Optimize what you measure.**
