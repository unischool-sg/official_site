import AdminSidebar from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { User } from "@/lib/service/user";


export default async function AdminLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     // サーバーサイドで詳細な認証チェック
     const [user, header] = await Promise.all([User.current(true), headers()]); // プロフィール込みで取得
     const currentSession = user?.currentSession;
     const userAgent = header.get("user-agent") || "";
     const ipAdress = header.get("x-forwarded-for")?.split(",")[0]?.trim() || header.get("x-real-ip") || "";

     if (currentSession) {
          console.log("[AdminLayout] Current session info:", {
               sessionId: currentSession.id,
               expires: currentSession.expires,
               userAgent: currentSession.userAgent,
               ipAddress: currentSession.ipAddress,
          });
     } else {
          console.log("[AdminLayout] No current session found for user");
     }

     if (userAgent === currentSession?.userAgent || ipAdress === currentSession?.ipAddress) {
          await user?.logout();
          redirect("/login");
     }


     console.log("[AdminLayout] User check:", {
          hasUser: !!user,
          userId: user?.id,
          role: user?.role,
     });

     if (!user) {
          console.log("[AdminLayout] No user found, redirecting to login");
          redirect("/login");
     }

     return (
          <SidebarProvider>
               <div className="flex w-full min-h-screen bg-background">
                    <AdminSidebar user={user} />
                    <div className="flex-1 flex flex-col">
                         {/* ヘッダー */}
                         <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                              <div className="flex h-16 items-center gap-4 px-6">
                                   <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
                                   <Separator orientation="vertical" className="h-6" />
                                   <div className="flex-1">
                                        <h1 className="text-lg font-semibold">管理画面</h1>
                                   </div>
                                   <div className="flex items-center gap-4">
                                        <div className="hidden md:flex flex-col items-end">
                                             <p className="text-sm font-medium">{user.name}</p>
                                             <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold">
                                             {user.name.charAt(0).toUpperCase()}
                                        </div>
                                   </div>
                              </div>
                         </header>

                         {/* メインコンテンツ */}
                         <main className="flex-1 overflow-auto">
                              {children}
                         </main>
                    </div>
               </div>
          </SidebarProvider>
     );
}
