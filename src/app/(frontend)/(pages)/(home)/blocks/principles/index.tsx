import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { principlesSection } from '@/content/profile'

import styles from './Principles.module.css'

/** Contrast-tone section stating the engineering principles behind the work. */
export default function Principles() {
	return (
		<Section id="principles" aria-labelledby="principles-heading" tone="contrast">
			<Container>
				<Eyebrow className={styles.eyebrow}>HOW I WORK</Eyebrow>
				<h2 id="principles-heading" className={styles.title}>
					<span className={styles.titleWide}>{principlesSection.titleDesktop}</span>
					<span className={styles.titleCompact}>{principlesSection.titleCompact}</span>
				</h2>
				<ul className={styles.grid}>
					{principlesSection.items.map((principle) => (
						<li key={principle.title} className={styles.item}>
							<h3 className={styles.itemTitle}>{principle.title}</h3>
							<p className={styles.itemDescription}>{principle.description}</p>
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}
