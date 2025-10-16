"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

async function handleRegistUser(
     e: React.FormEvent<HTMLFormElement>,
     setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
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
          toast.error("ユーザーの作成に失敗しました", {
               description: (error as Error).message,
          });
     } finally {
          setIsLoading(false);
     }

     toast.dismiss("create");
}

async function handleRegistTokenUser(
     e: React.FormEvent<HTMLFormElement>,
     setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
     setError: React.Dispatch<React.SetStateAction<string | null>>,
     router: AppRouterInstance,
) {
     e.preventDefault();
     toast.loading("ユーザーを登録...", { id: "create" });
     setIsLoading(true);
     setError(null);

     const form = e.currentTarget;
     const formData = new FormData(form);

     const token = formData.get("token") as string;
     const name = formData.get("name") as string;
     const password = formData.get("password") as string;
     const confirmPassword = formData.get("confirmPassword") as string;
     const bio = formData.get("bio") as string;

     if (password !== confirmPassword) {
          setError("パスワードが一致しません");
          setIsLoading(false);
          toast.dismiss("create");
          return;
     }

     try {
          const response = await fetch("/api/auth/register/token", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ name, password, bio }),
          });

          const data = await response.json();
          if (!response.ok) {
               throw new Error(data.error.message);
          }

          console.log("User registered successfully:", data);
          toast.success("ユーザーが登録されました", {
               description: data.data.user.email,
          });
          form.reset();

          router.refresh();
          router.push("/admin");
     } catch (error) {
          console.error("Error registering user:", error);
          toast.error("ユーザーの登録に失敗しました", {
               description: (error as Error).message,
          });
     } finally {
          setIsLoading(false);
     }

     toast.dismiss("create");
}

export { handleRegistUser, handleRegistTokenUser };
