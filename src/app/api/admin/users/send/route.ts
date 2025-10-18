import {
    serverErrorResponse,
    successResponse,
    forbiddenResponse,
    notFoundResponse,
} from "@/lib/api/response";
import { emailTemplates } from "@/mails/mail";
import { NextRequest } from "next/server";
import { resend } from "@/lib/resend";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
    try {
        const user = await User.current();
        if (!user || user.role !== "ADMIN") {
            return forbiddenResponse("管理者権限が必要です");
        }

        const { subject, body } = await req.json();
        if (!subject || !body) {
            return forbiddenResponse("件名と本文は必須です");
        }

        const users = await User.all();
        const emails = users.map((u) => u.email).filter((email) => email && email !== user.email);
        if (emails.length === 0) {
            return notFoundResponse("送信先のユーザーが見つかりません");
        }

        await resend.emails.send({
            from: user.email,
            to: user.email,
            bcc: user.email,
            subject: `【UniSchool】${subject}`,
            html: emailTemplates(subject, body),
        });
        return successResponse("メールを送信しました");
    } catch (error) {
        console.error(error);
        return serverErrorResponse("メールの送信に失敗しました");
    }
}