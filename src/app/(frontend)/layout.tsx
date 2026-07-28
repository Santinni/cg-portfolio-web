import '@/app/(frontend)/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'

import { SkipLink } from '@/app/(frontend)/components/layout/SkipLink'
import { ThemeScript } from '@/app/(frontend)/components/theme/ThemeScript'
import Navigation from '@/app/(frontend)/components/ui/navigation'
import { siteConfig } from '@/content/site'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })
const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || siteConfig.url

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#ffffff',
}

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: siteConfig.title,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [
		'Karel Kutchan',
		'senior frontend engineer',
		'React',
		'Next.js',
		'TypeScript',
		'frontend architecture',
		'accessibility',
		'Prague',
	],
	authors: [{ name: 'Karel Kutchan', url: siteUrl }],
	creator: 'Karel Kutchan',
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
		locale: siteConfig.locale,
		url: siteUrl,
		siteName: siteConfig.name,
		title: siteConfig.title,
		description: siteConfig.description,
		images: [
			{
				url: '/web-app-manifest-512x512.png',
				width: 512,
				height: 512,
				alt: siteConfig.title,
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		title: siteConfig.title,
		description: siteConfig.description,
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
		<html lang="en" suppressHydrationWarning>
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
