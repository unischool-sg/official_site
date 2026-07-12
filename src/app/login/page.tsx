"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { handleLogin } from "@/handlers/login";
import { useRouter } from "next/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
            <BlurFade delay={0.3} inView>
                <Card className="w-full max-w-md mx-auto border border-neutral-200 bg-white shadow-none">
                    <CardHeader className="space-y-4 text-center pb-6">
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/assets/logo.png"
                                alt="UniSchool Logo"
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        </div>
                        <CardTitle className="text-3xl font-bold text-neutral-950">
                            UniSchool
                        </CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                            クリエイターチームへのログイン
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form
                            onSubmit={(e) =>
                                handleLogin(e, setIsLoading, setError, router)
                            }
                            className="space-y-6"
                        >
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    メールアドレス
                                </Label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    className="h-12"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    パスワード
                                </Label>
                                <Input
                                    name="password"
                                    type="password"
                                    placeholder="•••••••"
                                    required
                                    className="h-12"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base font-medium bg-neutral-950 hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                        <span>ログイン中...</span>
                                    </div>
                                ) : (
                                    "ログイン"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                We are team of Creators. We are students. But we
                                are pro.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
