import { redirect } from "next/navigation";
import { User } from "@/lib/service/user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで詳細な認証チェック
  const user = await User.current();

  // ログインしていない場合
  if (!user) {
    redirect("/login?redirect=/admin");
  }

  // 管理者権限がない場合
  if (user.role !== "ADMIN") {
    redirect("/403");
  }

  return <>{children}</>;
}
