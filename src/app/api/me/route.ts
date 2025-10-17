"use server";
import { successResponse, unauthorizedResponse, serverErrorResponse } from "@/lib/api/response";
import { User } from "@/lib/service/user";

export async function GET() {
    const user = await User.current();
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }

    return successResponse({ user: user.toJSON() });
}

export async function DELETE() {
    const user = await User.current();
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }

    try {
        await user.delete();
        return successResponse({ message: "アカウントが削除されました" });
    } catch (error) {
        console.error("Account deletion error:", error);
        return serverErrorResponse("アカウントの削除中にエラーが発生しました");
    }
}