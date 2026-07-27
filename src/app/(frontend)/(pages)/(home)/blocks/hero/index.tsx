import { ArrowRight } from 'lucide-react'

import { Button } from '@/app/(frontend)/components/primitives/button'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Eyebrow } from '@/components/site/Eyebrow'
import { hero } from '@/content/profile'

import styles from './Hero.module.css'

/** Home hero — eyebrow, headline, supporting copy and the two primary CTAs. */
export default function Hero() {
	return (
		<section className={styles.hero} aria-labelledby="hero-heading">
			<Container className={styles.inner}>
				<Eyebrow>{hero.eyebrow}</Eyebrow>
				<h1 id="hero-heading" className={styles.headline}>
					{hero.headline}
				</h1>
				{hero.paragraphs.map((paragraph) => (
					<p key={paragraph} className={styles.paragraph}>
						{paragraph}
					</p>
				))}
				<div className={styles.ctaRow}>
					<Button renders="link" href={hero.primaryCta.href} variant="primary">
						{hero.primaryCta.label}
						<ArrowRight className={styles.ctaIcon} aria-hidden="true" />
					</Button>
					<Button renders="link" href={hero.secondaryCta.href} variant="secondary">
						{hero.secondaryCta.label}
					</Button>
				</div>
			</Container>
		</section>
	)
}
