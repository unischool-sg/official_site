import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

export default function TokenNotFound() {
     return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-background/60 p-4">
               <Card className="w-full max-w-3xl mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
                    <CardContent className="pt-6">
                         <div className="text-center space-y-4">
                              <h2 className="text-2xl font-bold text-destructive">
                                   無効な招待リンク
                              </h2>
                              <p className="text-muted-foreground">
                                   有効な招待トークンが必要です。管理者から送られた招待リンクをご確認ください。
                              </p>
                              <Link href="/login">
                                   <Button className="w-full">
                                        ログインページへ
                                   </Button>
                              </Link>
                         </div>
                    </CardContent>
               </Card>
          </div>
     );
}
