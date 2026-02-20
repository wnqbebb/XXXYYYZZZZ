---
name: seo-ai-search-optimization
description: Generative Engine Optimization (GEO) for AI search engines like ChatGPT, Perplexity, Gemini. Load when optimizing for AI search.
metadata:
  tags: seo, geo, ai-search, chatgpt, perplexity, gemini, generative-engine-optimization, semantic-search, entities
---

# AI Search Optimization (GEO) Rules

## MUST: Understanding AI Search

```yaml
What is GEO (Generative Engine Optimization):
  - Optimizing for AI-powered search engines
  - Focus on being cited in AI responses
  - Different from traditional SEO
  - Emphasis on accuracy, authority, context

Major AI Search Engines:
  - ChatGPT with Browse
  - Perplexity AI
  - Google Gemini
  - Microsoft Copilot
  - Claude (Anthropic)
  - SearchGPT

Key Differences from Traditional SEO:
  - Intent understanding over keyword density
  - Context and relationships over exact matches
  - Authority signals over backlink quantity
  - Structured data for entity recognition
```

---

## MUST: Entity Optimization

```typescript
// Entity-focused content structure
interface EntityContent {
  // Main entity
  entity: {
    name: string
    type: 'Person' | 'Organization' | 'Product' | 'Place' | 'Event'
    description: string
    attributes: Record<string, string>
  }
  
  // Related entities
  relatedEntities: Array<{
    name: string
    relationship: string
  }>
  
  // Entity relationships
  relationships: Array<{
    subject: string
    predicate: string
    object: string
  }>
}

// Example: Comprehensive entity page
export default function EntityPage() {
  const entityData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://tusitio.com/#organization',
        name: 'Tu Empresa',
        url: 'https://tusitio.com',
        logo: 'https://tusitio.com/logo.png',
        sameAs: [
          'https://facebook.com/tuempresa',
          'https://linkedin.com/company/tuempresa',
          'https://twitter.com/tuempresa'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://tusitio.com/#website',
        url: 'https://tusitio.com',
        name: 'Tu Sitio',
        publisher: { '@id': 'https://tusitio.com/#organization' }
      },
      {
        '@type': 'WebPage',
        '@id': 'https://tusitio.com/pagina/#webpage',
        url: 'https://tusitio.com/pagina',
        name: 'Título de la Página',
        about: { '@id': 'https://tusitio.com/#organization' }
      }
    ]
  }
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entityData) }}
    />
  )
}
```

### WHY: Entities Over Keywords

```yaml
AI Search Understanding:
  - Recognizes entities (people, places, things)
  - Understands relationships between entities
  - Uses knowledge graphs for context
  - Prioritizes authoritative sources
  
Entity Optimization:
  - Define clear entity types
  - Establish entity relationships
  - Use consistent naming
  - Link to authoritative sources
```

---

## MUST: Semantic HTML for AI Understanding

```tsx
// ✅ DO: Semantic structure for AI parsing
export function ArticleContent({ article }) {
  return (
    <article itemScope itemType="https://schema.org/Article">
      {/* Clear headline hierarchy */}
      <header>
        <h1 itemProp="headline">{article.title}</h1>
        <p itemProp="description">{article.summary}</p>
        
        {/* Author entity */}
        <div itemProp="author" itemScope itemType="https://schema.org/Person">
          <span itemProp="name">{article.author.name}</span>
          <span itemProp="jobTitle">{article.author.title}</span>
          <link itemProp="sameAs" href={article.author.linkedin} />
        </div>
      </header>
      
      {/* Structured content with clear sections */}
      <section itemProp="articleBody">
        {article.sections.map((section, index) => (
          <section key={index}>
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
            
            {/* Key facts for AI extraction */}
            {section.facts && (
              <dl>
                {section.facts.map((fact, i) => (
                  <div key={i}>
                    <dt>{fact.term}</dt>
                    <dd>{fact.definition}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
      </section>
      
      {/* FAQ section for direct answers */}
      <section itemScope itemType="https://schema.org/FAQPage">
        <h2>Preguntas frecuentes</h2>
        {article.faqs.map((faq, index) => (
          <div 
            key={index}
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
      
      {/* Citations and references */}
      <footer>
        <h3>Referencias</h3>
        <ul>
          {article.references.map((ref, index) => (
            <li key={index}>
              <cite>
                <a href={ref.url} rel="nofollow noopener">
                  {ref.title} - {ref.source}
                </a>
              </cite>
            </li>
          ))}
        </ul>
      </footer>
    </article>
  )
}
```

---

## MUST: Direct Answer Optimization

