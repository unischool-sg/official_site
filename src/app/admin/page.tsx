import { Home, Users, FileText, History, User as UserIcon, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { User } from "@/lib/service/user";
import Link from "next/link";

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
                              {/* ダッシュボード */}
                              <Link href="/admin">
                                   <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                                        <CardContent className="p-6">
                                             <div className="flex items-start justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-3 bg-primary/10 rounded-lg">
                                                            <Home className="w-6 h-6 text-primary" />
                                                       </div>
                                                       <div>
                                                            <h3 className="font-semibold text-lg">ダッシュボード</h3>
                                                            <p className="text-sm text-muted-foreground">管理画面のホーム</p>
                                                       </div>
                                                  </div>
                                                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                             </div>
                                        </CardContent>
                                   </Card>
                              </Link>

                              {/* プロフィール */}
                              <Link href="/admin/profile">
                                   <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                                        <CardContent className="p-6">
                                             <div className="flex items-start justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                            <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                                       </div>
                                                       <div>
                                                            <h3 className="font-semibold text-lg">プロフィール</h3>
                                                            <p className="text-sm text-muted-foreground">アカウント設定</p>
                                                       </div>
                                                  </div>
                                                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                             </div>
                                        </CardContent>
                                   </Card>
                              </Link>

                              {/* ユーザー管理（管理者のみ） */}
                              {user.role === "ADMIN" && (
                                   <Link href="/admin/users">
                                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                                             <CardContent className="p-6">
                                                  <div className="flex items-start justify-between">
                                                       <div className="flex items-center gap-3">
                                                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                                                 <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                            </div>
                                                            <div>
                                                                 <h3 className="font-semibold text-lg">ユーザー管理</h3>
                                                                 <p className="text-sm text-muted-foreground">メンバー管理</p>
                                                            </div>
                                                       </div>
                                                       <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                                  </div>
                                             </CardContent>
                                        </Card>
                                   </Link>
                              )}

                              {/* 投稿管理 */}
                              <Link href="/admin/blogs">
                                   <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                                        <CardContent className="p-6">
                                             <div className="flex items-start justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                            <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                                                       </div>
                                                       <div>
                                                            <h3 className="font-semibold text-lg">投稿管理</h3>
                                                            <p className="text-sm text-muted-foreground">ブログ記事管理</p>
                                                       </div>
                                                  </div>
                                                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                             </div>
                                        </CardContent>
                                   </Card>
                              </Link>

                              {/* セッション履歴 */}
                              <Link href="/admin/history">
                                   <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                                        <CardContent className="p-6">
                                             <div className="flex items-start justify-between">
                                                  <div className="flex items-center gap-3">
                                                       <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                                                            <History className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                                                       </div>
                                                       <div>
                                                            <h3 className="font-semibold text-lg">セッション履歴</h3>
                                                            <p className="text-sm text-muted-foreground">ログイン履歴</p>
                                                       </div>
                                                  </div>
                                                  <ArrowRight className="w-5 h-5 text-muted-foreground" />
                                             </div>
                                        </CardContent>
                                   </Card>
                              </Link>
                         </div>
                    </div>
               </div>
          </Container>
     );
}
