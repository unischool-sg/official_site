"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NavLink {
    href: string;
    label: string;
}

const links: NavLink[] = [
    { href: "/#about", label: "About" },
    { href: "/#members", label: "Members" },
    { href: "/#achievements", label: "History" },
    { href: "/blogs", label: "Blogs" },
    { href: "https://forms.gle/SnpJiruyeujYFYjr5", label: "Contact" },
];

export function MobileNav({ isLogin }: { isLogin: boolean }) {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="メニューを開く"
                >
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-3/4 sm:max-w-xs bg-white">
                <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="text-neutral-950 hover:text-green-800 px-2 py-3 rounded-md text-base font-medium transition-colors border-b border-neutral-100"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href={isLogin ? "/admin" : "/login"}
                        onClick={() => setOpen(false)}
                        className="mt-4"
                    >
                        <Button className="w-full bg-neutral-950 hover:bg-neutral-900 text-white">
                            {isLogin ? "Admin" : "Login"}
                        </Button>
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
