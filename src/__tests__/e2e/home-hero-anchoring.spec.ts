import { expect, type Locator, test } from '@playwright/test'

import {
	expectLineWrapGrowth,
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
const availabilityLine =
	'Open to senior and lead frontend roles in Prague or remote (EU), employee or contract.'
const RESERVED_SCROLLBAR_GUTTER = 15

/**
 * The availability line (HP-03) uses the body tier: 16px / 24px at every width. It has no
 * Figma frame, so its contribution to the Hero height is derived, not measured: one
 * inner-gap plus `availabilityLines` line boxes. The line counts below were measured in the
 * pinned container for the 86-character English sentence (HP-03, employer removed on
 * 2026-09-13) on the content measure (780px at 1440, otherwise the content width).
 */
const AVAILABILITY_LINE_HEIGHT = 24

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

/*
 * `heroHeight` per viewport = the pre-COD-79 measured Hero (two 52px buttons; git show
 * 52746d2^) + the identity-eyebrow growth this branch added (+16 at 320px only) + the
 * availability paragraph (gap + availabilityLines x 24), measured in the pinned container.
 *   1440: 729 + 32 + 1 x 24 = 785
 *    768: 576 + 24 + 2 x 24 = 648
 *    430: 767 + 24 + 2 x 24 = 839
 *    390: 767 + 24 + 3 x 24 = 863
 *    320: 770 + 16 + 24 + 3 x 24 = 882
 */
const viewports = [
	{
		availabilityLines: 1,
		bodySize: 18,
		compact: false,
		eyebrowLines: 1,
		eyebrowSize: 12,
		firstContentY: 176,
		headerHeight: 72,
		gap: 32,
		headlineLineHeight: 92.8,
		headlineHeight: 186,
		headlineSize: 64,
		height: HOME_PARITY_VIEWPORTS.desktop.height,
		heroHeight: 785,
		node: HOME_PARITY_VIEWPORTS.desktop.figmaNode,
		paddingBottom: 112,
		paragraphWidth: 780,
		width: HOME_PARITY_VIEWPORTS.desktop.width,
		x: 120,
	},
	{
		availabilityLines: 2,
		bodySize: 17,
		compact: true,
		eyebrowLines: 1,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 58,
		headlineHeight: 116,
		headlineSize: 40,
		height: HOME_PARITY_VIEWPORTS.tablet.height,
		heroHeight: 648,
		node: HOME_PARITY_VIEWPORTS.tablet.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.tablet.width,
		x: 48,
	},
	{
		availabilityLines: 2,
		bodySize: 17,
		compact: true,
		eyebrowLines: 1,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 58,
		headlineHeight: 232,
		headlineSize: 40,
		height: HOME_PARITY_VIEWPORTS.responsive430.height,
		heroHeight: 839,
		node: HOME_PARITY_VIEWPORTS.responsive430.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.responsive430.width,
		x: 20,
	},
	{
		availabilityLines: 3,
		bodySize: 17,
		compact: true,
		eyebrowLines: 1,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 58,
		headlineHeight: 232,
		headlineSize: 40,
		height: HOME_PARITY_VIEWPORTS.mobile.height,
		heroHeight: 863,
		node: HOME_PARITY_VIEWPORTS.mobile.figmaNode,
		paddingBottom: 64,
		paragraphWidth: null,
		width: HOME_PARITY_VIEWPORTS.mobile.width,
		x: 20,
	},
	{
		availabilityLines: 3,
		bodySize: 17,
		compact: true,
		eyebrowLines: 2,
		eyebrowSize: 11,
		firstContentY: 120,
		headerHeight: 64,
		gap: 24,
		headlineLineHeight: 40.32,
		headlineHeight: 160,
		headlineSize: 36,
		height: HOME_PARITY_VIEWPORTS.responsive320.height,
		heroHeight: 882,
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
			await expect(hero.getByText(availabilityLine, { exact: true })).toBeVisible()

			const contract = await hero.evaluate((element) => {
				const inner = element.firstElementChild
				const children = inner ? Array.from(inner.children) : []
				const [eyebrow, headline, experience, quality, actions, availability] = children
				if (
					!(inner instanceof HTMLElement) ||
					children.length !== 6 ||
					!(eyebrow instanceof HTMLElement) ||
					!(headline instanceof HTMLElement) ||
					!(experience instanceof HTMLElement) ||
					!(quality instanceof HTMLElement) ||
					!(actions instanceof HTMLElement) ||
					!(availability instanceof HTMLParagraphElement)
				) {
					throw new Error('Expected the complete six-part Hero structure')
				}

				const actionLinks = Array.from(actions.children)
				const rootStyles = getComputedStyle(document.documentElement)
				const probeColor = (token: string) => {
					const probe = document.createElement('span')
					probe.style.color = `var(${token})`
					document.body.append(probe)
					const color = getComputedStyle(probe).color
					probe.remove()
					return color
				}
				const actionPrimary = probeColor('--action-primary')
				const textSecondary = probeColor('--text-secondary')

				const rects = children.map((child) => child.getBoundingClientRect().toJSON())
				const styles = {
					actions: getComputedStyle(actions),
					availability: getComputedStyle(availability),
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
					availabilityColor: styles.availability.color,
					availabilityLineHeight: Number.parseFloat(styles.availability.lineHeight),
					availabilityLinks: availability.querySelectorAll('a, button').length,
					availabilitySize: Number.parseFloat(styles.availability.fontSize),
					availabilityWeight: styles.availability.fontWeight,
					bodyLineHeight: Number.parseFloat(styles.body.lineHeight),
					bodySize: Number.parseFloat(styles.body.fontSize),
					bodyWeight: styles.body.fontWeight,
					bodyClientWidth: document.body.clientWidth,
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
					textSecondary,
					windowInnerWidth: window.innerWidth,
				}
			})
			const reservedScrollbarGutter = contract.documentClientWidth - contract.bodyClientWidth
			test.info().annotations.push({
				type: 'browser-topology',
				description: `viewport=${viewport.width};window-inner=${contract.windowInnerWidth};document-client=${contract.documentClientWidth};body-client=${contract.bodyClientWidth};reserved-scrollbar-gutter=${reservedScrollbarGutter}`,
			})
			expect(contract.windowInnerWidth).toBe(viewport.width)
			expect(contract.documentClientWidth).toBe(viewport.width)
			expect([0, RESERVED_SCROLLBAR_GUTTER]).toContain(reservedScrollbarGutter)

			const contentWidth = contract.hero.width - 2 * viewport.x
			expectPx(contract.inner.x, viewport.x)
			expectPx(contract.inner.width, contentWidth)
			expectPx(contract.children[0].y, viewport.firstContentY)
			expectPx(contract.innerGap, viewport.gap)
			expectPx(contract.hero.bottom - contract.children[5].bottom, viewport.paddingBottom)
			expectPx(contract.children[0].width, viewport.width === 1440 ? 600 : contentWidth)
			expectPx(contract.children[1].width, viewport.width === 1440 ? 1000 : contentWidth)
			for (const paragraph of contract.children.slice(2, 4)) {
				expectPx(paragraph.width, viewport.paragraphWidth ?? contentWidth)
			}
			// The availability line shares the paragraphs' measure (HP-03).
			expectPx(contract.children[5].width, viewport.paragraphWidth ?? contentWidth)

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
			const normalizedHeroHeight = contract.hero.height - viewport.headerHeight
			// The identity eyebrow ("KAREL KUTCHAN / ROLE / CITY") is one line at every
			// approved width except 320px, where Figma 8:146 wraps it onto two.
			const eyebrowLines = Math.round(contract.children[0].height / contract.eyebrowLineHeight)
			// The availability paragraph has no frame; its line count is the derived
			// assumption stated at the top of the file.
			const availabilityLines = Math.round(
				contract.children[5].height / contract.availabilityLineHeight,
			)
			if (reservedScrollbarGutter === RESERVED_SCROLLBAR_GUTTER) {
				// A reserved gutter narrows the content box, so the body copy and the
				// availability line can rewrap and the eyebrow can gain a line. The headline
				// is pinned by its own height assertion above. Any extra eyebrow line is
				// measured directly and removed before the remaining growth has to be whole
				// body or availability line boxes.
				expect(eyebrowLines).toBeGreaterThanOrEqual(viewport.eyebrowLines)
				const eyebrowGrowth = (eyebrowLines - viewport.eyebrowLines) * contract.eyebrowLineHeight
				expectLineWrapGrowth(
					normalizedHeroHeight - viewport.heroHeight - eyebrowGrowth,
					[contract.availabilityLineHeight, contract.bodyLineHeight],
					// Same budget as the exact comparison in the branch below.
					{ tolerance: 3 },
				)
			} else {
				expect(eyebrowLines).toBe(viewport.eyebrowLines)
				expect(availabilityLines).toBe(viewport.availabilityLines)
				expectPx(normalizedHeroHeight, viewport.heroHeight, 3)
			}
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

			// Hero actions (Figma 6:16, 7:382, 8:92): two 52px buttons, the flagship case
			// first and the intro-call booking second (HP-02). Desktop puts them 16px apart
			// on one row; compact widths stack them 24px apart, left-aligned.
			expect(contract.actions).toHaveLength(2)
			const [primaryAction, secondaryAction] = contract.actions
			expectPx(primaryAction.height, 52)
			expectPx(secondaryAction.height, 52)
			if (viewport.compact) {
				expectPx(secondaryAction.x, primaryAction.x)
				expectPx(secondaryAction.top - primaryAction.bottom, 24)
			} else {
				expectPx(secondaryAction.left - primaryAction.right, 16)
				expectPx(secondaryAction.top, primaryAction.top)
			}

			// Availability line (HP-03): body tier, secondary text colour, plain text.
			expectPx(contract.availabilitySize, 16)
			expectPx(contract.availabilityLineHeight, AVAILABILITY_LINE_HEIGHT)
			expect(contract.availabilityWeight).toBe('400')
			expect(contract.availabilityColor).toBe(contract.textSecondary)
			expect(contract.availabilityLinks).toBe(0)
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

			expect(geometry.children).toHaveLength(6)
			expect(geometry.links).toHaveLength(2)
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
