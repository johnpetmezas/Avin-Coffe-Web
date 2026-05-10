import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { sendPushNotification } from '@/lib/push';

export async function PATCH(request, { params }) {
  const { id } = params;
  
  try {
    const { action } = await request.json();
    const orderData = await redis.get(`order:${id}`);
    
    if (!orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = typeof orderData === 'string' ? JSON.parse(orderData) : orderData;

    let newStatus = order.status;

    if (action === 'cancel' && order.status === 'pending') {
      newStatus = 'cancelled';
      await redis.zrem('orders:pending', id);
    } else if (action === 'submit' && order.status === 'pending') {
      newStatus = 'confirmed';
      await redis.zrem('orders:pending', id);
    } else if (action === 'confirm' && order.status === 'confirmed') {
      newStatus = 'preparing';
      await redis.rpush('orders:pos_queue', id);
      // Notify customer that it is being prepared
      try {
        const subStr = await redis.get(`push:sub:${order.customerId}`);
        if (subStr) {
          const subscription = typeof subStr === 'string' ? JSON.parse(subStr) : subStr;
          await sendPushNotification(subscription, {
            title: 'Order Preparing',
            body: 'Ο καφές σας ετοιμάζεται ☕'
          });
        }
      } catch(e) {
        console.error('Failed to send push notification', e);
      }
    } else if (action === 'ready' && order.status === 'preparing') {
      newStatus = 'ready';
      // Notify customer that it is ready
      try {
        const subStr = await redis.get(`push:sub:${order.customerId}`);
        if (subStr) {
          const subscription = typeof subStr === 'string' ? JSON.parse(subStr) : subStr;
          await sendPushNotification(subscription, {
            title: 'Order Ready!',
            body: 'Η παραγγελία σας είναι έτοιμη! ☕'
          });
        }
      } catch(e) {
        console.error('Failed to send push notification', e);
      }
    } else if (action === 'completed' && order.status === 'ready') {
      newStatus = 'completed';
    }

    order.status = newStatus;
    await redis.set(`order:${id}`, JSON.stringify(order));

    // Publish to SSE clients
    await redis.publish('orders:channel', JSON.stringify({ type: `order_updated`, order }));

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Update order error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  const { id } = params;
  const orderData = await redis.get(`order:${id}`);
  if (!orderData) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order: typeof orderData === 'string' ? JSON.parse(orderData) : orderData });
}
