import { successResponse, notFoundResponse, errorResponse } from "@/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    const user = await User.get({ email });
    if (!user) {
        return notFoundResponse("User not found");
    }

    const token = await user.login(password);
    if (!token) {
        return errorResponse("Invalid password", { status: 401 });
    }

    // セッション期間（7日間）
    const sessionDuration = 7 * 24 * 60 * 60; // 秒単位

    // レスポンスを作成
    const response = successResponse({ token });

    // クッキーをレスポンスヘッダーに設定
    response.cookies.set("s-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: sessionDuration,
        path: "/",
    });

    console.log("[Login API] Cookie set in response:", {
        tokenPrefix: token.substring(0, 10) + "...",
        maxAge: sessionDuration,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/"
    });

    return response;
}