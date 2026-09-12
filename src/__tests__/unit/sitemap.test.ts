import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { caseStudies } from '@/content/work'

const { listPublishedPosts } = vi.hoisted(() => ({
	listPublishedPosts: vi.fn(),
}))

vi.mock('@/lib/content/posts.server', () => ({
	listPublishedPosts,
}))

const baseUrl = 'https://portfolio.example'
const staticPaths = [
	'',
	'/work',
	'/experience',
	'/about',
	'/contact',
	'/contact/book',
	'/insights',
	'/curriculum-vitae',
]

describe('localized sitemap', () => {
	beforeEach(() => {
		vi.resetModules()
		vi.stubEnv('NEXT_PUBLIC_SERVER_URL', `${baseUrl}/`)
		listPublishedPosts.mockReset()
		listPublishedPosts.mockResolvedValue({
			docs: [
				{
					slug: 'shipping-resilient-interfaces',
					updatedAt: '2026-07-20T12:00:00.000Z',
				},
			],
		})
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	it('publishes English and Czech portfolio URLs with en, cs and x-default alternates', async () => {
		const { default: sitemap } = await import('@/app/sitemap')
		const entries = await sitemap()
		const portfolioPaths = [
			...staticPaths,
			...caseStudies.map((caseStudy) => `/work/${caseStudy.slug}`),
		]

		for (const path of portfolioPaths) {
			const englishUrl = `${baseUrl}${path}`
			const czechUrl = `${baseUrl}${path ? `/cs${path}` : '/cs'}`
			const expectedAlternates = {
				languages: {
					en: englishUrl,
					cs: czechUrl,
					'x-default': englishUrl,
				},
			}

			expect(entries.find((entry) => entry.url === englishUrl)?.alternates).toEqual(
				expectedAlternates,
			)
			expect(entries.find((entry) => entry.url === czechUrl)?.alternates).toEqual(
				expectedAlternates,
			)
		}
	})

	it('keeps CMS-authored insight articles English-only', async () => {
		const { default: sitemap } = await import('@/app/sitemap')
		const entries = await sitemap()
		const articleUrl = `${baseUrl}/insights/shipping-resilient-interfaces`
		const articleEntry = entries.find((entry) => entry.url === articleUrl)

		expect(articleEntry).toMatchObject({
			url: articleUrl,
			lastModified: new Date('2026-07-20T12:00:00.000Z'),
			changeFrequency: 'monthly',
			priority: 0.6,
		})
		expect(articleEntry?.alternates).toBeUndefined()
		expect(
			entries.some((entry) => entry.url.includes('/cs/insights/shipping-resilient-interfaces')),
		).toBe(false)
	})

	it('contains only known portfolio and mocked CMS URLs', async () => {
		const { default: sitemap } = await import('@/app/sitemap')
		const entries = await sitemap()
		const knownPaths = new Set([
			'/',
			...staticPaths,
			...caseStudies.map((caseStudy) => `/work/${caseStudy.slug}`),
			...staticPaths.map((path) => (path ? `/cs${path}` : '/cs')),
			...caseStudies.map((caseStudy) => `/cs/work/${caseStudy.slug}`),
			'/insights/shipping-resilient-interfaces',
		])
		const entryPaths = new Set(entries.map((entry) => new URL(entry.url).pathname))

		expect(entryPaths).not.toEqual(
			expect.arrayContaining([
				'/not-a-real-page',
				'/cs/not-a-real-page',
				'/xx/work',
				'/work/not-a-real-case',
				'/insights/not-a-real-article',
			]),
		)
		for (const path of entryPaths) expect(knownPaths).toContain(path)
	})

	it('still publishes localized portfolio routes when the CMS is unavailable', async () => {
		listPublishedPosts.mockRejectedValueOnce(new Error('CMS unavailable'))
		const { default: sitemap } = await import('@/app/sitemap')
		const entries = await sitemap()

		expect(entries).toHaveLength((staticPaths.length + caseStudies.length) * 2)
		expect(entries.find((entry) => entry.url === baseUrl)?.alternates?.languages).toEqual({
			en: baseUrl,
			cs: `${baseUrl}/cs`,
			'x-default': baseUrl,
		})
	})
})
