import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, items, total } = body;

    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const now = Date.now();

    const order = {
      id: orderId,
      customerId: orderId,
      customerName,
      items,
      total,
      status: 'pending',
      createdAt: now,
    };

    // Save order data to redis
    await redis.set(`order:${orderId}`, JSON.stringify(order));
    
    // Add to pending sorted set to trigger grace period logic
    await redis.zadd('orders:pending', { score: now, member: orderId });

    // Inform clients via redis pubsub (which our SSE endpoint will listen to)
    await redis.publish('orders:channel', JSON.stringify({ type: 'new_order_pending', order }));

    // In a real app with cron or background jobs, a function would run after 30s to check `orders:pending`.
    // We can simulate it by sending a timeout or checking on next request.
    
    return NextResponse.json({ orderId, status: 'pending' }, { status: 201 });
  } catch (error) {
    console.error('Create order error', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
