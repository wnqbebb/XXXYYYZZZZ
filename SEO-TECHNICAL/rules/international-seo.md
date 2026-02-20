---
name: seo-international
description: International SEO and hreflang implementation for multi-language sites. Load when building i18n sites.
metadata:
  tags: seo, international, hreflang, i18n, multilingual, localization, geo-targeting
---

# International SEO Rules

## MUST: Next.js i18n Configuration

```typescript
// next.config.js
module.exports = {
  i18n: {
    // Supported locales
    locales: ['es', 'en', 'pt', 'fr', 'de'],
    
    // Default locale
    defaultLocale: 'es',
    
    // Locale detection
    localeDetection: true,
    
    // Domains for specific locales (optional)
    domains: [
      {
        domain: 'example.es',
        defaultLocale: 'es'
      },
      {
        domain: 'example.com',
        defaultLocale: 'en'
      },
      {
        domain: 'example.pt',
        defaultLocale: 'pt'
      }
    ]
  }
}
```

### WHY: Locale Strategy

```yaml
URL Structure Options:
  Subdirectory (Recommended):
    - example.com/es/
    - example.com/en/
    - Pros: Easy maintenance, consolidated authority
    - Cons: Single server location
    
  Subdomain:
    - es.example.com
    - en.example.com
    - Pros: Geo-targeting flexibility
    - Cons: Authority dilution
    
  ccTLD:
    - example.es
    - example.com
    - Pros: Strong geo-signals
    - Cons: Expensive, complex maintenance
```

---

## MUST: Hreflang Implementation

```tsx
// app/[lang]/layout.tsx
import type { Metadata } from 'next'

interface LayoutProps {
  children: React.ReactNode
  params: { lang: string }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { lang } = params
  
  // Define all language variants
  const languages = {
    'es': 'https://tusitio.com/es',
    'en': 'https://tusitio.com/en',
    'pt': 'https://tusitio.com/pt',
    'fr': 'https://tusitio.com/fr',
    'de': 'https://tusitio.com/de'
  }
  
  // Current page variants
  const path = '' // Dynamic based on current route
  const alternates: Record<string, string> = {}
  
  Object.entries(languages).forEach(([locale, baseUrl]) => {
    alternates[locale] = `${baseUrl}${path}`
  })
  
  // Add x-default
  alternates['x-default'] = languages['es']
  
  return {
    alternates: {
      canonical: `${languages[lang]}${path}`,
      languages: alternates
    }
  }
}
```

### MUST: Hreflang with Region Codes

```tsx
// More specific targeting with regions
const languages = {
  // Spanish variants
  'es-ES': 'https://tusitio.com/es',        // Spain
  'es-MX': 'https://tusitio.com/es-mx',     // Mexico
  'es-AR': 'https://tusitio.com/es-ar',     // Argentina
  'es-CO': 'https://tusitio.com/es-co',     // Colombia
  
  // English variants
  'en-US': 'https://tusitio.com/en',        // USA
  'en-GB': 'https://tusitio.com/en-gb',     // UK
  'en-CA': 'https://tusitio.com/en-ca',     // Canada
  'en-AU': 'https://tusitio.com/en-au',     // Australia
  
  // Portuguese variants
  'pt-BR': 'https://tusitio.com/pt',        // Brazil
  'pt-PT': 'https://tusitio.com/pt-pt',     // Portugal
  
  // x-default for unmatched users
  'x-default': 'https://tusitio.com'
}
```

### WHY: Hreflang Rules

```yaml
Critical Rules:
  - Every page must have self-referencing hreflang
  - All variants must link to each other (reciprocal)
  - Use x-default for unmatched languages
  - Include protocol (https://)
  - Use correct language-region format
  
Common Mistakes:
  - Missing return links
  - Incorrect language codes
  - Forgetting self-reference
  - Using underscores instead of hyphens
  - Omitting x-default
```

---

## MUST: Sitemap for Multi-language

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'

const BASE_URL = 'https://tusitio.com'
const LOCALES = ['es', 'en', 'pt', 'fr', 'de']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all pages
  const pages = await getAllPages()
  
  const sitemapEntries: MetadataRoute.Sitemap = []
  
  // Generate entries for each locale
  pages.forEach((page) => {
    LOCALES.forEach((locale) => {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page.path}`,
        lastModified: page.lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        // Alternative language links in sitemap
        links: LOCALES.map((altLocale) => ({
          lang: altLocale,
          url: `${BASE_URL}/${altLocale}${page.path}`
        }))
      })
    })
  })
  
  return sitemapEntries
}
```

---

## MUST: Language Switcher Component

```tsx
// components/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
]

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1] || 'es'
  
  // Get path without locale
  const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/'
  
  return (
    <nav aria-label="Language selector">
      <ul className="language-switcher">
        {languages.map((lang) => {
          const isActive = lang.code === currentLocale
          
          return (
            <li key={lang.code}>
              {isActive ? (
                <span 
                  className="active"
                  aria-current="true"
                >
                  <span aria-hidden="true">{lang.flag}</span>
                  <span className="sr-only">{lang.name} (current)</span>
                </span>
              ) : (
                <Link
                  href={`/${lang.code}${pathWithoutLocale}`}
                  hrefLang={lang.code}
                  rel="alternate"
                  lang={lang.code}
                >
                  <span aria-hidden="true">{lang.flag}</span>
                  <span className="sr-only">{lang.name}</span>
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

---

## MUST: Localized Metadata

```typescript
// lib/i18n/metadata.ts
export const localizedMetadata = {
  es: {
    title: 'Título en Español',
    description: 'Descripción en español para SEO',
    keywords: ['palabra clave 1', 'palabra clave 2']
  },
  en: {
    title: 'Title in English',
    description: 'English description for SEO',
    keywords: ['keyword 1', 'keyword 2']
  },
  pt: {
    title: 'Título em Português',
    description: 'Descrição em português para SEO',
    keywords: ['palavra-chave 1', 'palavra-chave 2']
  }
}

// app/[lang]/page.tsx
import { localizedMetadata } from '@/lib/i18n/metadata'
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { lang } = params
  const meta = localizedMetadata[lang]
  
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      locale: lang === 'es' ? 'es_ES' : 
              lang === 'en' ? 'en_US' : 
              lang === 'pt' ? 'pt_BR' : lang
    }
  }
}
```

---

## MUST: Localized Structured Data

```tsx
// components/LocalizedSchema.tsx
import { Organization, WithContext } from 'schema-dts'

