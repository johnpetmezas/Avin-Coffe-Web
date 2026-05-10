import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { pin } = await request.json();
    const hash = process.env.STAFF_PIN_HASH;

    if (!pin || !hash) {
      return NextResponse.json({ error: 'Missing PIN or hash' }, { status: 400 });
    }

    const isValid = await bcrypt.compare(pin, hash);

    if (isValid) {
      const token = await signToken({ role: 'staff' });
      
      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: 'staff_token',
        value: token,
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: 'lax',
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
