// SEO utility functions

import type { Metadata } from 'next'
import type { 
  SEOMetadata, 
  OpenGraphConfig, 
  TwitterCardConfig,
  SitemapEntry,
  LanguageAlternate 
} from '../types/seo'

// ============================================================================
// URL Utilities
// ============================================================================

/**
 * Ensures URL has protocol and no trailing slash
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim()
  
  // Add protocol if missing
  if (!normalized.startsWith('http')) {
    normalized = `https://${normalized}`
  }
  
  // Remove trailing slash
  normalized = normalized.replace(/\/$/, '')
  
  return normalized
}

/**
 * Creates a canonical URL
 */
export function createCanonicalUrl(
  baseUrl: string, 
  path: string, 
  locale?: string
): string {
  const normalizedBase = normalizeUrl(baseUrl)
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  
  if (locale && locale !== 'default') {
    return `${normalizedBase}/${locale}${cleanPath}`
  }
  
  return `${normalizedBase}${cleanPath}`
}

/**
 * Generates hreflang URLs for all locales
 */
export function generateHreflangUrls(
  baseUrl: string,
  path: string,
  locales: string[],
  defaultLocale: string
): Record<string, string> {
  const alternates: Record<string, string> = {}
  
  locales.forEach(locale => {
    alternates[locale] = createCanonicalUrl(baseUrl, path, locale)
  })
  
  // Add x-default
  alternates['x-default'] = createCanonicalUrl(baseUrl, path, defaultLocale)
  
  return alternates
}

// ============================================================================
// Meta Tag Utilities
// ============================================================================

/**
 * Truncates text to specified length with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3).trim() + '...'
}

/**
 * Optimizes title tag length (50-60 characters)
 */
export function optimizeTitle(title: string, brand?: string): string {
  const maxLength = brand ? 60 - brand.length - 3 : 60
  let optimized = truncate(title, maxLength)
  
  if (brand) {
    optimized = `${optimized} | ${brand}`
  }
  
  return optimized
}

/**
 * Optimizes meta description (150-160 characters)
 */
export function optimizeDescription(description: string): string {
  return truncate(description, 160)
}

/**
 * Generates metadata object from config
 */
export function generateMetadata(config: SEOMetadata): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: config.authors,
    creator: config.creator,
    publisher: config.publisher,
    robots: config.robots,
    openGraph: config.openGraph,
    twitter: config.twitter,
    alternates: config.alternates,
    verification: config.verification
  }
}

// ============================================================================
// Open Graph Utilities
// ============================================================================

/**
 * Validates and formats Open Graph image
 */
export function validateOgImage(image: {
  url: string
  width?: number
  height?: number
  alt?: string
}): { url: string; width: number; height: number; alt: string } {
  return {
    url: image.url,
    width: image.width || 1200,
    height: image.height || 630,
    alt: image.alt || ''
  }
}

/**
 * Generates Open Graph metadata
 */
export function generateOpenGraph(config: OpenGraphConfig): Metadata['openGraph'] {
  return {
    title: config.title,
    description: config.description,
    url: config.url,
    siteName: config.siteName,
    images: config.images.map(validateOgImage),
    locale: config.locale,
    type: config.type || 'website',
    ...(config.publishedTime && { publishedTime: config.publishedTime }),
    ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
    ...(config.authors && { authors: config.authors }),
    ...(config.tags && { tags: config.tags })
  }
}

// ============================================================================
// Twitter Card Utilities
// ============================================================================

/**
 * Generates Twitter Card metadata
 */
export function generateTwitterCard(config: TwitterCardConfig): Metadata['twitter'] {
  return {
    card: config.card || 'summary_large_image',
    site: config.site,
    creator: config.creator,
    title: config.title,
    description: config.description,
    images: config.images
  }
}

// ============================================================================
// Sitemap Utilities
// ============================================================================

