import { NextResponse } from "next/server";

export async function GET() {
    const response = NextResponse.json({ message: "Cookie test" });
    
    response.cookies.set({
        name: "test-cookie",
        value: "test-value-123",
        httpOnly: false, // ブラウザで確認できるように
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 5, // 5分
        path: "/",
    });

    console.log("Test cookie set");
    
    return response;
}
