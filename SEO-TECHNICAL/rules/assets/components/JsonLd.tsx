'use client'

import { useEffect, useState } from 'react'

interface JsonLdProps {
  schema: unknown
  id?: string
}

/**
 * JSON-LD Script Component
 * 
 * Renders structured data as a script tag for SEO.
 * Handles client-side hydration safely.
 * 
 * @example
 * <JsonLd schema={productSchema} />
 */
export function JsonLd({ schema, id }: JsonLdProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Don't render during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <script
        type="application/ld+json"
        id={id}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema)
        }}
      />
    )
  }
  
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 0)
      }}
    />
  )
}

/**
 * Multiple JSON-LD Schemas
 * 
 * Renders multiple schema.org structured data objects.
 * 
 * @example
 * <JsonLdCollection schemas={[
 *   { type: 'WebSite', data: websiteData },
 *   { type: 'Organization', data: orgData }
 * ]} />
 */
interface SchemaItem {
  type: string
  data: Record<string, unknown>
  id?: string
}

interface JsonLdCollectionProps {
  schemas: SchemaItem[]
}

export function JsonLdCollection({ schemas }: JsonLdCollectionProps) {
  return (
    <>
      {schemas.map((schema, index) => (
        <JsonLd
          key={schema.id || `${schema.type}-${index}`}
          id={schema.id}
          schema={{
            '@context': 'https://schema.org',
            '@type': schema.type,
            ...schema.data
          }}
        />
      ))}
    </>
  )
}

/**
 * Article JSON-LD
 * 
 * Pre-configured component for article/blog structured data.
 */
interface ArticleJsonLdProps {
  title: string
  description: string
  url: string
  image: string | string[]
  publishedAt: string
  modifiedAt?: string
  author: {
    name: string
    url?: string
  }
  publisher: {
    name: string
    logo: string
  }
  wordCount?: number
  keywords?: string[]
}

export function ArticleJsonLd({
  title,
  description,
  url,
  image,
  publishedAt,
  modifiedAt,
  author,
  publisher,
  wordCount,
  keywords
}: ArticleJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: Array.isArray(image) ? image : [image],
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url
    },
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      logo: {
        '@type': 'ImageObject',
        url: publisher.logo
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(wordCount && { wordCount }),
    ...(keywords && { keywords: keywords.join(', ') })
  }
  
  return <JsonLd schema={schema} />
}

/**
 * Product JSON-LD
 * 
 * Pre-configured component for product structured data.
 */
interface ProductJsonLdProps {
  name: string
  description: string
  image: string | string[]
  sku: string
  brand: string
  price: number
  currency: string
  availability: 'InStock' | 'OutOfStock' | 'PreOrder'
  url?: string
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

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  brand,
  price,
  currency,
  availability,
  url,
  rating,
  reviews
}: ProductJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    sku,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
      ...(url && { url })
    }
  }
  
  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count
    }
  }
  
  if (reviews && reviews.length > 0) {
    schema.review = reviews.map(review => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.date,
      reviewBody: review.content,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating
      }
    }))
  }
  
  return <JsonLd schema={schema} />
}

/**
 * FAQ JSON-LD
 * 
 * Pre-configured component for FAQ structured data.
 */
interface FAQJsonLdProps {
  faqs: Array<{
    question: string
    answer: string
  }>
}

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
  
  return <JsonLd schema={schema} />
}

/**
 * Breadcrumb JSON-LD
 * 
 * Pre-configured component for breadcrumb structured data.
 */
interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
  
  return <JsonLd schema={schema} />
}

/**
 * LocalBusiness JSON-LD
 * 
 * Pre-configured component for local business structured data.
 */
interface LocalBusinessJsonLdProps {
  name: string
  type?: string
  description: string
  url: string
  telephone: string
  email?: string
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
  images?: string[]
  priceRange?: string
  openingHours?: Array<{
    days: string[]
    opens: string
    closes: string
  }>
  rating?: {
    value: number
    count: number
  }
}

export function LocalBusinessJsonLd({
  name,
  type = 'LocalBusiness',
  description,
  url,
  telephone,
  email,
  address,
  geo,
  images,
  priceRange,
  openingHours,
  rating
}: LocalBusinessJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country
    }
  }
  
  if (email) schema.email = email
  if (geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude
    }
  }
  if (images) schema.image = images
  if (priceRange) schema.priceRange = priceRange
  
  if (openingHours) {
    schema.openingHoursSpecification = openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes
    }))
  }
  
  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.value,
      reviewCount: rating.count
    }
  }
  
  return <JsonLd schema={schema} />
}

/**
 * Organization JSON-LD
 * 
 * Pre-configured component for organization structured data.
 */
interface OrganizationJsonLdProps {
  name: string
  url: string
  logo: string
  description?: string
  sameAs?: string[]
  contactPoint?: {
    telephone: string
    contactType: string
  }
}

export function OrganizationJsonLd({
  name,
  url,
  logo,
  description,
  sameAs,
  contactPoint
}: OrganizationJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo
    }
  }
  
  if (description) schema.description = description
  if (sameAs) schema.sameAs = sameAs
  if (contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: contactPoint.telephone,
      contactType: contactPoint.contactType
    }
  }
  
  return <JsonLd schema={schema} />
}

/**
 * WebSite JSON-LD
 * 
 * Pre-configured component for website structured data with search.
 */
interface WebSiteJsonLdProps {
  name: string
  url: string
  searchUrl?: string
}

export function WebSiteJsonLd({ name, url, searchUrl }: WebSiteJsonLdProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url
  }
  
  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl
      },
      'query-input': 'required name=search_term_string'
    }
  }
  
  return <JsonLd schema={schema} />
}
