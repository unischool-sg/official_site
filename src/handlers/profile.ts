"use client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

async function handleProfileUpdate(
     e: React.FormEvent<HTMLFormElement>,
     router: AppRouterInstance,
     setIsLoading: (loading: boolean) => void,
     setIsError: (error: string | null) => void,
) {
     e.preventDefault();
     setIsLoading(true);
     setIsError(null);
     toast.loading("プロフィールを更新中...", { id: "update-profile" });

     const formData = new FormData(e.currentTarget);
     const name = formData.get("name") as string;
     const bio = formData.get("bio") as string;
     const avatar = formData.get("avatar") as File | null;
     const isPublic = formData.get("isPublic") === "on";

     if (avatar) {
          if (avatar.size > 5 * 1024 * 1024) {
               setIsError("アバター画像は5MB以下にしてください。");
               setIsLoading(false);
               toast.error("アバター画像が大きすぎます", { id: "update-profile" });
               return;
          }
          if (!["image/png", "image/jpeg", "image/gif"].includes(avatar.type)) {
               setIsError("アバター画像はPNG、JPEG、GIF形式にしてください。");
               setIsLoading(false);
               toast.error("アバター画像の形式が無効です", { id: "update-profile" });
               return;
          }

          toast.dismiss("update-profile");
          toast.loading("アバター画像をアップロード中...", {
               id: "update-profile",
          });
          const formData = new FormData();
          formData.append("avatar", avatar);
          const uploadResponse = await fetch("/api/user/me/avatar", {
               method: "POST",
               body: formData,
          });

          if (!uploadResponse.ok) {
               setIsError(
                    "アバター画像のアップロード中にエラーが発生しました。",
               );
               setIsLoading(false);
               toast.error("アバター画像のアップロードに失敗しました", {
                    id: "update-profile",
               });
               return;
          }
          toast.success("アバター画像をアップロードしました", {
               id: "update-profile",
          });
          router.refresh();
     }

     try {
          const data = {
               name,
               bio,
               isPublic,
          };
          const response = await fetch("/api/user/me/profile", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },
               body: JSON.stringify(data),
          });
          if (response.ok) {
               toast.success("プロフィールを更新しました", {
                    id: "update-profile",
               });
               router.refresh();
          }
          const result = await response.json();
          if (!response.ok) {
               throw new Error(
                    result.error?.message || "プロフィールの更新に失敗しました",
               );
          }
          return;
     } catch (error) {
          console.error("Profile update error:", error);
          setIsError("プロフィールの更新中にエラーが発生しました。");
          toast.error("プロフィールの更新に失敗しました", {
               description: (error as Error).message,
          });
     }

     toast.dismiss("update-profile");
     setIsLoading(false);
     router.refresh();
}

export { handleProfileUpdate };