```tsx
// ✅ DO: Content optimized for featured snippets and AI answers
export function DirectAnswerSection({ topic, question, answer }) {
  return (
    <section className="direct-answer" id="respuesta-directa">
      {/* Clear question in heading */}
      <h2>{question}</h2>
      
      {/* Concise answer in first paragraph */}
      <p className="answer-summary">
        <strong>Respuesta corta:</strong> {answer.summary}
      </p>
      
      {/* Detailed explanation */}
      <div className="detailed-answer">
        <h3>Explicación detallada</h3>
        {answer.details.map((detail, index) => (
          <p key={index}>{detail}</p>
        ))}
      </div>
      
      {/* Supporting evidence */}
      {answer.evidence && (
        <div className="supporting-evidence">
          <h3>Datos de soporte</h3>
          <ul>
            {answer.evidence.map((item, index) => (
              <li key={index}>
                <strong>{item.statistic}</strong>: {item.context}
                <cite>— {item.source}</cite>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Related questions (People Also Ask style) */}
      {answer.relatedQuestions && (
        <div className="related-questions">
          <h3>Preguntas relacionadas</h3>
          <dl>
            {answer.relatedQuestions.map((qa, index) => (
              <div key={index}>
                <dt>{qa.question}</dt>
                <dd>{qa.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  )
}
```

### WHY: Direct Answer Format

```yaml
AI Search Extraction:
  - AI models look for clear Q&A pairs
  - First paragraph often used as answer
  - Structured data improves extraction
  - Citations increase credibility
  
Best Practices:
  - Answer in first 40-60 words
  - Use question as H2 heading
  - Provide supporting details
  - Include data and statistics
  - Cite authoritative sources
```

---

## MUST: Authority Signals (E-E-A-T for AI)

```tsx
// ✅ DO: Comprehensive author information
export function AuthorBio({ author }) {
  return (
    <aside 
      itemScope 
      itemType="https://schema.org/Person"
      className="author-bio"
    >
      <img 
        itemProp="image"
        src={author.photo} 
        alt={author.name}
        width="120"
        height="120"
      />
      
      <h3 itemProp="name">{author.name}</h3>
      
      {/* Credentials */}
      <div itemProp="hasCredential">
        <span itemProp="jobTitle">{author.title}</span>
        {author.credentials.map((cred, i) => (
          <span key={i} className="credential">{cred}</span>
        ))}
      </div>
      
      {/* Affiliation */}
      <div itemProp="worksFor" itemScope itemType="https://schema.org/Organization">
        <span itemProp="name">{author.company}</span>
      </div>
      
      {/* Expertise areas */}
      <div className="expertise">
        <h4>Áreas de expertise</h4>
        <ul>
          {author.expertise.map((area, i) => (
            <li key={i} itemProp="knowsAbout">{area}</li>
          ))}
        </ul>
      </div>
      
      {/* Social proof */}
      <div className="social-proof">
        {author.sameAs.map((url, i) => (
          <link key={i} itemProp="sameAs" href={url} />
        ))}
      </div>
      
      {/* Publications */}
      {author.publications && (
        <div className="publications">
          <h4>Publicaciones destacadas</h4>
          <ul>
            {author.publications.map((pub, i) => (
              <li key={i} itemProp="publication">
                <a href={pub.url}>{pub.title}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
```

### WHY: E-E-A-T for AI

```yaml
Experience:
  - First-hand experience with topic
  - Case studies and examples
  - Personal insights
  
Expertise:
  - Author credentials
  - Professional background
  - Relevant education
  
Authoritativeness:
  - Industry recognition
  - Citations from other experts
  - Media mentions
  
Trustworthiness:
  - Accurate information
  - Transparent sources
  - Regular updates
  - Clear authorship
```

---

## MUST: Citation and Source Optimization

```tsx
// ✅ DO: Proper citation structure
export function CitedContent({ content, sources }) {
  return (
    <article>
      <div className="content-with-citations">
        {content.paragraphs.map((para, index) => (
          <p key={index}>
            {para.text}
            {para.citations && (
              <sup className="citations">
                {para.citations.map(c => `[${c}]`).join(', ')}
              </sup>
            )}
          </p>
        ))}
      </div>
      
      {/* References section */}
      <section className="references">
        <h2>Referencias</h2>
        <ol>
          {sources.map((source, index) => (
            <li key={index} id={`ref-${index + 1}`}>
              <cite>
                <a 
                  href={source.url}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  {source.title}
                </a>
              </cite>
              <span className="source-meta">
                {source.author && `Por ${source.author}. `}
                {source.publication && `${source.publication}. `}
                {source.date && source.date}
              </span>
              {source.doi && (
                <span className="doi">DOI: {source.doi}</span>
              )}
            </li>
          ))}
        </ol>
      </section>
      
      {/* Schema for citations */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ScholarlyArticle',
            citation: sources.map(s => ({
              '@type': 'CreativeWork',
              name: s.title,
              author: s.author,
              datePublished: s.date,
              url: s.url
            }))
          })
        }}
      />
    </article>
  )
}
```

---

## MUST: Conversational Content Structure

