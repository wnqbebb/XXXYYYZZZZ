---
name: image-optimization
description: Image optimization strategies for Next.js and modern web. Reduce file sizes while maintaining quality.
metadata:
  tags: images, next-image, webp, avif, optimization, responsive
---

# Image Optimization Rules

## MUST: Use Next.js Image Component

```tsx
// BAD: Standard img tag - no optimization
<img src="/large-photo.jpg" alt="Photo" />

// GOOD: Next.js Image with full optimization
import Image from 'next/image';

export function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority              // For LCP images
      quality={85}          // 0-100, default 75
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  );
}
```

## MUST: Use Modern Image Formats

```yaml
FORMAT_PRIORITY:
  1. AVIF: |
      - 50% smaller than JPEG
      - Best quality/size ratio
      - Limited browser support (use with fallback)
      
  2. WebP: |
      - 25-35% smaller than JPEG
      - Good browser support
      - Recommended primary format
      
  3. JPEG: |
      - Universal support
      - Fallback format
      - Use mozjpeg optimization

NEXTJS_AUTOMATIC:
  - Next.js automatically serves WebP/AVIF when supported
  - Uses Accept header to determine format
  - Falls back to original format
```

## MUST: Implement Responsive Images

```tsx
// Fixed size with srcset
<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// Fill mode for responsive containers
<div className="relative w-full h-64 md:h-96">
  <Image
    src="/photo.jpg"
    alt="Photo"
    fill
    className="object-cover"
    sizes="100vw"
  />
</div>

// Art direction with picture element (when needed)
<picture>
  <source
    media="(max-width: 768px)"
    srcSet="/photo-mobile.jpg"
  />
  <source
    media="(min-width: 769px)"
    srcSet="/photo-desktop.jpg"
  />
  <Image
    src="/photo-desktop.jpg"
    alt="Photo"
    width={1200}
    height={600}
  />
</picture>
```

## MUST: Implement Lazy Loading Strategy

```tsx
// app/page.tsx
export default function Page() {
  return (
    <main>
      {/* LCP Image - NO lazy loading */}
      <HeroImage />
      
      {/* Below-fold images - lazy loaded automatically */}
      <Gallery />
    </main>
  );
}

// components/HeroImage.tsx
function HeroImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero"
      fill
      priority        // Preloads, no lazy loading
      fetchpriority="high"
    />
  );
}

// components/Gallery.tsx
function Gallery() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((img, i) => (
        <Image
          key={img.id}
          src={img.src}
          alt={img.alt}
          width={400}
          height={300}
          loading={i < 6 ? "eager" : "lazy"}  // First 6 eager, rest lazy
        />
      ))}
    </div>
  );
}
```

## MUST: Use Blur Placeholder

```tsx
// Static blur data URL (generate once, use always)
const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...";

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={blurDataURL}
/>

// Dynamic blur with sharp (Node.js)
import { getPlaiceholder } from 'plaiceholder';

async function getImageWithBlur(src: string) {
  const buffer = await fetch(src).then(async (res) =>
    Buffer.from(await res.arrayBuffer())
  );
  
  const { base64 } = await getPlaiceholder(buffer);
  
  return { src, blurDataURL: base64 };
}
```

## MUST: Optimize External Images

```typescript
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
    // Image sizes for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Format preference
    formats: ['image/avif', 'image/webp'],
    // Quality default
    quality: 85,
  },
};
```

## WHY: Image Loading Attributes

```yaml
PRIORITY:
  use_for: LCP images, above-fold critical images
  effect: Preloads image, highest fetch priority
  warning: Use sparingly (max 2-3 per page)

EAGER:
  use_for: Important images just below fold
  effect: Loads immediately, no lazy loading
  
LAZY:
  use_for: Below-fold images, non-critical
  effect: Loads when approaching viewport
  default: true for Next.js Image (except priority)

DECODING:
  async: Non-blocking decode (recommended)
  sync: Blocking decode (can cause jank)
  auto: Browser decides (default)
```

## FORBIDDEN: Image Anti-patterns

```yaml
PROHIBITED:
  Unoptimized formats:
    WRONG: PNG for photos (10x larger than JPEG)
    RIGHT: Use JPEG/WebP/AVIF for photos
    
  Oversized images:
    WRONG: 4000px image displayed at 400px
    RIGHT: Serve appropriately sized images
    
  Missing dimensions:
    WRONG: No width/height causes CLS
    RIGHT: Always specify dimensions
    
  Lazy loading LCP:
    WRONG: loading="lazy" on hero image
    RIGHT: Use priority or loading="eager"
    
  CSS background for content images:
    WRONG: background-image for important content
    RIGHT: Use <img> or <Image> for discoverability

OPTIMIZATION_CHECKLIST:
  - [ ] Using Next.js Image component
  - [ ] Modern formats (WebP/AVIF) served
  - [ ] Appropriate quality setting (75-85)
  - [ ] Responsive sizes attribute
  - [ ] Lazy loading for below-fold
  - [ ] Priority for LCP images
  - [ ] Blur placeholder for perceived performance
  - [ ] Dimensions specified to prevent CLS
```

## MUST: Handle SVG Icons

```tsx
// Inline SVG for small icons (better than img)
function Icon({ name }: { name: string }) {
  const icons = {
    search: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    // ... more icons
  };
  
  return icons[name] || null;
}

// Sprite sheet for many icons
// icons.svg
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <symbol id="icon-search" viewBox="0 0 24 24">
    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </symbol>
</svg>

// Usage
<svg width="24" height="24">
  <use href="/icons.svg#icon-search"/>
</svg>
```

---

**Images are the #1 cause of slow pages. Optimize them ruthlessly.**
