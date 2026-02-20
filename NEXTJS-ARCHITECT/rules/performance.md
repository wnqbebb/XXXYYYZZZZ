---
name: "Performance"
description: "Optimización de rendimiento en Next.js: imágenes, fuentes, scripts, lazy loading y code splitting"
tags: ["performance", "optimization", "image", "font", "script", "lazy-loading"]
---

# Performance en Next.js

## Descripción

Next.js incluye optimizaciones automáticas para imágenes, fuentes y scripts. Aprovechar estas optimizaciones es crucial para el Core Web Vitals y la experiencia del usuario.

## Directrices Críticas

### MUST

- **MUST** usar el componente `Image` de Next.js para todas las imágenes
- **MUST** usar el componente `Script` de Next.js para scripts externos
- **MUST** usar `next/font` para cargar fuentes de manera optimizada
- **MUST** usar `dynamic()` para code splitting de componentes pesados
- **MUST** usar `loading="lazy"` en imágenes debajo del fold
- **MUST** especificar `width` y `height` en imágenes para evitar CLS

### FORBIDDEN

- **FORBIDDEN** usar `<img>` en lugar de `<Image>` de Next.js
- **FORBIDDEN** usar `<script>` en lugar de `<Script>` de Next.js
- **FORBIDDEN** cargar fuentes de Google Fonts manualmente
- **FORBIDDEN** importar componentes pesados estáticamente cuando pueden ser dinámicos
- **FORBIDDEN** olvidar el atributo `alt` en imágenes

### WHY

Las optimizaciones automáticas de Next.js mejoran LCP, CLS, FID y otros Core Web Vitals críticos para SEO y UX.

## Optimización de Imágenes

### ✅ Image básico

```tsx
import Image from 'next/image'

// Imagen local importada
import profilePic from './profile.png'

export function Profile() {
  return (
    <Image
      src={profilePic}
      alt="Profile picture"
      // width y height se infieren automáticamente
      placeholder="blur" // Opcional: blur-up effect
    />
  )
}
```

### ✅ Imagen remota

```tsx
import Image from 'next/image'

export function Avatar({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className="rounded-full"
    />
  )
}
```

### ✅ Configuración de dominios remotos

```js
// next.config.js
module.exports = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
    // o con remotePatterns (recomendado)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/images/**',
      },
    ],
  },
}
```

### ✅ Responsive images

```tsx
import Image from 'next/image'

export function HeroImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      fill // Ocupa todo el espacio del contenedor
      sizes="100vw"
      priority // Cargar inmediatamente (LCP)
      className="object-cover"
    />
  )
}
```

### ✅ Grid de imágenes

```tsx
import Image from 'next/image'

export function Gallery({ images }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {images.map((image, index) => (
        <Image
          key={image.id}
          src={image.src}
          alt={image.alt}
          width={300}
          height={200}
          loading={index < 3 ? 'eager' : 'lazy'} // Primeras 3 eager, resto lazy
        />
      ))}
    </div>
  )
}
```

### ❌ Incorrecto: Usar img en lugar de Image

```tsx
// ❌ MAL: No usar img
export function BadImage() {
  return <img src="/photo.jpg" alt="Photo" /> // ❌ No optimizado!
}
```

```tsx
// ✅ BIEN: Usar Image de Next.js
import Image from 'next/image'

export function GoodImage() {
  return <Image src="/photo.jpg" alt="Photo" width={800} height={600} />
}
```

## Optimización de Fuentes

### ✅ next/font básico

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Evita FOIT
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

### ✅ Múltiples fuentes

```tsx
// app/layout.tsx
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const robotoMono = Roboto_Mono({ 
  subsets: ['latin'],
  variable: '--font-roboto-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    font-family: var(--font-inter), system-ui, sans-serif;
  }
  
  code, pre {
    font-family: var(--font-roboto-mono), monospace;
  }
}
```

