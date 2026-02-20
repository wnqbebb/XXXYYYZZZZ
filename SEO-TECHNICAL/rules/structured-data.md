---
name: seo-structured-data
description: Schema.org structured data implementation with JSON-LD for rich snippets. Load when adding structured data.
metadata:
  tags: seo, structured-data, schema-org, json-ld, rich-snippets, schema-dts
---

# Structured Data & Schema.org Rules

## MUST: Basic JSON-LD Setup

```tsx
// app/page.tsx
import { WebSite, WithContext } from 'schema-dts'

export default function HomePage() {
  const websiteSchema: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Nombre del Sitio',
    url: 'https://tusitio.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://tusitio.com/buscar?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* Content */}
    </>
  )
}
```

### WHY: JSON-LD Over Microdata

```yaml
JSON-LD Advantages:
  - Cleaner HTML separation
  - Easier to maintain
  - Better for dynamic content
  - Google's preferred format
  - TypeScript support with schema-dts
  
Placement:
  - In <head> or <body>
  - Multiple schemas per page allowed
  - Related schemas can be nested
```

---

## MUST: Organization Schema

```tsx
import { Organization, WithContext } from 'schema-dts'

const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nombre de la Empresa',
  alternateName: 'Nombre Corto o Acrónimo',
  url: 'https://tusitio.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://tusitio.com/logo.png',
    width: 512,
    height: 512
  },
  description: 'Descripción de la empresa',
  foundingDate: '2020',
  sameAs: [
    'https://facebook.com/tuempresa',
    'https://twitter.com/tuempresa',
    'https://linkedin.com/company/tuempresa',
    'https://instagram.com/tuempresa'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+34-900-000-000',
    contactType: 'customer service',
    availableLanguage: ['Spanish', 'English'],
    areaServed: 'ES'
  }
}
```

---

## MUST: LocalBusiness Schema

```tsx
import { LocalBusiness, WithContext } from 'schema-dts'

const localBusinessSchema: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness', // Or specific: Restaurant, Dentist, etc.
  name: 'Nombre del Negocio',
  image: [
    'https://tusitio.com/foto1.jpg',
    'https://tusitio.com/foto2.jpg'
  ],
  '@id': 'https://tusitio.com',
  url: 'https://tusitio.com',
  telephone: '+34-900-000-000',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle Principal 123',
    addressLocality: 'Madrid',
    addressRegion: 'Madrid',
    postalCode: '28001',
    addressCountry: 'ES'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 40.4168,
    longitude: -3.7038
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '10:00',
      closes: '14:00'
    }
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: '127'
  }
}
```

### WHY: LocalBusiness Specific Types

```yaml
Use specific types when applicable:
  - Restaurant
  - Dentist
  - Doctor
  - Pharmacy
  - Hospital
  - Attorney
  - RealEstateAgent
  - Store
  - AutoRepair
  - BeautySalon
  - CafeOrCoffeeShop
  - FastFoodRestaurant
  - Hotel
  - NightClub
  - TravelAgency
  
Benefits:
  - Better local pack visibility
  - Industry-specific rich snippets
  - Voice search optimization
```

---

## MUST: Product Schema

```tsx
import { Product, WithContext } from 'schema-dts'

const productSchema: WithContext<Product> = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Nombre del Producto',
  image: [
    'https://tusitio.com/producto-1.jpg',
    'https://tusitio.com/producto-2.jpg',
    'https://tusitio.com/producto-3.jpg'
  ],
  description: 'Descripción detallada del producto con keywords naturales.',
  sku: 'SKU-12345',
  brand: {
    '@type': 'Brand',
    name: 'Marca del Producto'
  },
  gtin13: '1234567890123', // EAN/UPC
  mpn: 'MPN-ABC123', // Manufacturer Part Number
  
  // Offers
  offers: {
    '@type': 'Offer',
    url: 'https://tusitio.com/producto',
    priceCurrency: 'EUR',
    price: '99.99',
    priceValidUntil: '2026-12-31',
    availability: 'https://schema.org/InStock',
    itemCondition: 'https://schema.org/NewCondition',
    seller: {
      '@type': 'Organization',
      name: 'Tu Tienda'
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '5.99',
        currency: 'EUR'
      },
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'ES'
      }
    },
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/FreeReturn'
    }
  },
  
  // Reviews
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.5',
    reviewCount: '128',
    bestRating: '5',
    worstRating: '1'
  },
  
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'María García'
      },
      datePublished: '2026-01-15',
      reviewBody: 'Excelente producto, superó mis expectativas.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5'
      }
    }
  ]
}
```

