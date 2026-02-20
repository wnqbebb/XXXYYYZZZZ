import { Howl, Howler } from 'howler'

/**
 * Global Howler configuration
 * Call this once at app initialization
 */
export function configureHowler() {
  // Set global volume
  Howler.volume(0.5)
  
  // Enable auto-suspend (saves battery)
  Howler.autoSuspend = true
}

/**
 * Create a Howl instance with default options
 */
export function createSound(
  src: string | string[],
  options: Partial<Howl.Options> = {}
): Howl {
  return new Howl({
    src: Array.isArray(src) ? src : [src],
    volume: 0.5,
    html5: false, // Use Web Audio API (better for short sounds)
    preload: true,
    ...options
  })
}

/**
 * Create a streaming Howl for large files
 */
export function createStream(
  src: string | string[],
  options: Partial<Howl.Options> = {}
): Howl {
  return new Howl({
    src: Array.isArray(src) ? src : [src],
    html5: true, // Force HTML5 Audio for streaming
    preload: 'metadata', // Don't preload entire file
    ...options
  })
}

/**
 * Global mute/unmute
 */
export function setGlobalMute(muted: boolean) {
  Howler.mute(muted)
}

/**
 * Check if audio context is available
 */
export function isAudioAvailable(): boolean {
  return Howler.ctx !== null
}

/**
 * Resume audio context (needed after user interaction)
 */
export function resumeAudioContext() {
  if (Howler.ctx && Howler.ctx.state === 'suspended') {
    Howler.ctx.resume()
  }
}

export { Howl, Howler }