```tsx
// ✅ DO: Content structured for conversational AI
export function ConversationalGuide({ topic, sections }) {
  return (
    <article className="conversational-guide">
      <header>
        <h1>Guía completa: {topic}</h1>
        <p className="overview">
          Todo lo que necesitas saber sobre {topic}, 
          explicado paso a paso.
        </p>
      </header>
      
      {/* Table of contents with clear sections */}
      <nav className="toc">
        <h2>Contenido</h2>
        <ol>
          {sections.map((section, index) => (
            <li key={index}>
              <a href={`#section-${index + 1}`}>
                {section.question}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      
      {/* Sections as Q&A pairs */}
      {sections.map((section, index) => (
        <section 
          key={index}
          id={`section-${index + 1}`}
          className="qa-section"
        >
          {/* Question as heading */}
          <h2>{section.question}</h2>
          
          {/* Direct answer */}
          <div className="direct-answer">
            {section.shortAnswer}
          </div>
          
          {/* Detailed explanation */}
          <div className="detailed-explanation">
            {section.detailedContent}
          </div>
          
          {/* Actionable steps */}
          {section.steps && (
            <div className="action-steps">
              <h3>Pasos a seguir</h3>
              <ol>
                {section.steps.map((step, i) => (
                  <li key={i}>
                    <strong>{step.action}</strong>
                    <p>{step.explanation}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
          
          {/* Common mistakes */}
          {section.mistakes && (
            <div className="common-mistakes">
              <h3>Errores comunes</h3>
              <ul>
                {section.mistakes.map((mistake, i) => (
                  <li key={i}>
                    <strong>❌ {mistake.error}</strong>
                    <p>✅ {mistake.solution}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Tools and resources */}
          {section.resources && (
            <div className="resources">
              <h3>Herramientas recomendadas</h3>
              <ul>
                {section.resources.map((resource, i) => (
                  <li key={i}>
                    <a href={resource.url}>{resource.name}</a>
                    <p>{resource.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      ))}
    </article>
  )
}
```

---

## MUST: Multi-Modal Content for AI

```tsx
// ✅ DO: Content with multiple formats for AI understanding
export function MultiModalContent({ content }) {
  return (
    <article>
      {/* Text content */}
      <div className="text-content">
        {content.text}
      </div>
      
      {/* Video with transcript */}
      {content.video && (
        <figure>
          <video controls>
            <source src={content.video.url} type="video/mp4" />
          </video>
          <figcaption>
            <details>
              <summary>Transcripción del video</summary>
              <div className="transcript">
                {content.video.transcript}
              </div>
            </details>
          </figcaption>
        </figure>
      )}
      
      {/* Data table */}
      {content.data && (
        <figure>
          <table>
            <caption>{content.data.title}</caption>
            <thead>
              <tr>
                {content.data.headers.map((h, i) => (
                  <th key={i} scope="col">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {content.data.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )}
      
      {/* Infographic with alt text */}
      {content.infographic && (
        <figure>
          <img 
            src={content.infographic.image}
            alt={content.infographic.description}
          />
          <figcaption>
            {content.infographic.caption}
            <details>
              <summary>Descripción detallada</summary>
              <div>{content.infographic.longDescription}</div>
            </details>
          </figcaption>
        </figure>
      )}
      
      {/* Code examples */}
      {content.code && (
        <figure>
          <pre>
            <code className={`language-${content.code.language}`}>
              {content.code.content}
            </code>
          </pre>
          <figcaption>{content.code.explanation}</figcaption>
        </figure>
      )}
    </article>
  )
}
```

---

## FORBIDDEN: AI Search Anti-patterns

```yaml
FORBIDDEN:
  Vague content:
    WRONG: "SEO is important for websites"
    WHY: AI can't extract specific value
    RIGHT: "Technical SEO improves crawlability by 40% according to Google"
    
  No clear authorship:
    WRONG: Anonymous content
    WHY: AI prioritizes credible sources
    RIGHT: Clear author with credentials
    
  Outdated information:
    WRONG: SEO advice from 2020
    WHY: AI favors current information
    RIGHT: Regular updates with dates
    
  Missing citations:
    WRONG: Claims without sources
    WHY: AI needs to verify facts
    RIGHT: Every statistic cited
    
  Keyword stuffing:
    WRONG: "Best SEO SEO expert SEO services"
    WHY: AI understands natural language
    RIGHT: Natural, conversational content
    
  Thin content:
    WRONG: 300-word generic articles
    WHY: AI prefers comprehensive coverage
    RIGHT: In-depth, authoritative content
```

---

## MUST: AI Search Monitoring

```typescript
// Track AI search visibility
interface AISearchMetrics {
  // Brand mentions in AI responses
  brandMentions: {
    source: 'chatgpt' | 'perplexity' | 'gemini'
    query: string
    context: string
    date: Date
  }[]
  
  // Citation tracking
  citations: {
    url: string
    aiEngine: string
    frequency: number
  }[]
  
  // Featured snippet equivalents
  directAnswers: {
    query: string
    answer: string
    source: string
  }[]
}

// Monitoring implementation
export async function trackAIVisibility() {
  // Monitor Perplexity citations
  // Track ChatGPT browsing references
  // Analyze Gemini source citations
  // Log brand mention contexts
}
```

---

**GEO implemented. AI search optimized. Future-proof content created.**
