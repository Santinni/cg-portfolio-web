'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Button } from '@/app/(frontend)/components/primitives/button'
import styles from '@/app/(frontend)/styles/error.module.css'

/**
 * Global error boundary page displayed when an unhandled error occurs.
 * Provides a "Try again" button (calls `reset()`) and a "Go home" link.
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
		<div className={styles.container}>
			<div className={styles.content}>
				<h1 className={styles.title}>{t('title')}</h1>
				<p className={styles.message}>{t('description')}</p>
				<div className={styles.actions}>
					<Button onClick={reset}>{t('tryAgain')}</Button>
					<Button renders="link" href="/">
						{t('goHome')}
					</Button>
				</div>
			</div>
		</div>
	)
}
