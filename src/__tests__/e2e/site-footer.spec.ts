import { expect, test } from '@playwright/test'

/**
 * Functional class (every engine): the site footer contract from SC-01 (COD-91) — one
 * `contentinfo` landmark on every localized route, the contact channels with their link
 * semantics (CV-05), the CV as a page link (CV-09) and the booking route with the locale
 * prefix, and no horizontal overflow at the narrowest and widest widths.
 */
const routes = [
	{ path: '/', locale: 'en', prefix: '' },
	{ path: '/work', locale: 'en', prefix: '' },
	{ path: '/cs', locale: 'cs', prefix: '/cs' },
	{ path: '/cs/contact', locale: 'cs', prefix: '/cs' },
] as const

const copy = {
	en: { cv: 'Curriculum vitae', booking: 'Book an intro call', email: 'Email' },
	cs: { cv: 'Životopis', booking: 'Domluvit úvodní hovor', email: 'E-mail' },
} as const

for (const route of routes) {
	test(`renders the site footer contract on ${route.path}`, async ({ page }) => {
		await page.goto(route.path)
		const footer = page.getByRole('contentinfo')
		await expect(footer).toHaveCount(1)
		await expect(footer).toBeVisible()

		// Contact channels keep the ContactLink semantics.
		const email = footer.locator('a[data-contact-method="email"]')
		await expect(email).toHaveAttribute('href', 'mailto:karel@codeguy.cz')
		await expect(email).not.toHaveAttribute('target', '_blank')
		for (const key of ['linkedin', 'github']) {
			const link = footer.locator(`a[data-contact-method="${key}"]`)
			await expect(link).toHaveAttribute('target', '_blank')
			await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
		}
		await expect(footer.locator('[data-contact-method="location"]')).toHaveCount(0)

		// The CV is a page, never a download; booking keeps the locale prefix.
		const t = copy[route.locale]
		await expect(footer.getByRole('link', { exact: true, name: t.cv })).toHaveAttribute(
			'href',
			`${route.prefix}/curriculum-vitae`,
		)
		await expect(footer.getByRole('link', { exact: true, name: t.booking })).toHaveAttribute(
			'href',
			`${route.prefix}/contact/book`,
		)
		await expect(footer.locator('a[download]')).toHaveCount(0)
		await expect(footer.getByText(`© ${new Date().getFullYear()} Karel Kutchan`)).toBeVisible()
	})
}

for (const width of [320, 1440] as const) {
	test(`keeps the footer inside the viewport at ${width}px`, async ({ page, isMobile }) => {
		test.skip(Boolean(isMobile), 'The mobile project ignores viewport widths set by the test.')
		await page.setViewportSize({ width, height: 900 })
		await page.goto('/')
		const footer = page.getByRole('contentinfo')
		await footer.scrollIntoViewIfNeeded()
		const geometry = await footer.evaluate((element) => ({
			right: element.getBoundingClientRect().right,
			overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
			targets: [...element.querySelectorAll('a')].map((a) => a.getBoundingClientRect().height),
		}))
		expect(geometry.overflow).toBe(false)
		expect(geometry.right).toBeLessThanOrEqual(width)
		for (const height of geometry.targets) expect(height).toBeGreaterThanOrEqual(44)
	})
}
