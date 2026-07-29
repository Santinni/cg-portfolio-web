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

test.describe('Figma mobile-menu composition', () => {
	test('matches the approved English 390x844 dialog geometry and content', async ({ page }) => {
		await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'light'))
		await page.setViewportSize({ height: 844, width: 390 })
		await page.goto('/')
		await page.getByRole('button', { name: 'Open menu' }).click()

		const dialog = page.getByRole('dialog', { name: 'Site menu' })
		const menu = dialog.getByRole('navigation', { name: 'Site menu' })
		const links = menu.getByRole('link')
		const profile = dialog.locator('[data-mobile-menu-profile]')

		await expect(dialog).toBeVisible()
		await expect(dialog.getByRole('link', { name: 'Codeguy – Home' })).toHaveText('Codeguy')
		await expect(dialog.getByRole('button', { name: 'Toggle color theme' })).toBeVisible()
		await expect(dialog.getByRole('group', { name: 'Choose language' })).toBeVisible()
		await expect(links).toHaveText(['Work', 'Experience', 'About', 'Contact', 'Insights'])
		await expect(profile.locator('p')).toHaveText([
			'Senior / Lead Frontend Engineer',
			'Prague · React · TypeScript · Accessibility',
		])

		const measurements = await page.evaluate(() => {
			const dialogElement = document.querySelector('dialog[open]')
			const headerElement = dialogElement?.querySelector('[data-mobile-menu-header]')
			const brandElement = headerElement?.querySelector('a')
			const closeElement = headerElement?.querySelector('button[aria-label="Close menu"]')
			const menuElement = dialogElement?.querySelector('nav')
			const linkElements = menuElement?.querySelectorAll('a')
			const profileElement = dialogElement?.querySelector('[data-mobile-menu-profile]')

			if (
				!dialogElement ||
				!headerElement ||
				!brandElement ||
				!closeElement ||
				!menuElement ||
				!linkElements ||
				linkElements.length !== 5 ||
				!profileElement
			) {
				throw new Error('Expected the complete mobile-menu composition')
			}

			const brandStyles = getComputedStyle(brandElement)
			const firstLinkStyles = getComputedStyle(linkElements[0])
			const profileStyles = getComputedStyle(profileElement)

			return {
				brand: {
					fontSize: brandStyles.fontSize,
					fontWeight: brandStyles.fontWeight,
					lineHeight: brandStyles.lineHeight,
					rect: brandElement.getBoundingClientRect().toJSON(),
				},
				close: closeElement.getBoundingClientRect().toJSON(),
				dialog: dialogElement.getBoundingClientRect().toJSON(),
				document: {
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
				},
				header: headerElement.getBoundingClientRect().toJSON(),
				links: Array.from(linkElements, (link) => link.getBoundingClientRect().toJSON()),
				linkStyle: {
					alignItems: firstLinkStyles.alignItems,
					fontSize: firstLinkStyles.fontSize,
					fontWeight: firstLinkStyles.fontWeight,
					justifyContent: firstLinkStyles.justifyContent,
					lineHeight: firstLinkStyles.lineHeight,
				},
				menu: menuElement.getBoundingClientRect().toJSON(),
				profile: {
					color: profileStyles.color,
					fontSize: profileStyles.fontSize,
					lineHeight: profileStyles.lineHeight,
					rect: profileElement.getBoundingClientRect().toJSON(),
				},
			}
		})

		expect(measurements.dialog).toMatchObject({ height: 844, width: 390, x: 0, y: 0 })
		expect(measurements.header).toMatchObject({ height: 64, width: 390, x: 0, y: 0 })
		expect(measurements.brand).toMatchObject({
			fontSize: '18px',
			fontWeight: '600',
			lineHeight: '24px',
		})
		expect(measurements.brand.rect.x).toBe(20)
		expect(measurements.close).toMatchObject({ height: 44, width: 44, x: 326 })
		expect(measurements.menu).toMatchObject({ width: 350, x: 20, y: 112 })
		expect(measurements.links.map(({ height, width, x, y }) => ({ height, width, x, y }))).toEqual(
			[112, 184, 256, 328, 400].map((y) => ({ height: 64, width: 350, x: 20, y })),
		)
		expect(measurements.linkStyle).toEqual({
			alignItems: 'center',
			fontSize: '14px',
			fontWeight: '500',
			justifyContent: 'center',
			lineHeight: '20px',
		})
		expect(measurements.profile.fontSize).toBe('14px')
		expect(Number.parseFloat(measurements.profile.lineHeight)).toBeCloseTo(20.3, 1)
		expect(measurements.profile.rect).toMatchObject({ width: 350, x: 20 })
		expect(measurements.profile.rect.y).toBeCloseTo(700, 0)
		expect(measurements.profile.color).toBe('rgb(74, 89, 99)')
		expect(measurements.document.scrollWidth).toBeLessThanOrEqual(measurements.document.clientWidth)
	})

	test('keeps the inferred Czech 768px composition localized and non-overlapping', async ({
		page,
	}) => {
		await page.setViewportSize({ height: 900, width: 768 })
		await page.goto('/cs')
		await page.getByRole('button', { name: 'Otevřít nabídku' }).click()

		const dialog = page.getByRole('dialog', { name: 'Hlavní nabídka' })
		const menu = dialog.getByRole('navigation', { name: 'Hlavní nabídka' })
		const links = menu.getByRole('link')
		const footer = dialog.locator('[data-mobile-menu-footer]')

		await expect(dialog.getByRole('link', { name: 'Codeguy – Domů' })).toHaveAttribute(
			'href',
			'/cs',
		)
		await expect(links).toHaveText(['Projekty', 'Zkušenosti', 'O mně', 'Kontakt', 'Články'])
		await expect(dialog.getByRole('button', { name: 'Přepnout barevný motiv' })).toBeVisible()
		await expect(dialog.getByRole('group', { name: 'Vyberte jazyk' })).toBeVisible()
		await expect(footer).toContainText('Seniorní frontend vývojář / vedoucí frontendu')
		await expect(footer).toContainText('Praha · React · TypeScript · Přístupnost')

		const measurements = await page.evaluate(() => {
			const dialogElement = document.querySelector('dialog[open]')
			const headerElement = dialogElement?.querySelector('[data-mobile-menu-header]')
			const menuElement = dialogElement?.querySelector('nav')
			const linkElements = menuElement?.querySelectorAll('a')
			const footerElement = dialogElement?.querySelector('[data-mobile-menu-footer]')

			if (
				!dialogElement ||
				!headerElement ||
				!menuElement ||
				!linkElements ||
				linkElements.length !== 5 ||
				!footerElement
			) {
				throw new Error('Expected the complete tablet menu composition')
			}

			const menuRect = menuElement.getBoundingClientRect()
			const linkRects = Array.from(linkElements, (link) => link.getBoundingClientRect())
			const footerRect = footerElement.getBoundingClientRect()

			return {
				dialog: dialogElement.getBoundingClientRect().toJSON(),
				document: {
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
				},
				footer: footerRect.toJSON(),
				header: headerElement.getBoundingClientRect().toJSON(),
				links: linkRects.map((rect) => rect.toJSON()),
				menu: menuRect.toJSON(),
			}
		})

		expect(measurements.dialog).toMatchObject({ height: 900, width: 768, x: 0, y: 0 })
		expect(measurements.header).toMatchObject({ height: 64, width: 768, x: 0, y: 0 })
		expect(measurements.menu).toMatchObject({ width: 672, x: 48, y: 112 })
		expect(measurements.links.every((link) => link.height === 64 && link.width === 672)).toBe(true)
		expect(
			measurements.links
				.slice(1)
				.every((link, index) => link.y - measurements.links[index].y === 72),
		).toBe(true)
		expect(measurements.footer.y).toBeGreaterThan(
			measurements.links[measurements.links.length - 1].y +
				measurements.links[measurements.links.length - 1].height,
		)
		expect(measurements.footer.y + measurements.footer.height).toBeLessThanOrEqual(
			measurements.dialog.height,
		)
		expect(measurements.document.scrollWidth).toBeLessThanOrEqual(measurements.document.clientWidth)
	})

	test('keeps the Czech profile and language controls reachable in a short 390px viewport', async ({
		page,
	}) => {
		await page.setViewportSize({ height: 568, width: 390 })
		await page.goto('/cs')
		await page.getByRole('button', { name: 'Otevřít nabídku' }).click()

		const dialog = page.getByRole('dialog', { name: 'Hlavní nabídka' })
		const footer = dialog.locator('[data-mobile-menu-footer]')
		const profile = dialog.locator('[data-mobile-menu-profile]')
		const languageSwitcher = dialog.getByRole('group', { name: 'Vyberte jazyk' })

		await footer.scrollIntoViewIfNeeded()
		await expect(footer).toBeVisible()
		await expect(languageSwitcher).toBeVisible()
		await expect(profile.locator('p')).toHaveText([
			'Seniorní frontend vývojář / vedoucí frontendu',
			'Praha · React · TypeScript · Přístupnost',
		])

		const measurements = await dialog.evaluate((element) => {
			const footerElement = element.querySelector<HTMLElement>('[data-mobile-menu-footer]')
			const profileElement = element.querySelector<HTMLElement>('[data-mobile-menu-profile]')
			const profileLines = profileElement?.querySelectorAll<HTMLElement>('p')
			const links = element.querySelectorAll<HTMLAnchorElement>('nav a')

			if (!footerElement || !profileElement || !profileLines || links.length !== 5) {
				throw new Error('Expected the complete short-height mobile-menu composition')
			}

			const dialogRect = element.getBoundingClientRect()
			const footerRect = footerElement.getBoundingClientRect()
			const lastLinkRect = links[links.length - 1].getBoundingClientRect()

			return {
				dialog: {
					bottom: dialogRect.bottom,
					clientHeight: element.clientHeight,
					scrollHeight: element.scrollHeight,
					scrollTop: element.scrollTop,
				},
				document: {
					clientWidth: document.documentElement.clientWidth,
					scrollWidth: document.documentElement.scrollWidth,
				},
				footer: {
					bottom: footerRect.bottom,
					top: footerRect.top,
				},
				lastLinkBottom: lastLinkRect.bottom,
				profileLines: Array.from(profileLines, (line) => ({
					clientWidth: line.clientWidth,
					scrollWidth: line.scrollWidth,
				})),
			}
		})

		expect(measurements.dialog.scrollHeight).toBeGreaterThan(measurements.dialog.clientHeight)
		expect(measurements.dialog.scrollTop).toBeGreaterThan(0)
		expect(measurements.footer.top).toBeGreaterThanOrEqual(measurements.lastLinkBottom)
		expect(measurements.footer.bottom).toBeLessThanOrEqual(measurements.dialog.bottom + 1)
		expect(measurements.profileLines.every((line) => line.scrollWidth <= line.clientWidth)).toBe(
			true,
		)
		expect(measurements.document.scrollWidth).toBeLessThanOrEqual(measurements.document.clientWidth)
	})

	test('preserves semantic dark and forced-colors states inside the mobile dialog', async ({
		page,
	}) => {
		await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'dark'))
		await page.setViewportSize({ height: 844, width: 390 })
		await page.goto('/work')
		await page.getByRole('button', { name: 'Open menu' }).click()

		let dialog = page.getByRole('dialog', { name: 'Site menu' })
		const dark = await dialog.evaluate((element) => {
			const currentLink = element.querySelector<HTMLAnchorElement>('a[aria-current="page"]')
			const profile = element.querySelector('[data-mobile-menu-profile]')
			if (!currentLink || !profile) throw new Error('Expected current link and profile')

			return {
				background: getComputedStyle(element).backgroundColor,
				currentColor: getComputedStyle(currentLink).color,
				profileColor: getComputedStyle(profile).color,
			}
		})

		expect(dark).toEqual({
			background: 'rgb(8, 9, 12)',
			currentColor: 'rgb(34, 211, 238)',
			profileColor: 'rgb(154, 166, 178)',
		})

		await page.emulateMedia({ forcedColors: 'active' })
		await page.reload()
		await page.getByRole('button', { name: 'Open menu' }).click()
		dialog = page.getByRole('dialog', { name: 'Site menu' })
		const currentWork = dialog.getByRole('link', { exact: true, name: 'Work' })
		await page.keyboard.press('Tab')
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
		expect(forcedColors.focus).toMatchObject({ style: 'solid', width: '2px' })
		expect(forcedColors.focus.color).not.toBe('rgba(0, 0, 0, 0)')
		expect(forcedColors.focus.color).not.toBe(forcedColors.canvasColor)
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
