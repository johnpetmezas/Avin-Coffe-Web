import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect /staff routes, except for /staff/login
  if (pathname.startsWith('/staff') && !pathname.startsWith('/staff/login')) {
    const token = request.cookies.get('staff_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/staff/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/staff/:path*'],
};
