"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { handleLogin } from "@/handlers/login";
import { useRouter } from "next/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-background/60 p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <BlurFade delay={0.3} inView>
        <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Image
                  src="/assets/logo.png"
                  alt="Uni School Logo"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-pulse"></div>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Uni School
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              クリエイターチームへのログイン
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={(e) => handleLogin(e, setIsLoading, setError, router)} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  メールアドレス
                </Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  className="h-12 transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  パスワード
                </Label>
                <Input
                  name="password"
                  type="password"
                  placeholder="•••••••"
                  required
                  className="h-12 transition-all duration-200 focus:scale-[1.02] focus:shadow-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>ログイン中...</span>
                  </div>
                ) : (
                  "ログイン"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                We are team of Creators. We are students. But we are pro.
              </p>
            </div>
          </CardContent>
        </Card>
      </BlurFade>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
