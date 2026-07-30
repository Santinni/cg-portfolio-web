import { useTranslations } from 'next-intl'

import styles from './loading.module.css'

/** Theme-aware route-local loading state for the Curriculum Vitae page. */
export default function Loading() {
	const t = useTranslations('errors')
	const label = t('loading')

	return (
		<div className={styles.container} role="status" aria-label={label} aria-busy="true">
			<span className={styles.spinner} aria-hidden="true" />
			<p>{label}</p>
		</div>
	)
}
