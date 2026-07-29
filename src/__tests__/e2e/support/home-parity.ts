import { expect, type Page } from '@playwright/test'

export const FIGMA_HOME_NODES = {
	darkDesktop: '8:246',
	darkMobile: '8:325',
	desktop: '6:2',
	mobile: '8:87',
	responsive320: '8:140',
	responsive430: '8:193',
	tablet: '7:377',
} as const

/**
 * Browser viewport contracts paired with the approved full-page Figma frames.
 * The viewport heights keep browser runs practical; Figma frame heights describe
 * the complete page and must not become fixed application heights.
 */
export const HOME_PARITY_VIEWPORTS = {
	desktop: {
		figmaNode: FIGMA_HOME_NODES.desktop,
		darkFigmaNode: FIGMA_HOME_NODES.darkDesktop,
		height: 900,
		width: 1440,
	},
	tablet: {
		figmaNode: FIGMA_HOME_NODES.tablet,
		height: 1024,
		width: 768,
	},
	responsive430: {
		figmaNode: FIGMA_HOME_NODES.responsive430,
		height: 932,
		width: 430,
	},
	mobile: {
		figmaNode: FIGMA_HOME_NODES.mobile,
		darkFigmaNode: FIGMA_HOME_NODES.darkMobile,
		height: 844,
		width: 390,
	},
	responsive320: {
		figmaNode: FIGMA_HOME_NODES.responsive320,
		height: 900,
		width: 320,
	},
} as const

export const HOME_SELECTORS = {
	experience: '#experience-snapshot',
	experienceHeading: '#experience-snapshot-heading',
	finalCta: '#contact-cta',
	finalCtaHeading: '#final-cta-heading',
	hero: 'section[aria-labelledby="hero-heading"]',
	heroHeading: '#hero-heading',
	principles: '#principles',
	principlesHeading: '#principles-heading',
	selectedWork: '#selected-work',
	selectedWorkHeading: '#selected-work-heading',
} as const

export type HomeTheme = 'dark' | 'light'

/** Assert an absolute CSS-pixel tolerance (unlike toBeCloseTo's precision argument). */
export function expectPx(actual: number, expected: number, tolerance = 0.5): void {
	const difference = Math.abs(actual - expected)
	expect(
		difference,
		`Expected ${actual}px to be within ±${tolerance}px of ${expected}px (difference: ${difference}px)`,
	).toBeLessThanOrEqual(tolerance)
}

/** Call before navigation so the first rendered frame has deterministic theme/media state. */
export async function prepareHomeRender(page: Page, theme: HomeTheme = 'light'): Promise<void> {
	await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' })
	await page.addInitScript((selectedTheme) => {
		localStorage.setItem('codeguy-theme', selectedTheme)
	}, theme)
}

/** Call after navigation before geometry or visual assertions. */
export async function waitForHomeRender(page: Page, theme: HomeTheme = 'light'): Promise<void> {
	await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
	await page.evaluate(async () => {
		await document.fonts.ready
		await new Promise<void>((resolve) => {
			requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
		})
	})
}

export interface VisibleDescendantOverflow {
	ariaLabel: string | null
	id: string | null
	left: number
	right: number
	tagName: string
	testId: string | null
	visibleLeft: number
	visibleRight: number
	width: number
}

export interface VisibleDescendantOverflowOptions {
	allowlist?: readonly string[]
	root?: string
	tolerance?: number
}

/**
 * Intentionally empty: add only a selector for a measured, design-backed exception
 * and document its Figma node in the calling test. Broad layout selectors are not
 * acceptable because they would hide regressions.
 */
export const HOME_VISIBLE_OVERFLOW_ALLOWLIST: readonly string[] = []

/**
 * Finds horizontally leaking visible descendants. Local clipping containers are
 * respected, but html/body clipping is deliberately ignored: global overflow-x
 * suppression is not evidence that Home content fits the viewport.
 */
export async function findVisibleDescendantOverflow(
	page: Page,
	options: VisibleDescendantOverflowOptions = {},
): Promise<VisibleDescendantOverflow[]> {
	const { allowlist = HOME_VISIBLE_OVERFLOW_ALLOWLIST, root = 'main', tolerance = 0.5 } = options
	const rootLocator = page.locator(root)
	await expect(rootLocator).toBeAttached()

	return rootLocator.evaluate(
		(rootElement, settings) => {
			const viewportWidth = document.documentElement.clientWidth

			return Array.from(rootElement.querySelectorAll<HTMLElement>('*')).flatMap((element) => {
				if (settings.allowlist.some((selector) => element.closest(selector))) return []

				const styles = getComputedStyle(element)
				const rect = element.getBoundingClientRect()
				if (
					styles.display === 'none' ||
					styles.visibility === 'hidden' ||
					Number.parseFloat(styles.opacity) === 0 ||
					rect.width === 0 ||
					rect.height === 0
				) {
					return []
				}

				let visibleLeft = rect.left
				let visibleRight = rect.right
				for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
					if (ancestor === document.body || ancestor === document.documentElement) continue
					const overflowX = getComputedStyle(ancestor).overflowX
					if (['auto', 'clip', 'hidden', 'scroll'].includes(overflowX)) {
						const ancestorRect = ancestor.getBoundingClientRect()
						visibleLeft = Math.max(visibleLeft, ancestorRect.left)
						visibleRight = Math.min(visibleRight, ancestorRect.right)
					}
				}

				if (
					visibleRight <= visibleLeft ||
					(visibleLeft >= -settings.tolerance && visibleRight <= viewportWidth + settings.tolerance)
				) {
					return []
				}

				return [
					{
						ariaLabel: element.getAttribute('aria-label'),
						id: element.id || null,
						left: rect.left,
						right: rect.right,
						tagName: element.tagName.toLowerCase(),
						testId: element.getAttribute('data-testid'),
						visibleLeft,
						visibleRight,
						width: rect.width,
					},
				]
			})
		},
		{ allowlist: [...allowlist], tolerance },
	)
}
