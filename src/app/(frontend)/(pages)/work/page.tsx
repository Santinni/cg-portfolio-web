import type { Metadata } from 'next'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { WorkCard } from '@/components/work/WorkCard'
import { workItems } from '@/content/work'

import styles from './WorkPage.module.css'

export const metadata: Metadata = {
	title: 'Work',
	description:
		'Selected frontend architecture, product engineering and accessibility work by Karel Kutchan.',
	alternates: { canonical: '/work' },
	openGraph: {
		title: 'Selected work — Karel Kutchan',
		description:
			'Selected frontend architecture, product engineering and accessibility work by Karel Kutchan.',
		url: '/work',
	},
}

export default function WorkPage() {
	return (
		<>
			<header className={styles.hero}>
				<Container className={styles.heroInner}>
					<Eyebrow>SELECTED WORK</Eyebrow>
					<h1 className={styles.title}>Frontend systems built for products that have to last.</h1>
					<p className={styles.intro}>
						A selection of architecture, component foundations and delivery work across energy and
						enterprise products.
					</p>
				</Container>
			</header>

			<section className={styles.work} aria-labelledby="work-list-heading">
				<Container>
					<h2 id="work-list-heading" className={styles.visuallyHidden}>
						Case studies
					</h2>
					<ul className={styles.grid}>
						{workItems.map((item) => (
							<li key={item.slug} className={styles.item}>
								<WorkCard item={item} />
							</li>
						))}
					</ul>
				</Container>
			</section>
		</>
	)
}
