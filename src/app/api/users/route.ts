"use server";
import { successResponse, serverErrorResponse } from "@/lib/api/response";
import { User } from "@/lib/service/user";

export async function GET() {
     try {
          const users = await User.all();
          const filteredUsers = users
               .map((user) => {
                    return user.toJSON();
               })
               .map(({ email, ...rest }) => rest); // メールアドレスを除外
          return successResponse({
               message: "ユーザー一覧を取得しました",
               users: filteredUsers,
          });
     } catch (error) {
          console.error("Profile fetch error:", error);
          return serverErrorResponse("プロフィールの取得に失敗しました", error);
     }
}
