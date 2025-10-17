"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

async function handlePasswordReset(
     e: React.FormEvent<HTMLFormElement>,
     setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
     setError: React.Dispatch<React.SetStateAction<string | null>>,
     router: AppRouterInstance,
) {
     e.preventDefault();
     toast.loading("パスワードをリセット中...", { id: "reset-password" });
     setIsLoading(true);
     setError(null);

     // 値の取得
     const formData = new FormData(e.currentTarget);
     const token = formData.get("token") as string;
     const password = formData.get("password") as string;
     const confirmPassword = formData.get("confirmPassword") as string;

     // バリデーション
     if (password.length < 8) {
          setError("パスワードは8文字以上で入力してください");
          toast.error("パスワードは8文字以上で入力してください");
          toast.dismiss("reset-password");
          setIsLoading(false);
          return;
     }

     if (password !== confirmPassword) {
          setError("パスワードが一致しません");
          toast.error("パスワードが一致しません");
          toast.dismiss("reset-password");
          setIsLoading(false);
          return;
     }

     // ここに実際のAPI呼び出しを実装
     console.log("Password reset:", { token, password });
     const response = await fetch("/api/auth/reset/password", {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
               Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
     });
     const data = await response.json();

     if (response.ok && data.success) {
          toast.success(
               "パスワードをリセットしました！ログインページに移動します。",
          );
          router.push("/login");
     } else {
          setError(data.message || "パスワードのリセットに失敗しました");
     }
     setIsLoading(false);
     toast.dismiss("reset-password");
}

export { handlePasswordReset };
