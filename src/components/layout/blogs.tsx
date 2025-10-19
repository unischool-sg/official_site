"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Blog } from "@prisma/client";
import Link from "next/link";


interface BlogRowProps {
    blog: Blog & {
        author?: {
            id: string;
            name: string | null;
        } | null;
    };
}

export default function BlogRow({ blog }: BlogRowProps) {
    const router = useRouter();

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
        <TableRow onClick={() => router.push(`/admin/blogs/${blog.slug}`)} className="cursor-pointer hover:bg-muted">
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
}