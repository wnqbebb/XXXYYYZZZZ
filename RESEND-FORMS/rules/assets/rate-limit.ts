// lib/rate-limit.ts
// Rate limiting utility for API routes

import { LRUCache } from 'lru-cache';

interface RateLimitOptions {
  uniqueTokenPerInterval?: number;
  interval?: number;
}

export function rateLimit(options?: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default
  });

  return {
    check: (token: string, limit: number) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1]);
        } else {
          tokenCount[0] += 1;
          tokenCache.set(token, tokenCount);
        }
        
        if (tokenCount[0] > limit) {
          reject(new Error('Rate limit exceeded'));
        } else {
          resolve();
        }
      }),
  };
}

// IP-based rate limiter for email endpoints
export const emailRateLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

// Usage example:
// import { emailRateLimiter } from '@/lib/rate-limit';
// 
// export async function POST(request: Request) {
//   try {
//     const ip = request.headers.get('x-forwarded-for') || 'anonymous';
//     await emailRateLimiter.check(ip, 5); // 5 requests per minute per IP
//     // ... rest of handler
//   } catch {
//     return Response.json(
//       { error: 'Rate limit exceeded' },
//       { status: 429 }
//     );
//   }
// }
