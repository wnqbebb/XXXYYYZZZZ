'use client';

import { usePerformance, useMetricRating } from '../hooks/usePerformance';

interface PerformanceMonitorProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showLabels?: boolean;
}

/**
 * Development-only performance monitor overlay
 * Shows Core Web Vitals in real-time
 * 
 * @example
 * ```tsx
 * // app/layout.tsx (development only)
 * {process.env.NODE_ENV === 'development' && (
 *   <PerformanceMonitor position="bottom-right" />
 * )}
 * ```
 */
export function PerformanceMonitor({
  position = 'bottom-right',
  showLabels = true,
}: PerformanceMonitorProps) {
  const metrics = usePerformance({ reportToAnalytics: false });

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  const formatValue = (value: number | null, unit: string = '') => {
    if (value === null) return '-';
    if (unit === 's') return `${(value / 1000).toFixed(2)}s`;
    return value.toFixed(2);
  };

  const MetricRow = ({
    label,
    value,
    unit,
    metric,
  }: {
    label: string;
    value: number | null;
    unit?: string;
    metric: keyof typeof metrics;
  }) => {
    const rating = useMetricRating(metric, metrics);
    
    const ratingColors = {
      good: 'text-green-500',
      'needs-improvement': 'text-yellow-500',
      poor: 'text-red-500',
      unknown: 'text-gray-400',
    };

    return (
      <div className="flex items-center justify-between gap-4">
        {showLabels && <span className="text-xs text-gray-400">{label}</span>}
        <span className={`text-sm font-mono font-bold ${ratingColors[rating]}`}>
          {formatValue(value, unit)}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 rounded-lg bg-black/90 p-4 font-sans shadow-lg backdrop-blur`}
    >
      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
        Core Web Vitals
      </div>
      
      <div className="space-y-1">
        <MetricRow label="LCP" value={metrics.lcp} unit="s" metric="lcp" />
        <MetricRow label="INP" value={metrics.inp} unit="ms" metric="inp" />
        <MetricRow label="CLS" value={metrics.cls} metric="cls" />
        <MetricRow label="FCP" value={metrics.fcp} unit="s" metric="fcp" />
        <MetricRow label="TTFB" value={metrics.ttfb} unit="ms" metric="ttfb" />
      </div>

      <div className="mt-3 border-t border-gray-700 pt-2 text-[10px] text-gray-500">
        Targets: LCP &lt;2.5s, INP &lt;200ms, CLS &lt;0.1
      </div>
    </div>
  );
}

/**
 * Simple performance badge for showing a single metric
 */
export function PerformanceBadge({
  metric,
  label,
}: {
  metric: 'lcp' | 'inp' | 'cls' | 'fcp' | 'ttfb';
  label?: string;
}) {
  const metrics = usePerformance({ reportToAnalytics: false });
  const rating = useMetricRating(metric, metrics);
  const value = metrics[metric];

  const ratingStyles = {
    good: 'bg-green-500/20 text-green-400 border-green-500/30',
    'needs-improvement': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    poor: 'bg-red-500/20 text-red-400 border-red-500/30',
    unknown: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  const formatValue = (val: number | null) => {
    if (val === null) return '-';
    if (metric === 'lcp' || metric === 'fcp') return `${(val / 1000).toFixed(1)}s`;
    if (metric === 'inp' || metric === 'ttfb') return `${Math.round(val)}ms`;
    return val.toFixed(2);
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${ratingStyles[rating]}`}
    >
      {label && <span className="opacity-70">{label}:</span>}
      <span>{formatValue(value)}</span>
    </span>
  );
}
