import { Container } from '@/app/(frontend)/components/layout/Container'
import { getTranslations } from 'next-intl/server'
import { Section } from '@/components/site/Section'
import { WorkCard } from '@/components/work/WorkCard'
import { selectedWork } from '@/content/work'

import styles from './SelectedWork.module.css'

/** Selected work — three cards, two linked to case studies and one pending. */
export default async function SelectedWork() {
	const t = await getTranslations('home.selectedWork')

	return (
		<Section id="selected-work" aria-labelledby="selected-work-heading" tone="page">
			<Container>
				<h2 id="selected-work-heading" className={styles.title}>
					{t('title')}
				</h2>
				<ul className={styles.grid}>
					{selectedWork.map((item) => (
						<li key={item.slug} className={styles.item}>
							<WorkCard item={item} />
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}
