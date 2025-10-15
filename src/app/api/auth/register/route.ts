import {
  successResponse,
  errorResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
  try {
    // 現在のユーザーを取得（認証チェック）
    const currentUser = await User.current();
    if (!currentUser || currentUser.role !== "ADMIN") {
      return unauthorizedResponse("管理者権限が必要です");
    }

    const { email } = await req.json();

    // 既に存在するか確認
    const existingUser = await User.get({ email });
    if (existingUser) {
      return errorResponse("ユーザーは既に存在します");
    }

    // 新規ユーザー作成
    try {
      const password = Math.random().toString(36).slice(-8);
      const newUser = await User.new({ email, password });
      await newUser.sendEmailVerification();
      return successResponse(newUser.toJSON());
    } catch (error) {
      console.error("User creation error:", error);
      return serverErrorResponse("ユーザーの作成に失敗しました");
    }
  } catch (error) {
    console.error("Register API error:", error);
    return serverErrorResponse("登録処理中にエラーが発生しました");
  }
}