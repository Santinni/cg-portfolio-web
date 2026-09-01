import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Container } from '@/app/(frontend)/components/layout/Container'
import { Button } from '@/app/(frontend)/components/primitives/button'
import { DownloadAction } from '@/app/(frontend)/components/primitives/downloadAction'
import { BookingCta } from '@/components/booking/BookingCta'
import { Eyebrow } from '@/components/site/Eyebrow'
import { PageIntro } from '@/components/site/PageIntro'
import { Section } from '@/components/site/Section'
import { Timeline } from '@/components/site/Timeline'
import { curriculumVitae, type CurriculumVitaeLocale } from '@/content/curriculum-vitae'
import { experienceEntryKeys } from '@/content/experience'
import { createLocalizedMetadata } from '@/i18n/metadata'

import styles from './page.module.css'

interface ExperiencePageProps {
	params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'experience.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/experience',
		title: t('title'),
		description: t('description'),
	})
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
	const { locale } = await params
	setRequestLocale(locale)
	const t = await getTranslations('experience')
	const downloadT = await getTranslations('curriculumVitae.download')
	const pdf = curriculumVitae.pdfByLocale[locale as CurriculumVitaeLocale]
	const downloadFilename = pdf.href.split('/').at(-1)
	const entries = experienceEntryKeys.map((key) => ({
		key,
		role: t(`progression.entries.${key}.role`),
		description: t(`progression.entries.${key}.description`),
	}))

	return (
		<>
			<PageIntro eyebrow={t('hero.eyebrow')} title={t('hero.title')} intro={t('hero.intro')} />

			<Section aria-labelledby="experience-timeline-heading" tone="raised">
				<Container className={styles.timelineLayout}>
					<div className={styles.sectionHeading}>
						<Eyebrow>{t('progression.eyebrow')}</Eyebrow>
						<h2 id="experience-timeline-heading" className={styles.heading}>
							{t('progression.title')}
						</h2>
					</div>
					<Timeline entries={entries} />
				</Container>
			</Section>

			<Section aria-labelledby="capabilities-heading" tone="page">
				<Container className={styles.capabilities}>
					<div className={styles.sectionHeading}>
						<Eyebrow>{t('capabilities.eyebrow')}</Eyebrow>
						<h2 id="capabilities-heading" className={styles.heading}>
							{t('capabilities.title')}
						</h2>
					</div>
					<p className={styles.capabilityList}>{t('capabilities.list')}</p>
					<div className={styles.actions}>
						<Button renders="link" href="/curriculum-vitae" size="large" variant="secondary">
							{t('capabilities.viewCv')}
							<ArrowRight className={styles.icon} aria-hidden="true" />
						</Button>
						<DownloadAction
							href={pdf.href}
							label={downloadT('label')}
							accessibilityLabel={downloadT('accessibilityLabel')}
							downloadFilename={downloadFilename}
							mode="expanded"
						/>
					</div>
				</Container>
			</Section>

			<BookingCta source="experience" />
		</>
	)
}
