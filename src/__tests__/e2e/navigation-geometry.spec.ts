import { expect, test } from '@playwright/test'

const geometryCases = [
	{
		expectedGutter: 20,
		expectedHeaderHeight: 64,
		localePath: '/',
		viewport: { height: 844, width: 390 },
	},
	{
		expectedGutter: 48,
		expectedHeaderHeight: 64,
		localePath: '/cs',
		viewport: { height: 900, width: 768 },
	},
	{
		expectedGutter: 64,
		expectedHeaderHeight: 72,
		localePath: '/',
		viewport: { height: 900, width: 1024 },
	},
	{
		expectedGutter: 120,
		expectedHeaderHeight: 72,
		localePath: '/',
		viewport: { height: 900, width: 1440 },
	},
] as const

test.describe('Figma navigation shell geometry', () => {
	for (const { expectedGutter, expectedHeaderHeight, localePath, viewport } of geometryCases) {
		test(`${viewport.width}px preserves the canonical shell and brand contract`, async ({
			page,
		}) => {
			await page.setViewportSize(viewport)
			const response = await page.goto(localePath)

			expect(response?.status()).toBe(200)

			const navigation = page.getByRole('navigation')
			const wrapper = navigation.locator(':scope > div')
			const brand = navigation.getByRole('link', { name: /Codeguy/ }).locator('span')
			const headline = page.locator('main h1')

			await expect(navigation).toBeVisible()
			await expect(headline).toBeVisible()

			const measurements = await page.evaluate(() => {
				const navigationElement = document.querySelector('nav')
				const wrapperElement = navigationElement?.firstElementChild
				const brandElement = navigationElement?.querySelector('a span')
				const headlineElement = document.querySelector('main h1')

				if (!navigationElement || !wrapperElement || !brandElement || !headlineElement) {
					throw new Error('Expected navigation shell and homepage headline')
				}

				const navigationRect = navigationElement.getBoundingClientRect()
				const wrapperRect = wrapperElement.getBoundingClientRect()
				const brandRect = brandElement.getBoundingClientRect()
				const headlineRect = headlineElement.getBoundingClientRect()
				const brandStyles = getComputedStyle(brandElement)
				const bodyStyles = getComputedStyle(document.body)

				return {
					bodyFontFamily: bodyStyles.fontFamily,
					brand: {
						fontFamily: brandStyles.fontFamily,
						fontSize: brandStyles.fontSize,
						fontWeight: brandStyles.fontWeight,
						letterSpacing: brandStyles.letterSpacing,
						lineHeight: brandStyles.lineHeight,
						rect: brandRect.toJSON(),
					},
					document: {
						clientWidth: document.documentElement.clientWidth,
						scrollWidth: document.documentElement.scrollWidth,
					},
					headline: headlineRect.toJSON(),
					navigation: navigationRect.toJSON(),
					wrapper: wrapperRect.toJSON(),
				}
			})

			expect(measurements.navigation.height).toBe(expectedHeaderHeight)
			expect(measurements.wrapper.height).toBe(expectedHeaderHeight)
			expect(measurements.wrapper.x).toBe(expectedGutter)
			expect(measurements.wrapper.width).toBe(
				Math.min(measurements.navigation.width - 2 * expectedGutter, 1200),
			)

			expect(measurements.brand.fontFamily).toBe(measurements.bodyFontFamily)
			expect(measurements.brand.fontSize).toBe('18px')
			expect(measurements.brand.fontWeight).toBe('600')
			expect(['0px', 'normal']).toContain(measurements.brand.letterSpacing)
			expect(measurements.brand.lineHeight).toBe('24px')
			expect(measurements.brand.rect.y + measurements.brand.rect.height / 2).toBe(
				expectedHeaderHeight / 2,
			)

			expect(measurements.headline.y).toBeGreaterThanOrEqual(
				measurements.navigation.y + measurements.navigation.height,
			)
			expect(measurements.document.scrollWidth).toBeLessThanOrEqual(
				measurements.document.clientWidth,
			)

			await expect(wrapper).toBeVisible()
			await expect(brand).toHaveText(/CODEGUY/i)
		})
	}
})
