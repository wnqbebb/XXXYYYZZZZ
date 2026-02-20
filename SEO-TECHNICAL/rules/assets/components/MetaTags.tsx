'use client'

import Head from 'next/head'
import type { Metadata } from 'next'

interface MetaTagsProps {
  title: string
  description: string
  keywords?: string[]
  author?: string
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  twitterCard?: 'summary' | 'summary_large_image'
  noIndex?: boolean
  noFollow?: boolean
  children?: React.ReactNode
}

/**
 * Meta Tags Component (Legacy Pages)
 * 
 * For use in pages router or when Metadata API isn't available.
 * App Router should use generateMetadata instead.
 * 
 * @example
 * <MetaTags
 *   title="Page Title"
 *   description="Page description"
 *   canonical="https://site.com/page"
 * />
 */
export function MetaTags({
  title,
  description,
  keywords,
  author,
  canonical,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noIndex = false,
  noFollow = false,
  children
}: MetaTagsProps) {
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ')
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {children}
    </Head>
  )
}

/**
 * Article Meta Tags
 * 
 * Pre-configured for blog posts and articles.
 */
interface ArticleMetaTagsProps {
  title: string
  description: string
  publishedAt: string
  modifiedAt?: string
  author: string
  canonical: string
  ogImage?: string
  tags?: string[]
  noIndex?: boolean
}

export function ArticleMetaTags({
  title,
  description,
  publishedAt,
  modifiedAt,
  author,
  canonical,
  ogImage,
  tags,
  noIndex = false
}: ArticleMetaTagsProps) {
  return (
    <MetaTags
      title={title}
      description={description}
      keywords={tags}
      author={author}
      canonical={canonical}
      ogImage={ogImage}
      ogType="article"
      noIndex={noIndex}
    >
      {/* Article-specific Open Graph */}
      <meta property="article:published_time" content={publishedAt} />
      {modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      <meta property="article:author" content={author} />
      {tags?.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
    </MetaTags>
  )
}

/**
 * Product Meta Tags
 * 
 * Pre-configured for product pages.
 */
interface ProductMetaTagsProps {
  name: string
  description: string
  price: number
  currency: string
  availability: 'in stock' | 'out of stock' | 'preorder'
  brand: string
  canonical: string
  ogImage?: string
  category?: string
  noIndex?: boolean
}

export function ProductMetaTags({
  name,
  description,
  price,
  currency,
  availability,
  brand,
  canonical,
  ogImage,
  category,
  noIndex = false
}: ProductMetaTagsProps) {
  return (
    <MetaTags
      title={`${name} - ${brand}`}
      description={description}
      canonical={canonical}
      ogImage={ogImage}
      ogType="product"
      noIndex={noIndex}
    >
      {/* Product-specific Open Graph */}
      <meta property="product:price:amount" content={price.toString()} />
      <meta property="product:price:currency" content={currency} />
      <meta property="product:availability" content={availability} />
      <meta property="product:brand" content={brand} />
      {category && <meta property="product:category" content={category} />}
    </MetaTags>
  )
}

/**
 * Pagination Meta Tags
 * 
 * For paginated content.
 */
interface PaginationMetaTagsProps {
  title: string
  description: string
  canonical: string
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function PaginationMetaTags({
  title,
  description,
  canonical,
  currentPage,
  totalPages,
  baseUrl
}: PaginationMetaTagsProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null
  const nextPage = currentPage < totalPages ? currentPage + 1 : null
  
  return (
    <MetaTags
      title={`${title} - Página ${currentPage}`}
      description={description}
      canonical={canonical}
    >
      {/* Pagination links */}
      {prevPage && (
        <link 
          rel="prev" 
          href={prevPage === 1 ? baseUrl : `${baseUrl}?page=${prevPage}`} 
        />
      )}
      {nextPage && (
        <link 
          rel="next" 
          href={`${baseUrl}?page=${nextPage}`} 
        />
      )}
    </MetaTags>
  )
}

/**
 * Hreflang Tags
 * 
 * For multilingual pages.
 */
interface HreflangTagsProps {
  currentLocale: string
  locales: string[]
  path: string
  baseUrl: string
  defaultLocale: string
}

export function HreflangTags({
  currentLocale,
  locales,
  path,
  baseUrl,
  defaultLocale
}: HreflangTagsProps) {
  const generateUrl = (locale: string) => {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    return `${baseUrl}/${locale}${normalizedPath}`
  }
  
  return (
    <Head>
      {/* Self-referencing */}
      <link 
        rel="alternate" 
        hrefLang={currentLocale} 
        href={generateUrl(currentLocale)} 
      />
      
      {/* Other locales */}
      {locales
        .filter(locale => locale !== currentLocale)
        .map(locale => (
          <link 
            key={locale}
            rel="alternate" 
            hrefLang={locale} 
            href={generateUrl(locale)} 
          />
        ))}
      
      {/* x-default */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={generateUrl(defaultLocale)} 
      />
    </Head>
  )
}

/**
 * Social Profile Links
 * 
 * For organization/person social profiles.
 */
interface SocialProfileLinksProps {
  profiles: Array<{
    platform: string
    url: string
  }>
}

export function SocialProfileLinks({ profiles }: SocialProfileLinksProps) {
  return (
    <Head>
      {profiles.map((profile, index) => (
        <link 
          key={index}
          rel="me" 
          href={profile.url}
        />
      ))}
    </Head>
  )
}
