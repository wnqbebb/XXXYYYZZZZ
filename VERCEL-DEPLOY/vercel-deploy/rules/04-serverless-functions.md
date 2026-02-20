---
name: serverless-functions
description: Vercel Functions with Edge and Node.js runtimes. Fluid Compute configuration.
version: 4.0.0
---

# Serverless Functions - Vercel Functions

> Build API endpoints and backend logic with Vercel's unified Functions platform.

---

## MUST

### 1. Choose Runtime Based on Needs

**✅ CORRECT:**
```typescript
// Edge Runtime - Fast, global, lightweight
export const runtime = 'edge'

// Node.js Runtime - Full API access
export const runtime = 'nodejs'
```

### 2. Configure Memory and Duration

**✅ CORRECT:**
```typescript
// app/api/heavy/route.ts
export const maxDuration = 300 // 5 minutes (Pro+)
export const memory = 3008 // MB
```

### 3. Use Preferred Region for Data Locality

**✅ CORRECT:**
```typescript
export const preferredRegion = ['iad1', 'cdg1']
```

---

## FORBIDDEN

### 1. Never Use Node.js APIs in Edge Runtime

**❌ FORBIDDEN:**
```typescript
export const runtime = 'edge'

export async function GET() {
  // ❌ fs not available in Edge
  const data = fs.readFileSync('./file.txt')
}
```

**✅ CORRECT:**
```typescript
export const runtime = 'nodejs'

export async function GET() {
  // ✅ fs available in Node.js
  const data = fs.readFileSync('./file.txt')
}
```

### 2. Never Exceed Duration Limits

**❌ FORBIDDEN:**
```typescript
export const maxDuration = 600 // ❌ Exceeds limit
```

**✅ CORRECT:**
```typescript
// Hobby: 10s, Pro: 300s, Enterprise: 900s
export const maxDuration = 300
```

---

## WHY

### Runtime Comparison

| Feature | Edge | Node.js |
|---------|------|---------|
| Cold Start | ~9x faster | Standard |
| Global | ✅ Yes | Configurable |
| Node.js APIs | Limited | Full |
| Max Duration | 300s | 10s-900s |
| Memory | Limited | 128MB-3008MB |
| Best For | Fast APIs, auth | Heavy compute |

### Fluid Compute (New 2025)

- Pay only for **active CPU cycles**
- Not charged for I/O wait time
- Perfect for AI inference, streaming

---

## EXAMPLES

### Edge Function (App Router)

```typescript
// app/api/hello/route.ts
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const preferredRegion = ['iad1']

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name') || 'World'
  
  return NextResponse.json({
    message: `Hello, ${name}!`,
    region: process.env.VERCEL_REGION,
    timestamp: new Date().toISOString()
  })
}
```

### Node.js Function with Database

```typescript
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function GET() {
  const users = await db.user.findMany()
  return NextResponse.json(users)
}

export async function POST(request: Request) {
  const body = await request.json()
  const user = await db.user.create({ data: body })
  return NextResponse.json(user, { status: 201 })
}
```

### Streaming Response

```typescript
// app/api/stream/route.ts
export const runtime = 'edge'

export async function GET() {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(
          encoder.encode(`data: Message ${i}\n\n`)
        )
        await new Promise(r => setTimeout(r, 1000))
      }
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache'
    }
  })
}
```

### AI Streaming (OpenAI)

```typescript
// app/api/chat/route.ts
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages
  })
  
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

### Webhook Handler

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

export const runtime = 'nodejs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const payload = await request.text()
  const signature = headers().get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Handle successful payment
      break
    default:
      console.log(`Unhandled event: ${event.type}`)
  }
  
  return NextResponse.json({ received: true })
}
```

---

## Related Assets

- [Edge Function Template](../assets/templates/edge-function.ts)
- [API Route Template](../assets/templates/api-route.ts)
- [Webhook Handler Template](../assets/templates/webhook.ts)
