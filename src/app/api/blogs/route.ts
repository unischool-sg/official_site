import { createdResponse, serverErrorResponse, unauthorizedResponse, validationErrorResponse } from "@/lib/api/response";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { User } from "@/lib/service/user";

export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            where: { published: true },
            orderBy: { createdAt: "desc" },
            include: {
                author: {
                    select: { id: true, name: true },
                }
            },
        });
        return createdResponse(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return serverErrorResponse("ブログの取得に失敗しました");
    }
}

export async function POST(req: NextRequest) {
    const user = await User.current();
    if (!user) {
        return unauthorizedResponse("認証が必要です");
    }

    try {
        const { title, content, slug, published } = await req.json();

        // スラッグ重複チェック
        if (slug) {
            const exists = await prisma.blog.findFirst({ where: { slug } });
            if (exists) {
                return validationErrorResponse(["指定されたスラッグは既に使用されています"]);
            }
        }

        console.log("Creating blog with data:", { title, slug, published: published });
        const newBlog = await prisma.blog.create({
            data: {
                slug,
                title,
                content,
                published,
                publishedAt: published ? new Date() : null,
                author: { connect: { id: user.id } },
            },
        });
        return createdResponse(newBlog);
    } catch (error) {
        console.error("Error creating blog:", error);
        return serverErrorResponse("ブログの作成に失敗しました");
    }
}