import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const refreshToken = request.cookies.get('refresh')?.value;

	// Dashboard va boshqa himoyalangan routelar
	const protectedRoutes = ['/dashboard', '/admin', '/instructor'];
	const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

	if (isProtectedRoute && !refreshToken) {
		// Agar token yo'q bo'lsa, login sahifasiga yo'naltirish
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard/:path*', '/admin/:path*', '/instructor/:path*']
};
