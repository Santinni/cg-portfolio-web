import { expect, test } from '@playwright/test'

const launchRoutes = ['/', '/work', '/experience', '/about', '/contact', '/insights']

test.describe('public launch surface', () => {
	test('every primary route renders a usable document', async ({ page }) => {
		for (const route of launchRoutes) {
			const response = await page.goto(route)

			expect(response?.status(), `${route} should return HTTP 200`).toBe(200)
			await expect(page.locator('main h1')).toBeVisible()
			await expect(page.locator('main h1')).toHaveCount(1)
			await expect(page.getByText(/application error|internal server error/i)).toHaveCount(0)
		}
	})

	test('skip link moves keyboard focus to the main content', async ({ page }) => {
		await page.goto('/')
		await page.keyboard.press('Tab')

		const skipLink = page.getByRole('link', { name: 'Skip to main content' })
		await expect(skipLink).toBeFocused()
		await page.keyboard.press('Enter')
		await expect(page.locator('#main-content')).toBeFocused()
	})

	test('health endpoint exposes the running revision contract', async ({ request }) => {
		const response = await request.get('/api/health')
		const body = await response.json()

		expect(response.ok()).toBeTruthy()
		expect(body.status).toBe('ok')
		expect(body.revision).toBeTruthy()
		expect(body.timestamp).toBeTruthy()
		expect(body.checks.database).toBe('skipped')

		const readinessResponse = await request.get('/api/health?deep=1')
		const readinessBody = await readinessResponse.json()

		expect(readinessResponse.ok()).toBeTruthy()
		expect(readinessBody.status).toBe('ok')
		expect(readinessBody.checks.database).toBe('ok')
	})
})

test.describe('work case studies', () => {
	test('publishes exactly three finished cases and keeps Accessibility pending', async ({
		page,
	}) => {
		await page.goto('/work')

		const caseLinks = page.locator('main a[href^="/work/"]')
		await expect(caseLinks).toHaveCount(3)

		const pending = page.getByText('Case study coming soon')
		await expect(pending).toBeVisible()
		expect(await pending.evaluate((element) => element.closest('a'))).toBeNull()
	})

	test('all finished cases render and an unknown case uses the custom 404', async ({ page }) => {
		for (const slug of [
			'energy-customer-portal',
			'maintenance-applications',
			'distributed-energy-platform',
		]) {
			const response = await page.goto(`/work/${slug}`)
			expect(response?.status()).toBe(200)
			await expect(page.locator('main h1')).toBeVisible()
		}

		const missingResponse = await page.goto('/work/not-a-real-case')
		expect(missingResponse?.status()).toBe(404)
		await expect(
			page.getByRole('heading', { name: 'This page is not part of the system.' }),
		).toBeVisible()
	})
})

test.describe('responsive shell interactions', () => {
	test('desktop navigation exposes every primary destination', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/')

		const navigation = page.getByRole('navigation')
		for (const label of ['Work', 'Experience', 'About', 'Contact', 'Insights']) {
			await expect(navigation.getByRole('link', { name: label, exact: true })).toBeVisible()
		}
	})

	test('navigation exposes the current static route across locales, queries and fragments', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 1440, height: 900 })

		for (const route of [
			{ href: '/?source=navigation#main-content', label: 'Codeguy – Home' },
			{ href: '/cs/work?source=navigation#main-content', label: 'Projekty' },
		]) {
			await page.goto(route.href)

			const navigation = page.getByRole('navigation')
			await expect(navigation.getByRole('link', { name: route.label })).toHaveAttribute(
				'aria-current',
				'page',
			)
			await expect(navigation.locator('a[aria-current="page"]')).toHaveCount(1)
			expect(page.url()).toContain('?source=navigation#main-content')
		}
	})

	test('mobile menu closes with Escape, restores focus and releases scroll lock', async ({
		page,
	}) => {
		await page.setViewportSize({ width: 390, height: 844 })
		await page.goto('/')

		const trigger = page.getByRole('button', { name: 'Open menu' })
		await trigger.click()
		await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible()
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('hidden')

		await page.keyboard.press('Escape')
		await expect(page.getByRole('dialog', { name: 'Site menu' })).not.toBeVisible()
		await expect(trigger).toBeFocused()
		expect(await page.locator('body').evaluate((body) => body.style.overflow)).toBe('')
	})

	test('theme choice changes and persists across reloads', async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 })
		await page.goto('/')
		await page.evaluate(() => localStorage.removeItem('codeguy-theme'))
		await page.reload()

		const initialTheme = await page.locator('html').getAttribute('data-theme')
		await page.locator('button[aria-label="Toggle color theme"]:visible').click()
		const selectedTheme = await page.locator('html').getAttribute('data-theme')

		expect(selectedTheme).not.toBe(initialTheme)
		await page.reload()
		await expect(page.locator('html')).toHaveAttribute('data-theme', selectedTheme || 'light')
	})

	for (const viewport of [
		{ width: 390, height: 844 },
		{ width: 1440, height: 900 },
	]) {
		test(`has no horizontal overflow at ${viewport.width}px`, async ({ page }) => {
			await page.setViewportSize(viewport)

			for (const route of launchRoutes) {
				await page.goto(route)
				const dimensions = await page.evaluate(() => ({
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
				}))
				expect(
					dimensions.scrollWidth,
					`${route} overflows at ${viewport.width}px`,
				).toBeLessThanOrEqual(dimensions.clientWidth)
			}
		})
	}
})
