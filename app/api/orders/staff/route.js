import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET() {
  try {
    // In a real app, you'd maintain an index set like 'orders:active'
    // For simplicity, we fetch all orders or from a specific set.
    // Let's assume we can fetch keys 'order:*'
    const keys = await redis.keys('order:*');
    
    if (!keys || keys.length === 0) {
      return NextResponse.json({ orders: [] });
    }

    const orderStrings = await redis.mget(...keys);
    const orders = orderStrings.map(s => typeof s === 'string' ? JSON.parse(s) : s);
    
    // Sort by createdAt descending
    orders.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
