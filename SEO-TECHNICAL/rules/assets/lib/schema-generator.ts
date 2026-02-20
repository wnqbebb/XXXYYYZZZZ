// Schema.org structured data generators

import type { 
  WithContext, 
  WebSite, 
  Organization, 
  LocalBusiness,
  Product,
  Article,
  BlogPosting,
  FAQPage,
  BreadcrumbList,
  HowTo,
  Review,
  Course,
  Person,
  PostalAddress,
  GeoCoordinates,
  OpeningHoursSpecification,
  AggregateRating,
  Offer,
  Brand,
  ImageObject
} from 'schema-dts'

import type { 
  Author, 
  Organization as OrganizationType,
  LocalBusinessData,
  ProductData,
  ArticleData,
  FAQItem 
} from '../types/seo'

// ============================================================================
// WebSite Schema
// ============================================================================

interface WebSiteConfig {
  name: string
  url: string
  searchUrl?: string
}

export function generateWebSiteSchema(config: WebSiteConfig): WithContext<WebSite> {
  const schema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url
  }
  
  if (config.searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: config.searchUrl
      },
      'query-input': 'required name=search_term_string'
    }
  }
  
  return schema
}

// ============================================================================
// Organization Schema
// ============================================================================

export function generateOrganizationSchema(
  org: OrganizationType
): WithContext<Organization> {
  const schema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: {
      '@type': 'ImageObject',
      url: org.logo
    } as ImageObject,
    description: org.description,
    sameAs: org.sameAs
  }
  
  if (org.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: org.contactPoint.telephone,
      contactType: org.contactPoint.contactType,
      ...(org.contactPoint.availableLanguage && {
        availableLanguage: org.contactPoint.availableLanguage
      }),
      ...(org.contactPoint.areaServed && {
        areaServed: org.contactPoint.areaServed
      })
    }
  }
  
  return schema
}

// ============================================================================
// LocalBusiness Schema
// ============================================================================

export function generateLocalBusinessSchema(
  business: LocalBusinessData
): WithContext<LocalBusiness> {
  const schema: WithContext<LocalBusiness> = {
    '@context': 'https://schema.org',
    '@type': business.type as LocalBusiness['@type'] || 'LocalBusiness',
    name: business.name,
    description: business.description,
    url: business.url,
    telephone: business.telephone,
    priceRange: business.priceRange,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country
    } as PostalAddress
  }
  
  if (business.email) {
    schema.email = business.email
  }
  
  if (business.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: business.geo.latitude,
      longitude: business.geo.longitude
    } as GeoCoordinates
  }
  
  if (business.openingHours && business.openingHours.length > 0) {
    schema.openingHoursSpecification = business.openingHours.map(hours => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.days,
      opens: hours.opens,
      closes: hours.closes
    } as OpeningHoursSpecification))
  }
  
  if (business.images && business.images.length > 0) {
    schema.image = business.images
  }
  
  if (business.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: business.rating.value.toString(),
      reviewCount: business.rating.count.toString()
    } as AggregateRating
  }
  
  return schema
}

// ============================================================================
// Product Schema
// ============================================================================

export function generateProductSchema(
  product: ProductData
): WithContext<Product> {
  const schema: WithContext<Product> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand
    } as Brand,
    offers: {
      '@type': 'Offer',
      url: product.url || '',
      priceCurrency: product.currency,
      price: product.price.toString(),
      availability: `https://schema.org/${product.availability}`,
      itemCondition: `https://schema.org/${product.condition}Condition`
    } as Offer
  }
  
  if (product.gtin13) {
    schema.gtin13 = product.gtin13
  }
  
  if (product.mpn) {
    schema.mpn = product.mpn
  }
  
  if (product.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value.toString(),
      reviewCount: product.rating.count.toString(),
      bestRating: '5',
      worstRating: '1'
    } as AggregateRating
  }
  
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author
      },
      datePublished: review.date,
      reviewBody: review.content,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString()
      }
    }))
  }
  
  return schema
}

// ============================================================================
// Article Schema
// ============================================================================

export function generateArticleSchema(
  article: ArticleData,
  url: string
): WithContext<BlogPosting> {
  const schema: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.summary,
    image: article.sections
      .filter(s => s.image)
      .map(s => s.image!.url),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.social.find(s => s.platform === 'website')?.url,
      image: article.author.photo,
      jobTitle: article.author.title,
      worksFor: {
        '@type': 'Organization',
        name: article.author.company
      }
    },
    publisher: {
      '@type': 'Organization',
      name: article.author.company,
      logo: {
        '@type': 'ImageObject',
        url: '' // Add organization logo URL
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    wordCount: article.wordCount,
    keywords: article.tags.join(', ')
  }
  
  return schema
}

// ============================================================================
// FAQPage Schema
// ============================================================================

