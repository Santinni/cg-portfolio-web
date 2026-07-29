import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'

import type { WorkItem } from '@/content/work'
import { Link } from '@/i18n/navigation'

import styles from './WorkCard.module.css'

type WorkCardProps =
	| {
			item: WorkItem
			compactSummary?: never
			density?: 'standard'
	  }
	| {
			item: WorkItem
			compactSummary: string
			density: 'responsive'
	  }

/** Selected-work card. Renders as a link when a case study exists, otherwise as a static pending card. */
export function WorkCard({ item, compactSummary, density = 'standard' }: WorkCardProps) {
	const t = useTranslations('work')
	const isAvailable = item.status === 'available' && Boolean(item.href)
	const cardClassName =
		density === 'responsive' ? `${styles.card} ${styles.responsive}` : styles.card

	return (
		<article className={cardClassName} data-work-key={item.key}>
			<div className={styles.content} data-work-card-content>
				<p className={styles.eyebrow}>{t(`cards.${item.key}.eyebrow`)}</p>
				<h3 className={styles.title}>{t(`cards.${item.key}.title`)}</h3>
				<p className={styles.summary}>
					<span className={styles.wideSummary} data-summary-variant="wide">
						{t(`cards.${item.key}.summary`)}
					</span>
					{compactSummary && (
						<span className={styles.compactSummary} data-summary-variant="compact">
							{compactSummary}
						</span>
					)}
				</p>
				{item.stack.length > 0 && <p className={styles.stack}>{item.stack.join(' · ')}</p>}
			</div>
			{isAvailable ? (
				<Link href={item.href as string} className={styles.link} data-work-card-action>
					{t('actions.readCase')}
					<ArrowRight className={styles.linkIcon} aria-hidden="true" />
				</Link>
			) : (
				<span className={styles.pending} data-work-card-pending>
					{t('actions.pending')}
				</span>
			)}
		</article>
	)
}
