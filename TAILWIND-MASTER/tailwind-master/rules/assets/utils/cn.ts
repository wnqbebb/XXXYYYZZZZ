import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class values into a single string,
 * merging Tailwind classes intelligently.
 * 
 * Uses clsx for conditional classes and tailwind-merge
 * to resolve conflicting Tailwind utilities.
 * 
 * @example
 * cn('px-4', 'px-6') // => 'px-6' (conflict resolved)
 * cn('text-red-500', 'text-blue-500') // => 'text-blue-500'
 * cn('p-4', isActive && 'bg-blue-500') // => 'p-4 bg-blue-500'
 * cn(['px-4', 'py-2'], 'm-2') // => 'px-4 py-2 m-2'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
