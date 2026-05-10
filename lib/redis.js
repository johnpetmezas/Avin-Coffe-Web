import { Redis } from '@upstash/redis';

// Use a fallback so local dev doesn't crash if Upstash isn't fully configured
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy',
});
