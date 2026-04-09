import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { MobileSidebar } from "@/components/MobileSidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevTrack — Habit & Coding Analytics Platform",
  description: "Track habits, monitor LeetCode coding activity, and test knowledge through quizzes in core CS subjects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-full relative bg-[#0a0a0a]">
          <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
            <Sidebar />
          </div>
          <main className="md:pl-72 h-full min-h-screen text-white">
            <div className="md:hidden p-4 flex items-center bg-[#111827] border-b border-[#1f2937]">
              <MobileSidebar />
              <span className="font-bold text-lg ml-2">Dev<span className="text-violet-500">Track</span></span>
            </div>
            {children}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
