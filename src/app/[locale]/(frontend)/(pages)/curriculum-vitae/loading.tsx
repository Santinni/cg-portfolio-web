import { useTranslations } from 'next-intl'

import styles from '@/app/(frontend)/styles/loading.module.css'

/** Loading spinner shown while the Curriculum Vitae page is loading. */
export default function Loading() {
	const t = useTranslations('errors')

	return (
		<div className={styles.container}>
			<div className={styles.spinner} />
			<p className={styles.text}>{t('loading')}</p>
		</div>
	)
}
