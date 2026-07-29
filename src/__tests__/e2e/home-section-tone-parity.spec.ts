import { expect, test } from '@playwright/test'

const locales = ['/', '/cs'] as const

const themes = [
	{
		name: 'light',
		pageColor: 'rgb(255, 255, 255)',
		subtleColor: 'rgb(241, 244, 248)',
	},
	{
		name: 'dark',
		pageColor: 'rgb(8, 9, 12)',
		subtleColor: 'rgb(12, 45, 56)',
	},
] as const

const viewports = [
	{ finalTone: 'subtle', height: 900, width: 1440 },
	{ finalTone: 'page', height: 1024, width: 768 },
	{ finalTone: 'page', height: 844, width: 390 },
] as const

for (const path of locales) {
	for (const theme of themes) {
		test.describe(`${theme.name} Home section tones at ${path}`, () => {
			for (const viewport of viewports) {
				test(`matches approved surfaces at ${viewport.width}px`, async ({ page }) => {
					await page.setViewportSize(viewport)
					await page.addInitScript((themeName) => {
						localStorage.setItem('codeguy-theme', themeName)
					}, theme.name)

					const response = await page.goto(path)
					expect(response?.status()).toBe(200)
					await expect(page.locator('html')).toHaveAttribute('data-theme', theme.name)

					const colors = await page.evaluate(() => {
						const flagship = document.querySelector('#flagship-case')
						const finalCta = document.querySelector('#contact-cta')

						if (!(flagship instanceof HTMLElement) || !(finalCta instanceof HTMLElement)) {
							throw new Error('Expected the Flagship and Final CTA sections')
						}

						return {
							finalCta: getComputedStyle(finalCta).backgroundColor,
							flagship: getComputedStyle(flagship).backgroundColor,
						}
					})

					expect(colors.flagship).toBe(theme.subtleColor)
					expect(colors.finalCta).toBe(
						viewport.finalTone === 'subtle' ? theme.subtleColor : theme.pageColor,
					)
				})
			}
		})
	}
}
