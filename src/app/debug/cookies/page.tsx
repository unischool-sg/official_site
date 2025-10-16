"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function CookieDebugPage() {
    const [result, setResult] = useState<any>(null);

    const testSetCookie = async () => {
        const res = await fetch("/api/test-cookie");
        const data = await res.json();
        setResult({ 
            status: res.status,
            headers: Object.fromEntries(res.headers.entries()),
            data 
        });
    };

    const checkCookies = () => {
        const cookies = document.cookie;
        setResult({ cookies });
    };

    const testLogin = async () => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                email: "test@example.com", 
                password: "test123" 
            }),
            credentials: "include"
        });
        const data = await res.json();
        setResult({ 
            status: res.status,
            setCookie: res.headers.get("set-cookie"),
            data 
        });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Cookie Debug Tool</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Cookie Tests</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Button onClick={testSetCookie}>Test Set Cookie API</Button>
                        <Button onClick={checkCookies} variant="outline">Check Cookies</Button>
                        <Button onClick={testLogin} variant="secondary">Test Login</Button>
                    </div>

                    {result && (
                        <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    )}

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Current Cookies:</h3>
                        <code className="text-xs bg-muted p-2 block rounded">
                            {document.cookie || "(none)"}
                        </code>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
