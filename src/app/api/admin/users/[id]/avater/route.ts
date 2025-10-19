import {
    unauthorizedResponse,
    serverErrorResponse,
    validationErrorResponse,
    successResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

interface Context {
    params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, context: Context) {
    try {
        const [formData, user, { id }] = await Promise.all([
            req.formData(),
            User.current(),
            context.params,
        ]);
        if (!user || user.role !== "ADMIN") {
            return unauthorizedResponse("認証が必要です");
        }
        const targetUser = await User.get({ id });
        if (!targetUser) {
            return validationErrorResponse(["対象ユーザーが存在しません"]);
        }

        const avatarFile = formData.get("avatar") as File | null;
        if (!avatarFile) {
            return validationErrorResponse([
                "アバター画像が提供されていません",
            ]);
        }

        // ファイルをバイナリとして読み込む
        const arrayBuffer = await avatarFile.arrayBuffer();

        // アバター画像をアップロード
        const response = await fetch(
            `https://storage.evex.land/upload?filename=${targetUser.id}`,
            {
                method: "POST",
                body: arrayBuffer,
                headers: {
                    "Content-Type": avatarFile.type,
                },
            },
        );

        if (!response.ok) {
            return serverErrorResponse(
                "アバター画像のアップロードに失敗しました",
                { status: response.status, body: await response.text() },
            );
        }

        // レスポンスからdownloadKeyを取得
        const result = await response.json();
        const downloadKey = result.downloadKey;

        if (!downloadKey) {
            return serverErrorResponse("downloadKeyの取得に失敗しました");
        }

        // データベースのavatarUrlを更新
        // TODO: Prismaを使ってuser.profile.avatarUrlを更新する処理を追加
        // 例: await prisma.profile.update({ where: { userId: user.id }, data: { avatarUrl: `https://storage.evex.land/${downloadKey}` } })
        const imageUrl = `https://storage.evex.land/download?key=${encodeURIComponent(downloadKey)}`;
        await targetUser.upsertProfile({ avatarUrl: imageUrl });

        return successResponse({ avatarUrl: imageUrl });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return serverErrorResponse(
            "アバター画像のアップロード中にエラーが発生しました",
        );
    }
}
