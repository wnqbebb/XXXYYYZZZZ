---
name: seo-content-optimization
description: Content optimization for E-E-A-T, semantic SEO, and user intent. Load when creating or optimizing content.
metadata:
  tags: seo, content, ee-at, semantic-seo, user-intent, neil-patel, content-strategy
---

# Content Optimization Rules

## MUST: E-E-A-T Framework

```yaml
E-E-A-T Components:
  Experience:
    - First-hand experience with topic
    - Personal case studies
    - Real-world examples
    - Original research/data
    
  Expertise:
    - Author credentials
    - Professional background
    - Relevant education
    - Industry certifications
    
  Authoritativeness:
    - Industry recognition
    - Citations from other experts
    - Media mentions
    - Speaking engagements
    - Published works
    
  Trustworthiness:
    - Accurate information
    - Transparent sources
    - Regular updates
    - Clear authorship
    - Contact information
    - Privacy policy
    - Editorial standards
```

### MUST: Author Information Implementation

```tsx
// components/AuthorBox.tsx
export function AuthorBox({ author }) {
  return (
    <aside 
      className="author-box"
      itemScope 
      itemType="https://schema.org/Person"
    >
      <div className="author-header">
        <img 
          itemProp="image"
          src={author.photo} 
          alt={author.name}
          width="100"
          height="100"
        />
        <div className="author-info">
          <h3 itemProp="name">{author.name}</h3>
          <p itemProp="jobTitle">{author.title}</p>
          <p itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">{author.company}</span>
          </p>
        </div>
      </div>
      
      {/* Credentials */}
      <div className="author-credentials">
        <h4>Credentials</h4>
        <ul>
          {author.credentials.map((cred, i) => (
            <li key={i} itemProp="hasCredential">{cred}</li>
          ))}
        </ul>
      </div>
      
      {/* Expertise Areas */}
      <div className="author-expertise">
        <h4>Expertise</h4>
        <ul>
          {author.expertise.map((area, i) => (
            <li key={i} itemProp="knowsAbout">{area}</li>
          ))}
        </ul>
      </div>
      
      {/* Social Proof */}
      <div className="author-social">
        {author.social.map((link, i) => (
          <a 
            key={i}
            href={link.url}
            itemProp="sameAs"
            rel="noopener noreferrer"
          >
            {link.platform}
          </a>
        ))}
      </div>
      
      {/* Author Bio */}
      <p itemProp="description">{author.bio}</p>
    </aside>
  )
}
```

---

## MUST: Content Structure for SEO

