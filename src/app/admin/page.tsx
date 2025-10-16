import { User } from "@/lib/service/user";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

                    <Card>
                         <CardHeader>
                              <CardTitle>管理機能</CardTitle>
                         </CardHeader>
                         <CardContent>
                              <p className="text-muted-foreground">
                                   ここに管理機能を実装します
                              </p>
                         </CardContent>
                    </Card>
               </div>
          </Container>
     );
}
