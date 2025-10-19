import { Home, Users, FileText, History, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { User } from "@/lib/service/user";
import { AdminFunctionCard } from "@/components/admin/admin-function-card";

export default async function AdminPage() {
     const user = await User.current();
     if (!user) {
          return null; // layout.tsxでリダイレクトされる
     }

     return (
          <Container className="py-12">
               <div className="space-y-6">
                    <div>
                         <h1 className="text-4xl font-bold">
                              管理ダッシュボード
                         </h1>
                         <p className="text-muted-foreground mt-2">
                              Uni School 管理パネルへようこそ
                         </p>
                    </div>

                    <Card>
                         <CardHeader>
                              <CardTitle>ユーザー情報</CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-2">
                              <div>
                                   <span className="font-medium">名前:</span>{" "}
                                   {user.name}
                              </div>
                              <div>
                                   <span className="font-medium">メール:</span>{" "}
                                   {user.email}
                              </div>
                              <div>
                                   <span className="font-medium">ロール:</span>{" "}
                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                        {user.role}
                                   </span>
                              </div>
                              <div>
                                   <span className="font-medium">登録日:</span>{" "}
                                   {new Date(user.createdAt).toLocaleDateString(
                                        "ja-JP",
                                   )}
                              </div>
                         </CardContent>
                    </Card>

                    <div>
                         <h2 className="text-2xl font-bold mb-4">管理機能</h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              <AdminFunctionCard
                                   href="/admin"
                                   icon={Home}
                                   title="ダッシュボード"
                                   description="管理画面のホーム"
                                   colorClass="bg-primary/10 text-primary"
                              />

                              <AdminFunctionCard
                                   href="/admin/profile"
                                   icon={UserIcon}
                                   title="プロフィール"
                                   description="アカウント設定"
                                   colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                              />

                              {user.role === "ADMIN" && (
                                   <AdminFunctionCard
                                        href="/admin/users"
                                        icon={Users}
                                        title="ユーザー管理"
                                        description="メンバー管理"
                                        colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                   />
                              )}

                              <AdminFunctionCard
                                   href="/admin/blogs"
                                   icon={FileText}
                                   title="投稿管理"
                                   description="ブログ記事管理"
                                   colorClass="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              />

                              <AdminFunctionCard
                                   href="/admin/history"
                                   icon={History}
                                   title="セッション履歴"
                                   description="ログイン履歴"
                                   colorClass="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                              />
                         </div>
                    </div>
               </div>
          </Container>
     );
}
