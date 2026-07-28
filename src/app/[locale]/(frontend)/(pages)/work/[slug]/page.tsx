import type { Metadata } from 'next'
import type { Locale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { CaseStudyLayout } from '@/components/work/CaseStudyLayout'
import { caseStudies, getCaseStudy } from '@/content/work'
import { createLocalizedMetadata } from '@/i18n/metadata'

interface CaseStudyPageProps {
	params: Promise<{ locale: Locale; slug: string }>
}

// Unknown slugs must fall through to the full-document global 404.
export const dynamicParams = false

export function generateStaticParams() {
	return caseStudies.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
	const { locale, slug } = await params
	const caseStudy = getCaseStudy(slug)
	const t = await getTranslations({ locale, namespace: 'work' })

	if (!caseStudy) {
		return { title: t('metadata.notFoundTitle') }
	}

	const title = t(`cases.${caseStudy.key}.title`)
	const description = t(`cases.${caseStudy.key}.description`)

	return createLocalizedMetadata({
		locale,
		pathname: `/work/${caseStudy.slug}`,
		title,
		description,
		openGraphType: 'article',
	})
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
	const { locale, slug } = await params
	setRequestLocale(locale)
	const caseStudy = getCaseStudy(slug)

	if (!caseStudy) notFound()

	const currentIndex = caseStudies.findIndex((item) => item.slug === caseStudy.slug)
	const nextCase = caseStudies[(currentIndex + 1) % caseStudies.length]

	return <CaseStudyLayout caseStudy={caseStudy} nextCase={nextCase} />
}
