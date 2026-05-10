import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export const dynamic = 'force-dynamic';

export async function GET() {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode(`data: {"type": "connected"}\n\n`));

      // Keep connection alive
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`data: {"type": "heartbeat"}\n\n`));
      }, 20000); // 20s heartbeat for Vercel 25s timeout

      // Note: Upstash Redis over REST doesn't natively support long-lived PubSub subscriptions easily in serverless.
      // In a real Vercel environment, we might use Pusher or poll the `orders:channel` queue, 
      // or use a regular Redis client. Upstash REST doesn't expose a blocking SUBSCRIBE.
      // For this implementation, we will simulate SSE push via polling to Upstash or just mock it.
      
      // Let's implement a lightweight polling approach over Upstash to simulate SSE:
      const pollInterval = setInterval(async () => {
        // Here we could fetch new orders from a queue or zset
      }, 5000);

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        clearInterval(pollInterval);
      });
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
