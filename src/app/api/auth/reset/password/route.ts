"use server";
import { successResponse, unauthorizedResponse, serverErrorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { Token } from "@/lib/service/token";


export async function POST(req: NextRequest) {
    const authToken = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!authToken) {
        return unauthorizedResponse("トークンが提供されていません");
    }
    try {
        const token = await Token.get(authToken);
        if (!token || !token.isActive("PASSWORD_RESET")) {
            return unauthorizedResponse("無効または期限切れのトークンです");
        }
        const [user, { password }] = await Promise.all([
            token.user,
            req.json(),
        ]);
        if (!user) {
            return unauthorizedResponse("ユーザーが見つかりません");
        }
        // パスワードの変更
        await Promise.all([
            user?.changePassword(password),
            token.delete(),
        ]);
        return successResponse({ message: "パスワードが正常にリセットされました" });
    } catch (error) {
        console.error("Password reset error:", error);
        return serverErrorResponse("サーバーエラーが発生しました");
    }
}