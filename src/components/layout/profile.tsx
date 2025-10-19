"use client";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { handleProfileUpdate } from "@/handlers/profile";
import { User, Profile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileUpdateFormProps {
     user: Omit<User, "password"> & { profile: Profile | null };
     endpoint?: string;
}

export default function ProfileUpdateForm({ user, endpoint = "/api/me" }: ProfileUpdateFormProps) {
     const router = useRouter();
     const [isLoading, setIsLoading] = useState<boolean>(false);
     const [isError, setIsError] = useState<string | null>(null);
     const [avatarPreview, setAvatarPreview] = useState<string | null>(
          user.profile?.avatarUrl || null,
     );

     const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
               const reader = new FileReader();
               reader.onloadend = () => {
                    setAvatarPreview(reader.result as string);
               };
               reader.readAsDataURL(file);
          }
     };

     return (
          <form
               onSubmit={(e) => {
                    handleProfileUpdate(e, router, setIsLoading, setIsError, endpoint);
               }}
               className="space-y-6"
          >
               {isError && (
                    <Card className="border-red-500 bg-red-50">
                         <CardContent className="pt-6">
                              <p className="text-sm text-red-600">{isError}</p>
                         </CardContent>
                    </Card>
               )}

               <Card>
                    <CardHeader>
                         <CardTitle>基本情報</CardTitle>
                         <CardDescription>
                              あなたのプロフィール情報を編集できます
                         </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="name">
                                   名前 <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                   id="name"
                                   name="name"
                                   type="text"
                                   defaultValue={user.name}
                                   placeholder="山田 太郎"
                                   required
                                   disabled={isLoading}
                              />
                         </div>

                         <div className="space-y-2">
                              <Label htmlFor="bio">自己紹介</Label>
                              <Textarea
                                   id="bio"
                                   name="bio"
                                   defaultValue={user.profile?.bio || ""}
                                   placeholder="あなたについて教えてください..."
                                   rows={4}
                                   disabled={isLoading}
                              />
                              <p className="text-sm text-muted-foreground">
                                   あなたの経歴、趣味、スキルなどを記入してください
                              </p>
                         </div>

                         <div className="flex items-center space-x-2">
                              <input
                                   type="checkbox"
                                   id="isPublic"
                                   name="isPublic"
                                   defaultChecked={
                                        user.profile?.isPublic || false
                                   }
                                   disabled={isLoading}
                                   className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Label
                                   htmlFor="isPublic"
                                   className="cursor-pointer"
                              >
                                   プロフィールを公開する
                              </Label>
                         </div>
                    </CardContent>
               </Card>

               <Card>
                    <CardHeader>
                         <CardTitle>アバター画像</CardTitle>
                         <CardDescription>
                              PNG、JPEG、GIF形式、5MB以下
                         </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         {avatarPreview && (
                              <div className="flex justify-center">
                                   <img
                                        src={avatarPreview}
                                        alt="Avatar preview"
                                        className="h-32 w-32 rounded-full object-cover border-2 border-gray-200"
                                   />
                              </div>
                         )}
                         <div className="space-y-2">
                              <Label htmlFor="avatar">画像をアップロード</Label>
                              <Input
                                   id="avatar"
                                   name="avatar"
                                   type="file"
                                   accept="image/png,image/jpeg,image/gif"
                                   onChange={handleAvatarChange}
                                   disabled={isLoading}
                              />
                         </div>
                    </CardContent>
               </Card>

               <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                         {isLoading ? "更新中..." : "プロフィールを更新"}
                    </Button>
               </div>
          </form>
     );
}
