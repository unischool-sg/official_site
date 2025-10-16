"use client";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Save, Mail, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface UserRowProps {
     user: Omit<User, "password">;
}

export default function UserRow({ user }: UserRowProps) {
     const [name, setName] = useState(user.name);
     const [email, setEmail] = useState(user.email);
     const [role, setRole] = useState(user.role);
     const [team, setTeam] = useState(user.team);
     const [isLoading, setIsLoading] = useState(false);

     const handleSave = async () => {
          setIsLoading(true);
          toast.loading("ユーザー情報を更新中...", { id: "update" });
          try {
               const response = await fetch(`/api/admin/users/${user.id}`, {
                    method: "PATCH",
                    headers: {
                         "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, role, team }),
               });

               if (response.ok) {
                    toast.success("ユーザー情報を更新しました", {
                         description: `${name} (${email})`,
                    });
               } else {
                    const error = await response.json();
                    toast.error("更新に失敗しました", {
                         description:
                              error.error?.message || "エラーが発生しました",
                    });
               }
          } catch (error) {
               console.error("Save error:", error);
               toast.error("ネットワークエラー", {
                    description: "サーバーに接続できませんでした",
               });
          } finally {
               setIsLoading(false);
          }

          toast.dismiss("update");
     };

     const handleResendVerification = async () => {
          if (!confirm(`${user.name} に認証メールを再送信しますか？`)) {
               return;
          }

          setIsLoading(true);
          toast.loading("認証メールを送信中...", { id: "resend" });
          try {
               const response = await fetch(`/api/admin/users/${user.id}/send/verify`, {
                    method: "POST",
               });

               if (response.ok) {
                    toast.success("認証メールを送信しました", {
                         description: `${user.email} に送信しました`,
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
               setIsLoading(false);
               toast.dismiss("resend");
          }
     };

     const handleSendPasswordReset = async () => {
          if (!confirm(`${user.name} にパスワードリセットメールを送信しますか？`)) {
               return;
          }

          setIsLoading(true);
          toast.loading("パスワードリセットメールを送信中...", { id: "reset" });
          try {
               const response = await fetch(`/api/admin/users/${user.id}/send/reset`, {
                    method: "POST",
               });

               if (response.ok) {
                    toast.success("パスワードリセットメールを送信しました", {
                         description: `${user.email} に送信しました`,
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
               setIsLoading(false);
               toast.dismiss("reset");
          }
     };

     const handleDelete = async () => {
          if (!confirm(`本当に ${user.name} を削除しますか？`)) {
               return;
          }

          setIsLoading(true);
          try {
               const response = await fetch(`/api/admin/users/${user.id}`, {
                    method: "DELETE",
               });

               if (response.ok) {
                    toast.success("ユーザーを削除しました", {
                         description: `${user.name} (${user.email})`,
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
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <TableRow>
               <TableCell className="font-mono text-xs">
                    {user.id.substring(0, 8)}...
               </TableCell>
               <TableCell>
                    <Input
                         value={name}
                         onChange={(e) => setName(e.target.value)}
                         type="text"
                         className="h-8"
                         placeholder="名前を入力"
                    />
               </TableCell>
               <TableCell>
                    <Input
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         type="email"
                         className="h-8"
                         placeholder="メールアドレス"
                    />
               </TableCell>
               <TableCell>
                    <Select
                         value={role}
                         onValueChange={(value) => setRole(value as any)}
                    >
                         <SelectTrigger className="h-8">
                              <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                              <SelectItem value="ADMIN">ADMIN</SelectItem>
                              <SelectItem value="MEMBER">MEMBER</SelectItem>
                         </SelectContent>
                    </Select>
               </TableCell>
               <TableCell>
                    <Select
                         value={team}
                         onValueChange={(value) => setTeam(value as any)}
                    >
                         <SelectTrigger className="h-8">
                              <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                              <SelectItem value="ALL">ALL</SelectItem>
                              <SelectItem value="VIDEO">VIDEO</SelectItem>
                              <SelectItem value="EDIT">EDIT</SelectItem>
                              <SelectItem value="DEVELOP">DEVELOP</SelectItem>
                         </SelectContent>
                    </Select>
               </TableCell>
               <TableCell>
                    {user.emailVerified ? (
                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              認証済み
                         </span>
                    ) : (
                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              未認証
                         </span>
                    )}
               </TableCell>
               <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                         <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={handleSave}
                              type="button"
                              disabled={isLoading}
                              title="保存"
                         >
                              <Save className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={handleResendVerification}
                              type="button"
                              disabled={isLoading || !!user.emailVerified}
                              title="認証メール再送信"
                         >
                              <Mail className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                              onClick={handleSendPasswordReset}
                              type="button"
                              disabled={isLoading}
                              title="パスワードリセットメール送信"
                         >
                              <KeyRound className="h-4 w-4" />
                         </Button>
                         <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={handleDelete}
                              type="button"
                              disabled={isLoading}
                              title="削除"
                         >
                              <Trash2 className="h-4 w-4" />
                         </Button>
                    </div>
               </TableCell>
          </TableRow>
     );
}
