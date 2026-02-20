---
name: animations
description: Custom animations, keyframes, transitions, and micro-interactions. Performance-optimized motion design.
version: 4.0.0
---

# Animations - Motion Design Mastery

> Create smooth, performant animations with custom keyframes, transitions, and micro-interactions.

---

## MUST

### 1. Define All Animations in @theme Block

**✅ CORRECT:**
```css
@theme {
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
  --animate-fade-out: fadeOut 0.3s ease-in forwards;
  --animate-slide-up: slideUp 0.5s ease-out forwards;
  --animate-slide-down: slideDown 0.5s ease-out forwards;
  --animate-scale-in: scaleIn 0.3s ease-out forwards;
  --animate-bounce-in: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  --animate-spin-slow: spin 3s linear infinite;
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-shimmer: shimmer 2s linear infinite;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes slideUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  0% { transform: translateY(-20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 2. Use `transform` and `opacity` for Animations

**✅ CORRECT:**
```css
/* GPU-accelerated properties */
@keyframes slideIn {
  0% { 
    transform: translateX(-100%); 
    opacity: 0; 
  }
  100% { 
    transform: translateX(0); 
    opacity: 1; 
  }
}
```

**❌ AVOID:**
```css
/* Avoid animating layout properties */
@keyframes badAnimation {
  0% { width: 0; height: 0; margin: 0; }  /* Triggers layout! */
  100% { width: 100px; height: 100px; margin: 10px; }
}
```

### 3. Always Include `motion-reduce` Variants

**✅ CORRECT:**
```tsx
<div className="animate-fade-in motion-reduce:animate-none">
  Animated content
</div>
```

### 4. Use `will-change` Sparingly

**✅ CORRECT:**
```tsx
// Only on elements that will actually animate
<div className="will-change-transform animate-slide-up">
  Content
</div>
```

**❌ FORBIDDEN:**
```tsx
// Don't apply to all elements
<div className="will-change-transform">  {/* Unnecessary */}
  Static content
</div>
```

---

## FORBIDDEN

### 1. Never Use `setTimeout` for Animation Timing

**❌ FORBIDDEN:**
```typescript
// ❌ Unreliable, not in sync with actual animation
setTimeout(() => {
  setIsVisible(false)
}, 500)  // Hoping animation is done
```

**✅ CORRECT:**
```typescript
// ✅ Use animation events
const handleAnimationEnd = () => {
  setIsVisible(false)
}

<div 
  className="animate-fade-out"
  onAnimationEnd={handleAnimationEnd}
>
  Content
</div>
```

### 2. Never Animate `width`, `height`, `top`, `left`

**❌ FORBIDDEN:**
```css
@keyframes expand {
  0% { width: 0; height: 0; }  /* Triggers layout recalculation! */
  100% { width: 100%; height: 100%; }
}
```

**✅ CORRECT:**
```css
@keyframes expand {
  0% { transform: scale(0); }  /* GPU accelerated */
  100% { transform: scale(1); }
}
```

### 3. Never Forget Animation Fill Mode

**❌ FORBIDDEN:**
```css
@theme {
  --animate-fade-in: fadeIn 0.5s ease-out;  /* Missing forwards! */
}
```

**✅ CORRECT:**
```css
@theme {
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
}
```

---

## WHY

### Performance Considerations

| Property | Cost | Use For |
|----------|------|---------|
| `transform` | GPU | Movement, scaling, rotation |
| `opacity` | GPU | Fades, visibility changes |
| `filter` | GPU (careful) | Blur, brightness effects |
| `width/height` | Layout | Avoid for animations |
| `top/left` | Layout | Avoid, use `transform` instead |
| `margin/padding` | Layout | Never animate |

### The 60fps Rule

- 16.67ms per frame (1000ms / 60fps)
- Animation should complete within this budget
- Use Chrome DevTools Performance panel to verify

---

## EXAMPLES

### Page Transitions

```tsx
// components/transitions/PageTransition.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]  // cubic-bezier
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3
    }
  }
}

export function PageTransition({ children }) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### Staggered List Animation

