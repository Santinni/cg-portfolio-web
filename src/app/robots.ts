import type { MetadataRoute } from 'next'

/** Generates the `robots.txt` rules — allows all crawlers except admin/API routes. */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/',
			disallow: ['/api/', '/admin/'],
		},
		sitemap: `${process.env.NEXT_PUBLIC_SERVER_URL || 'https://codeguy.cz'}/sitemap.xml`,
	}
}
