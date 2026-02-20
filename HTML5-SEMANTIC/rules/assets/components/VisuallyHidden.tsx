'use client'

import { cn } from '@/lib/utils'

interface VisuallyHiddenProps {
  children: React.ReactNode
  className?: string
}

/**
 * VisuallyHidden Component
 * Hides content visually but keeps it accessible to screen readers
 * 
 * @example
 * <button>
 *   <MenuIcon />
 *   <VisuallyHidden>Open menu</VisuallyHidden>
 * </button>
 */
export function VisuallyHidden({ 
  children, 
  className 
}: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        'clip-[rect(0,0,0,0)]',
        className
      )}
      style={{
        clip: 'rect(0, 0, 0, 0)',
        clipPath: 'inset(50%)'
      }}
    >
      {children}
    </span>
  )
}
