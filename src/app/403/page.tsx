import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function ForbiddenPage() {
	return (
		<Container className="min-h-screen flex items-center justify-center">
			<div className="text-center space-y-6">
				<h1 className="text-9xl font-bold text-primary">403</h1>
				<h2 className="text-3xl font-semibold">アクセスが拒否されました</h2>
				<p className="text-muted-foreground max-w-md mx-auto">
					このページにアクセスする権限がありません。
					<br />
					メンバー権限、または管理者権限が必要です。
				</p>
				<div className="flex gap-4 justify-center">
					<Button asChild>
						<Link href="/">ホームに戻る</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/login">ログイン</Link>
					</Button>
				</div>
			</div>
		</Container>
	);
}