### ✅ Fuente local

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    {
      path: './fonts/my-font-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/my-font-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

## Optimización de Scripts

### ✅ Script básico

```tsx
// app/page.tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <h1>My Page</h1>
      <Script src="https://analytics.com/script.js" />
    </>
  )
}
```

### ✅ Estrategias de carga

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      {/* Cargar antes de que la página sea interactiva */}
      <Script 
        src="https://critical.com/script.js" 
        strategy="beforeInteractive"
      />
      
      {/* Cargar después de que la página sea interactiva (default) */}
      <Script 
        src="https://analytics.com/script.js" 
        strategy="afterInteractive"
      />
      
      {/* Cargar durante idle time */}
      <Script 
        src="https://chat-widget.com/script.js" 
        strategy="lazyOnload"
      />
      
      {/* Cargar on-demand */}
      <Script 
        src="https://maps.com/api.js" 
        strategy="worker"
      />
    </>
  )
}
```

### ✅ Script inline

```tsx
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script id="analytics-config" strategy="beforeInteractive">
        {`
          window.analytics = {
            trackingId: '${process.env.NEXT_PUBLIC_ANALYTICS_ID}'
          };
        `}
      </Script>
    </>
  )
}
```

## Code Splitting

### ✅ Dynamic imports

```tsx
// app/page.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Cargar solo cuando se necesite
const HeavyChart = dynamic(() => import('./components/heavy-chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Deshabilitar SSR si usa APIs del browser
})

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  )
}
```

### ✅ Dynamic import con loading state

```tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const Modal = dynamic(() => import('./modal'), {
  loading: () => <p>Loading modal...</p>,
})

export function Page() {
  const [showModal, setShowModal] = useState(false)
  
  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </div>
  )
}
```

### ✅ Import condicional

```tsx
// components/rich-editor.tsx
'use client'

import dynamic from 'next/dynamic'

// Solo cargar en el cliente
const Editor = dynamic(
  () => import('react-quill'),
  { ssr: false }
)

export function RichEditor({ value, onChange }) {
  return <Editor value={value} onChange={onChange} />
}
```

## Lazy Loading de Componentes

### ✅ Lazy loading de secciones

```tsx
// app/page.tsx
import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Importar inmediatamente (above the fold)
import Hero from './sections/hero'

// Lazy loading (below the fold)
const Features = dynamic(() => import('./sections/features'))
const Testimonials = dynamic(() => import('./sections/testimonials'))
const Pricing = dynamic(() => import('./sections/pricing'))

export default function HomePage() {
  return (
    <main>
      <Hero />
      
      <Suspense fallback={<div>Loading features...</div>}>
        <Features />
      </Suspense>
      
      <Suspense fallback={<div>Loading testimonials...</div>}>
        <Testimonials />
      </Suspense>
      
      <Suspense fallback={<div>Loading pricing...</div>}>
        <Pricing />
      </Suspense>
    </main>
  )
}
```

## Streaming y Suspense

### ✅ Streaming con Suspense

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { PostSkeleton } from './components/skeletons'

async function Posts() {
  const posts = await fetchPosts() // Puede ser lento
  return <PostList posts={posts} />
}

export default function Page() {
  return (
    <div>
      <h1>Latest Posts</h1>
      
      {/* Este contenido se muestra inmediatamente */}
      <p>Check out our latest articles below.</p>
      
      {/* Esto se stream cuando esté listo */}
      <Suspense fallback={<PostSkeleton count={5} />}>
        <Posts />
      </Suspense>
    </div>
  )
}
```

## Bundle Optimization

### ✅ Analizar bundle

```bash
# Analizar bundle size
ANALYZE=true npm run build
```

```js
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // config
})
```

### ✅ Tree shaking

```tsx
// ❌ MAL: Importar todo el lodash
import _ from 'lodash'

// ✅ BIEN: Importar solo lo necesario
import debounce from 'lodash/debounce'
// o
import { debounce } from 'lodash-es'
```

## Configuración de Next.js

```js
// next.config.js
module.exports = {
  // Optimizaciones de imagen
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // Compresión
  compress: true,
  
  // Powered by header
  poweredByHeader: false,
  
  // React strict mode
  reactStrictMode: true,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ['lodash', 'date-fns'],
  },
}
```

## Referencias

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Next.js Script Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
- [Next.js Lazy Loading](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Core Web Vitals](https://web.dev/vitals/)
