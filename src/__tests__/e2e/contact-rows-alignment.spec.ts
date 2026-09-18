import { expect, test } from '@playwright/test'

/**
 * Parity class (Chromium only): the contact directory rows share one grid template, so
 * every value starts on the same x whether or not the row carries the arrow affordance.
 *
 * Found on 2026-09-13 at 1092px: the static location row had no third grid item, its `auto`
 * arrow track resolved to 0 and the `0.35fr` label track grew by ~5px, so "Praha, Česká
 * republika" started 5px right of the e-mail above it. The arrow column is now a fixed
 * `--icon-20` track in `ContactLink.module.css`; this spec pins the alignment at the widths
 * where the label column exists (>= 480px) and the single-column layout below it.
 */
const widths = [1440, 1092, 768, 480, 390] as const
const locales = [
	{ path: '/contact', label: 'en' },
	{ path: '/cs/contact', label: 'cs' },
] as const

for (const locale of locales) {
	for (const width of widths) {
		test(`aligns the ${locale.label} contact rows at ${width}px`, async ({ page }) => {
			await page.setViewportSize({ width, height: 900 })
			await page.goto(locale.path)
			const section = page.locator('section[aria-labelledby="contact-methods-heading"]')
			await expect(section).toBeVisible()

			const rows = section.locator('[data-contact-method]')
			await expect(rows).toHaveCount(4)
			const geometry = await rows.evaluateAll((elements) =>
				elements.map((element) => {
					const value = element.querySelector('[class*="value"]')
					const label = element.querySelector('[class*="label"]')
					if (!(value instanceof HTMLElement) || !(label instanceof HTMLElement)) {
						throw new Error('contact row without label or value')
					}
					const tracks = getComputedStyle(element).gridTemplateColumns.split(' ')
					return {
						method: element.getAttribute('data-contact-method'),
						arrowTrack: Number.parseFloat(tracks[tracks.length - 1] ?? '0'),
						labelWidth: label.getBoundingClientRect().width,
						valueLeft: value.getBoundingClientRect().left,
					}
				}),
			)

			expect(geometry.map((row) => row.method)).toContain('location')
			const [first, ...rest] = geometry
			for (const row of rest) {
				// The reserved arrow track keeps the label track, and with it the value's x,
				// identical across link rows and the static location row.
				expect(row.arrowTrack, `${row.method} arrow track`).toBeCloseTo(first.arrowTrack, 1)
				expect(row.labelWidth, `${row.method} label width`).toBeCloseTo(first.labelWidth, 1)
				expect(row.valueLeft, `${row.method} value x`).toBeCloseTo(first.valueLeft, 1)
			}
			expect(first.arrowTrack).toBe(20)
		})
	}
}
