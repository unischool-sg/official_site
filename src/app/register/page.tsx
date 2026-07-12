import TokenNotFound from "@/components/layout/token";
import RegisterForm from "@/components/layout/register";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Token } from "@/lib/service/token";

interface RegisterPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function RegisterPage({
    searchParams,
}: RegisterPageProps) {
    const { token } = await searchParams;
    const isExistingToken = await Token.get(token ?? "");
    if (
        !isExistingToken ||
        isExistingToken.expires < new Date() ||
        isExistingToken.type !== "REGISTRATION_CONFIRMATION"
    )
        return <TokenNotFound />;

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4 md:p-8">
            <BlurFade delay={0.3} inView>
                <Card className="w-full max-w-6xl mx-auto border border-neutral-200 bg-white shadow-none">
                    <CardHeader className="space-y-4 text-center pb-8">
                        <div className="flex justify-center mb-4">
                            <Image
                                src="/assets/logo.png"
                                alt="UniSchool Logo"
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                        </div>
                        <CardTitle className="text-4xl font-bold text-neutral-950">
                            アカウント登録
                        </CardTitle>
                        <CardDescription className="text-lg text-muted-foreground">
                            UniSchool クリエイターチームへようこそ
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-6 md:px-12 pb-12">
                        <RegisterForm token={token} />
                    </CardContent>
                </Card>
            </BlurFade>
        </div>
    );
}
