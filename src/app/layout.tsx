import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/AppShell";

const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
  name: "CodeHabit",
  description: "A personal workspace for habits, study sessions, quizzes, and coding activity.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://app.codehabit.com",
  ogImage: "/opengraph-image.png",
};

export const metadata: Metadata = {
  title: {
    default: "CodeHabit",
    template: "%s | CodeHabit",
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
  authors: [{ name: "CodeHabit" }],
  creator: "CodeHabit",
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: "CodeHabit",
    description: siteConfig.description,
    siteName: "CodeHabit",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CodeHabit Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeHabit",
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: "/icon.svg",
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
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  );
}
