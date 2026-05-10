import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.POS_BRIDGE_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Pop an order from the queue
  const queueKey = 'orders:pos_queue';
  const orderId = await redis.lpop(queueKey);
  
  if (!orderId) {
    return NextResponse.json({ jobs: [] });
  }

  const orderStr = await redis.get(`order:${orderId}`);
  if (!orderStr) {
    return NextResponse.json({ jobs: [] });
  }

  const order = typeof orderStr === 'string' ? JSON.parse(orderStr) : orderStr;
  
  return NextResponse.json({ jobs: [order] });
}
