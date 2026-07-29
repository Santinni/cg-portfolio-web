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
	eyebrow: string
	heading: string
	description: string
	cta: string
	href: '/experience' | '/cs/experience'
}

const locales: readonly LocaleExpectation[] = [
	{
		path: '/',
		eyebrow: 'EXPERIENCE',
		heading: 'From implementation to frontend leadership.',
		description:
			'Web development since 2014. Today I lead frontend work across architecture, component systems, accessibility, testing and code review.',
		cta: 'View full experience',
		href: '/experience',
	},
	{
		path: '/cs',
		eyebrow: 'ZKUŠENOSTI',
		heading: 'Od implementace k vedení frontend vývoje.',
		description:
			'Webovému vývoji se věnuji od roku 2014. Dnes vedu frontendovou práci v oblasti architektury, komponentových systémů, přístupnosti, testování a code review.',
		cta: 'Zobrazit všechny zkušenosti',
		href: '/cs/experience',
	},
]

const semanticColors = {
	dark: {
		background: 'rgb(8, 9, 12)',
		border: 'rgb(95, 105, 117)',
		cta: 'rgb(255, 255, 255)',
		description: 'rgb(154, 166, 178)',
		eyebrow: 'rgb(34, 211, 238)',
		heading: 'rgb(255, 255, 255)',
	},
	light: {
		background: 'rgb(255, 255, 255)',
		border: 'rgb(124, 141, 153)',
		cta: 'rgb(8, 9, 12)',
		description: 'rgb(74, 89, 99)',
		eyebrow: 'rgb(10, 110, 128)',
		heading: 'rgb(8, 9, 12)',
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

async function gotoHome(page: Page, locale: LocaleExpectation, theme: HomeTheme, width = 1440) {
	await page.setViewportSize({ height: 900, width })
	await prepareHomeRender(page, theme)
	const response = await page.goto(locale.path)
	expect(response?.status()).toBe(200)
	await waitForHomeRender(page, theme)
}

function getExperience(page: Page, locale: LocaleExpectation) {
	const section = page.locator('#experience-snapshot')
	const heading = page.locator('#experience-snapshot-heading')
	return {
		cta: section.getByRole('link', { exact: true, name: locale.cta }),
		description: section.getByText(locale.description, { exact: true }),
		eyebrow: section.getByText(locale.eyebrow, { exact: true }),
		heading,
		inner: page.locator('#experience-snapshot-inner'),
		section,
	}
}

interface ExperienceLocators {
	cta: Locator
	description: Locator
	eyebrow: Locator
	heading: Locator
	inner: Locator
	section: Locator
}

async function readDesktopContract(experience: ExperienceLocators) {
	const [section, inner, eyebrow, heading, description, cta] = await Promise.all([
		experience.section.evaluate((element) => {
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
		experience.inner.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			return {
				rowGap: Number.parseFloat(styles.rowGap),
				right: rect.right,
				width: rect.width,
				x: rect.x,
			}
		}),
		experience.eyebrow.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			return {
				bottom: rect.bottom,
				color: styles.color,
				fontSize: Number.parseFloat(styles.fontSize),
				fontWeight: Number.parseFloat(styles.fontWeight),
				height: rect.height,
				letterSpacing:
					styles.letterSpacing === 'normal' ? 0 : Number.parseFloat(styles.letterSpacing),
				lineHeight: Number.parseFloat(styles.lineHeight),
				width: rect.width,
				x: rect.x,
			}
		}),
		experience.heading.evaluate((element) => {
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
		experience.description.evaluate((element) => {
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
		experience.cta.evaluate((element) => {
			const styles = getComputedStyle(element)
			const rect = element.getBoundingClientRect()
			const textLineTops: number[] = []
			const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
			for (let node = walker.nextNode(); node; node = walker.nextNode()) {
				if (!node.textContent?.trim()) continue
				const range = document.createRange()
				range.selectNodeContents(node)
				textLineTops.push(
					...Array.from(range.getClientRects(), (textRect) => Math.round(textRect.top * 100) / 100),
				)
			}

			return {
				borderColor: styles.borderTopColor,
				borderWidth: Number.parseFloat(styles.borderTopWidth),
				bottom: rect.bottom,
				clientHeight: element.clientHeight,
				clientWidth: element.clientWidth,
				color: styles.color,
				height: rect.height,
				radius: Number.parseFloat(styles.borderTopLeftRadius),
				right: rect.right,
				scrollHeight: element.scrollHeight,
				scrollWidth: element.scrollWidth,
				svgCount: element.querySelectorAll('svg').length,
				textLineCount: new Set(textLineTops).size,
				top: rect.top,
				width: rect.width,
				x: rect.x,
			}
		}),
	])

	return {
		cta,
		description,
		eyebrow,
		gaps: [
			heading.top - eyebrow.bottom,
			description.top - heading.bottom,
			cta.top - description.bottom,
		],
		heading,
		inner,
		section,
	}
}

for (const locale of locales) {
	for (const theme of ['light', 'dark'] as const) {
		test(`matches the ${theme} desktop Experience contract at ${locale.path}`, async ({ page }) => {
			await gotoHome(page, locale, theme)
			const experience = getExperience(page, locale)

			await expect(experience.section).toBeVisible()
			await expect(experience.section).toHaveAttribute(
				'aria-labelledby',
				'experience-snapshot-heading',
			)
			await expect(experience.heading).toHaveCount(1)
			await expect(
				experience.section.getByRole('heading', { exact: true, level: 2, name: locale.heading }),
			).toHaveCount(1)
			await expect(experience.eyebrow).toHaveCount(1)
			await expect(experience.description).toHaveCount(1)
			await expect(experience.cta).toHaveAttribute('href', locale.href)

			const contract = await readDesktopContract(experience)
			expectPx(contract.section.x, 0)
			expectPx(contract.section.width, contract.section.bodyClientWidth)
			expectPx(contract.inner.x - contract.section.x, 120)
			expectPx(contract.section.right - contract.inner.right, 120)
			expectPx(contract.inner.width, contract.section.width - 240)
			expect([0, 15]).toContain(
				contract.section.documentClientWidth - contract.section.bodyClientWidth,
			)
			expect(contract.section.documentScrollWidth).toBeLessThanOrEqual(
				contract.section.documentClientWidth,
			)

			expectPx(contract.section.paddingBlockStart, 104)
			expectPx(contract.section.paddingBlockEnd, 104)
			expectPx(contract.inner.rowGap, 32)
			for (const gap of contract.gaps) expectPx(gap, 32)

			expectPx(contract.eyebrow.fontSize, 12)
			expectPx(contract.eyebrow.lineHeight, 12 * 1.45)
			expect(contract.eyebrow.fontWeight).toBe(600)
			expectPx(contract.eyebrow.letterSpacing, 0)
			expectPx(contract.eyebrow.width, 600)
			expectPx(contract.eyebrow.x, contract.inner.x)

			expectPx(contract.heading.fontSize, 48)
			expectPx(contract.heading.lineHeight, 48 * 1.45)
			expect(contract.heading.fontWeight).toBe(600)
			expectPx(contract.heading.width, 850)
			expectPx(contract.heading.x, contract.inner.x)

			expectPx(contract.description.fontSize, 18)
			expectPx(contract.description.lineHeight, 18 * 1.45)
			expect(contract.description.fontWeight).toBe(400)
			expectPx(contract.description.width, 760)
			expectPx(contract.description.x, contract.inner.x)

			expectPx(contract.cta.height, 52)
			if (locale.path === '/') expectPx(contract.cta.width, 195, 3)
			else expect(contract.cta.width).toBeGreaterThan(195)
			expectPx(contract.cta.radius, 4)
			expectPx(contract.cta.borderWidth, 1)
			expectPx(contract.cta.x, contract.inner.x)
			expect(contract.cta.textLineCount).toBe(1)
			expect(contract.cta.svgCount).toBe(0)
			expect(contract.cta.right).toBeLessThanOrEqual(contract.section.documentClientWidth)
			expect(contract.cta.scrollWidth).toBeLessThanOrEqual(contract.cta.clientWidth)
			expect(contract.cta.scrollHeight).toBeLessThanOrEqual(contract.cta.clientHeight)

			const naturalSectionHeight =
				contract.section.paddingBlockStart +
				contract.eyebrow.height +
				contract.gaps[0] +
				contract.heading.height +
				contract.gaps[1] +
				contract.description.height +
				contract.gaps[2] +
				contract.cta.height +
				contract.section.paddingBlockEnd
			expectPx(contract.section.height, naturalSectionHeight)
			expectPx(
				contract.cta.bottom + contract.section.paddingBlockEnd,
				contract.section.bottom,
			)
			if (locale.path === '/') expectPx(contract.section.height, 565)
			expect(await findVisibleDescendantOverflow(page, { root: '#experience-snapshot' })).toEqual(
				[],
			)
			expect({
				background: contract.section.background,
				border: contract.cta.borderColor,
				cta: contract.cta.color,
				description: contract.description.color,
				eyebrow: contract.eyebrow.color,
				heading: contract.heading.color,
			}).toEqual(semanticColors[theme])
			expect(
				contrastRatio(contract.eyebrow.color, contract.section.background),
			).toBeGreaterThanOrEqual(4.5)
			expect(
				contrastRatio(contract.heading.color, contract.section.background),
			).toBeGreaterThanOrEqual(4.5)
			expect(
				contrastRatio(contract.description.color, contract.section.background),
			).toBeGreaterThanOrEqual(4.5)
			expect(
				contrastRatio(contract.cta.color, contract.section.background),
			).toBeGreaterThanOrEqual(4.5)
			expect(
				contrastRatio(contract.cta.borderColor, contract.section.background),
			).toBeGreaterThanOrEqual(3)

			await experience.cta.focus()
			await expect(experience.cta).toBeFocused()
			const focus = await experience.cta.evaluate((element) => {
				const styles = getComputedStyle(element)
				return {
					color: styles.outlineColor,
					style: styles.outlineStyle,
					width: Number.parseFloat(styles.outlineWidth),
				}
			})
			expect(focus.style).toBe('solid')
			expectPx(focus.width, 2)
			expect(contrastRatio(focus.color, contract.section.background)).toBeGreaterThanOrEqual(3)
		})
	}

	test(`removes Experience from compact accessibility and tab order at ${locale.path}`, async ({
		page,
	}) => {
		await gotoHome(page, locale, 'light', 1023)
		const experience = getExperience(page, locale)

		await expect(experience.section).toBeHidden()
		await expect(page.getByRole('region', { name: locale.heading })).toHaveCount(0)
		await expect(page.getByRole('link', { exact: true, name: locale.cta })).toHaveCount(0)

		const hiddenCta = page.locator('#experience-snapshot a')
		await hiddenCta.evaluate((element) => (element as HTMLElement).focus())
		const focusEnteredExperience = await page.evaluate(() =>
			Boolean(document.activeElement?.closest('#experience-snapshot')),
		)
		expect(focusEnteredExperience).toBe(false)
	})

	test(`reveals Experience at the exact desktop boundary at ${locale.path}`, async ({ page }) => {
		await gotoHome(page, locale, 'light', 1024)
		const experience = getExperience(page, locale)

		await expect(experience.section).toBeVisible()
		await expect(page.getByRole('region', { name: locale.heading })).toHaveCount(1)
		await expect(experience.cta).toHaveAttribute('href', locale.href)
		await experience.cta.focus()
		await expect(experience.cta).toBeFocused()
	})
}

test('keeps the Experience CTA focus visible in forced-colors mode', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'light', forcedColors: 'active', reducedMotion: 'reduce' })
	await page.addInitScript(() => localStorage.setItem('codeguy-theme', 'light'))
	await page.setViewportSize({ height: 900, width: 1440 })
	const response = await page.goto('/')
	expect(response?.status()).toBe(200)
	await waitForHomeRender(page, 'light')

	const cta = getExperience(page, locales[0]).cta
	await cta.focus()
	await expect(cta).toBeFocused()
	const forcedColors = await cta.evaluate((element) => {
		const styles = getComputedStyle(element)
		const section = element.closest('#experience-snapshot')
		if (!(section instanceof HTMLElement)) throw new Error('Expected the Experience section')
		return {
			paintedBackground: getComputedStyle(section).backgroundColor,
			outlineColor: styles.outlineColor,
			outlineOffset: Number.parseFloat(styles.outlineOffset),
			outlineStyle: styles.outlineStyle,
			outlineWidth: Number.parseFloat(styles.outlineWidth),
		}
	})

	expect(forcedColors.outlineStyle).toBe('solid')
	expectPx(forcedColors.outlineWidth, 2)
	expectPx(forcedColors.outlineOffset, 2)
	expect(forcedColors.outlineColor).not.toBe('rgba(0, 0, 0, 0)')
	expect(forcedColors.outlineColor).not.toBe(forcedColors.paintedBackground)
	expect(
		contrastRatio(forcedColors.outlineColor, forcedColors.paintedBackground),
	).toBeGreaterThanOrEqual(3)
})
