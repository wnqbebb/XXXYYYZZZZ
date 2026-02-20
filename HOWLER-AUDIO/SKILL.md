---
name: howler-audio
description: Howler.js for professional web audio experiences. Use when (1) Playing background music, (2) Sound effects and UI feedback, (3) Audio visualization, (4) Spatial/3D audio, (5) Cross-browser audio compatibility. MANDATORY for audio-enabled sites.
metadata:
  tags: howler, audio, sound, music, web-audio, spatial-audio
  author: Santiago Workflow Systems
  version: 3.0.0
  priority: medium
  category: media
---

# Howler Audio Master System

**Immersive audio. Professional sound. Universal compatibility.**

Howler.js is the industry-standard audio library for the web, solving cross-browser audio inconsistencies and providing a powerful API for everything from simple sound effects to complex audio experiences.

---

## When to Use This Skill

### Mandatory Activation

```yaml
USE WHEN:
  - Adding background music to sites
  - Implementing UI sound effects (clicks, hovers)
  - Creating audio visualizations
  - Building games with audio
  - Podcast/audio player interfaces
  - Ambient soundscapes
  - Cross-browser audio compatibility needed

DO NOT USE WHEN:
  - Simple HTML5 audio suffices (<audio> tag)
  - No user interaction context (autoplay blocked)
  - Background audio not permitted by design
```

---

## The Howler Stack

### Core Dependencies

```yaml
Core:
  - howler: ^2.2.4 (audio engine)
  
Types:
  - @types/howler: ^2.2.11 (TypeScript definitions)
  
Integration:
  - gsap: ^3.12.0 (sync with animations)
  - three.js: ^0.160.0 (spatial audio)
  
Audio Formats:
  - WebM (best compression)
  - MP3 (universal support)
  - OGG (fallback)
```

### Installation

```bash
npm install howler
npm install -D @types/howler
```

---

## Rule Files Index

### Core Usage

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/core-api.md](./rules/core-api.md) | Basic Howler API | Getting started |
| [rules/audio-formats.md](./rules/audio-formats.md) | Format best practices | Preparing audio assets |
| [rules/performance.md](./rules/performance.md) | Optimization | Large audio files |

### Advanced Features

| File | Purpose | Load When |
|------|---------|-----------|
| [rules/spatial-audio.md](./rules/spatial-audio.md) | 3D/spatial sound | Immersive audio |
| [rules/streaming.md](./rules/streaming.md) | Large file handling | Music/podcasts |
| [rules/errors.md](./rules/errors.md) | Error handling | Production stability |

### Asset Library

```
rules/assets/
├── components/
│   ├── AudioPlayer.tsx         # React audio player
│   ├── SoundEffect.tsx         # UI sound effects
│   └── BackgroundMusic.tsx     # Ambient music
├── hooks/
│   ├── useHowler.ts            # Howler hook
│   ├── useAudioPlayer.ts       # Player controls
│   └── useSoundEffects.ts      # Effect manager
├── lib/
│   └── howler.ts               # Howler configuration
└── utils/
    └── audio-helpers.ts        # Utility functions
```

---

## Quick Start

### Basic Setup

```typescript
import { Howl } from 'howler'

const sound = new Howl({
  src: ['/audio/sound.mp3', '/audio/sound.ogg'],
  volume: 0.5,
  onload: () => console.log('Loaded'),
  onend: () => console.log('Finished')
})

// Play
sound.play()
```

### React Integration

```tsx
import { useEffect, useRef } from 'react'
import { Howl } from 'howler'

export function SoundButton() {
  const soundRef = useRef<Howl>()
  
  useEffect(() => {
    soundRef.current = new Howl({
      src: ['/audio/click.mp3']
    })
    
    return () => {
      soundRef.current?.unload()
    }
  }, [])
  
  return (
    <button onClick={() => soundRef.current?.play()}>
      Play Sound
    </button>
  )
}
```

---

## Golden Rules

```yaml
MUST:
  - Provide multiple audio formats (MP3 + OGG/WebM)
  - Unload audio when component unmounts
  - Respect user's audio preferences
  - Handle autoplay restrictions
  - Implement error handling

FORBIDDEN:
  - Autoplay without user interaction
  - Loading large audio files without streaming
  - Forgetting cleanup (memory leaks)
  - Ignoring mobile audio limitations
```

---

## Integration

```
WORKS WITH:
  - gsap-animator (Sync audio with animations)
  - threejs-creative (Spatial audio in 3D)
  - barba-transitions (Audio during page changes)

ENABLES:
  - Immersive experiences
  - Audio feedback systems
  - Music players
  - Game audio
```

---

**Professional audio. Universal compatibility.**
