import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation/Navigation";

const inter = Inter({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Codeguy - Web Solutions",
  description:
    "Codeguy - Profesionální webová řešení a vývoj moderních webových aplikací. Specializujeme se na React, Next.js a TypeScript.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
