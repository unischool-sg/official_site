import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";



interface Context {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Context): Promise<Metadata> {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
        where: { slug },
        select: {
            title: true,
            content: true,
            author: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!blog) {
        return {
            title: "ブログが見つかりません",
        };
    }

    // HTMLタグを除去してプレビューテキストを生成
    const plainText = blog.content.replace(/<[^>]*>/g, "").trim();
    const description = plainText.substring(0, 160) + (plainText.length > 160 ? "..." : "");

    return {
        title: blog.title,
        description: description,
        authors: [{ name: blog.author.name }],
        openGraph: {
            title: blog.title,
            description: description,
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: description,
        },
    };
}

export default async function BlogsPage({ params }: Context) {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
        where: { slug },
        include: {
            author: {
                select: {
                    name: true,
                    profile: {
                        select: {
                            bio: true,
                            avatarUrl: true,
                        },
                    },
                    id: true,
                },
            },
        },
    });

    if (!blog || !blog.published) {
        notFound();
    }

    const authorName = blog.author.name;
    const authorAvatar = blog.author.profile?.avatarUrl;
    const authorBio = blog.author.profile?.bio;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <article className="space-y-6">
                {/* ヘッダー部分 */}
                <div className="space-y-4">
                    <Badge variant="outline" className="mb-2">
                        ブログ記事
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {blog.title}
                    </h1>

                    {/* メタ情報 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Link href={`/members/${blog.author.id}`} className="flex items-center gap-2">
                                {authorAvatar ? (
                                    <img
                                        src={authorAvatar}
                                        alt={authorName}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
                                        {authorName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <span className="font-medium">{authorName}</span>
                            </Link>

                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            <time dateTime={blog.createdAt.toISOString()}>
                                {new Date(blog.createdAt).toLocaleDateString("ja-JP", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </time>
                        </div>
                        {blog.updatedAt.getTime() !== blog.createdAt.getTime() && (
                            <span className="text-xs">
                                (更新: {new Date(blog.updatedAt).toLocaleDateString("ja-JP")})
                            </span>
                        )}
                    </div>
                </div>

                {/* 区切り線 */}
                <hr className="border-border" />

                {/* ブログ本文 */}
                <Card className="p-6 lg:p-8">
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-img:rounded-lg"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </Card>

                {/* 著者情報 */}
                {authorBio && (
                    <Card className="p-6 bg-muted/50">
                        <div className="flex items-start gap-4">
                            {authorAvatar ? (
                                <img
                                    src={authorAvatar}
                                    alt={authorName}
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                                    {authorName.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1">
                                <Link href={`/members/${blog.author.id}`}>
                                    <h3 className="font-semibold text-lg mb-1">{authorName}</h3>
                                    <p className="text-sm text-muted-foreground">{authorBio}</p>
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                {/* フッター情報 */}
                <div className="pt-6 border-t border-border">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-sm text-muted-foreground">
                        <p>このブログは {authorName} によって投稿されました。</p>
                        <p className="text-xs">記事ID: {blog.id}</p>
                    </div>
                </div>
            </article>
        </div>
    );
}