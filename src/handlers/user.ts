"use client";
import { toast } from "sonner";

async function handleRegistUser(e: React.FormEvent<HTMLFormElement>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    e.preventDefault();
    setIsLoading(true);
    toast.loading("ユーザーを作成中...", { id: "create" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string;
    const team = formData.get("team") as string;

    try {
        const response = await fetch("/api/admin/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password, role, team }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error.message);
        }
        
        console.log("User created successfully:", data);
        toast.success("ユーザーを作成しました", { description: email });
        form.reset();
    } catch (error) {
        console.error("Error creating user:", error);
        toast.error("ユーザーの作成に失敗しました", { description: (error as Error).message });
    } finally {
        setIsLoading(false);
    }

    toast.dismiss("create");
}

export { handleRegistUser };