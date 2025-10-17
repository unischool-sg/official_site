import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
     const pathname = request.nextUrl.pathname;

     // パス情報をヘッダーに追加（Server Componentで利用可能に）
     const response = NextResponse.next();
     response.headers.set("x-pathname", pathname);
     response.headers.set("x-url", request.url);

     // クライアントのIPアドレスを取得
     // Vercelは以下のヘッダーでIPアドレスを提供します
     const forwardedFor = request.headers.get("x-forwarded-for");
     const realIp = request.headers.get("x-real-ip");
     const clientIp = forwardedFor?.split(",")[0].trim() || realIp || "unknown";
     
     response.headers.set("x-client-ip", clientIp);

     // クッキーを保持（重要！）
     // NextResponse.next()は既存のクッキーを保持しますが、
     // 明示的に確認してログ出力
     const sessionToken = request.cookies.get("s-token");
     if (sessionToken) {
          console.log("[Middleware] Session token found:", {
               path: pathname,
               tokenPrefix: sessionToken.value.substring(0, 10) + "...",
          });
     }

     return response;
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
