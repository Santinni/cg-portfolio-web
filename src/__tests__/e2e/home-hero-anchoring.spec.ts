import { expect, test } from '@playwright/test'

import {
	expectPx,
	HOME_PARITY_VIEWPORTS,
	HOME_SELECTORS,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

const locales = ['/', '/cs'] as const

const viewports = [
	{
		eyebrowWidth: 600,
		headlineWidth: 1000,
		height: HOME_PARITY_VIEWPORTS.desktop.height,
		paragraphWidth: 780,
		width: HOME_PARITY_VIEWPORTS.desktop.width,
		x: 120,
	},
	{
		eyebrowWidth: null,
		headlineWidth: null,
		height: HOME_PARITY_VIEWPORTS.tablet.height,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.tablet.width,
		x: 48,
	},
	{
		eyebrowWidth: null,
		headlineWidth: null,
		height: HOME_PARITY_VIEWPORTS.mobile.height,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.mobile.width,
		x: 20,
	},
] as const

for (const path of locales) {
	test.describe(`Home Hero anchoring at ${path}`, () => {
		for (const viewport of viewports) {
			test(`uses approved content widths at ${viewport.width}px`, async ({ page }) => {
				await page.setViewportSize(viewport)
				await prepareHomeRender(page)
				const response = await page.goto(path)
				expect(response?.status()).toBe(200)
				await waitForHomeRender(page)

				const hero = page.locator(HOME_SELECTORS.hero)
				await expect(hero).toBeVisible()

				const layout = await hero.evaluate((element) => {
					const headline = element.querySelector('#hero-heading')
					const inner = headline?.parentElement
					const paragraphs = inner
						? Array.from(inner.children).filter(
								(child): child is HTMLParagraphElement => child instanceof HTMLParagraphElement,
							)
						: []
					const [eyebrow, ...supportingParagraphs] = paragraphs
					const actions = inner
						? Array.from(inner.children).find(
								(child) => child.querySelectorAll(':scope > a').length === 2,
							)
						: null

					if (
						!(inner instanceof HTMLElement) ||
						!(eyebrow instanceof HTMLElement) ||
						!(headline instanceof HTMLElement) ||
						supportingParagraphs.length !== 2 ||
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
						paragraphs: supportingParagraphs.map((paragraph) =>
							paragraph.getBoundingClientRect().toJSON(),
						),
					}
				})

				const fluidContentWidth = layout.hero.width - 2 * viewport.x

				expectPx(layout.inner.x, viewport.x, 5)
				expectPx(layout.inner.width, fluidContentWidth, 5)
				expectPx(layout.eyebrow.x, viewport.x, 5)
				expectPx(layout.eyebrow.width, viewport.eyebrowWidth ?? fluidContentWidth, 5)
				expectPx(layout.headline.x, viewport.x, 5)
				expectPx(layout.headline.width, viewport.headlineWidth ?? fluidContentWidth, 5)
				expectPx(layout.actions.x, viewport.x, 5)

				for (const paragraph of layout.paragraphs) {
					expectPx(paragraph.x, viewport.x, 5)
					expectPx(paragraph.width, viewport.paragraphWidth ?? fluidContentWidth, 5)
				}

				expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)
			})
		}
	})
}
