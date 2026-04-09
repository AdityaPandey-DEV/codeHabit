import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import { MobileSidebar } from "@/components/MobileSidebar";

const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
  name: "DevTrack",
  description: "A professional habit and coding analytics platform for developers. Track progress, monitor LeetCode activity, and master core CS concepts.",
  url: "https://code-habit.vercel.app",
  ogImage: "https://code-habit.vercel.app/opengraph-image.png",
};

export const metadata: Metadata = {
  title: {
    default: "DevTrack — Habit & Coding Analytics Platform",
    template: "%s | DevTrack",
  },
  description: siteConfig.description,
  keywords: [
    "Developer Productivity",
    "Habit Tracker",
    "LeetCode Analytics",
    "Coding Progress",
    "CS Quiz",
    "Software Engineer Tools",
  ],
  authors: [{ name: "DevTrack Team" }],
  creator: "DevTrack",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "DevTrack — Habit & Coding Analytics Platform",
    description: siteConfig.description,
    siteName: "DevTrack",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "DevTrack Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTrack — Habit & Coding Analytics Platform",
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
    creator: "@devtrack",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
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
