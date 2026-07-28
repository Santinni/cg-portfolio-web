import ExperienceSnapshot from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/experience-snapshot'
import FinalCta from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/final-cta'
import FlagshipCase from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/flagship-case'
import Hero from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/hero'
import Principles from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/principles'
import SelectedWork from '@/app/[locale]/(frontend)/(pages)/(home)/blocks/selected-work'
import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { createLocalizedMetadata } from '@/i18n/metadata'

interface HomePageProps {
	params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
	const { locale } = await params
	const t = await getTranslations({ locale, namespace: 'home.metadata' })

	return createLocalizedMetadata({
		locale,
		pathname: '/',
		title: t('title'),
		description: t('description'),
	})
}

/**
 * Home — the public landing page. Renders entirely from typed local content
 * so it stays available independent of Payload/PostgreSQL.
 */
export default async function HomePage({ params }: HomePageProps) {
	const { locale } = await params
	setRequestLocale(locale)

	return (
		<>
			<Hero />
			<FlagshipCase />
			<SelectedWork />
			<Principles />
			<ExperienceSnapshot />
			<FinalCta />
		</>
	)
}
