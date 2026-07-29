import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test, type Page } from '@playwright/test'

const minimumTextContrast = 4.5

const variablesCssPath = path.resolve(process.cwd(), 'src/app/(frontend)/styles/variables.css')
const articleCssPath = path.resolve(process.cwd(), 'src/components/article/Article.module.css')

const [variablesCss, articleCss] = await Promise.all([
	readFile(variablesCssPath, 'utf8'),
	readFile(articleCssPath, 'utf8'),
])

const expectedThemeColors = {
	dark: {
		primaryHover: 'rgb(103, 232, 249)',
		secondaryHover: 'rgb(12, 45, 56)',
	},
	light: {
		primaryHover: 'rgb(8, 90, 106)',
		secondaryHover: 'rgb(241, 244, 248)',
	},
} as const

type Rgb = {
	blue: number
	green: number
	red: number
}

function parseRgb(color: string): Rgb {
	const channels = color
		.match(/[\d.]+/g)
		?.slice(0, 3)
		.map(Number)
	if (!channels || channels.length !== 3) {
		throw new Error(`Expected a computed RGB color, received "${color}"`)
	}

	return {
		blue: channels[2],
		green: channels[1],
		red: channels[0],
	}
}

function relativeLuminance({ blue, green, red }: Rgb) {
	const linearize = (channel: number) => {
		const value = channel / 255
		return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
	}

	return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue)
}

function contrastRatio(foreground: string, background: string) {
	const foregroundLuminance = relativeLuminance(parseRgb(foreground))
	const backgroundLuminance = relativeLuminance(parseRgb(background))
	const lighter = Math.max(foregroundLuminance, backgroundLuminance)
	const darker = Math.min(foregroundLuminance, backgroundLuminance)

	return (lighter + 0.05) / (darker + 0.05)
}

async function renderShareActionHarness(page: Page, theme: 'dark' | 'light') {
	await page.setContent(`
		<!doctype html>
		<html data-theme="${theme}">
			<body>
				<button id="primary" class="action" type="button">Share</button>
				<button id="secondary" class="action actionSecondary" type="button">LinkedIn</button>
				<button id="state-action" class="stateAction" type="button">Try again</button>
			</body>
		</html>
	`)
	await page.addStyleTag({ content: variablesCss })
	await page.addStyleTag({
		content:
			'* { transition-duration: 0s !important; } body { margin: 0; padding: 24px; background: var(--surface-page); }',
	})
	await page.addStyleTag({ content: articleCss })
}

async function computedColors(page: Page, selector: string) {
	return page.locator(selector).evaluate((element) => {
		const styles = getComputedStyle(element)
		return {
			background: styles.backgroundColor,
			foreground: styles.color,
		}
	})
}

test.describe('ShareBar action contrast harness', () => {
	test('keeps primary default and hover text contrast at or above 4.5 in light and dark themes', async ({
		page,
	}) => {
		for (const theme of ['light', 'dark'] as const) {
			await renderShareActionHarness(page, theme)
			const primary = page.locator('#primary')

			const defaultColors = await computedColors(page, '#primary')
			expect(
				contrastRatio(defaultColors.foreground, defaultColors.background),
				`${theme} primary default contrast`,
			).toBeGreaterThanOrEqual(minimumTextContrast)

			await primary.hover()
			const hoverColors = await computedColors(page, '#primary')
			expect(hoverColors.background).toBe(expectedThemeColors[theme].primaryHover)
			expect(
				contrastRatio(hoverColors.foreground, hoverColors.background),
				`${theme} primary hover contrast`,
			).toBeGreaterThanOrEqual(minimumTextContrast)
		}
	})

	test('keeps secondary hover text contrast at or above 4.5 in the light theme', async ({
		page,
	}) => {
		await renderShareActionHarness(page, 'light')

		const defaultColors = await computedColors(page, '#secondary')
		expect(
			contrastRatio(defaultColors.foreground, defaultColors.background),
			'light secondary default contrast',
		).toBeGreaterThanOrEqual(minimumTextContrast)

		await page.locator('#secondary').hover()

		const colors = await computedColors(page, '#secondary')
		expect(colors.background).toBe(expectedThemeColors.light.secondaryHover)
		expect(
			contrastRatio(colors.foreground, colors.background),
			'light secondary hover contrast',
		).toBeGreaterThanOrEqual(minimumTextContrast)
	})

	test('keeps secondary hover text contrast at or above 4.5 in the dark theme', async ({
		page,
	}) => {
		await renderShareActionHarness(page, 'dark')

		const defaultColors = await computedColors(page, '#secondary')
		expect(
			contrastRatio(defaultColors.foreground, defaultColors.background),
			`dark secondary default contrast: ${JSON.stringify(defaultColors)}`,
		).toBeGreaterThanOrEqual(minimumTextContrast)

		await page.locator('#secondary').hover()

		const colors = await computedColors(page, '#secondary')
		expect(colors.background).toBe(expectedThemeColors.dark.secondaryHover)
		expect(
			contrastRatio(colors.foreground, colors.background),
			'dark secondary hover contrast',
		).toBeGreaterThanOrEqual(minimumTextContrast)
	})

	test('preserves the 44px target, primary state-action hover and visible keyboard focus', async ({
		page,
	}) => {
		await renderShareActionHarness(page, 'light')

		const targetSizes = await page.locator('button').evaluateAll((buttons) =>
			buttons.map((button) => ({
				height: button.getBoundingClientRect().height,
				width: button.getBoundingClientRect().width,
			})),
		)
		expect(targetSizes.every(({ height, width }) => height >= 44 && width >= 44)).toBe(true)

		const stateAction = page.locator('#state-action')
		await stateAction.hover()
		const stateHover = await computedColors(page, '#state-action')
		expect(stateHover.background).toBe('rgb(8, 90, 106)')

		await page.mouse.move(0, 0)
		await page.keyboard.press('Tab')
		await expect(page.locator('#primary')).toBeFocused()

		const focus = await page.locator('#primary').evaluate((element) => {
			const styles = getComputedStyle(element)
			return {
				color: styles.outlineColor,
				style: styles.outlineStyle,
				width: styles.outlineWidth,
			}
		})
		expect(focus).toMatchObject({ style: 'solid', width: '3px' })
		expect(focus.color).not.toBe('rgba(0, 0, 0, 0)')
	})

	test('keeps focused controls distinct in forced colors', async ({ page }) => {
		await page.emulateMedia({ forcedColors: 'active' })
		await renderShareActionHarness(page, 'light')
		await page.keyboard.press('Tab')
		await expect(page.locator('#primary')).toBeFocused()

		const forcedColors = await page.locator('#primary').evaluate((element) => {
			const styles = getComputedStyle(element)
			return {
				background: styles.backgroundColor,
				focusColor: styles.outlineColor,
				focusStyle: styles.outlineStyle,
				focusWidth: styles.outlineWidth,
				foreground: styles.color,
			}
		})

		expect(forcedColors.foreground).not.toBe(forcedColors.background)
		expect(forcedColors.focusStyle).toBe('solid')
		expect(forcedColors.focusWidth).toBe('3px')
		expect(forcedColors.focusColor).not.toBe(forcedColors.background)
	})
})
