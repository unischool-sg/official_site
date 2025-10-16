import { redirect } from "next/navigation";
import { session } from "../layout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // サーバーサイドで詳細な認証チェック
  const user = session.get("user");
  if (!user) {
    redirect("/403");
  }

  return <>{children}</>;
}
