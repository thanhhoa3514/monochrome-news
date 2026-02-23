import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/api/config';

// Define the routes that need protection
const protectedRoutes = ['/user', '/admin', '/editor', '/checkout'];
const authRoutes = ['/login', '/register', '/user/forgot-password'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const path = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
    const isAuthRoute = authRoutes.some(route => path.startsWith(route));

    // If the user is unauthenticated and trying to access a protected route
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', path);
        return NextResponse.redirect(loginUrl);
    }

    // If the user is authenticated and trying to access login/register
    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Apply middleware to specific route patterns
    matcher: [
        '/user/:path*',
        '/admin/:path*',
        '/editor/:path*',
        '/checkout/:path*',
        '/login',
        '/register'
    ],
};
