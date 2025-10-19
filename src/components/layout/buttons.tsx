"use client";
import { Mail, KeyRound, Trash2, History, UserCog } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { User } from "@prisma/client";

interface ButtonsProps {
     userData: Omit<User, "password">;
}

export default function Buttons({ userData }: ButtonsProps) {
     const router = useRouter();

     const handleDelete = async () => {
          if (!confirm(`本当に ${userData.name} を削除しますか？`)) {
               return;
          }

          try {
               const response = await fetch(`/api/admin/users/${userData.id}`, {
                    method: "DELETE",
               });

               if (response.ok) {
                    toast.success("ユーザーを削除しました", {
                         description: `${userData.name} (${userData.email})`,
                    });
                    // ページをリロード（または親コンポーネントに通知）
                    setTimeout(() => window.location.reload(), 1000);
               } else {
                    const error = await response.json();
                    toast.error("削除に失敗しました", {
                         description:
                              error.error?.message || "エラーが発生しました",
                    });
               }
          } catch (error) {
               console.error("Delete error:", error);
               toast.error("ネットワークエラー", {
                    description: "サーバーに接続できませんでした",
               });
          }
     };
     const handleSendPasswordReset = async () => {
          if (
               !confirm(
                    `${userData.name} にパスワードリセットメールを送信しますか？`,
               )
          ) {
               return;
          }
          toast.loading("パスワードリセットメールを送信中...", { id: "reset" });
          try {
               const response = await fetch(
                    `/api/admin/users/${userData.id}/send/reset`,
                    {
                         method: "POST",
                    },
               );

               if (response.ok) {
                    toast.success("パスワードリセットメールを送信しました", {
                         description: `${userData.email} に送信しました`,
                    });
               } else {
                    const error = await response.json();
                    toast.error("送信に失敗しました", {
                         description:
                              error.error?.message || "エラーが発生しました",
                    });
               }
          } catch (error) {
               console.error("Send password reset error:", error);
               toast.error("ネットワークエラー", {
                    description: "サーバーに接続できませんでした",
               });
          } finally {
               toast.dismiss("reset");
          }
     };
     const handleResendVerification = async () => {
          if (!confirm(`${userData.name} に認証メールを再送信しますか？`)) {
               return;
          }

          toast.loading("認証メールを送信中...", { id: "resend" });
          try {
               const response = await fetch(
                    `/api/admin/users/${userData.id}/send/verify`,
                    {
                         method: "POST",
                    },
               );

               if (response.ok) {
                    toast.success("認証メールを送信しました", {
                         description: `${userData.email} に送信しました`,
                    });
               } else {
                    const error = await response.json();
                    toast.error("送信に失敗しました", {
                         description:
                              error.error?.message || "エラーが発生しました",
                    });
               }
          } catch (error) {
               console.error("Resend verification error:", error);
               toast.error("ネットワークエラー", {
                    description: "サーバーに接続できませんでした",
               });
          } finally {
               toast.dismiss("resend");
          }
     };

     return (
          <div className="space-y-3">
               {/* メール送信関連 */}
               <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                         メール送信
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                         <Button
                              variant="default"
                              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                   router.push(
                                        `/admin/users/${userData.id}/send`,
                                   );
                              }}
                         >
                              <Mail className="mr-2 h-4 w-4" />
                              カスタムメール
                         </Button>
                         <Button
                              variant="outline"
                              className="w-full h-11 border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                              onClick={handleResendVerification}
                              disabled={!!userData.emailVerified}
                         >
                              <Mail className="mr-2 h-4 w-4" />
                              認証メール再送信
                         </Button>
                    </div>
               </div>

               {/* パスワード管理 */}
               <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                         パスワード管理
                    </h4>
                    <Button
                         variant="outline"
                         className="w-full h-11 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
                         onClick={handleSendPasswordReset}
                    >
                         <KeyRound className="mr-2 h-4 w-4" />
                         パスワードリセット
                    </Button>
               </div>

               {/* セッション管理 */}
               <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                         セッション管理
                    </h4>
                    <Button
                         variant="outline"
                         className="w-full h-11 border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-950/30"
                         onClick={() => {
                              router.push(
                                   `/admin/users/${userData.id}/history`,
                              );
                         }}
                    >
                         <History className="mr-2 h-4 w-4" />
                         セッション履歴閲覧
                    </Button>
                    <Button
                         variant="outline"
                         className="w-full h-11 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                         onClick={() => {
                              router.push(
                                   `/admin/users/${userData.id}/profile`,
                              );
                         }}
                    >
                         <UserCog className="mr-2 h-4 w-4" />
                         プロフィール編集
                    </Button>
               </div>

               {/* 危険な操作 */}
               <div className="p-4 rounded-lg border border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20 space-y-3">
                    <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide flex items-center gap-2">
                         <span>⚠️</span>
                         危険な操作
                    </h4>
                    <Button
                         variant="destructive"
                         className="w-full h-11"
                         onClick={handleDelete}
                    >
                         <Trash2 className="mr-2 h-4 w-4" />
                         ユーザーを削除
                    </Button>
               </div>
          </div>
     );
}
