import { expect, test } from '@playwright/test'

const locales = ['/', '/cs'] as const

const viewports = [
	{
		eyebrowWidth: 600,
		headlineWidth: 1000,
		height: 900,
		paragraphWidth: 780,
		width: 1440,
		x: 120,
	},
	{
		eyebrowWidth: null,
		headlineWidth: null,
		height: 1024,
		paragraphWidth: null,
		width: 768,
		x: 48,
	},
	{
		eyebrowWidth: null,
		headlineWidth: null,
		height: 844,
		paragraphWidth: null,
		width: 390,
		x: 20,
	},
] as const

for (const path of locales) {
	test.describe(`Home Hero anchoring at ${path}`, () => {
		for (const viewport of viewports) {
			test(`uses approved content widths at ${viewport.width}px`, async ({ page }) => {
				await page.setViewportSize(viewport)
				const response = await page.goto(path)
				expect(response?.status()).toBe(200)

				const hero = page.locator('section[aria-labelledby="hero-heading"]')
				await expect(hero).toBeVisible()

				const layout = await hero.evaluate((element) => {
					const inner = element.firstElementChild
					const eyebrow = inner?.querySelector(':scope > p:first-child')
					const headline = inner?.querySelector('#hero-heading')
					const paragraphs = inner?.querySelectorAll(':scope > p:not(:first-child)')
					const actions = inner?.querySelector(':scope > div')

					if (
						!(inner instanceof HTMLElement) ||
						!(eyebrow instanceof HTMLElement) ||
						!(headline instanceof HTMLElement) ||
						!paragraphs ||
						paragraphs.length !== 2 ||
						!(actions instanceof HTMLElement)
					) {
						throw new Error('Expected the complete Hero content structure')
					}

					return {
						actions: actions.getBoundingClientRect().toJSON(),
						documentClientWidth: document.documentElement.clientWidth,
						documentScrollWidth: document.documentElement.scrollWidth,
						eyebrow: eyebrow.getBoundingClientRect().toJSON(),
						hero: element.getBoundingClientRect().toJSON(),
						headline: headline.getBoundingClientRect().toJSON(),
						inner: inner.getBoundingClientRect().toJSON(),
						paragraphs: Array.from(paragraphs, (paragraph) =>
							paragraph.getBoundingClientRect().toJSON(),
						),
					}
				})

				const fluidContentWidth = layout.hero.width - 2 * viewport.x

				expect(layout.inner.x).toBeCloseTo(viewport.x, 5)
				expect(layout.inner.width).toBeCloseTo(fluidContentWidth, 5)
				expect(layout.eyebrow.x).toBeCloseTo(viewport.x, 5)
				expect(layout.eyebrow.width).toBeCloseTo(viewport.eyebrowWidth ?? fluidContentWidth, 5)
				expect(layout.headline.x).toBeCloseTo(viewport.x, 5)
				expect(layout.headline.width).toBeCloseTo(viewport.headlineWidth ?? fluidContentWidth, 5)
				expect(layout.actions.x).toBeCloseTo(viewport.x, 5)

				for (const paragraph of layout.paragraphs) {
					expect(paragraph.x).toBeCloseTo(viewport.x, 5)
					expect(paragraph.width).toBeCloseTo(viewport.paragraphWidth ?? fluidContentWidth, 5)
				}

				expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)
			})
		}
	})
}
