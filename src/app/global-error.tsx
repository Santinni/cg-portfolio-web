'use client'

import '@/app/(frontend)/styles/globals.css'

import { ArrowLeft } from 'lucide-react'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { useEffect, useSyncExternalStore } from 'react'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { ThemeScript } from '@/app/(frontend)/components/theme/ThemeScript'
import styles from '@/app/[locale]/(frontend)/not-found.module.css'
import { Eyebrow } from '@/components/site/Eyebrow'
import { siteConfig } from '@/content/site'
import { routing } from '@/i18n/routing'

import csMessages from '../../messages/cs.json'
import enMessages from '../../messages/en.json'

const messagesByLocale = { cs: csMessages, en: enMessages } as const

type Locale = keyof typeof messagesByLocale

function subscribeToNothing() {
	return () => {}
}

/**
 * The root layout that normally knows the locale is the thing that failed, so read it
 * from the URL instead. The server snapshot is the default locale; a Czech visitor whose
 * error was rendered on the server sees the English copy until hydration swaps it.
 */
function readLocaleFromLocation(): Locale {
	const [firstSegment] = window.location.pathname.split('/').filter(Boolean)
	return hasLocale(routing.locales, firstSegment) ? firstSegment : routing.defaultLocale
}

function readDefaultLocale(): Locale {
	return routing.defaultLocale
}

/**
 * Full-document error boundary for a failure inside a root layout itself. It replaces the
 * layout, so it brings its own html/body, global styles and theme script, and reuses the
 * 404/500 boundary hierarchy so the page still looks like the site.
 *
 * No `next/font` here: in a client module Turbopack dev rejects the loader call ("Font
 * loader calls must be assigned to a const") and every route then answers 500. The body
 * names Inter with system fallbacks instead, like the Caddy holding page.
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const locale = useSyncExternalStore(subscribeToNothing, readLocaleFromLocation, readDefaultLocale)
	const messages = messagesByLocale[locale]
	const copy = messages.errors.runtime

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<html lang={locale} suppressHydrationWarning data-scroll-behavior="smooth">
			<head>
				<title>{`${copy.title} | ${siteConfig.name}`}</title>
				<ThemeScript />
			</head>
			<body className={styles.globalDocument}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<main id="main-content" tabIndex={-1}>
						<section className={styles.section} aria-labelledby="global-error-heading">
							<Container className={styles.content}>
								<Eyebrow>{copy.eyebrow}</Eyebrow>
								<h1 id="global-error-heading" className={styles.title}>
									{copy.title}
								</h1>
								<p className={styles.message}>{copy.description}</p>
								<div className={styles.actions}>
									<Button onClick={reset} variant="primary">
										{copy.tryAgain}
									</Button>
									<Button renders="link" href="/" variant="secondary">
										<ArrowLeft className={styles.icon} aria-hidden="true" />
										{copy.goHome}
									</Button>
								</div>
							</Container>
						</section>
					</main>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
