import { expect, test } from '@playwright/test'

test.describe('language switcher', () => {
	test('preserves the current route, query and hash in both directions', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/work?topic=performance#case-studies')

		await page.getByRole('button', { name: 'Switch to Czech' }).click()
		await expect(page).toHaveURL(/\/cs\/work\?topic=performance#case-studies$/)
		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expect(page.getByRole('navigation').getByRole('link', { name: 'Projekty' })).toBeVisible()

		await page.getByRole('button', { name: 'Přepnout do jazyka: Angličtina' }).click()
		await expect(page).toHaveURL(/\/work\?topic=performance#case-studies$/)
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		await expect(page.getByRole('navigation').getByRole('link', { name: 'Work' })).toBeVisible()
	})

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
