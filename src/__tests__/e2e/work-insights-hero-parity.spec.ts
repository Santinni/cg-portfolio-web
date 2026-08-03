import { expect, test } from '@playwright/test'

/**
 * Figma `Desktop / Work` (7:2) and `Desktop / Insights` (74:264) both compose a
 * light page: the header band sits above the content and the intro/hero uses the
 * page surface with `--text-primary` copy. The implementation previously painted
 * both heroes with `--surface-contrast`, which put a dark band directly under the
 * fixed navigation and destroyed the light-theme nav contrast.
 */

const relativeLuminance = (color: string) => {
	const parts = color.match(/\d+(\.\d+)?/g)
	if (!parts) throw new Error(`Unparseable color: ${color}`)
	const [r, g, b] = parts.slice(0, 3).map((value) => {
		const channel = Number(value) / 255
		return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
	})
	return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const contrastRatio = (foreground: string, background: string) => {
	const a = relativeLuminance(foreground)
	const b = relativeLuminance(background)
	const [lighter, darker] = a > b ? [a, b] : [b, a]
	return (lighter + 0.05) / (darker + 0.05)
}

const heroRoutes = [
	{ route: '/work', node: '7:11' },
	{ route: '/cs/work', node: '7:11' },
	{ route: '/insights', node: '74:286' },
	{ route: '/cs/insights', node: '74:286' },
] as const

const readTokens = () => {
	// Tokens are authored as hex; computed styles resolve to `rgb()`. Resolve the
	// token through the engine so both sides of the comparison use one notation.
	const resolveToken = (token: string) => {
		const probe = document.createElement('span')
		probe.style.color = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
		document.body.append(probe)
		const resolved = getComputedStyle(probe).color
		probe.remove()
		return resolved
	}

	const hero = document.querySelector('main header')
	const title = document.querySelector('main header h1')
	if (!hero || !title) {
		// Without this the missing element surfaces as an opaque getComputedStyle
		// TypeError that reads like a browser fault rather than an absent hero.
		throw new Error(
			`Hero not rendered: main header=${hero !== null}, main header h1=${title !== null}`,
		)
	}

	return {
		heroBackground: getComputedStyle(hero).backgroundColor,
		titleColor: getComputedStyle(title).color,
		surfacePage: resolveToken('--surface-page'),
		textPrimary: resolveToken('--text-primary'),
	} as const
}

test.describe('Work and Insights hero parity', () => {
	for (const theme of ['light', 'dark'] as const) {
		for (const { route, node } of heroRoutes) {
			test(`${route} renders the ${node} page surface in ${theme}`, async ({ page }) => {
				await page.emulateMedia({ colorScheme: theme })
				await page.addInitScript((value) => {
					localStorage.setItem('codeguy-theme', value)
				}, theme)

				const response = await page.goto(route)
				expect(response?.status()).toBe(200)
				// `/insights` renders from the CMS, so on a cold database the hero can
				// still be streaming when the navigation promise resolves. Wait for the
				// element the contract is about instead of racing it.
				await expect(page.locator('main header h1')).toBeVisible()
				await page.evaluate(async (value) => {
					document.documentElement.dataset.theme = value
					await document.fonts.ready
				}, theme)

				const tokens = await page.evaluate(readTokens)

				// The hero must sit on the page surface, never on `--surface-contrast`.
				expect(tokens.heroBackground).toBe(tokens.surfacePage)
				expect(tokens.titleColor).toBe(tokens.textPrimary)
			})
		}
	}

	for (const theme of ['light', 'dark'] as const) {
		for (const { route } of heroRoutes) {
			test(`${route} keeps the navigation legible over its hero in ${theme}`, async ({ page }) => {
				await page.addInitScript((value) => {
					localStorage.setItem('codeguy-theme', value)
				}, theme)
				await page.goto(route)
				await page.evaluate(async (value) => {
					document.documentElement.dataset.theme = value
					await document.fonts.ready
				}, theme)

				const sample = await page.evaluate(() => {
					const nav = document.querySelector('nav')!
					const navRect = nav.getBoundingClientRect()
					const previousPointerEvents = nav.style.pointerEvents
					nav.style.pointerEvents = 'none'
					const beneath = document.elementFromPoint(window.innerWidth / 2, navRect.height / 2)
					nav.style.pointerEvents = previousPointerEvents

					let element: Element | null = beneath
					let background = 'rgba(0, 0, 0, 0)'
					while (element && element !== document.documentElement) {
						const candidate = getComputedStyle(element).backgroundColor
						if (candidate && candidate !== 'rgba(0, 0, 0, 0)' && candidate !== 'transparent') {
							background = candidate
							break
						}
						element = element.parentElement
					}

					return {
						background,
						linkColor: getComputedStyle(nav.querySelector('a')!).color,
					}
				})

				// Whatever ends up behind the fixed navigation must stay readable even if
				// the navigation itself paints no background of its own.
				expect(contrastRatio(sample.linkColor, sample.background)).toBeGreaterThanOrEqual(4.5)
			})
		}
	}
})
