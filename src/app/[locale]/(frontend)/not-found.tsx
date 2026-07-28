import { ArrowLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'

import styles from './not-found.module.css'

/**
 * Custom 404 Not Found page.
 * Displayed when a user navigates to a non-existent route.
 */
export default function NotFound() {
	const t = useTranslations('errors.notFound')

	return (
		<section className={styles.section} aria-labelledby="not-found-heading">
			<Container className={styles.content}>
				<Eyebrow>{t('eyebrow')}</Eyebrow>
				<h1 id="not-found-heading" className={styles.title}>
					{t('title')}
				</h1>
				<p className={styles.message}>{t('description')}</p>
				<Button renders="link" href="/" variant="primary">
					<ArrowLeft className={styles.icon} aria-hidden="true" />
					{t('returnHome')}
				</Button>
			</Container>
		</section>
	)
}
