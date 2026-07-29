import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { homeLinks } from '@/content/profile'

import styles from './Hero.module.css'

/** Home hero — eyebrow, headline, supporting copy and the two primary CTAs. */
export default async function Hero() {
	const t = await getTranslations('home.hero')

	return (
		<section className={styles.hero} aria-labelledby="hero-heading">
			<Container className={styles.inner}>
				<Eyebrow className={styles.eyebrow}>{t('eyebrow')}</Eyebrow>
				<h1 id="hero-heading" className={styles.headline}>
					{t('headline')}
				</h1>
				{(['experience', 'quality'] as const).map((key) => (
					<p key={key} className={styles.paragraph}>
						<span className={styles.desktopCopy}>{t(`paragraphs.${key}`)}</span>
						<span className={styles.compactCopy}>{t(`paragraphsCompact.${key}`)}</span>
					</p>
				))}
				<div className={styles.ctaRow}>
					<Button renders="link" href={homeLinks.flagshipCase} variant="primary" size="large">
						{t('primaryCta')}
						<ArrowRight className={styles.ctaIcon} aria-hidden="true" />
					</Button>
					<Button renders="link" href={homeLinks.experience} variant="secondary" size="large">
						{t('secondaryCta')}
					</Button>
				</div>
			</Container>
		</section>
	)
}
