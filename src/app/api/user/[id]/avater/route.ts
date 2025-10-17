"use server";
import { successResponse, unauthorizedResponse, serverErrorResponse, notFoundResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";
interface Context {
    params: Promise<{ id: string }>;
}

export async function GET(context: Context) {
    const { id } = await context.params;
    const user = await User.get({ id }, true);
    if (!user) {
        return unauthorizedResponse("ユーザーが見つかりません");
    }
    const avatarUrl = user.profile?.avatarUrl || null;
    if (!avatarUrl) {
        return notFoundResponse("アバター画像が設定されていません");
    }

    const response = await fetch(avatarUrl, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36"
        }
    });

    if (!response.ok) {
        return serverErrorResponse("アバター画像の取得に失敗しました");
    }

    const imageBuffer = await response.arrayBuffer();
    return new Response(imageBuffer, {
        headers: {
            "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
            "Content-Length": imageBuffer.byteLength.toString(),
        }
    });

}