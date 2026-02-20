'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  className?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

/**
 * Optimized Image component with best practices built-in
 * 
 * @example
 * ```tsx
 * // Fixed size image
 * <OptimizedImage
 *   src="/photo.jpg"
 *   alt="Description"
 *   width={800}
 *   height={600}
 * />
 * 
 * // Responsive fill image
 * <div className="relative h-64">
 *   <OptimizedImage
 *     src="/photo.jpg"
 *     alt="Description"
 *     fill
 *     sizes="100vw"
 *     objectFit="cover"
 *   />
 * </div>
 * 
 * // Hero image (LCP)
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="Hero"
 *   fill
 *   priority
 *   sizes="100vw"
 * />
 * ```
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  objectFit = 'cover',
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // Ensure dimensions are provided for non-fill images
  if (!fill && (!width || !height)) {
    console.warn('OptimizedImage: width and height are required when not using fill');
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={fill ? undefined : { width, height }}
    >
      {/* Loading skeleton */}
      {!isLoaded && !priority && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        className={`transition-opacity duration-300 ${
          isLoaded || priority ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ objectFit }}
        onLoad={handleLoad}
      />
    </div>
  );
}

/**
 * Hero Image component optimized for LCP
 */
export function HeroImage({
  src,
  alt,
  blurDataURL,
  className = '',
}: {
  src: string;
  alt: string;
  blurDataURL?: string;
  className?: string;
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      priority
      quality={90}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
      sizes="100vw"
      objectFit="cover"
      className={`absolute inset-0 -z-10 ${className}`}
    />
  );
}

/**
 * Responsive image with aspect ratio
 */
export function AspectImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  ...props
}: Omit<OptimizedImageProps, 'fill' | 'width' | 'height'> & {
  aspectRatio?: string;
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ aspectRatio }}
    >
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        {...props}
      />
    </div>
  );
}
