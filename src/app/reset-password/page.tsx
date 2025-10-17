import TokenNotFound from "@/components/layout/token";
import { Token } from "@/lib/service/token";
import ResetPasswordForm from "@/components/layout/reset";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";

interface ResetPasswordPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
    const { token } = await searchParams;
    const isExistingToken = await Token.get(token ?? "");

    if (!isExistingToken || isExistingToken.isActive("PASSWORD_RESET") === false) {
        return <TokenNotFound />
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-background/60 p-4 md:p-8">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <BlurFade delay={0.3} inView>
                <Card className="w-full max-w-3xl mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="space-y-4 text-center pb-8">
                        <div className="flex justify-center mb-4">
                            <div className="relative">
                                <Image
                                    src="/assets/logo.png"
                                    alt="Uni School Logo"
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
                            </div>
                        </div>
                        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            パスワードリセット
                        </CardTitle>
                        <CardDescription className="text-lg text-muted-foreground">
                            新しいパスワードを設定してください
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 md:px-12 pb-12">
                        <ResetPasswordForm token={token ?? ""} />
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    )
}