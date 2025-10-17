"use client";
import {
     Select,
     SelectContent,
     SelectTrigger,
     SelectItem,
     SelectValue,
} from "@/components/ui/select";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, UserCircle, Users } from "lucide-react";
import { UserRole, UserTeam } from "@prisma/client";
import { handleRegistUser } from "@/handlers/user";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function NewUserPage() {
     const [isLoading, setIsLoading] = useState<boolean>(false);

     return (
          <div className="p-6 space-y-6">
               <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <Link href="/admin/users">
                              <Button
                                   variant="ghost"
                                   size="icon"
                                   className="hover:bg-muted"
                              >
                                   <ArrowLeft className="h-5 w-5" />
                              </Button>
                         </Link>
                         <div>
                              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                   新規ユーザー作成
                              </h1>
                              <p className="text-muted-foreground mt-1">
                                   新しいユーザーアカウントを作成します
                              </p>
                         </div>
                    </div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-2">
                         <CardHeader className="space-y-1">
                              <CardTitle className="text-2xl">
                                   アカウント情報
                              </CardTitle>
                              <CardDescription>
                                   ユーザーのログイン情報と権限を設定してください
                              </CardDescription>
                         </CardHeader>
                         <CardContent>
                              <form
                                   onSubmit={(e) => {
                                        handleRegistUser(e, setIsLoading);
                                   }}
                                   className="space-y-6"
                              >
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                             <label
                                                  htmlFor="email"
                                                  className="text-sm font-semibold flex items-center gap-2"
                                             >
                                                  <Mail className="h-4 w-4 text-primary" />
                                                  メールアドレス
                                             </label>
                                             <Input
                                                  name="email"
                                                  type="email"
                                                  placeholder="user@example.com"
                                                  className="h-11"
                                                  required
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label
                                                  htmlFor="password"
                                                  className="text-sm font-semibold flex items-center gap-2"
                                             >
                                                  <Lock className="h-4 w-4 text-primary" />
                                                  パスワード
                                             </label>
                                             <Input
                                                  name="password"
                                                  type="password"
                                                  placeholder="••••••••"
                                                  className="h-11"
                                                  required
                                             />
                                        </div>

                                        <div className="space-y-2">
                                             <label
                                                  htmlFor="role"
                                                  className="text-sm font-semibold flex items-center gap-2"
                                             >
                                                  <UserCircle className="h-4 w-4 text-primary" />
                                                  役職
                                             </label>
                                             <Select name="role">
                                                  <SelectTrigger className="h-11">
                                                       <SelectValue placeholder="役職を選択" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="ADMIN">
                                                            <span className="font-semibold">
                                                                 ADMIN
                                                            </span>
                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                 管理者
                                                            </span>
                                                       </SelectItem>
                                                       <SelectItem value="MEMBER">
                                                            <span className="font-semibold">
                                                                 MEMBER
                                                            </span>
                                                            <span className="text-xs text-muted-foreground ml-2">
                                                                 メンバー
                                                            </span>
                                                       </SelectItem>
                                                       {
                                                            /* PrismaのUserRoleに合わせる */
                                                            Object.values(
                                                                 UserRole
                                                            ).map((role) => (
                                                                 <SelectItem
                                                                      key={role}
                                                                      value={role}
                                                                 >
                                                                      <span className="font-semibold">
                                                                           { role }
                                                                      </span>
                                                                      <span className="text-xs text-muted-foreground ml-2">
                                                                           { role }
                                                                      </span>
                                                                 </SelectItem>
                                                            ))
                                                       }
                                                  </SelectContent>
                                             </Select>
                                        </div>

                                        <div className="space-y-2">
                                             <label
                                                  htmlFor="team"
                                                  className="text-sm font-semibold flex items-center gap-2"
                                             >
                                                  <Users className="h-4 w-4 text-primary" />
                                                  チーム
                                             </label>
                                             <Select name="team">
                                                  <SelectTrigger className="h-11">
                                                       <SelectValue placeholder="チームを選択" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {
                                                            /* PrismaのUserTeamに合わせる */
                                                            Object.values(UserTeam).map((team) => (
                                                                 <SelectItem
                                                                      key={team}
                                                                      value={team}
                                                                 >
                                                                      <span className="font-semibold">
                                                                           { team }
                                                                      </span>
                                                                      <span className="text-xs text-muted-foreground ml-2">
                                                                           { team }
                                                                      </span>
                                                                 </SelectItem>
                                                            ))
                                                       }
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   </div>

                                   <div className="flex justify-end gap-3 pt-6 border-t">
                                        <Link href="/admin/users">
                                             <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="lg"
                                             >
                                                  キャンセル
                                             </Button>
                                        </Link>
                                        <Button
                                             type="submit"
                                             size="lg"
                                             className={`min-w-[120px] ${isLoading ? "bg-gray-200" : ""}`}
                                             disabled={isLoading}
                                        >
                                             {isLoading ? "作成中..." : "作成"}
                                        </Button>
                                   </div>
                              </form>
                         </CardContent>
                    </Card>

                    <Card className="lg:col-span-1 border-2 h-fit">
                         <CardHeader>
                              <CardTitle className="text-lg">
                                   作成のヒント
                              </CardTitle>
                         </CardHeader>
                         <CardContent className="space-y-4 text-sm">
                              <div className="space-y-2">
                                   <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                        <div>
                                             <p className="font-medium">
                                                  強固なパスワード
                                             </p>
                                             <p className="text-muted-foreground text-xs">
                                                  8文字以上、大小英字・数字を含めることを推奨
                                             </p>
                                        </div>
                                   </div>
                              </div>
                              <div className="space-y-2">
                                   <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                        <div>
                                             <p className="font-medium">
                                                  役職の選択
                                             </p>
                                             <p className="text-muted-foreground text-xs">
                                                  ADMINは全ての権限、MEMBERは制限された権限
                                             </p>
                                        </div>
                                   </div>
                              </div>
                              <div className="space-y-2">
                                   <div className="flex items-start gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                                        <div>
                                             <p className="font-medium">
                                                  チーム配属
                                             </p>
                                             <p className="text-muted-foreground text-xs">
                                                  作業内容に応じて適切なチームを選択
                                             </p>
                                        </div>
                                   </div>
                              </div>
                              <div className="pt-2 mt-4 border-t">
                                   <p className="text-xs text-muted-foreground">
                                        作成後、ユーザーにメールアドレス確認メールが送信されます
                                   </p>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
