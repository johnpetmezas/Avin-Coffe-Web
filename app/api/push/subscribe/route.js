import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request) {
  try {
    const { subscription, customerId } = await request.json();
    if (!subscription || !customerId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 });
    }
    
    // Save subscription in Redis
    await redis.set(`push:sub:${customerId}`, JSON.stringify(subscription));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
