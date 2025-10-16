import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// パス情報をヘッダーに追加（Server Componentで利用可能に）
	const response = NextResponse.next();
	response.headers.set("x-pathname", pathname);
	response.headers.set("x-url", request.url);
	
	return response;
}

/**
 * ログインページにリダイレクト
 */
function redirectToLogin(request: NextRequest, pathname: string): NextResponse {
	const loginUrl = new URL("/login", request.url);
	loginUrl.searchParams.set("redirect", pathname);
	return NextResponse.redirect(loginUrl);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (images, etc.)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
	],
};
