import { Button } from '@/app/(frontend)/components/primitives/button'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Section } from '@/components/site/Section'
import { finalCta } from '@/content/profile'

import styles from './FinalCta.module.css'

/** Final hiring-oriented call to action, closing the Home page. */
export default function FinalCta() {
	return (
		<Section id="contact-cta" aria-labelledby="final-cta-heading" tone="raised">
			<Container className={styles.inner}>
				<h2 id="final-cta-heading" className={styles.heading}>
					{finalCta.heading}
				</h2>
				<p className={styles.supporting}>{finalCta.supporting}</p>
				<Button renders="link" href={finalCta.cta.href} variant="primary">
					{finalCta.cta.label}
				</Button>
			</Container>
		</Section>
	)
}
