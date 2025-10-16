import { redirect } from "next/navigation";
import { User } from "@/lib/service/user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで詳細な認証チェック
  const user = await User.current(); // プロフィール込みで取得
  if (!user || user.role !== "ADMIN") {
    redirect("/403");
  }

  return <>{ children }</>;
}