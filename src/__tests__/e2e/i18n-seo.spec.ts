import { expect, type Page, test } from '@playwright/test'

interface SeoExpectation {
	canonicalPath: string
	englishPath: string
	czechPath: string
	description?: string
	openGraphLocale: 'cs_CZ' | 'en_US'
	openGraphType?: 'article' | 'website'
	title?: string
}

async function expectLocalizedSeo(page: Page, expectation: SeoExpectation) {
	const configuredOrigin = new URL(process.env.NEXT_PUBLIC_SERVER_URL ?? 'https://codeguy.cz')
		.origin
	const absoluteUrl = (path: string) => new URL(path, `${configuredOrigin}/`).href
	const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
	const englishAlternate = await page
		.locator('link[rel="alternate"][hreflang="en"]')
		.getAttribute('href')
	const czechAlternate = await page
		.locator('link[rel="alternate"][hreflang="cs"]')
		.getAttribute('href')
	const defaultAlternate = await page
		.locator('link[rel="alternate"][hreflang="x-default"]')
		.getAttribute('href')

	expect(canonical).toBe(absoluteUrl(expectation.canonicalPath))
	expect(englishAlternate).toBe(absoluteUrl(expectation.englishPath))
	expect(czechAlternate).toBe(absoluteUrl(expectation.czechPath))
	expect(defaultAlternate).toBe(absoluteUrl(expectation.englishPath))
	if (expectation.title) await expect(page).toHaveTitle(expectation.title)
	if (expectation.description) {
		await expect(page.locator('meta[name="description"]')).toHaveAttribute(
			'content',
			expectation.description,
		)
	}
	await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
		'content',
		expectation.openGraphLocale,
	)
	if (expectation.openGraphType) {
		await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
			'content',
			expectation.openGraphType,
		)
	}
	const openGraphUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
	expect(openGraphUrl).toBe(absoluteUrl(expectation.canonicalPath))
}

async function expectIndexable(page: Page) {
	const directives = await page
		.locator('meta[name="robots"], meta[name="googlebot"]')
		.evaluateAll((elements) => elements.map((element) => element.getAttribute('content') || ''))

	expect(directives.length).toBeGreaterThan(0)
	for (const directive of directives) {
		expect(directive).not.toMatch(/(?:noindex|nofollow)/i)
	}
}

test.describe('localized search metadata', () => {
	test('English Home publishes exact indexable localized metadata', async ({ page }) => {
		await page.goto('/')

		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		await expectLocalizedSeo(page, {
			canonicalPath: '/',
			description:
				'Karel Kutchan is a senior frontend engineer based in Prague, building resilient frontend systems with React, TypeScript and Next.js.',
			englishPath: '/',
			czechPath: '/cs',
			openGraphLocale: 'en_US',
			openGraphType: 'website',
			title: 'Karel Kutchan — Senior Frontend Engineer | Codeguy',
		})
		await expectIndexable(page)
	})

	test('Czech Home publishes exact indexable localized metadata', async ({ page }) => {
		await page.goto('/cs')

		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expectLocalizedSeo(page, {
			canonicalPath: '/cs',
			description:
				'Karel Kutchan je senior frontend vývojář z Prahy. V Reactu, TypeScriptu a Next.js staví odolné frontendové systémy.',
			englishPath: '/',
			czechPath: '/cs',
			openGraphLocale: 'cs_CZ',
			openGraphType: 'website',
			title: 'Karel Kutchan — Senior frontend vývojář | Codeguy',
		})
		await expectIndexable(page)
	})

	test('English pages are canonical on unprefixed URLs', async ({ page }) => {
		await page.goto('/work/energy-customer-portal')

		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		await expectLocalizedSeo(page, {
			canonicalPath: '/work/energy-customer-portal',
			englishPath: '/work/energy-customer-portal',
			czechPath: '/cs/work/energy-customer-portal',
			openGraphLocale: 'en_US',
		})
	})

	test('Czech pages are canonical on /cs and point x-default to English', async ({ page }) => {
		await page.goto('/cs/work/energy-customer-portal')

		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expectLocalizedSeo(page, {
			canonicalPath: '/cs/work/energy-customer-portal',
			englishPath: '/work/energy-customer-portal',
			czechPath: '/cs/work/energy-customer-portal',
			openGraphLocale: 'cs_CZ',
		})
	})
})
