import type { MetadataRoute } from 'next'

/**
 * Generates the sitemap for search engine crawlers.
 * Currently includes static pages only.
 *
 * @returns Array of sitemap entries with URL, last modified date, and priority.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz'

	return [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
		},
		{
			url: `${baseUrl}/curriculum-vitae`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
	]
}
