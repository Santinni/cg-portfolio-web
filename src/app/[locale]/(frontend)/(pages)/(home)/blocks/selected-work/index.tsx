import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { WorkCard } from '@/components/work/WorkCard'
import { selectedWork, type WorkKey } from '@/content/work'

import styles from './SelectedWork.module.css'

function getCompactSummaryKey(key: WorkKey) {
	switch (key) {
		case 'maintenanceApplications':
			return 'cards.maintenanceApplications.summaryCompact' as const
		case 'distributedEnergyPlatform':
			return 'cards.distributedEnergyPlatform.summaryCompact' as const
		case 'accessibilityRefactoring':
			return 'cards.accessibilityRefactoring.summaryCompact' as const
		case 'energyCustomerPortal':
			throw new Error('The flagship case is not part of the Selected Work card grid')
	}
}

/** Selected work — three cards, two linked to case studies and one pending. */
export default async function SelectedWork() {
	const t = await getTranslations('home.selectedWork')

	return (
		<Section
			id="selected-work"
			aria-labelledby="selected-work-heading"
			className={styles.section}
			tone="page"
		>
			<Container id="selected-work-content" className={styles.content}>
				<Eyebrow className={styles.eyebrow}>{t('eyebrow')}</Eyebrow>
				<h2 id="selected-work-heading" className={styles.title}>
					{t('title')}
				</h2>
				<ul className={styles.grid}>
					{selectedWork.map((item) => (
						<li key={item.slug} className={styles.item}>
							<WorkCard
								item={item}
								compactSummary={t(getCompactSummaryKey(item.key))}
								density="responsive"
							/>
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}
