import { prisma } from "@/lib/prisma";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function BlogsPage() {
    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            author: {
                select: { id: true, name: true },
            },
        },
    });

    const total = blogs.length;
    const publishedCount = blogs.filter((b) => b.published).length;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-3xl font-bold">ブログ管理</h1>
                    <p className="text-muted-foreground mt-1">
                        投稿されたブログを一覧表示します（{publishedCount}/{total} 公開中）
                    </p>
                </div>
                {/* ここに「新規作成」ボタンなどを将来追加可能 */}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ブログ一覧（{total}件）</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">状態</TableHead>
                                    <TableHead>タイトル</TableHead>
                                    <TableHead className="w-[200px]">著者</TableHead>
                                    <TableHead className="w-[180px]">公開日</TableHead>
                                    <TableHead className="w-[180px]">作成日</TableHead>
                                    <TableHead className="w-[140px]" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {blogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                            まだブログがありません
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    blogs.map((blog) => {
                                        const publishedAt = blog.publishedAt
                                            ? new Date(blog.publishedAt).toLocaleDateString("ja-JP", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                            : "-";
                                        const createdAt = new Date(blog.createdAt).toLocaleDateString("ja-JP", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });

                                        return (
                                            <TableRow key={blog.id}>
                                                <TableCell>
                                                    {blog.published ? (
                                                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            公開中
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">下書き</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {blog.title}
                                                </TableCell>
                                                <TableCell>
                                                    {blog.author?.name || "-"}
                                                </TableCell>
                                                <TableCell>{publishedAt}</TableCell>
                                                <TableCell>{createdAt}</TableCell>
                                                <TableCell className="text-right">
                                                    <Link
                                                        href={`/blogs/${blog.slug || blog.id}`}
                                                        className="text-primary hover:underline"
                                                    >
                                                        公開ページを表示
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}