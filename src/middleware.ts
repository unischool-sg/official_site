import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "./lib/service/user";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// /admin パスへのアクセスをチェック
	if (pathname.startsWith("/admin")) {
		// クッキーからセッショントークンを取得
		const user = await User.current();
        if (!user) {
            return redirectToLogin(request, pathname);
        }

		// セッションの有効性をチェック（オプション：パフォーマンスとのトレードオフ）
		// 注意: middlewareでPrismaを使うとコールドスタート時に遅くなる可能性があります
		// より詳細なチェックが必要な場合は、API RouteやServer Componentで行うことを推奨
	}

	return NextResponse.next();
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
