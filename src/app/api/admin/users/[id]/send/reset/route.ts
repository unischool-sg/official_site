import {
     serverErrorResponse,
     successResponse,
     forbiddenResponse,
     notFoundResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

interface Context {
     params: Promise<{ id: string }>;
}

export async function POST(_: NextRequest, context: Context) {
     const [{ id }, user] = await Promise.all([context.params, User.current()]);
     if (!user || user.role !== "ADMIN") {
          return forbiddenResponse("権限がありません");
     }
     const targetUser = await User.get({ id });
     if (!targetUser) {
          return notFoundResponse("ユーザーが存在しません");
     }

     try {
          await targetUser.sendPasswordResetEmail();
          return successResponse("パスワードリセットメールを再送しました");
     } catch (error) {
          return serverErrorResponse(
               "パスワードリセットメールの送信に失敗しました",
          );
     }
}
