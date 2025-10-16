import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { User } from "@/lib/service/user";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        const user = await User.get({ email });
        if (!user) {
            return NextResponse.json(
                { 
                    success: false,
                    error: { message: "ユーザーが見つかりません" } 
                },
                { status: 404 }
            );
        }

        const token = await user.login(password);
        if (!token) {
            return NextResponse.json(
                { 
                    success: false,
                    error: { message: "パスワードが正しくありません" } 
                },
                { status: 401 }
            );
        }

        // レスポンスを作成
        const response = NextResponse.json(
            { 
                success: true,
                data: { 
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                        team: user.team,
                        profile: user.profile
                    }
                }
            },
            { status: 200 }
        );

        // クッキーを設定
        const isProduction = process.env.NODE_ENV === "production";
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        const isHttps = appUrl.startsWith("https://");
        
        response.cookies.set({
            name: "s-token",
            value: token,
            httpOnly: true,
            secure: isProduction && isHttps, // 本番環境でHTTPSの場合のみtrue
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        console.log("Cookie set:", { 
            token: token.substring(0, 20) + "...",
            isProduction,
            appUrl,
            isHttps,
            secure: isProduction && isHttps
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { 
                success: false,
                error: { message: "ログインに失敗しました" } 
            },
            { status: 500 }
        );
    }
}