"use client";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Logout() {
    const router = useRouter();

    const handleLogout = (async () => {
        if (confirm("ログアウトしますか？")) {
            router.push("/api/auth/logout");
        }
        return;
    });

    return (
        <SidebarMenuItem>
            <div className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2" onClick={handleLogout}>
                <LogOut className="w-5 h-5" />
                ログアウト
            </div>
        </SidebarMenuItem>
    )
}