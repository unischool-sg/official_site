import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export default async function DebugCookiesPage() {
    const store = await cookies();
    const sessionToken = store.get("s-token")?.value;

    let sessionInfo = null;
    if (sessionToken) {
        sessionInfo = await prisma.session.findUnique({
            where: { sessionToken },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
    }

    const allCookies = store.getAll();

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold">クッキーデバッグ情報</h1>

            <div className="space-y-4">
                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">セッショントークン</h2>
                    <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                        {sessionToken || "なし"}
                    </pre>
                </div>

                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">セッション情報</h2>
                    <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                        {sessionInfo ? (
                            JSON.stringify(
                                {
                                    user: sessionInfo.user,
                                    expires: sessionInfo.expires,
                                    expiresIn: Math.floor(
                                        (sessionInfo.expires.getTime() - Date.now()) / 1000 / 60
                                    ) + " 分",
                                    isExpired: sessionInfo.expires < new Date(),
                                    createdAt: sessionInfo.createdAt,
                                },
                                null,
                                2
                            )
                        ) : (
                            "セッションが見つかりません"
                        )}
                    </pre>
                </div>

                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">全クッキー ({allCookies.length}個)</h2>
                    <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                        {JSON.stringify(
                            allCookies.map((c) => ({
                                name: c.name,
                                value: c.value.substring(0, 50) + (c.value.length > 50 ? "..." : ""),
                            })),
                            null,
                            2
                        )}
                    </pre>
                </div>

                <div className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">現在時刻</h2>
                    <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                        {new Date().toISOString()}
                    </pre>
                </div>
            </div>
        </div>
    );
}
