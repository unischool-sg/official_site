import { User } from "@/lib/service/user";
import LoginHistoryView from "@/components/layout/login-history";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Context {
    params: Promise<{ id: string }>;
}

export default async function HistoryPage({ params }: Context) {
    const { id } = await params;
    const user = await User.get({ id }, true);
    if (!user) {
        return <div>User not found</div>;
    }

    const history = user.loginHistory || [];

    return (
        <div className="p-6 space-y-6">
            {/* 戻るボタン */}
            <Link href={`/admin/users/${id}`}>
                <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    ユーザー詳細に戻る
                </Button>
            </Link>

            {/* ログイン履歴表示 */}
            <LoginHistoryView history={history} userName={user.name} />
        </div>
    );
}