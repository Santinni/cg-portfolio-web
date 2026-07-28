import type { MetadataRoute } from 'next'

import { caseStudies } from '@/content/work'
import { listPublishedPosts } from '@/lib/content/posts.server'

export const dynamic = 'force-dynamic'

type SitemapEntry = MetadataRoute.Sitemap[number]

interface PortfolioRoute {
	path: string
	changeFrequency: NonNullable<SitemapEntry['changeFrequency']>
	priority: number
}

function getLocalizedPortfolioEntries(
	baseUrl: string,
	now: Date,
	{ path, changeFrequency, priority }: PortfolioRoute,
): MetadataRoute.Sitemap {
	const englishUrl = `${baseUrl}${path}`
	const czechUrl = `${baseUrl}${path ? `/cs${path}` : '/cs'}`
	const languages = {
		en: englishUrl,
		cs: czechUrl,
		'x-default': englishUrl,
	}

	return [englishUrl, czechUrl].map((url) => ({
		url,
		lastModified: now,
		changeFrequency,
		priority,
		alternates: { languages },
	}))
}

/**
 * Generates the sitemap for search engine crawlers.
 * Includes every launch route that is guaranteed to exist without CMS data.
 *
 * @returns Array of sitemap entries with URL, last modified date, and priority.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz').replace(/\/$/, '')
	const now = new Date()
	let insightEntries: MetadataRoute.Sitemap = []

	try {
		const result = await listPublishedPosts({ limit: 100 })
		insightEntries = result.docs.map((post) => ({
			url: `${baseUrl}/insights/${post.slug}`,
			lastModified: new Date(post.updatedAt),
			changeFrequency: 'monthly' as const,
			priority: 0.6,
		}))
	} catch {
		// Static portfolio URLs remain discoverable while the editorial service is unavailable.
	}
	const staticRoutes: PortfolioRoute[] = [
		{ path: '', changeFrequency: 'weekly' as const, priority: 1 },
		{ path: '/work', changeFrequency: 'monthly' as const, priority: 0.9 },
		{ path: '/experience', changeFrequency: 'monthly' as const, priority: 0.8 },
		{ path: '/about', changeFrequency: 'monthly' as const, priority: 0.8 },
		{ path: '/contact', changeFrequency: 'monthly' as const, priority: 0.8 },
		{ path: '/insights', changeFrequency: 'weekly' as const, priority: 0.8 },
		{ path: '/curriculum-vitae', changeFrequency: 'monthly' as const, priority: 0.7 },
	]
	const caseStudyRoutes: PortfolioRoute[] = caseStudies.map((caseStudy) => ({
		path: `/work/${caseStudy.slug}`,
		changeFrequency: 'monthly',
		priority: 0.7,
	}))

	return [
		...staticRoutes.flatMap((route) => getLocalizedPortfolioEntries(baseUrl, now, route)),
		...caseStudyRoutes.flatMap((route) => getLocalizedPortfolioEntries(baseUrl, now, route)),
		...insightEntries,
	]
}
