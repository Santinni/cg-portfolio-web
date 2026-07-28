import { ArrowRight } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/primitives/button'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { experienceSnapshot } from '@/content/profile'

import styles from './ExperienceSnapshot.module.css'

/** Desktop-only experience teaser; hidden on tablet/mobile per the approved layout. */
export default function ExperienceSnapshot() {
	return (
		<Section
			id="experience-snapshot"
			aria-labelledby="experience-snapshot-heading"
			tone="page"
			className={styles.section}
		>
			<Container className={styles.inner}>
				<Eyebrow>{experienceSnapshot.eyebrow}</Eyebrow>
				<h2 id="experience-snapshot-heading" className={styles.title}>
					{experienceSnapshot.title}
				</h2>
				<p className={styles.description}>{experienceSnapshot.description}</p>
				<Button renders="link" href={experienceSnapshot.cta.href} variant="secondary">
					{experienceSnapshot.cta.label}
					<ArrowRight className={styles.ctaIcon} aria-hidden="true" />
				</Button>
			</Container>
		</Section>
	)
}
