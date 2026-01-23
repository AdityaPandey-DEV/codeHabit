"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListTodo, BarChart2, Settings, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Habits",
        icon: ListTodo,
        href: "/habits",
        color: "text-violet-500",
    },
    {
        label: "LeetCode",
        icon: Code2,
        href: "/leetcode",
        color: "text-orange-500",
    },
    {
        label: "Analytics",
        icon: BarChart2,
        href: "/analytics",
        color: "text-emerald-500",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    // Don't show sidebar on auth page
    if (pathname === "/auth") return null;

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-[#1f2937]">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-14">
                    <h1 className="text-2xl font-bold">
                        Code<span className="text-violet-500">Habit</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
