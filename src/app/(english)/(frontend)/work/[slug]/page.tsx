import type { Metadata } from 'next'

import LocalizedCaseStudyPage, {
	generateMetadata as generateLocalizedMetadata,
	generateStaticParams,
} from '@/app/[locale]/(frontend)/(pages)/work/[slug]/page'

interface EnglishCaseStudyPageProps {
	params: Promise<{ slug: string }>
}

// Let unknown slugs reach the localized page's `notFound()` boundary.
export const dynamicParams = false
export { generateStaticParams }

export async function generateMetadata({ params }: EnglishCaseStudyPageProps): Promise<Metadata> {
	const { slug } = await params
	return generateLocalizedMetadata({ params: Promise.resolve({ locale: 'en', slug }) })
}

export default async function EnglishCaseStudyPage({ params }: EnglishCaseStudyPageProps) {
	const { slug } = await params
	return LocalizedCaseStudyPage({ params: Promise.resolve({ locale: 'en', slug }) })
}
