import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/service/user";
import { successResponse } from "@/lib/api/response";

export async function GET() {
  const user = await User.current();

  if (user) {
    await user.logout();
  }

  // クッキーを削除してログインページにリダイレクト
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_URL || "http://localhost:3000"));
  response.cookies.delete("s-token");
  
  return response;
}

export async function POST(request: NextRequest) {
  const user = await User.current();

  if (user) {
    const { allSessions } = await request.json();

    if (allSessions) {
      await user.logoutAll();
    } else {
      await user.logout();
    }
  }

  // レスポンスを作成してクッキーを削除
  const response = successResponse({
    message: "ログアウトしました",
  });
  
  response.cookies.delete("s-token");

  return response;
}
