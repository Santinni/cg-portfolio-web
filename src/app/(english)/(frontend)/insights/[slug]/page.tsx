import type { Metadata } from 'next'

import LocalizedInsightArticlePage, {
	generateMetadata as generateLocalizedMetadata,
} from '@/app/[locale]/(frontend)/(pages)/insights/[slug]/page'

interface EnglishInsightArticlePageProps {
	params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
	params,
}: EnglishInsightArticlePageProps): Promise<Metadata> {
	const { slug } = await params
	return generateLocalizedMetadata({ params: Promise.resolve({ locale: 'en', slug }) })
}

export default async function EnglishInsightArticlePage({
	params,
}: EnglishInsightArticlePageProps) {
	const { slug } = await params
	return LocalizedInsightArticlePage({ params: Promise.resolve({ locale: 'en', slug }) })
}
