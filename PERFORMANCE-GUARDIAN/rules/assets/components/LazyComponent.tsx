'use client';

import { Suspense, type ReactNode, type ComponentType } from 'react';
import dynamic from 'next/dynamic';

interface LazyComponentOptions {
  loading?: ReactNode;
  ssr?: boolean;
}

/**
 * Creates a lazy-loaded component with proper error boundaries
 * 
 * @example
 * ```tsx
 * const HeavyChart = createLazyComponent(
 *   () => import('./HeavyChart'),
 *   { loading: <ChartSkeleton />, ssr: false }
 * );
 * 
 * function Page() {
 *   return <HeavyChart data={data} />;
 * }
 * ```
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions = {}
) {
  const { loading = <DefaultSkeleton />, ssr = true } = options;

  const LazyComponent = dynamic(importFn, {
    loading: () => <>{loading}</>,
    ssr,
  });

  return LazyComponent;
}

function DefaultSkeleton() {
  return (
    <div className="animate-pulse rounded-lg bg-gray-200 p-4">
      <div className="h-4 w-3/4 rounded bg-gray-300" />
      <div className="mt-2 h-4 w-1/2 rounded bg-gray-300" />
    </div>
  );
}

/**
 * Wrapper component for lazy loading with intersection observer
 * 
 * @example
 * ```tsx
 * function Page() {
 *   return (
 *     <LazyLoadWrapper rootMargin="200px">
 *       <HeavyComponent />
 *     </LazyLoadWrapper>
 *   );
 * }
 * ```
 */
import { useLazyLoad } from '../hooks/useLazyLoad';

interface LazyLoadWrapperProps {
  children: ReactNode;
  placeholder?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export function LazyLoadWrapper({
  children,
  placeholder = <DefaultSkeleton />,
  rootMargin = '200px',
  threshold = 0,
}: LazyLoadWrapperProps) {
  const { ref, isVisible } = useLazyLoad({ rootMargin, threshold });

  return (
    <div ref={ref}>
      {isVisible ? children : placeholder}
    </div>
  );
}

/**
 * Error boundary for lazy components
 */
import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class LazyErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            <p className="font-medium">Failed to load component</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-2 text-sm underline"
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Safe lazy component wrapper with error boundary
 */
export function SafeLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyComponentOptions & { errorFallback?: ReactNode } = {}
) {
  const { errorFallback, ...lazyOptions } = options;
  const LazyComponent = createLazyComponent(importFn, lazyOptions);

  return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
      <LazyErrorBoundary fallback={errorFallback}>
        <LazyComponent {...props} />
      </LazyErrorBoundary>
    );
  };
}
