import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

/**
 * Middleware - 認証とアクセス制御
 */
export async function middleware(request: NextRequest) {
     const { pathname } = request.nextUrl;

     // /admin パスへのアクセスをチェック
     if (pathname.startsWith("/admin")) {
          // クッキーからセッショントークンを取得
          const cookieStore = await cookies();
          const sessionToken = cookieStore.get("s-token")?.value;

          // セッショントークンがない場合
          if (!sessionToken) {
               return redirectToLogin(request, pathname);
          }

          // セッションの有効性を確認（DBチェック）
          try {
               const session = await prisma.session.findUnique({
                    where: { sessionToken },
                    include: {
                         user: {
                              select: {
                                   id: true,
                                   role: true,
                                   deletedAt: true,
                              },
                         },
                    },
               });

               // セッションが存在しない、または期限切れ
               if (!session || session.expires < new Date()) {
                    // 期限切れセッションを削除
                    if (session) {
                         await prisma.session.delete({
                              where: { sessionToken },
                         });
                         cookieStore.delete("s-token");
                    }
                    return redirectToLogin(request, pathname);
               }

               // ユーザーが削除されている
               if (session.user.deletedAt) {
                    cookieStore.delete("s-token");
                    return redirectToLogin(request, pathname);
               }

               // 管理者権限チェック（オプション：/adminはADMINのみアクセス可能にする場合）
               if (session.user.role !== "ADMIN") {
                    // 403 Forbiddenページにリダイレクト
                    return NextResponse.redirect(new URL("/403", request.url));
               }
          } catch (error) {
               console.error("Middleware authentication error:", error);
               return redirectToLogin(request, pathname);
          }
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
