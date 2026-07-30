import { expect, type Page, test } from '@playwright/test'

async function switchLocaleAndExpectLocation(
	page: Page,
	buttonName: string,
	expected: { hash: string; pathname: string; search: string },
) {
	await Promise.all([
		page.waitForURL((url) => {
			return (
				url.hash === expected.hash &&
				url.pathname === expected.pathname &&
				url.search === expected.search
			)
		}),
		page.getByRole('button', { name: buttonName }).click(),
	])
	await page.waitForLoadState('load')
}

test.describe('language switcher', () => {
	const localizedRouteCases = [
		{
			id: 'Work',
			englishPath: '/work',
			czechPath: '/cs/work',
			query: '?topic=performance',
			hash: '#case-studies',
		},
		{
			id: 'Curriculum Vitae',
			englishPath: '/curriculum-vitae',
			czechPath: '/cs/curriculum-vitae',
			query: '?source=language-switcher',
			hash: '#cv-experience',
		},
		{
			id: 'booking',
			englishPath: '/contact/book',
			czechPath: '/cs/contact/book',
			query: '?source=language-switcher',
			hash: '#booking-offer-heading',
		},
	] as const

	for (const route of localizedRouteCases) {
		test(`${route.id} preserves its route, query and hash in both directions`, async ({ page }) => {
			const scriptRenderErrors: string[] = []
			page.on('console', (message) => {
				if (
					message.type() === 'error' &&
					message.text().includes('Encountered a script tag while rendering React component')
				) {
					scriptRenderErrors.push(message.text())
				}
			})

			await page.setViewportSize({ width: 1440, height: 900 })
			await page.goto(`${route.englishPath}${route.query}${route.hash}`)
			await expect(page.locator('html')).toHaveAttribute('data-scroll-behavior', 'smooth')

			await switchLocaleAndExpectLocation(page, 'Switch to Czech', {
				hash: route.hash,
				pathname: route.czechPath,
				search: route.query,
			})
			await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
			await expect(
				page.getByRole('navigation').getByRole('link', { name: 'Projekty' }),
			).toBeVisible()

			await switchLocaleAndExpectLocation(page, 'Přepnout do jazyka: Angličtina', {
				hash: route.hash,
				pathname: route.englishPath,
				search: route.query,
			})
			await expect(page.locator('html')).toHaveAttribute('lang', 'en')
			await expect(page.getByRole('navigation').getByRole('link', { name: 'Work' })).toBeVisible()
			if (route.id === 'Work') expect(scriptRenderErrors).toEqual([])
		})
	}

	test('marks the active locale for assistive technology', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/cs/about')

		const languageGroup = page.getByRole('group', { name: 'Vyberte jazyk' })
		await expect(
			languageGroup.getByRole('button', { name: 'Přepnout do jazyka: Čeština' }),
		).toHaveAttribute('aria-pressed', 'true')
		await expect(
			languageGroup.getByRole('button', { name: 'Přepnout do jazyka: Angličtina' }),
		).toHaveAttribute('aria-pressed', 'false')
	})

	test('localized portfolio routes do not overflow a mobile viewport', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 })
		const localizedRoutes = [
			'/',
			'/cs',
			'/work',
			'/cs/work',
			'/experience',
			'/cs/experience',
			'/about',
			'/cs/about',
			'/contact',
			'/cs/contact',
			'/curriculum-vitae',
			'/cs/curriculum-vitae',
		]

		for (const route of localizedRoutes) {
			await page.goto(route)
			const dimensions = await page.evaluate(() => ({
				clientWidth: document.documentElement.clientWidth,
				scrollWidth: document.documentElement.scrollWidth,
			}))

			expect(dimensions.scrollWidth, `${route} overflows at 390px`).toBeLessThanOrEqual(
				dimensions.clientWidth,
			)
		}
	})
})
