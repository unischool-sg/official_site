import type { Metadata } from "next";
import { Calendar } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlurFade } from "@/components/ui/blur-fade";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export function generateMetadata(): Metadata {
    return {
        title: "Blogs",
        description: "UniSchoolメンバーの書いたブログ一覧ページです"
    }
}

export default async function BlogsPage() {
    const blogs = await prisma.blog.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        include: {
            author: {
                include: {
                    profile: true,
                },
            },
        },
    });

    return (
        <div className="w-full">
            {/* ヒーローセクション */}
            <div className="w-full border-b border-neutral-200 bg-neutral-100">
                <Container className="py-20">
                    <BlurFade delay={0.2} inView>
                        <div className="text-center">
                            <h1 className="text-5xl font-bold mb-4">
                                Our <span className="text-green-900">Blog</span>
                            </h1>
                            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                                メンバーの活動や技術、日々の出来事を発信しています
                            </p>
                        </div>
                    </BlurFade>
                </Container>
            </div>

            {/* ブログ一覧セクション */}
            <div className="w-full bg-white">
                <Container className="py-20">
                    {blogs.length === 0 ? (
                        <BlurFade delay={0.3} inView>
                            <div className="text-center py-20">
                                <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
                                    <span className="text-5xl">📝</span>
                                </div>
                                <h2 className="text-2xl font-semibold mb-3">
                                    まだブログがありません
                                </h2>
                                <p className="text-neutral-600">
                                    近日中に公開予定です。お楽しみに！
                                </p>
                            </div>
                        </BlurFade>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {blogs.map((blog, index) => {
                                const publishDate = new Date(
                                    blog.publishedAt || blog.createdAt,
                                ).toLocaleDateString("ja-JP", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });

                                return (
                                    <BlurFade
                                        key={blog.id}
                                        delay={0.2 + index * 0.05}
                                        inView
                                    >
                                        <Link
                                            href={`/blogs/${blog.slug || blog.id}`}
                                        >
                                            <Card className="h-full transition-colors group border border-neutral-200 hover:border-green-900/40 shadow-none">
                                                <CardContent className="p-6 flex flex-col h-full">
                                                    {/* ヘッダー情報 */}
                                                    <div className="flex items-center justify-between mb-4">
                                                        <Badge className="bg-green-100 text-green-700">
                                                            公開中
                                                        </Badge>
                                                        {blog.slug && (
                                                            <span className="text-xs text-muted-foreground">
                                                                #{blog.slug}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* タイトル */}
                                                    <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-green-900 transition-colors">
                                                        {blog.title}
                                                    </h2>

                                                    {/* コンテンツプレビュー */}
                                                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
                                                        {blog.content
                                                            .replace(
                                                                /<[^>]*>/g,
                                                                "",
                                                            )
                                                            .substring(0, 120)}
                                                        ...
                                                    </p>

                                                    {/* フッター情報 */}
                                                    <div className="space-y-2 pt-4 border-t">
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            {publishDate}
                                                        </div>
                                                        {blog.author && (
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-green-900 flex items-center justify-center text-xs font-bold text-white">
                                                                    {blog.author.name
                                                                        .charAt(
                                                                            0,
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                                <span className="text-sm font-medium">
                                                                    {
                                                                        blog
                                                                            .author
                                                                            .name
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </BlurFade>
                                );
                            })}
                        </div>
                    )}
                </Container>
            </div>
        </div>
    );
}
