import { successResponse, notFoundResponse, unauthorizedResponse, serverErrorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

interface Context {
    params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: Context) {
    const [user, { id }] = await Promise.all([
        User.current(),
        context.params,
    ]);

    if (!user || user.role !== "ADMIN") {
        return unauthorizedResponse("権限がありません");
    }

    const [targetUser, data] = await Promise.all([
        User.get({ id }),
        req.json()
    ]);
    if (!targetUser) {
        return notFoundResponse("ユーザーが見つかりません");
    }

    try {
        const result = await targetUser.upsertProfile({
            bio: data.bio,
            avatarUrl: data.avatarUrl,
            isPublic: data.isPublic,
        });
        return successResponse({
            profile: result,
            message: "ユーザープロフィールを更新しました",
        });
    } catch (error) {
        console.error("Send password reset email error:", error);
        return serverErrorResponse("ユーザーの更新に失敗しました");
    }


}