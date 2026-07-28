import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { ContactLink } from '@/components/site/ContactLink'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'
import { contactMethods } from '@/content/contact'
import { createLocalizedMetadata } from '@/i18n/metadata'

import styles from './page.module.css'

interface ContactPageProps {
	params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'contact.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/contact',
		title: t('title'),
		description: t('description'),
	})
}

export default async function ContactPage({ params }: ContactPageProps) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('contact')

	return (
		<>
			<PageIntro eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

			<Section aria-labelledby="contact-methods-heading" tone="raised">
				<Container className={styles.layout}>
					<div className={styles.sectionHeading}>
						<Eyebrow>{t('methods.eyebrow')}</Eyebrow>
						<h2 id="contact-methods-heading" className={styles.heading}>
							{t('methods.title')}
						</h2>
					</div>
					<div className={styles.methods}>
						{contactMethods.map((method) => (
							<ContactLink
								method={{
									...method,
									label: t(`methods.${method.key}.label`),
									value: method.key === 'location' ? t('methods.location.value') : method.value,
								}}
								key={method.key}
							/>
						))}
					</div>
				</Container>
			</Section>

			<Section aria-labelledby="contact-expectations-heading" tone="page">
				<Container className={styles.expectations}>
					<Eyebrow>{t('expectations.eyebrow')}</Eyebrow>
					<h2 id="contact-expectations-heading" className={styles.heading}>
						{t('expectations.title')}
					</h2>
					<p>{t('expectations.body')}</p>
				</Container>
			</Section>
		</>
	)
}
