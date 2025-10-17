"use server";
import { successResponse, unauthorizedResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

interface Context {
    params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: Context) {
    const { id } = await context.params;
    const user = await User.get({ id }, true);
    if (!user) {
        return unauthorizedResponse("ユーザーが見つかりません");
    }
    return successResponse({ profile: user.profile });
}