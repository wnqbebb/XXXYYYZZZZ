import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';

/**
 * Initialize Core Web Vitals tracking
 * Reports metrics to analytics endpoint
 */
export function initWebVitals(
  onReport?: (metric: Metric) => void,
  options: {
    endpoint?: string;
    debug?: boolean;
  } = {}
) {
  const { endpoint = '/analytics/vitals', debug = false } = options;

  const handleMetric = (metric: Metric) => {
    // Log in debug mode
    if (debug) {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value, metric.rating);
    }

    // Call custom handler
    onReport?.(metric);

    // Send to analytics
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : '',
    });

    // Use sendBeacon for reliability
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, body);
    } else if (typeof fetch !== 'undefined') {
      fetch(endpoint, {
        body,
        method: 'POST',
        keepalive: true,
      }).catch(() => {
        // Silently fail
      });
    }
  };

  // Subscribe to all Core Web Vitals
  onCLS(handleMetric);
  onINP(handleMetric);
  onLCP(handleMetric);
  onFCP(handleMetric);
  onTTFB(handleMetric);
}

/**
 * Get rating for a metric value
 */
export function getMetricRating(
  name: 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB',
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds: Record<string, { good: number; poor: number }> = {
    CLS: { good: 0.1, poor: 0.25 },
    INP: { good: 200, poor: 500 },
    LCP: { good: 2500, poor: 4000 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 600, poor: 1000 },
  };

  const threshold = thresholds[name];
  if (!threshold) return 'poor';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric value for display
 */
export function formatMetricValue(
  name: 'CLS' | 'INP' | 'LCP' | 'FCP' | 'TTFB',
  value: number
): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'INP':
    case 'TTFB':
      return `${Math.round(value)}ms`;
    case 'LCP':
    case 'FCP':
      return `${(value / 1000).toFixed(2)}s`;
    default:
      return String(value);
  }
}

/**
 * Performance Observer for custom metrics
 */
export function observeCustomMetrics(
  callback: (entry: PerformanceEntry) => void
) {
  if (typeof PerformanceObserver === 'undefined') return;

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });

    return () => observer.disconnect();
  } catch (e) {
    console.warn('PerformanceObserver not supported');
  }
}

/**
 * Measure custom performance mark
 */
export function measure(markName: string, startMark?: string, endMark?: string) {
  if (typeof performance === 'undefined') return;

  try {
    if (startMark && endMark) {
      performance.measure(markName, startMark, endMark);
    } else {
      performance.measure(markName);
    }
  } catch (e) {
    console.warn(`Failed to measure ${markName}:`, e);
  }
}

/**
 * Mark a performance timestamp
 */
export function mark(markName: string) {
  if (typeof performance === 'undefined') return;

  try {
    performance.mark(markName);
  } catch (e) {
    console.warn(`Failed to mark ${markName}:`, e);
  }
}

/**
 * Get navigation timing metrics
 */
export function getNavigationTiming() {
  if (typeof performance === 'undefined') return null;

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (!navigation) return null;

  return {
    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpConnection: navigation.connectEnd - navigation.connectStart,
    tlsNegotiation: navigation.secureConnectionStart > 0
      ? navigation.connectEnd - navigation.secureConnectionStart
      : 0,
    timeToFirstByte: navigation.responseStart - navigation.startTime,
    downloadTime: navigation.responseEnd - navigation.responseStart,
    domProcessing: navigation.domComplete - navigation.domInteractive,
    loadEvent: navigation.loadEventEnd - navigation.loadEventStart,
    totalDuration: navigation.duration,
  };
}
