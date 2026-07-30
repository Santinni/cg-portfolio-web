import { useTranslations } from 'next-intl'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { Section } from '@/components/site/Section'

import styles from './BookingCta.module.css'

export type BookingCtaSource = 'contact' | 'experience' | 'curriculumVitae' | 'caseStudy'

interface BookingCtaProps {
	source: BookingCtaSource
}

/** Contextual entry point to the centralized localized booking route. */
export function BookingCta({ source }: BookingCtaProps) {
	const t = useTranslations('booking.entryPoints')
	const headingId = `booking-cta-${source}-heading`

	return (
		<Section aria-labelledby={headingId} tone="contrast">
			<Container className={styles.layout} data-booking-source={source}>
				<div className={styles.copy}>
					<Eyebrow className={styles.eyebrow}>{t(`${source}.eyebrow`)}</Eyebrow>
					<h2 id={headingId} className={styles.heading}>
						{t(`${source}.title`)}
					</h2>
					<p className={styles.body}>{t(`${source}.body`)}</p>
				</div>
				<Button renders="link" href="/contact/book" size="large" variant="primary">
					{t(`${source}.action`)}
				</Button>
			</Container>
		</Section>
	)
}
