"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleBlogCreate } from "@/handlers/blog";
import { generateApiKey } from "@/utils/token";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


export default function NewBlogPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
    const [slug, setSlug] = useState("");

	const generateSlug = () => {
        const s = generateApiKey("bg_");
		setSlug(s);
	};

	return (
		<div className="p-6 max-w-4xl mx-auto space-y-6">
			<div>
				<h1 className="text-3xl font-bold">新規ブログ作成</h1>
				<p className="text-muted-foreground mt-1">タイトル、本文、公開設定を入力して作成します</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>ブログ情報</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={(e) => { handleBlogCreate(e, setIsLoading, router); }} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="title">タイトル</Label>
							<Input name="title" placeholder="例: 文化祭で動画撮影を担当しました" required disabled={isLoading} />
						</div>

						<div className="grid md:grid-cols-3 gap-4 items-end">
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="slug">スラッグ（任意）</Label>
								<Input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="例: bunkasai-video-report" disabled={isLoading} />
							</div>
							<Button type="button" variant="outline" onClick={generateSlug} disabled={isLoading}>タイトルから自動生成</Button>
						</div>

						<div className="space-y-2">
							<Label htmlFor="content">本文（HTML可）</Label>
							<Textarea name="content" rows={14} placeholder="<p>本文をここに記入します...</p>" disabled={isLoading} />
							<p className="text-xs text-muted-foreground">簡易入力欄です。後でエディタ導入も可能です。</p>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-sm">
								<input type="checkbox" className="h-4 w-4" disabled={isLoading} />
								公開する（すぐに公開）
							</label>
							<div className="flex gap-2">
								<Button type="button" variant="outline" disabled={isLoading}>下書き保存</Button>
								<Button type="submit" disabled={isLoading}>{isLoading ? "作成中..." : "作成"}</Button>
							</div>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