export function generateFAQSchema(
  faqs: FAQItem[]
): WithContext<FAQPage> {
  return {
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
}

// ============================================================================
// BreadcrumbList Schema
// ============================================================================

interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(
  items: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// ============================================================================
// HowTo Schema
// ============================================================================

interface HowToStep {
  name: string
  text: string
  url?: string
  image?: string
}

interface HowToConfig {
  name: string
  description: string
  image?: string
  totalTime?: string
  estimatedCost?: { currency: string; value: string }
  supply?: string[]
  tool?: string[]
  step: HowToStep[]
}

export function generateHowToSchema(
  config: HowToConfig
): WithContext<HowTo> {
  const schema: WithContext<HowTo> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description
  }
  
  if (config.image) {
    schema.image = {
      '@type': 'ImageObject',
      url: config.image
    } as ImageObject
  }
  
  if (config.totalTime) {
    schema.totalTime = config.totalTime
  }
  
  if (config.estimatedCost) {
    schema.estimatedCost = {
      '@type': 'MonetaryAmount',
      currency: config.estimatedCost.currency,
      value: config.estimatedCost.value
    }
  }
  
  if (config.supply) {
    schema.supply = config.supply.map(s => ({
      '@type': 'HowToSupply',
      name: s
    }))
  }
  
  if (config.tool) {
    schema.tool = config.tool.map(t => ({
      '@type': 'HowToTool',
      name: t
    }))
  }
  
  schema.step = config.step.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    ...(step.url && { url: step.url }),
    ...(step.image && { 
      image: { '@type': 'ImageObject', url: step.image } as ImageObject 
    })
  }))
  
  return schema
}

// ============================================================================
// Review Schema
// ============================================================================

interface ReviewConfig {
  itemName: string
  itemImage?: string
  itemType?: string
  reviewRating: number
  bestRating?: number
  authorName: string
  reviewBody: string
  datePublished: string
  publisherName: string
}

export function generateReviewSchema(
  config: ReviewConfig
): WithContext<Review> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': config.itemType || 'Product',
      name: config.itemName,
      ...(config.itemImage && { image: config.itemImage })
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: config.reviewRating.toString(),
      bestRating: (config.bestRating || 5).toString()
    },
    author: {
      '@type': 'Person',
      name: config.authorName
    },
    reviewBody: config.reviewBody,
    datePublished: config.datePublished,
    publisher: {
      '@type': 'Organization',
      name: config.publisherName
    }
  }
}

// ============================================================================
// Course Schema
// ============================================================================

interface CourseConfig {
  name: string
  description: string
  providerName: string
  providerUrl?: string
  courseMode?: string
  courseWorkload?: string
  startDate?: string
  endDate?: string
  teaches?: string[]
  educationalLevel?: string
  timeRequired?: string
  numberOfStudents?: number
  ratingValue?: number
  reviewCount?: number
}

export function generateCourseSchema(
  config: CourseConfig
): WithContext<Course> {
  const schema: WithContext<Course> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: config.name,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: config.providerName,
      ...(config.providerUrl && { sameAs: config.providerUrl })
    }
  }
  
  if (config.courseMode || config.startDate) {
    schema.hasCourseInstance = {
      '@type': 'CourseInstance',
      ...(config.courseMode && { courseMode: config.courseMode }),
      ...(config.courseWorkload && { courseWorkload: config.courseWorkload }),
      ...(config.startDate && { startDate: config.startDate }),
      ...(config.endDate && { endDate: config.endDate })
    }
  }
  
  if (config.teaches) {
    schema.teaches = config.teaches
  }
  
  if (config.educationalLevel) {
    schema.educationalLevel = config.educationalLevel
  }
  
  if (config.timeRequired) {
    schema.timeRequired = config.timeRequired
  }
  
  if (config.numberOfStudents) {
    schema.numberOfStudents = config.numberOfStudents
  }
  
  if (config.ratingValue && config.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.ratingValue.toString(),
      reviewCount: config.reviewCount.toString()
    } as AggregateRating
  }
  
  return schema
}

// ============================================================================
// Person Schema
// ============================================================================

export function generatePersonSchema(
  author: Author
): WithContext<Person> {
  const schema: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    image: author.photo,
    knowsAbout: author.expertise
  }
  
  if (author.sameAs && author.sameAs.length > 0) {
    schema.sameAs = author.sameAs
  }
  
  if (author.publications && author.publications.length > 0) {
    // Note: schema-dts may not have direct publication support
    // This would need custom handling based on schema version
  }
  
  return schema
}

// ============================================================================
// Combined Schema (WebPage with multiple entities)
// ============================================================================

export function generateCombinedSchema(
  schemas: Array<{ type: string; data: unknown }>
): string {
  const graph = schemas.map(schema => ({
    '@context': 'https://schema.org',
    '@type': schema.type,
    ...schema.data
  }))
  
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  })
}
