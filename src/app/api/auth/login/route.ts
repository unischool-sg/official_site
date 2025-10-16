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

        // クッキーを設定
        const cookieStore = await cookies();
        
        // Next.js 15では、cookieStoreから直接レスポンスを作成する必要がある
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

        // レスポンスヘッダーにSet-Cookieを設定
        response.cookies.set("s-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
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