---

## MUST: Article & BlogPosting Schema

```tsx
import { BlogPosting, WithContext } from 'schema-dts'

const articleSchema: WithContext<BlogPosting> = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting', // Or: Article, NewsArticle
  headline: 'Título del Artículo (máx 110 chars)',
  description: 'Resumen del artículo para rich snippets.',
  image: [
    'https://tusitio.com/articulo-16x9.jpg',
    'https://tusitio.com/articulo-4x3.jpg',
    'https://tusitio.com/articulo-1x1.jpg'
  ],
  datePublished: '2026-01-15T08:00:00+01:00',
  dateModified: '2026-01-20T10:30:00+01:00',
  author: {
    '@type': 'Person',
    name: 'Nombre del Autor',
    url: 'https://tusitio.com/autor/nombre',
    image: 'https://tusitio.com/autor/foto.jpg',
    jobTitle: 'SEO Specialist',
    worksFor: {
      '@type': 'Organization',
      name: 'Tu Empresa'
    }
  },
  publisher: {
    '@type': 'Organization',
    name: 'Tu Empresa',
    logo: {
      '@type': 'ImageObject',
      url: 'https://tusitio.com/logo.png'
    }
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://tusitio.com/blog/articulo'
  },
  keywords: ['seo', 'marketing digital', '2026'],
  articleSection: 'SEO',
  wordCount: 1500
}
```

### WHY: Author E-E-A-T Signals

```yaml
Author Schema Importance:
  - Establishes Expertise
  - Builds Authority
  - Creates Trust
  - Critical for YMYL content
  
Required for:
  - Health content
  - Financial advice
  - Legal information
  - News articles
  - Educational content
```

---

## MUST: FAQPage Schema

```tsx
import { FAQPage, WithContext } from 'schema-dts'

const faqSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es el SEO técnico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El SEO técnico son las optimizaciones en el backend de tu sitio web que ayudan a los motores de búsqueda a rastrear, indexar y entender tu contenido eficientemente.'
      }
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo tarda el SEO en funcionar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Los resultados de SEO generalmente se ven entre 3-6 meses, dependiendo de la competencia, la autoridad del dominio y la calidad de la implementación.'
      }
    }
  ]
}
```

### WHY: FAQ Schema Benefits

```yaml
Benefits:
  - Rich snippet with expandable Q&A
  - Voice search optimization
  - People Also Ask eligibility
  - Higher CTR in SERPs
  
Guidelines:
  - Questions must be on the page
  - Answers must be complete
  - No promotional content
  - One FAQPage per page maximum
```

---

## MUST: BreadcrumbList Schema

```tsx
import { BreadcrumbList, WithContext } from 'schema-dts'

const breadcrumbSchema: WithContext<BreadcrumbList> = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://tusitio.com'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Categoría',
      item: 'https://tusitio.com/categoria'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Producto Actual',
      item: 'https://tusitio.com/categoria/producto'
    }
  ]
}
```

---

## MUST: HowTo Schema

