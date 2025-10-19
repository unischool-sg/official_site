import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import BlogRow from "@/components/layout/blogs";
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
                <div className="flex gap-2">
                    <Link href="/admin/blogs/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            新規作成
                        </Button>
                    </Link>
                </div>
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
                                        return <BlogRow key={blog.id} blog={blog} />;
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