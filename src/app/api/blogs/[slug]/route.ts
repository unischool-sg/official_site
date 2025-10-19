import { successResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { User } from "@/lib/service/user";

interface Context {
    params: Promise<{ slug: string }>;
}

export async function GET(_: NextRequest, { params }: Context) {
    const { slug } = await params;
    try {
        const blog = await prisma.blog.findUnique({
            where: { slug },
        });
        if (!blog) {
            return notFoundResponse("ブログが見つかりません");
        }
        return successResponse(blog);
    } catch (error) {
        console.error("Error fetching blog:", error);
        return notFoundResponse("ブログの取得に失敗しました");
    }
}

export async function PUT(req: NextRequest, { params }: Context) {
    const user = await User.current();
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }
    const { slug } = await params;

    try {
        const { title, content, published, slug: newSlug } = await req.json();
        
        // まず該当のブログを取得して権限確認
        const existingBlog = await prisma.blog.findUnique({
            where: { slug },
        });
        
        if (!existingBlog) {
            return notFoundResponse("ブログが見つかりません");
        }
        
        const updatedBlog = await prisma.blog.update({
            where: { slug },
            data: {
                title,
                content,
                published,
                slug: newSlug || slug,
            },
        });
        
        return successResponse(updatedBlog);
    } catch (error) {
        console.error("Error updating blog:", error);
        return serverErrorResponse("ブログの更新に失敗しました");
    }
}

export async function DELETE(_: NextRequest, { params }: Context) {
    const user = await User.current();
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }
    const { slug } = await params;
    try {
        const deletedBlog = await prisma.blog.deleteMany({
            where: { slug, authorId: user.id },
        });
        if (deletedBlog.count === 0) {
            return notFoundResponse("ブログが見つかりません、または権限がありません");
        }
        return successResponse(deletedBlog);
    } catch (error) {
        console.error("Error deleting blog:", error);
        return serverErrorResponse("ブログの削除に失敗しました");
    }
}