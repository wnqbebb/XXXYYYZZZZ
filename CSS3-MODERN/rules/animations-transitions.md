---
name: css3-animations-transitions
description: CSS animations and transitions. Load when adding motion with CSS.
metadata:
  tags: css, animations, transitions, keyframes
---

# Animations & Transitions Rules

## MUST: Transitions

```css
.button {
  background: blue;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  background: darkblue;
  transform: translateY(-2px);
}
```

## MUST: Keyframe Animations

```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
```

## MUST: Performance Animations

```css
/* GPU-accelerated properties only */
.animated {
  will-change: transform, opacity;
  animation: slideIn 0.5s ease;
}

/* Remove after animation */
.animated {
  animation: slideIn 0.5s ease forwards;
}

.animated {
  animation-fill-mode: forwards;
}
```

## MUST: Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## FORBIDDEN: Performance Killers

```yaml
FORBIDDEN:
  Animating layout properties:
    WRONG: width, height, top, left, margin
    RIGHT: transform, opacity only
    
  Heavy filters:
    WRONG: filter: blur(10px) on animation
    RIGHT: Pre-blurred images or opacity
```

---

**Animations mastered. Motion with performance.**
