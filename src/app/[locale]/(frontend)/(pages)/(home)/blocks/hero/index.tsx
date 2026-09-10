import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { ContactLink } from '@/components/site/ContactLink'
import { Eyebrow } from '@/components/site/Eyebrow'
import { contactMethods } from '@/content/contact'
import { homeLinks } from '@/content/profile'

import styles from './Hero.module.css'

/** The one direct channel the hero exposes; the address itself lives in the contact model. */
const emailMethod = contactMethods.find((method) => method.key === 'email')

/**
 * Home hero — identity row, the single brand headline, supporting copy and two actions:
 * the flagship case stays primary, the second action is the direct e-mail channel rendered
 * by the shared inline contact token (BL-003, plan decision 6).
 */
export default async function Hero() {
	const t = await getTranslations('home.hero')
	const contactT = await getTranslations('contact.methods')

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
					{emailMethod ? (
						<ContactLink
							method={{ ...emailMethod, label: contactT('email.label') }}
							variant="inline"
						/>
					) : null}
				</div>
			</Container>
		</section>
	)
}
