import { expect, type Locator, test } from '@playwright/test'

import {
	expectPx,
	findVisibleDescendantOverflow,
	HOME_PARITY_VIEWPORTS,
	HOME_SELECTORS,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

const desktopExperience =
	'More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, internal enterprise applications and the component libraries underneath them.'
const desktopQuality =
	'Architecture, accessibility and long-term maintainability are part of the delivery, not follow-up work.'
const compactExperience =
	'More than ten years in web development, currently in a lead frontend role. I work with React, TypeScript and Next.js across customer portals, enterprise applications and component systems.'
const compactQuality = 'Architecture, accessibility and maintainability are part of the delivery.'
const czechDesktopExperience =
	'Webům se věnuji přes deset let a dnes působím jako vedoucí frontend vývoje. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, interních podnikových aplikacích i komponentových knihovnách, na kterých stojí.'
const czechDesktopQuality =
	'Architektura, přístupnost a dlouhodobá udržitelnost jsou součástí dodávky, ne práce odložená na později.'
const czechCompactExperience =
	'Webům se věnuji přes deset let a nyní působím ve vedoucí frontendové roli. S Reactem, TypeScriptem a Next.js pracuji na zákaznických portálech, podnikových aplikacích a komponentových systémech.'
const czechCompactQuality = 'Architektura, přístupnost a udržovatelnost jsou součástí dodávky.'

async function expectResponsiveCopyVisibility(
	hero: Locator,
	active: readonly [experience: string, quality: string],
	inactive: readonly [experience: string, quality: string],
): Promise<void> {
	for (const text of active) {
		const copy = hero.getByText(text, { exact: true })
		await expect(copy).toHaveCount(1)
		await expect(copy).toBeVisible()
	}

	for (const text of inactive) {
		const copy = hero.getByText(text, { exact: true })
		await expect(copy).toHaveCount(1)
		await expect(copy).toBeHidden()
	}
}

const viewports = [
	{
		bodySize: 18,
		compact: false,
		eyebrowSize: 12,
		firstContentY: 176,
		headerHeight: 72,
		gap: 32,
		headlineLineHeight: 92.8,
		headlineHeight: 186,
		headlineSize: 64,
		height: HOME_PARITY_VIEWPORTS.desktop.height,
		heroHeight: 729,
		node: HOME_PARITY_VIEWPORTS.desktop.figmaNode,
		paddingBottom: 112,
		paragraphWidth: 780,
		width: HOME_PARITY_VIEWPORTS.desktop.width,
		x: 120,
	},
	{
		bodySize: 17,
		compact: true,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 58,
		headlineHeight: 116,
		headlineSize: 40,
		height: HOME_PARITY_VIEWPORTS.tablet.height,
		heroHeight: 576,
		node: HOME_PARITY_VIEWPORTS.tablet.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.tablet.width,
		x: 48,
	},
	{
		bodySize: 17,
		compact: true,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 58,
		headlineHeight: 232,
		headlineSize: 40,
		height: HOME_PARITY_VIEWPORTS.responsive430.height,
		heroHeight: 767,
		node: HOME_PARITY_VIEWPORTS.responsive430.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.responsive430.width,
		x: 20,
	},
	{
		bodySize: 17,
		compact: true,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 58,
		headlineHeight: 232,
		headlineSize: 40,
		height: HOME_PARITY_VIEWPORTS.mobile.height,
		heroHeight: 767,
		node: HOME_PARITY_VIEWPORTS.mobile.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.mobile.width,
		x: 20,
	},
	{
		bodySize: 17,
		compact: true,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 40.32,
		headlineHeight: 160,
		headlineSize: 36,
		height: HOME_PARITY_VIEWPORTS.responsive320.height,
		heroHeight: 770,
		node: HOME_PARITY_VIEWPORTS.responsive320.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.responsive320.width,
		x: 20,
	},
] as const

test.describe('Home Hero Figma contract', () => {
	for (const viewport of viewports) {
		test(`matches ${viewport.node} in English at ${viewport.width}px`, async ({ page }) => {
			await page.setViewportSize(viewport)
			await prepareHomeRender(page)
			const response = await page.goto('/')
			expect(response?.status()).toBe(200)
			await waitForHomeRender(page)

			const hero = page.locator(HOME_SELECTORS.hero)
			await expect(hero).toBeVisible()
			await expectResponsiveCopyVisibility(
				hero,
				viewport.compact
					? [compactExperience, compactQuality]
					: [desktopExperience, desktopQuality],
				viewport.compact
					? [desktopExperience, desktopQuality]
					: [compactExperience, compactQuality],
			)

			const contract = await hero.evaluate((element) => {
				const inner = element.firstElementChild
				const children = inner ? Array.from(inner.children) : []
				const [eyebrow, headline, experience, quality, actions] = children
				if (
					!(inner instanceof HTMLElement) ||
					children.length !== 5 ||
					!(eyebrow instanceof HTMLElement) ||
					!(headline instanceof HTMLElement) ||
					!(experience instanceof HTMLElement) ||
					!(quality instanceof HTMLElement) ||
					!(actions instanceof HTMLElement)
				) {
					throw new Error('Expected the complete five-part Hero structure')
				}

				const actionLinks = Array.from(actions.children)
				const rootStyles = getComputedStyle(document.documentElement)
				const colorProbe = document.createElement('span')
				colorProbe.style.color = 'var(--action-primary)'
				document.body.append(colorProbe)
				const actionPrimary = getComputedStyle(colorProbe).color
				colorProbe.remove()

				const rects = children.map((child) => child.getBoundingClientRect().toJSON())
				const styles = {
					actions: getComputedStyle(actions),
					body: getComputedStyle(experience),
					eyebrow: getComputedStyle(eyebrow),
					headline: getComputedStyle(headline),
					inner: getComputedStyle(inner),
				}

				return {
					actionDirection: styles.actions.flexDirection,
					actionGap: Number.parseFloat(
						styles.actions.flexDirection === 'row'
							? styles.actions.columnGap
							: styles.actions.rowGap,
					),
					actionPrimary,
					actions: actionLinks.map((link) => link.getBoundingClientRect().toJSON()),
					bodyLineHeight: Number.parseFloat(styles.body.lineHeight),
					bodySize: Number.parseFloat(styles.body.fontSize),
					bodyWeight: styles.body.fontWeight,
					children: rects,
					documentClientWidth: document.documentElement.clientWidth,
					documentScrollWidth: document.documentElement.scrollWidth,
					eyebrowColor: styles.eyebrow.color,
					eyebrowLineHeight: Number.parseFloat(styles.eyebrow.lineHeight),
					eyebrowSize: Number.parseFloat(styles.eyebrow.fontSize),
					eyebrowWeight: styles.eyebrow.fontWeight,
					headlineLineHeight: Number.parseFloat(styles.headline.lineHeight),
					headlineSize: Number.parseFloat(styles.headline.fontSize),
					headlineWeight: styles.headline.fontWeight,
					hero: element.getBoundingClientRect().toJSON(),
					inner: inner.getBoundingClientRect().toJSON(),
					innerGap: Number.parseFloat(styles.inner.rowGap),
					rootActionPrimary: rootStyles.getPropertyValue('--action-primary').trim(),
				}
			})

			const contentWidth = contract.hero.width - 2 * viewport.x
			expectPx(contract.inner.x, viewport.x)
			expectPx(contract.inner.width, contentWidth)
			expectPx(contract.children[0].y, viewport.firstContentY)
			expectPx(contract.innerGap, viewport.gap)
			expectPx(contract.hero.bottom - contract.children[4].bottom, viewport.paddingBottom)
			expectPx(contract.children[0].width, viewport.width === 1440 ? 600 : contentWidth)
			expectPx(contract.children[1].width, viewport.width === 1440 ? 1000 : contentWidth)
			for (const paragraph of contract.children.slice(2, 4)) {
				expectPx(paragraph.width, viewport.paragraphWidth ?? contentWidth)
			}

			for (let index = 1; index < contract.children.length; index += 1) {
				expectPx(contract.children[index].top - contract.children[index - 1].bottom, viewport.gap)
			}

			expectPx(contract.eyebrowSize, viewport.eyebrowSize)
			expectPx(contract.eyebrowLineHeight, viewport.eyebrowSize * 1.45, 0.1)
			expect(contract.eyebrowWeight).toBe('600')
			expect(contract.eyebrowColor).toBe(contract.actionPrimary)
			expect(contract.rootActionPrimary).not.toBe('')
			expectPx(contract.headlineSize, viewport.headlineSize)
			expectPx(contract.headlineLineHeight, viewport.headlineLineHeight, 0.1)
			// Figma places the Hero after the in-flow header. The website header is fixed,
			// so the browser Hero includes an equivalent header-height offset in its
			// top padding. Normalize that deliberate topology difference before comparing
			// the section height from the approved frame.
			expectPx(contract.children[1].height, viewport.headlineHeight, 1.5)
			expectPx(contract.hero.height - viewport.headerHeight, viewport.heroHeight, 3)
			expect(contract.headlineWeight).toBe('600')
			expectPx(contract.bodySize, viewport.bodySize)
			expectPx(contract.bodyLineHeight, viewport.bodySize * 1.45, 0.1)
			expect(contract.bodyWeight).toBe('400')
			expect(contract.actionDirection).toBe(viewport.compact ? 'column' : 'row')
			expectPx(contract.actionGap, viewport.compact ? 24 : 16)
			expect(contract.documentScrollWidth).toBeLessThanOrEqual(contract.documentClientWidth)
			for (const action of contract.actions) {
				expect(action.right).toBeLessThanOrEqual(contract.hero.right)
			}
		})
	}

	for (const viewport of viewports) {
		test(`keeps Czech content contained at ${viewport.width}px`, async ({ page }) => {
			await page.setViewportSize(viewport)
			await prepareHomeRender(page)
			const response = await page.goto('/cs')
			expect(response?.status()).toBe(200)
			await waitForHomeRender(page)
			await expect(page.locator('html')).toHaveAttribute('lang', 'cs')

			const hero = page.locator(HOME_SELECTORS.hero)
			await expect(hero).toBeVisible()
			await expectResponsiveCopyVisibility(
				hero,
				viewport.compact
					? [czechCompactExperience, czechCompactQuality]
					: [czechDesktopExperience, czechDesktopQuality],
				viewport.compact
					? [czechDesktopExperience, czechDesktopQuality]
					: [czechCompactExperience, czechCompactQuality],
			)
			const overflow = await findVisibleDescendantOverflow(page, { root: HOME_SELECTORS.hero })
			expect(overflow).toEqual([])

			const geometry = await hero.evaluate((element) => {
				const inner = element.firstElementChild
				if (!(inner instanceof HTMLElement)) throw new Error('Expected Hero inner container')
				const children = Array.from(inner.children, (child) =>
					child.getBoundingClientRect().toJSON(),
				)
				const links = Array.from(inner.querySelectorAll(':scope > div > a'), (link) =>
					link.getBoundingClientRect().toJSON(),
				)
				return {
					children,
					hero: element.getBoundingClientRect().toJSON(),
					links,
				}
			})

			for (let index = 1; index < geometry.children.length; index += 1) {
				expect(geometry.children[index].top).toBeGreaterThanOrEqual(
					geometry.children[index - 1].bottom,
				)
			}
			for (const child of geometry.children) {
				expect(child.left).toBeGreaterThanOrEqual(geometry.hero.left)
				expect(child.right).toBeLessThanOrEqual(geometry.hero.right)
			}
			for (const link of geometry.links) {
				expect(link.left).toBeGreaterThanOrEqual(geometry.hero.left)
				expect(link.right).toBeLessThanOrEqual(geometry.hero.right)
			}
		})
	}
})
