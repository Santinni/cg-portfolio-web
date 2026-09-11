import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { homeLinks } from '@/content/profile'

import styles from './Hero.module.css'

/**
 * Home hero — identity row, the single brand headline, supporting copy, two actions and the
 * availability line. The flagship case stays primary and the second action books an intro
 * call (HP-02); the availability line names the current role and the roles Karel is open
 * to (HP-03).
 */
export default async function Hero() {
	const t = await getTranslations('home.hero')

	return (
		<section className={styles.hero} aria-labelledby="hero-heading">
			<Container className={styles.inner}>
				<Eyebrow className={styles.eyebrow}>
					{t.rich('eyebrow', {
						name: t('identity.name'),
						identity: (chunks) => <span>{chunks}</span>,
					})}
				</Eyebrow>
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
					<Button renders="link" href={homeLinks.booking} variant="secondary" size="large">
						{t('secondaryCta')}
					</Button>
				</div>
				<p className={styles.availability}>{t('availability')}</p>
			</Container>
		</section>
	)
}
