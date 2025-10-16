"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";

export default function SendMailPage() {
    const params = useParams();
    const userId = params.id as string;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        toast.loading("メールを送信中...", { id: "send-mail" });

        // ここに送信処理を実装してください
        console.log("Sending email:", { userId, title, content });

        // 例: APIコール
        try {
            const response = await fetch(`/api/admin/users/${userId}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject: title, body: content.replace(/\n/g, "<br>") }),
            });
            if (response.ok) {
                // 成功処理
                toast.success("メールを送信しました");
            }
        } catch (error) {
            console.error(error);
            toast.error("メールの送信に失敗しました");
        } finally {
            toast.dismiss("send-mail");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <Link href={`/admin/users/${userId}`}>
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            戻る
                        </Button>
                    </Link>
                </div>

                {/* メインカード */}
                <Card className="shadow-lg border-0">
                    <CardHeader className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl">メール送信</CardTitle>
                                <CardDescription className="text-base">
                                    ユーザーにカスタムメールを送信します
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* タイトル */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-base font-medium">
                                    件名 <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="メールの件名を入力してください"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="h-12 text-base"
                                />
                            </div>

                            {/* 本文 */}
                            <div className="space-y-2">
                                <Label htmlFor="content" className="text-base font-medium">
                                    本文 <span className="text-destructive">*</span>
                                </Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    placeholder="メールの本文を入力してください&#10;&#10;HTMLタグも使用できます：&#10;例: <p>段落</p>&#10;例: <strong>太字</strong>&#10;例: <a href=&quot;URL&quot;>リンク</a>"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    rows={12}
                                    className="resize-none text-base font-mono"
                                />
                                <p className="text-sm text-muted-foreground">
                                    HTMLタグを使用して、リンクや装飾を追加できます
                                </p>
                            </div>

                            {/* プレビュー */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">プレビュー</Label>
                                <div className="p-4 rounded-lg border bg-muted/30">
                                    {title || content ? (
                                        <div className="space-y-3">
                                            {title && (
                                                <h3 className="text-lg font-semibold">
                                                    {title}
                                                </h3>
                                            )}
                                            {content && (
                                                <div
                                                    className="text-sm prose prose-sm max-w-none dark:prose-invert"
                                                    dangerouslySetInnerHTML={{ __html: content }}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">
                                            入力内容がここにプレビュー表示されます
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* アクションボタン */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="submit"
                                    disabled={isLoading || !title.trim() || !content.trim()}
                                    className="flex-1 h-12 text-base"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                                            <span>送信中...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Send className="mr-2 h-4 w-4" />
                                            メールを送信
                                        </>
                                    )}
                                </Button>
                                <Link href={`/admin/users/${userId}`} className="flex-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-12 text-base"
                                        disabled={isLoading}
                                    >
                                        キャンセル
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* ヒントカード */}
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            💡 HTMLタグの使い方
                        </h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p><code className="bg-muted px-1.5 py-0.5 rounded">&lt;p&gt;テキスト&lt;/p&gt;</code> - 段落</p>
                            <p><code className="bg-muted px-1.5 py-0.5 rounded">&lt;strong&gt;テキスト&lt;/strong&gt;</code> - 太字</p>
                            <p><code className="bg-muted px-1.5 py-0.5 rounded">&lt;a href="URL"&gt;リンク&lt;/a&gt;</code> - リンク</p>
                            <p><code className="bg-muted px-1.5 py-0.5 rounded">&lt;ul&gt;&lt;li&gt;項目&lt;/li&gt;&lt;/ul&gt;</code> - リスト</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
