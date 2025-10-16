import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";
import { successResponse } from "@/lib/api/response";
import { redirect } from "next/navigation";

export async function GET() {
  const user = await User.current();

  if (user) {
    await user.logout();
  }

  // ログインページにリダイレクト
  return redirect("/login");
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

  return successResponse({
    message: "ログアウトしました",
  });
}
