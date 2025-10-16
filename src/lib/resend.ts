import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
async function send(to: string, subject: string, html: string) {
    return await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "",
        to,
        subject,
        html,
    });
}
export { resend, send };