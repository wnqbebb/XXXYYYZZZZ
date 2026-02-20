'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook to lazy load content when it enters viewport
 * 
 * @example
 * ```tsx
 * function LazySection() {
 *   const { ref, isVisible } = useLazyLoad({ rootMargin: '200px' });
 *   
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? <HeavyComponent /> : <Placeholder />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const { threshold = 0, rootMargin = '0px', triggerOnce = true } = options;
  
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // If already triggered and triggerOnce, don't observe again
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasTriggered(true);
          
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isVisible };
}

/**
 * Hook to lazy load multiple elements
 * 
 * @example
 * ```tsx
 * function Gallery() {
 *   const { observe, isVisible } = useLazyLoadMultiple();
 *   
 *   return (
 *     <div>
 *       {items.map((item, i) => (
 *         <div key={i} ref={(el) => observe(el, i)}>
 *           {isVisible(i) ? <Image src={item.src} /> : <Placeholder />}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLazyLoadMultiple(options: UseLazyLoadOptions = {}) {
  const { threshold = 0, rootMargin = '100px' } = options;
  
  const [visibleItems, setVisibleItems] = useState<Set<string | number>>(new Set());
  const elementsRef = useRef<Map<string | number, Element>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback((element: Element | null, id: string | number) => {
    if (!element) {
      elementsRef.current.delete(id);
      return;
    }

    elementsRef.current.set(id, element);
    observerRef.current?.observe(element);
  }, []);

  const isVisible = useCallback((id: string | number) => {
    return visibleItems.has(id);
  }, [visibleItems]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = Array.from(elementsRef.current.entries())
            .find(([, el]) => el === entry.target)?.[0];
          
          if (id !== undefined) {
            setVisibleItems((prev) => {
              const next = new Set(prev);
              if (entry.isIntersecting) {
                next.add(id);
              } else {
                next.delete(id);
              }
              return next;
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    // Observe all current elements
    elementsRef.current.forEach((element) => {
      observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, [threshold, rootMargin]);

  return { observe, isVisible, visibleItems };
}

/**
 * Hook for progressive image loading with blur-up effect
 */
export function useProgressiveImage(src: string, placeholderSrc?: string) {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { src: currentSrc, isLoaded };
}
