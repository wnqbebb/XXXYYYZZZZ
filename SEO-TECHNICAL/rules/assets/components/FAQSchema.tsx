'use client'

import { useState } from 'react'
import { FAQJsonLd } from './JsonLd'

interface FAQ {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQ[]
  title?: string
  showSchema?: boolean
  collapsible?: boolean
  className?: string
}

/**
 * FAQ Component with Schema.org structured data
 * 
 * Displays FAQs with optional accordion functionality and
 * automatically includes FAQPage schema.
 * 
 * @example
 * <FAQSchema
 *   title="Preguntas frecuentes"
 *   faqs={[
 *     { question: '¿Qué es SEO?', answer: 'SEO es...' },
 *     { question: '¿Cuánto cuesta?', answer: 'Depende de...' }
 *   ]}
 * />
 */
export function FAQSchema({
  faqs,
  title = 'Preguntas frecuentes',
  showSchema = true,
  collapsible = true,
  className = ''
}: FAQSchemaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  
  const toggleFAQ = (index: number) => {
    if (collapsible) {
      setOpenIndex(openIndex === index ? null : index)
    }
  }
  
  return (
    <>
      {showSchema && <FAQJsonLd faqs={faqs} />}
      
      <section 
        className={`faq-section ${className}`}
        itemScope 
        itemType="https://schema.org/FAQPage"
      >
        {title && (
          <h2 className="text-2xl font-bold mb-6">{title}</h2>
        )}
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item border rounded-lg overflow-hidden"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
            >
              {collapsible ? (
                <button
                  className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 
                    className="font-semibold text-lg pr-4"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                  <span 
                    className={`transform transition-transform ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>
              ) : (
                <h3 
                  className="font-semibold text-lg p-4 bg-gray-50"
                  itemProp="name"
                >
                  {faq.question}
                </h3>
              )}
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  collapsible && openIndex !== index 
                    ? 'max-h-0' 
                    : 'max-h-screen'
                }`}
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
              >
                <div 
                  className="p-4 prose max-w-none"
                  itemProp="text"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

/**
 * Simple FAQ list without accordion
 */
interface SimpleFAQProps {
  faqs: FAQ[]
  title?: string
  showSchema?: boolean
}

export function SimpleFAQ({ faqs, title, showSchema = true }: SimpleFAQProps) {
  return (
    <FAQSchema
      faqs={faqs}
      title={title}
      showSchema={showSchema}
      collapsible={false}
    />
  )
}

/**
 * Product FAQ - Specific for product pages
 */
interface ProductFAQProps {
  productName: string
  faqs?: FAQ[]
}

export function ProductFAQ({ productName, faqs }: ProductFAQProps) {
  const defaultFAQs: FAQ[] = [
    {
      question: `¿Qué incluye ${productName}?`,
      answer: 'El producto incluye todos los accesorios mencionados en la descripción. Consulta la sección "Contenido del paquete" para más detalles.'
    },
    {
      question: `¿Cuál es la garantía de ${productName}?`,
      answer: 'Todos nuestros productos incluyen garantía de 2 años contra defectos de fabricación. También ofrecemos garantía extendida opcional.'
    },
    {
      question: '¿Cuánto tarda el envío?',
      answer: 'El envío estándar tarda 3-5 días hábiles. Disponemos de envío express 24h para pedidos realizados antes de las 14:00.'
    },
    {
      question: '¿Puedo devolver el producto?',
      answer: 'Sí, dispones de 30 días para devoluciones sin preguntas. El producto debe estar en su embalaje original y en perfecto estado.'
    }
  ]
  
  const productFAQs = faqs || defaultFAQs
  
  return (
    <FAQSchema
      title={`Preguntas sobre ${productName}`}
      faqs={productFAQs}
    />
  )
}

/**
 * Service FAQ - Specific for service pages
 */
interface ServiceFAQProps {
  serviceName: string
  faqs?: FAQ[]
}

export function ServiceFAQ({ serviceName, faqs }: ServiceFAQProps) {
  const defaultFAQs: FAQ[] = [
    {
      question: `¿Cómo funciona ${serviceName}?`,
      answer: `Nuestro servicio de ${serviceName} está diseñado para ser simple y efectivo. Contacta con nosotros para una consulta gratuita y te explicaremos todo el proceso paso a paso.`
    },
    {
      question: '¿Cuál es el precio?',
      answer: 'El precio varía según tus necesidades específicas. Ofrecemos presupuestos personalizados sin compromiso. Contacta con nosotros para más información.'
    },
    {
      question: '¿Cuánto tiempo tarda?',
      answer: 'Los plazos dependen del alcance del proyecto. Tras la consulta inicial, te proporcionaremos un cronograma detallado con hitos claros.'
    },
    {
      question: '¿Ofrecen garantía?',
      answer: 'Sí, todos nuestros servicios incluyen garantía de satisfacción. Si no estás satisfecho, trabajaremos contigo hasta conseguir los resultados esperados.'
    }
  ]
  
  const serviceFAQs = faqs || defaultFAQs
  
  return (
    <FAQSchema
      title={`Preguntas sobre ${serviceName}`}
      faqs={serviceFAQs}
    />
  )
}
