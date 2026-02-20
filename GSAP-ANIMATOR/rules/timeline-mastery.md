---
name: gsap-timeline-mastery
description: Timeline orchestration for complex animations. Load when creating multi-step sequences.
metadata:
  tags: gsap, timeline, sequence, orchestration
---

# Timeline Mastery Rules

## MUST: Timeline Basics

```typescript
// Create timeline
const tl = gsap.timeline({
  defaults: {          // Default properties for all tweens
    duration: 1,
    ease: 'power2.out'
  },
  onComplete: () => {  // Callbacks
    console.log('Timeline complete')
  }
})

// Add tweens (sequential by default)
tl.to('.box1', { x: 100 })           // Step 1
tl.to('.box2', { x: 100 })           // Step 2 (after box1)
tl.to('.box3', { x: 100 })           // Step 3 (after box2)
```

## MUST: Position Parameters

```typescript
const tl = gsap.timeline()

// Sequential (default)
tl.to('.a', { x: 100 })               // Start at 0s
tl.to('.b', { x: 100 })               // Start after a finishes
tl.to('.c', { x: 100 })               // Start after b finishes

// Absolute time
tl.to('.d', { x: 100 }, 2)            // Start at 2s

// Relative to previous
tl.to('.e', { x: 100 }, '+=1')        // 1s after previous finishes
tl.to('.f', { x: 100 }, '-=0.5')      // 0.5s before previous finishes

// Labels
tl.add('startLabel')                   // Create label
tl.to('.g', { x: 100 }, 'startLabel')  // At label
tl.to('.h', { x: 100 }, 'startLabel+=0.5') // 0.5s after label
```

### Position Parameter Reference

```
ABSOLUTE:
  2        → At 2 seconds
  'label'  → At label position

RELATIVE:
  '+=1'    → 1 second after previous tween ends
  '-=0.5'  → 0.5 seconds before previous tween ends
  '<'      → At start of previous tween
  '>'      → At end of previous tween
  '<1'     → 1 second after start of previous

LABEL-BASED:
  'myLabel'       → At label
  'myLabel+=1'    → 1 second after label
  'myLabel-=0.5'  → 0.5 seconds before label
```

## MUST: Timeline Control

```typescript
const tl = gsap.timeline({ paused: true }) // Start paused

tl.play()       // Play forward
tl.pause()      // Pause
tl.resume()     // Resume from current position
tl.reverse()    // Play backwards
tl.restart()    // Go to start and play
tl.seek(2)      // Jump to 2 seconds
tl.progress(0.5) // Jump to 50% progress
tl.timeScale(2) // Play at 2x speed
tl.timeScale(0.5) // Play at 0.5x speed
```

## MUST: Nested Timelines

```typescript
function createSubTimeline() {
  const subTl = gsap.timeline()
  subTl.to('.sub-a', { x: 100 })
       .to('.sub-b', { x: 100 }, '<')
  return subTl
}

const masterTl = gsap.timeline()

masterTl
  .to('.main', { x: 100 })
  .add(createSubTimeline(), '-=0.5')  // Add sub-timeline
  .to('.main2', { x: 100 })
```

## MUST: Timeline + ScrollTrigger

```typescript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top top',
    end: '+=2000',      // 2000px scroll distance
    pin: true,
    scrub: 0.5         // Smooth scrub
  }
})

// Timeline plays based on scroll position
tl.to('.el1', { y: -100 })
  .to('.el2', { rotation: 360 })
  .to('.el3', { scale: 1.5 })
```

## FORBIDDEN: Anti-patterns

```yaml
FORBIDDEN:
  Not using position parameters:
    WRONG: tl.to(a, {}).to(b, {}).to(c, {})
    RIGHT: tl.to(a, {}).to(b, {}, '<').to(c, {}, '+=0.2')
    
  Creating timelines in render:
    WRONG: useEffect(() => { gsap.timeline() }, [state])
    RIGHT: useLayoutEffect with refs, kill on cleanup
    
  Ignoring timeline scope:
    WRONG: Global timeline affecting all elements
    RIGHT: Scoped timeline with gsap.context()
```

---

**Timelines mastered. Complex sequences orchestrated.**
