import { expect, test } from '@playwright/test'

for (const path of ['/', '/cs'] as const) {
	test(`anchors the desktop Experience content to the approved grid at ${path}`, async ({
		page,
	}) => {
		await page.setViewportSize({ height: 900, width: 1440 })
		const response = await page.goto(path)
		expect(response?.status()).toBe(200)

		const section = page.locator('#experience-snapshot')
		await expect(section).toBeVisible()

		const layout = await section.evaluate((element) => {
			const inner = element.firstElementChild
			const eyebrow = inner?.querySelector(':scope > p:first-child')
			const title = inner?.querySelector('#experience-snapshot-heading')
			const description = inner?.querySelector(':scope > p:not(:first-child)')
			const cta = inner?.querySelector(':scope > a')

			if (
				!(inner instanceof HTMLElement) ||
				!(eyebrow instanceof HTMLElement) ||
				!(title instanceof HTMLElement) ||
				!(description instanceof HTMLElement) ||
				!(cta instanceof HTMLElement)
			) {
				throw new Error('Expected the complete Experience content structure')
			}

			return {
				cta: cta.getBoundingClientRect().toJSON(),
				description: description.getBoundingClientRect().toJSON(),
				documentClientWidth: document.documentElement.clientWidth,
				documentScrollWidth: document.documentElement.scrollWidth,
				eyebrow: eyebrow.getBoundingClientRect().toJSON(),
				inner: inner.getBoundingClientRect().toJSON(),
				section: element.getBoundingClientRect().toJSON(),
				title: title.getBoundingClientRect().toJSON(),
			}
		})

		const contentWidth = layout.section.width - 240

		expect(layout.inner.x).toBeCloseTo(120, 5)
		expect(layout.inner.width).toBeCloseTo(contentWidth, 5)
		expect(layout.eyebrow.x).toBeCloseTo(120, 5)
		expect(layout.eyebrow.width).toBeCloseTo(600, 5)
		expect(layout.title.x).toBeCloseTo(120, 5)
		expect(layout.title.width).toBeCloseTo(850, 5)
		expect(layout.description.x).toBeCloseTo(120, 5)
		expect(layout.description.width).toBeCloseTo(760, 5)
		expect(layout.cta.x).toBeCloseTo(120, 5)
		expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)
	})
}
