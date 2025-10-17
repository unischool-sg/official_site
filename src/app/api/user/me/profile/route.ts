"use server";
import { successResponse, unauthorizedResponse, serverErrorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

export async function GET() {
    const user = await User.current(true);
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }

    return successResponse({ user: user.toJSON() });
}

export async function POST(req: NextRequest) {
    const user = await User.current();
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }

    try {
        const data = await req.json();
        await user.update(data);
        return successResponse({ user: user.toJSON() });
    } catch (error) {
        console.error("Profile update error:", error);
        return serverErrorResponse("プロフィールの更新中にエラーが発生しました");
    }
}