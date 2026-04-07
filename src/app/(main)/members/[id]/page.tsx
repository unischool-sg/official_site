import type { Metadata } from "next";
import {
    Mail,
    Calendar,
    Users,
    Award,
    ArrowLeft,
    Instagram,
    Github,
} from "lucide-react";
import { Blog } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/service/user";
import Image from "next/image";
import Link from "next/link";

interface Context {
    params: Promise<{ id: string }>;
}

// 安全にHTMLをエスケープ
function escapeHtml(str: string) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// bio内のURLをaタグ化し、改行を<br>に変換
function linkifyBio(text: string): string {
    const escaped = escapeHtml(text);
    const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/gi;
    const linked = escaped.replace(urlRegex, (match) => {
        const href = match.startsWith("http") ? match : `https://${match}`;
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-primary underline break-all">${match}</a>`;
    });
    return linked.replace(/\n/g, "<br />");
}

// ロールのラベルと色
const roleConfig = {
    ADMIN: {
        label: "管理者",
        color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    },
    TEAM_LEADER: {
        label: "チームリーダー",
        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    },
    MEMBER: {
        label: "メンバー",
        color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
};

// チームのラベルと色
const teamConfig = {
    EDIT: {
        label: "編集チーム",
        color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        icon: "✂️",
    },
    VIDEO: {
        label: "撮影チーム",
        color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
        icon: "📹",
    },
    DEVELOP: {
        label: "開発チーム",
        color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
        icon: "💻",
    },
    ALL: {
        label: "全体",
        color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
        icon: "🌐",
    },
};

export async function generateMetadata({ params }: Context): Promise<Metadata> {
    const { id } = await params;
    const user = await User.get({ id }, true);
    if (!user || !user.profile) return {
        title: "Member not found",
        description: "メンバーが見つかりません。"
    }

    return {
        title: user.name + "のプロフィール",
        description: user.profile.bio
    }
}

export default async function MemberPage({ params }: Context) {
    const { id } = await params;
    const user = await User.get({ id }, true, true);
    const blogs = user?.blogs || [];

    if (!user) {
        return (
            <Container className="py-20">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">
                            メンバーが見つかりませんでした
                        </p>
                        <Link href="/#members">
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                メンバー一覧に戻る
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    // プロフィールが非公開の場合
    if (!user.profile?.isPublic) {
        return (
            <Container className="py-20">
                <Card className="max-w-2xl mx-auto">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground">
                            このメンバーのプロフィールは非公開です
                        </p>
                        <Link href="/#members">
                            <Button variant="outline" className="mt-4">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                メンバー一覧に戻る
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    const roleInfo = roleConfig[user.role as keyof typeof roleConfig];
    const teamInfo = teamConfig[user.team as keyof typeof teamConfig];
    const joinDate = new Date(user.createdAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const bioHtml = linkifyBio(user.profile?.bio || "");

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-900">
            <Container className="py-12">
                {/* 戻るボタン */}
                <Link href="/#members">
                    <Button variant="ghost" size="sm" className="mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        メンバー一覧に戻る
                    </Button>
                </Link>

                <div className="max-w-4xl mx-auto">
                    {/* ヘッダーカード */}
                    <Card className="overflow-hidden border-2">
                        <div className="h-32 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600" />
                        <CardContent className="relative pt-0 pb-6">
                            {/* アバター */}
                            <div className="flex flex-col md:flex-row gap-6 -mt-16 md:-mt-12">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-xl">
                                        {user.profile?.avatarUrl ? (
                                            <Image
                                                src={user.profile.avatarUrl}
                                                alt={user.name}
                                                width={128}
                                                height={128}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-5xl font-bold text-white">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 名前とバッジ */}
                                <div className="flex-1 mt-4 md:mt-8">
                                    <div className="flex flex-wrap items-center gap-3 mb-3">
                                        <h1 className="text-3xl md:text-4xl font-bold">
                                            {user.name}
                                        </h1>
                                        {/* SNSリンク */}
                                        <div className="flex items-center gap-2">
                                            {user.profile?.twitterUsername && (
                                                <Link
                                                    href={`https://twitter.com/${user.profile.twitterUsername}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                                                    title={`@${user.profile.twitterUsername}`}
                                                >
                                                    <svg
                                                        className="h-5 w-5 text-blue-600 dark:text-blue-400"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                    </svg>
                                                </Link>
                                            )}
                                            {user.profile
                                                ?.instagramUsername && (
                                                <Link
                                                    href={`https://instagram.com/${user.profile.instagramUsername}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/30 hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                                                    title={`@${user.profile.instagramUsername}`}
                                                >
                                                    <Instagram className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                                </Link>
                                            )}
                                            {user.profile?.githubUsername && (
                                                <Link
                                                    href={`https://github.com/${user.profile.githubUsername}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                                    title={
                                                        user.profile
                                                            .githubUsername
                                                    }
                                                >
                                                    <Github className="h-5 w-5 text-gray-800 dark:text-gray-200" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {roleInfo && (
                                            <Badge className={roleInfo.color}>
                                                <Award className="h-3 w-3 mr-1" />
                                                {roleInfo.label}
                                            </Badge>
                                        )}
                                        {teamInfo && (
                                            <Badge className={teamInfo.color}>
                                                <span className="mr-1">
                                                    {teamInfo.icon}
                                                </span>
                                                {teamInfo.label}
                                            </Badge>
                                        )}
                                    </div>
                                    {user.profile.bio && (
                                        <p
                                            className="text-muted-foreground leading-relaxed"
                                            dangerouslySetInnerHTML={{
                                                __html: bioHtml,
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 詳細情報 */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        {/* 基本情報 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    基本情報
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            参加日
                                        </p>
                                        <p className="font-medium">
                                            {joinDate}
                                        </p>
                                    </div>
                                </div>
                                {user.emailVerified && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                メール認証
                                            </p>
                                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mt-1">
                                                認証済み
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* 活動情報 */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <Award className="h-5 w-5 text-primary" />
                                    役割と活動
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        所属チーム
                                    </p>
                                    {teamInfo && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">
                                                {teamInfo.icon}
                                            </span>
                                            <span className="font-medium">
                                                {teamInfo.label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        役職
                                    </p>
                                    {roleInfo && (
                                        <Badge
                                            className={`${roleInfo.color} text-base px-3 py-1`}
                                        >
                                            {roleInfo.label}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 自己紹介（bioが長い場合用） */}
                    {user.profile.bio && user.profile.bio.length > 100 && (
                        <Card className="mt-6">
                            <CardHeader>
                                <h2 className="text-xl font-semibold">
                                    自己紹介
                                </h2>
                            </CardHeader>
                            <CardContent>
                                <p
                                    className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                                    dangerouslySetInnerHTML={{
                                        __html: bioHtml,
                                    }}
                                />
                            </CardContent>
                        </Card>
                    )}

                    {/* ブログ一覧 */}
                    <Card className="mt-6">
                        <CardHeader>
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <span className="text-2xl">📝</span>
                                投稿したブログ
                            </h2>
                        </CardHeader>
                        <CardContent>
                            {blogs.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                        <span className="text-3xl">📝</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">
                                        まだブログがありません
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        このメンバーはまだブログを投稿していません
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {blogs.map((blog: Blog) => {
                                        const publishDate = new Date(
                                            blog.publishedAt || blog.createdAt,
                                        ).toLocaleDateString("ja-JP", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });

                                        return (
                                            <Link
                                                key={blog.id}
                                                href={`/blogs/${blog.slug || blog.id}`}
                                                className="block group"
                                            >
                                                <Card className="transition-all hover:shadow-lg hover:scale-[1.02] border-2 hover:border-primary/50">
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col gap-4">
                                                            {/* コンテンツ */}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    {blog.published ? (
                                                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                                            公開中
                                                                        </Badge>
                                                                    ) : (
                                                                        <Badge variant="outline">
                                                                            下書き
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                                    {blog.title}
                                                                </h3>
                                                                {blog.content && (
                                                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                                                                        {blog.content
                                                                            .replace(
                                                                                /<[^>]*>/g,
                                                                                "",
                                                                            )
                                                                            .substring(
                                                                                0,
                                                                                150,
                                                                            )}
                                                                        ...
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-3 w-3" />
                                                                        {
                                                                            publishDate
                                                                        }
                                                                    </div>
                                                                    {blog.slug && (
                                                                        <div className="flex items-center gap-1">
                                                                            <span>
                                                                                �
                                                                            </span>
                                                                            {
                                                                                blog.slug
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </Container>
        </div>
    );
}
