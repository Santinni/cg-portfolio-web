import { DownloadCloud } from 'lucide-react'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import downloadStyles from '@/app/(frontend)/components/primitives/expandingButton/ExpandingButton.module.css'
import { createLocalizedMetadata } from '@/i18n/metadata'
import { routing } from '@/i18n/routing'

import styles from './page.module.css'
import { Contact } from './sections/contact'
import { Education } from './sections/education'
import { Experience } from './sections/experience'
import { TechnologicalStack } from './sections/tech-stack'
import { WhoAmI } from './sections/who-am-i'

interface CurriculumPageProps {
	params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: CurriculumPageProps): Promise<Metadata> {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()

	const t = await getTranslations({ locale, namespace: 'curriculumVitae.metadata' })
	return createLocalizedMetadata({
		locale,
		pathname: '/curriculum-vitae',
		title: t('title'),
		description: t('description'),
	})
}

/**
 * Curriculum Vitae page — static page rendering all CV sections
 * (contact, bio, tech stack, experience, education) with a
 * floating PDF download button.
 */
export default async function CurriculumPage({ params }: CurriculumPageProps) {
	const { locale } = await params
	if (!hasLocale(routing.locales, locale)) notFound()

	setRequestLocale(locale)
	const t = await getTranslations('curriculumVitae')

	return (
		<>
			<section className={styles.section}>
				<div className={styles.container}>
					<div className={styles.header}>
						<h1 className={styles.headline}>{t('header.headline')}</h1>
						<h2 className={styles.name}>Karel Kutchan</h2>
						<p className={styles.profession}>{t('header.profession')}</p>
						<Contact />
					</div>
					<WhoAmI />
					<TechnologicalStack />
					<Experience />
					<Education />
				</div>
			</section>

			<div className={downloadStyles.floatingButtonWrapper}>
				<a
					className={downloadStyles.expandingButton}
					href="/curriculum-vitae/CV_Karel_Kutchan.pdf"
					download
				>
					<DownloadCloud className={downloadStyles.expandingButtonIcon} aria-hidden="true" />
					<span className={downloadStyles.expandingButtonText}>{t('downloadPdf')}</span>
				</a>
			</div>
		</>
	)
}
