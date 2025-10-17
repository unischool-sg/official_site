"use client";
import { handlePasswordReset } from "@/handlers/reset";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface ResetPasswordFormProps {
    token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <form onSubmit={(e) => handlePasswordReset(e, setIsLoading, setError, router)} className="space-y-8">
            <input type="hidden" name="token" value={token} />
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="password" className="text-base font-medium">
                        新しいパスワード <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="8文字以上"
                        required
                        minLength={8}
                        className="h-14 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                    />
                    <p className="text-sm text-muted-foreground">
                        英数字を含む8文字以上のパスワードを入力してください
                    </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="confirmPassword" className="text-base font-medium">
                        パスワード（確認） <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="パスワードを再入力"
                        required
                        minLength={8}
                        className="h-14 text-base transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                    />
                </div>
            </div>

            {/* 安全性のヒント */}
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <KeyRound className="h-4 w-4" />
                    安全なパスワードのヒント
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1 ml-6 list-disc">
                    <li>8文字以上の長さ</li>
                    <li>大文字と小文字を組み合わせる</li>
                    <li>数字や記号を含める</li>
                    <li>推測されやすい単語を避ける</li>
                </ul>
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        <span>処理中...</span>
                    </div>
                ) : (
                    <>
                        <KeyRound className="mr-2 h-5 w-5" />
                        パスワードをリセット
                    </>
                )}
            </Button>

            <div className="text-center text-base text-muted-foreground">
                パスワードを思い出しましたか？{" "}
                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="text-primary hover:underline font-medium"
                >
                    ログイン
                </button>
            </div>
        </form>
    );
}
