import '@/app/(frontend)/styles/globals.css'

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'

import { SkipLink } from '@/app/(frontend)/components/layout/SkipLink'
import { ThemeScript } from '@/app/(frontend)/components/theme/ThemeScript'
import Navigation from '@/app/(frontend)/components/ui/navigation'
import { siteConfig } from '@/content/site'
import { routing } from '@/i18n/routing'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })
const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || siteConfig.url

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#ffffff',
}

// Only the locales returned by generateStaticParams belong to this route tree.
// Invalid first segments must fall through to the full-document global 404.
export const dynamicParams = false

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) return {}

	const t = await getTranslations({ locale, namespace: 'home.metadata' })
	const title = t('title')
	const description = t('description')

	return {
		metadataBase: new URL(siteUrl),
		title: { default: title, template: `%s | ${siteConfig.name}` },
		description,
		keywords: ['Karel Kutchan', 'React', 'Next.js', 'TypeScript', 'Storybook', 'Playwright'],
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
			locale: locale === 'cs' ? 'cs_CZ' : 'en_US',
			siteName: siteConfig.name,
			title,
			description,
			images: [
				{
					url: '/web-app-manifest-512x512.png',
					width: 512,
					height: 512,
					alt: title,
				},
			],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: ['/web-app-manifest-512x512.png'],
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
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode
	params: Promise<{ locale: string }>
}>) {
	const { locale: requestedLocale } = await params
	const locale = hasLocale(routing.locales, requestedLocale)
		? requestedLocale
		: routing.defaultLocale

	setRequestLocale(locale)
	const messages = await getMessages()

	return (
		<html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
			<head>
				<ThemeScript />
			</head>
			<body className={inter.className}>
				<NextIntlClientProvider messages={messages}>
					<SkipLink />
					<Navigation />
					<main id="main-content" tabIndex={-1}>
						{children}
					</main>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
