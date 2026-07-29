import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Section } from '@/components/site/Section'
import { homeLinks } from '@/content/profile'

import styles from './FinalCta.module.css'

/** Final hiring-oriented call to action, closing the Home page. */
export default async function FinalCta() {
	const t = await getTranslations('home.finalCta')

	return (
		<Section
			id="contact-cta"
			aria-labelledby="final-cta-heading"
			tone="page"
			desktopTone="subtle"
			className={styles.section}
		>
			<Container id="final-cta-inner" className={styles.inner}>
				<h2 id="final-cta-heading" className={styles.heading}>
					{t('heading')}
				</h2>
				<p id="final-cta-supporting" className={styles.supporting}>
					{t('supporting')}
				</p>
				<Button
					id="final-cta-action"
					renders="link"
					href={homeLinks.contact}
					variant="primary"
					size="large"
				>
					{t('cta')}
				</Button>
			</Container>
		</Section>
	)
}
