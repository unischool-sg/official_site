import UserRow from "@/components/layout/user";
import Link from "next/link";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/service/user";

export default async function UsersPage() {
     const users = await User.all();

     // デバッグ: IDの重複チェック
     const userIds = users.map((u) => u.id);
     const uniqueIds = new Set(userIds);
     if (userIds.length !== uniqueIds.size) {
          console.warn("⚠️ 重複したユーザーIDが検出されました:", userIds);
          const duplicates = userIds.filter(
               (id, index) => userIds.indexOf(id) !== index,
          );
          console.warn("重複ID:", [...new Set(duplicates)]);
          console.warn(
               "全ユーザー:",
               users.map((u) => ({ id: u.id, email: u.email })),
          );
     }

     // ユニークなユーザーのみをフィルタリング
     const uniqueUsers = users.filter(
          (user, index, self) =>
               self.findIndex((u) => u.id === user.id) === index,
     );

     return (
          <div className="p-6 space-y-6">
               <div className="flex justify-between items-center">
                    <div>
                         <h1 className="text-3xl font-bold">ユーザー管理</h1>
                         <p className="text-muted-foreground mt-1">
                              ユーザーの情報を管理します
                         </p>
                    </div>
                    <Link href="/admin/users/new">
                         <Button>
                              <span className="mr-2">+</span>
                              新規ユーザー
                         </Button>
                    </Link>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>
                              ユーザー一覧 ({uniqueUsers.length}名)
                         </CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border">
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead className="w-[100px]">
                                                  ID
                                             </TableHead>
                                             <TableHead>名前</TableHead>
                                             <TableHead>
                                                  メールアドレス
                                             </TableHead>
                                             <TableHead className="w-[120px]">
                                                  ロール
                                             </TableHead>
                                             <TableHead className="w-[120px]">
                                                  チーム
                                             </TableHead>
                                             <TableHead className="w-[100px]">
                                                  認証
                                             </TableHead>
                                             <TableHead className="w-[120px] text-right">
                                                  操作
                                             </TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {uniqueUsers.length > 0 ? (
                                             uniqueUsers.map((user, index) => {
                                                  const userData =
                                                       user.toJSON();
                                                  return (
                                                       <UserRow
                                                            key={`${userData.id}-${index}`}
                                                            user={userData}
                                                       />
                                                  );
                                             })
                                        ) : (
                                             <TableRow>
                                                  <TableCell
                                                       colSpan={7}
                                                       className="text-center py-8 text-muted-foreground"
                                                  >
                                                       ユーザーが登録されていません
                                                  </TableCell>
                                             </TableRow>
                                        )}
                                   </TableBody>
                              </Table>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
