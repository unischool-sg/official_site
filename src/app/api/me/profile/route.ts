"use server";
import {
     successResponse,
     unauthorizedResponse,
     serverErrorResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

export async function GET() {
     const user = await User.current(true);
     if (!user) {
          return unauthorizedResponse("認証が必要です");
     }

     return successResponse({ user: user.toJSON() });
}

export async function POST(req: NextRequest) {
     const user = await User.current();
     if (!user) {
          return unauthorizedResponse("認証が必要です");
     }

     try {
          const data = await req.json();
          console.log("Profile update data:", data);
          const name = data.name?.trim() || "";
          const bio = data.bio?.trim() || "";
          const isPublic = data.isPublic;
          console.log("Parsed profile data:", { name, bio, isPublic });

          await Promise.all([
               user.upsertProfile({ bio, isPublic }),
               user.update({ name }),
          ]);

          const newUser = await User.current(true);
          if (!newUser) {
               return serverErrorResponse("ユーザー情報の取得に失敗しました(更新後)");
          }

          return successResponse({ user: newUser.toJSON() });
     } catch (error) {
          console.error("Profile update error:", error);
          return serverErrorResponse(
               "プロフィールの更新中にエラーが発生しました",
          );
     }
}
