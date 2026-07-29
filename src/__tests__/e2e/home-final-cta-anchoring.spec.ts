import { expect, type Locator, type Page, test } from '@playwright/test'
import {
	expectPx,
	findVisibleDescendantOverflow,
	type HomeTheme,
	prepareHomeRender,
	waitForHomeRender,
} from './support/home-parity'

interface LocaleExpectation {
	path: '/' | '/cs'
	heading: string
	supporting: string
	cta: string
	href: '/contact' | '/cs/contact'
}

const locales: readonly LocaleExpectation[] = [
	{
		path: '/',
		heading: 'Looking for a senior frontend engineer who can own the system behind the interface?',
		supporting:
			'I am primarily interested in the right product and team. Selected consulting conversations are welcome.',
		cta: 'Start a conversation',
		href: '/contact',
	},
	{
		path: '/cs',
		heading:
			'Hledáte senior frontend vývojáře, který převezme odpovědnost za systém pod rozhraním?',
		supporting:
			'Nejdůležitější je pro mě správný produkt a tým. Rád proberu i vybrané možnosti konzultací.',
		cta: 'Začít konverzaci',
		href: '/cs/contact',
	},
]

interface ViewportContract {
	name: 'desktop' | 'mobile-320' | 'mobile-390' | 'responsive-430' | 'tablet'
	width: 1440 | 768 | 430 | 390 | 320
	height: number
	gutter: number
	padding: number
	gap: number
	headingFontSize: number
	headingLineHeight: number
	headingMaxWidth: number | null
	supportingVisible: boolean
	enSectionHeight: number
	/** Integer Figma text-node rounding only; the browser natural-height equation stays ±0.1px. */
	sectionHeightTolerance: number
}

const viewports: readonly ViewportContract[] = [
	{
		name: 'desktop',
		width: 1440,
		height: 900,
		gutter: 120,
		padding: 96,
		gap: 32,
		headingFontSize: 42,
		headingLineHeight: 42 * 1.45,
		headingMaxWidth: 980,
		supportingVisible: true,
		enSectionHeight: 482,
		sectionHeightTolerance: 0.5,
	},
	{
		name: 'tablet',
		width: 768,
		height: 1024,
		gutter: 48,
		padding: 64,
		gap: 24,
		headingFontSize: 30,
		headingLineHeight: 30 * 1.45,
		headingMaxWidth: null,
		supportingVisible: false,
		enSectionHeight: 292,
		sectionHeightTolerance: 1,
	},
	{
		name: 'responsive-430',
		width: 430,
		height: 932,
		gutter: 20,
		padding: 64,
		gap: 24,
		headingFontSize: 30,
		headingLineHeight: 30 * 1.45,
		headingMaxWidth: null,
		supportingVisible: false,
		enSectionHeight: 380,
		sectionHeightTolerance: 2,
	},
	{
		name: 'mobile-390',
		width: 390,
		height: 844,
		gutter: 20,
		padding: 64,
		gap: 24,
		headingFontSize: 30,
		headingLineHeight: 30 * 1.45,
		headingMaxWidth: null,
		supportingVisible: false,
		enSectionHeight: 380,
		sectionHeightTolerance: 2,
	},
	{
		name: 'mobile-320',
		width: 320,
		height: 900,
		gutter: 20,
		padding: 64,
		gap: 24,
		headingFontSize: 24,
		headingLineHeight: 24 * 1.12,
		headingMaxWidth: null,
		supportingVisible: false,
		enSectionHeight: 312,
		sectionHeightTolerance: 0.5,
	},
]

