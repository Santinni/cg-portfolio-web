import '@/app/(frontend)/styles/globals.css'

import { headers } from 'next/headers'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { ThemeScript } from '@/app/(frontend)/components/theme/ThemeScript'
import skipLinkStyles from '@/app/(frontend)/components/layout/SkipLink.module.css'
import styles from '@/app/[locale]/(frontend)/not-found.module.css'
import { Eyebrow } from '@/components/site/Eyebrow'

import csMessages from '../../messages/cs.json'
import enMessages from '../../messages/en.json'

const inter = Inter({ subsets: ['latin', 'latin-ext'] })

/** Full-document 404 used when no route matches across the app's multiple root layouts. */
export default async function GlobalNotFound() {
	const requestHeaders = await headers()
	const locale = requestHeaders.get('X-NEXT-INTL-LOCALE') === 'cs' ? 'cs' : 'en'
	const messages = locale === 'cs' ? csMessages : enMessages
	const homeHref = locale === 'cs' ? '/cs' : '/'

	return (
		<html lang={locale} suppressHydrationWarning>
			<head>
				<title>{`${messages.errors.notFound.eyebrow} | Codeguy`}</title>
				<meta name="description" content={messages.errors.notFound.description} />
				<ThemeScript />
			</head>
			<body className={inter.className}>
				<a className={skipLinkStyles.skipLink} href="#main-content">
					{messages.accessibility.skipToMain}
				</a>
				<main id="main-content" tabIndex={-1}>
					<section className={styles.section} aria-labelledby="global-not-found-heading">
						<Container className={styles.content}>
							<Eyebrow>{messages.errors.notFound.eyebrow}</Eyebrow>
							<h1 id="global-not-found-heading" className={styles.title}>
								{messages.errors.notFound.title}
							</h1>
							<p className={styles.message}>{messages.errors.notFound.description}</p>
							<Link href={homeHref}>
								<ArrowLeft className={styles.icon} aria-hidden="true" />
								{messages.errors.notFound.returnHome}
							</Link>
						</Container>
					</section>
				</main>
			</body>
		</html>
	)
}
