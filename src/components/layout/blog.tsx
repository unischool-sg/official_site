"use client";
import { handleBlogUpdate } from "@/handlers/blog";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Blog } from "@prisma/client";
import { toast } from "sonner";

interface BlogEditFormProps {
    blog: Blog;
}

export default function BlogEditForm({ blog }: BlogEditFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = (async () => {
        if (!confirm("本当にこのブログを削除しますか？")) {
            return;
        }
        toast.loading("ブログを削除中...", { id: "delete-blog" });

        try {
            setIsLoading(true);
            const response = await fetch(`/api/blogs/${blog.slug}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error?.message || "ブログの削除に失敗しました");
            }

            toast.success("ブログを削除しました", { id: "delete-blog" });
            router.push("/admin/blogs");
        } catch (error) {
            console.error("Error deleting blog:", error);
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <form className="space-y-6" onSubmit={(e) => { handleBlogUpdate(e, setIsLoading, router) }}>
            <input type="hidden" name="slug" value={blog.slug || ""} />
            <div className="space-y-2">
                <Label htmlFor="title">タイトル</Label>
                <Input
                    name="title"
                    placeholder="例: 文化祭で動画撮影を担当しました"
                    defaultValue={blog.title}
                    required
                    disabled={isLoading}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content">本文（HTML可）</Label>
                <Textarea
                    name="content"
                    rows={14}
                    placeholder="<p>本文をここに記入します...</p>"
                    disabled={isLoading}
                    defaultValue={blog.content}
                />
                <p className="text-xs text-muted-foreground">簡易入力欄です。後でエディタ導入も可能です。</p>
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        name="published"
                        className="h-4 w-4"
                        disabled={isLoading}
                        defaultChecked={blog.published}
                    />
                    公開する
                </label>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isLoading}
                    >
                        キャンセル
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "更新中..." : "更新"}
                    </Button>
                    <Button onClick={handleDelete} disabled={isLoading} variant="destructive">
                        削除
                    </Button>
                </div>
            </div>
        </form>
    );
}