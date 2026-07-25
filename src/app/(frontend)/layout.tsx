import '@/app/(frontend)/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { SkipLink } from '@/app/(frontend)/components/layout/SkipLink'
import { ThemeScript } from '@/app/(frontend)/components/theme/ThemeScript'
import Navigation from '@/app/(frontend)/components/ui/navigation'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })
const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Codeguy - Web Solutions',
    template: '%s | Codeguy',
  },
  description:
    'Codeguy - Profesionální webová řešení a vývoj moderních webových aplikací. Specializujeme se na React, Next.js a TypeScript.',
  keywords: [
    'web development',
    'React',
    'Next.js',
    'TypeScript',
    'webové aplikace',
    'Codeguy',
    'frontend',
    'fullstack',
  ],
  authors: [{ name: 'Codeguy', url: siteUrl }],
  creator: 'Codeguy',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'cs_CZ',
    url: siteUrl,
    siteName: 'Codeguy',
    title: 'Codeguy - Web Solutions',
    description:
      'Profesionální webová řešení a vývoj moderních webových aplikací.',
    images: [
      {
        url: '/web-app-manifest-512x512.png',
        width: 512,
        height: 512,
        alt: 'Codeguy - Web Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codeguy - Web Solutions',
    description:
      'Profesionální webová řešení a vývoj moderních webových aplikací.',
    images: ['/web-app-manifest-512x512.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '64x64', type: 'image/x-icon' },
      {
        url: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
  )
}
