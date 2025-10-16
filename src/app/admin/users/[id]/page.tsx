import { ArrowLeft, Mail, Calendar, Shield, Users, CheckCircle2, XCircle, KeyRound, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/service/user";
import Buttons from "@/components/layout/buttons";
import Link from "next/link";

interface ControlContext {
    params: Promise<{ id: string }>;
}

export default async function UserPage(context: ControlContext) {
    const { id } = await context.params;
    const user = await User.get({ id });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-destructive">ユーザーが見つかりません</CardTitle>
                        <CardDescription>指定されたIDのユーザーは存在しません</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/admin/users">
                            <Button variant="outline" className="w-full">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                ユーザー一覧に戻る
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const userData = user.toJSON();
    const roleColors: Record<string, string> = {
        ADMIN: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
        MEMBER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };

    const teamColors: Record<string, string> = {
        ALL: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        VIDEO: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
        EDIT: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        DEVELOP: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <Link href="/admin/users">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            戻る
                        </Button>
                    </Link>
                </div>

                {/* メインカード */}
                <Card className="shadow-lg border-0">
                    <CardHeader className="space-y-4 pb-8">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    {userData.name}
                                </CardTitle>
                                <CardDescription className="text-base flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    {userData.email}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                                <Badge className={roleColors[userData.role]}>
                                    <Shield className="mr-1 h-3 w-3" />
                                    {userData.role}
                                </Badge>
                                <Badge className={teamColors[userData.team]}>
                                    <Users className="mr-1 h-3 w-3" />
                                    {userData.team}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-6 space-y-6">
                        {/* 認証ステータス */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                認証ステータス
                            </h3>
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                                {userData.emailVerified ? (
                                    <>
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-green-700 dark:text-green-400">認証済み</p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(userData.emailVerified).toLocaleString('ja-JP', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                            <XCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-700 dark:text-gray-400">未認証</p>
                                            <p className="text-sm text-muted-foreground">
                                                メールアドレスの確認が必要です
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* 基本情報 */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                基本情報
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 p-4 rounded-lg bg-muted/20">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>登録日</span>
                                    </div>
                                    <p className="font-medium">
                                        {new Date(userData.createdAt).toLocaleString('ja-JP', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="space-y-2 p-4 rounded-lg bg-muted/20">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <span>最終更新</span>
                                    </div>
                                    <p className="font-medium">
                                        {new Date(userData.updatedAt).toLocaleString('ja-JP', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* ID情報 */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                システム情報
                            </h3>
                            <div className="p-4 rounded-lg bg-muted/20 font-mono text-sm">
                                <span className="text-muted-foreground">User ID:</span>{" "}
                                <span className="text-foreground">{userData.id}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* アクションボタン */}
                <Card className="shadow-lg border-0">
                    <CardContent className="pt-6">
                        <Buttons userData={userData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

