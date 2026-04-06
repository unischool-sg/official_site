import type { MetadataRoute } from "next";
import type { Blog, Profile } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SitemapEntry = {
    url: string;
    lastModified: Date;
};
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [articles, members] = await prisma.$transaction([
        prisma.blog.findMany({
            where: {
                published: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        }), 
        prisma.profile.findMany({
            where: {
                isPublic: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
            take: 100,
        })
    ]);
    const lastModified = articles.length > 0 ? articles[0].createdAt : new Date("2025-01-01");
    const blogs: SitemapEntry[] = articles.map((article: Blog) => {
        return { url: `${baseUrl}/blog/${article.slug}`, lastModified: article.createdAt };
    });

    const defaultSitemap: MetadataRoute.Sitemap = [
        {
            url: baseUrl + "/",
            lastModified: new Date("2025-01-01"),
        },
        {
            url: baseUrl + "/blog",
            lastModified: lastModified,
        },
        {
            url: baseUrl + "/#members",
            lastModified: new Date("2025-01-01"),
        }
    ];
    
    return [
        ...defaultSitemap, 
        ...blogs.map(({ url, lastModified })  => ({ url, lastModified })),
        ...members.map((member: Profile) => ({ url: `${baseUrl}/members/${member.id}`, lastModified: member.updatedAt }))
    ];
}