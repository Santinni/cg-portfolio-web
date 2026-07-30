import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'
import { createLocalizedMetadata } from '@/i18n/metadata'

import styles from './page.module.css'

interface AboutPageProps {
	params: Promise<{ locale: Locale }>
}

const valueKeys = ['ownership', 'clarity', 'craft'] as const

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'about.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/about',
		title: t('title'),
		description: t('description'),
	})
}

export default async function AboutPage({ params }: AboutPageProps) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('about')

	return (
		<>
			<PageIntro eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

			<Section aria-labelledby="working-style-heading" tone="raised">
				<Container className={styles.workingStyle}>
					<div className={styles.sectionHeading}>
						<Eyebrow>{t('workingStyle.eyebrow')}</Eyebrow>
						<h2 id="working-style-heading" className={styles.heading}>
							{t('workingStyle.title')}
						</h2>
					</div>
					<p className={styles.bodyCopy}>{t('workingStyle.body')}</p>
				</Container>
			</Section>

			<Section aria-labelledby="values-heading" tone="page">
				<Container>
					<div className={styles.sectionHeading}>
						<Eyebrow>{t('values.eyebrow')}</Eyebrow>
						<h2 id="values-heading" className={styles.heading}>
							{t('values.title')}
						</h2>
					</div>
					<ul className={styles.values}>
						{valueKeys.map((key) => (
							<li className={styles.value} key={key}>
								<h3>{t(`values.${key}.title`)}</h3>
								<p>{t(`values.${key}.description`)}</p>
							</li>
						))}
					</ul>
				</Container>
			</Section>

			<Section aria-labelledby="about-cta-heading" tone="contrast">
				<Container className={styles.cta}>
					<h2 id="about-cta-heading" className={styles.ctaHeading}>
						{t('cta.title')}
					</h2>
					<Button renders="link" href="/work" variant="primary">
						{t('cta.label')}
						<ArrowRight className={styles.icon} aria-hidden="true" />
					</Button>
				</Container>
			</Section>
		</>
	)
}
