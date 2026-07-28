import { expect, test } from '@playwright/test'

function getTestOrigin(baseURL: unknown): string {
	if (typeof baseURL !== 'string') {
		throw new Error('Playwright baseURL must be configured for i18n routing tests.')
	}

	return new URL(baseURL).origin
}

test.describe('localized routing contract', () => {
	test('keeps / English without an HTTP redirect even with Czech request preferences', async ({
		page,
		request,
	}, testInfo) => {
		await page.setExtraHTTPHeaders({ 'Accept-Language': 'cs-CZ,cs;q=0.9,en;q=0.8' })
		await page.context().addCookies([
			{
				name: 'NEXT_LOCALE',
				value: 'cs',
				url: getTestOrigin(testInfo.project.use.baseURL),
			},
		])

		const rawResponse = await request.get('/', {
			headers: {
				'Accept-Language': 'cs-CZ,cs;q=0.9,en;q=0.8',
				Cookie: 'NEXT_LOCALE=cs',
			},
			maxRedirects: 0,
		})
		const response = await page.goto('/')

		expect(rawResponse.status()).toBe(200)
		expect(rawResponse.headers().location).toBeUndefined()
		expect(response?.status()).toBe(200)
		expect(new URL(page.url()).pathname).toBe('/')
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		await expect(
			page.getByRole('heading', {
				level: 1,
				name: 'I build frontend systems for products that have to last.',
			}),
		).toBeVisible()
		await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeAttached()
	})

	test('renders /cs in Czech with matching visible and accessibility copy', async ({ page }) => {
		const response = await page.goto('/cs')

		expect(response?.status()).toBe(200)
		expect(new URL(page.url()).pathname).toBe('/cs')
		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expect(
			page.getByRole('heading', {
				level: 1,
				name: 'Stavím frontendové systémy pro produkty, které musí vydržet.',
			}),
		).toBeVisible()
		await expect(page.getByRole('link', { name: 'Přeskočit na hlavní obsah' })).toBeAttached()
	})

	test('normalizes explicit /en URLs to the unprefixed English URL', async ({ page }) => {
		await page.goto('/en/work')

		expect(new URL(page.url()).pathname).toBe('/work')
		await expect(page.locator('html')).toHaveAttribute('lang', 'en')
		await expect(
			page.getByRole('heading', { level: 1, name: /Frontend systems built/ }),
		).toBeVisible()
	})

	test('does not localize API or Payload admin paths', async ({ request }) => {
		const healthResponse = await request.get('/api/health', { maxRedirects: 0 })
		const healthBody = await healthResponse.json()

		expect(new URL(healthResponse.url()).pathname).toBe('/api/health')
		expect(healthResponse.headers().location).toBeUndefined()
		expect(healthBody.status).toBe('ok')

		const adminResponse = await request.get('/admin', { maxRedirects: 0 })
		const adminLocation = adminResponse.headers().location

		expect(new URL(adminResponse.url()).pathname).toBe('/admin')
		expect(adminLocation ?? '').not.toMatch(/^\/cs(?:\/|$)/)
	})

	for (const route of ['/cs/not-a-real-page', '/cs/work/not-a-real-case']) {
		test(`returns a real localized Czech 404 for ${route}`, async ({ page }) => {
			const response = await page.goto(route)

			expect(response?.status(), `${route} should return HTTP 404`).toBe(404)
			await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
			await expect(
				page.getByRole('heading', { name: 'Tato stránka není součástí webu.' }),
			).toBeVisible()
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
		})
	}

	for (const route of [
		'/not-a-real-page',
		'/xx/work',
		'/xx/not-a-real-subpage',
		'/work/not-a-real-case',
	]) {
		test(`returns a real branded English 404 for ${route}`, async ({ page }) => {
			const response = await page.goto(route)

			expect(response?.status(), `${route} should return HTTP 404`).toBe(404)
			await expect(page.locator('html')).toHaveAttribute('lang', 'en')
			await expect(
				page.getByRole('heading', { name: 'This page is not part of the system.' }),
			).toBeVisible()
			await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
		})
	}

	test('keeps a missing runtime CMS article as a real branded noindex 404', async ({ page }) => {
		const response = await page.goto('/insights/not-a-real-article')

		expect(response?.status()).toBe(404)
		await expect(
			page.getByRole('heading', { name: 'This page is not part of the system.' }),
		).toBeVisible()
		await expect(page.locator('meta[name="robots"][content*="noindex"]').first()).toBeAttached()
	})

	test('redirects Czech CMS article URLs at HTTP level without advertising Czech content', async ({
		request,
	}) => {
		const response = await request.get('/cs/insights/example-article', { maxRedirects: 0 })

		expect(response.status()).toBe(307)
		expect(response.headers().location).toBe('/insights/example-article')
		expect(response.headers().link ?? '').not.toContain('hreflang="cs"')
	})
})
