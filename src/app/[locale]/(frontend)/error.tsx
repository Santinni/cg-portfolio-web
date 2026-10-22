'use client'

import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'

import styles from './not-found.module.css'

/**
 * Error boundary for everything below the localized root layout: an unhandled runtime
 * error renders this instead of the framework's bare "Application error" document.
 * Same hierarchy and tokens as the 404 boundary (eyebrow, h1, lead, actions); the
 * underlying message stays in the console and server logs, never on the page.
 */
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	const t = useTranslations('errors.runtime')

	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<section className={styles.section} aria-labelledby="runtime-error-heading">
			<Container className={styles.content}>
				<Eyebrow>{t('eyebrow')}</Eyebrow>
				<h1 id="runtime-error-heading" className={styles.title}>
					{t('title')}
				</h1>
				<p className={styles.message}>{t('description')}</p>
				<div className={styles.actions}>
					<Button onClick={reset} variant="primary">
						{t('tryAgain')}
					</Button>
					<Button renders="link" href="/" variant="secondary">
						<ArrowLeft className={styles.icon} aria-hidden="true" />
						{t('goHome')}
					</Button>
				</div>
			</Container>
		</section>
	)
}
