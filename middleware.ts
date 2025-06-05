import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('session_id')?.value;
  const { pathname } = request.nextUrl;

  console.log('Middleware executing for path:', pathname);
  console.log('Session ID exists:', !!sessionId);


  const publicPaths = ['/login', '/register', '/success-verification'];

 
  if (
    publicPaths.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') 
  ) {
    console.log('Allowing access to public path:', pathname);
    return NextResponse.next();
  }

 
  if (!sessionId) {
    console.log('No session ID found, redirecting to login');
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }


  if (pathname === '/') {
    console.log('Authenticated user accessing root, redirecting to dashboard');
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  console.log('Allowing access to protected path:', pathname);
  return NextResponse.next();
}


export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
};