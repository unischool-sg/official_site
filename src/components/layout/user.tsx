"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2, Save } from "lucide-react";
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
                    description: error.error?.message || "エラーが発生しました",
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
                    description: error.error?.message || "エラーが発生しました",
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
                <Select value={role} onValueChange={(value) => setRole(value as any)}>
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
                <Select value={team} onValueChange={(value) => setTeam(value as any)}>
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
                    >
                        <Save className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={handleDelete}
                        type="button"
                        disabled={isLoading}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}