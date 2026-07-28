import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { Button } from '@/app/(frontend)/components/primitives/button'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'
import { homeLinks } from '@/content/profile'

import styles from './ExperienceSnapshot.module.css'

/** Desktop-only experience teaser; hidden on tablet/mobile per the approved layout. */
export default async function ExperienceSnapshot() {
	const t = await getTranslations('home.experience')

	return (
		<Section
			id="experience-snapshot"
			aria-labelledby="experience-snapshot-heading"
			tone="page"
			className={styles.section}
		>
			<Container className={styles.inner}>
				<Eyebrow>{t('eyebrow')}</Eyebrow>
				<h2 id="experience-snapshot-heading" className={styles.title}>
					{t('title')}
				</h2>
				<p className={styles.description}>{t('description')}</p>
				<Button renders="link" href={homeLinks.experience} variant="secondary">
					{t('cta')}
					<ArrowRight className={styles.ctaIcon} aria-hidden="true" />
				</Button>
			</Container>
		</Section>
	)
}
