"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, ListTodo, BarChart2, Code2, Book, BrainCircuit, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const routes = [
    {
        label: "Dashboard",
        icon: Home,
        href: "/",
        color: "text-teal-200",
    },
    {
        label: "Habits",
        icon: ListTodo,
        href: "/habits",
        color: "text-teal-200",
    },
    {
        label: "LeetCode",
        icon: Code2,
        href: "/leetcode",
        color: "text-amber-200",
    },
    {
        label: "Quiz",
        icon: BrainCircuit,
        href: "/quiz",
        color: "text-cyan-200",
    },
    {
        label: "Analytics",
        icon: BarChart2,
        href: "/analytics",
        color: "text-teal-200",
    },
    {
        label: "Diary",
        icon: Book,
        href: "/diary",
        color: "text-slate-200",
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    // Don't show sidebar on auth page
    if (pathname === "/auth") return null;

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push("/auth");
    };

    return (
        <div className="space-y-4 py-5 flex flex-col h-full bg-[#102a2a] text-white border-r border-[#264747]">
            <div className="px-3 py-2 flex-1">
                <Link href="/" className="flex items-center pl-3 mb-12">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Code<span className="text-teal-200">Habit</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "text-sm group flex px-3 py-2.5 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-md transition-colors",
                                pathname === route.href ? "text-white bg-teal-950/70 ring-1 ring-inset ring-teal-300/20" : "text-slate-300"
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
            <div className="px-3 py-2 border-t border-[#264747]">
                <button
                    onClick={handleLogout}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-red-500/10 rounded-md transition-colors text-slate-300"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-500" />
                        Logout
                    </div>
                </button>
            </div>
        </div>
    );
}
