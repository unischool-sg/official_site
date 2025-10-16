"use server";
import { successResponse, notFoundResponse, errorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
    const [{ email, password }, store] = await Promise.all([req.json(), cookies()]);

    const user = await User.get({ email });
    if (!user) {
        return notFoundResponse("User not found");
    }

    const token = await user.login(password);
    if (!token) {
        return errorResponse("Invalid password", { status: 401 });
    }

    store.set("s-token", token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return successResponse({ token });
}