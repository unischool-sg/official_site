import { successResponse, errorResponse, unauthorizedResponse } from "@/lib/api/response";
import { generateRandomPassword } from "@/utils/hash";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
    const [user, body] = await Promise.all([User.current(), req.json()]);
    if (!user || user.role !== "ADMIN") {
        return unauthorizedResponse("権限がありません");
    }

    try {
        const { email, password, team, role } = body;
        const isExists = await User.get({ email });
        if (isExists) {
            return errorResponse("このメールアドレスは既に使用されています", { status: 400 });
        }

        const newUser = await User.new({
            name: email.split("@")[0],
            email,
            password: password ?? generateRandomPassword(100),
            team: team || "ALL",
            role: role || "MEMBER",
        });
        await newUser.sendEmailVerification();
        return successResponse({ user: newUser, message: "ユーザーを作成しました" });
    } catch (e) {
        return errorResponse("ユーザーの作成に失敗しました", { status: 500 });
    }
}