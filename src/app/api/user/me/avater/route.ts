import {
     unauthorizedResponse,
     serverErrorResponse,
     validationErrorResponse,
     successResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

export async function GET(req: NextRequest) {
     try {
          const user = await User.current(true);
          if (!user) {
               return unauthorizedResponse("認証が必要です");
          }

          // アバターURLが存在しない場合
          if (!user.profile?.avatarUrl) {
               // デフォルトのアバター画像を返す、または404
               return new Response(null, { status: 404 });
          }

          // アバター画像を取得
          const response = await fetch(user.profile.avatarUrl, {
               method: "GET",
               headers: {
                    "User-Agent":
                         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
               },
          });

          // 取得に失敗した場合
          if (!response.ok) {
               return new Response(null, { status: 404 });
          }

          // レスポンスのボディを取得
          const blob = await response.blob();

          // 画像を返す
          return new Response(blob, {
               status: 200,
               headers: {
                    "Content-Type":
                         response.headers.get("Content-Type") || "image/png",
                    "Cache-Control": "public, max-age=3600", // 1時間キャッシュ
               },
          });
     } catch (error) {
          console.error("Avatar fetch error:", error);
          return serverErrorResponse("アバター画像の取得に失敗しました");
     }
}

export async function POST(req: NextRequest) {
     try {
          const [formData, user] = await Promise.all([
               req.formData(),
               User.current(),
          ]);
          if (!user) {
               return unauthorizedResponse("認証が必要です");
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
               `https://storage.evex.land/upload?filename=${user.id}`,
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
          await user.upsertProfile({ avatarUrl: imageUrl });

          return successResponse({ avatarUrl: imageUrl });
     } catch (error) {
          console.error("Avatar upload error:", error);
          return serverErrorResponse(
               "アバター画像のアップロード中にエラーが発生しました",
          );
     }
}
