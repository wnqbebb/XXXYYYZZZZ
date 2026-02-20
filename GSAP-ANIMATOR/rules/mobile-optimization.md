---
name: gsap-mobile-optimization
description: Mobile and touch optimization for GSAP. Load when supporting mobile devices.
metadata:
  tags: gsap, mobile, touch, responsive, performance
---

# Mobile Optimization Rules

## MUST: Reduced Motion Support

```typescript
// Check user preference
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (prefersReducedMotion) {
  // Instant state changes
  gsap.set('.animated', { opacity: 1, y: 0 })
} else {
  // Full animation
  gsap.from('.animated', { opacity: 0, y: 50, duration: 1 })
}
```

## MUST: Conditional Animations

```typescript
// Disable complex animations on mobile
const isMobile = window.matchMedia('(pointer: coarse)').matches

if (!isMobile) {
  // Desktop: Full animations
  gsap.to('.element', {
    x: 100,
    rotation: 360,
    scrollTrigger: { scrub: 1 }
  })
} else {
  // Mobile: Simple fade only
  gsap.to('.element', {
    opacity: 1,
    duration: 0.3
  })
}
```

## MUST: Touch-Friendly ScrollTrigger

```typescript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top 80%',
  // Mobile optimization
  anticipatePin: 1,     // Smooth pin
  fastScrollEnd: true,  // Better touch response
  preventOverlaps: true // Prevent animation conflicts
})
```

## MUST: Battery Considerations

```typescript
// Reduce animation complexity when battery is low
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    if (battery.level < 0.2 && !battery.charging) {
      // Low battery: disable non-essential animations
      gsap.globalTimeline.timeScale(0) // Pause all
    }
  })
}
```

## FORBIDDEN: Mobile Anti-patterns

```yaml
FORBIDDEN:
  Heavy scroll animations on mobile:
    WRONG: scrub: 1 with many elements
    RIGHT: scrub: false or simpler animations
    
  Pinning on small screens:
    WRONG: pin: true on mobile
    RIGHT: Disable pin for width < 768px
    
  Ignoring touch gestures:
    WRONG: Blocking native scroll
    RIGHT: Respect touch momentum
```

---

**Mobile optimized. Touch-friendly animations.**
