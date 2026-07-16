import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
    return (
        <Container className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center space-y-6">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold text-primary">403</h1>
                <h2 className="text-2xl sm:text-3xl font-semibold">
                    アクセスが拒否されました
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                    このページにアクセスする権限がありません。
                    <br />
                    メンバー権限、または管理者権限が必要です。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild>
                        <Link href="/">ホームに戻る</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/login">ログイン</Link>
                    </Button>
                </div>
            </div>
        </Container>
    );
}
