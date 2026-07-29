import { expect, test } from '@playwright/test'
import {
	expectPx,
	findVisibleDescendantOverflow,
	HOME_PARITY_VIEWPORTS,
	HOME_SELECTORS,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

const localeExpectations = [
	{
		cta: 'Read the case',
		href: '/work/energy-customer-portal',
		lang: 'en',
		path: '/',
		summaryCompact:
			'Frontend leadership for a customer-facing product and the component foundations beneath it.',
		titleCompact: 'A customer portal built as a system.',
	},
	{
		cta: 'Přečíst studii',
		href: '/cs/work/energy-customer-portal',
		lang: 'cs',
		path: '/cs',
		summaryCompact:
			'Vedení frontendového vývoje produktu pro zákazníky a komponentových základů, na kterých stojí.',
		titleCompact: 'Zákaznický portál postavený jako systém.',
	},
] as const

const compactViewports = [
	HOME_PARITY_VIEWPORTS.tablet,
	HOME_PARITY_VIEWPORTS.responsive430,
	HOME_PARITY_VIEWPORTS.mobile,
	HOME_PARITY_VIEWPORTS.responsive320,
] as const

test.describe('Home Flagship Figma contract', () => {
	test('matches the desktop summary and accessible system map at 1440px', async ({ page }) => {
		await page.setViewportSize(HOME_PARITY_VIEWPORTS.desktop)
		await prepareHomeRender(page)
		const response = await page.goto('/')
		expect(response?.status()).toBe(200)
		await waitForHomeRender(page)

		const section = page.locator(HOME_SELECTORS.flagship)
		const stack = page.locator(HOME_SELECTORS.flagshipStack)
		const map = page.locator(HOME_SELECTORS.flagshipMap)

		await expect(section).toHaveAttribute('aria-labelledby', 'flagship-case-heading')
		await expect(page.locator(HOME_SELECTORS.flagshipTitleDesktop)).toHaveText(
			'A customer portal built as a system, not a collection of screens.',
		)
		await expect(page.locator(HOME_SELECTORS.flagshipTitleCompact)).toBeHidden()
		await expect(page.locator(HOME_SELECTORS.flagshipSummaryDesktop)).toHaveText(
			'Frontend leadership for a customer-facing energy product: architecture, component foundations, delivery quality and accessibility across a growing application.',
		)
		await expect(page.locator(HOME_SELECTORS.flagshipSummaryCompact)).toBeHidden()
		await expect(stack).toHaveText('React · TypeScript · Next.js · Storybook · Playwright')
		await expect(page.locator(`${HOME_SELECTORS.flagship} h2`)).toHaveCount(1)
		await expect(map).toHaveRole('list')
		const mapItems = map.getByRole('listitem')
		await expect(mapItems).toHaveCount(2)
		await expect(mapItems.nth(0).getByText('PRODUCT UI', { exact: true })).toBeVisible()
		await expect(mapItems.nth(0).getByText('Customer journeys', { exact: true })).toBeVisible()
		await expect(page.locator('#flagship-map-bridge')).toHaveText(/^↕\s*Shared components\s*↕$/)
		await expect(page.locator('#flagship-map-bridge [aria-hidden="true"]')).toHaveCount(2)
		await expect(
			mapItems.nth(1).getByText('Accessible foundations · Tests · Delivery', { exact: true }),
		).toBeVisible()
		await expect(map).not.toHaveAttribute('aria-hidden', 'true')

		const contract = await section.evaluate((element) => {
			const headingElement = element.querySelector<HTMLElement>('#flagship-case-heading')
			const rowElement = element.querySelector<HTMLElement>('#flagship-case-summary-row')
			const contentElement = element.querySelector<HTMLElement>('#flagship-case-content')
			const summaryElement = element.querySelector<HTMLElement>('#flagship-case-summary')
			const stackElement = element.querySelector<HTMLElement>('#flagship-case-stack')
			const mapElement = element.querySelector<HTMLElement>('#flagship-system-map')
			const productLabel = element.querySelector<HTMLElement>('#flagship-map-product-label')
			const productDescription = element.querySelector<HTMLElement>(
				'#flagship-map-product-description',
			)
			const bridge = element.querySelector<HTMLElement>('#flagship-map-bridge')
			const foundations = element.querySelector<HTMLElement>('#flagship-map-foundations')
			const eyebrow = headingElement?.previousElementSibling

			if (
				!(headingElement instanceof HTMLElement) ||
				!(rowElement instanceof HTMLElement) ||
				!(contentElement instanceof HTMLElement) ||
				!(summaryElement instanceof HTMLElement) ||
				!(stackElement instanceof HTMLElement) ||
				!(mapElement instanceof HTMLElement) ||
				!(productLabel instanceof HTMLElement) ||
				!(productDescription instanceof HTMLElement) ||
				!(bridge instanceof HTMLElement) ||
				!(foundations instanceof HTMLElement) ||
				!(eyebrow instanceof HTMLElement)
			) {
				throw new Error('Expected the complete Flagship desktop composition')
			}

			const sectionStyles = getComputedStyle(element)
			const colorProbe = document.createElement('span')
			colorProbe.style.color = 'var(--action-primary)'
			element.append(colorProbe)
			const actionPrimary = getComputedStyle(colorProbe).color
			colorProbe.style.color = 'var(--action-on-primary)'
			const actionOnPrimary = getComputedStyle(colorProbe).color
			colorProbe.remove()
			const inner = headingElement.parentElement
			if (!(inner instanceof HTMLElement)) throw new Error('Expected Flagship inner container')

			const innerStyles = getComputedStyle(inner)
			const headingStyles = getComputedStyle(headingElement)
			const summaryStyles = getComputedStyle(summaryElement)
			const stackStyles = getComputedStyle(stackElement)
			const rowStyles = getComputedStyle(rowElement)
			const contentStyles = getComputedStyle(contentElement)
			const mapStyles = getComputedStyle(mapElement)

			const textContract = (target: HTMLElement) => {
				const styles = getComputedStyle(target)
				return {
					fontSize: Number.parseFloat(styles.fontSize),
					fontWeight: Number.parseInt(styles.fontWeight, 10),
					lineHeight: Number.parseFloat(styles.lineHeight),
				}
			}

			const headingBox = headingElement.getBoundingClientRect()
			const rowBox = rowElement.getBoundingClientRect()
			const contentBox = contentElement.getBoundingClientRect()
			const mapBox = mapElement.getBoundingClientRect()

			return {
				contentGap: Number.parseFloat(contentStyles.rowGap),
				contentWidth: contentBox.width,
				foundations: textContract(foundations),
				heading: textContract(headingElement),
				headingBeforeRow: headingBox.bottom < rowBox.top,
				innerGap: Number.parseFloat(innerStyles.rowGap),
				map: {
					background: mapStyles.backgroundColor,
					color: mapStyles.color,
					gap: Number.parseFloat(mapStyles.rowGap),
					paddingBottom: Number.parseFloat(mapStyles.paddingBottom),
					paddingLeft: Number.parseFloat(mapStyles.paddingLeft),
					paddingRight: Number.parseFloat(mapStyles.paddingRight),
					paddingTop: Number.parseFloat(mapStyles.paddingTop),
					radius: Number.parseFloat(mapStyles.borderTopLeftRadius),
					width: mapBox.width,
				},
				productDescription: textContract(productDescription),
				productLabel: textContract(productLabel),
				rootActionOnPrimary: actionOnPrimary,
				rootActionPrimary: actionPrimary,
				rowGap: Number.parseFloat(rowStyles.columnGap),
				rowWidth: rowBox.width,
				sectionPaddingBottom: Number.parseFloat(sectionStyles.paddingBottom),
				sectionPaddingTop: Number.parseFloat(sectionStyles.paddingTop),
				stack: textContract(stackElement),
				summary: textContract(summaryElement),
				bridge: textContract(bridge),
			}
		})

		expectPx(contract.sectionPaddingTop, 96)
		expectPx(contract.sectionPaddingBottom, 96)
		expectPx(contract.innerGap, 32)
		expect(contract.headingBeforeRow).toBe(true)
		expectPx(contract.heading.fontSize, 48)
		expectPx(contract.heading.lineHeight, 69.6, 0.15)
		expect(contract.heading.fontWeight).toBe(600)
		expectPx(contract.rowWidth, 1196)
		expectPx(contract.rowGap, 56)
		expectPx(contract.contentWidth, 580)
		expectPx(contract.contentGap, 20)
		expectPx(contract.summary.fontSize, 18)
		expectPx(contract.summary.lineHeight, 26.1, 0.15)
		expectPx(contract.stack.fontSize, 14)
		expectPx(contract.stack.lineHeight, 20.3, 0.15)
		expect(contract.stack.fontWeight).toBe(600)
		expectPx(contract.map.width, 560)
		expectPx(contract.map.paddingTop, 32)
		expectPx(contract.map.paddingRight, 32)
		expectPx(contract.map.paddingBottom, 32)
		expectPx(contract.map.paddingLeft, 32)
		expectPx(contract.map.gap, 16)
		expectPx(contract.map.radius, 8)
		expect(contract.map.background).toBe(contract.rootActionPrimary)
		expect(contract.map.color).toBe(contract.rootActionOnPrimary)
		expect(contract.productLabel).toMatchObject({ fontSize: 12, fontWeight: 600 })
		expectPx(contract.productLabel.lineHeight, 17.4, 0.15)
		expect(contract.productDescription).toMatchObject({ fontSize: 28, fontWeight: 600 })
		expectPx(contract.productDescription.lineHeight, 40.6, 0.15)
		expect(contract.bridge).toMatchObject({ fontSize: 18, fontWeight: 400 })
		expectPx(contract.bridge.lineHeight, 26.1, 0.15)
		expect(contract.foundations).toMatchObject({ fontSize: 18, fontWeight: 600 })
		expectPx(contract.foundations.lineHeight, 26.1, 0.15)
	})

	test('keeps the desktop map semantic and legible in dark mode', async ({ page }) => {
		await page.setViewportSize(HOME_PARITY_VIEWPORTS.desktop)
		await prepareHomeRender(page, 'dark')
		const response = await page.goto('/')
		expect(response?.status()).toBe(200)
		await waitForHomeRender(page, 'dark')

		const map = page.locator(HOME_SELECTORS.flagshipMap)
		await expect(map).toHaveRole('list')
		await expect(map.getByRole('listitem')).toHaveCount(2)

		const colors = await map.evaluate((element) => {
			const styles = getComputedStyle(element)
			const colorProbe = document.createElement('span')
			colorProbe.style.color = 'var(--action-primary)'
			element.append(colorProbe)
			const expectedBackground = getComputedStyle(colorProbe).color
			colorProbe.style.color = 'var(--action-on-primary)'
			const expectedColor = getComputedStyle(colorProbe).color
			colorProbe.remove()

			return {
				background: styles.backgroundColor,
				color: styles.color,
				expectedBackground,
				expectedColor,
			}
		})

		expect(colors.background).toBe(colors.expectedBackground)
		expect(colors.color).toBe(colors.expectedColor)
	})

	test('keeps the Czech desktop composition localized and contained', async ({ page }) => {
		await page.setViewportSize(HOME_PARITY_VIEWPORTS.desktop)
		await prepareHomeRender(page)
		const response = await page.goto('/cs')
		expect(response?.status()).toBe(200)
		await waitForHomeRender(page)

		await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
		await expect(page.locator(HOME_SELECTORS.flagshipTitleDesktop)).toHaveText(
			'Zákaznický portál postavený jako systém, ne jako sbírka obrazovek.',
		)
		await expect(page.locator(HOME_SELECTORS.flagshipTitleCompact)).toBeHidden()
		await expect(page.locator(HOME_SELECTORS.flagshipSummaryDesktop)).toHaveText(
			'Vedení frontend vývoje zákaznického produktu pro energetiku: architektura, komponentové základy, kvalita dodávky a přístupnost v rostoucí aplikaci.',
		)
		await expect(page.locator(HOME_SELECTORS.flagshipSummaryCompact)).toBeHidden()
		await expect(page.locator(HOME_SELECTORS.flagshipStack)).toBeVisible()
		const map = page.locator(HOME_SELECTORS.flagshipMap)
		await expect(map).toHaveRole('list')
		const mapItems = map.getByRole('listitem')
		await expect(mapItems).toHaveCount(2)
		await expect(mapItems.nth(0).getByText('PRODUKTOVÉ ROZHRANÍ', { exact: true })).toBeVisible()
		await expect(mapItems.nth(0).getByText('Zákaznické scénáře', { exact: true })).toBeVisible()
		await expect(page.locator('#flagship-map-bridge')).toHaveText(/^↕\s*Sdílené komponenty\s*↕$/)
		await expect(
			mapItems.nth(1).getByText('Přístupné základy · Testy · Dodávka', { exact: true }),
		).toBeVisible()

		const cta = page
			.locator(HOME_SELECTORS.flagship)
			.getByRole('link', { exact: true, name: 'Přečíst studii' })
		await expect(cta).toHaveAttribute('href', '/cs/work/energy-customer-portal')
		await cta.focus()
		await expect(cta).toBeFocused()
		expect(await findVisibleDescendantOverflow(page, { root: HOME_SELECTORS.flagship })).toEqual([])
	})

	for (const locale of localeExpectations) {
		for (const viewport of compactViewports) {
			test(`${locale.lang} matches the compact Flagship at ${viewport.width}px`, async ({
				page,
			}) => {
				await page.setViewportSize(viewport)
				await prepareHomeRender(page)
				const response = await page.goto(locale.path)
				expect(response?.status()).toBe(200)
				await waitForHomeRender(page)

				await expect(page.locator('html')).toHaveAttribute('lang', locale.lang)
				const section = page.locator(HOME_SELECTORS.flagship)
				const stack = page.locator(HOME_SELECTORS.flagshipStack)
				const map = page.locator(HOME_SELECTORS.flagshipMap)
				const cta = section.getByRole('link', { exact: true, name: locale.cta })

				await expect(page.locator(HOME_SELECTORS.flagshipTitleCompact)).toHaveText(
					locale.titleCompact,
				)
				await expect(page.locator(HOME_SELECTORS.flagshipTitleDesktop)).toBeHidden()
				await expect(page.locator(HOME_SELECTORS.flagshipSummaryCompact)).toHaveText(
					locale.summaryCompact,
				)
				await expect(page.locator(HOME_SELECTORS.flagshipSummaryDesktop)).toBeHidden()
				await expect(stack).toBeHidden()
				await expect(map).toBeHidden()
				await expect(cta).toHaveAttribute('href', locale.href)
				await cta.focus()
				await expect(cta).toBeFocused()

				const contract = await section.evaluate((element) => {
					const inner = element.firstElementChild
					const eyebrow =
						element.querySelector<HTMLElement>('#flagship-case-heading')?.previousElementSibling
					const heading = element.querySelector<HTMLElement>('#flagship-case-heading')
					const summary = element.querySelector<HTMLElement>('#flagship-case-summary')

					if (
						!(inner instanceof HTMLElement) ||
						!(eyebrow instanceof HTMLElement) ||
						!(heading instanceof HTMLElement) ||
						!(summary instanceof HTMLElement)
					) {
						throw new Error('Expected the compact Flagship composition')
					}

					const sectionStyles = getComputedStyle(element)
					const innerStyles = getComputedStyle(inner)
					const eyebrowStyles = getComputedStyle(eyebrow)
					const headingStyles = getComputedStyle(heading)
					const summaryStyles = getComputedStyle(summary)

					return {
						eyebrowFontSize: Number.parseFloat(eyebrowStyles.fontSize),
						eyebrowLineHeight: Number.parseFloat(eyebrowStyles.lineHeight),
						headingFontSize: Number.parseFloat(headingStyles.fontSize),
						headingFontWeight: Number.parseInt(headingStyles.fontWeight, 10),
						headingLineHeight: Number.parseFloat(headingStyles.lineHeight),
						innerGap: Number.parseFloat(innerStyles.rowGap),
						paddingBottom: Number.parseFloat(sectionStyles.paddingBottom),
						paddingTop: Number.parseFloat(sectionStyles.paddingTop),
						summaryFontSize: Number.parseFloat(summaryStyles.fontSize),
						summaryLineHeight: Number.parseFloat(summaryStyles.lineHeight),
					}
				})

				expectPx(contract.paddingTop, 64)
				expectPx(contract.paddingBottom, 64)
				expectPx(contract.innerGap, 24)
				expectPx(contract.eyebrowFontSize, 11)
				expectPx(contract.eyebrowLineHeight, 15.95, 0.15)
				expectPx(contract.headingFontSize, 32)
				expectPx(contract.headingLineHeight, 46.4, 0.15)
				expect(contract.headingFontWeight).toBe(600)
				expectPx(contract.summaryFontSize, 17)
				expectPx(contract.summaryLineHeight, 24.65, 0.15)

				expect(
					await findVisibleDescendantOverflow(page, { root: HOME_SELECTORS.flagship }),
				).toEqual([])
			})
		}
	}
})
