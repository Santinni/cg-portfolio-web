import { ArrowDownToLine, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'
import { Timeline } from '@/components/site/Timeline'
import { experiencePage } from '@/content/experience'

import styles from './page.module.css'

export const metadata: Metadata = {
	title: 'Experience',
	description:
		'More than ten years of frontend engineering across customer portals, enterprise applications, energy products and component systems.',
	alternates: { canonical: '/experience' },
}

export default function ExperiencePage() {
	return (
		<>
			<PageIntro
				eyebrow={experiencePage.eyebrow}
				title={experiencePage.title}
				intro={experiencePage.intro}
			/>

			<Section aria-labelledby="experience-timeline-heading" tone="raised">
				<Container className={styles.timelineLayout}>
					<div className={styles.sectionHeading}>
						<Eyebrow>PROGRESSION</Eyebrow>
						<h2 id="experience-timeline-heading" className={styles.heading}>
							Increasing ownership across products and teams.
						</h2>
					</div>
					<Timeline entries={experiencePage.timeline} />
				</Container>
			</Section>

			<Section aria-labelledby="capabilities-heading" tone="page">
				<Container className={styles.capabilities}>
					<div className={styles.sectionHeading}>
						<Eyebrow>CORE CAPABILITIES</Eyebrow>
						<h2 id="capabilities-heading" className={styles.heading}>
							Tools and practices used in delivery.
						</h2>
					</div>
					<p className={styles.capabilityList}>{experiencePage.capabilities}</p>
					<div className={styles.actions}>
						<Button renders="link" href="/curriculum-vitae" variant="secondary">
							View curriculum vitae
							<ArrowRight className={styles.icon} aria-hidden="true" />
						</Button>
						<Button
							renders="link"
							href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
							download
							variant="text"
						>
							Download PDF
							<ArrowDownToLine className={styles.icon} aria-hidden="true" />
						</Button>
					</div>
				</Container>
			</Section>
		</>
	)
}
