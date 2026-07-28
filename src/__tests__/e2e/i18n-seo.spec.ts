import { expect, type Page, test } from '@playwright/test'

interface SeoExpectation {
	canonicalPath: string
	englishPath: string
	czechPath: string
	openGraphLocale: 'cs_CZ' | 'en_US'
}

async function expectLocalizedSeo(page: Page, expectation: SeoExpectation) {
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

	expect(new URL(canonical || '', page.url()).pathname).toBe(expectation.canonicalPath)
	expect(new URL(englishAlternate || '', page.url()).pathname).toBe(expectation.englishPath)
	expect(new URL(czechAlternate || '', page.url()).pathname).toBe(expectation.czechPath)
	expect(new URL(defaultAlternate || '', page.url()).pathname).toBe(expectation.englishPath)
	await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
		'content',
		expectation.openGraphLocale,
	)
	const openGraphUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
	expect(new URL(openGraphUrl || '', page.url()).pathname).toBe(expectation.canonicalPath)
}

test.describe('localized search metadata', () => {
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
