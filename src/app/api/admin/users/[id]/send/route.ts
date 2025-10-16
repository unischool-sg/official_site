import { serverErrorResponse, successResponse, forbiddenResponse, notFoundResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { User } from "@/lib/service/user";

interface Context {
     params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: Context) {
    const [{ id }, user] = await Promise.all([
        context.params,
        User.current(),
    ]);
    if (!user || user.role !== "ADMIN") {
        return forbiddenResponse("権限がありません");
    }

    return successResponse({ user: await User.get({ id }) });
}