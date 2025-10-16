"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

async function handleLogin(e: React.FormEvent, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setError: React.Dispatch<React.SetStateAction<string | null>>, router: AppRouterInstance) {
    e.preventDefault();
    setIsLoading(true);
    // ここに処理を
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include", // クッキーを含める（重要！）
        });
        
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.error?.message || "Login failed");
        }
        
        console.log("[Login Handler] Login successful:", {
            success: data.success,
            hasToken: !!data.data?.token
        });

        // サーバーがSet-Cookieヘッダーでクッキーを設定するため、
        // クライアント側での手動設定は不要（httpOnlyクッキーは設定できないため）
        
        // クッキーが確実に保存されるまで少し待機（ブラウザの処理を待つ）
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // ダッシュボードへリダイレクト（window.locationを使用して完全なページリロード）
        window.location.href = "/admin";
    } catch (error) {
        console.error("[Login Handler] Login failed:", error);
        setError((error as Error).message);
        setIsLoading(false);
    }
}

export { handleLogin };