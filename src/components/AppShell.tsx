"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { AppFooter } from "@/components/AppFooter";

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (["/auth", "/privacy", "/terms"].includes(path)) return <>{children}</>;
  return <div className="min-h-screen bg-[#f7f8fa] text-[#15212b]">
    <aside className="hidden md:fixed md:inset-y-0 md:z-40 md:flex md:w-64 md:flex-col"><Sidebar /></aside>
    <div className="md:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#dbe2e5] bg-[#f7f8fa]/95 px-4 backdrop-blur md:hidden"><MobileSidebar /><span className="ml-2 font-semibold">CodeHabit</span></header><main className="min-h-[calc(100vh-4rem)]">{children}</main><AppFooter /></div>
  </div>;
}