const semanticColors = {
	desktop: {
		dark: {
			background: 'rgb(12, 45, 56)',
			ctaBackground: 'rgb(34, 211, 238)',
			ctaForeground: 'rgb(8, 9, 12)',
			heading: 'rgb(255, 255, 255)',
			supporting: 'rgb(154, 166, 178)',
		},
		light: {
			background: 'rgb(241, 244, 248)',
			ctaBackground: 'rgb(10, 110, 128)',
			ctaForeground: 'rgb(255, 255, 255)',
			heading: 'rgb(8, 9, 12)',
			supporting: 'rgb(74, 89, 99)',
		},
	},
	mobile: {
		dark: {
			background: 'rgb(8, 9, 12)',
			ctaBackground: 'rgb(34, 211, 238)',
			ctaForeground: 'rgb(8, 9, 12)',
			heading: 'rgb(255, 255, 255)',
		},
		light: {
			background: 'rgb(255, 255, 255)',
			ctaBackground: 'rgb(10, 110, 128)',
			ctaForeground: 'rgb(255, 255, 255)',
			heading: 'rgb(8, 9, 12)',
		},
	},
} as const

function parseRgb(color: string): [number, number, number] {
	const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number)
	if (!channels || channels.length !== 3) throw new Error(`Expected an RGB color, received ${color}`)
	return channels as [number, number, number]
}

function contrastRatio(foreground: string, background: string): number {
	const luminance = (color: string) => {
		const channels = parseRgb(color).map((value) => {
			const normalized = value / 255
			return normalized <= 0.04045
				? normalized / 12.92
				: ((normalized + 0.055) / 1.055) ** 2.4
		})
		return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
	}

	const foregroundLuminance = luminance(foreground)
	const backgroundLuminance = luminance(background)
	return (
		(Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
		(Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
	)
}

async function gotoHome(
	page: Page,
	locale: LocaleExpectation,
	viewport: Pick<ViewportContract, 'height' | 'width'>,
	theme: HomeTheme = 'light',
) {
	await page.setViewportSize(viewport)
	await prepareHomeRender(page, theme)
	const response = await page.goto(locale.path)
	expect(response?.status()).toBe(200)
	await waitForHomeRender(page, theme)
}

function getFinalCta(page: Page, locale: LocaleExpectation) {
	const section = page.locator('#contact-cta')
	return {
		cta: page.locator('#final-cta-action'),
		heading: page.locator('#final-cta-heading'),
		inner: page.locator('#final-cta-inner'),
		section,
		supporting: page.locator('#final-cta-supporting'),
		visibleCta: section.getByRole('link', { exact: true, name: locale.cta }),
		visibleHeading: section.getByRole('heading', { exact: true, level: 2, name: locale.heading }),
	}
}

interface FinalCtaLocators {
	cta: Locator
	heading: Locator
	inner: Locator
	section: Locator
	supporting: Locator
}

async function readContract(elements: FinalCtaLocators) {
	const [section, inner, heading, supporting, cta] = await Promise.all([
		elements.section.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			return {
				background: styles.backgroundColor,
				bodyClientWidth: document.body.clientWidth,
				bottom: rect.bottom,
				documentClientWidth: document.documentElement.clientWidth,
				documentScrollWidth: document.documentElement.scrollWidth,
				height: rect.height,
				paddingBlockEnd: Number.parseFloat(styles.paddingBlockEnd),
				paddingBlockStart: Number.parseFloat(styles.paddingBlockStart),
				right: rect.right,
				width: rect.width,
				x: rect.x,
			}
		}),
		elements.inner.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			return {
				rowGap: Number.parseFloat(styles.rowGap),
				right: rect.right,
				width: rect.width,
				x: rect.x,
			}
		}),
		elements.heading.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			return {
				bottom: rect.bottom,
				color: styles.color,
				fontSize: Number.parseFloat(styles.fontSize),
				fontWeight: Number.parseFloat(styles.fontWeight),
				height: rect.height,
				lineHeight: Number.parseFloat(styles.lineHeight),
				top: rect.top,
				width: rect.width,
				x: rect.x,
			}
		}),
		elements.supporting.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			return {
				bottom: rect.bottom,
				color: styles.color,
				display: styles.display,
				fontSize: Number.parseFloat(styles.fontSize),
				fontWeight: Number.parseFloat(styles.fontWeight),
				height: rect.height,
				lineHeight: Number.parseFloat(styles.lineHeight),
				top: rect.top,
				width: rect.width,
				x: rect.x,
			}
		}),
		elements.cta.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			const textRects: DOMRect[] = []
			const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
			for (let node = walker.nextNode(); node; node = walker.nextNode()) {
				if (!node.textContent?.trim()) continue
				const range = document.createRange()
				range.selectNodeContents(node)
				textRects.push(...Array.from(range.getClientRects()))
			}
			const textLeft = Math.min(...textRects.map((textRect) => textRect.left))
			const textRight = Math.max(...textRects.map((textRect) => textRect.right))

			return {
				background: styles.backgroundColor,
				borderInlineEndWidth: Number.parseFloat(styles.borderInlineEndWidth),
				borderInlineStartWidth: Number.parseFloat(styles.borderInlineStartWidth),
				bottom: rect.bottom,
				clientHeight: element.clientHeight,
				clientWidth: element.clientWidth,
				color: styles.color,
				fontSize: Number.parseFloat(styles.fontSize),
				fontWeight: Number.parseFloat(styles.fontWeight),
				height: rect.height,
				lineHeight: Number.parseFloat(styles.lineHeight),
				minWidth: Number.parseFloat(styles.minWidth),
				paddingInlineEnd: Number.parseFloat(styles.paddingInlineEnd),
				paddingInlineStart: Number.parseFloat(styles.paddingInlineStart),
				radius: Number.parseFloat(styles.borderTopLeftRadius),
				right: rect.right,
				scrollHeight: element.scrollHeight,
				scrollWidth: element.scrollWidth,
				textLeft,
				textLineCount: new Set(
					textRects.map((textRect) => Math.round(textRect.top * 100) / 100),
				).size,
				textRight,
				textWidth: textRight - textLeft,
				top: rect.top,
				width: rect.width,
				x: rect.x,
			}
		}),
	])

	return { cta, heading, inner, section, supporting }
}

