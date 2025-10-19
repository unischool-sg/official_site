import { User } from "@/lib/service/user";
import ProfileUpdateForm from "@/components/layout/profile";

interface Context {
    params: Promise<{ id: string }>;
}

export default async function ProfilePage(context: Context) {
    const [currentUser, { id }] = await Promise.all([
        User.current(),
        context.params,
    ]);
    if (!currentUser || currentUser.role !== "ADMIN") {
        return <div>権限がありません</div>;
    }

    // プロフィール情報を含めて取得
    const targetUser = await User.get({ id }, true);
    if (!targetUser) {
        return <div>ユーザーが見つかりません</div>;
    }
    const userData = (typeof (targetUser as any)?.toJSON === "function")
        ? (targetUser as any).toJSON()
        : targetUser as any;

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">ユーザープロフィール編集</h1>
                <p className="text-muted-foreground">管理者として、対象ユーザーのプロフィールを更新できます</p>
            </div>

            <ProfileUpdateForm
                user={userData as any}
                endpoint={`/api/admin/users/${id}`}
            />
        </div>
    );
}