```tsx
import { HowTo, WithContext } from 'schema-dts'

const howToSchema: WithContext<HowTo> = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo optimizar imágenes para SEO',
  description: 'Guía paso a paso para optimizar imágenes y mejorar el rendimiento web.',
  image: {
    '@type': 'ImageObject',
    url: 'https://tusitio.com/howto-image.jpg'
  },
  totalTime: 'PT30M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: '0'
  },
  supply: [
    { '@type': 'HowToSupply', name: 'Imágenes originales' },
    { '@type': 'HowToSupply', name: 'Software de edición' }
  ],
  tool: [
    { '@type': 'HowToTool', name: 'Photoshop o GIMP' },
    { '@type': 'HowToTool', name: 'Compressor.io' }
  ],
  step: [
    {
      '@type': 'HowToStep',
      name: 'Redimensionar imágenes',
      text: 'Ajusta las imágenes al tamaño máximo que se mostrará.',
      url: 'https://tusitio.com/guia#step1',
      image: 'https://tusitio.com/step1.jpg'
    },
    {
      '@type': 'HowToStep',
      name: 'Comprimir',
      text: 'Usa compresión sin pérdida para reducir el tamaño.',
      url: 'https://tusitio.com/guia#step2',
      image: 'https://tusitio.com/step2.jpg'
    }
  ]
}
```

---

## MUST: Review Schema

```tsx
import { Review, WithContext } from 'schema-dts'

const reviewSchema: WithContext<Review> = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: {
    '@type': 'Product',
    name: 'Nombre del Producto',
    image: 'https://tusitio.com/producto.jpg'
  },
  reviewRating: {
    '@type': 'Rating',
    ratingValue: '5',
    bestRating: '5',
    worstRating: '1'
  },
  author: {
    '@type': 'Person',
    name: 'Nombre del Reviewer'
  },
  reviewBody: 'Texto detallado de la reseña...',
  datePublished: '2026-01-15',
  publisher: {
    '@type': 'Organization',
    name: 'Tu Sitio'
  }
}
```

---

## MUST: Course Schema (For E-learning)

```tsx
import { Course, WithContext } from 'schema-dts'

const courseSchema: WithContext<Course> = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Curso de SEO Avanzado 2026',
  description: 'Domina el SEO técnico y posiciona cualquier sitio web.',
  provider: {
    '@type': 'Organization',
    name: 'Tu Academia',
    sameAs: 'https://tuacademia.com'
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: 'PT40H',
    inLanguage: 'es',
    startDate: '2026-02-01',
    endDate: '2026-03-15'
  },
  teaches: [
    'SEO técnico',
    'Link building',
    'Content marketing'
  ],
  educationalLevel: 'Advanced',
  timeRequired: 'PT40H',
  numberOfStudents: 1500,
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '324'
  }
}
```

---

## FORBIDDEN: Structured Data Anti-patterns

```yaml
FORBIDDEN:
  Invalid JSON-LD:
    WRONG: Trailing commas, unescaped quotes
    WHY: Schema won't be parsed
    RIGHT: Validate with Schema Markup Validator
    
  Mismatched content:
    WRONG: Schema says "In Stock" but page shows "Out of Stock"
    WHY: Manual action risk from Google
    RIGHT: Keep schema in sync with actual content
    
  Fake reviews:
    WRONG: Invented reviewCount or ratingValue
    WHY: Violates guidelines, penalty risk
    RIGHT: Only real reviews from actual customers
    
  Multiple main entities:
    WRONG: Two Product schemas for different products on same page
    WHY: Confuses search engines
    RIGHT: One main entity per page, related entities nested
    
  Missing required properties:
    WRONG: Product without offers or aggregateRating
    WHY: Won't show rich snippets
    RIGHT: Include all required properties per schema type
    
  Hidden content:
    WRONG: Schema for content not visible to users
    WHY: Against guidelines
    RIGHT: Schema must represent visible content
```

---

## MUST: Schema Testing & Validation

```yaml
Validation Tools:
  Google Rich Results Test:
    URL: https://search.google.com/test/rich-results
    Purpose: Test rich snippet eligibility
    
  Schema Markup Validator:
    URL: https://validator.schema.org/
    Purpose: Validate syntax and structure
    
  Google Search Console:
    - Enhancements report
    - Rich results status
    - Structured data errors

Best Practices:
  - Test every schema before deployment
  - Monitor GSC for errors
  - Fix warnings (not just errors)
  - Keep schemas updated
```

---

**Structured data implemented. Rich snippets ready. AI search optimized.**
