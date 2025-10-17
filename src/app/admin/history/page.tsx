import { User } from "@/lib/service/user";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History, Calendar, MapPin, Monitor, Clock } from "lucide-react";

export default async function HistoryPage() {
     const user = await User.current();
     const history = user?.loginHistory || [];

     // ユーザーエージェントから簡易的にブラウザ情報を抽出
     const getBrowserInfo = (userAgent: string | null) => {
          if (!userAgent)
               return {
                    name: "Unknown",
                    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
               };
          if (userAgent.includes("Chrome"))
               return {
                    name: "Chrome",
                    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
               };
          if (userAgent.includes("Firefox"))
               return {
                    name: "Firefox",
                    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
               };
          if (userAgent.includes("Safari"))
               return {
                    name: "Safari",
                    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
               };
          if (userAgent.includes("Edge"))
               return {
                    name: "Edge",
                    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
               };
          return {
               name: "Other",
               color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
          };
     };

     // 相対時間を表示
     const getRelativeTime = (timestamp: Date) => {
          const now = new Date();
          const diff = now.getTime() - new Date(timestamp).getTime();
          const minutes = Math.floor(diff / 60000);
          const hours = Math.floor(diff / 3600000);
          const days = Math.floor(diff / 86400000);

          if (minutes < 1) return "たった今";
          if (minutes < 60) return `${minutes}分前`;
          if (hours < 24) return `${hours}時間前`;
          if (days < 7) return `${days}日前`;
          return null;
     };

     return (
          <div className="p-6 space-y-6">
               {/* ヘッダー */}
               <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                         <History className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                         <h1 className="text-3xl font-bold">ログイン履歴</h1>
                         <p className="text-muted-foreground mt-1">
                              あなたのアカウントへのログイン記録を確認できます
                         </p>
                    </div>
               </div>

               {/* 統計情報 */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                   総ログイン回数
                              </CardTitle>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">
                                   {history.length}回
                              </div>
                         </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                   最終ログイン
                              </CardTitle>
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">
                                   {history.length > 0
                                        ? getRelativeTime(
                                               history[0].createdAt,
                                          ) || "7日以上前"
                                        : "なし"}
                              </div>
                         </CardContent>
                    </Card>

                    <Card>
                         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                   異なるIP数
                              </CardTitle>
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                         </CardHeader>
                         <CardContent>
                              <div className="text-2xl font-bold">
                                   {
                                        new Set(history.map((h) => h.ipAddress))
                                             .size
                                   }
                                   個
                              </div>
                         </CardContent>
                    </Card>
               </div>

               {/* ログイン履歴テーブル */}
               <Card>
                    <CardHeader>
                         <CardTitle>ログイン履歴</CardTitle>
                         <CardDescription>
                              最新のログイン記録から表示されます
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         {history.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-12 text-center">
                                   <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                        <History className="h-8 w-8 text-muted-foreground" />
                                   </div>
                                   <h3 className="text-lg font-semibold mb-2">
                                        ログイン履歴がありません
                                   </h3>
                                   <p className="text-sm text-muted-foreground">
                                        ログインすると、ここに履歴が表示されます
                                   </p>
                              </div>
                         ) : (
                              <div className="rounded-md border">
                                   <Table>
                                        <TableHeader>
                                             <TableRow>
                                                  <TableHead className="w-[180px]">
                                                       <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            日時
                                                       </div>
                                                  </TableHead>
                                                  <TableHead>
                                                       <div className="flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            IPアドレス
                                                       </div>
                                                  </TableHead>
                                                  <TableHead className="w-[120px]">
                                                       <div className="flex items-center gap-2">
                                                            <Monitor className="h-4 w-4" />
                                                            ブラウザ
                                                       </div>
                                                  </TableHead>
                                                  <TableHead>
                                                       ユーザーエージェント
                                                  </TableHead>
                                             </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                             {history.map((entry, index) => {
                                                  const browserInfo =
                                                       getBrowserInfo(
                                                            entry.userAgent,
                                                       );
                                                  const relativeTime =
                                                       getRelativeTime(
                                                            entry.createdAt,
                                                       );

                                                  return (
                                                       <TableRow key={entry.id}>
                                                            <TableCell>
                                                                 <div className="flex flex-col">
                                                                      <span className="font-medium">
                                                                           {new Date(
                                                                                entry.createdAt,
                                                                           ).toLocaleString(
                                                                                "ja-JP",
                                                                                {
                                                                                     year: "numeric",
                                                                                     month: "short",
                                                                                     day: "numeric",
                                                                                     hour: "2-digit",
                                                                                     minute: "2-digit",
                                                                                },
                                                                           )}
                                                                      </span>
                                                                      {relativeTime && (
                                                                           <span className="text-xs text-muted-foreground">
                                                                                {
                                                                                     relativeTime
                                                                                }
                                                                           </span>
                                                                      )}
                                                                 </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                 <code className="text-sm bg-muted px-2 py-1 rounded">
                                                                      {entry.ipAddress ||
                                                                           "不明"}
                                                                 </code>
                                                            </TableCell>
                                                            <TableCell>
                                                                 <Badge
                                                                      className={
                                                                           browserInfo.color
                                                                      }
                                                                 >
                                                                      {
                                                                           browserInfo.name
                                                                      }
                                                                 </Badge>
                                                            </TableCell>
                                                            <TableCell>
                                                                 <span className="text-sm text-muted-foreground truncate max-w-md block">
                                                                      {entry.userAgent ||
                                                                           "不明"}
                                                                 </span>
                                                            </TableCell>
                                                       </TableRow>
                                                  );
                                             })}
                                        </TableBody>
                                   </Table>
                              </div>
                         )}
                    </CardContent>
               </Card>

               {/* セキュリティ情報 */}
               <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
                    <CardContent className="pt-6">
                         <div className="flex gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                   <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="space-y-1">
                                   <h4 className="font-semibold text-blue-900 dark:text-blue-300">
                                        セキュリティに関するヒント
                                   </h4>
                                   <p className="text-sm text-blue-800 dark:text-blue-400">
                                        身に覚えのないログイン履歴がある場合は、すぐにパスワードを変更してください。
                                        また、異なるIPアドレスからのアクセスが多い場合は、アカウントのセキュリティを確認することをお勧めします。
                                   </p>
                              </div>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
