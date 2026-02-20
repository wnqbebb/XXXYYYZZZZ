'use client'

import { cn } from '@/lib/utils'

interface SkipLinkProps {
  targetId?: string
  className?: string
  children?: React.ReactNode
}

/**
 * SkipLink Component
 * Allows keyboard users to skip navigation and go to main content
 * 
 * @example
 * // In layout.tsx, before header
 * <SkipLink targetId="main-content">
 *   Skip to main content
 * </SkipLink>
 */
export function SkipLink({ 
  targetId = 'main-content',
  className,
  children = 'Skip to main content'
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4',
        'focus:z-50 focus:px-4 focus:py-2 focus:bg-black focus:text-white',
        'focus:rounded focus:no-underline',
        className
      )}
    >
      {children}
    </a>
  )
}
