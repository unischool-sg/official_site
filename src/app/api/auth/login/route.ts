"use server";
import {
     successResponse,
     notFoundResponse,
     errorResponse,
} from "@/lib/api/response";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
     const [{ email, password }, store] = await Promise.all([
          req.json(),
          cookies(),
     ]);

     const user = await User.get({ email });
     if (!user) {
          return notFoundResponse("User not found");
     }

     const userAgent = req.headers.get("user-agent") || undefined;
     const ipAddress =
          req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          req.headers.get("x-real-ip") ||
          undefined;

     const token = await user.login(password, {
          userAgent,
          ipAddress,
     });
     if (!token) {
          return errorResponse("Invalid password", { status: 401 });
     }

     store.set("s-token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60, // 7 days
     });

     await user.sendLoginNotificationEmail(
          ipAddress || "不明",
          userAgent || "不明",
     );

     return successResponse({ token });
}
