import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
    return (
        <Container className="py-20">
            <div className="max-w-2xl mx-auto text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-8">
                    <FileQuestion className="h-12 w-12 text-muted-foreground" />
                </div>
                
                <h1 className="text-4xl font-bold tracking-tight">
                    ブログが見つかりません
                </h1>
                
                <p className="text-lg text-muted-foreground">
                    お探しのブログ記事は削除されたか、非公開になっている可能性があります。
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                    <Link href="/blogs">
                        <Button variant="default" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            ブログ一覧に戻る
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="gap-2">
                            <Home className="h-4 w-4" />
                            ホームに戻る
                        </Button>
                    </Link>
                </div>
            </div>
        </Container>
    );
}
