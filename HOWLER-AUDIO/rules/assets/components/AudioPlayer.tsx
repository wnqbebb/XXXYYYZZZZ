'use client'

import { useState, useEffect } from 'react'
import { useHowler } from '@/hooks/useHowler'
import { cn } from '@/lib/utils'

interface AudioPlayerProps {
  src: string | string[]
  title?: string
  className?: string
}

/**
 * AudioPlayer Component
 * Simple audio player with play/pause controls
 * 
 * @example
 * <AudioPlayer 
 *   src={['/audio/song.mp3', '/audio/song.ogg']}
 *   title="Background Music"
 * />
 */
export function AudioPlayer({ src, title, className }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const { play, pause, stop, seek, duration, currentTime, sound } = useHowler({
    src,
    html5: true,
    onEnd: () => setIsPlaying(false)
  })

  // Update progress
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      const current = currentTime()
      const total = duration()
      if (total > 0) {
        setProgress((current / total) * 100)
      }
    }, 250)
    
    return () => clearInterval(interval)
  }, [isPlaying, currentTime, duration])

  const togglePlay = () => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(e.target.value)
    const total = duration()
    seek((percent / 100) * total)
    setProgress(percent)
  }

  return (
    <div className={cn('flex items-center gap-4 p-4 bg-gray-100 rounded-lg', className)}>
      <button
        onClick={togglePlay}
        className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      
      {title && <span className="font-medium">{title}</span>}
      
      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  )
}
