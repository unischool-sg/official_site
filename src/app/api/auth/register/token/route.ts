"use server";
import {
     createdResponse,
     unauthorizedResponse,
     validationErrorResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Token } from "@/lib/service/token";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
     const authToken = await req.headers
          .get("authorization")
          ?.replace("Bearer ", "");
     if (!authToken) {
          return unauthorizedResponse("トークンが提供されていません");
     }
     const token = await Token.get(authToken);
     console.log(token);
     if (
          !token ||
          token.expires < new Date() ||
          token.type !== "REGISTRATION_CONFIRMATION"
     ) {
          return unauthorizedResponse("無効なトークンです");
     }
     const [user, data] = await Promise.all([token.user, req.json()]);
     if (!user) {
          return unauthorizedResponse(
               "トークンに関連付けられたユーザーが見つかりません",
          );
     }

     const { name, bio, password }: { [key: string]: string } = data;
     if (!name || !password) {
          return validationErrorResponse([
               "名前は必須です",
               "パスワードは必須です",
          ]);
     }
     const hashedPassword = await User.hashPassword(password);
     await Promise.all([
          user.update({ name, password: hashedPassword }),
          user.upsertProfile({ bio }),
          user.verifyEmail(),
          token.delete(),
     ]);
     const [login, store] = await Promise.all([
          user.login(password, {
               userAgent: req.headers.get("user-agent") || undefined,
          }),
          cookies(),
     ]);

     if (!login) {
          return unauthorizedResponse("ログインに失敗しました。手動ログインをお願いします");
     }

     store.set("s-token", login, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60, // 7 days
     });

     return createdResponse({
          user,
          message: "アカウントが作成され、ログインしました",
     });
}
