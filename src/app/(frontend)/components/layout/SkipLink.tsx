import { useTranslations } from 'next-intl'

import styles from './SkipLink.module.css'

export function SkipLink() {
	const t = useTranslations('accessibility')

	return (
		<a className={styles.skipLink} href="#main-content">
			{t('skipToMain')}
		</a>
	)
}
