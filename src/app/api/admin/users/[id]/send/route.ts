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

    return successResponse({ user: await User.get({ id }) });
}

export async function POST(req: NextRequest, context: Context) {
    try {
        const [{ id }, currentUser] = await Promise.all([
            context.params,
            User.current(),
        ]);
        if (!currentUser || currentUser.role !== "ADMIN") {
            return forbiddenResponse("権限がありません");
        }

        const targetUser = await User.get({ id });
        if (!targetUser) {
            return notFoundResponse("ユーザーが見つかりません");
        }

        const { subject, body } = await req.json();
        await targetUser.sendCustomEmail({ subject, body });
        return successResponse({ message: "メールを送信しました" });
    } catch (error) {
        console.error("Send custom email error:", error);
        return serverErrorResponse("メールの送信に失敗しました");
    }
}
