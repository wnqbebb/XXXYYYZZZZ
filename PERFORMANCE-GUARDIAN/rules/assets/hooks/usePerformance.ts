'use client';

import { useEffect, useState } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

interface PerformanceMetrics {
  cls: number | null;
  inp: number | null;
  lcp: number | null;
  fcp: number | null;
  ttfb: number | null;
}

interface UsePerformanceOptions {
  onMetric?: (metric: Metric) => void;
  reportToAnalytics?: boolean;
  analyticsEndpoint?: string;
}

/**
 * Hook to track Core Web Vitals and performance metrics
 * 
 * @example
 * ```tsx
 * function App() {
 *   usePerformance({
 *     onMetric: (metric) => console.log(metric.name, metric.value),
 *     reportToAnalytics: true,
 *   });
 *   return <div>App</div>;
 * }
 * ```
 */
export function usePerformance(options: UsePerformanceOptions = {}) {
  const { onMetric, reportToAnalytics, analyticsEndpoint = '/analytics/vitals' } = options;
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    cls: null,
    inp: null,
    lcp: null,
    fcp: null,
    ttfb: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMetric = (metric: Metric) => {
      // Update local state
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value,
      }));

      // Call custom handler
      onMetric?.(metric);

      // Report to analytics
      if (reportToAnalytics) {
        const body = JSON.stringify({
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
          navigationType: metric.navigationType,
          timestamp: Date.now(),
          url: window.location.href,
        });

        // Use sendBeacon for reliability, fallback to fetch
        if (navigator.sendBeacon) {
          navigator.sendBeacon(analyticsEndpoint, body);
        } else {
          fetch(analyticsEndpoint, {
            body,
            method: 'POST',
            keepalive: true,
          }).catch(() => {
            // Silently fail - don't block user
          });
        }
      }
    };

    // Subscribe to all Core Web Vitals
    const unsubscribeCLS = onCLS(handleMetric);
    const unsubscribeINP = onINP(handleMetric);
    const unsubscribeLCP = onLCP(handleMetric);
    const unsubscribeFCP = onFCP(handleMetric);
    const unsubscribeTTFB = onTTFB(handleMetric);

    return () => {
      unsubscribeCLS();
      unsubscribeINP();
      unsubscribeLCP();
      unsubscribeFCP();
      unsubscribeTTFB();
    };
  }, [onMetric, reportToAnalytics, analyticsEndpoint]);

  return metrics;
}

/**
 * Hook to check if a performance metric is within target
 */
export function useMetricRating(metric: keyof PerformanceMetrics, metrics: PerformanceMetrics) {
  const value = metrics[metric];
  
  if (value === null) return 'unknown';
  
  const thresholds: Record<string, { good: number; poor: number }> = {
    cls: { good: 0.1, poor: 0.25 },
    inp: { good: 200, poor: 500 },
    lcp: { good: 2500, poor: 4000 },
    fcp: { good: 1800, poor: 3000 },
    ttfb: { good: 600, poor: 1000 },
  };
  
  const threshold = thresholds[metric];
  if (!threshold) return 'unknown';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}
