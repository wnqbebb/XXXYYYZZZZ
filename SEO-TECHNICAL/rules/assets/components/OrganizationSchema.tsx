'use client'

import { OrganizationJsonLd, LocalBusinessJsonLd } from './JsonLd'

interface OrganizationData {
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

interface OrganizationSchemaProps {
  organization: OrganizationData
  showSchema?: boolean
  children?: React.ReactNode
}

/**
 * Organization Component with Schema.org
 * 
 * Displays organization information with structured data.
 * 
 * @example
 * <OrganizationSchema
 *   organization={{
 *     name: 'Mi Empresa',
 *     url: 'https://miempresa.com',
 *     logo: 'https://miempresa.com/logo.png',
 *     sameAs: ['https://facebook.com/miempresa']
 *   }}
 * />
 */
export function OrganizationSchema({
  organization,
  showSchema = true,
  children
}: OrganizationSchemaProps) {
  return (
    <>
      {showSchema && <OrganizationJsonLd {...organization} />}
      
      <div className="organization-info" itemScope itemType="https://schema.org/Organization">
        <meta itemProp="name" content={organization.name} />
        <link itemProp="url" href={organization.url} />
        <meta itemProp="logo" content={organization.logo} />
        
        {organization.description && (
          <meta itemProp="description" content={organization.description} />
        )}
        
        {organization.sameAs?.map((url, index) => (
          <link key={index} itemProp="sameAs" href={url} />
        ))}
        
        {children}
      </div>
    </>
  )
}

interface LocalBusinessData {
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

interface LocalBusinessSchemaProps {
  business: LocalBusinessData
  showSchema?: boolean
  showCard?: boolean
}

/**
 * Local Business Component with Schema.org
 * 
 * Displays local business information with structured data
 * and optional visual card.
 */
export function LocalBusinessSchema({
  business,
  showSchema = true,
  showCard = true
}: LocalBusinessSchemaProps) {
  const formatDays = (days: string[]) => {
    const dayNames: Record<string, string> = {
      'Monday': 'Lun',
      'Tuesday': 'Mar',
      'Wednesday': 'Mié',
      'Thursday': 'Jue',
      'Friday': 'Vie',
      'Saturday': 'Sáb',
      'Sunday': 'Dom'
    }
    
    if (days.length === 7) return 'Lunes a Domingo'
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) {
      return 'Lunes a Viernes'
    }
    
    return days.map(d => dayNames[d] || d).join(', ')
  }
  
  return (
    <>
      {showSchema && <LocalBusinessJsonLd {...business} />}
      
      {showCard && (
        <div 
          className="local-business-card bg-white rounded-lg shadow-md p-6"
          itemScope 
          itemType="https://schema.org/LocalBusiness"
        >
          <meta itemProp="@type" content={business.type || 'LocalBusiness'} />
          
          <h2 className="text-2xl font-bold mb-2" itemProp="name">
            {business.name}
          </h2>
          
          <p className="text-gray-600 mb-4" itemProp="description">
            {business.description}
          </p>
          
          <div className="space-y-3">
            {/* Address */}
            <div 
              className="flex items-start gap-3"
              itemProp="address" 
              itemScope 
              itemType="https://schema.org/PostalAddress"
            >
              <span className="text-xl">📍</span>
              <div>
                <span itemProp="streetAddress">{business.address.street}</span>
                <br />
                <span itemProp="postalCode">{business.address.postalCode}</span>{' '}
                <span itemProp="addressLocality">{business.address.city}</span>
                <br />
                <span itemProp="addressRegion">{business.address.region}</span>,{' '}
                <span itemProp="addressCountry">{business.address.country}</span>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <a 
                href={`tel:${business.telephone}`}
                itemProp="telephone"
                className="text-blue-600 hover:underline"
              >
                {business.telephone}
              </a>
            </div>
            
            {/* Email */}
            {business.email && (
              <div className="flex items-center gap-3">
                <span className="text-xl">✉️</span>
                <a 
                  href={`mailto:${business.email}`}
                  itemProp="email"
                  className="text-blue-600 hover:underline"
                >
                  {business.email}
                </a>
              </div>
            )}
            
            {/* Website */}
            <div className="flex items-center gap-3">
              <span className="text-xl">🌐</span>
              <a 
                href={business.url}
                itemProp="url"
                className="text-blue-600 hover:underline"
              >
                {business.url.replace(/^https?:\/\//, '')}
              </a>
            </div>
            
            {/* Opening Hours */}
            {business.openingHours && (
              <div className="flex items-start gap-3">
                <span className="text-xl">🕒</span>
                <div>
                  <h3 className="font-semibold mb-1">Horario</h3>
                  {business.openingHours.map((hours, index) => (
                    <div 
                      key={index}
                      itemProp="openingHoursSpecification" 
                      itemScope 
                      itemType="https://schema.org/OpeningHoursSpecification"
                    >
                      <meta itemProp="dayOfWeek" content={hours.days.join(', ')} />
                      <span className="text-gray-600">
                        {formatDays(hours.days)}:{' '}
                      </span>
                      <time itemProp="opens" content={hours.opens}>
                        {hours.opens}
                      </time>
                      {' - '}
                      <time itemProp="closes" content={hours.closes}>
                        {hours.closes}
                      </time>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Rating */}
            {business.rating && (
              <div 
                className="flex items-center gap-3"
                itemProp="aggregateRating" 
                itemScope 
                itemType="https://schema.org/AggregateRating"
              >
                <span className="text-xl">⭐</span>
                <div>
                  <meta itemProp="ratingValue" content={business.rating.value.toString()} />
                  <meta itemProp="reviewCount" content={business.rating.count.toString()} />
                  <span className="font-bold">{business.rating.value}</span>
                  <span className="text-gray-600"> / 5</span>
                  <span className="text-gray-500 ml-2">
                    ({business.rating.count} reseñas)
                  </span>
                </div>
              </div>
            )}
            
            {/* Price Range */}
            {business.priceRange && (
              <div className="flex items-center gap-3">
                <span className="text-xl">💰</span>
                <span itemProp="priceRange">{business.priceRange}</span>
              </div>
            )}
          </div>
          
          {/* Geo coordinates (hidden) */}
          {business.geo && (
            <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
              <meta itemProp="latitude" content={business.geo.latitude.toString()} />
              <meta itemProp="longitude" content={business.geo.longitude.toString()} />
            </div>
          )}
        </div>
      )}
    </>
  )
}

/**
 * Footer Organization Info
 * 
 * Compact organization info for footer with schema markup.
 */
interface FooterOrganizationProps {
  name: string
  address?: string
  telephone?: string
  email?: string
  sameAs?: string[]
}

export function FooterOrganization({
  name,
  address,
  telephone,
  email,
  sameAs
}: FooterOrganizationProps) {
  return (
    <div itemScope itemType="https://schema.org/Organization">
      <meta itemProp="name" content={name} />
      
      {address && (
        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">{address}</span>
        </div>
      )}
      
      {telephone && (
        <a href={`tel:${telephone}`} itemProp="telephone">
          {telephone}
        </a>
      )}
      
      {email && (
        <a href={`mailto:${email}`} itemProp="email">
          {email}
        </a>
      )}
      
      {sameAs?.map((url, index) => (
        <link key={index} itemProp="sameAs" href={url} />
      ))}
    </div>
  )
}
