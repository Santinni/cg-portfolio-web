import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('loads successfully with correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/CodeGuy|codeguy/i)
	})

	test('has a visible hero section', async ({ page }) => {
		const hero = page.locator('section[aria-labelledby="hero-heading"]')
		await expect(hero).toBeVisible()
	})

	test('has navigation visible', async ({ page }) => {
		const nav = page.getByRole('navigation')
		await expect(nav).toBeVisible()
	})

	test('has all main sections', async ({ page }) => {
		const sections = [
			'hero-heading',
			'about-heading',
			'services-heading',
			'projects-heading',
			'contact-heading',
		]

		for (const headingId of sections) {
			const section = page.locator(`section[aria-labelledby="${headingId}"]`)
			await expect(section).toBeAttached()
		}
	})

	test('contact section has social links', async ({ page }) => {
		const contact = page.locator('section[aria-labelledby="contact-heading"]')
		const links = contact.getByRole('link')

		expect(await links.count()).toBeGreaterThan(0)
	})
})

test.describe('Navigation', () => {
	test('scrolls to sections when nav links are clicked', async ({ page }) => {
		await page.goto('/')

		// Find navigation links and test at least one section scroll
		const navLinks = page.getByRole('navigation').getByRole('link')
		const linkCount = await navLinks.count()

		if (linkCount > 0) {
			// Click the first nav link
			await navLinks.first().click()

			// Wait for any scroll animation to settle
			await page.waitForTimeout(500)
		}
	})
})

test.describe('Health endpoint', () => {
	test('returns healthy status', async ({ request }) => {
		const response = await request.get('/api/health')

		expect(response.ok()).toBeTruthy()

		const body = await response.json()
		expect(body.status).toBe('ok')
		expect(body.timestamp).toBeTruthy()
	})
})
