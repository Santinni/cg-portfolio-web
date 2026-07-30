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
	const configuredOrigin = new URL(
		process.env.NEXT_PUBLIC_SERVER_URL ?? process.env.PLAYWRIGHT_BASE_URL ?? page.url(),
	).origin
	const absoluteUrl = (path: string) => {
		const url = new URL(path, `${configuredOrigin}/`)
		return path === '/' ? url.origin : url.href
	}
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

	test.describe('Curriculum Vitae and booking metadata', () => {
		// Next's development server can transiently return 500 when both localized
		// CV metadata routes compile concurrently. CI already runs one worker.
		test.describe.configure({ mode: 'serial' })

		const cvAndBookingMetadata = [
			{
				id: 'English Curriculum Vitae',
				path: '/curriculum-vitae',
				canonicalPath: '/curriculum-vitae',
				englishPath: '/curriculum-vitae',
				czechPath: '/cs/curriculum-vitae',
				lang: 'en',
				description:
					'Karel Kutchan — Senior Frontend Engineer with more than ten years in web development.',
				openGraphLocale: 'en_US',
				title: 'Curriculum Vitae | Codeguy',
			},
			{
				id: 'Czech Curriculum Vitae',
				path: '/cs/curriculum-vitae',
				canonicalPath: '/cs/curriculum-vitae',
				englishPath: '/curriculum-vitae',
				czechPath: '/cs/curriculum-vitae',
				lang: 'cs',
				description:
					'Karel Kutchan — Senior frontend engineer s více než deseti lety zkušeností ve webovém vývoji.',
				openGraphLocale: 'cs_CZ',
				title: 'Životopis | Codeguy',
			},
			{
				id: 'English booking',
				path: '/contact/book',
				canonicalPath: '/contact/book',
				englishPath: '/contact/book',
				czechPath: '/cs/contact/book',
				lang: 'en',
				description:
					'Book a focused introductory conversation with Karel Kutchan about a role, team, project or another reason to connect.',
				openGraphLocale: 'en_US',
				title: 'Book an introductory conversation | Codeguy',
			},
			{
				id: 'Czech booking',
				path: '/cs/contact/book',
				canonicalPath: '/cs/contact/book',
				englishPath: '/contact/book',
				czechPath: '/cs/contact/book',
				lang: 'cs',
				description:
					'Domluvte si s Karlem Kutchanem věcný úvodní rozhovor o roli, týmu, projektu nebo jiném tématu, které chcete probrat.',
				openGraphLocale: 'cs_CZ',
				title: 'Domluvit úvodní rozhovor | Codeguy',
			},
		] as const

		for (const metadata of cvAndBookingMetadata) {
			test(`${metadata.id} publishes exact indexable localized metadata`, async ({ page }) => {
				const response = await page.goto(metadata.path)

				expect(response?.status()).toBe(200)
				await expect(page.locator('html')).toHaveAttribute('lang', metadata.lang)
				await expectLocalizedSeo(page, {
					canonicalPath: metadata.canonicalPath,
					description: metadata.description,
					englishPath: metadata.englishPath,
					czechPath: metadata.czechPath,
					openGraphLocale: metadata.openGraphLocale,
					openGraphType: 'website',
					title: metadata.title,
				})
				await expectIndexable(page)
			})
		}
	})
})