```tsx
// components/transitions/StaggeredList.tsx
'use client'

import { motion } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
}

export function StaggeredList({ children }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

### Hover Micro-interactions

```tsx
// components/ui/HoverCard.tsx
export function HoverCard({ title, description, image }) {
  return (
    <div className="
      group
      relative
      rounded-xl
      overflow-hidden
      cursor-pointer
    ">
      <img
        src={image}
        alt={title}
        className="
          w-full
          h-64
          object-cover
          transition-transform
          duration-500
          ease-out
          group-hover:scale-110
        "
      />
      
      <div className="
        absolute
        inset-0
        bg-gradient-to-t
        from-black/80
        via-black/40
        to-transparent
        opacity-0
        group-hover:opacity-100
        transition-opacity
        duration-300
      ">
        <div className="
          absolute
          bottom-0
          left-0
          right-0
          p-6
          transform
          translate-y-4
          group-hover:translate-y-0
          transition-transform
          duration-300
          ease-out
        ">
          <h3 className="text-xl font-bold text-white"
          >
            {title}
          </h3>
          <p className="mt-2 text-white/80"
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
```

### Loading Skeleton

```tsx
// components/ui/Skeleton.tsx
export function Skeleton({ className }) {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200
        dark:bg-gray-800
        rounded-md
        ${className}
      `}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-4"
    >
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2"
      >
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

// Shimmer effect skeleton
export function ShimmerSkeleton({ className }) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        bg-gray-200
        dark:bg-gray-800
        rounded-md
        ${className}
      `}
    >
      <div className="
        absolute
        inset-0
        -translate-x-full
        animate-[shimmer_2s_infinite]
        bg-gradient-to-r
        from-transparent
        via-white/20
        to-transparent
      " />
    </div>
  )
}
```

### Modal/Dialog Animation

```tsx
// components/ui/AnimatedDialog.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const dialogVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2
    }
  }
}

export function AnimatedDialog({ trigger, children }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <div onClick={() => setIsOpen(true)}>{trigger}</div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              className="relative bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4"
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### Scroll-Triggered Animation

```tsx
// components/animations/ScrollReveal.tsx
'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
}

export function ScrollReveal({ 
  children, 
  direction = 'up',
  delay = 0,
  duration = 0.5 
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const controls = useAnimation()
  
  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 }
  }
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          opacity: 0, 
          ...directions[direction] 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          x: 0,
          transition: {
            duration,
            delay,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}
```

### Number Counter Animation

```tsx
// components/animations/CountUp.tsx
'use client'

import { useEffect, useState } from 'react'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface CountUpProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

export function CountUp({ 
  end, 
  duration = 2,
  prefix = '',
  suffix = '' 
}: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  
  useEffect(() => {
    if (!isInView) return
    
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }, [isInView, end, duration])
  
  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
```

---

## Animation Presets

```css
@theme {
  /* Entrance animations */
  --animate-fade-in: fadeIn 0.5s ease-out forwards;
  --animate-fade-in-up: fadeInUp 0.5s ease-out forwards;
  --animate-fade-in-down: fadeInDown 0.5s ease-out forwards;
  --animate-fade-in-left: fadeInLeft 0.5s ease-out forwards;
  --animate-fade-in-right: fadeInRight 0.5s ease-out forwards;
  --animate-scale-in: scaleIn 0.3s ease-out forwards;
  --animate-bounce-in: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
  
  /* Exit animations */
  --animate-fade-out: fadeOut 0.3s ease-in forwards;
  --animate-scale-out: scaleOut 0.2s ease-in forwards;
  
  /* Continuous animations */
  --animate-spin: spin 1s linear infinite;
  --animate-spin-slow: spin 3s linear infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-bounce: bounce 1s infinite;
  --animate-float: float 3s ease-in-out infinite;
  
  /* Special effects */
  --animate-shimmer: shimmer 2s linear infinite;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInDown {
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInLeft {
  0% { opacity: 0; transform: translateX(-20px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes fadeInRight {
  0% { opacity: 0; transform: translateX(20px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes scaleOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(0.95); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
```

---

## Easing Functions

```css
@theme {
  /* Standard easings */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Custom easings */
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
```

---

## Related Assets

- [PageTransition Component](../assets/components/page-transition.tsx)
- [StaggeredList Component](../assets/components/staggered-list.tsx)
- [ScrollReveal Component](../assets/components/scroll-reveal.tsx)
- [AnimatedDialog Component](../assets/components/animated-dialog.tsx)
- [CountUp Component](../assets/components/count-up.tsx)
