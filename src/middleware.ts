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

	// ✅ SECURITY FIX: Clickjacking protection - barcha response'larga security headerlar qo'shish
	const response = NextResponse.next();
	
	// X-Frame-Options header - clickjacking hujumlaridan himoya qilish
	response.headers.set('X-Frame-Options', 'DENY');
	
	// Content Security Policy:
	//  - frame-ancestors 'none'  -> bizning saytni boshqa saytlar iframe ichiga qo'ya olmaydi
	//  - frame-src youtube       -> biz o'zimiz YouTube videolarini iframe orqali qo'ya olamiz
	response.headers.set(
		'Content-Security-Policy',
		"frame-ancestors 'none'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://uydatalim.uzedu.uz https://api.uydatalim.uzedu.uz;"
	);
	
	// X-Content-Type-Options - MIME type sniffing'ni oldini olish
	response.headers.set('X-Content-Type-Options', 'nosniff');
	
	// X-XSS-Protection - Eski brauzerlar uchun qo'shimcha himoya
	response.headers.set('X-XSS-Protection', '1; mode=block');

	return response;
}

export const config = {
	// ✅ SECURITY FIX: Barcha route'larga security headerlar qo'shish
	matcher: [
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	]
};