for (const locale of locales) {
	test.describe(`Final CTA responsive contract at ${locale.path}`, () => {
		for (const viewport of viewports) {
			test(`matches ${viewport.name} at ${viewport.width}px`, async ({ page }) => {
				await gotoHome(page, locale, viewport)
				const elements = getFinalCta(page, locale)

				await expect(elements.inner).toHaveCount(1, { timeout: 1_000 })
				await expect(elements.cta).toHaveCount(1, { timeout: 1_000 })
				await expect(elements.supporting).toHaveCount(1, { timeout: 1_000 })
				await expect(elements.section).toHaveAttribute('aria-labelledby', 'final-cta-heading')
				await expect(elements.visibleHeading).toHaveCount(1)
				await expect(elements.visibleCta).toHaveAttribute('href', locale.href)

				const contract = await readContract(elements)
				expectPx(contract.section.x, 0)
				expectPx(contract.section.width, contract.section.bodyClientWidth)
				expectPx(contract.inner.x - contract.section.x, viewport.gutter)
				expectPx(contract.section.right - contract.inner.right, viewport.gutter)
				expectPx(contract.inner.width, contract.section.width - 2 * viewport.gutter)
				expect([0, 15]).toContain(
					contract.section.documentClientWidth - contract.section.bodyClientWidth,
				)
				expect(contract.section.documentScrollWidth).toBeLessThanOrEqual(
					contract.section.documentClientWidth,
				)
				expectPx(contract.section.paddingBlockStart, viewport.padding)
				expectPx(contract.section.paddingBlockEnd, viewport.padding)
				expectPx(contract.inner.rowGap, viewport.gap)

				expectPx(contract.heading.x, contract.inner.x)
				expectPx(contract.heading.width, viewport.headingMaxWidth ?? contract.inner.width)
				expectPx(contract.heading.fontSize, viewport.headingFontSize)
				expectPx(contract.heading.lineHeight, viewport.headingLineHeight, 0.1)
				expect(contract.heading.fontWeight).toBe(600)

				if (viewport.supportingVisible) {
					await expect(elements.supporting).toBeVisible()
					expectPx(contract.supporting.x, contract.inner.x)
					expectPx(contract.supporting.width, 820)
					expectPx(contract.supporting.fontSize, 18)
					expectPx(contract.supporting.lineHeight, 18 * 1.45, 0.1)
					expect(contract.supporting.fontWeight).toBe(400)
				} else {
					await expect(elements.supporting).toBeHidden()
					expect(contract.supporting.display).toBe('none')
					expectPx(contract.supporting.height, 0)
				}

				expectPx(contract.cta.x, contract.inner.x)
				expectPx(contract.cta.height, 52)
				expectPx(contract.cta.radius, 4)
				expectPx(contract.cta.fontSize, 16)
				expectPx(contract.cta.lineHeight, 24)
				expect(contract.cta.fontWeight).toBe(500)
				expectPx(contract.cta.minWidth, 112)
				expectPx(contract.cta.paddingInlineStart, 20)
				expectPx(contract.cta.paddingInlineEnd, 20)
				expect(contract.cta.textLineCount).toBe(1)
				expectPx(
					contract.cta.width,
					contract.cta.textWidth +
						contract.cta.paddingInlineStart +
						contract.cta.paddingInlineEnd +
						contract.cta.borderInlineStartWidth +
						contract.cta.borderInlineEndWidth,
				)
				expect(contract.cta.width).toBeLessThan(contract.inner.width)
				expect(contract.cta.right).toBeLessThanOrEqual(contract.section.bodyClientWidth)
				expect(contract.cta.scrollWidth).toBeLessThanOrEqual(contract.cta.clientWidth)
				expect(contract.cta.scrollHeight).toBeLessThanOrEqual(contract.cta.clientHeight)

				const visibleContentHeight = viewport.supportingVisible
					? contract.heading.height +
						viewport.gap +
						contract.supporting.height +
						viewport.gap +
						contract.cta.height
					: contract.heading.height + viewport.gap + contract.cta.height
				const naturalSectionHeight =
					contract.section.paddingBlockStart +
					visibleContentHeight +
					contract.section.paddingBlockEnd
				expectPx(contract.section.height, naturalSectionHeight, 0.1)
				expectPx(
					contract.cta.bottom + contract.section.paddingBlockEnd,
					contract.section.bottom,
					0.1,
				)
				if (locale.path === '/') {
					expectPx(
						contract.section.height,
						viewport.enSectionHeight,
						viewport.sectionHeightTolerance,
					)
				}

				expect(await findVisibleDescendantOverflow(page, { root: '#contact-cta' })).toEqual([])
				await elements.visibleCta.focus()
				await expect(elements.visibleCta).toBeFocused()
			})
		}
	})
}

