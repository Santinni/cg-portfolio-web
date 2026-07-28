import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { WorkItem } from '@/content/work'
import { Link } from '@/i18n/navigation'

import styles from './WorkCard.module.css'

interface WorkCardProps {
	item: WorkItem
}

/** Selected-work card. Renders as a link when a case study exists, otherwise as a static pending card. */
export function WorkCard({ item }: WorkCardProps) {
	const t = useTranslations('work')
	const isAvailable = item.status === 'available' && Boolean(item.href)

	return (
		<article className={styles.card}>
			<p className={styles.eyebrow}>{t(`cards.${item.key}.eyebrow`)}</p>
			<h3 className={styles.title}>{t(`cards.${item.key}.title`)}</h3>
			<p className={styles.summary}>{t(`cards.${item.key}.summary`)}</p>
			{item.stack.length > 0 && <p className={styles.stack}>{item.stack.join(' · ')}</p>}
			{isAvailable ? (
				<Link href={item.href as string} className={styles.link}>
					{t('actions.readCase')}
					<ArrowRight className={styles.linkIcon} aria-hidden="true" />
				</Link>
			) : (
				<span className={styles.pending}>{t('actions.pending')}</span>
			)}
		</article>
	)
}
