"use client";
import { Mail, KeyRound, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@prisma/client";
import Link from "next/link";

interface ButtonsProps {
    userData: Omit<User, "password">;
}

export default function Buttons({ userData }: ButtonsProps) {
    const handleDelete = (async () => {
        if (!confirm(`本当に ${userData.name} を削除しますか？`)) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/users/${userData.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("ユーザーを削除しました", {
                    description: `${userData.name} (${userData.email})`,
                });
                // ページをリロード（または親コンポーネントに通知）
                setTimeout(() => window.location.reload(), 1000);
            } else {
                const error = await response.json();
                toast.error("削除に失敗しました", {
                    description:
                        error.error?.message || "エラーが発生しました",
                });
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("ネットワークエラー", {
                description: "サーバーに接続できませんでした",
            });
        }
    });
    const handleSendPasswordReset = (async () => {
        if (!confirm(`${userData.name} にパスワードリセットメールを送信しますか？`)) {
            return;
        }
        toast.loading("パスワードリセットメールを送信中...", { id: "reset" });
        try {
            const response = await fetch(`/api/admin/users/${userData.id}/send/reset`, {
                method: "POST",
            });

            if (response.ok) {
                toast.success("パスワードリセットメールを送信しました", {
                    description: `${userData.email} に送信しました`,
                });
            } else {
                const error = await response.json();
                toast.error("送信に失敗しました", {
                    description:
                        error.error?.message || "エラーが発生しました",
                });
            }
        } catch (error) {
            console.error("Send password reset error:", error);
            toast.error("ネットワークエラー", {
                description: "サーバーに接続できませんでした",
            });
        } finally {

            toast.dismiss("reset");
        }
    });
    const handleResendVerification = (async () => {
        if (!confirm(`${userData.name} に認証メールを再送信しますか？`)) {
            return;
        }

        toast.loading("認証メールを送信中...", { id: "resend" });
        try {
            const response = await fetch(`/api/admin/users/${userData.id}/send/verify`, {
                method: "POST",
            });

            if (response.ok) {
                toast.success("認証メールを送信しました", {
                    description: `${userData.email} に送信しました`,
                });
            } else {
                const error = await response.json();
                toast.error("送信に失敗しました", {
                    description:
                        error.error?.message || "エラーが発生しました",
                });
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            toast.error("ネットワークエラー", {
                description: "サーバーに接続できませんでした",
            });
        } finally {
            toast.dismiss("resend");
        }
    });

    return (
        <div>
            <div className="flex gap-3 mt-3">
                <Button variant="destructive" className="w-full" onClick={handleSendPasswordReset}>
                    <KeyRound className="mr-2 h-4 w-4" />パスワードリセット
                </Button>
                <Button variant="secondary" className="w-full" onClick={handleResendVerification}>
                    <Mail className="mr-2 h-4 w-4" />認証メール再送信
                </Button>
            </div>
            <div className="flex gap-3 mt-3">
                <Link href={`/admin/users/${userData.id}/send`} className="flex-1">
                    <Button variant="destructive" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />メール送信
                    </Button>
                </Link>
            </div>
            <div className="flex gap-3 mt-3">
                <Button variant="destructive" className="w-full" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />ユーザー削除
                </Button>
            </div>
        </div>
    )
}