interface LocalizedSchemaProps {
  locale: string
}

const localizedData = {
  es: {
    name: 'Nombre de la Empresa',
    description: 'Descripción en español',
    address: {
      country: 'España',
      locality: 'Madrid'
    }
  },
  en: {
    name: 'Company Name',
    description: 'Description in English',
    address: {
      country: 'United States',
      locality: 'New York'
    }
  }
}

export function LocalizedSchema({ locale }: LocalizedSchemaProps) {
  const data = localizedData[locale]
  
  const schema: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    description: data.description,
    url: `https://tusitio.com/${locale}`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: data.address.country,
      addressLocality: data.address.locality
    }
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
```

---

## MUST: Geo-Targeting Configuration

```typescript
// Google Search Console Geo-Targeting
// Set in GSC for each property

const geoTargeting = {
  'example.es': 'Spain',
  'example.com': 'Unlisted (International)',
  'example.co.uk': 'United Kingdom',
  'example.com.br': 'Brazil'
}

// Hreflang with geo-targeting
const hreflangConfig = {
  // Language-only for international English
  'en': {
    href: 'https://example.com/en',
    geo: null // International
  },
  
  // Language-region for specific targeting
  'en-US': {
    href: 'https://example.com/en-us',
    geo: 'US'
  },
  'en-GB': {
    href: 'https://example.com/en-gb',
    geo: 'GB'
  },
  
  // Default language with region
  'es-ES': {
    href: 'https://example.com/es',
    geo: 'ES'
  },
  'es-MX': {
    href: 'https://example.com/es-mx',
    geo: 'MX'
  }
}
```

---

## MUST: Content Localization Best Practices

```yaml
Beyond Translation:
  - Currency adaptation
  - Date format localization
  - Phone number formatting
  - Address formatting
  - Units of measurement
  - Cultural references
  - Local regulations (GDPR, CCPA)
  - Local payment methods
  - Local shipping options

Technical Considerations:
  - RTL language support (Arabic, Hebrew)
  - Character encoding (UTF-8)
  - Font support for all languages
  - Text expansion (German 30% longer)
  - URL slug localization
  - Image alt text translation
```

---

## MUST: Regional Sitemaps

```typescript
// Separate sitemaps per region
// app/sitemap-es.xml/route.ts
export async function GET() {
  const pages = await getPagesByLocale('es')
  
  return getServerSideSitemap(
    pages.map(page => ({
      loc: `https://tusitio.com/es${page.path}`,
      lastModified: page.updatedAt,
      alternates: [
        { lang: 'es', href: `https://tusitio.com/es${page.path}` },
        { lang: 'en', href: `https://tusitio.com/en${page.path}` },
        { lang: 'x-default', href: `https://tusitio.com/es${page.path}` }
      ]
    }))
  )
}

// Sitemap index
// app/sitemap-index.xml/route.ts
export async function GET() {
  return getServerSideSitemapIndex([
    'https://tusitio.com/sitemap-es.xml',
    'https://tusitio.com/sitemap-en.xml',
    'https://tusitio.com/sitemap-pt.xml'
  ])
}
```

---

## FORBIDDEN: International SEO Anti-patterns

```yaml
FORBIDDEN:
  Automatic IP-based redirects:
    WRONG: Redirect based on IP without consent
    WHY: Bad UX, search engine confusion
    RIGHT: Suggest language, let user choose
    
  Mixed language content:
    WRONG: Page mostly Spanish with English navigation
    WHY: Confuses users and search engines
    RIGHT: Complete translation per page
    
  Missing hreflang on all pages:
    WRONG: Only homepage has hreflang
    WHY: Indexing issues for other pages
    RIGHT: Every page needs hreflang
    
  Using flags for languages:
    WRONG: 🇧🇷 for Portuguese (excludes Portugal)
    WHY: Political sensitivity, confusion
    RIGHT: Language names or neutral icons
    
  Duplicate content across locales:
    WRONG: Same English content on /en and /en-gb
    WHY: Cannibalization
    RIGHT: Localize or canonical to one version
    
  Ignoring local search engines:
    WRONG: Only optimizing for Google
    WHY: Miss Baidu (China), Yandex (Russia), Naver (Korea)
    RIGHT: Optimize for local search engines
```

---

## MUST: International SEO Checklist

```yaml
Pre-Launch:
  - [ ] Hreflang on all pages
  - [ ] Self-referencing canonicals
  - [ ] XML sitemaps per locale
  - [ ] Localized metadata
  - [ ] Localized structured data
  - [ ] Language switcher implemented
  - [ ] RTL support if needed
  - [ ] Local currency/pricing
  - [ ] Local contact information
  
Post-Launch:
  - [ ] GSC properties for each locale
  - [ ] Geo-targeting configured
  - [ ] hreflang errors monitored
  - [ ] Local backlink building
  - [ ] Local content marketing
  - [ ] Local social media presence
```

---

**International SEO configured. Global reach enabled. Multi-language optimized.**
