import "@/app/(frontend)/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { SkipLink } from "@/app/(frontend)/components/layout/SkipLink";
import { ThemeScript } from "@/app/(frontend)/components/theme/ThemeScript";
import Navigation from "@/app/(frontend)/components/ui/navigation";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Codeguy - Web Solutions",
  description:
    "Codeguy - Profesionální webová řešení a vývoj moderních webových aplikací. Specializujeme se na React, Next.js a TypeScript.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "64x64", type: "image/x-icon" },
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={inter.className}>
        <SkipLink />
        <Navigation />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </body>
    </html>
  );
}
