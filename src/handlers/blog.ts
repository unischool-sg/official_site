"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

async function handleBlogCreate(
    e: React.FormEvent<HTMLFormElement>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    router: AppRouterInstance,
) {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("ブログを作成中...", { id: "create-blog" });

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "on";

    try {
        const response = await fetch("/api/blogs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, slug, content, published }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || "ブログの作成に失敗しました");
        }

        console.log("[Blog Handler] Blog created successfully:", data);

        toast.success("ブログを作成しました", { id: "create-blog" });
        router.push("/admin/blogs/" + data.data.slug);
    } catch (error) {
        console.error("[Blog Handler] Blog creation failed:", error);
        toast.dismiss("create-blog");
        toast.error("ブログの作成に失敗しました", { description: (error as Error).message });
    } finally {
        setIsLoading(false);
    }
}

async function handleBlogUpdate(
    e: React.FormEvent<HTMLFormElement>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    router: AppRouterInstance,
) {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("ブログを更新中...", { id: "update-blog" });

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const published = formData.get("published") === "on";

    try {
        const response = await fetch(`/api/blogs/${slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, slug, content, published }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || "ブログの更新に失敗しました");
        }

        console.log("[Blog Handler] Blog updated successfully:", data);

        toast.success("ブログを更新しました", { id: "update-blog" });
        router.refresh();
    } catch (error) {
        console.error("[Blog Handler] Blog update failed:", error);
        toast.dismiss("update-blog");
        toast.error("ブログの更新に失敗しました", { description: (error as Error).message });
    } finally {
        setIsLoading(false);
    }
}

export { handleBlogCreate, handleBlogUpdate };