for (const boundary of [
	{ fontSize: 24, lineHeight: 24 * 1.12, name: 'small compact end', width: 359 },
	{ fontSize: 30, lineHeight: 30 * 1.45, name: 'normal compact start', width: 360 },
] as const) {
	test(`uses the ${boundary.name} contract at ${boundary.width}px`, async ({ page }) => {
		await gotoHome(page, locales[0], { height: 900, width: boundary.width })
		const elements = getFinalCta(page, locales[0])
		await expect(elements.visibleHeading).toHaveCount(1)
		const contract = await readContract(elements)

		expectPx(contract.heading.fontSize, boundary.fontSize)
		expectPx(contract.heading.lineHeight, boundary.lineHeight, 0.1)
		expectPx(contract.section.paddingBlockStart, 64)
		expectPx(contract.section.paddingBlockEnd, 64)
		expectPx(contract.inner.rowGap, 24)
		expect(contract.supporting.display).toBe('none')
		expect(contract.section.background).toBe('rgb(255, 255, 255)')
	})
}

for (const boundary of [
	{
		background: 'rgb(255, 255, 255)',
		fontSize: 30,
		gap: 24,
		lineHeight: 30 * 1.45,
		name: 'compact end',
		padding: 64,
		supportingVisible: false,
		width: 1023,
	},
	{
		background: 'rgb(241, 244, 248)',
		fontSize: 42,
		gap: 32,
		lineHeight: 42 * 1.45,
		name: 'desktop start',
		padding: 96,
		supportingVisible: true,
		width: 1024,
	},
] as const) {
	test(`switches the full Final CTA contract at the ${boundary.name} (${boundary.width}px)`, async ({
		page,
	}) => {
		await gotoHome(page, locales[0], { height: 900, width: boundary.width })
		const elements = getFinalCta(page, locales[0])
		await expect(elements.visibleHeading).toHaveCount(1)
		const contract = await readContract(elements)

		expectPx(contract.heading.fontSize, boundary.fontSize)
		expectPx(contract.heading.lineHeight, boundary.lineHeight, 0.1)
		expectPx(contract.section.paddingBlockStart, boundary.padding)
		expectPx(contract.section.paddingBlockEnd, boundary.padding)
		expectPx(contract.inner.rowGap, boundary.gap)
		expect(contract.section.background).toBe(boundary.background)
		if (boundary.supportingVisible) {
			await expect(elements.supporting).toBeVisible()
			expect(contract.supporting.display).not.toBe('none')
		} else {
			await expect(elements.supporting).toBeHidden()
			expect(contract.supporting.display).toBe('none')
		}
	})
}

