import { successResponse, errorResponse, serverErrorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { withRole } from "@/lib/api/middleware";
import { User } from "@/lib/service/user";

export const POST = withRole(async (req: NextRequest) => {
    const { email } = await req.json();

    // 既に存在するか確認
    const existingUser = await User.get({ email });
    if (existingUser) {
        return errorResponse("User already exists", { status: 409 });
    }

    // 新規ユーザー作成
    try {
        const password = Math.random().toString(36).slice(-8);
        const newUser = await User.new({ email, password });
        await newUser.sendEmailVerification();
        return successResponse(newUser.toJSON(), { status: 201 });
    } catch (error) {
        return serverErrorResponse("Failed to create user");
    }
}, ['ADMIN']); // 管理者のみ登録可能