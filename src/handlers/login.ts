"use client";
import { NextRouter } from "next/router";
async function handleLogin(e: React.FormEvent, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, router: NextRouter) {
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
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Login failed");
        }

        const data = await response.json();
        console.log("Login successful:", data);
        // リダイレクトなどの処理をここに追加
        router.push("/dashboard"); // 例: ダッシュボードページへリダイレクト
    } catch (error) {
        console.error("Login failed:", error);
    }


    setIsLoading(false);
}

export { handleLogin };