for (const sample of [
	{ family: 'desktop', height: 900, width: 1440 },
	{ family: 'mobile', height: 844, width: 390 },
] as const) {
	for (const theme of ['light', 'dark'] as const) {
		test(`uses exact ${theme} semantic colors for ${sample.family}`, async ({ page }) => {
			await gotoHome(page, locales[0], sample, theme)
			const elements = getFinalCta(page, locales[0])
			const contract = await readContract(elements)
			const expected = semanticColors[sample.family][theme]

			expect(contract.section.background).toBe(expected.background)
			expect(contract.heading.color).toBe(expected.heading)
			expect(contract.cta.background).toBe(expected.ctaBackground)
			expect(contract.cta.color).toBe(expected.ctaForeground)
			expect(
				contrastRatio(contract.heading.color, contract.section.background),
			).toBeGreaterThanOrEqual(4.5)
			expect(contrastRatio(contract.cta.color, contract.cta.background)).toBeGreaterThanOrEqual(4.5)

			if (sample.family === 'desktop') {
				expect(contract.supporting.color).toBe(semanticColors.desktop[theme].supporting)
				expect(
					contrastRatio(contract.supporting.color, contract.section.background),
				).toBeGreaterThanOrEqual(4.5)
			}

			await elements.cta.focus()
			await expect(elements.cta).toBeFocused()
			const focus = await elements.cta.evaluate((element) => {
				const styles = getComputedStyle(element)
				return {
					color: styles.outlineColor,
					offset: Number.parseFloat(styles.outlineOffset),
					style: styles.outlineStyle,
					width: Number.parseFloat(styles.outlineWidth),
				}
			})
			expect(focus.style).toBe('solid')
			expectPx(focus.width, 2)
			expectPx(focus.offset, 2)
			expect(contrastRatio(focus.color, contract.section.background)).toBeGreaterThanOrEqual(3)
		})
	}
}

test('keeps the Final CTA focus visible in forced-colors mode', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active', reducedMotion: 'reduce' })
	await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'light'))
	await page.setViewportSize({ height: 900, width: 1440 })
	const response = await page.goto('/')
	expect(response?.status()).toBe(200)
	await waitForHomeRender(page, 'light')

	const cta = page.getByRole('link', { exact: true, name: locales[0].cta })
	await cta.focus()
	await expect(cta).toBeFocused()
	const forcedColors = await cta.evaluate((element) => {
		const styles = getComputedStyle(element)
		const section = element.closest('#contact-cta')
		if (!(section instanceof HTMLElement)) throw new Error('Expected the Final CTA section')
		return {
			background: getComputedStyle(section).backgroundColor,
			outlineColor: styles.outlineColor,
			outlineOffset: Number.parseFloat(styles.outlineOffset),
			outlineStyle: styles.outlineStyle,
			outlineWidth: Number.parseFloat(styles.outlineWidth),
		}
	})

	expect(forcedColors.outlineStyle).toBe('solid')
	expectPx(forcedColors.outlineWidth, 2)
	expectPx(forcedColors.outlineOffset, 2)
	expect(contrastRatio(forcedColors.outlineColor, forcedColors.background)).toBeGreaterThanOrEqual(3)
})
