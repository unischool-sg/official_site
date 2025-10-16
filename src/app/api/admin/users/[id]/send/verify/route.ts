import { serverErrorResponse, successResponse, forbiddenResponse, notFoundResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

interface Context {
    params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: Context) {
    const [{ id }, user] = await Promise.all([
        context.params,
        User.current(),
    ]);
    if (!user || user.role !== "ADMIN") {
        return forbiddenResponse("権限がありません");
    }
    const targetUser = await User.get({ id });
    if (!targetUser) {
        return notFoundResponse("ユーザーが存在しません");
    }
    if (targetUser.emailVerified) {
        return forbiddenResponse("既に認証済みのユーザーです");
    }

    try {
        await targetUser.sendEmailVerification();
        return successResponse("認証メールを再送しました");
    } catch (error) {
        return serverErrorResponse("認証メールの送信に失敗しました");
    }
}