```tsx
// ✅ DO: Semantic content structure
export function SEOptimizedArticle({ article }) {
  return (
    <article itemScope itemType="https://schema.org/Article">
      {/* Header with main entity */}
      <header>
        <h1 itemProp="headline">{article.title}</h1>
        <p className="article-summary" itemProp="description">
          {article.summary}
        </p>
        
        {/* Meta information */}
        <div className="article-meta">
          <time itemProp="datePublished" dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <time itemProp="dateModified" dateTime={article.updatedAt}>
            Actualizado: {formatDate(article.updatedAt)}
          </time>
          <span itemProp="wordCount">{article.wordCount} palabras</span>
        </div>
      </header>
      
      {/* Table of contents */}
      <nav aria-label="Table of contents">
        <h2>Contenido</h2>
        <ol>
          {article.sections.map((section, i) => (
            <li key={i}>
              <a href={`#section-${i + 1}`}>{section.heading}</a>
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Main content */}
      <div itemProp="articleBody">
        {article.sections.map((section, i) => (
          <section key={i} id={`section-${i + 1}`}>
            <h2>{section.heading}</h2>
            
            {/* Lead paragraph */}
            <p className="lead">{section.lead}</p>
            
            {/* Content with subheadings */}
            {section.subsections.map((sub, j) => (
              <div key={j}>
                <h3>{sub.heading}</h3>
                <div dangerouslySetInnerHTML={{ __html: sub.content }} />
                
                {/* Key takeaways */}
                {sub.keyPoints && (
                  <div className="key-points">
                    <h4>Puntos clave</h4>
                    <ul>
                      {sub.keyPoints.map((point, k) => (
                        <li key={k}>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
            
            {/* Visual break */}
            {section.image && (
              <figure>
                <img 
                  src={section.image.url}
                  alt={section.image.alt}
                  loading="lazy"
                />
                <figcaption>{section.image.caption}</figcaption>
              </figure>
            )}
          </section>
        ))}
      </div>
      
      {/* FAQ Section */}
      <section itemScope itemType="https://schema.org/FAQPage">
        <h2>Preguntas frecuentes</h2>
        {article.faqs.map((faq, i) => (
          <div 
            key={i}
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 itemProp="name">{faq.question}</h3>
            <div 
              itemScope
              itemProp="acceptedAnswer"
              itemType="https://schema.org/Answer"
            >
              <div itemProp="text">{faq.answer}</div>
            </div>
          </div>
        ))}
      </section>
      
      {/* References */}
      <footer>
        <h2>Referencias</h2>
        <ol>
          {article.references.map((ref, i) => (
            <li key={i}>
              <cite>
                <a href={ref.url} rel="nofollow noopener" target="_blank">
                  {ref.title}
                </a>
              </cite>
              <span>{ref.source}, {ref.date}</span>
            </li>
          ))}
        </ol>
      </footer>
    </article>
  )
}
```

---

## MUST: Semantic SEO Optimization

```yaml
Semantic SEO Principles:
  - Topic clusters over keyword stuffing
  - Entity relationships
  - Context and intent
  - Natural language processing
  - User-focused content
  
Implementation:
  - Use related terms and synonyms
  - Cover topic comprehensively
  - Answer related questions
  - Link to authoritative sources
  - Include relevant entities
```

### MUST: Topic Cluster Structure

```typescript
// Topic cluster model
interface TopicCluster {
  // Pillar page (broad topic)
  pillar: {
    title: string
    url: string
    content: string // Comprehensive overview
  }
  
  // Cluster content (specific subtopics)
  clusters: Array<{
    title: string
    url: string
    targetKeyword: string
    relatedTerms: string[]
    internalLinks: string[] // Links to other clusters
  }>
}

// Example: SEO Topic Cluster
const seoCluster: TopicCluster = {
  pillar: {
    title: 'Guía Completa de SEO 2026',
    url: '/guia-seo-completa',
    content: 'Todo sobre SEO...'
  },
  clusters: [
    {
      title: 'SEO Técnico: La Base del Posicionamiento',
      url: '/seo-tecnico',
      targetKeyword: 'seo técnico',
      relatedTerms: [
        'crawlability',
        'indexability',
        'core web vitals',
        'structured data'
      ],
      internalLinks: [
        '/guia-seo-completa',
        '/seo-on-page',
        '/core-web-vitals'
      ]
    },
    {
      title: 'SEO On-Page: Optimización de Contenido',
      url: '/seo-on-page',
      targetKeyword: 'seo on page',
      relatedTerms: [
        'optimización de títulos',
        'meta descripciones',
        'heading tags',
        'keyword density'
      ],
      internalLinks: [
        '/guia-seo-completa',
        '/seo-tecnico',
        '/content-optimization'
      ]
    }
  ]
}
```

---

## MUST: User Intent Optimization

```yaml
Search Intent Types:
  Informational:
    - "qué es", "cómo", "guía", "tutorial"
    - Goal: Learn something
    - Content: Comprehensive guides, explanations
    
  Navigational:
    - Brand names, specific sites
    - Goal: Find a specific page
    - Content: Clear navigation, brand presence
    
  Commercial:
    - "mejor", "top", "vs", "comparativa"
    - Goal: Research before buying
    - Content: Comparison tables, reviews
    
  Transactional:
    - "comprar", "precio", "descuento"
    - Goal: Make a purchase
    - Content: Product pages, clear CTAs
```

### MUST: Intent-Based Content

```tsx
// Content tailored to search intent
export function IntentBasedContent({ type, data }) {
  switch (type) {
    case 'informational':
      return (
        <article className="guide-content">
          <h1>Guía completa: {data.topic}</h1>
          <div className="guide-overview">
            <p>{data.overview}</p>
          </div>
          
          {/* Step-by-step */}
          <div className="steps">
            {data.steps.map((step, i) => (
              <section key={i}>
                <h2>{i + 1}. {step.title}</h2>
                <p>{step.explanation}</p>
                {step.image && <img src={step.image} alt={step.title} />}
              </section>
            ))}
          </div>
          
          {/* Summary */}
          <div className="summary">
            <h2>Resumen</h2>
            <ul>
              {data.keyTakeaways.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </article>
      )
      
    case 'commercial':
      return (
        <article className="comparison-content">
          <h1>Mejores {data.category}: Comparativa 2026</h1>
          
          {/* Quick comparison table */}
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Características</th>
                  <th>Valoración</th>
                </tr>
              </thead>
              <tbody>
                {data.products.map((product, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>
                    <td>{product.price}</td>
                    <td>{product.features}</td>
                    <td>{product.rating}/5</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Detailed reviews */}
          {data.products.map((product, i) => (
            <section key={i} className="product-review">
              <h2>{product.name}</h2>
              <div className="pros-cons">
                <div className="pros">
                  <h3>Pros</h3>
                  <ul>
                    {product.pros.map((pro, j) => (
                      <li key={j}>{pro}</li>
                    ))}
                  </ul>
                </div>
                <div className="cons">
                  <h3>Contras</h3>
                  <ul>
                    {product.cons.map((con, j) => (
                      <li key={j}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <a href={product.affiliateUrl} className="cta-button">
                Ver precio actual
              </a>
            </section>
          ))}
        </article>
      )
      
    case 'transactional':
      return (
        <div className="product-page">
          <h1>{data.product.name}</h1>
          <div className="product-info">
            <img src={data.product.image} alt={data.product.name} />
            <div className="details">
              <p className="price">{data.product.price}</p>
              <p className="description">{data.product.description}</p>
              <button className="buy-button">
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )
  }
}
```

---

## MUST: Content Freshness Strategy

```yaml
Content Update Schedule:
  Evergreen content:
    - Review: Every 6 months
    - Update: Statistics, examples, links
    - Add: New sections, FAQs
    
  Trending topics:
    - Review: Monthly
    - Update: Latest developments
    - Add: Current examples
    
  News/Current events:
    - Review: Weekly
    - Update: Latest information
    - Archive: When outdated
    
  Product reviews:
    - Review: Quarterly
    - Update: Prices, availability
    - Add: New products, remove discontinued
```

### MUST: Last Modified Implementation

```tsx
// Show last updated date prominently
export function LastUpdated({ date }) {
  return (
    <div className="last-updated">
      <time dateTime={date}>
        <span className="icon">🔄</span>
        Actualizado: {formatDate(date)}
      </time>
    </div>
  )
}

// In article
export function Article({ article }) {
  return (
    <article>
      <header>
        <LastUpdated date={article.updatedAt} />
        <h1>{article.title}</h1>
      </header>
      {/* ... */}
    </article>
  )
}
```

---

## MUST: Neil Patel Content Formulas

```yaml
Headline Formulas:
  How-to:
    - "Cómo [lograr resultado] en [tiempo]"
    - "Cómo [hacer algo] sin [problema común]"
    - Example: "Cómo posicionar en Google en 30 días"
    
  List:
    - "[Número] formas de [lograr resultado]"
    - "Los [número] mejores [categoría]"
    - Example: "15 estrategias SEO que funcionan en 2026"
    
  Question:
    - "¿[Pregunta que tu audiencia hace]?"
    - "¿Por qué [problema]? (Y cómo solucionarlo)"
    - Example: "¿Por qué no apareces en Google?"
    
  Guide:
    - "Guía completa de [tema]"
    - "Todo sobre [tema]: Guía 2026"
    - Example: "Guía completa de SEO técnico"

Content Length Guidelines:
  - Blog posts: 1,500 - 2,500 words
  - Pillar content: 3,000+ words
  - Product pages: 500+ words
  - Category pages: 300+ words
```

---

## FORBIDDEN: Content Anti-patterns

```yaml
FORBIDDEN:
  Thin content:
    WRONG: 300-word generic posts
    WHY: Doesn't satisfy user intent
    RIGHT: Comprehensive coverage
    
  Keyword stuffing:
    WRONG: "SEO SEO best SEO services SEO expert"
    WHY: Penalty risk, poor UX
    RIGHT: Natural language, synonyms
    
  Duplicate content:
    WRONG: Copy-paste from other sites
    WHY: No ranking potential
    RIGHT: Original research and insights
    
  Clickbait headlines:
    WRONG: "You won't believe this SEO trick!"
    WHY: High bounce rate, penalties
    RIGHT: Accurate, descriptive titles
    
  No clear authorship:
    WRONG: Anonymous content
    WHY: E-E-A-T issues
    RIGHT: Clear author with credentials
    
  Ignoring user intent:
    WRONG: Selling in informational content
    WHY: Poor UX, high bounce rate
    RIGHT: Match content to intent
```

---

## MUST: Content Optimization Checklist

```yaml
Pre-Publishing:
  - [ ] Target keyword in title (naturally)
  - [ ] Meta description compelling
  - [ ] H1 matches search intent
  - [ ] H2s cover subtopics
  - [ ] Internal links included
  - [ ] External links to authority
  - [ ] Images with alt text
  - [ ] Schema markup added
  - [ ] Author info included
  - [ ] References cited
  
Quality Checks:
  - [ ] Grammar/spelling correct
  - [ ] Facts verified
  - [ ] Statistics current
  - [ ] Links working
  - [ ] Mobile readable
  - [ ] Scannable (short paragraphs)
  - [ ] Call-to-action included
```

---

**Content optimized. E-E-A-T established. Rankings earned.**
