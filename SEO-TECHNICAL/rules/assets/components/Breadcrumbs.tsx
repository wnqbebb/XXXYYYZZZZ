'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BreadcrumbJsonLd } from './JsonLd'

interface BreadcrumbItem {
  name: string
  url: string
  isCurrent?: boolean
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  homeLabel?: string
  separator?: React.ReactNode
  className?: string
  includeSchema?: boolean
}

/**
 * Breadcrumbs Component
 * 
 * Accessible breadcrumb navigation with structured data support.
 * Auto-generates from pathname if items not provided.
 * 
 * @example
 * // Auto-generated from URL
 * <Breadcrumbs />
 * 
 * // Manual items
 * <Breadcrumbs 
 *   items={[
 *     { name: 'Inicio', url: '/' },
 *     { name: 'Blog', url: '/blog' },
 *     { name: 'Artículo Actual', url: '/blog/articulo', isCurrent: true }
 *   ]}
 * />
 */
export function Breadcrumbs({
  items,
  homeLabel = 'Inicio',
  separator = '/',
  className = '',
  includeSchema = true
}: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Auto-generate items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbsFromPath(pathname, homeLabel)
  
  // Schema data for JSON-LD
  const schemaItems = breadcrumbItems.map(item => ({
    name: item.name,
    url: item.url
  }))
  
  return (
    <>
      {includeSchema && <BreadcrumbJsonLd items={schemaItems} />}
      
      <nav 
        aria-label="Breadcrumb"
        className={`breadcrumbs ${className}`}
      >
        <ol className="flex flex-wrap items-center gap-2 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1
            
            return (
              <li 
                key={item.url}
                className="flex items-center gap-2"
              >
                {index > 0 && (
                  <span className="text-gray-400" aria-hidden="true">
                    {separator}
                  </span>
                )}
                
                {isLast || item.isCurrent ? (
                  <span 
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}

/**
 * Generate breadcrumb items from pathname
 */
function generateBreadcrumbsFromPath(
  pathname: string, 
  homeLabel: string
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [
    { name: homeLabel, url: '/' }
  ]
  
  let currentPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    items.push({
      name: formatSegmentName(segment),
      url: currentPath,
      isCurrent: isLast
    })
  })
  
  return items
}

/**
 * Format URL segment to readable name
 */
function formatSegmentName(segment: string): string {
  return segment
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Breadcrumbs with Schema.org structured data
 * 
 * Pre-configured for e-commerce category navigation
 */
interface CategoryBreadcrumbsProps {
  category: {
    name: string
    url: string
  }
  subcategory?: {
    name: string
    url: string
  }
  product?: {
    name: string
    url: string
  }
  homeLabel?: string
}

export function CategoryBreadcrumbs({
  category,
  subcategory,
  product,
  homeLabel = 'Inicio'
}: CategoryBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { name: homeLabel, url: '/' },
    { name: category.name, url: category.url }
  ]
  
  if (subcategory) {
    items.push({ name: subcategory.name, url: subcategory.url })
  }
  
  if (product) {
    items.push({ 
      name: product.name, 
      url: product.url, 
      isCurrent: true 
    })
  } else if (subcategory) {
    items[items.length - 1].isCurrent = true
  } else {
    items[items.length - 1].isCurrent = true
  }
  
  return <Breadcrumbs items={items} />
}

/**
 * Breadcrumbs for blog posts
 */
interface BlogBreadcrumbsProps {
  category?: {
    name: string
    slug: string
  }
  postTitle: string
  blogLabel?: string
}

export function BlogBreadcrumbs({
  category,
  postTitle,
  blogLabel = 'Blog'
}: BlogBreadcrumbsProps) {
  const items: BreadcrumbItem[] = [
    { name: 'Inicio', url: '/' },
    { name: blogLabel, url: '/blog' }
  ]
  
  if (category) {
    items.push({
      name: category.name,
      url: `/blog/categoria/${category.slug}`
    })
  }
  
  items.push({
    name: postTitle,
    url: '#',
    isCurrent: true
  })
  
  return <Breadcrumbs items={items} />
}
