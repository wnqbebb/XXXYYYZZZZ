'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to observe element intersection with viewport
 * 
 * @example
 * ```tsx
 * function FadeInSection() {
 *   const { ref, isIntersecting, entry } = useIntersectionObserver({
 *     threshold: 0.5,
 *     triggerOnce: true,
 *   });
 *   
 *   return (
 *     <div
 *       ref={ref}
 *       className={`transition-opacity duration-500 ${
 *         isIntersecting ? 'opacity-100' : 'opacity-0'
 *       }`}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0, root = null, rootMargin = '0px', triggerOnce = false } = options;
  
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<Element | null>(null);
  const hasTriggered = useRef(false);

  const setRef = useCallback((node: Element | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([observerEntry]) => {
        setEntry(observerEntry);
        setIsIntersecting(observerEntry.isIntersecting);
        
        if (observerEntry.isIntersecting && triggerOnce) {
          hasTriggered.current = true;
          observer.disconnect();
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, triggerOnce]);

  return { ref: setRef, isIntersecting, entry };
}

/**
 * Hook to track scroll progress of an element
 */
export function useScrollProgress(options: { rootMargin?: string } = {}) {
  const { rootMargin = '0px' } = options;
  
  const [progress, setProgress] = useState(0);
  const elementRef = useRef<Element | null>(null);

  const setRef = useCallback((node: Element | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const calculateProgress = () => {
            const rect = entry.boundingClientRect;
            const windowHeight = window.innerHeight;
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            // Calculate progress from 0 (entering) to 1 (exiting)
            const scrollProgress = (windowHeight - elementTop) / (windowHeight + elementHeight);
            setProgress(Math.max(0, Math.min(1, scrollProgress)));
          };

          window.addEventListener('scroll', calculateProgress, { passive: true });
          calculateProgress();

          return () => window.removeEventListener('scroll', calculateProgress);
        }
      },
      { rootMargin, threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref: setRef, progress };
}

/**
 * Hook to detect if element is in viewport with offset
 */
export function useInViewport(offset: number = 0) {
  const [isInViewport, setIsInViewport] = useState(false);
  const elementRef = useRef<Element | null>(null);

  const setRef = useCallback((node: Element | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { rootMargin: `${offset}px` }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [offset]);

  return { ref: setRef, isInViewport };
}
