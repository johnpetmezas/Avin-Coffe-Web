import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { sendPushNotification } from '@/lib/push';

export async function POST(request) {
  try {
    const { customerId, title, body } = await request.json();
    const subStr = await redis.get(`push:sub:${customerId}`);
    
    if (subStr) {
      const subscription = typeof subStr === 'string' ? JSON.parse(subStr) : subStr;
      await sendPushNotification(subscription, { title, body });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
