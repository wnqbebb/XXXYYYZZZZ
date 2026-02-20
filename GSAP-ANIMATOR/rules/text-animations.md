---
name: gsap-text-animations
description: Text animations with SplitText and alternatives. Load when animating text.
metadata:
  tags: gsap, text, splittext, typography, animation
---

# Text Animations Rules

## MUST: SplitText Setup

```typescript
// SplitText is a Club GSAP plugin
// Requires GSAP Club membership or use SplitType (free)

import { SplitText } from 'gsap/SplitText'

// Register plugin
gsap.registerPlugin(SplitText)

// Split types
const split = new SplitText('.text', {
  type: 'chars,words,lines',  // What to split
  charsClass: 'char',          // Class for chars
  wordsClass: 'word',          // Class for words
  linesClass: 'line'           // Class for lines
})
```

### Split Types

```yaml
type: 'chars'
  Splits: Individual characters
  Use: Character-by-character reveals
  
type: 'words'
  Splits: By word
  Use: Word-by-word animations
  
type: 'lines'
  Splits: By line (wrapped)
  Use: Line reveals
  
type: 'chars,words,lines'
  Splits: All three
  Access: split.chars, split.words, split.lines
```

## MUST: Character Animation

```typescript
const split = new SplitText('.headline', { type: 'chars' })

// Animate each character
gsap.from(split.chars, {
  y: 100,
  opacity: 0,
  rotationX: -90,
  stagger: 0.02,        // Delay between each
  duration: 0.8,
  ease: 'power4.out'
})
```

## MUST: Word Animation

```typescript
const split = new SplitText('.paragraph', { type: 'words' })

// Fade in words with stagger
gsap.from(split.words, {
  opacity: 0,
  y: 20,
  filter: 'blur(10px)',
  stagger: {
    each: 0.05,
    from: 'start'  // 'start', 'center', 'end', 'edges', 'random'
  },
  duration: 0.6
})
```

## MUST: Line Animation

```typescript
const split = new SplitText('.text-block', { 
  type: 'lines',
  linesClass: 'line' 
})

// Reveal lines with mask
gsap.from(split.lines, {
  yPercent: 100,
  duration: 1,
  stagger: 0.1,
  ease: 'power3.out'
})
```

## MUST: Cleanup SplitText

```typescript
useGSAP(() => {
  const split = new SplitText('.text', { type: 'chars' })
  
  gsap.from(split.chars, { ... })
  
  // MUST: Revert on cleanup
  return () => {
    split.revert()  // Restores original text
  }
}, [])
```

## Alternative: SplitType (Free)

```bash
npm install split-type
```

```typescript
import SplitType from 'split-type'

const split = new SplitType('.text', {
  types: 'chars,words,lines'
})

// Same API as SplitText
gsap.from(split.chars, {
  y: 100,
  opacity: 0,
  stagger: 0.02
})

// Cleanup
return () => split.revert()
```

---

**Text animations mastered. Typography comes alive.**
