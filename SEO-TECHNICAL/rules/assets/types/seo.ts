// TypeScript definitions for SEO components

import type { Metadata, Viewport } from 'next'
import type { Thing, WithContext } from 'schema-dts'

// ============================================================================
// Meta Tags Types
// ============================================================================

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  authors?: Array<{ name: string; url?: string }>
  creator?: string
  publisher?: string
  robots?: Metadata['robots']
  openGraph?: Metadata['openGraph']
  twitter?: Metadata['twitter']
  alternates?: Metadata['alternates']
  verification?: Metadata['verification']
}

export interface OpenGraphImage {
  url: string
  width?: number
  height?: number
  alt?: string
}

export interface OpenGraphConfig {
  title: string
  description: string
  url: string
  siteName: string
  images: OpenGraphImage[]
  locale: string
  type?: 'website' | 'article' | 'product' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
}

export interface TwitterCardConfig {
  card?: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string
  creator?: string
  title: string
  description: string
  images?: string[]
}

// ============================================================================
// Structured Data Types
// ============================================================================

export type SchemaType = 
  | 'WebSite'
  | 'WebPage'
  | 'Organization'
  | 'LocalBusiness'
  | 'Product'
  | 'Article'
  | 'BlogPosting'
  | 'NewsArticle'
  | 'FAQPage'
  | 'HowTo'
  | 'BreadcrumbList'
  | 'Review'
  | 'Course'
  | 'Person'
  | 'Event'
  | 'Place'

export interface SchemaConfig {
  type: SchemaType
  data: Record<string, unknown>
}

export type JsonLdSchema = WithContext<Thing>

// ============================================================================
// Author & E-E-A-T Types
// ============================================================================

export interface Author {
  name: string
  title: string
  company: string
  photo: string
  bio: string
  credentials: string[]
  expertise: string[]
  social: Array<{ platform: string; url: string }>
  publications?: Array<{ title: string; url: string }>
  sameAs?: string[]
}

export interface Organization {
  name: string
  url: string
  logo: string
  description: string
  sameAs: string[]
  contactPoint?: {
    telephone: string
    contactType: string
    availableLanguage?: string[]
    areaServed?: string
  }
}

// ============================================================================
// International SEO Types
// ============================================================================

export interface LocaleConfig {
  code: string
  name: string
  flag?: string
  isDefault?: boolean
}

export interface HreflangConfig {
  locales: string[]
  defaultLocale: string
  path: string
  domain?: string
}

export interface LanguageAlternate {
  lang: string
  url: string
}

// ============================================================================
// Content Types
// ============================================================================

export interface ArticleSection {
  heading: string
  lead?: string
  content?: string
  subsections?: Array<{
    heading: string
    content: string
    keyPoints?: string[]
  }>
  image?: {
    url: string
    alt: string
    caption?: string
  }
  facts?: Array<{
    term: string
    definition: string
  }>
}

export interface FAQItem {
  question: string
  answer: string
}

export interface Reference {
  title: string
  url: string
  source: string
  author?: string
  date?: string
  doi?: string
}

export interface ArticleData {
  title: string
  summary: string
  content: string
  sections: ArticleSection[]
  faqs: FAQItem[]
  references: Reference[]
  author: Author
  publishedAt: string
  updatedAt: string
  wordCount: number
  tags: string[]
}

// ============================================================================
// Core Web Vitals Types
// ============================================================================

export interface WebVitalsMetric {
  id: string
  name: 'CLS' | 'FCP' | 'FID' | 'INP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: PerformanceEntry[]
  navigationType?: string
}

export interface WebVitalsReport {
  metrics: WebVitalsMetric[]
  url: string
  timestamp: number
}

// ============================================================================
// Sitemap Types
// ============================================================================

export interface SitemapEntry {
  url: string
  lastModified?: Date | string
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternates?: LanguageAlternate[]
  images?: Array<{
    loc: string
    caption?: string
    title?: string
  }>
}

// ============================================================================
// AI Search Optimization Types
// ============================================================================

export interface DirectAnswer {
  summary: string
  details: string[]
  evidence?: Array<{
    statistic: string
    context: string
    source: string
  }>
  relatedQuestions?: Array<{
    question: string
    answer: string
  }>
}

export interface EntityData {
  name: string
  type: string
  description: string
  attributes: Record<string, string>
  relationships: Array<{
    subject: string
    predicate: string
    object: string
  }>
}

// ============================================================================
// Product Types
// ============================================================================

export interface ProductData {
  name: string
  description: string
  sku: string
  brand: string
  gtin13?: string
  mpn?: string
  images: string[]
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  condition: 'New' | 'Used' | 'Refurbished'
  rating?: {
    value: number
    count: number
  }
  reviews?: Array<{
    author: string
    date: string
    content: string
    rating: number
  }>
}

// ============================================================================
// Local Business Types
// ============================================================================

export interface LocalBusinessData {
  name: string
  type: string
  description: string
  url: string
  telephone: string
  email?: string
  priceRange: string
  address: {
    street: string
    city: string
    region: string
    postalCode: string
    country: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHours: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  images?: string[]
  rating?: {
    value: number
    count: number
  }
}
