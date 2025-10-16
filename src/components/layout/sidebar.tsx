import Image from "next/image";
import Link from "next/link";
import { Sidebar, SidebarHeader, SidebarFooter, SidebarContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Home, Users, Settings, FileText, LogOut, User as UserI } from "lucide-react";
import { User } from "@/lib/service/user";

interface SidebarProps {
    user: User;
}

export default function AdminSidebar({ user }: SidebarProps) {
    const isAdmin = user.role === "ADMIN";

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2 p-4 border-b border-gray-200">
                    <Image
                        src="/assets/logo.png"
                        alt="UniSchool Logo"
                        width={32}
                        height={32}
                        className="rounded"
                    />
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">UniSchool</h1>
                        <p className="text-xs text-gray-500">管理パネル</p>
                    </div>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-lg mx-2"
                        >
                            <Home className="w-5 h-5" />
                            ダッシュボード
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-lg mx-2"
                        >
                            <UserI className="w-5 h-5" />
                            プロフィール
                        </Link>
                    </SidebarMenuItem>
                    {isAdmin && (
                        <SidebarMenuItem>
                            <Link
                                href="/admin/users"
                                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-lg mx-2"
                            >
                                <Users className="w-5 h-5" />
                                ユーザー管理
                            </Link>
                        </SidebarMenuItem>
                    )}
                    <SidebarMenuItem>
                        <Link
                            href="/admin/posts"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-lg mx-2"
                        >
                            <FileText className="w-5 h-5" />
                            投稿管理
                        </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-lg mx-2"
                        >
                            <Settings className="w-5 h-5" />
                            設定
                        </Link>
                    </SidebarMenuItem>


                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuItem>
                    <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2"
                    >
                        <LogOut className="w-5 h-5" />
                        ログアウト
                    </Link>
                </SidebarMenuItem>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                                src={user.profile?.avatarUrl ?? "/assets/logo.png"}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full object-cover border-2 border-primary/20"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user.email}
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-1">
                                {user.role}
                            </span>
                        </div>
                    </div>
                    {user.profile?.bio && (
                        <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                            {user.profile.bio}
                        </p>
                    )}
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}