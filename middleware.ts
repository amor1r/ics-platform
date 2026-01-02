import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { rateLimitMiddleware } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Apply rate limiting
  const rateLimitResponse = rateLimitMiddleware(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Log access attempt
  logger.info('Request received', {
    path: pathname,
    method: request.method,
    ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
  });

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/login',
    '/register',
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ];

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // Skip middleware for public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get token from cookie or header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Protected page routes that require authentication
  const protectedPageRoutes = [
    '/member',
    '/admin',
    '/dashboard',
    '/profile',
    '/settings',
    '/my-content',
  ];

  const isProtectedPageRoute = protectedPageRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect to login if accessing protected page without token
  if (isProtectedPageRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token for protected pages
  if (isProtectedPageRoute && token) {
    const payload = verifyToken(token);
    
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'invalid_token');
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes require ADMIN role
    if (pathname.startsWith('/admin')) {
      if (payload.role !== 'ADMIN') {
        const dashboardUrl = new URL('/member/dashboard', request.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    // Check member routes - allow all authenticated users
    if (pathname.startsWith('/member')) {
      // All authenticated users can access member routes
      return NextResponse.next();
    }
  }

  // Protected API routes that require authentication
  const protectedApiRoutes = [
    '/api/projects',
    '/api/comments',
    '/api/files',
    '/api/user',
    '/api/bookmarks',
    '/api/notifications',
    '/api/search',
  ];

  const isProtectedApiRoute = protectedApiRoutes.some(route =>
    pathname.startsWith(route)
  );

  // API routes protection
  if (isProtectedApiRoute && !token) {
    return NextResponse.json(
      { error: 'غير مصرح - يرجى تسجيل الدخول' },
      { status: 401 }
    );
  }

  if (isProtectedApiRoute && token) {
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'رمز غير صالح أو منتهي الصلاحية' },
        { status: 401 }
      );
    }

    // Check admin API routes
    if (pathname.startsWith('/api/admin')) {
      if (payload.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'غير مصرح - يتطلب صلاحيات مدير' },
          { status: 403 }
        );
      }
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  
  // Set CORS headers if needed
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
