import { expect, test } from '@playwright/test'

const viewports = [
	{ gutter: 120, headingWidth: 980, height: 900, supportingWidth: 820, width: 1440 },
	{ gutter: 48, headingWidth: null, height: 1024, supportingWidth: null, width: 768 },
	{ gutter: 20, headingWidth: null, height: 844, supportingWidth: null, width: 390 },
] as const

for (const path of ['/', '/cs'] as const) {
	test.describe(`Final CTA anchoring at ${path}`, () => {
		for (const viewport of viewports) {
			test(`uses approved content widths at ${viewport.width}px`, async ({ page }) => {
				await page.setViewportSize(viewport)
				const response = await page.goto(path)
				expect(response?.status()).toBe(200)

				const section = page.locator('#contact-cta')
				const supporting = section.locator(':scope > div > p')
				await expect(section).toBeVisible()

				const layout = await section.evaluate((element) => {
					const inner = element.firstElementChild
					const heading = inner?.querySelector('#final-cta-heading')
					const supportingCopy = inner?.querySelector(':scope > p')
					const cta = inner?.querySelector(':scope > a')

					if (
						!(inner instanceof HTMLElement) ||
						!(heading instanceof HTMLElement) ||
						!(supportingCopy instanceof HTMLElement) ||
						!(cta instanceof HTMLElement)
					) {
						throw new Error('Expected the complete Final CTA content structure')
					}

					return {
						cta: cta.getBoundingClientRect().toJSON(),
						documentClientWidth: document.documentElement.clientWidth,
						documentScrollWidth: document.documentElement.scrollWidth,
						heading: heading.getBoundingClientRect().toJSON(),
						inner: inner.getBoundingClientRect().toJSON(),
						section: element.getBoundingClientRect().toJSON(),
						supporting: supportingCopy.getBoundingClientRect().toJSON(),
					}
				})

				const contentWidth = layout.section.width - 2 * viewport.gutter

				expect(layout.inner.x).toBeCloseTo(viewport.gutter, 5)
				expect(layout.inner.width).toBeCloseTo(contentWidth, 5)
				expect(layout.heading.x).toBeCloseTo(viewport.gutter, 5)
				expect(layout.heading.width).toBeCloseTo(viewport.headingWidth ?? contentWidth, 5)
				expect(layout.cta.x).toBeCloseTo(viewport.gutter, 5)

				if (viewport.supportingWidth === null) {
					await expect(supporting).toBeHidden()
				} else {
					await expect(supporting).toBeVisible()
					expect(layout.supporting.x).toBeCloseTo(viewport.gutter, 5)
					expect(layout.supporting.width).toBeCloseTo(viewport.supportingWidth, 5)
				}

				expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)
			})
		}
	})
}
