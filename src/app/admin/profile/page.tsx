import {
    UserCircle2,
    Mail,
    Shield,
    Users,
    Calendar,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/service/user";
import ProfileUpdateForm from "@/components/layout/profile";

export default async function ProfilePage() {
    const user = await User.current(true);
    if (!user) {
        redirect("/login");
    }

    const roleColors: Record<string, string> = {
        ADMIN: "bg-neutral-100 text-neutral-700",
        TEAM_LEADER: "bg-neutral-100 text-neutral-700",
        MEMBER: "bg-neutral-100 text-neutral-700",
    };

    const teamColors: Record<string, string> = {
        ALL: "bg-neutral-100 text-neutral-700",
        VIDEO: "bg-neutral-100 text-neutral-700",
        EDIT: "bg-neutral-100 text-neutral-700",
        DEVELOP: "bg-neutral-100 text-neutral-700",
        NONE: "bg-neutral-100 text-neutral-700",
    };

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* ヘッダー */}
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-neutral-950 flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {user.email}
                    </p>
                </div>
            </div>

            {/* プロフィール情報 */}
            <Card className="border border-neutral-200 shadow-none">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <UserCircle2 className="h-5 w-5 text-primary" />
                        <CardTitle>プロフィール情報</CardTitle>
                    </div>
                    <CardDescription>
                        あなたのアカウント情報を確認できます
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* 基本情報 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 rounded-lg bg-muted/20">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Shield className="h-4 w-4" />
                                <span>ロール</span>
                            </div>
                            <Badge className={roleColors[user.role]}>
                                <Shield className="mr-1 h-3 w-3" />
                                {user.role}
                            </Badge>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/20">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>チーム</span>
                            </div>
                            <Badge className={teamColors[user.team]}>
                                <Users className="mr-1 h-3 w-3" />
                                {user.team}
                            </Badge>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/20">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>登録日</span>
                            </div>
                            <p className="font-medium">
                                {new Date(user.createdAt).toLocaleString(
                                    "ja-JP",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    },
                                )}
                            </p>
                        </div>

                        <div className="space-y-2 p-4 rounded-lg bg-muted/20">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>認証ステータス</span>
                            </div>
                            {user.emailVerified ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="font-medium">
                                        認証済み
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <XCircle className="h-4 w-4" />
                                    <span className="font-medium">未認証</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* ID情報 */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            システム情報
                        </h3>
                        <div className="p-4 rounded-lg bg-muted/20 font-mono text-sm">
                            <span className="text-muted-foreground">
                                User ID:
                            </span>{" "}
                            <span className="text-foreground">{user.id}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* アカウント設定 */}
            <Card className="border border-neutral-200 shadow-none">
                <CardHeader>
                    <CardTitle>アカウント設定</CardTitle>
                    <CardDescription>
                        プロフィール情報を更新できます
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileUpdateForm
                        user={{
                            ...user.toJSON(),
                            profile: (user as any).profile ?? null,
                        }}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
