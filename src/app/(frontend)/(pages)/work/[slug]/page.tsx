import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { CaseStudyLayout } from '@/components/work/CaseStudyLayout'
import { caseStudies, getCaseStudy } from '@/content/work'

interface CaseStudyPageProps {
	params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
	return caseStudies.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
	const { slug } = await params
	const caseStudy = getCaseStudy(slug)

	if (!caseStudy) {
		return { title: 'Case study not found' }
	}

	const canonical = `/work/${caseStudy.slug}`

	return {
		title: caseStudy.title,
		description: caseStudy.description,
		alternates: { canonical },
		openGraph: {
			title: caseStudy.title,
			description: caseStudy.description,
			url: canonical,
			type: 'article',
		},
	}
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
	const { slug } = await params
	const caseStudy = getCaseStudy(slug)

	if (!caseStudy) {
		notFound()
	}

	const currentIndex = caseStudies.findIndex((item) => item.slug === caseStudy.slug)
	const nextCase = caseStudies[(currentIndex + 1) % caseStudies.length]

	return <CaseStudyLayout caseStudy={caseStudy} nextCase={nextCase} />
}
