"use client";
import { handleRegistTokenUser } from "@/handlers/user";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export default function RegisterForm({ token }: { token?: string }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <form
            onSubmit={(e) =>
                handleRegistTokenUser(e, setIsLoading, setError, router)
            }
            className="space-y-8"
        >
            {error && (
                <div className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                    {error}
                </div>
            )}
            <input type="hidden" name="token" value={token} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-base font-medium">
                        名前 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        name="name"
                        type="text"
                        placeholder="山田 太郎"
                        required
                        className="h-14 text-base"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-medium">
                        パスワード <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        name="password"
                        type="password"
                        placeholder="8文字以上"
                        required
                        minLength={8}
                        className="h-14 text-base"
                    />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label
                        htmlFor="confirmPassword"
                        className="text-base font-medium"
                    >
                        パスワード（確認）{" "}
                        <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        name="confirmPassword"
                        type="password"
                        placeholder="パスワードを再入力"
                        required
                        minLength={8}
                        className="h-14 text-base"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="bio" className="text-base font-medium">
                    自己紹介
                </Label>
                <Textarea
                    name="bio"
                    placeholder="簡単な自己紹介を入力してください（任意）"
                    rows={6}
                    className="resize-none text-base"
                />
            </div>

            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 text-lg font-medium bg-neutral-950 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        <span>登録中...</span>
                    </div>
                ) : (
                    "アカウント登録"
                )}
            </Button>

            <div className="text-center text-base text-muted-foreground">
                すでにアカウントをお持ちですか？{" "}
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
