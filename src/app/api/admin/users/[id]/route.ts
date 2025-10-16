import { notFoundResponse, successResponse, errorResponse, unauthorizedResponse } from "@/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { User } from "@/lib/service/user";

export async function GET(
    _: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const user = await User.get({ id });
        if (user) {
            return successResponse({ user });
        }
    } catch (e) {

    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 認証チェック
        const currentUser = await User.current();
        if (!currentUser || currentUser.role !== "ADMIN") {
            return NextResponse.json(
                { error: { message: "権限がありません" } },
                { status: 403 }
            );
        }

        const { id } = await context.params;
        const body = await request.json();
        const { name, email, role, team } = body;

        const user = await User.get({ id });
        if (!user) {
            return notFoundResponse("ユーザーが見つかりません");
        }

        const result = await user.update({ name, email, role, team });
        return successResponse({ user: result, message: "ユーザー情報を更新しました" });
    } catch (error) {
        console.error("User update error:", error);
        return errorResponse("ユーザーの更新に失敗しました", { status: 500 });
    }
}

export async function DELETE(
    _: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 認証チェック
        const [currentUser, { id }] = await Promise.all([User.current(), context.params]);
        if (!currentUser || currentUser.role !== "ADMIN") {
            return unauthorizedResponse("権限がありません");
        }

        // 自分自身を削除しようとしていないかチェック
        if (currentUser.id === id) {
            return errorResponse("自分自身を削除することはできません", { status: 400 });
        }

        // ユーザーを削除（Cascadeで関連データも削除される）
        await prisma.user.delete({
            where: { id },
        });

        return successResponse({ message: "ユーザーを削除しました" });
    } catch (error) {
        console.error("User delete error:", error);
        return errorResponse("ユーザーの削除に失敗しました", { status: 500 });
    }
}
