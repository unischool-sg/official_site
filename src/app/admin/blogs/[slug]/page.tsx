import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import BlogEditForm from "@/components/layout/blog";


interface Context {
    params: Promise<{ slug: string }>;
}

export default async function EditBlogPage({ params }: Context) {
    const { slug } = await params;
    const blog = await prisma.blog.findUnique({
        where: { slug },
    });

    if (!blog) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-7 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">ブログ編集</h1>
                <p className="text-muted-foreground mt-1">ブログの内容を編集できます</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>ブログ情報</CardTitle>
                </CardHeader>
                <CardContent>
                    <BlogEditForm blog={blog} />
                </CardContent>
            </Card>
        </div>
    );
}
