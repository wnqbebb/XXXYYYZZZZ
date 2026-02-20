/**
 * Generate a tiny blur data URL for image placeholder
 * Uses a 1x1 pixel or small SVG
 */
export function generateBlurDataURL(color: string = '#e5e7eb'): string {
  // Simple colored SVG placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1">
      <rect width="1" height="1" fill="${color}"/>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Calculate aspect ratio from width and height
 */
export function getAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}/${height / divisor}`;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcset(
  src: string,
  widths: number[],
  options: {
    format?: 'webp' | 'avif' | 'jpeg';
    quality?: number;
  } = {}
): string {
  const { format = 'webp', quality = 85 } = options;
  
  return widths
    .map((width) => {
      // Assuming image CDN or Next.js image optimization
      const url = src.includes('?')
        ? `${src}&w=${width}&q=${quality}&fm=${format}`
        : `${src}?w=${width}&q=${quality}&fm=${format}`;
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Get optimal image size based on container width
 */
export function getOptimalImageSize(
  containerWidth: number,
  availableSizes: number[]
): number {
  // Find the smallest size that is >= container width
  const optimal = availableSizes.find((size) => size >= containerWidth);
  return optimal || availableSizes[availableSizes.length - 1];
}

/**
 * Check if browser supports WebP
 */
export async function supportsWebP(): Promise<boolean> {
  if (typeof document === 'undefined') return true; // Assume support on server

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

/**
 * Check if browser supports AVIF
 */
export async function supportsAVIF(): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
}

/**
 * Get optimal image format for browser
 */
export async function getOptimalImageFormat(): Promise<'avif' | 'webp' | 'jpeg'> {
  if (await supportsAVIF()) return 'avif';
  if (await supportsWebP()) return 'webp';
  return 'jpeg';
}

/**
 * Calculate image dimensions to fit within max bounds while maintaining aspect ratio
 */
export function constrainImageDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return { width: Math.round(width), height: Math.round(height) };
}

/**
 * Preload critical images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Preload multiple images
 */
export function preloadImages(srcs: string[]): Promise<void[]> {
  return Promise.all(srcs.map(preloadImage));
}

/**
 * Check if image is in viewport (for lazy loading decisions)
 */
export function isImageInViewport(img: HTMLImageElement, offset: number = 0): boolean {
  const rect = img.getBoundingClientRect();
  return (
    rect.top >= -offset &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
