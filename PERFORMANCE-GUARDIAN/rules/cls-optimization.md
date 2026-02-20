---
name: cls-optimization
description: Cumulative Layout Shift optimization for visual stability. Prevent unexpected layout shifts that frustrate users.
metadata:
  tags: cls, layout-shift, images, fonts, dimensions, stability
---

# CLS Optimization Rules

## MUST: Always Specify Image Dimensions

```tsx
// BAD: No dimensions = layout shift when image loads
<img src="/photo.jpg" alt="Description" />

// GOOD: Explicit dimensions prevent CLS
<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
/>

// GOOD: For responsive images with fill
<div className="relative aspect-video">
  <Image
    src="/photo.jpg"
    alt="Description"
    fill
    className="object-cover"
  />
</div>
```

## MUST: Reserve Space for Dynamic Content

```tsx
// BAD: Content pops in, shifting layout
function Comments() {
  const [comments, setComments] = useState<Comment[]>();
  
  useEffect(() => {
    fetchComments().then(setComments);
  }, []);
  
  return (
    <div>
      {comments?.map(comment => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
}

// GOOD: Reserve space with skeleton/placeholder
function Comments() {
  const [comments, setComments] = useState<Comment[]>();
  
  useEffect(() => {
    fetchComments().then(setComments);
  }, []);
  
  return (
    <div className="min-h-[400px]"> {/* Reserved space */}
      {comments ? (
        comments.map(comment => (
          <Comment key={comment.id} {...comment} />
        ))
      ) : (
        <CommentsSkeleton count={5} />
      )}
    </div>
  );
}
```

## MUST: Handle Web Fonts Properly

```typescript
// next/font/google - Optimal font loading
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',      // Prevents invisible text
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  adjustFontFallback: true, // Reduces CLS from font swap
});

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

```css
/* Manual font-face with size-adjust */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom.woff2') format('woff2');
  font-display: swap;
  size-adjust: 100%;      /* Adjust to match fallback metrics */
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 0%;
}

/* Fallback font that matches metrics */
@font-face {
  font-family: 'CustomFont Fallback';
  src: local('Arial');
  ascent-override: 90%;
  descent-override: 20%;
  line-gap-override: 0%;
}
```

## MUST: Avoid Inserting Content Above Existing Content

```tsx
// BAD: Banner pushes content down
function Page() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShowBanner(true), 1000);
  }, []);
  
  return (
    <>
      {showBanner && <Banner />}
      <main>Content</main>
    </>
  );
}

// GOOD: Reserve space for banner
function Page() {
  const [showBanner, setShowBanner] = useState(false);
  
  useEffect(() => {
    setTimeout(() => setShowBanner(true), 1000);
  }, []);
  
  return (
    <>
      <div className="h-12"> {/* Reserved space */}
        {showBanner && <Banner />}
      </div>
      <main>Content</main>
    </>
  );
}

// BETTER: Use overlay that doesn't shift layout
function Page() {
  const [showBanner, setShowBanner] = useState(false);
  
  return (
    <>
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Banner onClose={() => setShowBanner(false)} />
        </div>
      )}
      <main className={showBanner ? 'pt-12' : ''}>Content</main>
    </>
  );
}
```

## MUST: Stabilize Ads and Embeds

```tsx
// BAD: Ad container without fixed dimensions
<div className="ad-container">
  <AdUnit />
</div>

// GOOD: Fixed dimensions for ad slots
<div 
  className="ad-container"
  style={{ 
    minHeight: '250px',  // Minimum expected ad height
    width: '300px'       // Fixed width
  }}
>
  <AdUnit />
</div>

// GOOD: Collapsible ad slot with animation
function AdSlot() {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div 
      className="transition-all duration-300"
      style={{ 
        minHeight: loaded ? 'auto' : '250px',
        height: loaded ? 'auto' : '250px'
      }}
    >
      <AdUnit onLoad={() => setLoaded(true)} />
    </div>
  );
}
```

## WHY: CLS Scoring

```yaml
CLS_CALCULATION:
  impact_fraction: |
    Percentage of viewport affected by shift
    Example: Element shifts by 50% of viewport height = 0.5
    
  distance_fraction: |
    Distance moved relative to viewport
    Example: Element moves 100px in 1000px viewport = 0.1
    
  layout_shift_score: impact_fraction × distance_fraction
    Example: 0.5 × 0.1 = 0.05

SESSION_WINDOW:
  - CLS is cumulative across the session
  - Measured in 5-second windows
  - Maximum window score is reported
  - Infinite scroll can accumulate CLS

TARGETS:
  good: < 0.1
  needs_improvement: 0.1 - 0.25
  poor: > 0.25
```

## FORBIDDEN: CLS Anti-patterns

```yaml
PROHIBITED:
  Images without dimensions:
    impact: High CLS when image loads
    fix: Always specify width/height or use aspect-ratio
    
  Late-loading web fonts without fallback:
    impact: FOIT/FOUT causes text reflow
    fix: Use font-display: swap with size-adjust
    
  Dynamic content without reserved space:
    impact: Content pushes other elements
    fix: Use min-height or skeleton placeholders
    
  Ads without fixed containers:
    impact: Ad loads and shifts content
    fix: Reserve space with min-height
    
  Animating layout properties:
    impact: Continuous layout shifts
    fix: Animate transform and opacity only

COMMON_CULPRITS:
  - Cookie consent banners (late injection)
  - Newsletter signup forms (slide-in)
  - Infinite scroll (new content pushes footer)
  - Lazy-loaded images (no placeholder)
  - Third-party widgets (unpredictable size)
```

## MUST: Use aspect-ratio for Responsive Media

```tsx
// CSS aspect-ratio
.aspect-video {
  aspect-ratio: 16 / 9;
}

.aspect-square {
  aspect-ratio: 1 / 1;
}

// Component with aspect ratio
function ResponsiveImage({ src, alt, ratio = '16/9' }: Props) {
  return (
    <div 
      className="relative w-full"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
```

## MUST: Test for CLS

```typescript
// Performance Observer for CLS
let clsValue = 0;
let clsEntries: PerformanceEntry[] = [];

new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    // Only count if not recent input
    if (!(entry as any).hadRecentInput) {
      clsValue += (entry as any).value;
      clsEntries.push(entry);
      
      console.log('Current CLS:', clsValue);
      console.log('Shift source:', (entry as any).sources);
    }
  }
}).observe({ entryTypes: ['layout-shift'] });

// Log final CLS on page hide
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    console.log('Final CLS:', clsValue);
  }
});
```

---

**CLS under 0.1 means your page is stable. No surprises, no frustration.**
