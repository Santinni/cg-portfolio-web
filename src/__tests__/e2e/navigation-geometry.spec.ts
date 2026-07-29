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

const primaryDestinations = ['Work', 'Experience', 'About', 'Contact', 'Insights'] as const

test.describe('Figma desktop primary-link visual states', () => {
	test('matches the light default, hover, current and focus contracts at 1440px', async ({
		page,
	}) => {
		await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'light'))
		await page.setViewportSize({ height: 900, width: 1440 })
		await page.goto('/')

		const navigation = page.getByRole('navigation')
		const primaryLinks = primaryDestinations.map((label) =>
			navigation.getByRole('link', { exact: true, name: label }),
		)

		for (const link of primaryLinks) {
			await expect(link).toBeVisible()
		}

		const workLink = primaryLinks[0]
		const measurements = await workLink.evaluate((element) => {
			const styles = getComputedStyle(element)
			const indicator = getComputedStyle(element, '::after')
			const menu = getComputedStyle(element.parentElement!)

			return {
				indicator: {
					borderRadius: indicator.borderRadius,
					height: indicator.height,
					opacity: indicator.opacity,
					width: indicator.width,
				},
				link: {
					alignItems: styles.alignItems,
					color: styles.color,
					columnGap: styles.columnGap,
					display: styles.display,
					flexDirection: styles.flexDirection,
					fontFamily: styles.fontFamily,
					fontSize: styles.fontSize,
					fontWeight: styles.fontWeight,
					height: styles.height,
					justifyContent: styles.justifyContent,
					letterSpacing: styles.letterSpacing,
					lineHeight: styles.lineHeight,
					paddingInline: styles.paddingInline,
					rowGap: styles.rowGap,
				},
				menuGap: menu.gap,
			}
		})
		const bodyFontFamily = await page
			.locator('body')
			.evaluate((body) => getComputedStyle(body).fontFamily)

		expect(measurements.menuGap).toBe('16px')
		expect(measurements.link).toMatchObject({
			alignItems: 'center',
			color: 'rgb(8, 9, 12)',
			display: 'flex',
			flexDirection: 'column',
			fontFamily: bodyFontFamily,
			fontSize: '14px',
			fontWeight: '500',
			height: '44px',
			justifyContent: 'center',
			lineHeight: '20px',
			paddingInline: '8px',
			rowGap: '2px',
		})
		expect(['0px', 'normal']).toContain(measurements.link.letterSpacing)
		expect(measurements.indicator).toEqual({
			borderRadius: '1px',
			height: '2px',
			opacity: '0',
			width: '32px',
		})

		await workLink.hover()
		await expect
			.poll(() => workLink.evaluate((element) => getComputedStyle(element).color))
			.toBe('rgb(10, 110, 128)')
		expect(await workLink.evaluate((element) => getComputedStyle(element, '::after').opacity)).toBe(
			'0',
		)

		await workLink.focus()
		const focus = await workLink.evaluate((element) => {
			const styles = getComputedStyle(element)
			return {
				color: styles.outlineColor,
				offset: styles.outlineOffset,
				style: styles.outlineStyle,
				width: styles.outlineWidth,
			}
		})
		expect(focus).toEqual({
			color: 'rgb(10, 110, 128)',
			offset: '-2px',
			style: 'solid',
			width: '2px',
		})

		await page.goto('/work')
		const currentWork = page.getByRole('navigation').locator('a[aria-current="page"]:visible')
		await expect(currentWork).toHaveText('Work')

		const current = await currentWork.evaluate((element) => {
			const styles = getComputedStyle(element)
			const indicator = getComputedStyle(element, '::after')
			return {
				color: styles.color,
				indicatorColor: indicator.backgroundColor,
				indicatorOpacity: indicator.opacity,
			}
		})
		expect(current).toEqual({
			color: 'rgb(10, 110, 128)',
			indicatorColor: 'rgb(10, 110, 128)',
			indicatorOpacity: '1',
		})
	})

	test('keeps the semantic high-contrast inverse colors in dark mode', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'dark'))
		await page.setViewportSize({ height: 900, width: 1440 })
		await page.goto('/work')

		const navigation = page.getByRole('navigation')
		const currentWork = navigation.locator('a[aria-current="page"]:visible')
		const experienceLink = navigation.getByRole('link', { exact: true, name: 'Experience' })

		await expect(experienceLink).toBeVisible()
		expect(await experienceLink.evaluate((element) => getComputedStyle(element).color)).toBe(
			'rgb(255, 255, 255)',
		)

		const current = await currentWork.evaluate((element) => {
			const styles = getComputedStyle(element)
			const indicator = getComputedStyle(element, '::after')
			return {
				color: styles.color,
				indicatorColor: indicator.backgroundColor,
				indicatorOpacity: indicator.opacity,
			}
		})
		expect(current).toEqual({
			color: 'rgb(34, 211, 238)',
			indicatorColor: 'rgb(34, 211, 238)',
			indicatorOpacity: '1',
		})

		await experienceLink.focus()
		expect(await experienceLink.evaluate((element) => getComputedStyle(element).outlineColor)).toBe(
			'rgb(34, 211, 238)',
		)
	})
})

test.describe('forced-colors primary-link states', () => {
	test('keeps the current indicator and keyboard focus visibly distinct', async ({ page }) => {
		await page.emulateMedia({ forcedColors: 'active' })
		await page.setViewportSize({ height: 900, width: 1440 })
		await page.goto('/work')

		const currentWork = page.getByRole('navigation').locator('a[aria-current="page"]:visible')

		for (let index = 0; index < 3; index += 1) {
			await page.keyboard.press('Tab')
		}
		await expect(currentWork).toBeFocused()

		const forcedColors = await currentWork.evaluate((element) => {
			const styles = getComputedStyle(element)
			const indicator = getComputedStyle(element, '::after')
			const canvasColor = getComputedStyle(document.body).backgroundColor

			return {
				canvasColor,
				focus: {
					color: styles.outlineColor,
					style: styles.outlineStyle,
					width: styles.outlineWidth,
				},
				indicator: {
					color: indicator.backgroundColor,
					opacity: indicator.opacity,
				},
			}
		})

		expect(forcedColors.indicator.opacity).toBe('1')
		expect(forcedColors.indicator.color).not.toBe('rgba(0, 0, 0, 0)')
		expect(forcedColors.indicator.color).not.toBe(forcedColors.canvasColor)
		expect(forcedColors.focus).toMatchObject({
			style: 'solid',
			width: '2px',
		})
		expect(forcedColors.focus.color).not.toBe('rgba(0, 0, 0, 0)')
		expect(forcedColors.focus.color).not.toBe(forcedColors.canvasColor)
	})
})
