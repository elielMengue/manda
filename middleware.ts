import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/secure')) {
    const elevated = req.cookies.get('admin_elevated')?.value === '1';
    if (!elevated) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/secure';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

