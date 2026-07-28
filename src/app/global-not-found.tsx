import '@/app/(frontend)/styles/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { SkipLink } from '@/app/(frontend)/components/layout/SkipLink'
import { ThemeScript } from '@/app/(frontend)/components/theme/ThemeScript'
import Navigation from '@/app/(frontend)/components/ui/navigation'
import NotFound from '@/app/(frontend)/not-found'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

export const metadata: Metadata = {
	title: 'Page not found | Codeguy',
	description: 'The requested page could not be found.',
	robots: { follow: true, index: false },
}

/** Full-document 404 used when no route matches across the app's multiple root layouts. */
export default function GlobalNotFound() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<ThemeScript />
			</head>
			<body className={inter.className}>
				<SkipLink />
				<Navigation />
				<main id="main-content" tabIndex={-1}>
					<NotFound />
				</main>
			</body>
		</html>
	)
}
