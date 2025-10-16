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
            credentials: "include", // クッキーを含める
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.error?.message || "Login failed");
        }

        console.log("Login successful:", data);
        
        // ページをリロードしてセッション状態を更新
        window.location.href = "/admin";
    } catch (error) {
        console.error("Login failed:", error);
        setError((error as Error).message);
    }


    setIsLoading(false);
}

export { handleLogin };