/**
 * Generates sitemap XML from entries
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries.map(entry => {
    const lastmod = entry.lastModified 
      ? new Date(entry.lastModified).toISOString()
      : new Date().toISOString()
    
    let urlXml = `  <url>\n`
    urlXml += `    <loc>${entry.url}</loc>\n`
    urlXml += `    <lastmod>${lastmod}</lastmod>\n`
    
    if (entry.changeFrequency) {
      urlXml += `    <changefreq>${entry.changeFrequency}</changefreq>\n`
    }
    
    if (entry.priority !== undefined) {
      urlXml += `    <priority>${entry.priority}</priority>\n`
    }
    
    // Add alternate languages
    if (entry.alternates && entry.alternates.length > 0) {
      entry.alternates.forEach(alt => {
        urlXml += `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}" />\n`
      })
    }
    
    // Add images
    if (entry.images && entry.images.length > 0) {
      entry.images.forEach(img => {
        urlXml += `    <image:image>\n`
        urlXml += `      <image:loc>${img.loc}</image:loc>\n`
        if (img.caption) {
          urlXml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`
        }
        if (img.title) {
          urlXml += `      <image:title>${escapeXml(img.title)}</image:title>\n`
        }
        urlXml += `    </image:image>\n`
      })
    }
    
    urlXml += `  </url>`
    return urlXml
  })
  
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>`
}

/**
 * Escapes XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ============================================================================
// Robots.txt Utilities
// ============================================================================

interface RobotsRule {
  userAgent: string
  allow?: string[]
  disallow?: string[]
  crawlDelay?: number
}

/**
 * Generates robots.txt content
 */
export function generateRobotsTxt(
  rules: RobotsRule[],
  sitemapUrl: string,
  host?: string
): string {
  let content = ''
  
  rules.forEach(rule => {
    content += `User-agent: ${rule.userAgent}\n`
    
    if (rule.allow) {
      rule.allow.forEach(path => {
        content += `Allow: ${path}\n`
      })
    }
    
    if (rule.disallow) {
      rule.disallow.forEach(path => {
        content += `Disallow: ${path}\n`
      })
    }
    
    if (rule.crawlDelay) {
      content += `Crawl-delay: ${rule.crawlDelay}\n`
    }
    
    content += '\n'
  })
  
  content += `Sitemap: ${sitemapUrl}\n`
  
  if (host) {
    content += `Host: ${host}\n`
  }
  
  return content
}

// ============================================================================
// Structured Data Utilities
// ============================================================================

/**
 * Safely stringifies JSON-LD schema
 */
export function stringifySchema(schema: unknown): string {
  return JSON.stringify(schema, null, 0)
}

/**
 * Validates schema.org type
 */
export function isValidSchemaType(type: string): boolean {
  const validTypes = [
    'WebSite', 'WebPage', 'Organization', 'LocalBusiness',
    'Product', 'Article', 'BlogPosting', 'NewsArticle',
    'FAQPage', 'HowTo', 'BreadcrumbList', 'Review',
    'Course', 'Person', 'Event', 'Place'
  ]
  
  return validTypes.includes(type)
}

// ============================================================================
// Content Utilities
// ============================================================================

/**
 * Estimates reading time
 */
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Generates excerpt from content
 */
export function generateExcerpt(content: string, maxLength: number = 160): string {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ')
  // Normalize whitespace
  const normalized = text.replace(/\s+/g, ' ').trim()
  
  return truncate(normalized, maxLength)
}

/**
 * Slugifies text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim()
}

// ============================================================================
// Core Web Vitals Utilities
// ============================================================================

/**
 * Gets Core Web Vitals rating
 */
export function getWebVitalsRating(
  metric: 'LCP' | 'INP' | 'CLS' | 'TTFB',
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = {
    LCP: { good: 2500, poor: 4000 },
    INP: { good: 200, poor: 500 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 600, poor: 800 }
  }
  
  const threshold = thresholds[metric]
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Formats date for Schema.org
 */
export function formatSchemaDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString()
}

/**
 * Gets relative time string
 */
export function getRelativeTimeString(date: Date | string): string {
  const now = new Date()
  const then = typeof date === 'string' ? new Date(date) : date
  const diffInDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoy'
  if (diffInDays === 1) return 'Ayer'
  if (diffInDays < 7) return `Hace ${diffInDays} días`
  if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`
  if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`
  return `Hace ${Math.floor(diffInDays / 365)} años`
}
