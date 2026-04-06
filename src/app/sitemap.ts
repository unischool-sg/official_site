import type { MetadataRoute } from "next";
import type { Blog, Profile } from "@prisma/client";
import { User } from "@/lib/service/user";
import { prisma } from "@/lib/prisma";

type SitemapEntry = {
    url: string;
    lastModified: Date;
};
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const [articles, users]: [Blog[], User[]] = await Promise.all([
        prisma.blog.findMany({
            where: {
                published: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 100,
        }),
        User.all(true),
    ]);
    const lastModified =
        articles.length > 0 ? articles[0].createdAt : new Date("2025-01-01");
    const blogs: SitemapEntry[] = articles.map((article: Blog) => {
        return {
            url: `${baseUrl}/blog/${article.slug}`,
            lastModified: article.createdAt,
        };
    });
    const publicUsers = users.filter((user) => user.profile?.isPublic);
    const publicProfiles: Profile[] = publicUsers.map((user) => user.profile!) as Profile[];
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
        },
    ];

    return [
        ...defaultSitemap,
        ...blogs.map(({ url, lastModified }) => ({ url, lastModified })),
        ...publicProfiles.map((profile: Profile) => ({
            url: `${baseUrl}/members/${profile.userId}`,
            lastModified: profile.updatedAt,
        })),
    ];
}
