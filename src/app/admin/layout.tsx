import AdminSidebar from "@/components/layout/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { User } from "@/lib/service/user";

export default async function AdminLayout({
     children,
}: {
     children: React.ReactNode;
}) {
     // サーバーサイドで詳細な認証チェック
     const user = await User.current(true); // プロフィール込みで取得

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
               <div className="flex w-full min-h-screen">
                    <AdminSidebar user={user} />
                    <main className="flex-1">{children}</main>
               </div>
          </SidebarProvider>
     );
}
